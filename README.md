# Setup-sls-api

This is a reference app for a serverless REST api.
See also https://github.com/cosemansp/setup-sls-graphql for an alternative api based on graphql

## Getting started

You can start with the following scripts

```bash
# Create some initial data in MongoDB
export MONGODB_URI=mongodb://localhost:27017/test
npx babel-node ./scripts/seedData.mjs

# Start developing
yarn serve

# Deploy to AWS Lambda
yarn deploy    # default to development

# Deploy to AWS Lambda prod
# make sure you create the '.env.production' file
yarn deploy:production

# Testing
yarn test
```

## Contribute & Develop

We've set up a separate document for our [contribution guidelines](./CONTRIBUTING.md).

## Changelog

For releases, features and bug fixes see our [changelog](./CHANGELOG.md).

## Additional Resources

- https://www.npmjs.com/package/@keboola/middy-error-logger
- https://github.com/jeremydaly/lambda-api
- https://github.com/middyjs/middy
