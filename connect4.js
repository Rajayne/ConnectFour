/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 * 
 * Replaced y = h, x = w for height and width
 */

const boardWidth = 7;
const boardHeight = 6;
const restartButton = document.querySelector('#restart');

let gameOver = false;
let currPlayer = 1; // active player: 1 or 2;
let board = []; // array of rows, each row is array of cells  (board[h][w])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells (board[h][w])
 *    [ [h], [h], [h], [h], [h], [h], [h] ];
 *    [h] = [w, w, w, w, w, w]
 * 
 *    board = 
 *       h0 [w0, w1, w2, w3, w4, w5]
 *       h1 [w0, w1, w2, w3, w4, w5]
 *       h2 [w0, w1, w2, w3, w4, w5]
 *       h3 [w0, w1, w2, w3, w4, w5]
 *       h4 [w0, w1, w2, w3, w4, w5]
 *       h5 [w0, w1, w2, w3, w4, w5]
 *       h6 [w0, w1, w2, w3, w4, w5]
 */
function makeBoard() {
  for (let h = 0; h < boardHeight; h++) {
    let rowArray = [];
    for (let w = 0; w < boardWidth; w++) {
      rowArray.push(null);
    };
    board.push(rowArray);
  };
};

/** makeHtmlBoard: make HTML table and row of column tops. */
const htmlGame = document.querySelector('#game');
const htmlBoard = document.querySelector('#board');

function makeHtmlBoard() {
  // Create topmost row with id "column-top", eventlistener click runs handeClick();
  const top = document.createElement('tr');
  top.setAttribute('id', 'column-top');
  top.addEventListener('click', handleClick);

  // Append headcell table data in topmost cell
  for (let w = 0; w < boardWidth; w++) {
    const headCell = document.createElement('td');
    headCell.setAttribute('id', w);
    top.append(headCell);
  };
  htmlBoard.append(top);

  // Create table rows (tr/height) and cells in each row (td/width), cell coordinates ID = h-w
  // Appends cell to row and row to HTML Board
  for (let h = 0; h < boardHeight; h++) {
    const row = document.createElement('tr');
    for (let w = 0; w < boardWidth; w++) {
      const cell = document.createElement('td');
      cell.setAttribute('id', `${h}-${w}`);
      row.append(cell);
    };
    htmlBoard.append(row);
  };
};

/** findSpotForCol: given column x, return top empty y (null if filled) */
// Loop over each row and each cell, reverse iteration to start from bottom
// Return first empty cell in selected row
function findSpotForCol(w) {
    for (let h = boardHeight - 1; h >= 0; h--) {
      if (board[h][w] === null) {
        board[h][w] = currPlayer;
      return h;
    };
  };
};

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(h, w) {
  // TODO: make a div and insert into correct table cell
  const piece = document.createElement('div');
  const cell = document.getElementById(`${h}-${w}`);
  piece.classList.add('piece',`p${currPlayer}`);
  cell.append(piece);
};

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
};

const restartGame = () => {
  gameOver = false;
  location.reload();
};

restartButton.addEventListener('click', () => {
  if(confirm('Do you want to restart the game?')) {
    location.reload();
  } else {
    return;
  };
});

/** handleClick: handle click of column top to play piece */
  // get w from ID of clicked cell
  // if game has already ended or was won, will reset board by refreshing page
function handleClick(evt) {
  if (gameOver === false) {
    let w = +evt.target.id;
    updateGame(w);
  } else {
    restartGame();
  };
};

function updateGame(w) {
  // get next spot in column (if none, ignore click)
  let h = findSpotForCol(w);
  if (h === null) {
    return null;
  };

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  placeInTable(h, w);
  // check for win
  if (checkForWin()) {
    gameOver = true;
    return endGame(`Player ${currPlayer} won!`);
  };

  // Check for tie
  // Check if all cells in board are filled; if so call, call endGame
  const checkForTie = (arr) => {
    arr.every((row) => row.every((cell) => cell !== null));
  };

  if (checkForTie(board)) {
    return endGame('Tie!');
  }

  // switch players, add element.textContent to change status between players
  currPlayer = currPlayer === 1 ? 2 : 1;
};

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([h, w]) =>
        h >= 0 &&
        h < boardHeight &&
        w >= 0 &&
        w < boardWidth &&
        board[h][w] === currPlayer
    );
  };

  // Checks for 4 matching pieces in a row horizontally, vertically, diagonally right, or diagonally left
  // If 4 in a row, return true to win
  for (let h = 0; h < boardHeight; h++) {
    for (let w = 0; w < boardWidth; w++) {
      const horiz = [[h, w], [h, w + 1], [h, w + 2], [h, w + 3]];
      const vert = [[h, w], [h + 1, w], [h + 2, w], [h + 3, w]];
      const diagDR = [[h, w], [h + 1, w + 1], [h + 2, w + 2], [h + 3, w + 3]];
      const diagDL = [[h, w], [h + 1, w - 1], [h + 2, w - 2], [h + 3, w - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      };
    };
  };
};

makeBoard();
makeHtmlBoard();
