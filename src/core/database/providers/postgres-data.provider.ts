import { DataProvider } from '../data-provider.interface';
import { CustomLoggerService } from 'src/core/logger/custom-logger.service';

export class PostgresDataProvider implements DataProvider {
  constructor(private readonly logger: CustomLoggerService) {
    this.logger.log('PostgresDataProvider initialized (conceptual).');
  }
  async findAll<TEntity extends { id?: any }>(
    entityName: string,
  ): Promise<TEntity[]> {
    this.logger.log(
      `[Postgres Adapter] Finding all for ${entityName} - Not implemented`,
    );
    return [];
  }

  async findById<TEntity extends { id?: any }>(
    entityName: string,
    id: string | number,
  ): Promise<TEntity | null> {
    this.logger.log(
      `[Postgres Adapter] Finding by ID ${id} for ${entityName} - Not implemented`,
    );
    return null;
  }

  async create<TEntity extends { id?: any }>(
    entityName: string,
    itemData: Omit<TEntity, 'id'>,
  ): Promise<TEntity> {
    this.logger.log(
      `[Postgres Adapter] Creating for ${entityName} - Not implemented`,
    );
    return { ...itemData, id: 'mock-postgres-id' } as TEntity;
  }

  async update<TEntity extends { id?: any }>(
    entityName: string,
    id: string | number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    itemUpdate: Partial<Omit<TEntity, 'id'>>,
  ): Promise<TEntity | null> {
    this.logger.log(
      `[Postgres Adapter] Updating ID ${id} for ${entityName} - Not implemented`,
    );
    return null;
  }

  async delete(entityName: string, id: string | number): Promise<boolean> {
    this.logger.log(
      `[Postgres Adapter] Deleting ID ${id} for ${entityName} - Not implemented`,
    );
    return false;
  }
}
