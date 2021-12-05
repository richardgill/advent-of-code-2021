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
const transposeArray = (array) => {
  return _.zip(...array);
};

const printArrayOfArrays = (arrayOfArrays) => {
  return transposeArray(arrayOfArrays).map((row) => row.join(' ')).join('\n');
};

const sortRange = (a, b) => {
  const [low, high] = _.sortBy([a, b]);
  return _.range(low, high + 1);
};

const incrementMap = (map, fromCoordinate, toCoordinate) => {
  if (fromCoordinate.x === toCoordinate.x) {
    sortRange(fromCoordinate.y, toCoordinate.y).forEach((y) => {
      console.log('incrementing', fromCoordinate.x, y);
      map[fromCoordinate.x][y]++;
    });
  } else if (fromCoordinate.y === toCoordinate.y) {
    sortRange(fromCoordinate.x, toCoordinate.x).forEach((x) => {
      console.log('incrementing', x, fromCoordinate.y);

      map[x][fromCoordinate.y]++;
    });
  } else {
    console.log('no increment');
  }
  return map;
};

const buildMap = (lines) => {
  const map = createEmptyMap(lines);
  for (const [fromCoordinate, toCoordinate] of lines) {
    console.log(fromCoordinate, toCoordinate);
    incrementMap(map, fromCoordinate, toCoordinate);

    // console.log('map:', printArrayOfArrays(map), '\n');
  }
  return map;
};

const countGreaterThanEqualTo = (map, threshold) => {
  return _.flatten(map).filter((value) => value >= threshold).length;
};

export const solve = (input) => {
  const lines = parseInput(input);
  console.log(lines);
  const map = buildMap(lines);
  // console.log(printArrayOfArrays(map));
  return countGreaterThanEqualTo(map, 2);
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
// console.log(solve(readInput('example2.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
