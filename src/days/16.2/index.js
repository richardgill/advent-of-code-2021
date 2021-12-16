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

const hexDigitToBinary = (hexDigit) => {
  switch (hexDigit) {
    case '0':
      return '0000';
    case '1':
      return '0001';
    case '2':
      return '0010';
    case '3':
      return '0011';
    case '4':
      return '0100';
    case '5':
      return '0101';
    case '6':
      return '0110';
    case '7':
      return '0111';
    case '8':
      return '1000';
    case '9':
      return '1001';
    case 'a':
    case 'A':
      return '1010';
    case 'b':
    case 'B':
      return '1011';
    case 'c':
    case 'C':
      return '1100';
    case 'd':
    case 'D':
      return '1101';
    case 'e':
    case 'E':
      return '1110';
    case 'f':
    case 'F':
      return '1111';
    default:
      throw new Error(`Invalid hex digit: ${hexDigit}`);
  }
};

const hexToBinary = (hex) => {
  return hex.split('').map(hexDigitToBinary).join('');
};

const binaryToDecimal = (binary) => parseInt(binary, 2);

const parseLiteralPacket = (binaryPacket) => {
  const literalPacket = binaryPacket.substr(6);
  const groups = _.chunk(literalPacket, 5);
  const groupCount = _.takeWhile(groups, (group) => group[0] !== '0').length + 1;
  const binaryLiteralNumber = _.chain(groups).take(groupCount).flatMap((group) => _.drop(group, 1).join('')).join('').value();
  return { literal: binaryToDecimal(binaryLiteralNumber), length: 6 + (groupCount * 5) };
};

const parseLengthType0 = (binaryPacket) => {
  const restOfPacketLength = binaryToDecimal(binaryPacket.substr(7, 15));
  let restOfPacket = binaryPacket.substr(7 + 15, restOfPacketLength);
  const packets = [];
  while (restOfPacket.length > 0) {
    const packet = parseBinaryPacket(restOfPacket);
    packets.push(packet);
    restOfPacket = restOfPacket.substr(packet.length);
  }
  return { lengthTypeId: 0, restOfPacketLength, length: 7 + 15 + restOfPacketLength, packets };
};

const parseLengthType1 = (binaryPacket) => {
  const numberOfPackets = binaryToDecimal(binaryPacket.substr(7, 11));
  let restOfPacket = binaryPacket.substr(7 + 11);

  const packets = [];

  while (packets.length < numberOfPackets) {
    const packet = parseBinaryPacket(restOfPacket);
    packets.push(packet);
    restOfPacket = restOfPacket.substr(packet.length);
  }
  return { lengthTypeId: 1, numberOfPackets, length: 7 + 11 + _.sum(packets.map((p) => p.length)), packets };
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
