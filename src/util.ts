import { Request } from 'express';

export function getIP(req: Request): string {
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
