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

const flipCoordinatesY = (dots, fold) => {
  return _.map(dots, (dot) => {
    return {
      x: dot.x,
      y: fold.index - (dot.y - fold.index),
    };
  });
};

const flipCoordinatesX = (dots, fold) => {
  return _.map(dots, (dot) => {
    return {
      x: fold.index - (dot.x - fold.index),
      y: dot.y,
    };
  });
};

const mergeDots = (dots1, dots2) => {
  return _.uniqWith(_.concat(dots1, dots2), _.isEqual);
};

const doFold = (dots, fold) => {
  if (fold.along === 'y') {
    const originalDots = dots.filter((dot) => dot.y < fold.index);
    const foldDots = dots.filter((dot) => dot.y > fold.index);
    const flippedFoldDots = flipCoordinatesY(foldDots, fold);
    console.log('originalDots', originalDots);
    printDots(originalDots);
    console.log('\n');
    console.log('foldDots', foldDots);
    printDots(foldDots);
    console.log('\nflipped\n');
    console.log(flippedFoldDots);
    printDots(flippedFoldDots);
    const result = mergeDots(originalDots, flippedFoldDots);
    console.log('\nresult\n');
    console.log('result', result);
    printDots(result);
    return result;
  } else {
    const originalDots = dots.filter((dot) => dot.x < fold.index);
    const foldDots = dots.filter((dot) => dot.x > fold.index);
    const flippedFoldDots = flipCoordinatesX(foldDots, fold);
    console.log('originalDots', originalDots);
    printDots(originalDots);
    console.log('\n');
    console.log('foldDots', foldDots);
    printDots(foldDots);
    console.log('\nflipped\n');
    console.log(flippedFoldDots);
    printDots(flippedFoldDots);
    const result = mergeDots(originalDots, flippedFoldDots);
    console.log('\nresult\n');
    console.log('result', result);
    printDots(result);
    return result;
  }
};

export const solve = (input) => {
  let { dots, folds } = parseInput(input);
  console.log(dots, folds);
  printDots(dots);
  folds = [folds[0]];
  for (const fold of folds) {
    dots = doFold(dots, fold);
  }
  return dots.length;
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
