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
  const rowsAndColumnsToCheck = [...board, ...transposeArray(board)];
  return rowsAndColumnsToCheck.some((row) => row.every((n) => numbers.includes(n)));
};

const calculateScore = (numbers, board) => {
  const unmarkedNumbers = _.chain(board).flatten().without(...numbers).value();
  return _.sum(unmarkedNumbers) * _.last(numbers);
};

const playBingo = (numbers, boards) => {
  let winningBoards = [];
  let index = 0;

  while (winningBoards.length < boards.length) {
    index++;

    const isWinningBoard = (board) => hasBoardWon(numbers.slice(0, index), board);
    const haveSeenBoardBefore = (board) => winningBoards.some((wb) => _.isEqual(wb, board));
    const newWinningBoards = boards
      .filter(isWinningBoard)
      .filter((b) => !haveSeenBoardBefore(b));

    winningBoards = winningBoards.concat(newWinningBoards);
  }
  return calculateScore(numbers.slice(0, index), _.last(winningBoards));
};

export const solve = (input) => {
  const { numbers, boards } = parseInput(input);
  return playBingo(numbers, boards);
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
