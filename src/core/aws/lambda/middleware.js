import { isPromise } from '../../utils';
import db from '../../db';

/**
 * Wrapper to convert handler callback to promise.
 * @param  {function} handler - your original AWS Lambda function
 * @return fast exit when event source is 'serverless-plugin-warmup'
 */
export const withWarmup = (handler) => (event, context) => {
  // Immediate response for WarmUP plugin
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return 'Lambda is warm!';
  }

  // Not a warmup, just call inner handler
  return handler(event, context);
};

/**
 * Open the db connection before continue
 * @param  {function} handler - your original AWS Lambda function
 * @return passthrough handler
 */
export const withMongoDb = (config) => (handler) => (event, context) => {
  // Allows a Lambda function to return its result to the caller without requiring
  // that the MongoDB database connection be closed.
  context.callbackWaitsForEmptyEventLoop = false; // eslint-disable-line

  // Map collection binding, eg: db.products.find
  if (config.bindings) {
    config.bindings.forEach((binding) => {
      db.bind(binding);
    });
  }

  // Open db
  return db
    .connect(config.uri)
    .then(() => {
      console.info('DB is connected');
      return handler(event, context);
    })
    .catch((err) => {
      console.error('Failed to open DB', err);
      throw err;
    });
};

/**
 * Wrapper to convert handler callback to promise.
 * @param  {function} handler - your original AWS Lambda function
 * @return a promised based handler function
 */
export const toPromise = (handler) => (event, context) => {
  return new Promise((resolve, reject) => {
    const retVal = handler(event, context, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
    if (isPromise(retVal)) {
      // and handler with callback should not return a promise
      throw new Error('Unexpected promise return value in toPromise middleware');
    }
  });
};
