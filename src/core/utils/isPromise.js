export default (val) => {
  return val && typeof val.then === 'function';
};
