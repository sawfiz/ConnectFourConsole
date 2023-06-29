/*
 ** The Gameboard represents the state of the board
 ** Each square holds a Cell (defined later)
 ** and we expose a dropToken method to be able to add Cells to squares
 */

function Gameboard() {
  const rows = 6;
  const columns = 7;
  const board = [];

  // Create a 2d array that will represent the state of the game board
  // For this 2d array, row 0 will represent the top row and
  // column 0 will represent the left-most column.
  // This nested-loop technique is a simple and common way to create a 2d array.
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      // * Each element in the 2D array is a Cell object, with initial value = 0
      board[i].push(Cell());
    }
  }

  const clearBoard = () => {
    for (let row = 0; row < rows; row++) {
      for (let column = 0; column < columns; column++) {
        board[row][column].setValue(0);
      }
    }
  };

  // This will be the method of getting the entire board that our
  // UI will eventually need to render it.
  const getBoard = () => board;

  // In order to drop a token, we need to find what the lowest point of the
  // selected column is,  *then* change that cell's value to the player number
  const dropToken = (column, token) => {
    // Our board's outermost array represents the row,
    // so we need to loop through the rows, starting at row 0,
    // find all the rows that don't have a token, then take the
    // last one, which will represent the bottom-most empty cell

    // ^ Filter the board to create a new sub array with all the rows including and above
    // ^ the cell at board[row][column to drop token] is unoccupied (value === 0)
    // const filteredRow = board.filter((row) => row[column].getValue() === 0);
    // console.log(`Filtered row ${column} ${filteredRow}`);
    // ^ Map a 2D array to a 2D array of values of each Cell
    // const boardWithCellValues1 = filteredRow.map((row) =>
    //   row.map((Cell) => Cell.getValue())
    // );
    // console.log(boardWithCellValues1);

    // ^ Map each row of the above new array to just array[row][column to drop token]
    // ^ Essentially mapping a 2D array to a 1D array
    // const avCells = filteredRow.map((row) => row[column]);
    // console.log(`avCells ${avCells} length ${avCells.length}`);

    // ^ Map a 1D arrage to a 1D array of values of each cell
    // const boardWithCellValues2 = avCells.map((Cell) => Cell.getValue())
    // console.log(boardWithCellValues2);

    // ^ The following block of code is explained above
    const availableCells = board
      .filter((row) => row[column].getValue() === 0)
      .map((row) => row[column]);

    // If no cells make it through the filter,
    // the move is invalid.  Stop execution.
    if (!availableCells.length) {
      console.log('No more available cell in this column');
      return;
    }

    // Otherwise, I have a valid cell, the last one in the filtered array
    const lowestRow = availableCells.length - 1;
    board[lowestRow][column].setValue(token);
    return lowestRow;
  };

  // Check if a move at a given row and column is a winning move for a given player
  const isWinningMove = (row, column, token) => {
    let count = 0;

    // Check for 4 in a row
    for (let c = 0; c < columns; c++) {
      if (board[row][c].getValue() === token) {
        count++;
        if (count === 4) {
          return true;
        }
      } else {
        count = 0;
      }
    }

    // Check for 4 in a column
    count = 0;
    for (let r = 0; r < rows; r++) {
      if (board[r][column].getValue() === token) {
        count++;
        if (count === 4) {
          return true;
        }
      } else {
        count = 0;
      }
    }

    // Check for 4 in a diagonal
    count = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        if (
          r + 3 < rows &&
          c + 3 < columns &&
          board[r][c].getValue() === token &&
          board[r + 1][c + 1].getValue() === token &&
          board[r + 2][c + 2].getValue() === token &&
          board[r + 3][c + 3].getValue() === token
        ) {
          return true;
        }
        if (
          r + 3 < rows &&
          c - 3 >= 0 &&
          board[r][c].getValue() === token &&
          board[r + 1][c - 1].getValue() === token &&
          board[r + 2][c - 2].getValue() === token &&
          board[r + 3][c - 3].getValue() === token
        ) {
          return true;
        }
      }
    }

    return false;
  };

  // This method will be used to print our board to the console.
  // It is helpful to see what the board looks like after each turn as we play.
  // but we won't need it after we build our UI.
  // ^ Use nested map functions to map a 2D array of Cell objects to a 2D array of values
  const printBoard = () => {
    console.log(
      board
        .map((row) => row.map((cell) => cell.getValue()).join(' '))
        .join('\n')
    );
    // * Display the board in text, rather than having to click open the object
    const boardWithCellValues = board.map((row) =>
      row.map((Cell) => Cell.getValue())
    );
    return boardWithCellValues;
  };

  // Here we provide an interface for the rest of our
  // application to interact with the board
  return { clearBoard, getBoard, dropToken, isWinningMove, printBoard };
}

/*
 ** A Cell represents one "square" on the board and can have one of
 ** 0: no token is in the square,
 ** 1: Player One's token,
 ** 2: Player Two's token
 */

function Cell() {
  let value = 0;

  // Accept a player's token to change the value of the cell
  // * This is a SETTER function for value
  const setValue = (token) => {
    value = token;
  };

  // How we will retrieve the current value of this cell through closure
  // * This is a GETTER function for value
  const getValue = () => value;

  return { setValue, getValue };
}

/*
 ** The GameController will be responsible for controlling the
 ** flow and state of the games turns, as well as whether
 ** anybody has won the game
 */
function GameController(
  playerOneName = 'Player One',
  playerTwoName = 'Player Two'
) {
  const board = Gameboard();
  // console.log(board.getBoard());

  const players = [
    { name: playerOneName, token: 1 },
    { name: playerTwoName, token: 2 },
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const getActivePlayer = () => activePlayer;

  // const printNewRound = () => {
  //   board.printBoard();
  //   // console.log(`${getActivePlayer().name}'s turn`);
  // };

  const playRound = (column) => {
    // Drop a token for the current player
    console.log(
      `Dropping ${getActivePlayer().name}'s token into column ${column}...`
    );

    const row = board.dropToken(column, getActivePlayer().token);
    board.printBoard();

    if (board.isWinningMove(row, column, getActivePlayer().token)) {
      /* This is where we would check for a winner and handle that logic, such as a win message */
      console.log(`${getActivePlayer().name} won`);
      console.log('New game...');
      board.clearBoard();
      board.printBoard();
    } else {
      // Switch player turn
      switchPlayerTurn();
    }
  };

  // Initial play game message
  // printNewRound();
  console.log('New game...');
  board.printBoard();

  // For the console version, we will only use playRound, but we will need
  // getActivePlayer for the UI version, so I'm revealing it now
  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
  };
}

const ScreenController = () => {
  const game = GameController();
  const boardEl = document.querySelector('.board');

  const updateScreen = () => {
    boardEl.innerHTML = '';

    const board = game.getBoard();

    //   for (let row = 0; row < board.length; row++) {
    //     const rowEl = document.createElement('div');
    //     rowEl.classList.add('row');
    //     boardEl.appendChild(rowEl);
    //     for (let column = 0; column < board[row].length; column++) {
    //       const cellEl = document.createElement('div');
    //       cellEl.classList.add('cell');
    //       if (board[row][column] === 1) {
    //         cellEl.classList.add('player-1');
    //       }
    //       if (board[row][column] === 2) {
    //         cellEl.classList.add('player-2');
    //       }
    //       rowEl.appendChild(cellEl);
    //     }
    //   }
    // };

    // Render board squares
    board.forEach((row) => {
      row.forEach((cell, index) => {
        // Anything clickable should be a button!!
        const cellButton = document.createElement('button');
        cellButton.classList.add('cell');
        // Create a data attribute to identify the column
        // This makes it easier to pass into our `playRound` function
        cellButton.dataset.row = board.indexOf(row);
        cellButton.dataset.column = index;
        cellButton.textContent = cell.getValue();
        if (board[board.indexOf(row)][index].getValue() === 1) {
          cellButton.classList.add('player-1');
        }
        if (board[board.indexOf(row)][index].getValue() === 2) {
          cellButton.classList.add('player-2');
        }
        boardEl.appendChild(cellButton);
      });
    });
  };

  function clickHandlerBoard(e) {
    console.log(e);
    console.log(e.target.dataset);
    const selectedColumn = e.target.dataset.column;

    if (!selectedColumn) return;

    game.playRound(selectedColumn);
    updateScreen();
  }
  boardEl.addEventListener('click', clickHandlerBoard);

  updateScreen();
};

ScreenController();
