import _ from 'lodash';

export const transposeArray = (array) => {
  return _.zip(...array);
};

export const printArrayOfArrays = (arrayOfArrays) => {
  return arrayOfArrays.map((row) => row.join('')).join('\n');
};
