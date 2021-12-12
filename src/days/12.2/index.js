import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => {
  return input.trim().split('\n').map((line) => line.trim().split('-'));
};

const isLowerCase = (str) => str == str.toLowerCase() && str != str.toUpperCase();

const haveVisitedSmallCaveTwice = (caves) => {
  return _.chain(caves)
    .filter((cave) => isLowerCase(cave)).countBy().values().max().value() > 1;
};

const nextCavesToVisit = (currentCave, caves) => {
  const forwards = caves
    .filter((cave) => cave[0] === currentCave)
    .map((cave) => cave[1]);
  const backwards = caves
    .filter((cave) => cave[1] === currentCave)
    .map((cave) => cave[0]);
  return [...forwards, ...backwards];
};

const findCavePaths = (caves, soFar) => {
  const currentCave = _.last(soFar);
  if (currentCave === 'end') {
    // this hack makes flapMap work properly (because the result is not an array, so results cannot be flattened)
    return { result: soFar };
  }

  return _.chain(nextCavesToVisit(currentCave, caves))
    .reject((cave) => cave === 'start' || haveVisitedSmallCaveTwice(soFar) && isLowerCase(cave) && _.includes(soFar, cave))
    .flatMap((caveToVisit) => {
      return findCavePaths(caves, [...soFar, caveToVisit]);
    })
    .value();
};

export const solve = (input) => {
  const caves = parseInput(input);
  const paths = findCavePaths(caves, ['start']).map((r) => r.result);
  console.log('paths', paths);
  return paths.length;
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('example2.txt')), '\n\n\n');
console.log(solve(readInput('example3.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
