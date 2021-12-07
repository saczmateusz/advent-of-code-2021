const fs = require('fs');
const path = require('path');
const performance = require('perf_hooks').performance;

let data = fs
  .readFileSync(path.join(__dirname, 'data.txt'), 'utf8')
  .split(',')
  .map((x) => parseInt(x, 10))
  .sort((a, b) => a - b);

const getAbsoluteDistance = (a, b) => Math.abs(a - b);
const getFuelCost = (dist) => (dist * (dist + 1)) / 2;

const getArrayMedian = () => {
  const half = Math.floor(data.length / 2);
  if (half % 2) {
    return data[half];
  }
  return Math.floor((data[half - 1] + data[half]) / 2.0);
};

const getArrayAverage = () => {
  return data.reduce((prev, curr) => prev + curr, 0) / data.length;
};

const calculateAbsoluteCost = (curr) => {
  let sum = 0;
  for (let num of data) {
    if (num !== curr) {
      sum += getAbsoluteDistance(num, curr);
    }
  }
  return sum;
};

const calculateAccumulatedCost = (curr) => {
  let sum = 0;
  for (let num of data) {
    if (num !== curr) {
      sum += getFuelCost(getAbsoluteDistance(num, curr));
    }
  }
  return sum;
};

const getLowerCostNearAverage = (avg) => {
  const floor = calculateAccumulatedCost(Math.floor(avg));
  const ceil = calculateAccumulatedCost(Math.ceil(avg));
  return floor < ceil ? floor : ceil;
};

let t0 = performance.now();

const resultOne = calculateAbsoluteCost(getArrayMedian());

let t1 = performance.now() - t0;
t0 = performance.now();

const resultTwo = getLowerCostNearAverage(getArrayAverage());

let t2 = performance.now() - t0;

console.log('=============================================');
console.log('Part 1 result:', resultOne);
console.log(`Execution time: ${t1.toFixed(3)} ms`);
console.log('=============================================');
console.log('Part 2 result:', resultTwo);
console.log(`Execution time: ${t2.toFixed(3)} ms`);
console.log('=============================================');
