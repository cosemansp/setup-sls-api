/* eslint-disable no-underscore-dangle */

/*
# start once
npx babel-node ./scripts/seedData.mjs

# start nodemon
nodemon --exec babel-node ./scripts/seedData.mjs
*/

import faker from 'faker'; // eslint-disable-line
import shortid from 'shortid';

import db from '../src/core/db';
import sampleProducts from './sampleProducts';

// function generateFakeProduct() {
//   return {
//     _id: shortid.generate(),
//     category: faker.commerce.product(),
//     title: faker.hacker.noun(),
//     description: faker.lorem.paragraph(),
//     sku: faker.phone.phoneNumber(),
//     imageUrl: faker.image.imageUrl(),
//     price: faker.commerce.price(),
//     creationAt: faker.date.past(),
//     updatedAt: new Date(),
//   };
// }

// async function seedProducts() {
//   const products = [];
//   for (let i = 0; i < 20000; i += 1) {
//     products.push(generateFakeProduct());
//   }
//   console.log(products);
//   const result = await db.products.insertMany(products);
//   // const products = await db.products.find().toArray();
//   console.log(result);
// }

// open DB and launch seed
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/shop';
db.connect(mongoUri)
  .then(async () => {
    db.bind('products');
    console.log('connected');
    const numberOfProducts = await db.products.count();
    if (!numberOfProducts) {
      const products = sampleProducts.map((product) => {
        const entity = { ...product, _id: shortid.generate(), createdAt: new Date() };
        delete entity.id;
        return entity;
      });
      const result = await db.products.insert(products);
      console.log(result.length, 'products written to db');
    }
  })
  .catch((err) => {
    console.log('err', err);
  })
  .finally(() => {
    db.close();
  });
