import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => input.trim().split(',').map((x) => parseInt(x, 10));

const calculateFuel = (distance) => {
  return _.sum(_.range(1, distance + 1));
};

const lowestFuelPosition = (positions) => {
  const possiblePositions = _.range(_.min(positions), _.max(positions));
  const fuelCosts = possiblePositions.map((position) => {
    return _(positions).map((p) => {
      const distance = Math.abs(p - position);
      return calculateFuel(distance);
    }).sum();
  });
  return _.min(fuelCosts);
};

export const solve = (input) => {
  const crabPositions = parseInput(input);
  return lowestFuelPosition(crabPositions);
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
