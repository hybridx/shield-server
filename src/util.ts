import { Request } from 'express';

/**
 * Resolves the client IP address from the request.
 *
 * When Express `trust proxy` is configured, prefers `req.ip` which Express
 * derives from the trusted proxy chain. Otherwise falls back to header
 * inspection in priority order: True-Client-IP, X-Real-IP, X-Forwarded-For.
 */
export function getIP(req: Request): string {
  const trustProxy = req.app?.get('trust proxy');

  if (trustProxy && req.ip) {
    return req.ip;
  }

  const trueClientIp = req.headers['true-client-ip'];
  if (trueClientIp && typeof trueClientIp === 'string') return trueClientIp;

  const realIp = req.headers['x-real-ip'];
  if (realIp && typeof realIp === 'string') return realIp;

  const forwardedFor = req.headers['x-forwarded-for'];
  if (forwardedFor) {
    const first = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor.split(',')[0];
    return first.trim();
  }

  if (req.ip) return req.ip;

  return req.socket?.remoteAddress || 'unknown';
}
