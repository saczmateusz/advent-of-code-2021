const fs = require('fs');
const path = require('path');
const performance = require('perf_hooks').performance;

const map = {};
const parseCoords = (arg) => arg.split(',').map((s) => parseInt(s, 10));

const data = fs
  .readFileSync(path.join(__dirname, 'data.txt'), 'utf8')
  .split('\r\n')
  .map((line) => {
    const arr = line.split(' ');
    const oldXY = parseCoords(arr[0]);
    const newXY = parseCoords(arr[2]);
    return { xOld: oldXY[0], yOld: oldXY[1], xNew: newXY[0], yNew: newXY[1] };
  });

const countMoreThanOneValues = () => {
  let counter = 0;
  for (const [i, row] of Object.entries(map)) {
    for (const [j, value] of Object.entries(row)) {
      if (value > 1) {
        counter++;
      }
    }
  }
  return counter;
};

const drawLineHV = (coords) => {
  let dirX = coords.xOld <= coords.xNew ? 1 : -1;
  let dirY = coords.yOld <= coords.yNew ? 1 : -1;

  let x = coords.xOld;
  do {
    let y = coords.yOld;
    do {
      if (!map[x]) {
        map[x] = { [y]: 1 };
      } else if (!map[x][y]) {
        map[x][y] = 1;
      } else {
        map[x][y] = map[x][y] + 1;
      }
      y += dirY;
    } while (
      (dirY === 1 && y <= coords.yNew) ||
      (dirY === -1 && y >= coords.yNew)
    );
    x += dirX;
  } while (
    (dirX === 1 && x <= coords.xNew) ||
    (dirX === -1 && x >= coords.xNew)
  );
};

const drawLineDiagonal = (coords) => {
  let dirX = coords.xOld <= coords.xNew ? 1 : -1;
  let dirY = coords.yOld <= coords.yNew ? 1 : -1;

  let x = coords.xOld;
  let y = coords.yOld;
  do {
    if (!map[x]) {
      map[x] = { [y]: 1 };
    } else if (!map[x][y]) {
      map[x][y] = 1;
    } else {
      map[x][y] = map[x][y] + 1;
    }
    y += dirY;
    x += dirX;
  } while (
    (dirX === 1 && x <= coords.xNew) ||
    (dirX === -1 && x >= coords.xNew)
  );
};

const drawHVPoints = (lines) => {
  for (coords of lines) {
    drawLineHV(coords);
  }
  return;
};

const drawDiagonals = (lines) => {
  for (coords of lines) {
    drawLineDiagonal(coords);
  }
};

let t0 = performance.now();

const dataHV = data.filter((c) =>
  c.xOld !== c.xNew && c.yOld !== c.yNew ? false : true
);
drawHVPoints(dataHV);
const resultOne = countMoreThanOneValues();

let t1 = performance.now() - t0;
t0 = performance.now();

const dataD = data.filter((c) =>
  c.xOld !== c.xNew && c.yOld !== c.yNew ? true : false
);
drawDiagonals(dataD);
const resultTwo = countMoreThanOneValues();

let t2 = performance.now() - t0;

console.log('=============================================');
console.log('Part 1 result:', resultOne);
console.log(`Execution time: ${t1.toFixed(3)} ms`);
console.log('=============================================');
console.log('Part 2 result:', resultTwo);
console.log(`Execution time: ${t2.toFixed(3)} ms`);
console.log('=============================================');
