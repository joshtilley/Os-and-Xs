const Gameboard = function () {
    const rows = 3;
    const cols = 3;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            // the 3x3 array consists of 9 cells which are all function-objects --- weird but cool
            board[i].push(Cell())
        }
    }

    const getBoard = () => board;

    const placeToken = (row, col, player) => {
        // check if cell is empty
        const currentValue = board[row][col].getValue();
        if (currentValue === 0) {
            board[row][col].addToken(player)
        }
        else {
            console.log("invalid move, cell occupied"); 
            return;
        }
    }

    const getBoardValues = () => {
        const boardValues = board.map(
            (row) => row.map(
                (cell) => cell.getValue()
            ));
        return boardValues
    }

    return {
        getBoard,
        placeToken,
        getBoardValues
    }
};

function Cell() {
    let value = 0;

    const addToken = (player) => value = player;

    const getValue = () => value;

    return {
        addToken,
        getValue
    }
}

const Game = function () {
    const board = Gameboard();
    
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
    
    let activePlayer = players[0];

    while (board.getBoardValues().map(row => row.filter(col => col === 0).join("")).join("").length !== 0) {
        console.log(board.getBoardValues())
        let playerMove = prompt("enter coords");
        let row = playerMove[0];
        let col = playerMove[1];
        if (row > 2 || col > 2) continue;
        board.placeToken(row, col, activePlayer.token);
        if (checkForWinner(board.getBoardValues()).indexOf(1) !== -1) {
            console.log(`${activePlayer.name} wins`)
            return;
        }
        activePlayer = activePlayer === players[0] ? players [1] : players[0];
    }

    console.log("no more legal moves; players draw")
}

// logic to detect and announce winner below 

const checkForWinner = (board) => {
    let rows = checkRows(board)
    let cols = checkCols(board)
    let diag = checkDiag(board)
    return [rows, cols, diag]
}

const checkRows = (board) => {
    for(let row in board) {
        if (board[row].filter(col => col === 1).length === 3) return 1;
        if (board[row].filter(col => col === 2).length === 3) return 1; 
    }
    return -1
}

const checkCols = (board) => {
    for (let row = 0; row < 3; row++){
        let column = [];
        for (let col in board[row]) {
            column.push(board[col][row])
        }
        if (column.filter(cell => cell === 1).length === 3) return 1;
        if (column.filter(cell => cell === 2).length === 3) return 1;
    }
    return -1
}

const checkDiag = (board) => {
    const diaBtmLeft = [board[0][0], board[1][1], board[2][2]];
    const diaTopLeft = [board[2][0], board[1][1], board[0][2]];
    if (diaBtmLeft.filter(cell => cell === 1).length === 3 || diaTopLeft.filter(cell => cell === 1).length === 3) return 1;
    if (diaBtmLeft.filter(cell => cell === 2).length === 3 || diaTopLeft.filter(cell => cell === 2).length === 3) return 1;
    else return -1;
}

// run game on window load

Game()