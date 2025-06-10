import { DataProvider } from '../data-provider.interface';
import { CustomLoggerService } from '@app/core/logger/custom-logger.service';

export interface MemoryDb {
  [entityName: string]: any[];
}

export class MemoryDataProvider implements DataProvider {
  constructor(
    private readonly logger: CustomLoggerService,
    private readonly database: MemoryDb = {},
  ) {
    this.logger.log('Memory Database provider initialized.');
  }

  private getNextId(entityName: string): number {
    const items = this.database[entityName] || [];
    if (items.length === 0) return 1;
    const maxId = items.reduce(
      (max, item) => (Number(item.id) > max ? Number(item.id) : max),
      0,
    );
    return maxId + 1;
  }

  async findAll<TEntity extends { id?: any }>(
    entityName: string,
  ): Promise<TEntity[]> {
    this.logger.log(`[Memory Adapter] Finding all for entity: ${entityName}`);
    return (this.database[entityName] || []) as TEntity[];
  }

  async findById<TEntity extends { id?: any }>(
    entityName: string,
    id: string | number,
  ): Promise<TEntity | null> {
    this.logger.log(
      `[Memory Adapter] Finding by ID ${id} for entity: ${entityName}`,
    );
    const items = (this.database[entityName] || []) as TEntity[];
    const item = items.find((i) => String(i.id) === String(id));
    return item || null;
  }

  async create<TEntity extends { id?: any }>(
    entityName: string,
    itemData: Omit<TEntity, 'id'>,
  ): Promise<TEntity> {
    this.logger.log(`[Memory Adapter] Creating for entity: ${entityName}`);
    if (!this.database[entityName]) {
      this.database[entityName] = [];
    }
    const newItem = { ...itemData, id: this.getNextId(entityName) } as TEntity;
    this.database[entityName].push(newItem);
    return newItem;
  }

  async update<TEntity extends { id?: any }>(
    entityName: string,
    id: string | number,
    itemUpdate: Partial<Omit<TEntity, 'id'>>,
  ): Promise<TEntity | null> {
    this.logger.log(
      `[Memory Adapter] Updating ID ${id} for entity: ${entityName}`,
    );
    const items = (this.database[entityName] || []) as TEntity[];
    const itemIndex = items.findIndex((i) => String(i.id) === String(id));
    if (itemIndex === -1) return null;
    const updatedItem = { ...items[itemIndex], ...itemUpdate };
    this.database[entityName][itemIndex] = updatedItem;
    return updatedItem;
  }

  async delete(entityName: string, id: string | number): Promise<boolean> {
    this.logger.log(
      `[Memory Adapter] Deleting ID ${id} for entity: ${entityName}`,
    );
    const items = this.database[entityName] || [];
    const itemIndex = items.findIndex((i) => String(i.id) === String(id));
    if (itemIndex === -1) return false;
    this.database[entityName].splice(itemIndex, 1);
    return true;
  }
}
