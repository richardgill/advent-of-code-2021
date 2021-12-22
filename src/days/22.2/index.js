import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => {
  return input.trim().split('\n').map((line) => {
    const [state, coordinates] = line.split(' ');
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

const empty3dArray = (size) => {
  return Array(size).fill(0).map(() => Array(size).fill(0).map(() => Array(size).fill(0)));
};

const isValueInBounds = (value) => value >= -50 && value <= 50;
const isInBounds = (coordinate) => {
  return isValueInBounds(coordinate.from) && isValueInBounds(coordinate.to);
};

const flattenFromTo = (instructions) => {
  return instructions.flatMap((i) => [i.x.from, i.x.to, i.y.from, i.y.to, i.z.from, i.z.to]);
};

const countOn = (instructions) => {
  if (instructions.length === 0) {
    return 0;
  }
  const maxDimension = _.max([_.max(flattenFromTo(instructions)), Math.abs(_.min(flattenFromTo(instructions)))]);
  const states = empty3dArray((maxDimension * 2) + 1);
  for (const { state, x, y, z } of instructions) {
    for (const xIndex of _.range(x.from, x.to + 1)) {
      for (const yIndex of _.range(y.from, y.to + 1)) {
        for (const zIndex of _.range(z.from, z.to + 1)) {
          states[xIndex + maxDimension][yIndex + maxDimension][zIndex + maxDimension] = state;
        }
      }
    }
  }
  return _.flattenDeep(states).filter((value) => value === 'on').length;
};

const isCoordinateOverlapping = (coordinate1, coordinate2) => {
  return (
    coordinate2.from >= coordinate1.from && coordinate1.from <= coordinate2.to ||
    coordinate2.to >= coordinate1.from && coordinate2.to <= coordinate2.to
  );
};

const isOverlapping = (instruction, currentInstruction) => {
  return (
    isCoordinateOverlapping(instruction.x, currentInstruction.x) &&
    isCoordinateOverlapping(instruction.y, currentInstruction.y) &&
    isCoordinateOverlapping(instruction.z, currentInstruction.z)
  );
};

export const solve = (input) => {
  const instructions = parseInput(input).filter(({ x, y, z }) => isInBounds(x) && isInBounds(y) && isInBounds(z));
  const onChanges = [];
  for (let i = 0; i < instructions.length; i++) {
    const currentInstruction = instructions[i];
    const overlappingInstructions = instructions.slice(0, i).filter((instruction) => isOverlapping(instruction, currentInstruction));
    console.log('overlapping', overlappingInstructions.length);
    const previousCount = countOn(overlappingInstructions);
    const count = countOn([...overlappingInstructions, currentInstruction]);
    onChanges.push(count - previousCount);
  }
  return _.sum(onChanges);
};
console.log(_.range(-20, 20));
// console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('example2.txt')), '\n\n\n');
// console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
