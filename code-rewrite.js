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

    //playTurn function will be invoked every time the board is clicked. 

    while (board.getBoardValues().map(row => row.filter(col => col === 0).join("")).join("").length !== 0) {
        console.log(board.getBoardValues())
        let playerMove = prompt("enter coords");
        let row = playerMove[0];
        let col = playerMove[1];
        if (row > 2 || col > 2) continue;
        board.placeToken(row, col, activePlayer.token);
        activePlayer = activePlayer === players[0] ? players [1] : players[0];
    }

    console.log("no more legal moves")
}

Game()





/* 

function test(board) {
    let output = "";
    for(let row in board) {
        output += board[row].filter(col => col === 0).join("")
    }
    return output
}
function test2(board) {
    return board.map(row => row.filter(col => col === 0).join("")).join("")
}

console.log(test2(array))

____________________________________________________________________

const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const currentPlayer = () => activePlayer;

    const playRound = () => {
        board.getBoardValues();
        console.log(`${getActivePlayer().name}'s turn.`);
    }
*/