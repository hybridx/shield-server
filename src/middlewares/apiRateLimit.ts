import rateLimit, { Options as RateLimitOptions } from 'express-rate-limit';
import { RequestHandler, Request } from 'express';
import { getIP } from '../util';

export function apiRateLimit(options?: Partial<RateLimitOptions>): RequestHandler {
  return rateLimit({
    ...options,
    keyGenerator: (req: Request) => getIP(req),
  });
}
