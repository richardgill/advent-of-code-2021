import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

const SUM = 0;
const LITERAL = 4;
const PRODUCT = 1;
const MINIMUM = 2;
const MAXIMUM = 3;
const GREATER_THAN = 5;
const LESS_THAN = 6;
const EQUAL_TO = 7;

const LENGTH_TYPE_0_LENGTH = 15;
const LENGTH_TYPE_1_LENGTH = 11;
const LENGTH_TYPE_HEADER_LENGTH = 7;
const LITERAL_GROUP_LENGTH = 5;
const LITERAL_HEADER_LENGTH = 6;

const hexDigitToBinary = (hexDigit) => {
  return parseInt(hexDigit, 16).toString(2).padStart(4, '0');
};

const hexToBinary = (hex) => {
  return hex.split('').map(hexDigitToBinary).join('');
};

const binaryToDecimal = (binary) => parseInt(binary, 2);

const parseLiteralPacket = (binaryPacket) => {
  const literalPacket = binaryPacket.substr(LITERAL_HEADER_LENGTH);
  const groups = _.chunk(literalPacket, LITERAL_GROUP_LENGTH);
  const groupCount = _.takeWhile(groups, (group) => group[0] !== '0').length + 1;
  const binaryLiteralNumber = _.chain(groups).take(groupCount).flatMap((group) => _.drop(group, 1).join('')).join('').value();
  return { literal: binaryToDecimal(binaryLiteralNumber), length: LITERAL_HEADER_LENGTH + (groupCount * LITERAL_GROUP_LENGTH) };
};

const parseLengthType0 = (binaryPacket) => {
  const restOfPacketLength = binaryToDecimal(binaryPacket.substr(LENGTH_TYPE_HEADER_LENGTH, LENGTH_TYPE_0_LENGTH));
  let restOfPacket = binaryPacket.substr(LENGTH_TYPE_HEADER_LENGTH + LENGTH_TYPE_0_LENGTH, restOfPacketLength);
  const packets = [];
  while (restOfPacket.length > 0) {
    const packet = parseBinaryPacket(restOfPacket);
    packets.push(packet);
    restOfPacket = restOfPacket.substr(packet.length);
  }
  return { lengthTypeId: 0, restOfPacketLength, length: LENGTH_TYPE_HEADER_LENGTH + LENGTH_TYPE_0_LENGTH + restOfPacketLength, packets };
};

const parseLengthType1 = (binaryPacket) => {
  const numberOfPackets = binaryToDecimal(binaryPacket.substr(LENGTH_TYPE_HEADER_LENGTH, LENGTH_TYPE_1_LENGTH));
  let restOfPacket = binaryPacket.substr(LENGTH_TYPE_HEADER_LENGTH + LENGTH_TYPE_1_LENGTH);

  const packets = [];

  while (packets.length < numberOfPackets) {
    const packet = parseBinaryPacket(restOfPacket);
    packets.push(packet);
    restOfPacket = restOfPacket.substr(packet.length);
  }
  return {
    lengthTypeId: 1,
    numberOfPackets,
    length: LENGTH_TYPE_HEADER_LENGTH + LENGTH_TYPE_1_LENGTH + _.sum(packets.map((p) => p.length)),
    packets,
  };
};

const parseOperatorPacket = (binaryPacket) => {
  const lengthTypeId = binaryPacket[6];
  return lengthTypeId === '0' ? parseLengthType0(binaryPacket) : parseLengthType1(binaryPacket);
};

const parseBinaryPacket = (binaryPacket) => {
  const version = binaryToDecimal(binaryPacket.substr(0, 3));
  const packetTypeId = binaryToDecimal(binaryPacket.substr(3, 3));
  const packetHeaders = { version, packetTypeId };
  if (packetTypeId === LITERAL) {
    return { ...packetHeaders, ...parseLiteralPacket(binaryPacket) };
  }
  return { ...packetHeaders, ...parseOperatorPacket(binaryPacket) };
};

export const parsePacket = (packetString) => {
  const binary = hexToBinary(packetString);
  return parseBinaryPacket(binary);
};

const flattenPackets = (packet) => {
  if (packet.packets) {
    return [packet, ...packet.packets.map((p) => flattenPackets(p)).flat()];
  }
  return [packet];
};

const product = (numbers) => {
  return _.reduce(numbers, (acc, n) => acc * n, 1);
};

const executePacket = (packet) => {
  const typeId = packet.packetTypeId;
  if (typeId === LITERAL) {
    return packet.literal;
  }
  if (typeId === SUM) {
    return _.sum(packet.packets.map((p) => executePacket(p)));
  }
  if (typeId === PRODUCT) {
    return product(packet.packets.map((p) => executePacket(p)));
  }
  if (typeId === MINIMUM) {
    return _.min(packet.packets.map((p) => executePacket(p)));
  }
  if (typeId === MAXIMUM) {
    return _.max(packet.packets.map((p) => executePacket(p)));
  }
  if (typeId === GREATER_THAN) {
    const [a, b] = packet.packets.map((p) => executePacket(p));
    return a > b ? 1 : 0;
  }
  if (typeId === LESS_THAN) {
    const [a, b] = packet.packets.map((p) => executePacket(p));
    return a < b ? 1 : 0;
  }
  if (typeId === EQUAL_TO) {
    const [a, b] = packet.packets.map((p) => executePacket(p));
    return a === b ? 1 : 0;
  }
};

export const solve = (input) => {
  const packet = parsePacket(input.trim());
  return executePacket(packet);
};

console.log(solve('D2FE28'), '\n\n\n');
console.log(solve('C200B40A82'), '\n\n\n');
console.log(solve('04005AC33890'), '\n\n\n');
console.log(solve('880086C3E88112'), '\n\n\n');
console.log(solve('CE00C43D881120'), '\n\n\n');
console.log(solve('D8005AC2A8F0'), '\n\n\n');
console.log(solve('F600BC2D8F'), '\n\n\n');
console.log(solve('9C005AC2F8F0'), '\n\n\n');
console.log(solve('9C0141080250320F1802104A08'), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
