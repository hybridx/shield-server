import { describe, it, expect, vi } from 'vitest';
import { health } from '../src/routes/health';
import { ShieldConfig } from '../src/models/Config';

function createMockReqRes() {
  const req = { method: 'GET', url: '/' } as any;
  const res = {
    statusCode: 200,
    body: undefined as any,
    headersSent: false,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    send(body: any) {
      res.body = body;
      return res;
    },
    json(body: any) {
      res.body = body;
      return res;
    },
  } as any;
  return { req, res };
}

function callRouter(
  handler: ReturnType<typeof health>,
  method: string,
  path: string,
  req: any,
  res: any,
) {
  const next = vi.fn();
  req.method = method;
  req.url = path;
  (handler as any).handle(req, res, next);
}

describe('health route', () => {
  it('responds with default 200 "I\'m OK" when no custom handler is set', () => {
    const config: ShieldConfig = { healthCheckPath: '/server-health' };
    const router = health(config);
    const { req, res } = createMockReqRes();

    callRouter(router, 'GET', '/server-health', req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("I'm OK");
  });

  it('uses custom healthCheckResponse when provided', () => {
    const customHandler = vi.fn((_req: any, res: any) => {
      res.json({ status: 'ok', uptime: 123 });
    });

    const config: ShieldConfig = {
      healthCheckPath: '/server-health',
      healthCheckResponse: customHandler,
    };
    const router = health(config);
    const { req, res } = createMockReqRes();

    callRouter(router, 'GET', '/server-health', req, res);

    expect(customHandler).toHaveBeenCalledOnce();
    expect(res.body).toEqual({ status: 'ok', uptime: 123 });
  });

  it('uses custom healthCheckPath', () => {
    const config: ShieldConfig = { healthCheckPath: '/ping' };
    const router = health(config);
    const { req, res } = createMockReqRes();

    callRouter(router, 'GET', '/ping', req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("I'm OK");
  });

  it('defaults to /server-health when healthCheckPath is not set', () => {
    const config: ShieldConfig = {};
    const router = health(config);
    const { req, res } = createMockReqRes();

    callRouter(router, 'GET', '/server-health', req, res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBe("I'm OK");
  });
});
