import { MEMBERSHIP_EXPORT_QUEUE_V1 } from '@app/core/constants/queues';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { JobDataBase } from '../../../core/jobs/job-data-base.interface';
import { MembershipService } from '@app/membership/services';
import { JobStatusService } from '@app/core/jobs/services/job-status.service';
import { CustomLoggerService } from '@app/core/logger/custom-logger.service';

export interface MembershipExportData extends JobDataBase {
  dbJobId: number;
  email: string;
  userId: number;
}
@Processor(MEMBERSHIP_EXPORT_QUEUE_V1)
export class MembershipExportProcessor {
  constructor(
    private readonly membershipService: MembershipService,
    private readonly jobStatusService: JobStatusService,
    private readonly logger: CustomLoggerService,
  ) {}

  @Process()
  async handleJob(job: Job) {
    const data = job.data as MembershipExportData;
    if (!data) {
      console.log('Invalid job data', job);
      return { success: true };
    }

    if (data.ver != 1) {
      console.log('Invalid job version', job);
      return { success: false };
    }

    try {
      await this.jobStatusService.update(data.dbJobId, 'inProgress');

      const allMemberships = await this.membershipService.findAll();
      console.log('Data in form of a CSV Sent', allMemberships);

      //Todo: Actual sending

      await this.jobStatusService.update(data.dbJobId, 'succeded');
      return { success: true };
    } catch (error) {
      this.logger.error('Error while sending email', {
        data,
        error,
      });
      return { success: false };
    }
  }
}
