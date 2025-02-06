export interface ApiError<T = any> {
  message: string;
  code?: string;
  data?: T;
}

export interface ApiResponse<T = any, E = ApiError> {
  isSuccess: boolean;
  data?: T;
  error?: E;
}
