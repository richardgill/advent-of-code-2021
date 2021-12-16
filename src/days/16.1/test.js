import { assertEquals } from 'https://deno.land/std@0.114.0/testing/asserts.ts';

import { parsePacket } from './index.js';

const testCases = [
  {
    input: `D2FE28`,
    solution: {
      literal: 2021,
      packetTypeId: 4,
      version: 6,
      length: 21,
    },
  },
  {
    input: `38006F45291200`,
    solution: {
      length: 49,
      lengthTypeId: 0,
      packetTypeId: 6,
      restOfPacketLength: 27,
      version: 1,
      packets: [
        {
          length: 11,
          literal: 10,
          packetTypeId: 4,
          version: 6,
        },
        {
          length: 16,
          literal: 20,
          packetTypeId: 4,
          version: 2,
        },
      ],
    },
  },
  {
    input: `EE00D40C823060`,
    solution: {
      length: 51,
      lengthTypeId: 1,
      numberOfPackets: 3,
      packetTypeId: 3,
      version: 7,
      packets: [
        {
          length: 11,
          literal: 1,
          packetTypeId: 4,
          version: 2,
        },
        {
          length: 11,
          literal: 2,
          packetTypeId: 4,
          version: 4,
        },
        {
          length: 11,
          literal: 3,
          packetTypeId: 4,
          version: 1,
        },
      ],
    },
  },
  {
    input: `8A004A801A8002F478`,
    solution: {
      lengthTypeId: 1,
      numberOfPackets: 1,
      length: 69,
      packetTypeId: 2,
      packets: [
        {
          length: 51,
          lengthTypeId: 1,
          numberOfPackets: 1,
          packetTypeId: 2,
          packets: [
            {
              length: 33,
              lengthTypeId: 0,
              packetTypeId: 2,
              packets: [
                {
                  length: 11,
                  literal: 15,
                  packetTypeId: 4,
                  version: 6,
                },
              ],
              restOfPacketLength: 11,
              version: 5,
            },
          ],
          version: 1,
        },
      ],
      version: 4,
    },
  },
];

for (const testCase of testCases) {
  Deno.test(`${testCase.input}: ${JSON.stringify(testCase.solution, null, 2)}`, () => {
    assertEquals(parsePacket(testCase.input), testCase.solution);
  });
}
