import { IsEnum } from 'class-validator';
import { BillingInterval } from '../types/billing-interval.enum';
import { MembershipState } from '../types/membership-state.enum';

export class CreateMembershipRequestDto {
  /**
   *  name of the membership
   */
  name: string;

  /**
   * the user that the membership is assigned to
   */
  user: number;

  /*
   * price the user has to pay for every period
   */
  recurringPrice: number;

  /**
   * start of the validity
   */
  validFrom: Date;

  /**
   * end of the validity
   */
  validUntil: Date;

  /**
   * indicates the state of the membership
   */
  @IsEnum(MembershipState)
  state: MembershipState;
  /**
   * which payment method will be used to pay for the periods
   */

  paymentMethod: string;
  /**
   * the interval unit of the periods
   */
  billingInterval: BillingInterval;

  /**
   * the number of periods the membership has
   */

  billingPeriods: number;
}
