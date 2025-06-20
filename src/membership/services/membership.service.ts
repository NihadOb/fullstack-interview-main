import { BadRequestException, Injectable } from '@nestjs/common';
import { Membership } from '../entities/membership.interface';
import { MembershipRepository } from '../repositories/membership.repository';
import { v4 as uuidv4 } from 'uuid';
import { MembershipPeriodRepository } from '../repositories/membership-period.repository';
import { MembershipPeriod } from '../entities/membership-period.interface';
import { MembershipHelperService } from './membership-helper.service';
import { CustomLoggerService } from '@app/core/logger/custom-logger.service';
import { MembershipPeriodState } from '../enums/membership-period-state.enum';
import { CreateMembershipRequestDto } from '../dtos';
import { MembershipTypeRepository } from '../repositories/membership-type.repository';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { MEMBERSHIP_EXPORT_QUEUE_V1 } from '@app/core/constants/queues';
import { UserService } from '@app/user/services/user.service';
import { MembershipExportData } from '@app/membership/processors/export-membership/membership-export.processor';
import { JobStatusService } from '@app/core/jobs/services/job-status.service';

export interface CreateMembershipResult {
  membership: Membership;
  membershipPeriods: MembershipPeriod[];
}

export interface FindAllResultItem {
  membership: Membership;
  periods: MembershipPeriod[];
}

@Injectable()
export class MembershipService {
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly membershipPeriodRepository: MembershipPeriodRepository,
    private readonly membershipTypeRepository: MembershipTypeRepository,
    private readonly membershipHelperService: MembershipHelperService,
    private readonly logger: CustomLoggerService,
    private readonly userService: UserService,
    private readonly jobStatusService: JobStatusService,
    @InjectQueue(MEMBERSHIP_EXPORT_QUEUE_V1)
    private readonly membershipExportQueue: Queue,
  ) {}

  /**
   * Get all Memberships with their periods.
   * @returns All Memberships
   */
  async findAll(): Promise<FindAllResultItem[]> {
    this.logger.log('Fetching all Memberships.');
    const memberships = await this.membershipRepository.findAll();
    const membershipIds = memberships.map((membership) => membership.id);
    const allMembershipPeriods =
      await this.membershipPeriodRepository.findAllByMembershipIds(
        membershipIds,
      );

    const response: FindAllResultItem[] = [];
    for (const membership of memberships) {
      const periods = allMembershipPeriods.filter(
        (period) => period.membership === membership.id,
      );

      response.push({
        membership,
        periods,
      });
    }
    return response;
  }

  /**
   * Create new Membership and its periods.
   * @param currentUserId Current User Id
   * @param membership Membership object to be created
   * @returns new Membership object
   */
  async create(
    currentUserId: number,
    membership: CreateMembershipRequestDto,
  ): Promise<CreateMembershipResult> {
    try {
      this.logger.log('Creating a new Membership.');
      const newMembershipToInsert = this.buildMembership(
        currentUserId,
        membership,
      );
      const newMembershipPeriodsToInsert = this.buildMembershipPeriods(
        newMembershipToInsert,
      );

      //Todo: Wrap in transaction
      const savedMembership = await this.membershipRepository.create(
        newMembershipToInsert,
      );
      newMembershipPeriodsToInsert.forEach(
        (_) => (_.membership = savedMembership.id),
      );
      const savedMembershipPeriods =
        await this.membershipPeriodRepository.createMany(
          newMembershipPeriodsToInsert,
        );
      return {
        membership: savedMembership,
        membershipPeriods: savedMembershipPeriods,
      };
    } catch (error) {
      this.logger.error('Error creating new Membership:', error, membership);
      throw error;
    }
  }

  /**
   *  Creates a new membership object with calculated fields.
   */
  protected buildMembership(
    currentUserId: number,
    createMembership: CreateMembershipRequestDto,
  ): Membership {
    const validFrom = createMembership.validFrom
      ? new Date(createMembership.validFrom)
      : new Date();
    const validUntil =
      this.membershipHelperService.calculateValidUntilForMembership(
        validFrom,
        createMembership.billingInterval,
        createMembership.billingPeriods,
      );
    const state = this.membershipHelperService.calculateMembershipState(
      validFrom,
      validUntil,
    );
    const newMembership: Membership = {
      id: -1,
      uuid: uuidv4(),
      ...createMembership,
      validFrom: validFrom,
      validUntil: validUntil,
      user: currentUserId,
      state,
    };

    return newMembership;
  }

  /**
   * Creates a membership periods for the new membership.
   * @returns array of MembershipPeriod objects
   */
  protected buildMembershipPeriods(
    newMembership: Membership,
  ): MembershipPeriod[] {
    const membershipPeriods: MembershipPeriod[] = [];
    let periodStart = newMembership.validFrom;
    for (let i = 0; i < newMembership.billingPeriods; i++) {
      const validFrom = periodStart;
      const validUntil =
        this.membershipHelperService.calculateValidUntilForMembershipPeriod(
          validFrom,
          newMembership.billingInterval,
        );
      const period: MembershipPeriod = {
        id: i + 1,
        uuid: uuidv4(),
        membership: newMembership.id,
        start: validFrom,
        end: validUntil,
        state: MembershipPeriodState.Planned,
      };
      membershipPeriods.push(period);
      periodStart = validUntil;
    }
    return membershipPeriods;
  }

  /**
   * Export Job Id
   * @param userId User Id
   * @returns
   */
  async export(userId: number): Promise<string> {
    const userResponse = await this.userService.getUserById(userId);
    if (!userResponse) throw new BadRequestException('Invalid user id');
    //Todo Run in transaction
    const dbJob = await this.jobStatusService.create({
      userId,
      state: 'pending',
    });
    const data: MembershipExportData = {
      dbJobId: dbJob.id,
      userId: userId,
      email: userResponse.user.email,
      ver: 1,
    };
    const job = await this.membershipExportQueue.add(data);

    //Todo add jobId and state into db so we can query state if needed, set state to Pending
    console.log('Export Job added', job.id);
    return dbJob.uuid;
  }

  /**
   * Validate membership type name
   * @param membershipType Membership type to validate
   */
  async isValidMembershipType(membershipTypeName: string): Promise<boolean> {
    //Todo move to separate service
    return (
      (await this.membershipTypeRepository.findAll()).find(
        (_) => _.name === membershipTypeName,
      ) != null
    );
  }
}
