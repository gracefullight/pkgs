export interface Cafe24ApiResponse<T> {
  code?: string;
  message?: string;
  // biome-ignore lint/suspicious/noExplicitAny: API response structure is dynamic
  more_info?: Record<string, any>;
  resource?: T;
}

export interface Cafe24Error {
  code: string;
  message: string;
  // biome-ignore lint/suspicious/noExplicitAny: API response structure is dynamic
  more_info?: Record<string, any>;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  total: number;
  count: number;
  offset: number;
  items: T[];
  has_more: boolean;
  next_offset?: number;
}
export type Cafe24Enum = "T" | "F";

export interface Cafe24PagingLinks {
  rel: "prev" | "next" | "self";
  href: string;
}
