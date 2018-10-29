# Setup-sls-api

## Getting started

You can start with the following scripts

```bash
# Start developing
yarn serve

# Deploy to AWS Lambda
yarn deploy    # default to development

# Testing
yarn test
```

## Application

The application is created using the ReactJS framework in combination with the Apollo graphql client.

To learn how to start or deploy the application, see the [application guide](./packages/app/README.md).

## Serverless

Our serverless backend is created using the Serverless framework and is being hosted on Amazon web services.

To learn how to start or deploy the application, see the [serverless guide](./packages/serverless/README.md).

## Contribute & Develop

We've set up a separate document for our [contribution guidelines](./CONTRIBUTING.md).

## Changelog

For releases, features and bug fixes see our [changelog](./CHANGELOG.md).

## Additional Resources

- https://www.npmjs.com/package/@keboola/middy-error-logger
- https://github.com/jeremydaly/lambda-api
- https://github.com/middyjs/middy
- https://docs.mongodb.com/stitch/mongodb/actions/collection.find/
- https://mongodb.github.io/node-mongodb-native/api-generated/collection.html#find


There is an optional third parameter that takes an error handler callback. If the underlying getSignedUrl() call fails, the error will be returned using the standard res.error() method. You can override this by providing your own callback.

```
// async/await
api.get('/getLink', async (req,res) => {
  let url = await res.getLink('s3://my-bucket/my-file.pdf')
  return { link: url }
})
```

Want even more convenience? The redirect() method now accepts S3 file references and will automatically generate a signed URL and then redirect the user’s browser.

```
// This will redirect a signed URL using the getLink method
api.get('/redirectToS3File', (req,res) => {
  res.redirect('s3://my-bucket/someFile.pdf')
})
```

More Cache Control

```
// 'cache-control': 'no-cache, no-store, must-revalidate'
res.cache(false).send()

// 'cache-control': 'max-age=1'
res.cache(1000).send()

// 'cache-control': 'private, max-age=30'
res.cache(30000,true).send()
```

- https://www.npmjs.com/package/lambda-log
