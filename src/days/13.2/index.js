import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const write = (text) => {
  Deno.writeSync(Deno.stdout, new TextEncoder().encode(text));
};

const printDots = (dots) => {
  const maxX = _.maxBy(dots, 'x').x;
  const maxY = _.maxBy(dots, 'y').y;
  for (let y = 0; y <= maxY; y++) {
    for (let x = 0; x <= maxX; x++) {
      const dot = _.find(dots, { x, y });
      if (dot) {
        write('#');
      } else {
        write('.');
      }
    }
    write('\n');
  }
};

const parseInput = (input) => {
  const [dotsString, foldsString] = input.trim().split('\n\n');
  const dots = dotsString.split('\n').map((line) => {
    const [x, y] = line.split(',');
    return { x: parseInt(x), y: parseInt(y) };
  });
  const folds = foldsString.trim().split('\n').map((line) => {
    const [along, index] = line.replace('fold along', '').trim().split('=');
    return { along, index: parseInt(index) };
  });
  return { dots, folds };
};

const flipCoordinatesY = (dots, fold) => dots.map((dot) => ({ x: dot.x, y: fold.index - (dot.y - fold.index) }));

const flipCoordinatesX = (dots, fold) => dots.map((dot) => ({ x: fold.index - (dot.x - fold.index), y: dot.y }));

const mergeDots = (dots1, dots2) => {
  return _.uniqWith(_.concat(dots1, dots2), _.isEqual);
};

const doFold = (dots, fold) => {
  let partitionDots;
  let flipDots;
  if (fold.along === 'y') {
    partitionDots = (dot) => dot.y < fold.index;
    flipDots = flipCoordinatesY;
  } else {
    partitionDots = (dot) => dot.x < fold.index;
    flipDots = flipCoordinatesX;
  }
  const originalDots = dots.filter(partitionDots);
  const foldDots = dots.filter((dot) => !partitionDots(dot));
  const flippedFoldDots = flipDots(foldDots, fold);
  return mergeDots(originalDots, flippedFoldDots);
};

export const solve = (input) => {
  let { dots, folds } = parseInput(input);
  for (const fold of folds) {
    dots = doFold(dots, fold);
  }
  printDots(dots);
};

solve(readInput('example1.txt'));
console.log('\n');
solve(readInput('puzzleInput.txt'));
