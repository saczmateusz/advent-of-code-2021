const fs = require('fs');
const path = require('path');
const performance = require('perf_hooks').performance;

const data = fs
  .readFileSync(path.join(__dirname, 'data.txt'), 'utf8')
  .split('\n')
  .map((x) => parseInt(x, 10));

let t0 = performance.now();

let resultOne = 0;
for (let i = 1; i < data.length; i++) {
  if (data[i] > data[i - 1]) {
    resultOne++;
  }
}

let t1 = performance.now() - t0;
t0 = performance.now();

let resultTwo = 0;
for (let i = 3; i < data.length; i++) {
  const group1Sum = data.slice(i - 3, i).reduce((s, a) => s + a);
  const group2Sum = data.slice(i - 2, i + 1).reduce((s, a) => s + a);
  if (group2Sum > group1Sum) {
    resultTwo++;
  }
}

let t2 = performance.now() - t0;

console.log('=============================================');
console.log('Part 1 result:', resultOne);
console.log(`Execution time: ${t1.toFixed(3)} ms`);
console.log('=============================================');
console.log('Part 2 result:', resultTwo);
console.log(`Execution time: ${t2.toFixed(3)} ms`);
console.log('=============================================');
