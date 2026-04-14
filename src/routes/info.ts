import { Router, RequestHandler } from 'express';
import { ShieldConfig } from '../models/Config';

export function info(config: ShieldConfig): RequestHandler {
  const router = Router();

  router.get('/server-info', (_req, res) => {
    res.status(200).json(config);
  });

  return router;
}
