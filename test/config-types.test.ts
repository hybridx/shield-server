import { describe, it, expect } from 'vitest';
import { getConfig } from '../src/config';
import type {
  ShieldConfig,
  ServerConfig,
  SecurityConfig,
  LoggingConfig,
  StaticConfig,
  RequestConfig,
  RoutingConfig,
} from '../src/models/Config';

describe('ShieldConfig sub-interface compatibility', () => {
  it('ShieldConfig is assignable from a union of all sub-interfaces', () => {
    const server: ServerConfig = { name: 'app', mode: 'api', port: 3000, debug: true };
    const security: SecurityConfig = { cors: true };
    const logging: LoggingConfig = { loggerLevel: 'debug', morganFormat: 'tiny' };
    const staticCfg: StaticConfig = { staticDir: './public' };
    const request: RequestConfig = { compression: false, requestBodySize: '10mb' };
    const routing: RoutingConfig = { healthCheckPath: '/ping' };

    const full: ShieldConfig = {
      ...server,
      ...security,
      ...logging,
      ...staticCfg,
      ...request,
      ...routing,
    };

    const config = getConfig(full);
    expect(config.name).toBe('app');
    expect(config.mode).toBe('api');
    expect(config.cors).toBe(true);
    expect(config.loggerLevel).toBe('debug');
    expect(config.staticDir).toBe('./public');
    expect(config.compression).toBe(false);
    expect(config.healthCheckPath).toBe('/ping');
  });

  it('sub-interfaces can be used independently for typed partial config', () => {
    const routing: RoutingConfig = {
      healthCheckPath: '/health',
      healthCheckResponse: (_req, res) => res.json({ ok: true }),
    };

    const config = getConfig(routing);
    expect(config.healthCheckPath).toBe('/health');
    expect(typeof config.healthCheckResponse).toBe('function');
  });

  it('empty overrides produce valid defaults', () => {
    const config = getConfig({});

    expect(config.port).toBe(8080);
    expect(config.mode).toBe('static');
    expect(config.healthCheckPath).toBe('/server-health');
  });
});
