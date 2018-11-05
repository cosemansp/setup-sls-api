export default {
  map(product) {
    const resource = { id: product._id, ...product, _id: undefined };
    return resource;
  },
};
