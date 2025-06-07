import { Expose, Type } from 'class-transformer';
import { MembershipPeriodDto } from './membership-period.dto';
import { MembershipDto } from './membership.dto';

export class GetAllMembershipsResponseDataItemDto {
  /**
   * Membership
   */
  @Expose()
  @Type(() => MembershipDto)
  membership: MembershipDto;
  /**
   * Membership periods
   */
  @Expose()
  @Type(() => MembershipPeriodDto)
  periods: MembershipPeriodDto[];

  /**
   *
   */
  constructor(membership: MembershipDto, periods: MembershipPeriodDto[]) {
    this.membership = membership;
    this.periods = periods;
  }
}
export class GetAllMembershipsResponseDto extends Array<GetAllMembershipsResponseDataItemDto> {}
