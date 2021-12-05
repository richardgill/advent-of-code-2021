import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => {
  return input.trim().split('\n').map((line) => {
    return line.split(' -> ').map((coordinate) => {
      const [x, y] = coordinate.split(',');
      return { x: parseInt(x, 10), y: parseInt(y, 10) };
    });
  });
};

const createEmptyMap = (lines) => {
  const coordinates = _.flatten(lines);
  const mapWidth = _.maxBy(coordinates, 'x').x + 1;
  const mapHeight = _.maxBy(coordinates, 'y').y + 1;
  return Array(mapWidth).fill(0).map(() => Array(mapHeight).fill(0));
};

// handles positive and negative direction lines
const coordinateRange = (a, b) => {
  return a < b ? _.range(a, b + 1) : _.range(a, b - 1);
};

// fill coordinates out for horizontal and vertical line cases
const fillCoordinates = (xs, ys) => {
  if (xs.length < ys.length) {
    return [_.times(ys.length, () => xs[0]), ys];
  }
  if (xs.length > ys.length) {
    return [xs, _.times(xs.length, () => ys[0])];
  }
  return [xs, ys];
};

const coordinatesBetween = (fromCoordinate, toCoordinate) => {
  const xs = coordinateRange(fromCoordinate.x, toCoordinate.x);
  const ys = coordinateRange(fromCoordinate.y, toCoordinate.y);
  return _.zip(...fillCoordinates(xs, ys)).map(([x, y]) => ({ x, y }));
};

const incrementMap = (map, fromCoordinate, toCoordinate) => {
  coordinatesBetween(fromCoordinate, toCoordinate).forEach((coordinate) => {
    map[coordinate.x][coordinate.y]++;
  });
};

const buildMap = (lines) => {
  const map = createEmptyMap(lines);
  for (const [fromCoordinate, toCoordinate] of lines) {
    incrementMap(map, fromCoordinate, toCoordinate);
  }
  return map;
};

const countGreaterThanEqualTo = (map, threshold) => {
  return _.flatten(map).filter((value) => value >= threshold).length;
};

export const solve = (input) => {
  const lines = parseInput(input);
  const map = buildMap(lines);
  return countGreaterThanEqualTo(map, 2);
};

console.log(solve(readInput('example1.txt')), '\n\n\n');

console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
