import _ from 'lodash';
import memoize from 'https://esm.sh/fast-memoize';

const positionToScore = (position) => {
  return position === 0 ? 10 : position;
};

const rollDiracDice = () => {
  return [1, 2, 3].flatMap((d1) => [1, 2, 3].flatMap((d2) => [1, 2, 3].map((d3) => [d1, d2, d3]))).map(_.sum);
};

let playGame = (player1Position, player2Position, player1Score, player2Score, playerTurn, targetScore, diceRolls = 0) => {
  if (player1Score >= targetScore) {
    return [1, 0];
  }
  if (player2Score >= targetScore) {
    return [0, 1];
  }

  let wins;
  if (playerTurn === 1) {
    wins = rollDiracDice().map((diceRoll) => {
      const newPosition = (player1Position + diceRoll) % 10;
      return playGame(
        newPosition,
        player2Position,
        player1Score + positionToScore(newPosition),
        player2Score,
        2,
        targetScore,
        diceRolls + 1,
      );
    });
  } else {
    wins = rollDiracDice().map((diceRoll) => {
      const newPosition = (player2Position + diceRoll) % 10;

      return playGame(
        player1Position,
        newPosition,
        player1Score,
        player2Score + positionToScore(newPosition),
        1,
        targetScore,
        diceRolls + 1,
      );
    });
  }
  return [_.sum(wins.map((win) => win[0])), _.sum(wins.map((win) => win[1]))];
};

playGame = memoize(playGame);

export const solve = (playerPositions) => {
  const [player1WinsUniverses, player2WinsUniverses] = playGame(playerPositions[0], playerPositions[1], 0, 0, 1, 21);
  return _.max([player1WinsUniverses, player2WinsUniverses]);
};

console.log(solve([4, 8]), '\n\n\n');
console.log(solve([4, 0]), '\n\n\n');
