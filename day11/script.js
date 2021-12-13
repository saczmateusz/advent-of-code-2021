const fs = require('fs');
const path = require('path');
const performance = require('perf_hooks').performance;

const data = fs
  .readFileSync(path.join(__dirname, 'data.txt'), 'utf8')
  .split('\r\n')
  .map((l) => l.split('').map((s) => parseInt(s, 10)));

const increaseAdjacent = (x, y, arr) => {
  const y_GT_0 = y > 0;
  const y_LT_9 = y < 9;
  if (y_GT_0) {
    arr[x][y - 1]++;
  }
  if (y_LT_9) {
    arr[x][y + 1]++;
  }

  if (x > 0) {
    arr[x - 1][y]++;
    if (y_GT_0) {
      arr[x - 1][y - 1]++;
    }
    if (y_LT_9) {
      arr[x - 1][y + 1]++;
    }
  }

  if (x < 9) {
    arr[x + 1][y]++;
    if (y_GT_0) {
      arr[x + 1][y - 1]++;
    }
    if (y_LT_9) {
      arr[x + 1][y + 1]++;
    }
  }
};

const incrementOctopuses = (arr) => {
  for (let rowId = 0; rowId < arr.length; rowId++) {
    for (let colId = 0; colId < arr[rowId].length; colId++) {
      arr[rowId][colId]++;
    }
  }
};

const setZeroToFlashedOctopuses = (arr) => {
  for (let rowId = 0; rowId < arr.length; rowId++) {
    for (let colId = 0; colId < arr[rowId].length; colId++) {
      if (arr[rowId][colId] > 1000) {
        arr[rowId][colId] = 0;
      }
    }
  }
};

const runSteps = (arr, mode, steps) => {
  let totalOctopusesFlashed = 0;
  let allFlashedFlag = false;
  let step = 1;
  while (
    (mode === 'fixed' && step <= steps) ||
    (mode === 'sync' && !allFlashedFlag)
  ) {
    incrementOctopuses(arr);
    let octopusesToFlash = true;
    while (octopusesToFlash) {
      for (let rowId = 0; rowId < arr.length; rowId++) {
        for (let colId = 0; colId < arr[rowId].length; colId++) {
          if (arr[rowId][colId] > 9 && arr[rowId][colId] < 1000) {
            arr[rowId][colId] += 1000;
            totalOctopusesFlashed++;
            increaseAdjacent(rowId, colId, arr);
          }
        }
      }
      octopusesToFlash = arr.flat().filter((m) => m > 9 && m < 1000).length
        ? true
        : false;
    }
    setZeroToFlashedOctopuses(arr);
    allFlashedFlag = arr.flat().reduce((p, c) => p + c) === 0 ? true : false;
    if (mode === 'sync' && allFlashedFlag) {
      return step;
    }
    step++;
  }
  return totalOctopusesFlashed;
};

let matrix = [];
for (row of data) {
  matrix.push([...row]);
}

let t0 = performance.now();

const resultOne = runSteps(matrix, 'fixed', 100);

let t1 = performance.now() - t0;
t0 = performance.now();

const resultTwo = runSteps(data, 'sync');

let t2 = performance.now() - t0;

console.log('=============================================');
console.log('Part 1 result:', resultOne);
console.log(`Execution time: ${t1.toFixed(3)} ms`);
console.log('=============================================');
console.log('Part 2 result:', resultTwo);
console.log(`Execution time: ${t2.toFixed(3)} ms`);
console.log('=============================================');
