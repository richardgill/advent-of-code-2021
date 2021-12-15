import _ from 'lodash';

export const transposeArray = (array) => {
  return _.zip(...array);
};

export const printArrayOfArrays = (arrayOfArrays, sep = '') => {
  return arrayOfArrays.map((row) => row.join(sep)).join('\n');
};
