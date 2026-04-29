import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getConfig } from '../src/config';

describe('getConfig', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('returns sensible defaults when called with no arguments', () => {
    const config = getConfig();

    expect(config.mode).toBe('static');
    expect(config.port).toBe(8080);
    expect(config.compression).toBe(true);
    expect(config.cors).toBe(false);
    expect(config.debug).toBe(false);
    expect(config.healthCheckPath).toBe('/server-health');
    expect(config.morganFormat).toBe('combined');
    expect(config.loggerLevel).toBe('info');
    expect(config.requestBodySize).toBe('100kb');
    expect(config.historyApiFallback).toBe(false);
  });

  it('merges overrides onto defaults', () => {
    const config = getConfig({ port: 3000, cors: true, mode: 'api' });

    expect(config.port).toBe(3000);
    expect(config.cors).toBe(true);
    expect(config.mode).toBe('api');
    expect(config.compression).toBe(true);
  });

  it('accepts healthCheckResponse as a function override', () => {
    const handler = (_req: any, res: any) => res.json({ up: true });
    const config = getConfig({ healthCheckResponse: handler });

    expect(config.healthCheckResponse).toBe(handler);
  });

  it('accepts healthCheckPath override', () => {
    const config = getConfig({ healthCheckPath: '/custom-health' });

    expect(config.healthCheckPath).toBe('/custom-health');
  });

  it('reads LOGGER_LEVEL from environment', () => {
    process.env.LOGGER_LEVEL = 'debug';
    const config = getConfig();

    expect(config.loggerLevel).toBe('debug');
  });

  it('reads Splunk config from environment', () => {
    process.env.SPLUNK_HOST = 'splunk.example.com';
    process.env.SPLUNK_TOKEN = 'abc123';
    const config = getConfig();

    expect(config.splunk?.host).toBe('splunk.example.com');
    expect(config.splunk?.token).toBe('abc123');
  });

  it('overrides take precedence over environment', () => {
    process.env.LOGGER_LEVEL = 'debug';
    const config = getConfig({ loggerLevel: 'error' });

    expect(config.loggerLevel).toBe('error');
  });
});
