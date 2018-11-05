import pkg from '../package.json';

export default {
  version: pkg.version,
  env: process.env.NODE_ENV || 'dev',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/shop',
};
