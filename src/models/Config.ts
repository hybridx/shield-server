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
  /** Set to false only for dev/self-signed certs. Defaults to true. */
  tlsRejectUnauthorized?: boolean;
}

export interface ServerConfig {
  name?: string;
  mode?: ShieldMode;
  port?: number;
  debug?: boolean;
}

export interface SecurityConfig {
  cors?: boolean;
  corsOption?: CorsOptions;
  ssl?: SSLConfig;
  helmetOption?: HelmetOptions;
}

export interface LoggingConfig {
  splunk?: SplunkOption;
  morganFormat?: string;
  morganSkip?: string | ((req: any, res: any) => boolean);
  loggerLevel?: LoggerLevel;
}

export interface StaticConfig {
  staticDir?: string;
  publicPath?: string;
  historyApiFallback?: boolean;
}

export interface RequestConfig {
  compression?: boolean;
  requestBodySize?: string;
  rateLimitOption?: Partial<RateLimitOptions>;
}

export interface RoutingConfig {
  proxies?: ProxyConfig[];
  rewrite?: RewriteRule[];
  healthCheckPath?: string;
  healthCheckResponse?: (req: any, res: any) => void;
}

export interface ShieldConfig
  extends ServerConfig,
    SecurityConfig,
    LoggingConfig,
    StaticConfig,
    RequestConfig,
    RoutingConfig {}
