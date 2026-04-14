import { Router, RequestHandler } from 'express';
import { ShieldConfig } from '../models/Config';

const SAFE_FIELDS: (keyof ShieldConfig)[] = [
  'name',
  'mode',
  'port',
  'compression',
  'cors',
  'historyApiFallback',
  'healthCheckPath',
  'morganFormat',
  'loggerLevel',
  'requestBodySize',
];

export function info(config: ShieldConfig): RequestHandler {
  const router = Router();

  router.get('/server-info', (_req, res) => {
    const safeConfig: Partial<ShieldConfig> = {};
    for (const field of SAFE_FIELDS) {
      if (config[field] !== undefined) {
        (safeConfig as any)[field] = config[field];
      }
    }
    res.status(200).json(safeConfig);
  });

  return router;
}
