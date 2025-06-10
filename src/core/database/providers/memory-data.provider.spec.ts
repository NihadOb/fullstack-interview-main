import { MemoryDataProvider, MemoryDb } from './memory-data.provider';

const mockLogger = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

describe('MemoryDataProvider', () => {
  let provider: MemoryDataProvider;
  let db: MemoryDb;

  beforeEach(() => {
    db = {
      testEntity: [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ],
    };
    provider = new MemoryDataProvider(mockLogger as any, db);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all items for an entity', async () => {
      const result = await provider.findAll('testEntity');
      expect(result).toEqual([
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ]);
    });

    it('should return empty array if entity does not exist', async () => {
      const result = await provider.findAll('unknown');
      expect(result).toEqual([]);
    });
  });

  describe('findById', () => {
    it('should return the item with the given id', async () => {
      const result = await provider.findById('testEntity', 2);
      expect(result).toEqual({ id: 2, name: 'B' });
    });

    it('should return null if item not found', async () => {
      const result = await provider.findById('testEntity', 99);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should add a new item with next id', async () => {
      const result = await provider.create('testEntity', { name: 'C' });
      expect(result).toMatchObject({ id: 3, name: 'C' });
      expect(db.testEntity.length).toBe(3);
    });

    it('should create entity array if not exists', async () => {
      const result = await provider.create('newEntity', { foo: 'bar' });
      expect(result).toMatchObject({ id: 1, foo: 'bar' });
      expect(db.newEntity.length).toBe(1);
    });
  });

  describe('update', () => {
    it('should update an existing item', async () => {
      const result = await provider.update('testEntity', 1, { name: 'Z' });
      expect(result).toMatchObject({ id: 1, name: 'Z' });
      expect(db.testEntity[0].name).toBe('Z');
    });

    it('should return null if item not found', async () => {
      const result = await provider.update('testEntity', 99, { name: 'X' });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should remove an item', async () => {
      const result = await provider.delete('testEntity', 1);
      expect(result).toBe(true);
      expect(db.testEntity.length).toBe(1);
      expect(db.testEntity[0].id).toBe(2);
    });

    it('should return false if item not found', async () => {
      const result = await provider.delete('testEntity', 99);
      expect(result).toBe(false);
    });
  });

  describe('getNextId', () => {
    it('should return 1 if no items', () => {
      const emptyProvider = new MemoryDataProvider(mockLogger as any, {});
      // @ts-ignore
      expect(emptyProvider['getNextId']('emptyEntity')).toBe(1);
    });

    it('should return max id + 1', () => {
      // @ts-ignore
      expect(provider['getNextId']('testEntity')).toBe(3);
    });
  });
});
