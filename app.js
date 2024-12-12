const colors = ["red", "yellow", "green", "blue", "pink", "white"];

class Cell {
  constructor(color, number) {
    this.color = colors[color];
    this.number = number;
    this._isStart = false;
    this._isEnd = false;
    this._isOccupied = false;
    this._row = null;
    this._col = null;
  }
}

class BoardTools {
  /* Find a cell div with a row and column. */
  static findCellDiv(row, col) {
    const grid = document.getElementsByClassName("grid")[0];
    return grid.children[row * 6 + col];
  }

  /* Get a random integer from 0 to max. */
  static randInt(max) {
    return Math.floor(Math.random() * max);
  }
}

class Board {
  constructor() {
    this._board = [
      [
        new Cell(4, 5),
        new Cell(4, 2),
        new Cell(4, 3),
        new Cell(1, 2),
        new Cell(5, 1),
        new Cell(3, 1),
      ],
      [
        new Cell(0, 6),
        new Cell(0, 4),
        new Cell(1, 3),
        new Cell(5, 2),
        new Cell(2, 2),
        new Cell(0, 2),
      ],
      [
        new Cell(3, 4),
        new Cell(2, 5),
        new Cell(2, 3),
        new Cell(4, 4),
        new Cell(2, 6),
        new Cell(5, 4),
      ],
      [
        new Cell(5, 6),
        new Cell(3, 6),
        new Cell(3, 2),
        new Cell(4, 6),
        new Cell(1, 5),
        new Cell(4, 1),
      ],
      [
        new Cell(0, 3),
        new Cell(1, 4),
        new Cell(5, 3),
        new Cell(0, 1),
        new Cell(3, 5),
        new Cell(1, 6),
      ],
      [
        new Cell(3, 3),
        new Cell(2, 4),
        new Cell(5, 5),
        new Cell(2, 1),
        new Cell(0, 5),
        new Cell(1, 1),
      ],
    ];
    this.grid = document.getElementsByClassName("grid")[0];
    this.place();
  }

  /* Return a 2d array of the given ranges. */
  getArea(rowStart, rowEnd, colStart, colEnd) {
    let extractedMatrix = [];
    for (let row = rowStart; row < rowEnd; row++) {
      let rows = [];
      for (let col = colStart; col < colEnd; col++) {
        rows.push(this._board[row][col]);
      }
      extractedMatrix.push(rows);
    }
    return extractedMatrix;
  }

  /* Returns an array of the board's four quadrants. */
  divide() {
    return [
      this.getArea(0, 3, 0, 3),
      this.getArea(0, 3, 3, 6),
      this.getArea(3, 6, 0, 3),
      this.getArea(3, 6, 3, 6),
    ];
  }

  /* Rotate and return a matrix from the board. */
  rotate(index, clockwise) {
    let sections = this.divide();
    let matrix = sections[index];

    /* Temporary matrix for rotation. */
    let tempMatrix = [];
    if (clockwise) {
      for (let col = 0; col < 3; col++) {
        let rowArray = [];
        for (let row = 2; row >= 0; row--) {
          rowArray.push(matrix[row][col]);
        }
        tempMatrix.push(rowArray);
      }
    } else {
      for (let col = 2; col >= 0; col--) {
        let rowArray = [];
        for (let row = 0; row < 3; row++) {
          rowArray.push(matrix[row][col]);
        }
        tempMatrix.push(rowArray);
      }
    }
    sections[index] = tempMatrix;
    this.recombine(sections);
  }

  /* Builds the board from a set of four matricies. */
  recombine(matricies) {
    /* Get the quadrants of the board if they were not provided. */
    if (matricies == undefined) {
      matricies = this.divide();
    }

    /* Recombine all the matricies . */
    let matrixRows = [];
    for (let j = 0; j < 3; j += 2) {
      let tempRows = [];
      for (let i = 0; i < 3; i++) {
        tempRows.push([...matricies[j][i], ...matricies[j + 1][i]]);
      }
      matrixRows.push(...tempRows);
    }

    /* Make matrixRows the new board. */
    this._board = matrixRows;
  }

  /* Generate the HTML of the board inside of the Board's container. */
  place() {
    /* Clear the board */
    this.grid.innerHTML = "";

    /* Iterate through the board and create cells on the webpage. */
    for (let row = 0; row < this._board.length; row++) {
      for (let col = 0; col < this._board[row].length; col++) {
        /* Parse the data from the board cell. */
        let cell = this._board[row][col];

        /* Create a new cell and set it's attributes */
        let divCell = document.createElement("div");

        /* Also set it's classes. */
        divCell.classList.add(cell.color, "cell");
        if (cell.isStart) {
          divCell.classList.add("start");
        } else if (cell.isEnd) {
          divCell.classList.add("end");
        }

        /* Set the number value. */
        divCell.innerHTML = cell.number;

        /* Append the cell to the grid */
        this.grid.append(divCell);
      }
    }
  }
}

class MovementHandler {
  constructor() {
    this.startPos = this.randomStartPos();
    this.endPos = this.randomEndPos();
    this.movementPath = [this.startPos];
  }

  /* Returns the move count. */
  get moveCount() {
    return this.moveList.length;
  }

  /* Returns the currently occupied cell. */
  get occupiedCell() {
    return this.board.occupiedCell;
  }

  randomStartPos() {
    return [BoardTools.getRandomInt(6), BoardTools.getRandomInt(6)];
  }
  randomEndPos() {
    let [endRow, endCol] = [
      BoardTools.getRandomInt(6),
      BoardTools.getRandomInt(6),
    ];
    /* Make sure the end cell position isnt within 1 cell of the start cell. */
    while (
      Math.abs(startPos[0] - endRow) <= 1 &&
      Math.abs(startPos[1] - endCol) <= 1
    ) {
      [endRow, endCol] = [
        BoardTools.getRandomInt(6),
        BoardTools.getRandomInt(6),
      ];
    }
  }
}

const board = new Board();
