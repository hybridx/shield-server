import { Request, Response, NextFunction, RequestHandler } from 'express';
import { RewriteRule } from '../models/Config';

export function rewrite(rules: RewriteRule[]): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    for (const rule of rules) {
      req.url = req.url.replace(rule.from, rule.to);
    }
    next();
  };
}
