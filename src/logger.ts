import https from 'https';
import http from 'http';
import { URL } from 'url';
import { getConfig } from './config';
import { LoggerLevel, ShieldConfig, SplunkOption } from './models/Config';

const LEVEL_PRIORITY: Record<LoggerLevel, number> = {
  error: 0,
  warn: 1,
  info: 2,
  log: 3,
  debug: 4,
};

function sendToSplunkHEC(splunk: SplunkOption, event: Record<string, any>): void {
  if (!splunk.token || !splunk.host) return;

  const payload = JSON.stringify({
    event,
    source: splunk.source || 'shield-server',
    sourcetype: splunk.sourceType || '_json',
    ...(splunk.sourceHost ? { host: splunk.sourceHost } : {}),
  });

  try {
    const url = new URL(`${splunk.host}/services/collector/event`);
    const isHttps = url.protocol === 'https:';
    const transport = isHttps ? https : http;

    const options: http.RequestOptions = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 8088),
      path: url.pathname,
      method: 'POST',
      headers: {
        Authorization: `Splunk ${splunk.token}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
      ...(isHttps ? { rejectUnauthorized: false } : {}),
    };

    const req = transport.request(options);
    req.on('error', () => {
      // Silently fail — don't crash the app for logging failures
    });
    req.write(payload);
    req.end();
  } catch {
    // Silently fail
  }
}

export class Logger {
  private level: LoggerLevel;
  private splunk: SplunkOption;

  constructor(options?: Partial<ShieldConfig>) {
    const config = getConfig(options);
    this.level = config.loggerLevel || 'info';
    this.splunk = config.splunk || {};
  }

  private shouldLog(level: LoggerLevel): boolean {
    return LEVEL_PRIORITY[level] <= LEVEL_PRIORITY[this.level];
  }

  private toSplunk(level: string, message: any, ...args: any[]): void {
    if (!this.splunk.token || !this.splunk.host) return;

    const event: Record<string, any> = {
      level,
      message: typeof message === 'string' ? message : JSON.stringify(message),
    };

    if (args.length > 0) {
      event.data = args;
    }

    sendToSplunkHEC(this.splunk, event);
  }

  error(message: any, ...args: any[]): void {
    if (!this.shouldLog('error')) return;
    console.error(message, ...args);
    this.toSplunk('error', message, ...args);
  }

  warn(message: any, ...args: any[]): void {
    if (!this.shouldLog('warn')) return;
    console.warn(message, ...args);
    this.toSplunk('warn', message, ...args);
  }

  info(message: any, ...args: any[]): void {
    if (!this.shouldLog('info')) return;
    console.info(message, ...args);
    this.toSplunk('info', message, ...args);
  }

  log(message: any, ...args: any[]): void {
    if (!this.shouldLog('log')) return;
    console.log(message, ...args);
    this.toSplunk('log', message, ...args);
  }

  debug(message: any, ...args: any[]): void {
    if (!this.shouldLog('debug')) return;
    console.debug(message, ...args);
    this.toSplunk('debug', message, ...args);
  }
}

export const logger = new Logger();
