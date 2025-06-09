export default class ErrorResponse {
  error: string;
  message: string;

  constructor(error: string, message: string) {
    this.error = error;
    this.message = message;
  }
}
