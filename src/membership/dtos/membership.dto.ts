import { Expose, Transform } from 'class-transformer';
import { MembershipState } from '../types/membership-state.enum';
import { BillingInterval } from '../types/billing-interval.enum';

/**
 * Represents a membership.
 */
export class MembershipDto {
  /** Unique identifier for the membership for db reference */
  @Expose()
  id: number;

  /** Unique identifier for the membership, used for external references */
  @Expose()
  uuid: string;

  /** Name of the membership */
  @Expose()
  name: string;

  /** The user that the membership is assigned to */
  @Expose()
  user: number;

  /** Price the user has to pay for every period */
  @Expose()
  recurringPrice: number;

  /** Start of the validity */
  @Expose()
  @Transform(({ value }) => value.toISOString(), { toPlainOnly: true })
  validFrom: Date;

  /** End of the validity */
  @Expose()
  @Transform(({ value }) => value.toISOString(), { toPlainOnly: true })
  validUntil: Date;

  /** Indicates the state of the membership */
  @Expose()
  state: MembershipState;

  /** Which payment method will be used to pay for the periods */
  @Expose()
  paymentMethod: string;

  /** The interval unit of the periods */
  @Expose()
  billingInterval: BillingInterval;

  /** The number of periods the membership has */
  @Expose()
  billingPeriods: number;
}
