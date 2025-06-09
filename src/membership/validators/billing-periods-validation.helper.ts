import e from 'express';
import {
  BILLING_PERIODS_LESS_THAN_SIX_MONTHS,
  BILLING_PERIODS_LESS_THAN_THREE_YEAR,
  BILLING_PERIODS_MORE_THAN_TEN_YEARS,
  BILLING_PERIODS_MORE_THAN_TWELVE_MONTHS,
  INVALID_BILLING_PERIODS,
} from '../consts/error-messages.const';
import { BillingInterval } from '../types/billing-interval.enum';

export function validateBillingPeriods(
  billingInterval: BillingInterval,
  billingPeriods: number,
): string | null {
  if (billingInterval === BillingInterval.Monthly) {
    if (billingPeriods > 12) return BILLING_PERIODS_MORE_THAN_TWELVE_MONTHS;
    if (billingPeriods < 6) return BILLING_PERIODS_LESS_THAN_SIX_MONTHS;
  } else if (billingInterval === BillingInterval.Yearly) {
    if (billingPeriods > 10) return BILLING_PERIODS_MORE_THAN_TEN_YEARS;
    if (billingPeriods < 3) return BILLING_PERIODS_LESS_THAN_THREE_YEAR;
  }

  return null;
}
