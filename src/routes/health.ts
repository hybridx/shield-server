import { Router, RequestHandler } from 'express';
import { ShieldConfig } from '../models/Config';

export function health(config: ShieldConfig): RequestHandler {
  const router = Router();
  const path = config.healthCheckPath || '/server-health';

  router.get(path, (req, res) => {
    if (config.healthCheckResponse) {
      config.healthCheckResponse(req, res);
    } else {
      res.status(200).send("I'm OK");
    }
  });

  return router;
}
