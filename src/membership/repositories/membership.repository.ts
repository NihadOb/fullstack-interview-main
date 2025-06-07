import { DataProvider } from 'src/core/database/data-provider.interface';
import { Membership } from '../entities/membership.interface';
import { BaseRepository } from 'src/core/database/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DATA_PROVIDER_TOKEN } from 'src/core/constants/tokens';

@Injectable()
export class MembershipRepository extends BaseRepository<Membership> {
  constructor(@Inject(DATA_PROVIDER_TOKEN) dataProvider: DataProvider) {
    super('membership', dataProvider);
  }
}
