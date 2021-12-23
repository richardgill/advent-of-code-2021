import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const parseInput = (input) => {
  return input.trim().split('\n').map((line) => {
    const [state, _coordinates] = line.split(' ');
    const [x, y, z] = line.trim().split(',').map((coordinate) => {
      const [_direction, rest] = coordinate.split('=');
      const [from, to] = rest.split('..').map((x) => parseInt(x, 10));
      return {
        from,
        to,
      };
    });
    return { state, x, y, z };
  });
};

const isNotTouching = (a, b) => {
  return Math.max(a.x.from, b.x.from) > Math.min(a.x.to, b.x.to) ||
    Math.max(a.y.from, b.y.from) > Math.min(a.y.to, b.y.to) ||
    Math.max(a.z.from, b.z.from) > Math.min(a.z.to, b.z.to);
};

export const solve = (input) => {
  const instuctions = parseInput(input);
  let cuboids = [];
  for (const instruction of instuctions) {
    const newCuboids = [];
    const currentCube = _.pick({ ...instruction }, ['x', 'y', 'z']);
    if (instruction.state === 'on') {
      newCuboids.push(currentCube);
    }
    for (const cube of cuboids) {
      if (isNotTouching(cube, currentCube)) {
        newCuboids.push(cube);
      } else {
        if (cube.x.from < currentCube.x.from) {
          newCuboids.push({
            x: { from: cube.x.from, to: currentCube.x.from - 1 },
            y: { from: cube.y.from, to: cube.y.to },
            z: { from: cube.z.from, to: cube.z.to },
          });
          cube.x.from = currentCube.x.from;
        }

        if (cube.x.to > currentCube.x.to) {
          newCuboids.push({
            x: { from: currentCube.x.to + 1, to: cube.x.to },
            y: { from: cube.y.from, to: cube.y.to },
            z: { from: cube.z.from, to: cube.z.to },
          });
          cube.x.to = currentCube.x.to;
        }

        if (cube.y.from < currentCube.y.from) {
          newCuboids.push({
            x: { from: cube.x.from, to: cube.x.to },
            y: { from: cube.y.from, to: currentCube.y.from - 1 },
            z: { from: cube.z.from, to: cube.z.to },
          });
          cube.y.from = currentCube.y.from;
        }

        if (cube.y.to > currentCube.y.to) {
          newCuboids.push({
            x: { from: cube.x.from, to: cube.x.to },
            y: { from: currentCube.y.to + 1, to: cube.y.to },
            z: { from: cube.z.from, to: cube.z.to },
          });
          cube.y.to = currentCube.y.to;
        }

        if (cube.z.from < currentCube.z.from) {
          newCuboids.push({
            x: { from: cube.x.from, to: cube.x.to },
            y: { from: cube.y.from, to: cube.y.to },
            z: { from: cube.z.from, to: currentCube.z.from - 1 },
          });
          cube.z.from = currentCube.z.from;
        }

        if (cube.z.to > currentCube.z.to) {
          newCuboids.push({
            x: { from: cube.x.from, to: cube.x.to },
            y: { from: cube.y.from, to: cube.y.to },
            z: { from: currentCube.z.to + 1, to: cube.z.to },
          });
          cube.z.to = currentCube.z.to;
        }
      }
    }
    cuboids = [...newCuboids];
  }
  return _.chain(cuboids).map((cuboid) => {
    const xlen = Math.abs(cuboid.x.from - cuboid.x.to - 1);
    const ylen = Math.abs(cuboid.y.from - cuboid.y.to - 1);
    const zlen = Math.abs(cuboid.z.from - cuboid.z.to - 1);
    return xlen * ylen * zlen;
  }).sum().value();
};

console.log(solve(readInput('example1.txt')), '\n\n\n');
console.log(solve(readInput('example2.txt')), '\n\n\n');
console.log(solve(readInput('example3.txt')), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
