import _ from 'lodash';
import { readRelativeInput } from '@/common/file.js';

const readInput = (fileName) => readRelativeInput(import.meta.url, fileName);

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
  if (packetTypeId === 4) {
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

export const solve = (input) => {
  const packet = parsePacket(input.trim());
  const packets = flattenPackets(packet);
  console.log('packet', packet);
  return _.sum(packets.map((p) => p.version));
};

console.log(solve('D2FE28'), '\n\n\n');
console.log(solve('38006F45291200'), '\n\n\n');
console.log(solve('8A004A801A8002F478'), '\n\n\n');
console.log(solve('620080001611562C8802118E34'), '\n\n\n');
console.log(solve('C0015000016115A2E0802F182340'), '\n\n\n');
console.log(solve('A0016C880162017C3686B18A3D4780'), '\n\n\n');
console.log(solve(readInput('puzzleInput.txt')), '\n\n\n');
