/* Board matricies */
const matrices = [
  [
    ["P5", "P2", "P3"],
    ["R6", "R4", "Y3"],
    ["B4", "G5", "G3"],
  ],
  [
    ["Y2", "W1", "B1"],
    ["W2", "G2", "R2"],
    ["P4", "G6", "W4"],
  ],
  [
    ["W6", "B6", "B2"],
    ["R3", "Y4", "W3"],
    ["B3", "G4", "W5"],
  ],
  [
    ["P6", "Y5", "P1"],
    ["R1", "B5", "Y6"],
    ["G1", "R5", "Y1"],
  ],
];

/* Complete board */
const board = [[] * 6];

/* Color dictionary used to convert letters to the corresponding colors */
const colorDict = {
  P: "pink",
  Y: "yellow",
  W: "white",
  B: "blue",
  R: "red",
  G: "green",
};

/* The current path */
let cellPath = [];

function rotateMatrix(index, clockwise) {
  let matrix = matrices[index];
  if (clockwise) {
    matrix = [
      [matrix[2][0], matrix[1][0], matrix[0][0]],
      [matrix[2][1], matrix[1][1], matrix[0][1]],
      [matrix[2][2], matrix[1][2], matrix[0][2]],
    ];
  } else {
    matrix = [
      [matrix[0][2], matrix[1][2], matrix[2][2]],
      [matrix[0][1], matrix[1][1], matrix[2][1]],
      [matrix[0][0], matrix[1][0], matrix[2][0]],
    ];
  }

  matrices[index] = matrix;
  buildBoard();
  generateBoard();
}

/* Construct the board from the matricies. */
function buildBoard() {
  for (let i = 0; i < 3; i++) {
    board[i] = matrices[0][i].concat(matrices[1][i]);
    board[i + 3] = matrices[2][i].concat(matrices[3][i]);
  }
  console.log(board);
}

/* Extract the color and number from a cell string */
function parseCellString(string) {
  return [colorDict[string.substring(0, 1)], string.substring(1, 2)];
}

/* Check the validity of a movement between two cells */
function checkMoveValidity(row1, col1, row2, col2) {
  let cell1 = board[row1][col1];
  let color1 = colorDict[cell1.substring(0, 1)];
  let number1 = cell1.substring(1, 2);
  console.log(`CELL1: ${cell1}, ROW: ${row1}, COL: ${col1}`);

  let cell2 = board[row2][col2];
  let color2 = colorDict[cell2.substring(0, 1)];
  let number2 = cell2.substring(1, 2);
  console.log(`CELL2: ${cell2}, ROW: ${row2}, COL: ${col2}`);

  if (
    (color1 == color2 || number1 == number2) &&
    (row1 == row2 || col1 == col2)
  ) {
    return true;
  } else {
    return false;
  }
}

/* Function used as an event for cell clicks. */
function clickCell() {
  let row = parseInt(this.getAttribute("row"));
  let col = parseInt(this.getAttribute("col"));

  if (
    checkMoveValidity(
      cellPath[cellPath.length - 1][0],
      cellPath[cellPath.length - 1][1],
      row,
      col
    )
  ) {
    console.log("Valid move.");
    cellPath.push([row, col]);
  } else {
    console.log("Invalid move.");
  }
}

/* Generate the board */
function generateBoard() {
  /* Select board grid element on webpage */
  const grid = document.getElementsByClassName("grid")[0];

  /* Clear the board */
  grid.innerHTML = "";

  /* Iterate through the board and create cells on the webpage. */
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      /* Parse the data from the board cell. */
      let cellData = parseCellString(board[row][col]);
      let color = cellData[0];
      let number = cellData[1];

      /* Create a new cell and set it's attributes */
      let divCell = document.createElement("div");
      divCell.setAttribute("row", row);
      divCell.setAttribute("col", col);
      divCell.classList.add(color, "cell");

      /* Create a number container and append it to the cell as a child. */
      let textContainer = document.createElement("div");
      textContainer.classList.add("number-container");
      textContainer.innerHTML = number;
      divCell.appendChild(textContainer);

      /* Add an event listener to the cell. */
      divCell.addEventListener("click", clickCell);

      /* Append the cell to the grid */
      grid.append(divCell);
    }
  }

  /* Define start and end rows */
  let startRow = getRandomInt(6);
  let startCol = getRandomInt(6);
  let endRow = getRandomInt(6);
  let endCol = getRandomInt(6);

  /* Make sure the end cell position isnt within 1 cell of the start cell. */
  while (
    (startRow === endRow ||
      startRow + 1 === endRow ||
      startRow - 1 === endRow) &&
    (startCol === endCol || startCol + 1 === endCol || startCol - 1 === endCol)
  ) {
    endRow = getRandomInt(6);
    endCol = getRandomInt(6);
  }

  /* Find start and end cell elements */
  let startCell = locateElement(startRow, startCol);
  let endCell = locateElement(endRow, endCol);

  board[startRow][startCol] += "S";
  board[endRow][endCol] += "E";
}

/* Get a random integer from 0 to n */
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

/* Locate a cell div on the board with its row and column */
function locateElement(row, col) {
  return document.querySelector(`[row="${row}"][col="${col}"]`);
}

buildBoard();
generateBoard();

/* Add the start and end classes to the correspoding cells */
startCell.classList.add("start");
endCell.classList.add("end");

cellPath.push([startRow, startCol]);
