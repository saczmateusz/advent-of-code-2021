const fs = require('fs');
const path = require('path');
const performance = require('perf_hooks').performance;

let data = fs
  .readFileSync(path.join(__dirname, 'data.txt'), 'utf8')
  .split('\r\n')
  .map((l) => l.split('').map((s) => parseInt(s, 10)));

for (row of data) {
  row.unshift(9);
  row.push(9);
}
data.unshift(new Array(data[0].length).fill(9));
data.push(new Array(data[0].length).fill(9));

const lowPoints = [];

const isLowPoint = (i, j) => {
  const point = data[i][j];
  if (
    point < data[i - 1][j] &&
    point < data[i][j + 1] &&
    point < data[i + 1][j] &&
    point < data[i][j - 1]
  ) {
    return true;
  }
  return false;
};

const getAdjacentMembers = (i, j) => {
  const members = [];
  if (data[i - 1][j] < 9) {
    members.push({
      x: i - 1,
      y: j,
      checked: false,
    });
  }
  if (data[i + 1][j] < 9) {
    members.push({
      x: i + 1,
      y: j,
      checked: false,
    });
  }
  if (data[i][j - 1] < 9) {
    members.push({
      x: i,
      y: j - 1,
      checked: false,
    });
  }
  if (data[i][j + 1] < 9) {
    members.push({
      x: i,
      y: j + 1,
      checked: false,
    });
  }
  return members;
};

const filterDuplicates = (input, mask) => {
  return input.filter((i) => {
    for (m of mask) {
      if (i.x === m.x && i.y === m.y) {
        return false;
      }
    }
    return true;
  });
};

// Pretty map print
// for (row of data) {
//   console.log(row.join('').replaceAll(9, '█'));
// }

let t0 = performance.now();

let resultOne = 0;
for (let i = 1; i < data.length - 1; i++) {
  for (let j = 1; j < data[0].length - 1; j++) {
    if (isLowPoint(i, j)) {
      resultOne += data[i][j] + 1;
      lowPoints.push({
        x: i,
        y: j,
        members: [],
      });
    }
  }
}

let t1 = performance.now() - t0;
t0 = performance.now();

for (point of lowPoints) {
  let flag;
  point.members = getAdjacentMembers(point.x, point.y);
  do {
    let helperMembers = [];
    for (member of point.members) {
      if (!member.checked) {
        let memberMembers = getAdjacentMembers(member.x, member.y);
        memberMembers = filterDuplicates(memberMembers, helperMembers);
        helperMembers.push(...memberMembers);
        member.checked = true;
      }
    }
    helperMembers = filterDuplicates(helperMembers, point.members);
    point.members.push(...helperMembers);
    flag = true;
    for (member of point.members) {
      if (!member.checked) {
        flag = false;
      }
    }
  } while (flag === false);
}

let basinSizes = lowPoints
  .map((point) => point.members.length)
  .sort((a, b) => b - a);

const resultTwo = basinSizes[0] * basinSizes[1] * basinSizes[2];

let t2 = performance.now() - t0;

console.log('=============================================');
console.log('Part 1 result:', resultOne);
console.log(`Execution time: ${t1.toFixed(3)} ms`);
console.log('=============================================');
console.log('Part 2 result:', resultTwo);
console.log(`Execution time: ${t2.toFixed(3)} ms`);
console.log('=============================================');
