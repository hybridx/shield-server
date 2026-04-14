# Shield Server

Express middlewares bundle to bootstrap a backend project in minutes.

## Features

- [Cross-Origin Resource Sharing (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)
- [Compression](https://developer.mozilla.org/fr/docs/Web/HTTP/Compression)
- [History API Fallback](https://developer.mozilla.org/en-US/docs/Web/API/History_API)
- [JSend Response Specification](https://github.com/omniti-labs/jsend) (`res.success`, `res.fail`, `res.error`)
- [Reverse Proxy](https://en.wikipedia.org/wiki/Reverse_proxy)
- [HTTP Header Security (Helmet)](https://owasp.org/www-project-secure-headers/)
- [Splunk HEC Logging](https://docs.splunk.com/Documentation/Splunk/latest/Data/UsetheHTTPEventCollector)
- Rate Limiting
- Error Handlers

## Installation

```shell
npm install @cplabs/shield-server
```

## Usage

### Middleware Mode

```typescript
import express from 'express';
import { defaultMiddlewares, defaultErrorHandlers, logger } from '@cplabs/shield-server';

const app = express();

app.use(defaultMiddlewares());
app.use(defaultErrorHandlers());

app.listen(8080, () => {
  logger.info('Server started on port 8080');
});
```

### CLI Mode

```shell
shield-server .

# With options
shield-server ./public --port 3000 --cors --debug --history-api-fallback
```

#### CLI Flags

- `--port`, `-p` — Port number (default: 8080)
- `--cors` — Enable CORS
- `--debug` — Enable debug logging
- `--history-api-fallback` — Enable SPA history API fallback
- `--ssl-cert` — Path to SSL certificate
- `--ssl-key` — Path to SSL key

## Configuration

Shield Server uses [cosmiconfig](https://github.com/cosmiconfig/cosmiconfig) to load configuration. You can use any of:

- `shield` property in `package.json`
- `.shieldrc` (JSON or YAML)
- `.shieldrc.json`, `.shieldrc.yaml`, `.shieldrc.yml`
- `shield.config.js`, `shield.config.ts`

### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `name` | `string` | `''` | Application name |
| `mode` | `'static' \| 'api' \| 'fullstack'` | `'static'` | Server mode |
| `port` | `number` | `8080` | Port number |
| `debug` | `boolean` | `false` | Enable debug mode |
| `compression` | `boolean` | `true` | Enable response compression |
| `cors` | `boolean` | `false` | Enable CORS |
| `corsOption` | `CorsOptions` | `{}` | CORS options |
| `ssl` | `{ cert, key }` | — | SSL certificate paths |
| `staticDir` | `string` | — | Static files directory |
| `proxies` | `{ from, to }[]` | — | Reverse proxy rules |
| `rewrite` | `{ from, to }[]` | — | URL rewrite rules |
| `historyApiFallback` | `boolean` | `false` | SPA history API fallback |
| `helmetOption` | `HelmetOptions` | `{}` | Helmet security options |
| `splunk` | `SplunkOption` | `{}` | Splunk HEC configuration |
| `morganFormat` | `string` | `'combined'` | Morgan log format |
| `loggerLevel` | `'error' \| 'warn' \| 'info' \| 'log' \| 'debug'` | `'info'` | Log level |
| `rateLimitOption` | `RateLimitOptions` | — | Rate limiting options |
| `requestBodySize` | `string` | `'100kb'` | Max JSON body size |
| `healthCheckPath` | `string` | `'/server-health'` | Health check endpoint |

### Environment Variables

| Variable | Maps to |
|----------|---------|
| `LOGGER_LEVEL` | `loggerLevel` |
| `SPLUNK_HOST` | `splunk.host` |
| `SPLUNK_TOKEN` | `splunk.token` |
| `SPLUNK_SOURCE` | `splunk.source` |
| `SPLUNK_SOURCE_TYPE` | `splunk.sourceType` |
| `SPLUNK_SOURCE_HOST` | `splunk.sourceHost` |

## License

MIT
