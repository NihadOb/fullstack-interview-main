import { Injectable } from '@nestjs/common';
import { Membership } from '../entities/membership.interface';
import { MembershipRepository } from '../repositories/membership.repository';
import { v4 as uuidv4 } from 'uuid';
import { MembershipPeriodRepository } from '../repositories/membership-period.repository';
import { MembershipPeriod } from '../entities/membership-period.interface';
import { MembershipHelperService } from './membership-helper.service';
import { CustomLoggerService } from 'src/core/logger/custom-logger.service';
import { MembershipPeriodState } from '../types/membership-period-state.enum';

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
  private userId = 2000;
  constructor(
    private readonly membershipRepository: MembershipRepository,
    private readonly membershipPeriodRepository: MembershipPeriodRepository,
    private readonly membershipHelperService: MembershipHelperService,
    private readonly logger: CustomLoggerService,
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
   * @param membership Membership object to be created
   * @returns new Membership object
   */
  async create(membership: Membership): Promise<CreateMembershipResult> {
    try {
      this.logger.log('Creating a new Membership.');
      const newMembership = this.buildMembership(membership);
      const newMembershipPeriods = this.buildMembershipPeriods(newMembership);

      //Todo: Wrap in transaction
      await this.membershipRepository.create(newMembership);
      await this.membershipPeriodRepository.createMany(newMembershipPeriods);
      return {
        membership: newMembership,
        membershipPeriods: newMembershipPeriods,
      };
    } catch (error) {
      this.logger.error('Error creating new Membership:', error, membership);
      throw error;
    }
  }

  /**
   *  Creates a new membership object with calculated fields.
   */
  protected buildMembership(newMembership: Membership) {
    const validFrom = newMembership.validFrom
      ? new Date(newMembership.validFrom)
      : new Date();
    const validUntil =
      this.membershipHelperService.calculateValidUntilForMembership(
        validFrom,
        newMembership.billingInterval,
        newMembership.billingPeriods,
      );

    newMembership.state = this.membershipHelperService.calculateMembershipState(
      validFrom,
      validUntil,
    );
    newMembership.validFrom = validFrom;
    newMembership.validUntil = validUntil;
    newMembership.user = this.userId;
    newMembership.uuid = uuidv4();
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
}
