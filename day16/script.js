const fs = require('fs');
const path = require('path');
const performance = require('perf_hooks').performance;

const hex2bin = (hex) => parseInt(hex, 16).toString(2).padStart(4, '0');

const data = fs
  .readFileSync(path.join(__dirname, 'data.txt'), 'utf8')
  .split('')
  .map((n) => hex2bin(n))
  .join('');

const packets = [];
let pos = 0;

const jumpPosition = (input) => {
  const remainder = input.length - pos;
  if (remainder < 11) {
    pos += remainder;
  }
};

const getConfigDecimal = (input, count = 1) => {
  const binaryPart = input.substring(pos, pos + count);
  const decimal = parseInt(binaryPart, 2);
  pos += count;
  return decimal;
};

const getPartialDataBinary = (input, count = 5) => {
  const binaryPart = input.substring(pos, pos + count);
  const isComplete = binaryPart[0] === '0' ? true : false;
  pos += count;
  return { isComplete, value: binaryPart.slice(1) };
};

const parsePacketData = (input) => {
  let partialData = {};
  let result = '';
  do {
    partialData = getPartialDataBinary(input);
    result += partialData.value;
  } while (partialData.isComplete === false);
  return result;
};

const parsePacketSubpackets = (input) => {
  const subPackets = [];
  const lengthTypeId = getConfigDecimal(input);
  if (lengthTypeId) {
    const subpacketsCount = getConfigDecimal(input, 11);
    while (subPackets.length < subpacketsCount) {
      subPackets.push(parsePacket(input));
    }
  } else {
    const subpacketsLength = getConfigDecimal(input, 15);
    const startingPosition = pos;
    while (startingPosition + subpacketsLength > pos) {
      subPackets.push(parsePacket(input));
    }
  }
  return subPackets;
};

const parsePacket = (input) => {
  const packet = {};
  const version = getConfigDecimal(input, 3);
  const type = getConfigDecimal(input, 3);
  packet['version'] = version;
  packet['type'] = type;
  if (type === 4) {
    packet['data'] = parsePacketData(input);
  } else {
    packet['subpackets'] = parsePacketSubpackets(input);
    jumpPosition(input);
  }
  return packet;
};

const parseBinaryString = (input) => {
  while (pos < input.length) {
    const packet = parsePacket(data);
    const remainder = 4 - (pos % 4);
    pos += remainder;
    packets.push(packet);
  }
  return packets;
};

const sumVersions = (arr) => {
  let result = 0;
  for (i in arr) {
    const packet = arr[i];
    result += packet.version;
    if (packet.subpackets) {
      result += sumVersions(packet.subpackets);
    }
  }
  return result;
};

const evaluatePacketValue = (packet) => {
  if (packet.type === 4) {
    return parseInt(packet.data, 2);
  }
  const subpacketValues = [];
  for (i in packet.subpackets) {
    subpacketValues.push(evaluatePacketValue(packet.subpackets[i]));
  }
  switch (packet.type) {
    case 0:
      return subpacketValues.reduce((p, c) => p + c, 0);
    case 1:
      return subpacketValues.reduce((p, c) => p * c, 1);
    case 2:
      return subpacketValues.reduce((p, c) => (c < p ? c : p), Infinity);
    case 3:
      return subpacketValues.reduce((p, c) => (c > p ? c : p), 0);
    case 5:
      return subpacketValues[0] > subpacketValues[1] ? 1 : 0;
    case 6:
      return subpacketValues[0] < subpacketValues[1] ? 1 : 0;
    case 7:
      return subpacketValues[0] === subpacketValues[1] ? 1 : 0;
  }
};

const evaluateAllPackets = (arr) => {
  let result = 0;
  for (i in arr) {
    result += evaluatePacketValue(arr[i]);
  }
  return result;
};

let t0 = performance.now();

parseBinaryString(data);
let resultOne = sumVersions(packets);

let t1 = performance.now() - t0;
t0 = performance.now();

let resultTwo = evaluateAllPackets(packets);

let t2 = performance.now() - t0;

console.log('=============================================');
console.log('Part 1 result:', resultOne);
console.log(`Execution time: ${t1.toFixed(3)} ms`);
console.log('=============================================');
console.log('Part 2 result:', resultTwo);
console.log(`Execution time: ${t2.toFixed(3)} ms`);
console.log('=============================================');
