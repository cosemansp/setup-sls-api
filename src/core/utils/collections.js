/* eslint-disable import/prefer-default-export */

const isUndefined = (val) => val === undefined;

export const pickBy = (obj, predicate = isUndefined) => {
  const resultObj = { ...obj };
  return Object.keys(resultObj).forEach(
    (key) => predicate(resultObj[key]) && delete resultObj[key],
  );
};
