import { Test, TestingModule } from '@nestjs/testing';
import { MembershipController } from './membership.controller';
import { MembershipService } from '../services';
import { CreateMembershipRequestDto } from '../dtos';
import { BillingInterval } from '../enums/billing-interval.enum';

describe('MembershipController', () => {
  let controller: MembershipController;
  let service: MembershipService;

  const expectedMemberships = [
    { id: 1, name: 'Gold Plan' },
    { id: 2, name: 'Platinum Plan' },
  ];

  const expectedCreatedMembership = { id: 3, name: 'Platinum Plan' };

  const mockMembershipService = {
    findAll: jest.fn().mockResolvedValue(expectedMemberships),
    create: jest.fn().mockResolvedValue(expectedCreatedMembership),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MembershipController],
      providers: [
        {
          provide: MembershipService,
          useValue: mockMembershipService,
        },
      ],
    }).compile();

    controller = module.get<MembershipController>(MembershipController);
    service = module.get<MembershipService>(MembershipService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getMemberships', () => {
    it('should call findAll in membership service', async () => {
      const result = await controller.getMemberships();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('getMembershipsV1', () => {
    it('should call findAll in membership service', async () => {
      const result = await controller.getMembershipsV1();
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw if service throws', async () => {
      service.findAll = jest.fn().mockRejectedValue(new Error('fail'));
      await expect(controller.getMembershipsV1()).rejects.toThrow('fail');
    });
  });

  describe('createMembership', () => {
    it('should call create in membership service and pass dto with current user Id', async () => {
      const dto: CreateMembershipRequestDto = {
        name: 'Platinum Plan',
        recurringPrice: 100,
        billingInterval: BillingInterval.Monthly,
        billingPeriods: 12,
      };
      const result = await controller.createMembership(dto);
      expect(service.create).toHaveBeenCalledWith(2000, dto);
      expect(result).toBeDefined();
    });
  });

  describe('createMembershipV1', () => {
    it('should call create in membership service and pass dto with current user Id', async () => {
      const dto: CreateMembershipRequestDto = {
        name: 'Platinum Plan',
        recurringPrice: 100,
        billingInterval: BillingInterval.Monthly,
        billingPeriods: 12,
      };
      const result = await controller.createMembershipV1(dto);
      expect(service.create).toHaveBeenCalledWith(2000, dto);
      expect(result).toBeDefined();
    });
  });
});
