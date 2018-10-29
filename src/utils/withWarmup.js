const withWarmup = (handler) => (event, context) => {
  // Immediate response for WarmUP plugin
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!');
    return 'Lambda is warm!';
  }
  return handler(event, context);
};

export default withWarmup;
