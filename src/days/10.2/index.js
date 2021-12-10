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

const startBrackets = _.keys(brackets);

const autoCompleteScores = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
};

const findClosingBrackets = (line) => {
  const stack = [];
  for (const char of line) {
    if (startBrackets.includes(char)) {
      stack.push(char);
    } else if (brackets[_.last(stack)] === char) {
      stack.pop();
    } else {
      // error line
      return null;
    }
  }
  return _.chain(stack).map((char) => brackets[char]).reverse().value();
};

const scoreClosingBrackets = (closingBrackets) => {
  let score = 0;
  for (const char of closingBrackets) {
    score *= 5;
    score += autoCompleteScores[char];
  }
  return score;
};

const middleValue = (values) => {
  const sorted = _.sortBy(values);
  const middleIndex = Math.floor(sorted.length / 2);
  return sorted[middleIndex];
};

export const solve = (input) => {
  const lines = parseInput(input);
  const scores = _.chain(lines)
    .map(findClosingBrackets)
    .filter((line) => line !== null)
    .map((line) => scoreClosingBrackets(line))
    .value();
  return middleValue(scores);
};

console.log(solve('{([(<{}[<>[]}>{[]{[(<()>'), '\n\n\n');
console.log(solve('[({(<(())[]>[[{[]{<()<>>'), '\n\n\n');
console.log(solve('[(()[<>])]({[<{<<[]>>('), '\n\n\n');
console.log(solve('(((({<>}<{<{<>}{[]{[]{}'), '\n\n\n');
console.log(solve('{<[[]]>}<{[{[{[]{()[[[]'), '\n\n\n');
console.log(solve('<{([{{}}[<[[[<>{}]]]>[]]'), '\n\n\n');
console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
