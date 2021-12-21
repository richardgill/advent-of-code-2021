import _ from 'lodash';

let diceValue = 0;
const rollDice = () => {
  let result = 0;
  for (let i = 0; i < 3; i++) {
    diceValue = (diceValue + 1) % 100;
    result += diceValue;
  }
  return result;
};

const playGame = (playerPositions) => {
  diceValue = 0;
  let diceRolls = 0;
  let playerTurn = 0;
  const playerScores = [0, 0];
  while (_.every(playerScores, (score) => score < 1000)) {
    console.log('\n');
    console.log('playerTurn', playerTurn);
    const diceTotal = rollDice();
    diceRolls += 3;
    console.log('diceTotal', diceTotal);
    playerPositions[playerTurn] = (playerPositions[playerTurn] + diceTotal) % 10;
    console.log('playerPositions[playerTurn]', playerPositions[playerTurn]);
    playerScores[playerTurn] += playerPositions[playerTurn] === 0 ? 10 : playerPositions[playerTurn];
    console.log('playerScores[playerTurn]', playerScores[playerTurn]);
    playerTurn = (playerTurn + 1) % 2;
  }
  return [playerScores, diceRolls];
};

export const solve = (playerPositions) => {
  const [endScores, diceRolls] = playGame(playerPositions);
  console.log(endScores, diceRolls);
  const lowerScore = _.min(endScores);
  return lowerScore * diceRolls;
};

console.log(solve([4, 8]), '\n\n\n');
console.log(solve([4, 0]), '\n\n\n');
