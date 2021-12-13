const fs = require('fs');
const path = require('path');
const performance = require('perf_hooks').performance;

const data = fs
  .readFileSync(path.join(__dirname, 'data.txt'), 'utf8')
  .split('\r\n')
  .map((l) => l.split(''));

const openingBrackets = ['(', '[', '{', '<'];
const closingBracketsMap = { '(': ')', '[': ']', '{': '}', '<': '>' };

const corruptedBracketsScoringMap = { ')': 3, ']': 57, '}': 1197, '>': 25137 };
const missingBracketsScoringMap = { '(': 1, '[': 2, '{': 3, '<': 4 };

let incompleteRowHeaps = [];

const evaluateRow = (row) => {
  let heap = [];
  let rowScore = 0;
  for (bracket of row) {
    if (openingBrackets.includes(bracket)) {
      heap.push(bracket);
    } else {
      const poppedValue = heap.pop();
      if (closingBracketsMap[poppedValue] !== bracket) {
        rowScore = corruptedBracketsScoringMap[bracket];
        break;
      }
    }
  }
  if (rowScore === 0) {
    incompleteRowHeaps.push([...heap]);
  }
  return rowScore;
};

const getHeapScore = (heap) => {
  let heapScore = 0;
  while (heap.length) {
    const poppedValue = heap.pop();
    heapScore *= 5;
    heapScore += missingBracketsScoringMap[poppedValue];
  }
  return heapScore;
};

let t0 = performance.now();

let resultOne = 0;
for (row of data) {
  let rowScore = evaluateRow(row);
  resultOne += rowScore;
}

let t1 = performance.now() - t0;
t0 = performance.now();

let incompleteRowHeapsScore = [];
for (heap of incompleteRowHeaps) {
  incompleteRowHeapsScore.push(getHeapScore(heap));
}
incompleteRowHeapsScore.sort((a, b) => a - b);
const idx = (incompleteRowHeapsScore.length - 1) / 2;
const resultTwo = incompleteRowHeapsScore[idx];

let t2 = performance.now() - t0;

console.log('=============================================');
console.log('Part 1 result:', resultOne);
console.log(`Execution time: ${t1.toFixed(3)} ms`);
console.log('=============================================');
console.log('Part 2 result:', resultTwo);
console.log(`Execution time: ${t2.toFixed(3)} ms`);
console.log('=============================================');
