class Board
{
  constructor(){
    this._board = [
      ["P5", "P2", "P3", "Y2", "W1", "B1"],
      ["R6", "R4", "Y3", "W2", "G2", "R2"],
      ["B4", "G5", "G3", "P4", "G6", "W4"],
      ["W6", "B6", "B2", "P6", "Y5", "P1"],
      ["R3", "Y4", "W3", "R1", "B5", "Y6"],
      ["B3", "G4", "W5", "G1", "R5", "Y1"],
    ];
  }

  /* Get a random integer from 0 to n */
  static #getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  static #extractBoardMatrix(rowStart, rowEnd, colStart, colEnd){
    let extractedMatrix = []
    for(row=rowStart;row<rowEnd;row++){
      let row = []
      for(col=colStart;col<colEnd;col++){
        row.push(this._board[row][col])
      }
      extractedMatrix.push(row)
    }
    return extractedMatrix
  }

  static #splitBoard(){
    return [this.#extractBoardMatrix(0,3,0,3), this.#extractBoardMatrix(0,3,3,6), this.#extractBoardMatrix(3,6,0,3), this.#extractBoardMatrix(3,6,3,6)]
  }

  /* Rotate and return a matrix from the board. */
  /* The index represents the quadrant of the board in order from top left to bottom right. */
  static #rotateMatrix(index, clockwise) {
    let sections = splitBoard(tempBoard);
    let matrix = sections[index];
    /* Temporary matrix for rotation. */
    let tempMatrix = []
    if (clockwise) {
      for(row=2;row>=0;row--){
        for(col=0;col<3;col++){
          tempMatrix.push(matrix[row][col])
        }
      }
    } else {
      for(row=0;row>=3;row--){
        for(col=2;col>=0;col--){
          tempMatrix.push(matrix[row][col])
        }
      }
    }
    return tempMatrix;
  }

}

/* Board */


let tempBoard = [];

/* The current path */
let cellPath = [];



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

/* Place the start and end cells on the board */
function placeStartEnd() {
  /* Define start and end rows */
  let [startRow, startCol] = [getRandomInt(6), getRandomInt(6)];
  let [endRow, endCol] = [getRandomInt(6), getRandomInt(6)]

  /* Add start pos to cellPath */
  cellPath.push([startRow, startCol]);

  /* Make sure the end cell position isnt within 1 cell of the start cell. */
  while (
    (Math.abs(startRow - endRow) <= 1 && Math.abs(startCol - endCol) <= 1)
  ) {
    [endRow, endCol] = [getRandomInt(6), getRandomInt(6)]
  }
  /* Todo: actually place the start and end spots. */
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
