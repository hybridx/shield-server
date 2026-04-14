import { Router, RequestHandler } from 'express';
import { ShieldConfig } from '../models/Config';

export function health(config: ShieldConfig): RequestHandler {
  const router = Router();
  const path = config.healthCheckPath || '/server-health';

  router.get(path, (_req, res) => {
    res.status(200).send("I'm OK");
  });

  return router;
}
