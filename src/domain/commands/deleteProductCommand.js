import productRepository from '@/data/productRepository';

const deleteProductCommand = (productId) => {
  const product = productRepository.getById(productId);
  if (!product) {
    return null;
  }

  productRepository.delete(product);
  return product;
};

export default deleteProductCommand;
