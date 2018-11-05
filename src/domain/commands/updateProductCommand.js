/* eslint-disable import/prefer-default-export */
import db from '~/core/db';

export const updateProductCommand = async (resource, productId) => {
  return db.products.findOneAndUpdate({ _id: productId }, { $set: resource });
};
