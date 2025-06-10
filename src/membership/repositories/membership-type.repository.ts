import { DataProvider } from '@app/core/database/data-provider.interface';
import { BaseRepository } from '@app/core/database/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DATA_PROVIDER_TOKEN } from '@app/core/constants/tokens';
import { MembershipType } from '../entities/membership-type.interface';

@Injectable()
export class MembershipTypeRepository extends BaseRepository<MembershipType> {
  constructor(@Inject(DATA_PROVIDER_TOKEN) dataProvider: DataProvider) {
    super('membershipTypes', dataProvider);
  }
}
