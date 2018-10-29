import productRepository from '@/data/productRepository';
import { NotFoundError } from '@/errors';

const updateProductCommand = (resource, productId) => {
  const product = productRepository.getById(productId);
  if (!product) {
    throw new NotFoundError('Product not found');
  }

  product.sku = resource.sku;
  product.title = resource.title;
  product.basePrice = resource.basePrice;
  product.price = resource.price || resource.basePrice;
  product.stocked = resource.stocked || false;
  product.desc = resource.desc;
  product.image = resource.image;

  return product;
};

export default updateProductCommand;
