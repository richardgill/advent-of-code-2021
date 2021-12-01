import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

export const solve = (input) => {
  const depths = input.trim().split('\n').map((line) => parseInt(line.trim(), 10));
  return _.chain(depths).filter((depth, index) => index > 0 && depth > depths[index - 1]).size().value();
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
