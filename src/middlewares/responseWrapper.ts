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

    res.fail = (data?: any, statusCode?: number) => {
      if (statusCode) res.status(statusCode);
      res.json({
        status: 'fail',
        data: data ?? null,
      });
    };

    res.error = (error: any, statusCode?: number) => {
      if (statusCode) res.status(statusCode);

      if (typeof error === 'string') {
        res.json({ status: 'error', message: error });
      } else {
        res.json({ status: 'error', ...error });
      }
    };

    next();
  };
}
