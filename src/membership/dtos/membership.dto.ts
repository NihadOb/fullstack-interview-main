import { Expose, Transform } from 'class-transformer';
import { MembershipState } from '../enums/membership-state.enum';
import { BillingInterval } from '../enums/billing-interval.enum';
import { TransformDate } from '@app/core/decorators/transform-date.decorator';
import { PaymentMethod } from '../enums/payment-method.enum';

/**
 * Represents a membership.
 */
export class MembershipDto {
  /** Unique identifier for the membership for db reference
   * @example 1
   */
  @Expose()
  id: number;

  /** Unique identifier for the membership, used for external references
   * @example 123e4567-e89b-12d3-a456-426614174000
   */
  @Expose()
  uuid: string;

  /** Name of the membership
   * @example "Gold Plan"
   */
  @Expose()
  name: string;

  /** The user that the membership is assigned to
   * @example 1
   */
  @Expose()
  user: number;

  /** Price the user has to pay for every period
   * @example 10
   */
  @Expose()
  recurringPrice: number;

  /** Start of the validity
   * @example 2025-04-19
   */
  @Expose()
  @TransformDate()
  validFrom: Date;

  /** End of the validity
   *  @example 2025-04-26
   */
  @Expose()
  @TransformDate()
  validUntil: Date;

  /** Indicates the state of the membership */
  @Expose()
  state: MembershipState;

  /** Which payment method will be used to pay for the periods
   * @example cash
   */
  @Expose()
  paymentMethod?: PaymentMethod;

  /** The interval unit of the periods
   * @example weekly
   */
  @Expose()
  billingInterval: BillingInterval;

  /** The number of periods the membership has
   * @example 1
   */
  @Expose()
  billingPeriods: number;
}
