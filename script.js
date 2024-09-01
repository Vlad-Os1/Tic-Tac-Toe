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
  let gameBoard = GameBoard();

  const printBoard = () => {
    const board = gameBoard.getBoard();

    console.log('Current Board:');
    board.forEach(row => {
      console.log(row.map(cell => cell.getValue() || '-').join('|'));
    });

    console.log('\n'); // just logs an empty row
  };

  const playRound = (row, col) => {
    if(gameBoard.makeMove(row, col, currentPlayer)){
      printBoard();

      const winner = gameBoard.checkWinner();
      if(winner){
        console.log(`${winner} is a winner`)
        gameBoard.cleanBoard()
        return true
      } else if (gameBoard.boardIsFull()){
        console.log("It`s a draw")
        gameBoard.cleanBoard()
        return true
      }

      currentPlayer = currentPlayer === "X" ? "O" : "X"

    } else {
      console.log("Invalid Move")
    }
    return false //just shows that the game continues
  } 


  return{
    printBoard,
    playRound,
  }

}



let game = Game();
