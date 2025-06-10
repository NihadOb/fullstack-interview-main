import { MembershipService } from './membership.service';
import { MembershipRepository } from '../repositories/membership.repository';
import { MembershipPeriodRepository } from '../repositories/membership-period.repository';
import { MembershipTypeRepository } from '../repositories/membership-type.repository';
import { MembershipHelperService } from './membership-helper.service';
import { CustomLoggerService } from '@app/core/logger/custom-logger.service';
import { CreateMembershipRequestDto } from '../dtos';
import { MembershipPeriodState } from '../enums/membership-period-state.enum';
import { MembershipState } from '../enums/membership-state.enum';
import { BadRequestException } from '@nestjs/common';

jest.mock('uuid', () => ({ v4: () => 'mock-uuid' }));

describe('MembershipService', () => {
  let service: MembershipService;
  let membershipRepository: jest.Mocked<MembershipRepository>;
  let membershipPeriodRepository: jest.Mocked<MembershipPeriodRepository>;
  let membershipTypeRepository: jest.Mocked<MembershipTypeRepository>;
  let helper: jest.Mocked<MembershipHelperService>;
  let logger: jest.Mocked<CustomLoggerService>;
  let userService: any;
  let jobStatusService: any;
  let membershipExportQueue: any;

  beforeEach(() => {
    membershipRepository = {
      findAll: jest.fn(),
      create: jest.fn(),
    } as any;

    membershipPeriodRepository = {
      findAllByMembershipIds: jest.fn(),
      createMany: jest.fn(),
    } as any;

    membershipTypeRepository = {
      findAll: jest.fn(),
    } as any;

    helper = {
      calculateValidUntilForMembership: jest.fn(),
      calculateMembershipState: jest.fn(),
      calculateValidUntilForMembershipPeriod: jest.fn(),
    } as any;

    logger = {
      log: jest.fn(),
      error: jest.fn(),
    } as any;

    userService = {
      getUserById: jest.fn(),
    };

    jobStatusService = {
      create: jest.fn(),
    };

    membershipExportQueue = {
      add: jest.fn(),
    };

    service = new MembershipService(
      membershipRepository,
      membershipPeriodRepository,
      membershipTypeRepository,
      helper,
      logger,
      userService,
      jobStatusService,
      membershipExportQueue,
    );
  });

  describe('findAll', () => {
    it('should fetch memberships and their periods', async () => {
      const memberships = [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ] as any;
      const periods = [
        { id: 10, membership: 1 },
        { id: 11, membership: 2 },
        { id: 12, membership: 1 },
      ] as any;

      membershipRepository.findAll.mockResolvedValue(memberships);
      membershipPeriodRepository.findAllByMembershipIds.mockResolvedValue(
        periods,
      );

      const result = await service.findAll();

      expect(membershipRepository.findAll).toHaveBeenCalled();
      expect(
        membershipPeriodRepository.findAllByMembershipIds,
      ).toHaveBeenCalledWith([1, 2]);
      expect(result).toEqual([
        {
          membership: memberships[0],
          periods: [periods[0], periods[2]],
        },
        {
          membership: memberships[1],
          periods: [periods[1]],
        },
      ]);
    });
  });

  describe('create', () => {
    it('should create membership and periods', async () => {
      const dto: CreateMembershipRequestDto = {
        name: 'Gold',
        recurringPrice: 10,
        billingInterval: 'monthly',
        billingPeriods: 2,
      } as any;

      // Mock helper methods
      helper.calculateValidUntilForMembership.mockReturnValue(
        new Date('2024-02-01'),
      );
      helper.calculateMembershipState.mockReturnValue(MembershipState.Active);
      helper.calculateValidUntilForMembershipPeriod
        .mockReturnValueOnce(new Date('2024-01-15'))
        .mockReturnValueOnce(new Date('2024-02-15'));

      // Mock repo methods
      membershipRepository.create.mockResolvedValue({ id: 100, ...dto } as any);
      membershipPeriodRepository.createMany.mockResolvedValue([
        { id: 1, membership: 100 },
        { id: 2, membership: 100 },
      ] as any);

      const result = await service.create(2000, dto);

      expect(membershipRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Gold',
          user: 2000,
          state: MembershipState.Active,
        }),
      );
      expect(membershipPeriodRepository.createMany).toHaveBeenCalled();
      expect(result).toEqual({
        membership: { id: 100, ...dto },
        membershipPeriods: [
          { id: 1, membership: 100 },
          { id: 2, membership: 100 },
        ],
      });
    });

    it('should log and rethrow on error', async () => {
      const dto = {} as any;
      membershipRepository.create.mockRejectedValue(new Error('fail'));
      await expect(service.create(1, dto)).rejects.toThrow('fail');
      expect(logger.error).toHaveBeenCalled();
    });
  });

  describe('buildMembership', () => {
    it('should build membership with calculated fields', () => {
      const dto: CreateMembershipRequestDto = {
        name: 'Gold',
        recurringPrice: 10,
        billingInterval: 'monthly',
        billingPeriods: 2,
        validFrom: '2024-01-01',
      } as any;

      helper.calculateValidUntilForMembership.mockReturnValue(
        new Date('2024-02-01'),
      );
      helper.calculateMembershipState.mockReturnValue(MembershipState.Active);

      // @ts-ignore
      const result = service.buildMembership(42, dto);

      expect(result).toMatchObject({
        name: 'Gold',
        user: 42,
        state: MembershipState.Active,
        validFrom: new Date('2024-01-01'),
        validUntil: new Date('2024-02-01'),
        uuid: 'mock-uuid',
      });
    });
  });

  describe('buildMembershipPeriods', () => {
    it('should build correct number of periods', () => {
      const membership = {
        id: 1,
        validFrom: new Date('2024-01-01'),
        billingPeriods: 2,
        billingInterval: 'monthly',
      } as any;

      helper.calculateValidUntilForMembershipPeriod
        .mockReturnValueOnce(new Date('2024-02-01'))
        .mockReturnValueOnce(new Date('2024-03-01'));

      // @ts-ignore
      const result = service.buildMembershipPeriods(membership);

      expect(result.length).toBe(2);
      expect(result[0]).toMatchObject({
        membership: 1,
        start: new Date('2024-01-01'),
        end: new Date('2024-02-01'),
        state: MembershipPeriodState.Planned,
        uuid: 'mock-uuid',
      });
      expect(result[1].start).toEqual(new Date('2024-02-01'));
      expect(result[1].end).toEqual(new Date('2024-03-01'));
    });
  });

  describe('isValidMembershipType', () => {
    it('should return true if type exists', async () => {
      membershipTypeRepository.findAll.mockResolvedValue([
        { name: 'Gold' } as any,
        { name: 'Silver' } as any,
      ]);
      const result = await service.isValidMembershipType('Gold');
      expect(result).toBe(true);
    });

    it('should return false if type does not exist', async () => {
      membershipTypeRepository.findAll.mockResolvedValue([
        { name: 'Silver' } as any,
      ]);
      const result = await service.isValidMembershipType('Gold');
      expect(result).toBe(false);
    });
  });

  describe('export', () => {
    it('should throw BadRequestException if user not found', async () => {
      userService.getUserById.mockResolvedValue(null);
      await expect(service.export(123)).rejects.toThrow(BadRequestException);
    });

    it('should create job and add to queue, returning dbJob.uuid', async () => {
      userService.getUserById.mockResolvedValue({
        user: { email: 'test@mail.com' },
      });
      jobStatusService.create.mockResolvedValue({ id: 1, uuid: 'job-uuid' });
      membershipExportQueue.add.mockResolvedValue({ id: 99 });

      const result = await service.export(123);

      expect(userService.getUserById).toHaveBeenCalledWith(123);
      expect(jobStatusService.create).toHaveBeenCalledWith({
        userId: 123,
        state: 'pending',
      });
      expect(membershipExportQueue.add).toHaveBeenCalledWith({
        dbJobId: 1,
        userId: 123,
        email: 'test@mail.com',
        ver: 1,
      });
      expect(result).toBe('job-uuid');
    });
  });
});
