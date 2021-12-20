import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';
import { pad2dArraySides } from '@/common/arrays.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => {
  const split = input.trim().split('\n\n');
  return { algorithm: split[0], image: split[1].trim().split('\n').map((row) => row.split('')) };
};

const adjacentIndexes = (image, x, y) => {
  return [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1],
  ].filter(([x, y]) => x >= 0 && y >= 0 && x < image.length && y < image[0].length);
};

const lightsToBinary = (lights) => {
  return parseInt(lights.join('').replaceAll('#', '1').replaceAll('.', '0'), 2);
};

const enhance = (image, algorithm) => {
  return image.map((row, y) => {
    return row.map((_value, x) => {
      const adjacentValues = adjacentIndexes(image, x, y).map(([x, y]) => image[y][x]);
      const binaryValue = lightsToBinary(adjacentValues);
      return algorithm[binaryValue];
    });
  });
};

const trimSides = (image, trimCount) => {
  return image.slice(trimCount, image.length - trimCount).map((row) => row.slice(trimCount, row.length - trimCount));
};

const applyEnhancements = (image, algorithm, enhancementCount) => {
  image = pad2dArraySides(image, enhancementCount * 5, '.');
  for (let i = 0; i < enhancementCount; i++) {
    image = trimSides(enhance(image, algorithm), 1);
  }
  return image;
};

export const solve = (input) => {
  const { algorithm, image } = parseInput(input);
  const enhancedImage = applyEnhancements(image, algorithm, 50);
  return _.flatten(enhancedImage).filter((x) => x === '#').length;
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
