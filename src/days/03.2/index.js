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

const mostCommonBit = (binaryNumber, tiebreakResult = 1) => {
  const counts = _.countBy(binaryNumber);
  if (counts['0'] === counts['1']) {
    return tiebreakResult;
  }
  return counts['1'] > counts['0'] ? 1 : 0;
};

const leastCommonBit = (binaryNumber, tiebreakResult = 0) => {
  return mostCommonBit(invert(binaryNumber), tiebreakResult);
};

const findRating = (binaryNumbers, bitCalculator) => {
  const binaryNumberDigits = binaryNumbers[0].length;
  for (let digitIndex = 0; digitIndex < binaryNumberDigits; digitIndex++) {
    const bitsForDigitIndex = transposeArray(binaryNumbers)[digitIndex];
    const bit = bitCalculator(bitsForDigitIndex);
    binaryNumbers = binaryNumbers.filter((x) => x[digitIndex] === bit);
    if (binaryNumbers.length === 1) {
      return binaryNumbers[0];
    }
  }
};

export const solve = (input) => {
  const diagnosticReport = parseInput(input);
  const oxygenRating = findRating(diagnosticReport, mostCommonBit);
  const co2Rating = findRating(diagnosticReport, leastCommonBit);
  return binaryNumberToInt(oxygenRating) * binaryNumberToInt(co2Rating);
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
