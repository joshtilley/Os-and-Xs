// "Gameboard" function creates and controls all modifications to the gameboard.
const Gameboard = function () {
    // creates the board - a 3x3 array of "Cell()" functions
    const rows = 3;
    const cols = 3;
    const board = [];
    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i].push(Cell())
        }
    }

    // function to return the board; possibly redundant due to getBoardValues 
    const getBoard = () => board;

    // function allows the value stored within a Cell() function to be changed to a player's token after a move is made.  
    const placeToken = (row, col, player) => {
        // check if cell is empty (i.e. value = 0)
        const currentValue = board[row][col].getValue(); 
        if (currentValue === 0) {
            board[row][col].addToken(player)
        }
        else {
            console.log("invalid move, cell occupied"); 
            return;
        }
    }

    // returns a readable gameboard - the board as a 3x3 array of only the Cell()'s  value variable.  
    const getBoardValues = () => {
        const boardValues = board.map(
            (row) => row.map(
                (cell) => cell.getValue()
            ));
        return boardValues
    }

    // variables stored in gameboard can now only be interfaced with via the following functions:
    return {
        getBoard,
        placeToken,
        getBoardValues
    }
};

// this function embeds the current value of a cell within a function.
function Cell() {
    let value = 0;

    // updates value of a cell after a player's move
    const addToken = (player) => value = player;

    // returns current value of a cell
    const getValue = () => value;

    return {
        addToken,
        getValue
    }
}

// function to control the gameplay.
const Gameplay = function () {
    // creates gameboard within gameplay function. 
    const board = Gameboard();
    
    // defines players and assigns tokens
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
    
    // sets the player to take the first turn
    let activePlayer = players[0];

    // switches active player 
    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        console.log(`${getActivePlayer().name}'s turn.`)
    };

    // returns the active player
    const getActivePlayer = () => activePlayer;

    // ~~ note for me. playTurn function will eventually be invoked only when a board cell is clicked. ~~

    const playTurn = (cell_Id, cell) => {
        row = cell_Id[0];
        col = cell_Id[1];
        if (row > 2 || col > 2) return; // can be deleted once UI complete
        board.placeToken(row, col, getActivePlayer().token)
        cell.innerText = `${game.getActivePlayer().token}`
        console.log(board.getBoardValues())
        if (checkForWinner(board.getBoardValues()).indexOf(1) !== -1) {
            console.log(`${activePlayer.name} wins`)
            return;
        }
        switchPlayer();
    }
    
    /* playTurn();

    while (board.getBoardValues().map(row => row.filter(col => col === 0).join("")).join("").length !== 0) {
        playTurn()
    } */

    return {
        playTurn,
        getActivePlayer
    }
}

// logic to check for a winner after each move. returns "1" when a winner is detected. 
const checkForWinner = (board) => {
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
        // since only 2 diagonals need to be checked, it is simpler to define these explicitly 
        const diaBtmLeft = [board[0][0], board[1][1], board[2][2]];
        const diaTopLeft = [board[2][0], board[1][1], board[0][2]];

        if (diaBtmLeft.filter(cell => cell === 1).length === 3 || diaTopLeft.filter(cell => cell === 1).length === 3) return 1;
        if (diaBtmLeft.filter(cell => cell === 2).length === 3 || diaTopLeft.filter(cell => cell === 2).length === 3) return 1;
        else return -1;
    }

    let rows = checkRows(board);
    let cols = checkCols(board);
    let diag = checkDiag(board);

    return [rows, cols, diag]
}

const game = Gameplay()

console.log(game.getActivePlayer())

const cell_Buttons = document.querySelectorAll('.cell');

cell_Buttons.forEach((cell) => {
    cell.addEventListener('click', () => {
        game.playTurn(cell.id, cell)
    });
})

