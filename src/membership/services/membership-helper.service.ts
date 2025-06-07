import { Injectable } from '@nestjs/common';
import { MembershipState } from '../types/membership-state.enum';

@Injectable()
export class MembershipHelperService {
  /**
   * Calculate the valid until date for a membership period based on the valid from date and billing interval.
   * @returns Valid Until date for the membership period.
   */
  calculateValidUntilForMembershipPeriod(
    validFrom: Date,
    billingInterval: string,
  ): Date {
    const validUntil = new Date(validFrom);
    if (billingInterval === 'monthly') {
      validUntil.setMonth(validFrom.getMonth() + 1);
    } else if (billingInterval === 'yearly') {
      validUntil.setMonth(validFrom.getMonth() + 12);
    } else if (billingInterval === 'weekly') {
      validUntil.setDate(validFrom.getDate() + 7);
    }
    return validUntil;
  }

  /**
   * Calculate the valid until date for a membership based on the valid from date, billing interval and periods.
   * @returns Valid Until date for the membership.
   */
  calculateValidUntilForMembership(
    validFrom: Date,
    billingInterval: string,
    billingPeriods: number,
  ): Date {
    const validUntil = new Date(validFrom);
    if (billingInterval === 'monthly') {
      validUntil.setMonth(validFrom.getMonth() + billingPeriods);
    } else if (billingInterval === 'yearly') {
      validUntil.setMonth(validFrom.getMonth() + billingPeriods * 12);
    } else if (billingInterval === 'weekly') {
      validUntil.setDate(validFrom.getDate() + billingPeriods * 7);
    }
    return validUntil;
  }

  /**
   * Calculate the membership state based on validFrom and validUntil dates.
   * @returns
   */
  calculateMembershipState(validFrom: Date, validUntil: Date): MembershipState {
    let state: MembershipState = MembershipState.Active;
    if (validFrom > new Date()) {
      state = MembershipState.Pending;
    }
    if (validUntil < new Date()) {
      state = MembershipState.Expired;
    }
    return state;
  }
}
