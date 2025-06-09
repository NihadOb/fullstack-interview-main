import { MembershipDto } from './membership.dto';
import { MembershipPeriodDto } from './membership-period.dto';
import { Expose, Type } from 'class-transformer';

export class CreateMembershipResponseDto {
  /**
   * New Membership
   */
  @Expose()
  @Type(() => MembershipDto)
  membership: MembershipDto;

  /**
   * New Membership Periods
   */
  @Expose()
  @Type(() => MembershipPeriodDto)
  membershipPeriods: MembershipPeriodDto[];
}
