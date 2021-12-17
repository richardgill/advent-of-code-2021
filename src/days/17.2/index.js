import _ from 'lodash';

const doSteps = (target, velocity) => {
  let currentPosition = { x: 0, y: 0 };
  const steps = [currentPosition];
  while (currentPosition.x < target.toX && currentPosition.y > target.fromY) {
    currentPosition = { x: currentPosition.x + velocity.x, y: currentPosition.y + velocity.y };
    steps.push({ ...currentPosition });
    if (
      currentPosition.x >= target.fromX && currentPosition.x <= target.toX && currentPosition.y >= target.fromY &&
      currentPosition.y <= target.toY
    ) {
      return steps;
    }
    velocity.x = Math.max(velocity.x - 1, 0);
    velocity.y -= 1;
  }
};

const countVelocities = (target) => {
  const steps = _.flatMap(_.range(-1000, 1000), (x) => {
    return _.range(-1000, 1000).map((y) => {
      return { x, y, steps: doSteps(target, { x, y }) };
    });
  });
  return _.chain(steps).filter((s) => !_.isNil(s.steps)).size().value();
};

export const solve = (target) => {
  return countVelocities(target);
};

console.log(solve({ fromX: 20, toX: 30, fromY: -10, toY: -5 }), '\n\n\n');
console.log(solve({ fromX: 282, toX: 314, fromY: -80, toY: -45 }), '\n\n\n');
