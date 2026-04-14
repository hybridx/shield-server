declare global {
  namespace Express {
    interface Response {
      success(data?: any): void;
      fail(data?: any, statusCode?: number): void;
      error(error: any, statusCode?: number): void;
    }
  }
}

export {};
