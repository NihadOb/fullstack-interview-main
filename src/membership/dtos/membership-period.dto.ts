import { Expose, Transform } from 'class-transformer';
import { MembershipPeriodState } from '../types/membership-period-state.enum';

export class MembershipPeriodDto {
  /** Unique identifier for the membership period for db reference */
  @Expose()
  id: number;

  /** Unique identifier for the membership period, used for external references */
  @Expose()
  uuid: string;

  /** Membership the period is attached to */
  @Expose()
  membership: number;

  /** Indicates the start of the period */
  @Expose()
  @Transform(({ value }) => value.toISOString(), { toPlainOnly: true })
  start: Date;

  /** Indicates the end of the period */
  @Expose()
  @Transform(({ value }) => value.toISOString(), { toPlainOnly: true })
  end: Date;

  /** Indicates the state of the membership period, e.g., 'planned', 'active', 'expired' */
  @Expose()
  state: MembershipPeriodState;
}
