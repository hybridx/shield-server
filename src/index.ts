export { defaultMiddlewares } from './middlewares/default';
export { defaultErrorHandlers } from './middlewares/errorHandler';
export { responseWrapper } from './middlewares/responseWrapper';
export { log } from './middlewares/log';
export { proxy } from './middlewares/proxy';
export { rewrite } from './middlewares/rewrite';
export { apiRateLimit } from './middlewares/apiRateLimit';

export { health } from './routes/health';
export { info } from './routes/info';

export { getConfig } from './config';
export { Logger, logger } from './logger';
export { getIP } from './util';

export type {
  ShieldConfig,
  ShieldMode,
  LoggerLevel,
  SSLConfig,
  ProxyConfig,
  RewriteRule,
  SplunkOption,
} from './models/Config';

import './models/Response';
