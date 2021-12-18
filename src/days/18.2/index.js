import _ from 'lodash';
import { exampleHomeWork, largerExample } from './data/largerExample.js';
import { puzzleInput } from './data/puzzleInput.js';

const arrayToTree = (element) => {
  if (_.isNumber(element)) {
    return element;
  }
  return { left: arrayToTree(element[0]), right: arrayToTree(element[1]) };
};

const treeToArray = (tree) => {
  if (_.isNumber(tree)) {
    return tree;
  }
  return [treeToArray(tree.left), treeToArray(tree.right)];
};

// produces an array of non-leaf nodes ordered from left to right across the tree
const nodesLeftToRight = (tree, parent = null, depth = 0) => {
  if (_.isNumber(tree)) {
    return [];
  }
  tree.parent = parent;
  tree.depth = depth;
  return _.flatten([
    ...nodesLeftToRight(tree.left, tree, depth + 1),
    tree,
    ...nodesLeftToRight(tree.right, tree, depth + 1),
  ]);
};

const addToRightMost = (tree, value, depth = 0) => {
  if (!tree) {
    return;
  }
  if (depth === 0) {
    if (_.isNumber(tree.left)) {
      tree.left += value;
      return;
    }
    return addToRightMost(tree.left, value, depth + 1);
  }
  if (_.isNumber(tree.right)) {
    tree.right += value;
    return;
  }
  return addToRightMost(tree.right, value, depth + 1);
};

const addToLeftMost = (tree, value, depth = 0) => {
  if (!tree) {
    return;
  }
  if (depth === 0) {
    if (_.isNumber(tree.right)) {
      tree.right += value;
      return;
    }
    return addToLeftMost(tree.right, value, depth + 1);
  }
  if (_.isNumber(tree.left)) {
    tree.left += value;
    return;
  }
  return addToLeftMost(tree.left, value, depth + 1);
};

const setNodeTo0 = (tree) => {
  if (tree.parent.left == tree) {
    tree.parent.left = 0;
  } else {
    tree.parent.right = 0;
  }
};

const explodeTree = (tree) => {
  const leftToRightNodes = nodesLeftToRight(tree);
  const index = _.findIndex(leftToRightNodes, (node) => node.depth === 4);
  if (index === -1) {
    return tree;
  }
  const node = leftToRightNodes[index];
  const leftNode = index > 0 ? leftToRightNodes[index - 1] : null;
  const rightNode = index < leftToRightNodes.length ? leftToRightNodes[index + 1] : null;
  addToRightMost(leftNode, node.left);
  addToLeftMost(rightNode, node.right);
  setNodeTo0(node);
  return tree;
};

const splitTree = (tree) => {
  const leftToRightNodes = nodesLeftToRight(tree);
  const nodeToSplit = _.find(leftToRightNodes, (node) => node.left >= 10 || node.right >= 10);
  if (!nodeToSplit) {
    return tree;
  }
  if (nodeToSplit.left >= 10) {
    nodeToSplit.left = { left: Math.floor(nodeToSplit.left / 2), right: Math.ceil(nodeToSplit.left / 2) };
  } else if (nodeToSplit.right >= 10) {
    nodeToSplit.right = { left: Math.floor(nodeToSplit.right / 2), right: Math.ceil(nodeToSplit.right / 2) };
  }
  return tree;
};

const reduce = (tree) => {
  const explodedTree = explodeTree(_.cloneDeep(tree));
  if (!_.isEqual(tree, explodedTree)) {
    return reduce(explodedTree);
  }
  const split = splitTree(_.cloneDeep(tree));
  if (!_.isEqual(tree, split)) {
    return reduce(split);
  }
  return tree;
};

const reduceArray = (array) => treeToArray(reduce(arrayToTree(array)));

const add = (array1, array2) => {
  const newArray = [array1, array2];
  return reduceArray(newArray);
};

const addArrays = (arrays) => {
  if (arrays.length === 1) {
    return arrays[0];
  }
  const result = add(arrays[0], arrays[1]);
  return addArrays([result, ...arrays.slice(2)]);
};

const magnitude = (array) => {
  const leftValue = _.isNumber(array[0]) ? array[0] * 3 : magnitude(array[0]) * 3;
  const rightValue = _.isNumber(array[1]) ? array[1] * 2 : magnitude(array[1]) * 2;
  return leftValue + rightValue;
};

const generateAllPairs = (array) => {
  const combinations = [];
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    for (let indexA = 0; indexA < array.length; indexA++) {
      if (index !== indexA) {
        const elementA = array[indexA];
        combinations.push([element, elementA]);
      }
    }
  }
  return combinations;
};

export const solve = (arrays) => {
  const allPairs = generateAllPairs(arrays);
  return _.chain(allPairs).map(addArrays).map(magnitude).max().value();
};

console.log(solve([1, [2, 3]]), '\n\n\n');
console.log(reduceArray([[[[[9, 8], 1], 2], 3], 4]), '\n\n\n');
console.log(reduceArray([7, [6, [5, [4, [3, 2]]]]]), '\n\n\n');
console.log(reduceArray([[6, [5, [4, [3, 2]]]], 1]), '\n\n\n');
console.log(reduceArray([[3, [2, [1, [7, 3]]]], [6, [5, [4, [3, 2]]]]]), '\n\n\n');
console.log(add([[[[4, 3], 4], 4], [7, [[8, 4], 9]]], [1, 1]), '\n\n\n');
console.log(solve([[1, 1], [2, 2], [3, 3], [4, 4]]), '\n\n\n');
console.log(solve([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5]]), '\n\n\n');
console.log(solve([[1, 1], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6]]), '\n\n\n');
console.log(magnitude([9, 1]), '\n\n\n');
console.log(magnitude([1, 9]), '\n\n\n');
console.log(magnitude([[9, 1], [1, 9]]), '\n\n\n');
console.log(magnitude([[1, 2], [[3, 4], 5]]), '\n\n\n');
console.log(magnitude([[[[0, 7], 4], [[7, 8], [6, 0]]], [8, 1]]), '\n\n\n');
console.log(solve(largerExample), '\n\n\n');
console.log(solve([[1, 1], [2, 2], [3, 3], [4, 4]]), '\n\n\n');
console.log(solve(exampleHomeWork), '\n\n\n');
console.log(solve(puzzleInput), '\n\n\n');
