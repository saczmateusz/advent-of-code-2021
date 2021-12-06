const fs = require('fs');
const path = require('path');
const performance = require('perf_hooks').performance;

const data = fs
  .readFileSync(path.join(__dirname, 'data.txt'), 'utf8')
  .split('\r\n')
  .map((x) => x.replaceAll('  ', ' '));

const numbers = data
  .shift()
  .split(',')
  .map((s) => parseInt(s, 10));

let boards = data.reduce((prev, current) => {
  if (current === '') {
    prev.push([]);
  } else {
    let row = current.split(' ');
    if (row[0] === '') {
      row.shift();
    }
    row = row.map((s) => parseInt(s, 10));
    prev[prev.length - 1].push(row);
  }
  return prev;
}, []);

const isRowEmpty = (row) => {
  for (num of row) {
    if (num !== null) {
      return false;
    }
  }
  return true;
};

const checkRows = (board) => {
  for (row of board) {
    if (isRowEmpty(row)) {
      return true;
    }
  }
  return false;
};

const checkColumns = (board) => {
  for (let i = 0; i < 5; i++) {
    let column = [];
    for (row of board) {
      column.push(row[i]);
    }
    if (isRowEmpty(column)) {
      return true;
    }
  }
  return false;
};

const isFinished = (board) => {
  const rowEmpty = checkRows(board);
  const columnEmpty = checkColumns(board);
  if (rowEmpty || columnEmpty) {
    return true;
  }
  return false;
};

const sumBoardItems = (board) => {
  const numbers = board.flat();
  return numbers.reduce((prev, curr) => prev + curr);
};

const findFirstFinishedBoard = () => {
  for (number of numbers) {
    let boardSum = 0;
    for (board of boards) {
      for (row in board) {
        for (num in board[row]) {
          if (board[row][num] === number) {
            board[row][num] = null;
          }
        }
      }
      if (isFinished(board)) {
        boardSum = sumBoardItems(board);
        break;
      }
    }
    if (boardSum) {
      return boardSum * number;
    }
  }
};

const allBoardsMarked = (arr) => {
  return arr.filter((a) => a !== true).length ? false : true;
};

const findLastFinishedBoard = () => {
  const boardsMarkedAsDone = new Array(boards.length);
  boardsMarkedAsDone.fill(false);
  for (number of numbers) {
    let boardSum = 0;
    for (boardIx in boards) {
      const board = boards[boardIx];
      for (row in board) {
        for (num in board[row]) {
          if (board[row][num] === number) {
            board[row][num] = null;
          }
        }
      }
      if (isFinished(board)) {
        boardsMarkedAsDone[boardIx] = true;
        if (allBoardsMarked(boardsMarkedAsDone)) {
          boardSum = sumBoardItems(board);
          break;
        }
      }
    }
    if (boardSum) {
      return boardSum * number;
    }
  }
};

let t0 = performance.now();

const resultOne = findFirstFinishedBoard();

let t1 = performance.now() - t0;
t0 = performance.now();

const resultTwo = findLastFinishedBoard();

let t2 = performance.now() - t0;

console.log('=============================================');
console.log('Part 1 result:', resultOne);
console.log(`Execution time: ${t1.toFixed(3)} ms`);
console.log('=============================================');
console.log('Part 2 result:', resultTwo);
console.log(`Execution time: ${t2.toFixed(3)} ms`);
console.log('=============================================');
