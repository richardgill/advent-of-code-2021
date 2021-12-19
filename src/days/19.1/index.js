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
  console.log('scannerMatches');
  const scanner1Diffs = scannerDifferences(scanner1);
  const scanner2Diffs = scannerDifferences(scanner2);
  const matchedBeacons = scanner1Diffs.map(({ beacon, diffs }) => {
    const matchedBeacon = _.find(scanner2Diffs, (scanner2Diff) => {
      // console.log('beacon', beacon);
      // console.log('beacon2', beacon2);
      const diffs2 = scanner2Diff.diffs;
      // console.log('diffs', diffs, 'diffs2', diffs2);
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

// const calculateDifferences = (x1s, x2s) => {
//   const differences = x1s.map((x1, index) => x1 - x2s[index]);
//   if (_.every(differences, (diff) => diff === differences[0])) {
//     return { add: differences[0] };
//   }
// };
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
  // console.log('scanner1', scanner1);
  // console.log('scanner2', scanner2);

  const res = REARRANGE_COMBOS.map((rearrange) => {
    return MULTIPLIER_COMBOS.map((multipliers) => {
      const afterApply = applyTranslation(scanner2, { rearrange, multipliers, adds: [0, 0, 0] });
      // console.log('afterApply', afterApply);
      // throw new Error('stop');
      if (
        areDifferencesSame(scanner1, afterApply, 0) && areDifferencesSame(scanner1, afterApply, 1) &&
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
  // console.log('scanner1col0', getCol(scanner1, 0));
};

const mergeScanners = (mappedScanners, unmappedScanners) => {
  console.log('remaining unmapped: ', unmappedScanners.length);

  // console.log('mappedScanners', mappedScanners, 'unmappedScanners', unmappedScanners);
  if (unmappedScanners.length === 0) {
    return mappedScanners;
  }
  // console.log('scanner', scanner);
  let scannerIndex = mappedScanners.length;
  let scanner2Index = -1;
  console.log('startwhile');
  while (scanner2Index === -1) {
    scannerIndex--;
    const scanner = mappedScanners[scannerIndex];
    scanner2Index = _.findIndex(unmappedScanners, (s2) => doScannersOverlap(scanner, s2));
    // console.log('scannerIndex', scannerIndex, 'scanner2Index', scanner2Index);
  }
  console.log('finishwhile');
  // const scanner2Index = _.findIndex(scanners, (s2) => doScannersOverlap(scanner, s2));
  // if (scanner2Index === -1) {
  //   throw new Error('No scanner found');
  // }
  const scanner = mappedScanners[scannerIndex];
  const scanner2 = unmappedScanners[scanner2Index];
  // console.log('\n\nscanner', scanner);
  // console.log('scanner2', scanner2);
  const matches = scannerMatches(scanner, scanner2);
  // console.log('matches', matches);
  const translation = calcTranslation(matches);
  // console.log('translation', translation);
  const newPointsToAdd = applyTranslation(scanner2, translation);
  // console.log('newPointsToAdd', newPointsToAdd);
  // console.log('back in', _.uniqBy([...newPointsToAdd, ...mergeScanners(newPointsToAdd, withoutIndex(scanners, scanner2Index))], _.isEqual));
  return mergeScanners([...mappedScanners, newPointsToAdd], withoutIndex(unmappedScanners, scanner2Index));
  // return _.uniq([...newPointsToAdd, ...mergeScanners(newPointsToAdd, withoutIndex(unmappedScanners, scanner2Index))]);
};

export const solve = (input) => {
  const scanners = parseInput(input);
  console.log(scanners);
  const coordinates = mergeScanners([scanners[0]], _.drop(scanners, 1));
  const uniqueCoordinates = _.uniqBy(_.flatten(coordinates), (x) => x.join(','));
  console.log('merged', coordinates);
  console.log('uniq', uniqueCoordinates);
  // console.log(scannerDifferences(scanners[0]));
  // console.log(scannerDifferences(scanners[1]));
  // doScannersOverlap(scanners[0], scanners[1]);
  return uniqueCoordinates.length;
};

// console.log(solve(readInput('example1.txt')), '\n\n\n');
// console.log(solve(readInput('example1.1.txt')), '\n\n\n');
// console.log(solve(readInput('example1And4.txt')), '\n\n\n');
console.log(solve(readInput('example2.txt')), '\n\n\n');
// console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
