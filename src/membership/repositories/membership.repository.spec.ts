import { MembershipRepository } from './membership.repository';
import { DataProvider } from '@app/core/database/data-provider.interface';
import { Membership } from '../entities/membership.interface';

describe('MembershipRepository', () => {
  let repo: MembershipRepository;
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

    repo = new MembershipRepository(mockProvider);
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  it('should call BaseRepository.findAll with "memberships"', async () => {
    mockProvider.findAll.mockResolvedValue([{ id: 1 }]);
    const result = await repo.findAll();
    expect(mockProvider.findAll).toHaveBeenCalledWith('memberships');
    expect(result).toEqual([{ id: 1 }]);
  });

  it('should call BaseRepository.findById with "memberships" and id', async () => {
    mockProvider.findById.mockResolvedValue({ id: 2 });
    const result = await repo.findById(2);
    expect(mockProvider.findById).toHaveBeenCalledWith('memberships', 2);
    expect(result).toEqual({ id: 2 });
  });

  it('should call BaseRepository.create with "memberships" and data', async () => {
    const dto = { name: 'Gold', uuid: 'abc' } as any;
    mockProvider.create.mockResolvedValue({ id: 3, ...dto });
    const result = await repo.create(dto);
    expect(mockProvider.create).toHaveBeenCalledWith('memberships', dto);
    expect(result).toEqual({ id: 3, ...dto });
  });
});
