import { DataProvider } from '@app/core/database/data-provider.interface';
import { Membership } from '../entities/membership.interface';
import { BaseRepository } from '@app/core/database/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DATA_PROVIDER_TOKEN } from '@app/core/constants/tokens';

@Injectable()
export class MembershipRepository extends BaseRepository<Membership> {
  constructor(@Inject(DATA_PROVIDER_TOKEN) dataProvider: DataProvider) {
    super('memberships', dataProvider);
  }
}
