// function to create a blank 3x3 array to represent the gameboard
const Gameboard = () => {
    const rows = 3;
    const cols = 3;
    const board = [];
    for (let i = 0; i < rows; i++){
        const row = [];
        for (let j = 0; j < cols; j++) {
            let col = 0;
            row.push(col);
        };
        board.push(row);
    }
    return board
}

// makes the board a global variable
let board = Gameboard()

// checks for empty space in board
const legalMoveCheck = () => {
    let zeroesStr = "";
    for(let row in board) {
        zeroesStr += (board[row].filter(col => col === 0).join(""))
    }
    return (zeroesStr.length)
}


const playRound = () => {
    console.log(board);
    const players = [
        {
            name: "player1",
            token: 1
        },
        {
            name: "player2",
            token: 2
        }
    ]
    let activePlayer = players[0]
    let emptyCells;
    while (emptyCells !== 0) {
        let moveCoord = prompt("enter coords")
        x = moveCoord[0]
        y = moveCoord[1]
        if (board[x][y] === 0) {
            board[x][y] = activePlayer.token
            activePlayer = activePlayer === players[0] ? players [1] : players[0];
        }
        else {
            console.log(`${activePlayer.name} made an invalid move, play again`)
        }
        if (checkForWinner(board) === true) {
            activePlayer = activePlayer === players[0] ? players [1] : players[0];
            console.log(`${activePlayer.name} wins!`);
            return;}
        emptyCells = legalMoveCheck()
        console.log(board) 
    }
}

// below this line, all functions check game win conditions

function checkForWinner(board){
    let rowsCheck = checkRows(board);
    if (rowsCheck) return true
    let colsCheck = checkCols(board);
    if (colsCheck) return true
    let diagCheck = checkDiag(board);
    if (diagCheck) return true
    else return false
}

function checkRows(board) {
    for(let row in board) {
        if (
            board[row].filter(col => col === 1).length === 3 ||
            board[row].filter(col => col === 2).length === 3
        ) {
            return true;
        } 
    }
    return false
}

function checkCols(board) {
    let col0 = [board[0][0], board[1][0], board[2][0]];
    let col1 = [board[0][1], board[1][1], board[2][1]];
    let col2 = [board[0][2], board[1][2], board[2][2]];
    if (
        col0.filter(col => col === 1).length === 3 ||
        col0.filter(col => col === 2).length === 3 ||
        col1.filter(col => col === 1).length === 3 ||
        col1.filter(col => col === 2).length === 3 ||
        col2.filter(col => col === 1).length === 3 ||
        col2.filter(col => col === 2).length === 3
    ) {
        return true;
    } 
    else return false
}

function checkDiag(board) {
    let dia0 = [board[0][0], board[1][1], board[2][2]];
    let dia1 = [board[0][2], board[1][1], board[2][0]];
    if (
        dia0.filter(col => col === 1).length === 3 ||
        dia0.filter(col => col === 2).length === 3 ||
        dia1.filter(col => col === 1).length === 3 ||
        dia1.filter(col => col === 2).length === 3
    ) {
        return true;
    } 
    else return false;
}

// below this line, UI code only

const newGame_btn = document.getElementById('new-game')

newGame_btn.addEventListener('click', playRound())