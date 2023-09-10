export type CustomError = {
  code: string;
  message: string;
  data?: Record<string, any> | null;
};

export type CustomResponse<T = any> = (
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: CustomError;
    }
) & {
  message: string;
};

export const successResponse = <T extends any>(
  message: string,
  data: T,
): CustomResponse<T> => ({
  success: true,
  message,
  data,
});

export const errorResponse = (
  message: string,
  error: CustomError,
): CustomResponse => ({
  success: false,
  message,
  error,
});
