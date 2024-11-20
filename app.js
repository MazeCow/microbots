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

const board = [[] * 6];
function buildBoard() {
  for (let i = 0; i < 3; i++) {
    board[i] = matrices[0][i].concat(matrices[1][i]);
    board[i + 3] = matrices[2][i].concat(matrices[3][i]);
  }
  console.log(board);
}
buildBoard();

const colorDict = {
  P: "pink",
  Y: "yellow",
  W: "white",
  B: "blue",
  R: "red",
  G: "green",
};

function parseCellString(string) {
  return [colorDict[string.substring(0, 1)], string.substring(1, 2)];
}

function checkMoveValidity(row1, col1, row2, col2) {
  let cell1 = board[row1][col1];
  let color1 = cell1.classList[0];
  let letter1 = cell1.children[0].innerHTML;

  let cell2 = board[row2][col2];
  let color2 = cell2.classList[0];
  let letter2 = cell2.children[0].innerHTML;

  if (color1 === color2 || letter1 === letter2) {
    return true;
  }
}

const cellPath = [];

function clickCell() {
  let row = this.getAttribute("row");
  let col = this.getAttribute("col");
}

function generateBoard() {
  /* Select board grid element on webpage */
  const grid = document.getElementsByClassName("grid")[0];

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
}

generateBoard();

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function locateElement(row, col) {
  return document.querySelector(`[row="${row}"][col="${col}"]`);
}

let startRow = getRandomInt(6);
let startCol = getRandomInt(6);
let endRow = getRandomInt(6);
let endCol = getRandomInt(6);

while (
  (startRow === endRow || startRow + 1 === endRow || startRow - 1 === endRow) &&
  (startCol === endCol || startCol + 1 === endCol || startCol - 1 === endCol)
) {
  endRow = getRandomInt(6);
  endCol = getRandomInt(6);
}

let startCell = locateElement(startRow, startCol);
let endCell = locateElement(endRow, endCol);

startCell.classList.add("start");
endCell.classList.add("end");
