import { CorsOptions } from 'cors';
import { HelmetOptions } from 'helmet';
import { Options as RateLimitOptions } from 'express-rate-limit';

export type ShieldMode = 'static' | 'api' | 'fullstack';

export type LoggerLevel = 'error' | 'warn' | 'info' | 'log' | 'debug';

export interface SSLConfig {
  cert: string;
  key: string;
}

export interface ProxyConfig {
  from: string;
  to: string;
}

export interface RewriteRule {
  from: string;
  to: string;
}

export interface SplunkOption {
  host?: string;
  token?: string;
  source?: string;
  sourceType?: string;
  sourceHost?: string;
  httpRequest?: boolean;
}

export interface ShieldConfig {
  name?: string;
  mode?: ShieldMode;
  port?: number;
  debug?: boolean;
  compression?: boolean;
  cors?: boolean;
  corsOption?: CorsOptions;
  ssl?: SSLConfig;
  staticDir?: string;
  publicPath?: string;
  proxies?: ProxyConfig[];
  rewrite?: RewriteRule[];
  historyApiFallback?: boolean;
  helmetOption?: HelmetOptions;
  splunk?: SplunkOption;
  morganFormat?: string;
  morganSkip?: string | ((req: any, res: any) => boolean);
  loggerLevel?: LoggerLevel;
  rateLimitOption?: Partial<RateLimitOptions>;
  requestBodySize?: string;
  healthCheckPath?: string;
}
