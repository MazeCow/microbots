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
  constructor() {
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
  }

  /* Get a random integer from 0 to n */
  getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  extractBoardMatrix(rowStart, rowEnd, colStart, colEnd) {
    let extractedMatrix = [];
    for (let row = rowStart; row < rowEnd; row++) {
      let rows = [];
      for (let col = colStart; col < colEnd; col++) {
        try {
          rows.push(this._board[row][col]);
        } catch (error) {
          alert(JSON.stringify(this._board));

          console.error(error);
        }
      }
      extractedMatrix.push(rows);
    }
    return extractedMatrix;
  }

  splitBoard() {
    const arr = [
      this.extractBoardMatrix(0, 3, 0, 3),
      this.extractBoardMatrix(0, 3, 3, 6),
      this.extractBoardMatrix(3, 6, 0, 3),
      this.extractBoardMatrix(3, 6, 3, 6),
    ];
    alert(JSON.stringify(arr));
    return [
      this.extractBoardMatrix(0, 3, 0, 3),
      this.extractBoardMatrix(0, 3, 3, 6),
      this.extractBoardMatrix(3, 6, 0, 3),
      this.extractBoardMatrix(3, 6, 3, 6),
    ];
  }

  /* Rotate and return a matrix from the board. */
  /* The index represents the quadrant of the board in order from top left to bottom right. */
  rotateMatrix(index, clockwise) {
    let sections = this.splitBoard(this._board);
    let matrix = sections[index];
    /* Temporary matrix for rotation. */
    let tempMatrix = [];
    if (clockwise) {
      for (let row = 2; row >= 0; row--) {
        let rowArray = [];
        for (let col = 0; col < 3; col++) {
          rowArray.push(matrix[row][col]);
        }
        tempMatrix.push(rowArray);
      }
    } else {
      for (let row = 0; row < 3; row++) {
        let rowArray = [];
        for (let col = 2; col >= 0; col--) {
          rowArray.push(matrix[row][col]);
        }
        tempMatrix.push(rowArray);
      }
    }
    sections[index] = tempMatrix;
    this._board = this.buildBoard(sections);
  }

  buildBoard(matricies) {
    matricies = this.splitBoard();
    let matrixRows = [];
    for (let i = 0; i < matricies.length / 2; i++) {
      let matrixRow = matricies[i].map((row, j) => {
        [...row, ...matricies[j]];
      });
      matrixRows.push(matrixRow);
    }
    const b = [...matrixRows[0], ...matrixRows[1]];
    return b;
  }

  static placeStartEndCells() {
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
    /* Todo: actually place the start and end spots. */
    this._board[startRow][startCol].isStart = true;
    this._board[endRow][endCol].isStart = true;
  }

  generateBoard(gridDiv) {
    /* Select board grid element on webpage */
    gridDiv.classList.add("grid");

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

/* The current path */
let cellPath = [];

function clickCell() {
  return;
}

/* Generate the board */

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

board = new Board();
board.generateBoard(grid);
