import { DataProvider } from 'src/core/database/data-provider.interface';
import { BaseRepository } from 'src/core/database/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DATA_PROVIDER_TOKEN } from 'src/core/constants/tokens';
import { MembershipType } from '../entities/membership-type.interface';

@Injectable()
export class MembershipTypeRepository extends BaseRepository<MembershipType> {
  constructor(@Inject(DATA_PROVIDER_TOKEN) dataProvider: DataProvider) {
    super('membershipTypes', dataProvider);
  }
}
