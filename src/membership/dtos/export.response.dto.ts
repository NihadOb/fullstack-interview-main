export class ExportResponseDto {
  /**
   * Job Id to get state
   */
  jobId: string;

  constructor(jobId: string) {
    this.jobId = jobId;
  }
}
