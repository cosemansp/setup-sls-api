import productRepository from '@/data/productRepository';

const createProductCommand = (resource) => {
  const newProduct = {
    ...resource,
    id: new Date().valueOf(),
    image: resource.image || 'https://dummyimage.com/300x300.jpg',
  };

  // Add to users's
  productRepository.add(newProduct);
  return newProduct;
};

export default createProductCommand;
