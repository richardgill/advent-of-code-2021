import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => {
  return input.trim().split('\n').map((line) => line.split('').map((x) => parseInt(x, 10)));
};

const transposeArray = (array) => {
  return _.zip(...array);
};

const invert = (binaryNumber) => {
  return binaryNumber.map((x) => x === 1 ? 0 : 1);
};

const binaryNumberToInt = (binaryNumber) => {
  return parseInt(_.join(binaryNumber, ''), 2);
};

const mostCommonBit = (binaryNumber) => {
  return parseInt(_.chain(binaryNumber).countBy().toPairs().maxBy(([_x, count]) => count).first().value(), 10);
};

const mostCommonBits = (binaryNumbers) => {
  return transposeArray(binaryNumbers).map(mostCommonBit);
};

const leastCommonBits = (binaryNumbers) => invert(mostCommonBits(binaryNumbers));

export const solve = (input) => {
  const diagnosticReport = parseInput(input);
  const gamma = mostCommonBits(diagnosticReport);
  const epsilon = leastCommonBits(diagnosticReport);

  return binaryNumberToInt(gamma) * binaryNumberToInt(epsilon);
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
