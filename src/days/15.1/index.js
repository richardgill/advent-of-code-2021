import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';
import { printArrayOfArrays } from '@/common/arrays.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => {
  return input.trim().split('\n').map((line) => line.trim().split('').map((n) => parseInt(n)));
};

const adajaacentIndexes = (cavern, x, y) => {
  return [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ].filter(([x, y]) => x >= 0 && y >= 0 && x < cavern.length && y < cavern[0].length);
};

const backwardsAdajaacentIndexes = (cavern, x, y) => {
  return [
    // [x + 1, y],
    [x - 1, y],
    // [x, y + 1],
    [x, y - 1],
  ].filter(([x, y]) => x >= 0 && y >= 0 && x < cavern.length && y < cavern[0].length);
};

const forwardAdajaacentIndexes = (cavern, x, y) => {
  return [
    [x + 1, y],
    // [x - 1, y],
    [x, y + 1],
    // [x, y - 1],
  ].filter(([x, y]) => x >= 0 && y >= 0 && x < cavern.length && y < cavern[0].length);
};

// const calculateLowestPath = (cavern, x, y) => {
//   console.log('x:', x, 'y:', y);
//   const isBottomRightCorner = x === cavern.length - 1 && y === cavern[0].length - 1;
//   if (isBottomRightCorner) {
//     return 0;
//   }
//   console.log(adajaacentIndexes(cavern, x, y));
//   throw new Error('Not implemented');
//   const aadjacentCosts = adajaacentIndexes(cavern, x, y).map(([x1, y1]) => calculateLowestPath(cavern, x1, y1));
//   return _.min(aadjacentCosts) + cavern[x][y];
// };

const calculateLowestPath = (cavern, lowestPaths, x, y) => {
  // console.log('boo x:', x, 'y:', y);
  const isBottomRightCorner = x === cavern.length - 1 && y === cavern[0].length - 1;
  if (isBottomRightCorner) {
    return cavern[x][y];
  }
  // console.log(adajaacentIndexes(cavern, x, y));
  // throw new Error('Not implemented');
  const aadjacentCosts = adajaacentIndexes(cavern, x, y).map(([x1, y1]) => lowestPaths[x1][y1]);
  return _.min(aadjacentCosts) + cavern[x][y];
};

const calculateLowestPaths = (cavern) => {
  const squareWidth = cavern.length;
  const lowestPaths = new Array(squareWidth).fill(Infinity).map(() => new Array(squareWidth).fill(Infinity));
  console.log(lowestPaths);
  let loopCount = 0;
  let nextIndexes = [[squareWidth - 1, squareWidth - 1]];
  while (nextIndexes.length > 0) {
    const [x, y] = nextIndexes.shift();
    // console.log('while x:', x, 'y:', y);
    lowestPaths[x][y] = calculateLowestPath(cavern, lowestPaths, x, y);
    // console.log(printArrayOfArrays(lowestPaths, ' '));
    const indexesToAdd = adajaacentIndexes(cavern, x, y)
      .filter(([x1, y1]) => lowestPaths[x1][y1] === Infinity)
      .filter((index) => !nextIndexes.some((nextIndex) => _.isEqual(nextIndex, index)));
    nextIndexes.push(...indexesToAdd);
    // nextIndexes = _.uniqBy(nextIndexes, _.isEquals);
    console.log('nextIndexes:', nextIndexes);
    loopCount++;
    if (loopCount > 4) {
      // throw new Error('stop');
    }
    // if (nextIndexes.length === 0) {
    //   x--;
    //   y--;
    // } else {
    //   const [x1, y1] = nextIndexes[0];
    //   x = x1;
    //   y = y1;
    // }
  }
  console.log(printArrayOfArrays(lowestPaths, ' '));
  return lowestPaths[0][0] - cavern[0][0];
};

export const solve = (input) => {
  const cavern = parseInput(input);
  // console.log('cavern\n', cavern.length, cavern[0].length);
  // console.log(printArrayOfArrays(cavern));
  return calculateLowestPaths(cavern);
};

// inputs are always square

console.log(solve(readInput('example1.txt')), '\n\n\n');
// console.log(solve(readInput('example2.txt')), '\n\n\n');
// console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
