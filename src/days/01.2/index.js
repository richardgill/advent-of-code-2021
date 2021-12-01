import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const slidingWindow = (array, size) => {
  const result = [];
  for (let i = 0; i < array.length - size + 1; i++) {
    result.push(array.slice(i, i + size));
  }
  return result;
};

export const solve = (input) => {
  const depths = input.trim().split('\n').map((line) => parseInt(line.trim(), 10));
  const depthMovingSum = slidingWindow(depths, 3).map((windowDepths) => _.sum(windowDepths));
  return _.chain(depthMovingSum).filter((depth, index) => index > 0 && depth > depthMovingSum[index - 1]).size().value();
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
