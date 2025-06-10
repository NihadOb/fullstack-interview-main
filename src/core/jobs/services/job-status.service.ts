import { Injectable } from '@nestjs/common';
import { JobStatusRepository } from '../repositories/job-status.repository';
import { JobState, JobStatus } from '../entities/job-status.interface';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class JobStatusService {
  constructor(private readonly jobStatusRepository: JobStatusRepository) {}

  /**
   * Get By Id
   * @param id internal Id
   * @returns
   */
  async getById(id: number): Promise<JobStatus | null> {
    const jobStatuses = await this.jobStatusRepository.findAll();
    return jobStatuses.find((_) => (_.id = id));
  }

  /**
   * Create new job info
   * @param jobId
   * @param state
   * @param result
   */
  async create(jobInfo: {
    userId: number;
    state: JobState;
  }): Promise<JobStatus> {
    return await this.jobStatusRepository.create({
      userId: jobInfo.userId,
      uuid: uuidv4(),
      state: jobInfo.state,
    });
  }

  /**
   * Update job by id
   * @param id internal job id
   * @param state new state
   * @param result job result
   */
  async update(id: number, state: JobState, result?: any): Promise<JobStatus> {
    return await this.jobStatusRepository.update(id, {
      state,
      result,
    });
  }
}
