import {
  IsDate,
  IsDefined,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  Max,
  Min,
  Validate,
} from 'class-validator';
import { BillingInterval } from '../enums/billing-interval.enum';
import { PaymentMethod } from '../enums/payment-method.enum';
import { Type } from 'class-transformer';
import {
  INVALID_BILLING_PERIODS,
  MISSING_MANDATORY_FIELDS,
  NEGATIVE_RECURRING_PRICE,
} from '../consts/error-messages.const';
import { CashPriceBelowLimit } from '../validators/cash-price-below-limit.validator';
import { BillingPeriodsValidator } from '../validators/billing-periods.validator';
import { MembershipTypeValidator } from '../validators/membership-type.validator';

export class CreateMembershipRequestDto {
  /**
   *  name of the membership
   *  @example "Gold Plan"
   */
  @IsDefined({
    message: MISSING_MANDATORY_FIELDS,
  })
  @Validate(MembershipTypeValidator)
  name: string;

  /**
   * price the user has to pay for every period
   * @example 2
   */
  @IsDefined({
    message: MISSING_MANDATORY_FIELDS,
  })
  @Type(() => Number)
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: 'MISSING_MANDATORY_FIELDS1',
    },
  )
  @Min(0, {
    message: NEGATIVE_RECURRING_PRICE,
  })
  @CashPriceBelowLimit()
  recurringPrice: number;

  /**
   * start of the validity
   * @example 2025-02-24
   */
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validFrom?: Date;

  /**
   * which payment method will be used to pay for the periods
   */
  @IsOptional()
  @IsEnum(PaymentMethod)
  paymentMethod?: PaymentMethod;

  /**
   * the interval unit of the periods
   */
  @IsDefined({
    message: INVALID_BILLING_PERIODS,
  })
  @IsEnum(BillingInterval, {
    message: INVALID_BILLING_PERIODS,
  })
  billingInterval: BillingInterval;

  /**
   * the number of periods the membership has
   * @example 3
   */
  @IsDefined()
  @Type(() => Number)
  @IsNumber(
    {
      allowNaN: false,
    },
    {
      message: INVALID_BILLING_PERIODS,
    },
  )
  @IsInt({
    message: INVALID_BILLING_PERIODS,
  })
  @BillingPeriodsValidator()
  billingPeriods: number;
}
