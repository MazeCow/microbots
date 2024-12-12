class Cell {
  constructor(color, number) {
    this.color = color;
    this.number = number;
    this.isStart = false;
    this.isEnd = false;
    this.occupied = false;
  }
}

class Board {
  constructor(gridContainer) {
    this._board = [
      [
        new Cell("pink", 5),
        new Cell("pink", 2),
        new Cell("pink", 3),
        new Cell("yellow", 2),
        new Cell("white", 1),
        new Cell("blue", 1),
      ],
      [
        new Cell("red", 6),
        new Cell("red", 4),
        new Cell("yellow", 3),
        new Cell("white", 2),
        new Cell("green", 2),
        new Cell("red", 2),
      ],
      [
        new Cell("blue", 4),
        new Cell("green", 5),
        new Cell("green", 3),
        new Cell("pink", 4),
        new Cell("green", 6),
        new Cell("white", 4),
      ],
      [
        new Cell("white", 6),
        new Cell("blue", 6),
        new Cell("blue", 2),
        new Cell("pink", 6),
        new Cell("yellow", 5),
        new Cell("pink", 1),
      ],
      [
        new Cell("red", 3),
        new Cell("yellow", 4),
        new Cell("white", 3),
        new Cell("red", 1),
        new Cell("blue", 5),
        new Cell("yellow", 6),
      ],
      [
        new Cell("blue", 3),
        new Cell("green", 4),
        new Cell("white", 5),
        new Cell("green", 1),
        new Cell("red", 5),
        new Cell("yellow", 1),
      ],
    ];
    this.gridContainer = gridContainer;
    this.startCell = null;
    this.endCell = null;
    this.placeStartEndCells();
    this.generateBoard();
    this.movementHandler = new MovementHandler(this);
  }

  /* Get a random integer from 0 to max. */
  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  /* Return a 2d array of the given ranges. */
  extractBoardMatrix(rowStart, rowEnd, colStart, colEnd) {
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
  splitBoard() {
    return [
      this.extractBoardMatrix(0, 3, 0, 3),
      this.extractBoardMatrix(0, 3, 3, 6),
      this.extractBoardMatrix(3, 6, 0, 3),
      this.extractBoardMatrix(3, 6, 3, 6),
    ];
  }

  /* Rotate and return a matrix from the board. */
  rotateMatrix(index, clockwise) {
    let sections = this.splitBoard();
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
    this.buildBoard(sections);
    console.log(sections);
    this.generateBoard();
  }

  /* Builds the board from a set of four matricies. */
  buildBoard(matricies) {
    /* Get the quadrants of the board if they were not provided. */
    if (matricies == undefined) {
      matricies = this.splitBoard();
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

  /* Place the start and end cells on the board. */
  placeStartEndCells() {
    /* Define start and end rows */
    let [startRow, startCol] = [this.getRandomInt(6), this.getRandomInt(6)];
    let [endRow, endCol] = [this.getRandomInt(6), this.getRandomInt(6)];

    /* Add start pos to cellPath */
    cellPath.push([startRow, startCol]);

    /* Make sure the end cell position isnt within 1 cell of the start cell. */
    while (
      Math.abs(startRow - endRow) <= 1 &&
      Math.abs(startCol - endCol) <= 1
    ) {
      [endRow, endCol] = [this.getRandomInt(6), this.getRandomInt(6)];
    }

    /* Set the board's start and end cell properties. */
    this.startCell = [startRow, startCol];
    this.endCell = [endRow, endCol];

    /* Apply appropriate properties to the start and end cells. */
    this._board[startRow][startCol].isStart = true;
    this._board[endRow][endCol].isEnd = true;
  }

  /* Generate the HTML of the board inside of the Board's container. */
  generateBoard() {
    /* Select board grid element on webpage */
    this.gridContainer.classList.add("grid");

    /* Clear the board */
    grid.innerHTML = "";

    /* Iterate through the board and create cells on the webpage. */
    for (let row = 0; row < this._board.length; row++) {
      for (let col = 0; col < this._board[row].length; col++) {
        /* Parse the data from the board cell. */
        let cell = this._board[row][col];

        /* Create a new cell and set it's attributes */
        let divCell = document.createElement("div");
        divCell.setAttribute("row", row);
        divCell.setAttribute("col", col);
        divCell.classList.add(cell.color, "cell");

        /* Also set it's classes. */
        if (cell.isStart) {
          divCell.classList.add("start");
        } else if (cell.isEnd) {
          divCell.classList.add("end");
        }

        /* Create a number container and append it to the cell as a child. */
        let textContainer = document.createElement("div");
        textContainer.classList.add("number-container");
        textContainer.innerHTML = cell.number;
        divCell.appendChild(textContainer);

        /* Add an event listener to the cell. */
        divCell.addEventListener("click", clickCell);

        /* Append the cell to the grid */
        grid.append(divCell);
      }
    }
  }
}

class MovementHandler {
  constructor(board) {
    this.board = board;
    this.addClickListeners();
  }

  addClickListeners() {
    for (let row = 0; row < this.board._board.length; row++) {
      for (let col = 0; col < this.board._board.length; col++) {
        const cell = this.board.gridContainer.querySelector(
          `[row="${row}"][col="${col}"]`
        );
        cell.addEventListener("click", clickCell());
      }
    }
  }

  clickCell() {
    console.log("clicked!");
  }
}

/* The current path */
let cellPath = [];

function clickCell() {
  return;
}

function closeLightbox() {
  const lightbox = document.getElementsByClassName("lightbox")[0];
  lightbox.classList.toggle("hidden");
  /* Rebuild board here when that function is available. */
}

function openLightbox(moves) {
  const lightbox = document.getElementsByClassName("lightbox")[0];
  const movesText = document.getElementById("moves");
  movesText.innerHTML = moves;
  lightbox.classList.toggle("hidden");
}

const grid = document.getElementsByClassName("grid")[0];

board = new Board(grid);
