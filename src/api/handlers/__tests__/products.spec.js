import db from '~/core/db';
import handler from '../products';

const context = {
  awsRequestId: 'AWSREQID',
  functionName: 'testFunc',
  memoryLimitInMB: 2048,
  getRemainingTimeInMillis: () => 5000,
};

describe('productcApi function', () => {
  let event;
  beforeEach(() => {
    event = {
      path: '/api/products',
      httpMethod: 'GET',
      body: {},
      headers: {
        'content-type': 'application/json',
      },
    };
  });

  afterEach(() => {
    db.close();
  });

  test('warmup', async () => {
    event = { source: 'serverless-plugin-warmup' };
    const result = await handler(event, context);
    expect(result).toBe('Lambda is warm!');
  });

  test('GetProducts', async () => {
    event.httpMethod = 'GET';
    const result = await handler(event, context);
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.length).toBeGreaterThan(10);
  });
});
