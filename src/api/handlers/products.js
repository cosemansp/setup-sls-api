import createApp from 'lambda-api';
import * as yup from 'yup';
import logger from 'lambda-logger-node';

import config from '~/config';
import {
  deleteProductCommand,
  updateProductCommand,
  createProductCommand,
} from '~/domain/commands';
import { NotFoundError, BadRequestError, MethodNotAllowedError } from '~/core/errors';
import { compose } from '~/core';
import db from '~/core/db';
import errorHandler from '~/core/api/middleware/errorHandler';
import validator from '~/core/api/validator';
import { withWarmup, withMongoDb } from '~/core/aws/lambda/middleware';

import productMapper from '../mappers/productMapper';

const api = createApp({
  logger: {
    level: 'debug',
    access: true, // config.env !== 'development',
  },
});

const handleHttpError = (res, error) => {
  res.status(error.statusCode).send(error.payload);
};

const productSchema = yup.object().shape({
  id: yup.number(),
  title: yup.string().required(),
  price: yup.number().required(),
  basePrice: yup.number(),
  stocked: yup.boolean(),
});

api.get('api/products', async () => {
  console.log('get all products');
  const cursor = await db.products.find({}, { rawCursor: true });
  const products = await cursor.limit(50).toArray();
  console.log('  done');
  return products.map((product) => productMapper.map(product));
});

api.get('api/products/:id', async (req, res) => {
  console.info('get product', req.params.id);
  const product = await db.products.findOne({ _id: req.params.id });
  if (!product) {
    return handleHttpError(res, new NotFoundError());
  }
  return productMapper.map(product);
});

api.post('api/products', async (req, res) => {
  // validate
  const result = await validator.validate(productSchema, req);
  if (!result.isValid) {
    return handleHttpError(res, new BadRequestError(result.errors));
  }

  const product = await createProductCommand(req.body);
  return productMapper.map(product);
});

api.put('api/products/:id', async (req, res) => {
  // validate
  const result = await validator.validate(productSchema, req);
  if (!result.isValid) {
    return handleHttpError(res, new BadRequestError(result.errors));
  }

  const product = await updateProductCommand(req.body, req.params.id);
  if (!product) {
    return handleHttpError(res, new NotFoundError());
  }

  return productMapper.map(product);
});

api.delete('api/products/:id', async (req, res) => {
  const product = await deleteProductCommand(req.params.id);
  if (!product) {
    return res.status(204).json();
  }
  return productMapper.map(product);
});

api.any('api/products/*', () => {
  throw new MethodNotAllowedError();
});

// handle cors
api.options('/*', (req, res) => {
  res.cors({
    origin: 'example.com',
    methods: 'GET, POST, DELETE, PUT',
    //    headers: 'content-type, authorization',
    maxAge: 84000000,
  });
});

// handle errors
api.use(errorHandler);

// lambda function
const productsHandler = (event, context) => {
  // logger.setMinimumLogLevel('ERROR');
  // logger.supressCurrentFinalLog();
  // if (config.env === 'development') {
  //   logger.restoreConsoleLog();
  // }
  // console.log({ event, context });
  return api.run(event, context);
};

// export
export default compose(
  // Add lambda-logger-node logger
  // logger,
  withMongoDb({ uri: config.mongoUri, bindings: ['products'] }),
  withWarmup,
)(productsHandler);
