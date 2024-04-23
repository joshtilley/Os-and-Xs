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

    // function to return the board
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
            token: 1,
            display: `<i class="fa-regular fa-circle"></i>`
        },
        {
            name: "player2",
            token: 2,
            display: `<i class="fa-regular fa-x"></i>`
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

    const playTurn = (cell_Id) => {
        row = cell_Id[0];
        col = cell_Id[1];

        board.placeToken(row, col, getActivePlayer().token)
    }

    return {
        playTurn,
        switchPlayer,
        getActivePlayer,
        board: board.getBoardValues
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

// beginning of UI script
const GameController = function() {
    // initialises the game
    let game = Gameplay();

    // selects all cells
    const cell_Buttons = document.querySelectorAll('.cell');
    
    // assigns an event listener to each cell
    cell_Buttons.forEach((cell) => {
        cell.addEventListener('click', () => {
            // adds player token to board UI
            cell.innerHTML = `${game.getActivePlayer().display}`;
            // updates the actual gameboard
            game.playTurn(cell.id);
            // checks for winner
            if (checkForWinner(game.board()).indexOf(1) !== -1) {
                console.log(`${game.getActivePlayer().name} wins`)               
                return;
            };
            // checks for valid next move
            if (game.board().map(row => row.filter(col => col === 0).join("")).join("").length === 0) {
                console.log("No legal moves remain... it's a draw!")
                return;
            }
            // if (game.board().forEach((row) => row.filter(cell => cell === 0).join("")).join("").length === 0) return;
            game.switchPlayer();
        });
    })

    // function to initiate a new game
    const restartGame = () => {
        // iterates through all cells to clear UI 
        for(let i = 0; i < 3; i++){
            for (let j = 0; j < 3; j++) {
                let currentId = "" + i + j
                document.getElementById(`${currentId}`).innerHTML = ""
            }
        }
        // initialises backend game state
        game = Gameplay();
    }

    const newGame_btn = document.getElementById("new-game");

    newGame_btn.addEventListener('click', () => restartGame())
}

GameController()    

