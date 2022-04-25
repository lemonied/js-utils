class Sudoku {
  constructor(board) {
    this.nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    this.row = 0;
    this.column = 0;
    this.board = board;
    this.clonedBoard = board.map(item => item.slice());
  }
  fill() {
    if (this.clonedBoard[this.row][this.column] === '.') {
      const available = this.findAvailable(this.row, this.column);
      if (available.length)  {
        const index = available.findIndex(item => this.board[this.row][this.column] === '.' || item > this.board[this.row][this.column]);
        if (index > -1) {
          this.board[this.row][this.column] = available[index];
          this.column += 1;
        } else {
          this.board[this.row][this.column] = '.';
          const last = this.findLastEmpty(this.row, this.column);
          this.row = last[0];
          this.column = last[1];
        }
      } else {
        this.board[this.row][this.column] = '.';
        const last = this.findLastEmpty(this.row, this.column);
        this.row = last[0];
        this.column = last[1];
      }
    } else {
      this.column += 1;
    }
  }
  solve() {
    while (this.row < this.board.length) {
      if (this.column >= this.board[this.row].length) {
        this.row += 1;
        this.column = 0;
        continue;
      }
      this.fill();
    }
  }
  animate(timeout = 20, callback) {
    const deep = () => {
      if (this.row >= this.board.length) { return; }
      if (this.column >= this.board[this.row].length) {
        this.row += 1;
        this.column = 0;
        setTimeout(() => deep(), timeout);
        return;
      }
      this.fill();
      if (typeof callback === 'function') {
        callback();
      }
      setTimeout(() => deep(), timeout);
    };
    deep();
  }
  findLastEmpty(a, b) {
    if (a < 0) { throw new Error('No Result'); }
    if (b - 1 < 0) {
      return this.findLastEmpty(a - 1, this.board[a].length);
    }
    if (this.clonedBoard[a][b - 1] === '.') {
      return [a, b - 1];
    } else {
      return this.findLastEmpty(a, b - 1);
    }
  }
  findAvailable(a, b) {
    const startX = a - a % 3;
    const startY = b - b % 3;
    const square = [];
    for (let i = startX; i < startX + 3; i++) {
      for (let j = startY; j < startY + 3; j++) {
        square.push(this.board[i][j]);
      }
    }
    const row = this.board[a];
    const column = this.board.map(item => item[b]);
    return this.nums.filter(item => square.indexOf(item) === -1 && row.indexOf(item) === -1 && column.indexOf(item) === -1);
  }
}
const board = [
  [".",".",".",".","6",".","4",".","."],
  [".","2",".",".","5","1",".",".","."],
  [".","9",".",".",".",".","6",".","7"],
  ["7",".","5",".",".",".","9",".","."],
  [".",".",".","2",".","4",".",".","."],
  [".",".","2",".",".",".","3",".","6"],
  ["1",".","9",".",".",".",".","5","."],
  [".",".",".","9","1",".",".","3","."],
  [".",".","8",".","7",".",".",".","."],
];
console.time();
new Sudoku(board).solve();
console.log(board);
console.timeEnd();
