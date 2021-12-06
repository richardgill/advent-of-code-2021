import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';
import memoize from 'https://esm.sh/fast-memoize';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => input.trim().split(',').map((n) => parseInt(n, 10));

let singleFishAtDay = (timer, days) => {
  console.log('\n\nsingleFishAtDay', timer, days);
  const daysLeftWhenFirstReaches0 = days - timer - 1;
  console.log('daysLeftWhenFirstReaches0', daysLeftWhenFirstReaches0);
  const fishItWillProduce = daysLeftWhenFirstReaches0 >= 0 ? (Math.floor((daysLeftWhenFirstReaches0) / 7) + 1) : 0;
  console.log(`fishItWillProduce: ${fishItWillProduce}`);
  // console.log('wut', _.times(fishItWillProduce, (n) => singleFishAtDay(8, daysLeftWhenFirstReaches0 - (n * 6))));
  const childFishCounts = _.times(fishItWillProduce, (n) => singleFishAtDay(8, daysLeftWhenFirstReaches0 - (n * 7)));
  console.log('childFishCounts', childFishCounts);
  const result = 1 + _.sum(childFishCounts);
  console.log('result', result);
  return result;
};

singleFishAtDay = memoize(singleFishAtDay);
const fishAtDay = (timers, days) => _.chain(timers).map((t) => singleFishAtDay(t, days)).sum().value();

export const solve = (input) => {
  const timers = parseInput(input);
  console.log('timers', timers.join(','));
  return fishAtDay(timers, 256);
};
// console.log(solve('0'), '\n\n\n');
console.log(solve(readInput('example1.txt')), '\n\n\n');
// console.log(solve(readInput('example2.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
