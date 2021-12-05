const fs = require('fs');
const path = require('path');
const performance = require('perf_hooks').performance;

const data = fs
  .readFileSync(path.join(__dirname, 'data.txt'), 'utf8')
  .split('\r\n')
  .map((x) => x.split(''));

let t0 = performance.now();

const dataLength = data.length;
let gamma = '';
let epsilon = '';
for (let j = 0; j < data[0].length; j++) {
  const zerosCount = data.filter((s) => s[j] === '0').length;
  gamma = zerosCount > dataLength - zerosCount ? gamma + '0' : gamma + '1';
  epsilon =
    zerosCount > dataLength - zerosCount ? epsilon + '1' : epsilon + '0';
}
const resultOne = parseInt(gamma, 2) * parseInt(epsilon, 2);

let t1 = performance.now() - t0;
t0 = performance.now();

let arr = [...data];
let j = 0;
while (arr.length !== 1) {
  const zerosCount = arr.filter((s) => s[j] === '0').length;
  arr =
    zerosCount > arr.length - zerosCount
      ? arr.filter((s) => s[j] === '0')
      : arr.filter((s) => s[j] === '1');
  j++;
}
const oxygen = arr[0];

arr = [...data];
j = 0;
while (arr.length !== 1) {
  const zerosCount = arr.filter((s) => s[j] === '0').length;
  arr =
    zerosCount <= arr.length - zerosCount
      ? arr.filter((s) => s[j] === '0')
      : arr.filter((s) => s[j] === '1');
  j++;
}
const co2 = arr[0];
const resultTwo = parseInt(oxygen.join(''), 2) * parseInt(co2.join(''), 2);

let t2 = performance.now() - t0;

console.log('=============================================');
console.log('Part 1 result:', resultOne);
console.log(`Execution time: ${t1.toFixed(3)} ms`);
console.log('=============================================');
console.log('Part 2 result:', resultTwo);
console.log(`Execution time: ${t2.toFixed(3)} ms`);
console.log('=============================================');
