/* eslint-disable import/prefer-default-export */

import db from '~/core/db';
import shortid from 'shortid';

export const createProductCommand = (resource) => {
  const newProduct = {
    _id: shortid.generate(),
    ...resource,
    image: resource.image || 'https://dummyimage.com/300x300.jpg',
  };
  // Add to users's
  return db.products.insert(newProduct);
};
