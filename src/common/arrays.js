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

export const pad2dArraySides = (array, paddingSize, fillWith) => {
  const top = _.times(paddingSize, () => new Array(array.length + (paddingSize * 2)).fill(fillWith));
  const bottom = _.times(paddingSize, () => new Array(array.length + (paddingSize * 2)).fill(fillWith));
  const middle = array.map((row) => [...new Array(paddingSize).fill(fillWith), ...row, ...new Array(paddingSize).fill(fillWith)]);
  return [...top, ...middle, ...bottom];
};
