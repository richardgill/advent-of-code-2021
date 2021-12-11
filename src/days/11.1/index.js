import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';
import { printArrayOfArrays } from '@/common/arrays.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => {
  return input.trim().split('\n').map((line) => line.split('').map((n) => parseInt(n, 10)));
};

const incrementBy1 = (octopi) => {
  for (let y = 0; y < octopi.length; y++) {
    for (let x = 0; x < octopi[0].length; x++) {
      octopi[y][x] = octopi[y][x] + 1;
    }
  }
};

const calcIndexesOfFlashingOctopi = (octopi) => {
  return _.chain(octopi).flatMap((row, y) => {
    return _.map(row, (n, x) => {
      if (n > 9) {
        return { x, y };
      }
    });
  }).compact().value();
};

const resetFlashingOctopi = (octopi, indexesOfFlashingOctopi) => {
  for (const { x, y } of indexesOfFlashingOctopi) {
    octopi[y][x] = 0;
  }
};

const isInBounds = (octopi) => ({ x, y }) => x >= 0 && y >= 0 && x < octopi[0].length && y < octopi.length;

const adjacentIndexes = (octopi, { x, y }) => {
  return [
    { x: x - 1, y },
    { x: x - 1, y: y + 1 },
    { x: x - 1, y: y - 1 },
    { x: x + 1, y },
    { x: x + 1, y: y + 1 },
    { x: x + 1, y: y - 1 },
    { x, y: y - 1 },
    { x, y: y + 1 },
  ].filter(isInBounds(octopi));
};

const incrementAdajacentOctopi = (octopi, indexesOfFlashingOctopi) => {
  for (const index of indexesOfFlashingOctopi) {
    for (const { x, y } of adjacentIndexes(octopi, index)) {
      // 0 octopi have already flashed
      if (octopi[y][x] > 0) {
        octopi[y][x]++;
      }
    }
  }
};

const runStep = (octopi) => {
  incrementBy1(octopi);
  let indexes = calcIndexesOfFlashingOctopi(octopi);
  while (indexes.length > 0) {
    resetFlashingOctopi(octopi, indexes);
    incrementAdajacentOctopi(octopi, indexes);
    indexes = calcIndexesOfFlashingOctopi(octopi);
  }
  return octopi;
};

const runSteps = (octopi, steps) => {
  let flashCount = 0;
  for (let i = 0; i < steps; i++) {
    octopi = runStep(octopi);
    flashCount += _.chain(octopi).flatten().filter((n) => n === 0).size().value();
    console.log(`\n\nafter step ${i + 1}: \n\n${printArrayOfArrays(octopi)}`);
  }
  return flashCount;
};

export const solve = (input) => {
  const octopi = parseInput(input);
  const flashCount = runSteps(octopi, 100);
  return flashCount;
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('example2.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
