import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => input.trim().split(',').map((n) => parseInt(n, 10));

const runDay = (timers) => {
  const originalTimers = timers.map((t) => {
    if (t === 0) {
      return 6;
    }
    return t - 1;
  });
  const newFishCount = _.filter(timers, (t) => t === 0).length;
  return [...originalTimers, ..._.times(newFishCount, () => 8)];
};

const runDays = (timers, days) => {
  _.times(days, (day) => {
    timers = runDay(timers);
    console.log(`${day + 1} days: ${timers.join(',')}, count: ${timers.length}`);
  });
  return timers;
};

export const solve = (input) => {
  const timers = parseInput(input);
  console.log('timers', timers.join(','));
  return runDays(timers, 40).length;
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('example2.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
