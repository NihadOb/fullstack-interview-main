import { DataProvider } from '@app/core/database/data-provider.interface';
import { BaseRepository } from '@app/core/database/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DATA_PROVIDER_TOKEN } from '@app/core/constants/tokens';
import { JobStatus } from '../entities/job-status.interface';

@Injectable()
export class JobStatusRepository extends BaseRepository<JobStatus> {
  constructor(@Inject(DATA_PROVIDER_TOKEN) dataProvider: DataProvider) {
    super('jobStatuses', dataProvider);
  }
}
