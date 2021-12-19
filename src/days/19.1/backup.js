import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';
import { withoutIndex } from '@/common/arrays.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => {
  return input.trim().split(/--- scanner \d ---\n/).slice(1).map((scannerString, index) => {
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

const absCoordinate = (coord) => coord.map((x) => Math.abs(x));

const isEqualAbsolute = (coordinate1, coordinate2) => {
  return _.isEqual(absCoordinate(coordinate1), absCoordinate(coordinate2));
};

const scannerMatches = (scanner1, scanner2) => {
  const scanner1Diffs = scannerDifferences(scanner1);
  const scanner2Diffs = scannerDifferences(scanner2);
  const matchedBeacons = scanner1Diffs.map(({ beacon, diffs }) => {
    const matchedBeacon = _.find(scanner2Diffs, (scanner2Diff) => {
      const beacon2 = scanner2Diff.beacon;
      // console.log('beacon', beacon);
      // console.log('beacon2', beacon2);
      const diffs2 = scanner2Diff.diffs;
      if (_.isEqual(beacon, [-618, -824, -621]) && _.isEqual(beacon2, [686, 422, 578])) {
        // console.log('diffs', diffs);
        // console.log('diff2', diffs2);
        // console.log('res', diffs2.filter((diff2) => _.find(diffs, (diff) => isEqualAbsolute(diff, diff2))).length);
      }
      console.log('diff', diffs, diffs2);
      return diffs2.filter((diff2) => _.find(diffs, (diff) => isEqualAbsolute(diff, diff2))).length >= 11;
    });
    if (!matchedBeacon) {
      return null;
    }
    return { beacon, diffs, matchedBeacon };
  });
  return _.compact(matchedBeacons).map(({ beacon, matchedBeacon }) => ({ beacon1: beacon, beacon2: matchedBeacon.beacon }));
};

const doScannersOverlap = (scanner1, scanner2) => {
  console.log('matches', scannerMatches(scanner1, scanner2));
  return scannerMatches(scanner1, scanner2).length >= 12;
};

const calculateSingleTranslation = (x1s, x2s) => {
  const differences = x1s.map((x1, index) => x1 - x2s[index]);
  if (_.every(differences, (diff) => diff === differences[0])) {
    return { multiplier: 1, add: differences[0] };
  }
  return { ...calculateSingleTranslation(x1s, x2s.map((x2) => -x2)), multiplier: -1 };
};

const getCol = (array, index) => array.map((row) => row[index]);

const calcTranslation = (matches) => {
  const scanner1 = matches.map((m) => m.beacon1);
  const scanner2 = matches.map((m) => m.beacon2);
  // console.log('scanner1', scanner1);
  // console.log('scanner2', scanner2);
  // console.log('scanner1col0', getCol(scanner1, 0));
  return [
    calculateSingleTranslation(getCol(scanner1, 0), getCol(scanner2, 0)),
    calculateSingleTranslation(getCol(scanner1, 1), getCol(scanner2, 1)),
    calculateSingleTranslation(getCol(scanner1, 2), getCol(scanner2, 2)),
  ];
};

const applyTranslation = (scanner, translation) => {
  return scanner.map((beacon) => {
    return beacon.map((b, index) => {
      return (b * translation[index].multiplier) + translation[index].add;
    });
  });
};

const mergeScanners = (mappedScanners, unmappedScanners) => {
  // console.log('mappedScanners', mappedScanners, 'unmappedScanners', unmappedScanners);
  if (unmappedScanners.length === 0) {
    return mappedScanners;
  }
  // console.log('scanner', scanner);
  let scannerIndex = -1;
  let scanner2Index = -1;

  while (scanner2Index === -1) {
    scannerIndex++;
    const scanner = mappedScanners[scannerIndex].scanner;
    scanner2Index = _.findIndex(unmappedScanners, (s2) => doScannersOverlap(scanner, s2));
    // console.log('scannerIndex', scannerIndex, 'scanner2Index', scanner2Index);
  }

  // const scanner2Index = _.findIndex(scanners, (s2) => doScannersOverlap(scanner, s2));
  // if (scanner2Index === -1) {
  //   throw new Error('No scanner found');
  // }
  const scanner = mappedScanners[scannerIndex].scanner;
  const scannerTranslation = mappedScanners[scannerIndex].translation;
  const scanner2 = unmappedScanners[scanner2Index];
  console.log('\n\nscannerIndex', scanner2Index);
  console.log('scanner2Index', scanner2Index);
  console.log('scanner', scanner);
  console.log('scanner2', scanner2);
  const matches = scannerMatches(scanner, scanner2);
  // console.log('matches', matches);
  const translation = calcTranslation(matches);
  // console.log('translation', translation);
  // const newPointsToAdd = applyTranslation(scanner2, translation);
  // console.log('newPointsToAdd', newPointsToAdd);
  // console.log('back in', _.uniqBy([...newPointsToAdd, ...mergeScanners(newPointsToAdd, withoutIndex(scanners, scanner2Index))], _.isEqual));
  return mergeScanners(
    [...mappedScanners, { scanner: scanner2, translation: [...scannerTranslation, translation] }],
    withoutIndex(unmappedScanners, scanner2Index),
  );
  // return _.uniq([...newPointsToAdd, ...mergeScanners(newPointsToAdd, withoutIndex(unmappedScanners, scanner2Index))]);
};

const NO_TRANSLATION = [[{ multiplier: 1, add: 0 }, { multiplier: 1, add: 0 }, { multiplier: 1, add: 0 }]];

export const solve = (input) => {
  const scanners = parseInput(input);
  // todo: after chat - need to build an array of scanner and the array of translation operations. Then at the end apply all the translations in bulk.
  // I've not started rewriting mergeScanners function just changed the line below this one.
  const coordinates = mergeScanners([{ scanner: scanners[0], translation: NO_TRANSLATION }], _.drop(scanners, 1));
  console.log('merged', coordinates);
  // console.log('uniq', _.uniq(_.flatten(coordinates)));
  // console.log(scannerDifferences(scanners[0]));
  // console.log(scannerDifferences(scanners[1]));
  // doScannersOverlap(scanners[0], scanners[1]);
  return 'answer';
};

// console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('example1.1.txt')), '\n\n\n');
// console.log(solve(readInput('example2.txt')), '\n\n\n');
// console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
