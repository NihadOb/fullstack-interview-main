import { Expose, Transform } from 'class-transformer';
import { MembershipPeriodState } from '../types/membership-period-state.enum';
import { TransformDate } from 'src/core/decorators/transform-date.decorator';

export class MembershipPeriodDto {
  /** Unique identifier for the membership period for db reference
   * @example 1
   */
  @Expose()
  id: number;

  /** Unique identifier for the membership period, used for external references
   * @example 123e4567-e89b-12d3-a456-426614174001
   */
  @Expose()
  uuid: string;

  /** Membership the period is attached to
   * @example 1
   */
  @Expose()
  membership: number;

  /** Indicates the start of the period
   * @example 2025-03-12
   */
  @Expose()
  @TransformDate()
  start: Date;

  /**
   * the end of the period
   * @example 2025-06-12
   * */
  @Expose()
  @TransformDate()
  end: Date;

  /** Indicates the state of the membership period, e.g., 'planned', 'issued'
   * @example planned
   */
  @Expose()
  state: MembershipPeriodState;
}
