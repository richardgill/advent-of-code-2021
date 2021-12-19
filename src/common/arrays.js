import _ from 'lodash';

export const transposeArray = (array) => {
  return _.zip(...array);
};

export const printArrayOfArrays = (arrayOfArrays, sep = '') => {
  return arrayOfArrays.map((row) => row.join(sep)).join('\n');
};

export const withoutIndex = (array, index) => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};
