import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseBoard = (boardString) => {
  return boardString.split('\n').map((x) => x.split(/\s+/).filter((n) => !_.isEmpty(n)).map((n) => parseInt(n, 10)));
};

const parseInput = (input) => {
  const lines = input.trim().split('\n');
  const numbers = lines[0].split(',').map((x) => parseInt(x, 10));
  const boards = lines.slice(2).join('\n').split('\n\n').map(parseBoard);
  return { numbers, boards };
};

const transposeArray = (array) => {
  return _.zip(...array);
};

const hasBoardWon = (numbers, board) => {
  const toCheck = [...board, ...transposeArray(board)];
  return toCheck.some((row) => row.every((n) => numbers.includes(n)));
};

const calculateScore = (numbers, board) => {
  console.log('winning numbers', numbers);
  console.log('board', board);
  const unmarkedNumbers = _.chain(board).flatten().without(...numbers).value();

  return _.sum(unmarkedNumbers) * _.last(numbers);
};

const playBingo = (numbers, boards) => {
  let winningBoard;
  let index = 0;
  while (!winningBoard) {
    index++;
    winningBoard = boards.find((board) => hasBoardWon(numbers.slice(0, index), board));
  }
  return calculateScore(numbers.slice(0, index), winningBoard);
};

export const solve = (input) => {
  const { numbers, boards } = parseInput(input);
  console.log('numbers', numbers);
  console.log('boards', boards);
  return playBingo(numbers, boards);
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
