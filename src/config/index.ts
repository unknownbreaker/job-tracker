import _ from 'lodash';
import fs from 'fs';
const env = process.env.NODE_ENV || 'development';

const tryReadFile = (path: string) => {
  if (fs.existsSync(path)) {
    return JSON.parse(fs.readFileSync(path, 'utf8'));
  } else {
    // eslint-disable-next-line no-console
    console.warn(`Could not find configuration file at path ${path}`);
    return {};
  }
};

const loadConfig = (directory: string) => {
  const baseConfig = tryReadFile(`${directory}/base.json`);
  const envConfig = tryReadFile(`${directory}/${env}.json`);

  const appConfig = _.defaultsDeep({}, envConfig, baseConfig);
  const config = _.mergeWith(
    {},
    process.env,
    appConfig,
    (destVal: any, srcVal: any) => {
      if (!_.isNil(srcVal) && _.isString(srcVal) && !_.isEmpty(srcVal)) {
        return srcVal;
      }
    },
  );

  config[env] = config.db;

  // eslint-disable-next-line no-console
  console.log(`Loaded config using environment: ${env}`);

  return config;
};

module.exports = loadConfig(__dirname);

