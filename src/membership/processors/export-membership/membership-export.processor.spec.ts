import { MembershipExportProcessor } from './membership-export.processor';
import { MembershipService } from '@app/membership/services';
import { JobStatusService } from '@app/core/jobs/services/job-status.service';
import { CustomLoggerService } from '@app/core/logger/custom-logger.service';

describe('MembershipExportProcessor', () => {
  let processor: MembershipExportProcessor;
  let membershipService: jest.Mocked<MembershipService>;
  let jobStatusService: jest.Mocked<JobStatusService>;
  let logger: jest.Mocked<CustomLoggerService>;

  beforeEach(() => {
    membershipService = {
      findAll: jest.fn(),
    } as any;

    jobStatusService = {
      update: jest.fn(),
    } as any;

    logger = {
      error: jest.fn(),
    } as any;

    processor = new MembershipExportProcessor(
      membershipService,
      jobStatusService,
      logger,
    );
  });

  const baseJob = {
    data: {
      dbJobId: 1,
      email: 'test@example.com',
      userId: 42,
      ver: 1,
    },
  };

  it('should return success true if job data is missing', async () => {
    const result = await processor.handleJob({ data: undefined } as any);
    expect(result).toEqual({ success: true });
  });

  it('should return success false if job version is not 1', async () => {
    const job = { data: { ...baseJob.data, ver: 2 } };
    const result = await processor.handleJob(job as any);
    expect(result).toEqual({ success: false });
  });

  it('should process job and return success true', async () => {
    jobStatusService.update.mockResolvedValue(undefined);
    membershipService.findAll.mockResolvedValue([
      { membership: { user: 42 } } as any,
      { membership: { user: 99 } } as any,
    ]);
    const job = { data: baseJob.data };

    const result = await processor.handleJob(job as any);

    expect(jobStatusService.update).toHaveBeenCalledWith(1, 'inProgress');
    expect(membershipService.findAll).toHaveBeenCalled();
    expect(jobStatusService.update).toHaveBeenCalledWith(1, 'succeded');
    expect(result).toEqual({ success: true });
  });

  it('should log and return success false on error', async () => {
    jobStatusService.update.mockResolvedValue(undefined);
    membershipService.findAll.mockRejectedValue(new Error('fail'));
    const job = { data: baseJob.data };

    const result = await processor.handleJob(job as any);

    expect(logger.error).toHaveBeenCalledWith(
      'Error while sending email',
      expect.objectContaining({
        data: baseJob.data,
        error: expect.any(Error),
      }),
    );
    expect(result).toEqual({ success: false });
  });
});
