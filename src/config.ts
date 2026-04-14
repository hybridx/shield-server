import path from 'path';
import { cosmiconfigSync } from 'cosmiconfig';
import merge from 'lodash/merge';
import { ShieldConfig } from './models/Config';

const defaultConfig: ShieldConfig = {
  name: '',
  compression: true,
  cors: false,
  mode: 'static',
  morganFormat: 'combined',
  port: 8080,
  debug: false,
  splunk: {},
  historyApiFallback: false,
  helmetOption: {},
  loggerLevel: 'info',
  requestBodySize: '100kb',
  healthCheckPath: '/server-health',
};

function loadRcConfig(): Partial<ShieldConfig> {
  try {
    const explorer = cosmiconfigSync('shield');

    // Search from CWD (standard cosmiconfig behavior)
    const result = explorer.search();
    if (result?.config) return result.config;

    // In monorepos, CWD is the workspace root, not the app directory.
    // Also search from the directory of the main entry module.
    if (require.main?.filename) {
      const mainDir = path.dirname(require.main.filename);
      if (mainDir !== process.cwd()) {
        const mainResult = explorer.search(mainDir);
        if (mainResult?.config) return mainResult.config;
      }
    }

    // Search from SHIELD_CONFIG_PATH if set
    if (process.env.SHIELD_CONFIG_PATH) {
      const loaded = explorer.load(process.env.SHIELD_CONFIG_PATH);
      if (loaded?.config) return loaded.config;
    }

    return {};
  } catch {
    return {};
  }
}

function loadEnvConfig(): Partial<ShieldConfig> {
  const env: Partial<ShieldConfig> = {};
  const splunkEnv: Record<string, string | undefined> = {
    host: process.env.SPLUNK_HOST,
    token: process.env.SPLUNK_TOKEN,
    source: process.env.SPLUNK_SOURCE,
    sourceType: process.env.SPLUNK_SOURCE_TYPE,
    sourceHost: process.env.SPLUNK_SOURCE_HOST,
  };

  const hasSplunkEnv = Object.values(splunkEnv).some((v) => v !== undefined);
  if (hasSplunkEnv) {
    env.splunk = {};
    for (const [key, value] of Object.entries(splunkEnv)) {
      if (value !== undefined) {
        (env.splunk as any)[key] = value;
      }
    }
  }

  if (process.env.LOGGER_LEVEL) {
    env.loggerLevel = process.env.LOGGER_LEVEL as ShieldConfig['loggerLevel'];
  }

  return env;
}

export function getConfig(overrides?: Partial<ShieldConfig>): ShieldConfig {
  const rcConfig = loadRcConfig();
  const envConfig = loadEnvConfig();
  return merge({}, defaultConfig, rcConfig, envConfig, overrides ?? {});
}
