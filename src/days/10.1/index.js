import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => {
  return input.trim().split('\n').map((line) => line.trim().split(''));
};

const brackets = {
  '(': ')',
  '[': ']',
  '{': '}',
  '<': '>',
};

const errorScores = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
};

const startBrackets = _.keys(brackets);

const findSyntaxError = (line) => {
  const stack = [];
  for (const char of line) {
    if (startBrackets.includes(char)) {
      stack.push(char);
    } else if (brackets[_.last(stack)] === char) {
      stack.pop();
    } else {
      return char;
    }
  }
};

export const solve = (input) => {
  const lines = parseInput(input);
  const errors = _.chain(lines).map(findSyntaxError).compact().value();
  return _(errors).map((errorBracket) => errorScores[errorBracket]).sum();
};

console.log(solve('{([(<{}[<>[]}>{[]{[(<()>'), '\n\n\n');
console.log(solve('[[<[([]))<([[{}[[()]]]'), '\n\n\n');
console.log(solve('[{[{({}]{}}([{[{{{}}([]'), '\n\n\n');
console.log(solve('[<(<(<(<{}))><([]([]()'), '\n\n\n');
console.log(solve('<{([([[(<>()){}]>(<<{{'), '\n\n\n');
console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
