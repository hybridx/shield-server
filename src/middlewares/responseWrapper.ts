import { Request, Response, NextFunction, RequestHandler } from 'express';
import '../models/Response';

export function responseWrapper(): RequestHandler {
  return (_req: Request, res: Response, next: NextFunction) => {
    res.success = (data?: any) => {
      res.json({
        status: 'success',
        data: data ?? null,
      });
    };

    res.fail = (data?: any) => {
      res.json({
        status: 'fail',
        data: data ?? null,
      });
    };

    res.error = (message: string, data?: any, code?: number) => {
      const body: Record<string, any> = {
        status: 'error',
        message,
      };
      if (data !== undefined) body.data = data;
      if (code !== undefined) body.code = code;
      res.json(body);
    };

    next();
  };
}
