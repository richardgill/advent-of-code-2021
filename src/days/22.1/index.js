import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => {
  return input.trim().split('\n').map((line) => {
    const [state, _coordinates] = line.split(' ');
    const [x, y, z] = line.trim().split(',').map((coordinate) => {
      const [_direction, rest] = coordinate.split('=');
      const [from, to] = rest.split('..').map((x) => parseInt(x, 10));
      return {
        from,
        to,
      };
    });
    return { state, x, y, z };
  });
};

const empty3dArray = () => {
  return Array(101).fill(0).map(() => Array(101).fill(0).map(() => Array(101).fill(0)));
};

const isValueInBounds = (value) => value >= -50 && value <= 50;
const isInBounds = (coordinate) => {
  return isValueInBounds(coordinate.from) && isValueInBounds(coordinate.to);
};

export const solve = (input) => {
  const instuctions = parseInput(input).filter(({ x, y, z }) => isInBounds(x) && isInBounds(y) && isInBounds(z));
  console.log(instuctions);
  const states = empty3dArray();
  for (const { state, x, y, z } of instuctions) {
    for (const xIndex of _.range(x.from, x.to + 1)) {
      for (const yIndex of _.range(y.from, y.to + 1)) {
        for (const zIndex of _.range(z.from, z.to + 1)) {
          // console.log('state, x, y, z = ', state, x, y, z, xIndex, yIndex, zIndex);
          states[xIndex + 50][yIndex + 50][zIndex + 50] = state;
        }
      }
    }
  }
  const onCount = _.flattenDeep(states).filter((value) => value === 'on').length;
  return onCount;
};
console.log(_.range(-20, 20));
console.log(solve(readInput('example1.txt')), '\n\n\n');
// console.log(solve(readInput('example2.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
