export interface ErrorResponse {
  status: string;
  statusCode: number;
  message: string;
  stack?: string;
}
