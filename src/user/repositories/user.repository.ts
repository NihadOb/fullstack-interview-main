import { DataProvider } from 'src/core/database/data-provider.interface';
import { BaseRepository } from 'src/core/database/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DATA_PROVIDER_TOKEN } from 'src/core/constants/tokens';
import User from '../entities/user.interface';

@Injectable()
export class UserRepository extends BaseRepository<User> {
  constructor(@Inject(DATA_PROVIDER_TOKEN) dataProvider: DataProvider) {
    super('users', dataProvider);
  }
}
