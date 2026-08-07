/**
 * Shared envelope shapes. Every `lib/api` function returns data wrapped like
 * a real backend would send it, so swapping mocks for `fetch` later only
 * touches the service file — never the shape callers depend on.
 */

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiErrorShape {
  code: ApiErrorCode;
  message: string;
  /** Field-level messages for form submissions, keyed by field name. */
  fieldErrors?: Record<string, string>;
}

export type ApiErrorCode =
  | "unauthorized"
  | "not_found"
  | "validation_error"
  | "conflict"
  | "rate_limited"
  | "server_error"
  | "network_error";

export class ApiError extends Error {
  code: ApiErrorCode;
  fieldErrors?: Record<string, string>;

  constructor(shape: ApiErrorShape) {
    super(shape.message);
    this.name = "ApiError";
    this.code = shape.code;
    this.fieldErrors = shape.fieldErrors;
  }
}

/** ISO-8601 string, as it would cross the wire. */
export type Timestamp = string;
