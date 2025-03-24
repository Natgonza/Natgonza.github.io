

const socket = io(); //Connect to the Socket.io server
const rows = 6;
const cols = 7;
let board = [];
let currentPlayer = 'player1'; //Player 1 is red and Player 2 is yellow

const urlParams = new URLSearchParams(window.location.search);
let gameId = urlParams.get("game") || "lobby";

//Update the displayed turn
function updateTurnDisplay() {
    const turnDisplay = document.getElementById('turn-display');
    if(currentPlayer === 'player1') {
        turnDisplay.textContent = "Player 1's turn (Red)";
    } else {
        turnDisplay.textContent = "Player 2's turn (Yellow)";
    }
}

//Create the board
function initializeBoard() {
    board = Array.from({length: rows}, () => Array(cols).fill(null));
    renderBoard();
    updateTurnDisplay();
}//end initializeBoard

//Render the board
function renderBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; //Clear the board

    for(let row = 0; row < rows; row++) {
        for(let col = 0; col < cols; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if(board[row][col]) {
                cell.classList.add(board[row][col]);
            }//end if
            cell.addEventListener('click', () => handleCellClick(col));
            gameBoard.appendChild(cell);
        }//end for
    }//end for
}//end renderBoard

function handleCellClick(col) {
    /*
    for(let row = rows - 1; row >= 0; row--) {
        if(!board[row][col]) {
            board[row][col] = currentPlayer;
            currentPlayer = currentPlayer === 'player1' ? 'player2' : 'player1'; //Switch between players
            renderBoard();
            updateTurnDisplay();
            checkWin();
            break;
        }//end if
    }//end for
    */
   socket.emit("playerMove", { gameId, column: col});
}//end handleCellClick

// Update the displayed turn
function updateTurnDisplay() {
  const turnDisplay = document.getElementById("turn-display");
  turnDisplay.textContent =
    currentPlayer === "player1" ? "Player 1's turn (Red)" : "Player 2's turn (Yellow)";
}

//Check if there is a winner
function checkWin() {
    //Check horizontal, vertical, and diagonal for 4 in a row
    for(let row = 0; row < rows; row++) {
        for(let col = 0; col < cols; col++) {
            if(board[row][col]) {
                if (
                    checkDirection(row, col, 0, 1) || //Horizontal
                    checkDirection(row, col, 1, 0) || //Vertical
                    checkDirection(row, col, 1, 1) || //Diagonal down-right
                    checkDirection(row, col, 1, -1)   //Diagonal down-left
                ) {
                    const winner = board[row][col] === 'player1' ? 'Red' : 'Yellow';
                    alert(winner + ' wins!');
                    return;
                }//end inner if
            }//end outter if
        }//end inner for
    }//end outter for
}//end checkWin

//Check for 4 in a row in a given direction
function checkDirection(row, col, dRow, dCol) {
    let count = 0;
    let player = board[row][col];

    for(let i = 0; i < 4; i++) {
        const r = row + i * dRow;
        const c = col + i * dCol;

        if (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === player) {
            count++;
        } else {
            break;
        }//end else
    }//end for
    return count === 4;
}//end checkDirection

//Reset the game when the reset button is pressed
document.getElementById('reset-btn').addEventListener('click', initializeBoard);

socket.on("gameState", (serverGame) => {
    board = serverGame.board;
    currentPlayer = serverGame.currentPlayer;
    renderBoard();
    updateTurnDisplay();
});

socket.emit("joinGame", gameId);
//Initialize the board
initializeBoard();