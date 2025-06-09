export default class ErrorResponseDto {
  error: string;
  message: string;
  details?: string[];

  constructor(error: string, message: string, details?: string[]) {
    this.error = error;
    this.message = message;
    this.details = details;
  }
}
