/* eslint-disable import/prefer-default-export */

import db from '~/core/db';

export const deleteProductCommand = (productId) => {
  const product = db.products.findOneAndDelete({ _id: productId });
  if (!product) {
    return null;
  }
  return product;
};
