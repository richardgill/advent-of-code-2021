import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';
import memoize from 'https://esm.sh/fast-memoize';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => input.trim().split(',').map((n) => parseInt(n, 10));

const DAYS_FOR_NEW_FISH_TO_PRODUCE = 8;
const DAYS_TO_PRODUCE_FISH = 7;

let singleFishAtDay = (timer, days) => {
  const daysLeftWhenFirstReaches0 = days - timer - 1;
  const fishItWillProduce = Math.floor((daysLeftWhenFirstReaches0) / DAYS_TO_PRODUCE_FISH) + 1;
  const childFishCounts = _.times(
    fishItWillProduce,
    (n) => singleFishAtDay(DAYS_FOR_NEW_FISH_TO_PRODUCE, daysLeftWhenFirstReaches0 - (n * DAYS_TO_PRODUCE_FISH)),
  );
  return 1 + _.sum(childFishCounts);
};

singleFishAtDay = memoize(singleFishAtDay);

const fishAtDay = (timers, days) => _.chain(timers).map((t) => singleFishAtDay(t, days)).sum().value();

export const solve = (input) => {
  const timers = parseInput(input);
  return fishAtDay(timers, 256);
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
