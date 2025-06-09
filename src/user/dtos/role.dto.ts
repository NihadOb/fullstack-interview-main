import { Expose } from 'class-transformer';

export default class RoleDto {
  /**
   * Role id in the db.
   */
  @Expose()
  id: number;
  /**
   * Role id for external reference
   */
  @Expose()
  uuid: string;

  /**
   * Role name.
   */
  name: string;

  /**
   * Role description.
   */
  description?: string;
}
