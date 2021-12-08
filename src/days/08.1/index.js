import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const DIGITS = [{ digit: 7, count: 3 }, { digit: 4, count: 4 }, { digit: 1, count: 2 }, { digit: 8, count: 7 }];

const parseSignalPatterns = (signalPatterns) => {
  return signalPatterns.trim().split(' ').map((signalPattern) => signalPattern.split(''));
};

const parseInput = (input) => {
  return input.trim().split('\n').map((line) => {
    const [signalPatterns, outputValues] = line.split('|');
    return {
      signalPatterns: parseSignalPatterns(signalPatterns),
      outputValues: parseSignalPatterns(outputValues),
    };
  });
};

const isUnique = (signalPattern) => {
  return _.find(DIGITS, (d) => signalPattern.length === d.count);
};

export const solve = (input) => {
  const inputs = parseInput(input);
  console.log(inputs);
  return _.chain(inputs).flatMap(({ outputValues }) => outputValues.filter((ov) => isUnique(ov))).value().length;
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
// console.log(solve(readInput('example2.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
