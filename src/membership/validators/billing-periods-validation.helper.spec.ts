import {
  BILLING_PERIODS_LESS_THAN_SIX_MONTHS,
  BILLING_PERIODS_LESS_THAN_THREE_YEAR,
  BILLING_PERIODS_MORE_THAN_TEN_YEARS,
  BILLING_PERIODS_MORE_THAN_TWELVE_MONTHS,
} from '../consts/error-messages.const';
import { BillingInterval } from '../enums/billing-interval.enum';
import { validateBillingPeriods } from './billing-periods-validation.helper';

describe('validateBillingPeriods', () => {
  it('should return error if monthly and periods > 12', () => {
    expect(validateBillingPeriods(BillingInterval.Monthly, 13)).toBe(
      BILLING_PERIODS_MORE_THAN_TWELVE_MONTHS,
    );
  });

  it('should return error if monthly and periods < 6', () => {
    expect(validateBillingPeriods(BillingInterval.Monthly, 5)).toBe(
      BILLING_PERIODS_LESS_THAN_SIX_MONTHS,
    );
  });

  it('should return null if monthly and periods between 6 and 12', () => {
    expect(validateBillingPeriods(BillingInterval.Monthly, 6)).toBeNull();
    expect(validateBillingPeriods(BillingInterval.Monthly, 12)).toBeNull();
    expect(validateBillingPeriods(BillingInterval.Monthly, 8)).toBeNull();
  });

  it('should return error if yearly and periods > 10', () => {
    expect(validateBillingPeriods(BillingInterval.Yearly, 11)).toBe(
      BILLING_PERIODS_MORE_THAN_TEN_YEARS,
    );
  });

  it('should return error if yearly and periods < 3', () => {
    expect(validateBillingPeriods(BillingInterval.Yearly, 2)).toBe(
      BILLING_PERIODS_LESS_THAN_THREE_YEAR,
    );
  });

  it('should return null if yearly and periods between 3 and 10', () => {
    expect(validateBillingPeriods(BillingInterval.Yearly, 3)).toBeNull();
    expect(validateBillingPeriods(BillingInterval.Yearly, 10)).toBeNull();
    expect(validateBillingPeriods(BillingInterval.Yearly, 5)).toBeNull();
  });

  it('should return null for other intervals', () => {
    expect(validateBillingPeriods('weekly' as any, 100)).toBeNull();
    expect(validateBillingPeriods('daily' as any, 1)).toBeNull();
  });
});
