type ApiError = {
  message: string;
  code?: string;
  data?: any;
};

export interface ApiResponse<T = any> {
  isSuccess: boolean;
  data?: T;
  error?: ApiError;
}
