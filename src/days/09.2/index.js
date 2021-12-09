import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => {
  return input.trim().split('\n').map((line) => line.split('').map((x) => parseInt(x, 10)));
};

const getCoordinatesWhere = (points, predicate) => {
  return _.chain(_.range(0, points.length))
    .flatMap(
      (y) =>
        _.range(0, points[0].length)
          .filter((x) => predicate(points[y][x])).map((x) => [x, y]),
    ).value();
};

const clusterBasinPoints = (pointsRaw) => {
  const points = [...pointsRaw];
  const coordinatesInBasin = getCoordinatesWhere(points, (point) => point !== 9);
  const clusters = [];
  while (coordinatesInBasin.length > 0) {
    const [x, y] = coordinatesInBasin.shift();
    const adajacentCoordinates = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    const existingClusters = _.filter(clusters, (cluster) => {
      return _.some(cluster, (c) => _.some(adajacentCoordinates, (c1) => _.isEqual(c, c1)));
    });

    if (existingClusters.length === 0) { // new cluster
      clusters.push([[x, y]]);
    } else if (existingClusters.length === 1) { // 1 existing cluster
      existingClusters[0].push([x, y]);
    } else { // joins two existing clusters - we need to merge them
      const [firstCluster, ...restOfClusters] = existingClusters;
      for (const existingCluster of restOfClusters) {
        clusters.splice(clusters.indexOf(existingCluster), 1); // remove cluster
        firstCluster.push(...existingCluster); // add points to first cluster
      }
      firstCluster.push([x, y]);
    }
  }
  return clusters;
};

export const solve = (input) => {
  const points = parseInput(input);
  const clusteredBasinCoordinates = clusterBasinPoints(points);
  const threeLargest = _.chain(clusteredBasinCoordinates).map((x) => x.length).sortBy().reverse().take(3).value();
  console.log(threeLargest);
  return threeLargest[0] * threeLargest[1] * threeLargest[2];
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
// console.log(solve(readInput('example2.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
