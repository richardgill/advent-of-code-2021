import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';
import { withoutIndex } from '@/common/arrays.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => {
  return input.trim().split(/--- scanner \d+ ---\n/).slice(1).map((scannerString) => {
    return scannerString.trim().split('\n').map((beaconString) => {
      return beaconString.trim().split(',').map((x) => parseInt(x, 10));
    });
  });
};

const beaconDiff = (beacon1, beacon2) => {
  return [beacon1[0] - beacon2[0], beacon1[1] - beacon2[1], beacon1[2] - beacon2[2]];
};

const scannerDifferences = (scanner1) => {
  return scanner1.map((beacon, index) => {
    const otherBeacons = withoutIndex(scanner1, index);
    const diffs = otherBeacons.map((otherBeacon) => {
      return beaconDiff(beacon, otherBeacon);
    });
    return { beacon, diffs };
  });
};

const isEqualAbsolute = (coordinate1, coordinate2) => {
  return _.every(coordinate1, (x, index) => Math.abs(x) === Math.abs(coordinate2[index]));
};

const isDiffEqual = ([ax, ay, az], [bx, by, bz]) => {
  return isEqualAbsolute([ax, ay, az], [bx, by, bz]) ||
    isEqualAbsolute([ax, az, ay], [bx, by, bz]) ||
    isEqualAbsolute([ay, az, ax], [bx, by, bz]) ||
    isEqualAbsolute([ay, ax, az], [bx, by, bz]) ||
    isEqualAbsolute([az, ay, ax], [bx, by, bz]) ||
    isEqualAbsolute([az, ax, ay], [bx, by, bz]);
};

const scannerMatches = (scanner1, scanner2) => {
  const scanner1Diffs = scannerDifferences(scanner1);
  const scanner2Diffs = scannerDifferences(scanner2);
  const matchedBeacons = scanner1Diffs.map(({ beacon, diffs }) => {
    const matchedBeacon = _.find(scanner2Diffs, (scanner2Diff) => {
      const diffs2 = scanner2Diff.diffs;
      return diffs2.filter((diff2) => _.find(diffs, (diff) => isDiffEqual(diff, diff2))).length >= 11;
    });
    if (!matchedBeacon) {
      return null;
    }
    return { beacon, diffs, matchedBeacon };
  });
  return _.compact(matchedBeacons).map(({ beacon, matchedBeacon }) => ({ beacon1: beacon, beacon2: matchedBeacon.beacon }));
};

const doScannersOverlap = (scanner1, scanner2) => {
  return scannerMatches(scanner1, scanner2).length >= 12;
};

const rearrange = (beacon, rearrange) => {
  return [beacon[rearrange[0]], beacon[rearrange[1]], beacon[rearrange[2]]];
};

const applyTranslation = (scanner, translation) => {
  return scanner.map((beacon) => {
    return rearrange(beacon, translation.rearrange).map((b, index) => {
      return (b * translation.multipliers[index]) + translation.adds[index];
    });
  });
};

const calculateDifferences = (scanner1, scanner2, colIndex) => {
  return getCol(scanner1, colIndex).map((x1, index) => x1 - getCol(scanner2, colIndex)[index]);
};

const areDifferencesSame = (scanner1, scanner2, colIndex) => {
  const differences = calculateDifferences(scanner1, scanner2, colIndex);
  return _.every(differences, (diff) => diff === differences[0]);
};

const getCol = (array, index) => array.map((row) => row[index]);

const MULTIPLIER_COMBOS = [
  [1, 1, 1],
  [1, 1, -1],
  [1, -1, 1],
  [1, -1, -1],
  [-1, 1, 1],
  [-1, 1, -1],
  [-1, -1, 1],
  [-1, -1, -1],
];

const REARRANGE_COMBOS = [
  [0, 1, 2],
  [0, 2, 1],
  [1, 0, 2],
  [1, 2, 0],
  [2, 0, 1],
  [2, 1, 0],
];

const calcTranslation = (matches) => {
  const scanner1 = matches.map((m) => m.beacon1);
  const scanner2 = matches.map((m) => m.beacon2);
  const res = REARRANGE_COMBOS.map((rearrange) => {
    return MULTIPLIER_COMBOS.map((multipliers) => {
      const afterApply = applyTranslation(scanner2, { rearrange, multipliers, adds: [0, 0, 0] });
      if (
        areDifferencesSame(scanner1, afterApply, 0) &&
        areDifferencesSame(scanner1, afterApply, 1) &&
        areDifferencesSame(scanner1, afterApply, 2)
      ) {
        return {
          rearrange,
          multipliers,
          adds: [
            calculateDifferences(scanner1, afterApply, 0)[0],
            calculateDifferences(scanner1, afterApply, 1)[0],
            calculateDifferences(scanner1, afterApply, 2)[0],
          ],
        };
      }
    });
  });
  return _.first(_.compact(_.flatten(res)));
};

const mergeScanners = (mappedScanners, unmappedScanners, positions = [[0, 0, 0]]) => {
  console.log('remaining unmapped: ', unmappedScanners.length);

  if (unmappedScanners.length === 0) {
    return positions;
  }
  let scannerIndex = mappedScanners.length;
  let scanner2Index = -1;
  while (scanner2Index === -1) {
    scannerIndex--;
    const scanner = mappedScanners[scannerIndex];
    scanner2Index = _.findIndex(unmappedScanners, (s2) => doScannersOverlap(scanner, s2));
  }

  const scanner = mappedScanners[scannerIndex];
  const scanner2 = unmappedScanners[scanner2Index];
  const matches = scannerMatches(scanner, scanner2);
  const translation = calcTranslation(matches);
  console.log('translation', translation);
  const newPointsToAdd = applyTranslation(scanner2, translation);
  return mergeScanners(
    [...mappedScanners, newPointsToAdd],
    withoutIndex(unmappedScanners, scanner2Index),
    [
      ...positions,
      translation.adds,
    ],
  );
};

const manhattanDistance = (a, b) => {
  return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
};

export const solve = (input) => {
  const scanners = parseInput(input);
  const positions = mergeScanners([scanners[0]], _.drop(scanners, 1));
  const manhattenDistances = positions.map((x, i) => withoutIndex(positions, i).map((y) => manhattanDistance(x, y)));
  return _.max(_.flatten(manhattenDistances));
};

// console.log(solve(readInput('example1.txt')), '\n\n\n');
// console.log(solve(readInput('example1.1.txt')), '\n\n\n');
// console.log(solve(readInput('example1And4.txt')), '\n\n\n');
console.log(solve(readInput('example2.txt')), '\n\n\n');
// console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
