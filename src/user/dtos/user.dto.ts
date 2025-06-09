import { Expose, Type } from 'class-transformer';
import Role from './role.dto';

export default class UserSto {
  /**
   * User id in the db.
   */
  @Expose()
  id: number;
  /**
   * User id for external reference
   */
  @Expose()
  uuid: string;
  /**
   * User's unique username.
   */
  @Expose()
  username: string;
  /**
   * User's email address.
   */
  @Expose()
  email: string;
  /**
   * User's first name.
   */

  firstName: string;
  /**
   * User's last name.
   */
  @Expose()
  lastName: string;

  /**
   * The role of the user.
   */
  @Type(() => Role)
  roles?: Role;
}
