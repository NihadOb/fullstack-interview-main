import { MembershipTypeRepository } from './membership-type.repository';
import { DataProvider } from '@app/core/database/data-provider.interface';
import { MembershipType } from '../entities/membership-type.interface';

describe('MembershipTypeRepository', () => {
  let repo: MembershipTypeRepository;
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

    repo = new MembershipTypeRepository(mockProvider);
  });

  it('should be defined', () => {
    expect(repo).toBeDefined();
  });

  it('should call BaseRepository.findAll with "membershipTypes"', async () => {
    mockProvider.findAll.mockResolvedValue([{ id: 1 }]);
    const result = await repo.findAll();
    expect(mockProvider.findAll).toHaveBeenCalledWith('membershipTypes');
    expect(result).toEqual([{ id: 1 }]);
  });

  it('should call BaseRepository.findById with "membershipTypes" and id', async () => {
    mockProvider.findById.mockResolvedValue({ id: 2 });
    const result = await repo.findById(2);
    expect(mockProvider.findById).toHaveBeenCalledWith('membershipTypes', 2);
    expect(result).toEqual({ id: 2 });
  });

  it('should call BaseRepository.create with "membershipTypes" and data', async () => {
    const dto = { name: 'Type 1', uuid: 'abc' } as any;
    mockProvider.create.mockResolvedValue({ id: 3, ...dto });
    const result = await repo.create(dto);
    expect(mockProvider.create).toHaveBeenCalledWith('membershipTypes', dto);
    expect(result).toEqual({ id: 3, ...dto });
  });
});
