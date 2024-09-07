function GameBoard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for(let i = 0; i < rows; i++){
    board[i] = [];
    for(let n = 0; n < columns; n++){
      board[i].push(Cell())
    }
  };

  const getBoard = () => board;


  function makeMove(row, column, player){
    if(row >= 0 && row < rows && column >= 0 && column < columns){
      return board[row][column].setValue(player)
    }
    return false 
  };

  function checkWinner(){
    const winCombination = [
      //Horizontal
      [board[0][0], board[0][1], board[0][2]],
      [board[1][0], board[1][1], board[1][2]],
      [board[2][0], board[2][1], board[2][2]],
      //Vertical
      [board[0][0], board[1][0], board[2][0]],
      [board[0][1], board[1][1], board[2][1]],
      [board[0][2], board[1][2], board[2][2]],
      //Diagonal
      [board[0][0], board[1][1], board[2][2]],
      [board[0][2], board[1][1], board[2][0]],
    ] 
    
    for(let combination of winCombination){
      if(combination.every(cell => cell.getValue() !== null && cell.getValue() === combination[0].getValue())){
        return combination[0].getValue()
      }
    }
    
    return null
  };

  function boardIsFull(){
    return board.every(fullRow => fullRow.every(cell => cell.getValue() !== null))
  };

  function cleanBoard(){
    board.forEach(row => row.forEach(cell => cell.setValue(null)));
  }

    
  return {
    getBoard,
    makeMove,
    checkWinner,
    boardIsFull,
    cleanBoard,
  };
}

function Cell() {
  let value = null;

  function setValue(newValue){
    if(value === null || newValue === null){
      value = newValue;
      return true
    }
    return false
  };

  let getValue = () => {
    return value
  };

  return{
    getValue,
    setValue,
  }
}


function Game(){
  let currentPlayer = "X";
  const gameBoard = GameBoard();

  const printBoard = () => {
    const board = gameBoard.getBoard();

    console.log('Current Board:');
    board.forEach(row => {
      console.log(row.map(cell => cell.getValue() || '-').join('|'));
    });
  };

  const playRound = (row, col) => {
    // Check for admissibility of coordinates
    if (row < 0 || row >= 3 || col < 0 || col >= 3) {
      console.log("Invalid Move: Out of bounds");
      return false;
    }

    // Check if the cell is already occupied
    if (gameBoard.getBoard()[row][col].getValue() !== null) {
      console.log("Invalid Move: Cell already occupied");
      return false;
    }

    if(gameBoard.makeMove(row, col, currentPlayer)){
      printBoard();
      updateUI();

      const winner = gameBoard.checkWinner();

      if(winner){
          console.log(`${winner} is a winner`);
          winnerMsg.textContent = `${winner} is a winner`;
          modal.classList.add("active");
          overlay.classList.add("active");
          gameBoard.cleanBoard();
          return true;
        } else if (gameBoard.boardIsFull()){
          console.log("It`s a draw");
          winnerMsg.textContent = `Its a Draw`;
          modal.classList.add("active");
          overlay.classList.add("active");
          gameBoard.cleanBoard();
          return true;
        }

      currentPlayer = currentPlayer === "X" ? "O" : "X";
      return false;
    } 
  };

  const updateUI = () => {
    const boardCell = document.querySelectorAll("[data-cell]");
    const board = gameBoard.getBoard();

    if (boardCell.length !== board.length * board[0].length) {
      console.error("Error: The number of DOM cells does not match the game board.");
      return;
    }

    boardCell.forEach((cell, index) => {
      let row = Math.floor(index / 3);
      let col = index % 3;

      const cellValue = gameBoard.getBoard()[row][col].getValue();
      if (cellValue === "X") {
        cell.classList.add("x");
        cell.classList.remove("circle");
      } else if (cellValue === "O") {
        cell.classList.add("circle");
        cell.classList.remove("x");
      } else {
        cell.classList.remove("x", "circle");
      }
    });
  };

  const restartGame = () => {
    gameBoard.cleanBoard();
    currentPlayer = "X";
    updateUI();
  };

  
  return{
    printBoard,
    playRound,
    updateUI,
    restartGame,
  }
}

// Modal
const closeModalButton = document.querySelector("#modalBtn")
const overlay = document.getElementById('overlay')
const modal = document.querySelector('.modal')
const winnerMsg = document.querySelector("#winnerMsg")

closeModalButton.addEventListener('click', () => {
  closeModal(modal)
})

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove('active');
  overlay.classList.remove('active');
  game.restartGame();
}

const initializeBoard = () => {
  const boardCell = document.querySelectorAll("[data-cell]");
  
  boardCell.forEach((cell, index) => {
    let row = Math.floor(index / 3);
    let col = index % 3;

    cell.addEventListener("click", function () {
      const currentCells = document.querySelectorAll("[data-cell]");
      if (currentCells.length === 9) {
        game.playRound(row, col);
      } else {
        console.error("Cell count has changed, reinitialize required.");
      }
    });
  });
};

let game = Game();
initializeBoard();