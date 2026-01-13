export interface LaravelValidationError {
  message: string;
  errors: Record<string, string[]>;
}

export interface LaravelTrace {
  file?: string;
  line?: number;
  function?: string;
  class?: string;
  type?: string;
  args?: unknown[];
}

export interface LaravelErrorResponse {
  message: string;
  exception?: string;
  file?: string;
  line?: number;
  trace?: LaravelTrace[];
}
