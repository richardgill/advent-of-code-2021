import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';
import { dijkstra } from './l3.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => {
  return input.trim().split('\n').map((line) => line.trim().split('').map((n) => parseInt(n)));
};

const adajaacentIndexes = (cavern, x, y) => {
  return [
    [x + 1, y],
    [x - 1, y],
    [x, y + 1],
    [x, y - 1],
  ].filter(([x, y]) => x >= 0 && y >= 0 && x < cavern.length && y < cavern[0].length);
};

const buildGraph = (cavern) => {
  const graph = {};
  for (let y = 0; y < cavern.length; y++) {
    for (let x = 0; x < cavern[y].length; x++) {
      const node = [x, y];
      graph[node] = {};
      adajaacentIndexes(cavern, x, y).forEach(([x, y]) => {
        graph[node][[x, y]] = cavern[x][y];
      });
    }
  }
  return graph;
};

export const solve = (input) => {
  const cavern = parseInput(input);
  const graph = buildGraph(cavern);
  const path = dijkstra.find_path(graph, '0,0', `${cavern.length - 1},${cavern[0].length - 1}`);
  return _.chain(path)
    .drop(1)
    .map((coordinate) => coordinate.split(',').map((x) => (parseInt(x, 10))))
    .map(([x, y]) => cavern[x][y])
    .sum()
    .value();
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('example2.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
