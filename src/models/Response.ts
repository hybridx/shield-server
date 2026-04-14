declare global {
  namespace Express {
    interface Response {
      success(data?: any): void;
      fail(data?: any): void;
      error(message: string, data?: any, code?: number): void;
    }
  }
}

export {};
