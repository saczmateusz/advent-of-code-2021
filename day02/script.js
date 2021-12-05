const fs = require('fs');
const path = require('path');
const performance = require('perf_hooks').performance;

const data = fs
  .readFileSync(path.join(__dirname, 'data.txt'), 'utf8')
  .split('\r\n')
  .map((x) => {
    const line = x.split(' ');
    return {
      dir: line[0],
      val: parseInt(line[1], 10),
    };
  });

let t0 = performance.now();

let depth = 0;
let distance = 0;
for (let i = 0; i < data.length; i++) {
  const nav = data[i];
  switch (nav.dir) {
    case 'forward':
      distance += nav.val;
      break;
    case 'up':
      depth -= nav.val;
      break;
    case 'down':
      depth += nav.val;
      break;
    default:
      break;
  }
}

const resultOne = depth * distance;

let t1 = performance.now() - t0;
t0 = performance.now();

depth = 0;
distance = 0;
let aim = 0;
for (let i = 0; i < data.length; i++) {
  const nav = data[i];
  switch (nav.dir) {
    case 'forward':
      distance += nav.val;
      depth += nav.val * aim;
      break;
    case 'up':
      aim -= nav.val;
      break;
    case 'down':
      aim += nav.val;
      break;
    default:
      break;
  }
}

const resultTwo = depth * distance;

let t2 = performance.now() - t0;

console.log('=============================================');
console.log('Part 1 result:', resultOne);
console.log(`Execution time: ${t1.toFixed(3)} ms`);
console.log('=============================================');
console.log('Part 2 result:', resultTwo);
console.log(`Execution time: ${t2.toFixed(3)} ms`);
console.log('=============================================');
