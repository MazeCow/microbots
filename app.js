/* Board */
const board = [
  ["P5", "P2", "P3", "Y2", "W1", "B1"],
  ["R6", "R4", "Y3", "W2", "G2", "R2"],
  ["B4", "G5", "G3", "P4", "G6", "W4"],
  ["W6", "B6", "B2", "P6", "Y5", "P1"],
  ["R3", "Y4", "W3", "R1", "B5", "Y6"],
  ["B3", "G4", "W5", "G1", "R5", "Y1"],
];

let tempBoard = [];

function splitBoard() {
  const matricies = [];
  let matrix1 = [
    [tempBoard[0][0], tempBoard[0][1], tempBoard[0][2]],
    [tempBoard[1][0], tempBoard[1][1], tempBoard[1][2]],
    [tempBoard[2][0], tempBoard[2][1], tempBoard[2][2]],
  ];

  let matrix2 = [
    [tempBoard[0][3], tempBoard[0][4], tempBoard[0][5]],
    [tempBoard[1][3], tempBoard[1][4], tempBoard[1][5]],
    [tempBoard[2][3], tempBoard[2][4], tempBoard[2][5]],
  ];

  let matrix3 = [
    [tempBoard[3][0], tempBoard[3][1], tempBoard[3][2]],
    [tempBoard[4][0], tempBoard[4][1], tempBoard[4][2]],
    [tempBoard[5][0], tempBoard[5][1], tempBoard[5][2]],
  ];

  let matrix4 = [
    [tempBoard[3][3], tempBoard[3][4], tempBoard[3][5]],
    [tempBoard[4][3], tempBoard[4][4], tempBoard[4][5]],
    [tempBoard[5][3], tempBoard[5][4], tempBoard[5][5]],
  ];

  matricies.push(matrix1);
  matricies.push(matrix2);
  matricies.push(matrix3);
  matricies.push(matrix4);
  return matricies;
}

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
  let matricies = splitBoard(tempBoard);
  let matrix = matricies[index];
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

  matricies[index] = matrix;
  buildBoard(matricies);
  generateBoard();
}

/* Construct the board from the matricies. */
function buildBoard(matricies) {
  tempBoard = structuredClone(board);
  if (matricies == undefined) {
    matricies = splitBoard(tempBoard);
  }
  for (let i = 0; i < 3; i++) {
    tempBoard[i] = matricies[0][i].concat(matricies[1][i]);
    tempBoard[i + 3] = matricies[2][i].concat(matricies[3][i]);
  }
  console.log(tempBoard);
}

/* Extract the color and number from a cell string */
function parseCellString(string) {
  return [
    colorDict[string.substring(0, 1)],
    string.substring(1, 2),
    string.substring(2, 3),
  ];
}

/* Check the validity of a movement between two cells */
function checkMoveValidity(row1, col1, row2, col2) {
  let cell1 = tempBoard[row1][col1];
  let color1 = colorDict[cell1.substring(0, 1)];
  let number1 = cell1.substring(1, 2);
  console.log(`CELL1: ${cell1}, ROW: ${row1}, COL: ${col1}`);

  let cell2 = tempBoard[row2][col2];
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

/* Check for win */
function checkWin(row, col) {
  if (tempBoard[row][col].includes("E")) {
    return true;
  } else {
    return false;
  }
}

function reportWin(moves) {
  console.log(`You won in ${moves} move(s)!`);
  openLightbox(moves);
  cellPath = [];
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
    if (checkWin(row, col)) {
      reportWin(cellPath.length - 1);
    }
  } else {
    console.log("Invalid move.");
  }
}

/* Place the start and end cells on the board */
function placeStartEnd() {
  /* Define start and end rows */
  let startRow = getRandomInt(6);
  let startCol = getRandomInt(6);
  let endRow = getRandomInt(6);
  let endCol = getRandomInt(6);

  /* Add start pos to cellPath */
  cellPath.push([startRow, startCol]);

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

  tempBoard[startRow][startCol] += "S";
  tempBoard[endRow][endCol] += "E";
}

/* Generate the board */
function generateBoard() {
  /* Select board grid element on webpage */
  const grid = document.getElementsByClassName("grid")[0];

  /* Clear the board */
  grid.innerHTML = "";

  /* Iterate through the board and create cells on the webpage. */
  for (let row = 0; row < tempBoard.length; row++) {
    for (let col = 0; col < tempBoard[row].length; col++) {
      /* Parse the data from the board cell. */
      let cellData = parseCellString(tempBoard[row][col]);
      let color = cellData[0];
      let number = cellData[1];
      let property = cellData[2];

      /* Create a new cell and set it's attributes */
      let divCell = document.createElement("div");
      divCell.setAttribute("row", row);
      divCell.setAttribute("col", col);
      divCell.classList.add(color, "cell");

      /* Add a class to the cell based on it's property. */
      if (property == "S") {
        divCell.classList.add("start");
      } else if (property == "E") {
        divCell.classList.add("end");
      }

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
placeStartEnd();
generateBoard();

function closeLightbox() {
  const lightbox = document.getElementsByClassName("lightbox")[0];
  lightbox.classList.toggle("hidden");
  buildBoard();
  placeStartEnd();
  generateBoard();
}

function openLightbox(moves) {
  const lightbox = document.getElementsByClassName("lightbox")[0];
  const movesText = document.getElementById("moves");
  movesText.innerHTML = moves;
  lightbox.classList.toggle("hidden");
}
