import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { getConfig } from '../config';
import { logger } from '../logger';
import { ShieldConfig } from '../models/Config';
import '../models/Response';

export function defaultErrorHandlers(conf?: Partial<ShieldConfig>): ErrorRequestHandler[] {
  const config = getConfig(conf);

  const errorHandler: ErrorRequestHandler = (
    err: any,
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const errorMessage = err?.stack || err?.message || String(err);
    logger.error(errorMessage);

    if (config.mode === 'api') {
      if (!res.headersSent) {
        res.status(500);
        res.error(errorMessage);
      }
    } else {
      if (!res.headersSent) {
        res.status(500).end(errorMessage + '\n');
      }
    }

    next();
  };

  return [errorHandler];
}
