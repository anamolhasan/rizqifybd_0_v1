export interface ApiResponse<TData = unknown> {
  success: true;
  message: string;
  data: TData;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export interface ApiErrorSource {
  path: string;
  message: string;
}

export interface ApiErrorPayload
  extends ApiErrorResponse {
  errorSources?: ApiErrorSource[];
}

export interface ListQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  searchTerm?: string;
  [key: string]: string | number | undefined;
}