import { JsonDataProvider } from './json-data.provider';
import * as fs from 'fs/promises';

const mockLogger = {
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

const mockConfigService = {
  get: jest.fn().mockReturnValue('./test.json'),
};

jest.mock('fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  mkdir: jest.fn(),
}));

describe('JsonDataProvider', () => {
  let provider: JsonDataProvider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new JsonDataProvider(
      mockConfigService as any,
      mockLogger as any,
    );
    // Simulate initialized state for most tests
    (provider as any).isInitialized = true;
    (provider as any).database = {
      testEntity: [
        { id: 1, name: 'A' },
        { id: 2, name: 'B' },
      ],
    };
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
    it('should add a new item and save the database', async () => {
      (provider as any).database = { testEntity: [{ id: 1, name: 'A' }] };
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await provider.create('testEntity', { name: 'C' });
      expect(result).toMatchObject({ id: 2, name: 'C' });
      expect((provider as any).database.testEntity.length).toBe(2);
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should create entity array if not exists', async () => {
      (provider as any).database = {};
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await provider.create('newEntity', { foo: 'bar' });
      expect(result).toMatchObject({ id: 1, foo: 'bar' });
      expect((provider as any).database.newEntity.length).toBe(1);
      expect(fs.writeFile).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update an existing item and save the database', async () => {
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await provider.update('testEntity', 1, { name: 'Z' });
      expect(result).toMatchObject({ id: 1, name: 'Z' });
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should return null if item not found', async () => {
      const result = await provider.update('testEntity', 99, { name: 'X' });
      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should remove an item and save the database', async () => {
      (fs.writeFile as jest.Mock).mockResolvedValue(undefined);

      const result = await provider.delete('testEntity', 1);
      expect(result).toBe(true);
      expect((provider as any).database.testEntity.length).toBe(1);
      expect(fs.writeFile).toHaveBeenCalled();
    });

    it('should return false if item not found', async () => {
      const result = await provider.delete('testEntity', 99);
      expect(result).toBe(false);
    });
  });

  describe('getNextId', () => {
    it('should return 1 if no items', () => {
      (provider as any).database = {};
      const id = (provider as any).getNextId('emptyEntity');
      expect(id).toBe(1);
    });

    it('should return max id + 1', () => {
      (provider as any).database = { testEntity: [{ id: 3 }, { id: 7 }] };
      const id = (provider as any).getNextId('testEntity');
      expect(id).toBe(8);
    });
  });
});
