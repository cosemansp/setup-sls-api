import fs from 'fs';
import path from 'path';
import seedProducts from './productList';

// load products from local file
const productsFilePath = path.resolve('./products.json');
console.log('DATA-FILE', productsFilePath);

let products = [];
if (fs.existsSync(productsFilePath)) {
  products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));
}

export default {
  clearProducts() {
    products = [];
    fs.writeFileSync(productsFilePath, JSON.stringify(products));
  },
  seedProducts(count = 100) {
    console.log('seedProducts', count);
    for (let i = 0; i < count; i += 1) {
      products.push(seedProducts[i]);
    }
    fs.writeFileSync(productsFilePath, JSON.stringify(products));
    return products;
  },
  getAll() {
    return products;
  },
  getById(id) {
    return products.find((product) => product.id === id);
  },
  delete(product) {
    products = products.filter((item) => product.id !== item.id);
    fs.writeFileSync(productsFilePath, JSON.stringify(products));
    return products;
  },
  add(product) {
    if (!product.price) {
      // eslint-disable-next-line
      product.price = product.basePrice;
    }
    if (!product.stocked) {
      // eslint-disable-next-line
      product.stocked = false;
    }
    products.push(product);
    fs.writeFileSync(productsFilePath, JSON.stringify(products));
    return product;
  },
  addMany(newProducts) {
    newProducts.forEach((product) => {
      this.addProduct(product);
    });
  },
};
