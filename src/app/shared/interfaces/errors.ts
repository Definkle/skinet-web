export interface IApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface IValidationError {
  field: string;
  messages: string[];
}
