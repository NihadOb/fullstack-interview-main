import { BaseRepository } from './base.repository';
import { DataProvider } from './data-provider.interface';

interface TestEntity {
  id: number;
  uuid: string;
  name: string;
}

class TestRepository extends BaseRepository<TestEntity> {
  constructor(storageAdapter: DataProvider) {
    super('testEntity', storageAdapter);
  }
}

describe('BaseRepository', () => {
  let repo: TestRepository;
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

    repo = new TestRepository(mockProvider);
  });

  it('should throw if entityName is missing', () => {
    expect(() => {
      // @ts-ignore
      new BaseRepository(undefined, mockProvider);
    }).toThrow('Entity name must be provided to BaseRepository constructor.');
  });

  it('should throw if storageAdapter is missing', () => {
    expect(() => {
      // @ts-ignore
      new BaseRepository('testEntity', undefined);
    }).toThrow('DataProvider must be provided to BaseRepository constructor.');
  });

  it('findAll should call provider.findAll', async () => {
    const expected = [{ id: 1, uuid: 'a', name: 'A' }];
    mockProvider.findAll.mockResolvedValue(expected);
    const result = await repo.findAll();
    expect(mockProvider.findAll).toHaveBeenCalledWith('testEntity');
    expect(result).toBe(expected);
  });

  it('findById should call provider.findById', async () => {
    const expected = { id: 1, uuid: 'a', name: 'A' };
    mockProvider.findById.mockResolvedValue(expected);
    const result = await repo.findById(1);
    expect(mockProvider.findById).toHaveBeenCalledWith('testEntity', 1);
    expect(result).toBe(expected);
  });

  it('create should call provider.create', async () => {
    const dto = { uuid: 'b', name: 'B' };
    const expected = { id: 2, ...dto };
    mockProvider.create.mockResolvedValue(expected);
    const result = await repo.create(dto);
    expect(mockProvider.create).toHaveBeenCalledWith('testEntity', dto);
    expect(result).toBe(expected);
  });

  it('createMany should call create for each item', async () => {
    const items = [
      { uuid: 'c', name: 'C' },
      { uuid: 'd', name: 'D' },
    ];
    const expected = [
      { id: 3, uuid: 'c', name: 'C' },
      { id: 4, uuid: 'd', name: 'D' },
    ];
    mockProvider.create
      .mockResolvedValueOnce(expected[0])
      .mockResolvedValueOnce(expected[1]);
    const result = await repo.createMany(items);
    expect(mockProvider.create).toHaveBeenCalledTimes(2);
    expect(result).toEqual(expected);
  });

  it('update should call provider.update', async () => {
    const update = { name: 'Z' };
    const expected = { id: 1, uuid: 'a', name: 'Z' };
    mockProvider.update.mockResolvedValue(expected);
    const result = await repo.update(1, update);
    expect(mockProvider.update).toHaveBeenCalledWith('testEntity', 1, update);
    expect(result).toBe(expected);
  });

  it('delete should call provider.delete', async () => {
    mockProvider.delete.mockResolvedValue(true);
    const result = await repo.delete(1);
    expect(mockProvider.delete).toHaveBeenCalledWith('testEntity', 1);
    expect(result).toBe(true);
  });
});
