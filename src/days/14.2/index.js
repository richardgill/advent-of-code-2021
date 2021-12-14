import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => {
  const [template, rulesRaw] = input.trim().split('\n\n');
  const rules = _.fromPairs(rulesRaw.split('\n').map((r) => r.split(' -> ')));
  return { template, rules };
};

const getPairCounts = (template) => {
  return _.chain(template).dropRight(1).map((c, index) => [c, template[index + 1]].join('')).countBy().value();
};

const doStep = (pairCounts, rules) => {
  for (const [pair, count] of Object.entries(pairCounts)) {
    const newPair1 = `${pair[0]}${rules[pair]}`;
    const newPair2 = `${rules[pair]}${pair[1]}`;
    // the pair has been split up e.g. NN => NCN so we need to -1 from NN
    pairCounts[pair] -= count;
    pairCounts[newPair1] = (pairCounts[newPair1] || 0) + count;
    pairCounts[newPair2] = (pairCounts[newPair2] || 0) + count;
  }
  return pairCounts;
};

const countFrequencies = (pairCounts) => {
  const frequencies = {};
  for (const [pair, count] of Object.entries(pairCounts)) {
    frequencies[pair[0]] = (frequencies[pair[0]] || 0) + count;
    frequencies[pair[1]] = (frequencies[pair[1]] || 0) + count;
  }
  // because we're tracking the pairs, each letter is counted twice, so we half them all.
  for (const [letter] of Object.keys(frequencies)) {
    // L3 Math.ceil lol ¯\_(ツ)_/¯
    frequencies[letter] = Math.ceil(frequencies[letter] / 2);
  }
  return frequencies;
};

export const solve = (input) => {
  const { template, rules } = parseInput(input);
  let pairCounts = getPairCounts(template);
  for (let step = 0; step < 40; step++) {
    pairCounts = doStep(pairCounts, rules);
  }
  const frequencies = _.values(countFrequencies(pairCounts, template));
  return _.max(frequencies) - _.min(frequencies);
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
