import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => {
  const [template, rulesRaw] = input.trim().split('\n\n');
  const rules = _.fromPairs(rulesRaw.split('\n').map((r) => r.split(' -> ')));
  return { template, rules };
};

const getPairs = (template) => {
  return _.chain(template).dropRight(1).map((c, index) => [c, template[index + 1]]).value();
};

const applyRules = (pair, rules) => {
  return [pair[0], rules[pair.join('')]].join('');
};

const doStep = (template, rules) => {
  const pairs = getPairs(template);
  return pairs.map((pair) => applyRules(pair, rules)).join('') + _.last(template);
};

export const solve = (input) => {
  let { template, rules } = parseInput(input);
  for (let step = 0; step < 10; step++) {
    template = doStep(template, rules);
  }
  console.log('frequencies', _.countBy(template));
  const frequencies = _.values(_.countBy(template));
  return _.max(frequencies) - _.min(frequencies);
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
