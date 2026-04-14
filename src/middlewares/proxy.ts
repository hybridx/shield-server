import { RequestHandler, Request } from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { ProxyConfig } from '../models/Config';

export function proxy(proxies: ProxyConfig[]): RequestHandler {
  const proxyMiddlewares = proxies.map((p) => ({
    from: p.from,
    middleware: createProxyMiddleware({
      target: p.to,
      changeOrigin: true,
      xfwd: true,
    }),
  }));

  return (req: Request, res, next) => {
    const match = proxyMiddlewares.find((p) => req.url.startsWith(p.from));
    if (match) {
      return match.middleware(req, res, next);
    }
    next();
  };
}
