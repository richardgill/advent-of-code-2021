import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const hasAllSegmentsFromSingle = (signals, alreadyKnown, digit) => {
  const digitSignalPattern = _.find(alreadyKnown, (ak) => ak.digit === digit)?.signalPattern;
  return digitSignalPattern && _.every(digitSignalPattern, (d) => signals.includes(d));
};

const notHasAllSegementsFrom = (signals, alreadyKnown, digit) => {
  const digitSignalPattern = _.find(alreadyKnown, (ak) => ak.digit === digit)?.signalPattern;
  return digitSignalPattern && !_.every(digitSignalPattern, (d) => signals.includes(d));
};

const hasAllSegmentsFrom = (signals, alreadyKnown, digits) => {
  return _.every(digits, (d) => hasAllSegmentsFromSingle(signals, alreadyKnown, d));
};

const DIGITS = [
  { digit: 7, isDigit: (signals) => signals.length === 3 },
  { digit: 4, isDigit: (signals) => signals.length === 4 },
  {
    digit: 1,
    isDigit: (signals) => signals.length === 2,
  },
  {
    digit: 8,
    isDigit: (signals) => signals.length === 7,
  },
  {
    digit: 2,
    isDigit: (signals, alreadyKnown) => signals.length === 5 && [3, 5].every((d) => alreadyKnown.map((ak) => ak.digit).includes(d)),
  },
  {
    digit: 3,
    isDigit: (signals, alreadyKnown) =>
      signals.length === 5 && hasAllSegmentsFrom(signals, alreadyKnown, [1, 7]) && notHasAllSegementsFrom(signals, alreadyKnown, 4),
  },
  {
    digit: 5,
    isDigit: (signals, alreadyKnown) => {
      const six = _.find(alreadyKnown, (ak) => ak.digit === 6);
      return signals.length === 5 && six && signals.every((s) => six.signalPattern.includes(s));
    },
  },
  {
    digit: 0,
    isDigit: (signals, alreadyKnown) => {
      return signals.length === 6 && hasAllSegmentsFrom(signals, alreadyKnown, [1, 7]) && notHasAllSegementsFrom(signals, alreadyKnown, 4);
    },
  },
  {
    digit: 6,
    isDigit: (signals, alreadyKnown) => signals.length === 6 && alreadyKnown.filter((ak) => ak.signalPattern.length === 6).length === 2,
  },
  {
    digit: 9,
    isDigit: (signals, alreadyKnown) => signals.length === 6 && hasAllSegmentsFrom(signals, alreadyKnown, [1, 4, 7]),
  },
];

const parseSignalPatterns = (signalPatterns) => {
  return signalPatterns.trim().split(' ').map((signalPattern) => signalPattern.split(''));
};

const parseInput = (input) => {
  return input.trim().split('\n').map((line) => {
    const [signalPatterns, outputValues] = line.split('|');
    return {
      signalPatterns: parseSignalPatterns(signalPatterns),
      outputValues: parseSignalPatterns(outputValues),
    };
  });
};

const findDigit = (signalPatterns, knownDigits) => {
  return _.find(DIGITS, (d) => d.isDigit(signalPatterns, knownDigits))?.digit;
};

const decodeValue = (signalPattern, knownDigits) => {
  return _.chain(signalPattern).reverse().map((sp, index) => {
    return knownDigits.find((kd) => {
      return _.isEqual(_.sortBy(kd.signalPattern), _.sortBy(sp));
    }).digit * (Math.pow(10, index));
  }).sum().value();
};

const findNumber = (signalPatterns, outputValues) => {
  const knownDigits = [];
  while (signalPatterns.length > 0) {
    const newDigits = _.chain(signalPatterns).map((sp) => ({ signalPattern: sp, digit: findDigit(sp, knownDigits) })).filter((d) =>
      _.isNumber(d.digit)
    )
      .value();
    knownDigits.push(...newDigits);
    signalPatterns = signalPatterns.filter((sp) => !knownDigits.some((kd) => _.isEqual(kd.signalPattern, sp)));
  }
  return decodeValue(outputValues, knownDigits);
};

export const solve = (input) => {
  const inputs = parseInput(input);
  return _.chain(inputs).map(({ signalPatterns, outputValues }) => findNumber(signalPatterns, outputValues)).sum().value();
};

console.log(solve('acedgfb cdfbe gcdfa fbcad dab cefabd cdfgeb eafb cagedb ab | cdfeb fcadb cdfeb cdbaf'), '\n\n\n');
console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
