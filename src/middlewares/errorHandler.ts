import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { getConfig } from '../config';
import { logger } from '../logger';
import { ShieldConfig } from '../models/Config';
import '../models/Response';

export function defaultErrorHandlers(conf?: Partial<ShieldConfig>): ErrorRequestHandler[] {
  const config = getConfig(conf);
  const isProduction = process.env.NODE_ENV === 'production';

  const errorHandler: ErrorRequestHandler = (
    err: any,
    _req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const fullError = err?.stack || err?.message || String(err);
    logger.error(fullError);

    const clientMessage =
      isProduction && !config.debug ? 'Internal Server Error' : fullError;

    if (config.mode === 'api') {
      if (!res.headersSent) {
        res.status(500);
        res.error(clientMessage);
      }
    } else {
      if (!res.headersSent) {
        res.status(500).end(clientMessage + '\n');
      }
    }

    next();
  };

  return [errorHandler];
}
