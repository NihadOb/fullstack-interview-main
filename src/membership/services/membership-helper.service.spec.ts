import { MembershipHelperService } from './membership-helper.service';
import { MembershipState } from '../enums/membership-state.enum';

describe('MembershipHelperService', () => {
  let service: MembershipHelperService;

  beforeEach(() => {
    service = new MembershipHelperService();
  });

  describe('calculateValidUntilForMembershipPeriod', () => {
    it('should add 1 month for monthly interval', () => {
      const from = new Date('2024-01-15');
      const result = service.calculateValidUntilForMembershipPeriod(
        from,
        'monthly',
      );
      expect(result.getMonth()).toBe(1);
      expect(result.getFullYear()).toBe(2024);
    });

    it('should add 12 months for yearly interval', () => {
      const from = new Date('2024-01-15');
      const result = service.calculateValidUntilForMembershipPeriod(
        from,
        'yearly',
      );
      expect(result.getMonth()).toBe(0);
      expect(result.getFullYear()).toBe(2025);
    });

    it('should add 7 days for weekly interval', () => {
      const from = new Date('2024-01-15');
      const result = service.calculateValidUntilForMembershipPeriod(
        from,
        'weekly',
      );
      expect(result.getDate()).toBe(22);
      expect(result.getMonth()).toBe(0);
    });
  });

  describe('calculateValidUntilForMembership', () => {
    it('should add billingPeriods months for monthly interval', () => {
      const from = new Date('2024-01-15');
      const result = service.calculateValidUntilForMembership(
        from,
        'monthly',
        3,
      );
      expect(result.getMonth()).toBe(3);
      expect(result.getFullYear()).toBe(2024);
    });

    it('should add billingPeriods * 12 months for yearly interval', () => {
      const from = new Date('2024-01-15');
      const result = service.calculateValidUntilForMembership(
        from,
        'yearly',
        2,
      );
      expect(result.getMonth()).toBe(0);
      expect(result.getFullYear()).toBe(2026);
    });

    it('should add billingPeriods * 7 days for weekly interval', () => {
      const from = new Date('2024-01-15');
      const result = service.calculateValidUntilForMembership(
        from,
        'weekly',
        4,
      );
      expect(result.getDate()).toBe(43 - 31);
      expect(result.getMonth()).toBe(1);
    });
  });

  describe('calculateMembershipState', () => {
    it('should return Pending if validFrom is in the future', () => {
      const from = new Date(Date.now() + 1000000);
      const until = new Date(Date.now() + 2000000);
      expect(service.calculateMembershipState(from, until)).toBe(
        MembershipState.Pending,
      );
    });

    it('should return Expired if validUntil is in the past', () => {
      const from = new Date(Date.now() - 2000000);
      const until = new Date(Date.now() - 1000000);
      expect(service.calculateMembershipState(from, until)).toBe(
        MembershipState.Expired,
      );
    });

    it('should return Active if current date is between validFrom and validUntil', () => {
      const from = new Date(Date.now() - 1000000);
      const until = new Date(Date.now() + 1000000);
      expect(service.calculateMembershipState(from, until)).toBe(
        MembershipState.Active,
      );
    });
  });
});
