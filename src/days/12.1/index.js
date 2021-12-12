import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => {
  return input.trim().split('\n').map((line) => line.trim().split('-'));
};

const isLowerCase = (str) => str == str.toLowerCase() && str != str.toUpperCase();

// const visitedSmallCaveTwice = (caves) => {
//   return _.chain(caves)
//     .filter((cave) => isLowerCase(cave)).countBy().values().max().value() > 1;
// };

const nextCavesToVisit = (currentCave, caves) => {
  const forwards = _.chain(caves)
    .filter((cave) => cave[0] === currentCave)
    .map((cave) => cave[1])
    .value();
  const backwards = _.chain(caves)
    .filter((cave) => cave[1] === currentCave)
    .map((cave) => cave[0])
    .value();
  return [...forwards, ...backwards];
};

const findCavePaths = (caves, soFar) => {
  const currentCave = _.last(soFar);
  console.log('currentCave', currentCave, 'soFar', soFar);
  if (currentCave === 'end') {
    return { result: soFar };
  }

  return _.chain(nextCavesToVisit(currentCave, caves))
    .reject((cave) => isLowerCase(cave) && _.includes(soFar, cave))
    .flatMap((caveToVisit) => {
      return findCavePaths(caves, [...soFar, caveToVisit]);
    })
    .value();
};

export const solve = (input) => {
  const caves = parseInput(input);
  console.log(caves);
  const paths = findCavePaths(caves, ['start']).map((r) => r.result);
  console.log('paths', paths);
  console.log('paths', paths.length);
  return 'answer';
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('example2.txt')), '\n\n\n');
console.log(solve(readInput('example3.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
