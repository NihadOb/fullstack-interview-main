import { DataProvider } from '@app/core/database/data-provider.interface';
import { BaseRepository } from '@app/core/database/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DATA_PROVIDER_TOKEN } from '@app/core/constants/tokens';
import User from '../entities/user.interface';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@Inject(DATA_PROVIDER_TOKEN) dataProvider: DataProvider) {
    super('users', dataProvider);
  }
}
