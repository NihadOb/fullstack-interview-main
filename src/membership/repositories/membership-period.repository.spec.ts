import { MembershipPeriodRepository } from './membership-period.repository';
import { DataProvider } from '@app/core/database/data-provider.interface';
import { MembershipPeriod } from '../entities/membership-period.interface';

describe('MembershipPeriodRepository', () => {
  let repo: MembershipPeriodRepository;
  let mockProvider: jest.Mocked<DataProvider>;

  beforeEach(() => {
    mockProvider = {
      findAll: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    repo = new MembershipPeriodRepository(mockProvider);
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  it('should call BaseRepository.findAll with "membershipPeriods"', async () => {
    mockProvider.findAll.mockResolvedValue([{ id: 1 }]);
    const result = await repo.findAll();
    expect(mockProvider.findAll).toHaveBeenCalledWith('membershipPeriods');
    expect(result).toEqual([{ id: 1 }]);
  });

  it('should call BaseRepository.findById with "membershipPeriods" and id', async () => {
    mockProvider.findById.mockResolvedValue({ id: 2 });
    const result = await repo.findById(2);
    expect(mockProvider.findById).toHaveBeenCalledWith('membershipPeriods', 2);
    expect(result).toEqual({ id: 2 });
  });

  it('should call BaseRepository.create with "membershipPeriods" and data', async () => {
    const dto = { name: 'Period 1', uuid: 'abc' } as any;
    mockProvider.create.mockResolvedValue({ id: 3, ...dto });
    const result = await repo.create(dto);
    expect(mockProvider.create).toHaveBeenCalledWith('membershipPeriods', dto);
    expect(result).toEqual({ id: 3, ...dto });
  });

  describe('findAllByMembershipIds', () => {
    it('should return periods matching given membership IDs', async () => {
      const periods: MembershipPeriod[] = [
        { id: 1, uuid: 'a', membership: 10 } as any,
        { id: 2, uuid: 'b', membership: 20 } as any,
        { id: 3, uuid: 'c', membership: 30 } as any,
      ];
      jest.spyOn(repo, 'findAll').mockResolvedValue(periods);

      const result = await repo.findAllByMembershipIds([10, 30]);
      expect(result).toEqual([
        { id: 1, uuid: 'a', membership: 10 },
        { id: 3, uuid: 'c', membership: 30 },
      ]);
    });

    it('should return empty array if no matches', async () => {
      const periods: MembershipPeriod[] = [
        { id: 1, uuid: 'a', membership: 10 } as any,
      ];
      jest.spyOn(repo, 'findAll').mockResolvedValue(periods);

      const result = await repo.findAllByMembershipIds([99]);
      expect(result).toEqual([]);
    });
  });
});
