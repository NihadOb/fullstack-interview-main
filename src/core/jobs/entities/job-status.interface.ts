export type JobState = 'pending' | 'inProgress' | 'succeded' | 'failed';
export interface JobStatus {
  id: number;
  uuid: string;
  jobId?: number;
  userId: number;
  state: JobState;
  result?: string;
}
