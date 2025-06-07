import { DataProvider } from './data-provider.interface';

export abstract class BaseRepository<
  TEntity extends { id: number; uuid: string },
> {
  constructor(
    protected readonly entityName: string,
    protected readonly storageAdapter: DataProvider,
  ) {
    if (!entityName) {
      throw new Error(
        'Entity name must be provided to BaseRepository constructor.',
      );
    }
    if (!storageAdapter) {
      throw new Error(
        'DataProvider must be provided to BaseRepository constructor.',
      );
    }
  }

  /**
   *
   * @returns
   */
  async findAll(): Promise<TEntity[]> {
    return this.storageAdapter.findAll<TEntity>(this.entityName);
  }

  async findById(id: number): Promise<TEntity | null> {
    return await this.storageAdapter.findById<TEntity>(this.entityName, id);
  }

  async create(itemData: Omit<TEntity, 'id'>): Promise<TEntity> {
    return this.storageAdapter.create<TEntity>(this.entityName, itemData);
  }

  async createMany(itemData: Omit<TEntity, 'id'>[]): Promise<TEntity[]> {
    const result: TEntity[] = [];
    for (const item of itemData) {
      result.push(await this.create(item));
    }
    return result;
  }

  async update(
    id: number,
    itemUpdate: Partial<Omit<TEntity, 'id'>>,
  ): Promise<TEntity | null> {
    return this.storageAdapter.update<TEntity>(this.entityName, id, itemUpdate);
  }

  async delete(id: number): Promise<boolean> {
    return this.storageAdapter.delete(this.entityName, id);
  }
}
