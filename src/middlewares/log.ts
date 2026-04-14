import morgan from 'morgan';
import { Request, RequestHandler } from 'express';
import { getIP } from '../util';
import { logger } from '../logger';
import { ShieldConfig } from '../models/Config';
import { Writable } from 'stream';

export function log(options: ShieldConfig): RequestHandler {
  morgan.token('remote-addr', (req: Request) => getIP(req));

  morgan.token('remote-user', (req: Request) => {
    const rhUser = req.cookies?.rh_user;
    if (rhUser && typeof rhUser === 'string') {
      const pipeIndex = rhUser.indexOf('|');
      return pipeIndex !== -1 ? rhUser.substring(0, pipeIndex) : rhUser;
    }
    return '-';
  });

  const format = options.morganFormat || 'combined';

  const morganOptions: morgan.Options<Request, any> = {};

  if (options.splunk?.httpRequest) {
    const splunkStream = new Writable({
      write(chunk, _encoding, callback) {
        const line = chunk.toString().trim();
        if (line) {
          logger.info(line);
        }
        callback();
      },
    });
    morganOptions.stream = splunkStream;
  }

  if (options.morganSkip) {
    if (typeof options.morganSkip === 'string') {
      const skipUrl = options.morganSkip;
      morganOptions.skip = (req: Request) => req.url === skipUrl;
    } else {
      morganOptions.skip = options.morganSkip;
    }
  }

  return morgan(format, morganOptions);
}
