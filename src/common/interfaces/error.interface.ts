export interface ValidationErrorInterface {
  status?: number;
  name?: string;
  error?: string;
  field: string;
  message?: string;
}
