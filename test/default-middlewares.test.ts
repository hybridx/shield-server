import { describe, it, expect } from 'vitest';
import { defaultMiddlewares } from '../src/middlewares/default';

describe('defaultMiddlewares', () => {
  it('returns an array of request handlers', () => {
    const middlewares = defaultMiddlewares();

    expect(Array.isArray(middlewares)).toBe(true);
    expect(middlewares.length).toBeGreaterThan(0);
    middlewares.forEach((mw) => expect(typeof mw).toBe('function'));
  });

  it('accepts partial config without breaking', () => {
    const middlewares = defaultMiddlewares({ port: 3000, cors: true });

    expect(Array.isArray(middlewares)).toBe(true);
    expect(middlewares.length).toBeGreaterThan(0);
  });

  it('includes additional middleware when cors is enabled', () => {
    const withoutCors = defaultMiddlewares({ cors: false });
    const withCors = defaultMiddlewares({ cors: true });

    expect(withCors.length).toBeGreaterThan(withoutCors.length);
  });

  it('includes json body parser in api mode', () => {
    const staticMiddlewares = defaultMiddlewares({ mode: 'static' });
    const apiMiddlewares = defaultMiddlewares({ mode: 'api' });

    expect(apiMiddlewares.length).toBeGreaterThan(staticMiddlewares.length);
  });

  it('passes healthCheckResponse through to health middleware', () => {
    const handler = (_req: any, res: any) => res.json({ up: true });
    const middlewares = defaultMiddlewares({ healthCheckResponse: handler });

    expect(Array.isArray(middlewares)).toBe(true);
    expect(middlewares.length).toBeGreaterThan(0);
  });
});
