import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => input.trim().split(',').map((x) => parseInt(x, 10));

const lowestFuelPosition = (positions) => {
  const fuels = _.range(_.min(positions), _.max(positions)).map((position) => {
    return _.chain(positions).map((p) => Math.abs(p - position)).sum().value();
  });
  return _.min(fuels);
};

export const solve = (input) => {
  const crabPositions = parseInput(input);

  return lowestFuelPosition(crabPositions);
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
