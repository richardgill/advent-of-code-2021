import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);
// 6:43
const parseInstructions = (input) => {
  const instructions = input.trim().split('\n').map((instruction) => {
    const [direction, units] = instruction.split(' ');
    return { direction, units: parseInt(units, 10) };
  });
  return instructions;
};

const followInstructions = (instructions) => {
  let horizontalPosition = 0;
  let depth = 0;
  let aim = 0;
  for (const instruction of instructions) {
    if (instruction.direction === 'forward') {
      horizontalPosition += instruction.units;
      depth += aim * instruction.units;
    } else if (instruction.direction === 'up') {
      aim -= instruction.units;
    } else if (instruction.direction === 'down') {
      aim += instruction.units;
    } else {
      throw new Error('Unknown direction');
    }
  }
  return { horizontalPosition, depth };
};

export const solve = (input) => {
  const instructions = parseInstructions(input);
  console.log(instructions);
  const { horizontalPosition, depth } = followInstructions(instructions);
  return horizontalPosition * depth;
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
