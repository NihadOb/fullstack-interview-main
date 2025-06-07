export interface DataProvider {
  findAll<TEntity extends { id?: any }>(entityName: string): Promise<TEntity[]>;
  findById<TEntity extends { id?: any }>(
    entityName: string,
    id: string | number,
  ): Promise<TEntity | null>;
  create<TEntity extends { id?: any }>(
    entityName: string,
    itemData: Omit<TEntity, 'id'>,
  ): Promise<TEntity>;
  update<TEntity extends { id?: any }>(
    entityName: string,
    id: string | number,
    itemUpdate: Partial<Omit<TEntity, 'id'>>,
  ): Promise<TEntity | null>;
  delete(entityName: string, id: string | number): Promise<boolean>;
}
