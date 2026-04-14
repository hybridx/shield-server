#!/usr/bin/env node

import arg from 'arg';
import path from 'path';
import http from 'http';
import https from 'https';
import fs from 'fs';
import express from 'express';
import figlet from 'figlet';
import chalk from 'chalk';
import { getConfig } from '../config';
import { defaultMiddlewares } from '../middlewares/default';
import { defaultErrorHandlers } from '../middlewares/errorHandler';
import { ShieldConfig } from '../models/Config';

const args = arg({
  '--port': Number,
  '--cors': Boolean,
  '--debug': Boolean,
  '--history-api-fallback': Boolean,
  '--ssl-cert': String,
  '--ssl-key': String,
  '-p': '--port',
});

const staticDir = args._[0] ? path.resolve(args._[0]) : undefined;

const cliOverrides: Partial<ShieldConfig> = {};

if (args['--port']) cliOverrides.port = args['--port'];
if (args['--cors']) cliOverrides.cors = true;
if (args['--debug']) {
  cliOverrides.debug = true;
  cliOverrides.loggerLevel = 'debug';
}
if (args['--history-api-fallback']) cliOverrides.historyApiFallback = true;
if (staticDir) cliOverrides.staticDir = staticDir;

if (args['--ssl-cert'] && args['--ssl-key']) {
  cliOverrides.ssl = {
    cert: args['--ssl-cert'],
    key: args['--ssl-key'],
  };
}

const config = getConfig(cliOverrides);
const app = express();

app.use(defaultMiddlewares(config));
defaultErrorHandlers(config).forEach((handler) => app.use(handler));

const port = config.port || 8080;

function startServer() {
  let server: http.Server | https.Server;

  if (config.ssl) {
    const sslOptions = {
      cert: fs.readFileSync(config.ssl.cert),
      key: fs.readFileSync(config.ssl.key),
    };
    server = https.createServer(sslOptions, app);
  } else {
    server = http.createServer(app);
  }

  server.listen(port, async () => {
    const banner = figlet.textSync('Shield', { horizontalLayout: 'fitted' });
    console.log(chalk.green(banner));
    console.log();
    console.log(`  ${chalk.bold('Shield Server')} is running!`);
    console.log();
    console.log(`  ${chalk.bold('Local:')}   ${config.ssl ? 'https' : 'http'}://localhost:${port}`);

    try {
      const { internalIpV4 } = await import('internal-ip');
      const ip = await internalIpV4();
      if (ip) {
        console.log(`  ${chalk.bold('Network:')} ${config.ssl ? 'https' : 'http'}://${ip}:${port}`);
      }
    } catch {
      // internal-ip unavailable, skip network URL
    }

    console.log();

    if (config.debug) {
      console.log(chalk.dim('  Config:'), JSON.stringify(config, null, 2));
      console.log();
    }
  });
}

startServer();
