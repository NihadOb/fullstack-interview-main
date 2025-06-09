import { DataProvider } from 'src/core/database/data-provider.interface';
import { BaseRepository } from 'src/core/database/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DATA_PROVIDER_TOKEN } from 'src/core/constants/tokens';
import Role from '../entities/role.interface';

@Injectable()
export class RoleRepository extends BaseRepository<Role> {
  constructor(@Inject(DATA_PROVIDER_TOKEN) dataProvider: DataProvider) {
    super('roles', dataProvider);
  }
}
