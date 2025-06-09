import { DataProvider } from 'src/core/database/data-provider.interface';
import { BaseRepository } from 'src/core/database/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DATA_PROVIDER_TOKEN } from 'src/core/constants/tokens';
import { MembershipPeriod } from '../entities/membership-period.interface';

@Injectable()
export class MembershipPeriodRepository extends BaseRepository<MembershipPeriod> {
  constructor(@Inject(DATA_PROVIDER_TOKEN) dataProvider: DataProvider) {
    super('membershipPeriods', dataProvider);
  }

  /**
   * Find all Membership Periods by Membership IDs
   * @param membershipIds Membership IDs to filter by
   * @returns   All Membership Periods that match the given Membership IDs
   */
  async findAllByMembershipIds(
    membershipIds: number[],
  ): Promise<MembershipPeriod[]> {
    const membershipPeriods = await this.findAll();
    return membershipPeriods.filter((period) =>
      membershipIds.includes(period.membership),
    );
  }
}
