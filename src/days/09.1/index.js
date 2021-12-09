import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => {
  return input.trim().split('\n').map((line) => line.split('').map((x) => parseInt(x, 10)));
};

const isLowPoint = (points, x, y) => {
  console.log('x', x, 'y', y);
  const adajacentPoints = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]].map((coordinates) => _.get(points, coordinates)).filter((x) =>
    !_.isNil(x)
  );
  const point = points[x][y];
  console.log('adajacentPoints', adajacentPoints, point);
  console.log('isLowPoint', _.every(adajacentPoints, (adajacentPoint) => point < adajacentPoint));
  return _.every(adajacentPoints, (adajacentPoint) => point < adajacentPoint);
};

export const solve = (input) => {
  const points = parseInput(input);
  console.log(points);
  const lowPoints = _.chain(_.range(0, points.length))
    .flatMap(
      (x) =>
        _.range(0, points[0].length)
          .filter((y) => isLowPoint(points, x, y)).map((y) => points[x][y]),
    ).value();
  console.log('lowPoints', lowPoints);
  return _.sum(lowPoints.map((x) => x + 1));
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
// console.log(solve(readInput('example2.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
