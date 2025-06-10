import { Module } from '@nestjs/common';
import { JobStatusRepository } from './repositories/job-status.repository';
import { JobStatusService } from './services/job-status.service';

@Module({
  providers: [JobStatusRepository, JobStatusService],
  exports: [JobStatusService],
})
export class JobsModule {}
