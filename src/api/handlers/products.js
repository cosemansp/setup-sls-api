import createApp from 'lambda-api';
import * as yup from 'yup';
import logger from 'lambda-logger-node';

import productRepository from '@/data/productRepository';
import deleteProductCommand from '@/domain/commands/deleteProductCommand';
import updateProductCommand from '@/domain/commands/updateProductCommand';
import createProductCommand from '@/domain/commands/createProductCommand';
import { NotFoundError, BadRequestError } from '@/errors';
import withWarmup from '@/utils/withWarmup';

import productMapper from '../mappers/productMapper';
import errorHandler from '../middleware/errorHandler';
import validator from '../validator';

logger.setMinimumLogLevel('INFO');

const api = createApp({
  // logger: {
  //   level: 'debug',
  //   access: true,
  // },
  logger: false,
});
// productRepository.seedProducts();

const productSchema = yup.object().shape({
  id: yup.number(),
  title: yup.string().required(),
  price: yup.number().required(),
  basePrice: yup.number().required(),
  stocked: yup.boolean(),
});

api.get('api/products', (req) => {
  console.log('get all products1');
  logger.info('get all products2');
  const products = productRepository.getAll();
  return products.map((product) => productMapper.map(product));
});

api.get('api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  console.info('get product1', id);
  logger.info('get product2', id);
  const product = productRepository.getById(id);
  if (!product) {
    throw new NotFoundError();
  }
  res.status(200).send(productMapper.map(product));
});

api.post('api/products', async (req) => {
  // validate
  const result = await validator.validate(productSchema, req);
  if (!result.isValid) {
    throw new BadRequestError(result.errors);
  }

  const product = createProductCommand(req.body);
  return productMapper.map(product);
});

api.put('api/products/:id', async (req) => {
  // validate
  const result = await validator.validate(productSchema, req);
  if (!result.isValid) {
    throw new BadRequestError(result.errors);
  }

  const id = Number(req.params.id);
  const product = updateProductCommand(req.body, id);
  return productMapper.map(product);
});

api.delete('api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const product = deleteProductCommand(id);
  if (!product) {
    res.status(204);
  }
  return productMapper.map(product);
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
  // logger.restoreConsoleLog();

  console.info('just a test');
  return api.run(event, context);
};

// export
export default withWarmup(productsHandler);
