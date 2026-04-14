import express, { RequestHandler } from 'express';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import history from 'connect-history-api-fallback';
import merge from 'lodash/merge';
import { getConfig } from '../config';
import { ShieldConfig } from '../models/Config';
import { log } from './log';
import { responseWrapper } from './responseWrapper';
import { rewrite } from './rewrite';
import { proxy } from './proxy';
import { apiRateLimit } from './apiRateLimit';
import { health } from '../routes/health';
import { info } from '../routes/info';

export function defaultMiddlewares(conf?: Partial<ShieldConfig>): RequestHandler[] {
  const config = getConfig(conf);
  const middlewares: RequestHandler[] = [];

  middlewares.push(log(config));

  if (config.cors) {
    middlewares.push(cors(config.corsOption));
  }

  const helmetOptions = config.cors
    ? merge(
        {},
        {
          crossOriginResourcePolicy: { policy: 'cross-origin' },
          crossOriginOpenerPolicy: false,
          crossOriginEmbedderPolicy: false,
        },
        config.helmetOption,
      )
    : config.helmetOption;

  middlewares.push(helmet(helmetOptions) as unknown as RequestHandler);

  middlewares.push(cookieParser());

  middlewares.push(responseWrapper());

  if (config.mode === 'api' || config.mode === 'fullstack') {
    middlewares.push(express.json({ limit: config.requestBodySize }));
  }

  if (config.compression) {
    middlewares.push(compression());
  }

  if (config.rewrite && config.rewrite.length > 0) {
    middlewares.push(rewrite(config.rewrite));
  }

  if (config.proxies && config.proxies.length > 0) {
    middlewares.push(proxy(config.proxies));
  }

  if (config.historyApiFallback) {
    middlewares.push(history() as unknown as RequestHandler);
  }

  if (config.staticDir) {
    middlewares.push(express.static(config.staticDir));
  }

  middlewares.push(health(config));

  middlewares.push(info(config));

  if (config.rateLimitOption) {
    middlewares.push(apiRateLimit(config.rateLimitOption));
  }

  return middlewares;
}
