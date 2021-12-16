const fs = require('fs');
const path = require('path');
const performance = require('perf_hooks').performance;

const data = fs
  .readFileSync(path.join(__dirname, 'data.txt'), 'utf8')
  .split('\r\n')
  .map((line) => line.split('').map((l) => parseInt(l, 10)));

let SIZE = data.length;

let totalCostMap = data.map((r) => r.map((i) => Infinity));
totalCostMap[0][0] = data[0][0];

const calculateAdjacents = (input, size, x, y) => {
  if (y < size && x < size - 1) {
    const newCost = totalCostMap[x][y] + input[x + 1][y];
    totalCostMap[x + 1][y] =
      newCost < totalCostMap[x + 1][y] ? newCost : totalCostMap[x + 1][y];
  }
  if (y < size - 1 && x < size) {
    const newCost = totalCostMap[x][y] + input[x][y + 1];
    totalCostMap[x][y + 1] =
      newCost < totalCostMap[x][y + 1] ? newCost : totalCostMap[x][y + 1];
  }

  if (x > 0) {
    const newCost = totalCostMap[x][y] + input[x - 1][y];
    totalCostMap[x - 1][y] =
      newCost < totalCostMap[x - 1][y] ? newCost : totalCostMap[x - 1][y];
  }
  if (y > 0) {
    const newCost = totalCostMap[x][y] + input[x][y - 1];
    totalCostMap[x][y - 1] =
      newCost < totalCostMap[x][y - 1] ? newCost : totalCostMap[x][y - 1];
  }
};

const traverseMap = (input, size) => {
  for (let step = 0; step < size; step++) {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        calculateAdjacents(input, size, i, j);
      }
    }
  }
};

let t0 = performance.now();

traverseMap(data, SIZE);
const resultOne = totalCostMap[SIZE - 1][SIZE - 1] - totalCostMap[0][0];

let t1 = performance.now() - t0;

const extendedData = [];
for (let idx = 0; idx < 5 * SIZE; idx++) {
  extendedData.push([]);
  const a = Math.floor(idx / SIZE);
  for (let i = 0; i < 5; i++) {
    extendedData[idx].push(
      ...data[idx % SIZE].map((x) =>
        x + i + a > 9 ? x + i + a - 9 : x + i + a
      )
    );
  }
}
SIZE = extendedData.length;
totalCostMap = extendedData.map((r) => r.map((i) => Infinity));
totalCostMap[0][0] = extendedData[0][0];

t0 = performance.now();

traverseMap(extendedData, SIZE);
const resultTwo = totalCostMap[SIZE - 1][SIZE - 1] - totalCostMap[0][0];

let t2 = performance.now() - t0;

console.log('=============================================');
console.log('Part 1 result:', resultOne);
console.log(`Execution time: ${t1.toFixed(3)} ms`);
console.log('=============================================');
console.log('Part 2 result:', resultTwo);
console.log(`Execution time: ${t2.toFixed(3)} ms`);
console.log('=============================================');
