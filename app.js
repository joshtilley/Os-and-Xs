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

    // function allows the value stored within a Cell() function to be changed to a player's token after a move is made.  
    const placeToken = (row, col, player) => {
        // check if cell is empty (i.e. value = 0)
        const currentValue = board[row][col].getValue(); 
        if (currentValue === 0) {
            board[row][col].addToken(player)
        }
        else {
            return;
        }
    }

    // returns a readable gameboard - i.e. the values held in each Cell
    const getBoardValues = () => {
        const boardValues = board.map(
            (row) => row.map(
                (cell) => cell.getValue()
            ));
        return boardValues
    }

    return {
        placeToken,
        getBoardValues
    }
};

// function to control each cell of the gameboard and store its current value
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

// function to control the gameplay
const Gameplay = function () {
    // creates gameboard within gameplay function. 
    const board = Gameboard();
    
    // defines players and assigns tokens
    const players = [
        {
            name: "Player One",
            token: 1,
            display: `<i class="fa-regular fa-circle"></i>`
        },
        {
            name: "Player Two",
            token: 2,
            display: `<i class="fa-regular fa-x"></i>`
        }
    ]
    
    // sets player names
    const submit_btn = document.getElementById('submit');
    submit_btn.addEventListener('click', () => {
        players[0].name = document.getElementById('player1-name').value;
        players[1].name = document.getElementById('player2-name').value;
        
        document.querySelector('.names-modal').classList.add('hide');
        document.querySelector('.modal-container').classList.add('hide');
        document.querySelector('#new-game').classList.remove('hide');
    })
    
    // sets the player to take the first turn
    let activePlayer = players[0];

    // switches active player 
    const switchPlayer = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
        console.log(`${getActivePlayer().name}'s turn.`)
    };

    // returns the active player
    const getActivePlayer = () => activePlayer;

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

// function will check for legal moves. a legal move requires a free cell, and that there has been no winner. 
const checkLegalMove = (board) => {
    // if checkForWinner returns an array containing 1, game is won
    if (checkForWinner(board).indexOf(1) !== -1) return 2;
    // if board contains no zero values, game is a draw
    if (board.map(row => row.filter(col => col === 0).join("")).join("").length === 0) return 1;

    else return 0;
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

    const gameboard_div = document.querySelector('.gameboard');

    // toggles display of the round's result on game end
    const matchResult_modal = document.querySelector('.results-modal');
    matchResult_modal.addEventListener('click', () => {
        matchResult_modal.classList.add('hide');
        document.querySelector('.modal-container').classList.add('hide')
    });
    
    function displayMatchResult(outcome) {
        if (outcome === 1) {
            matchResult_modal.innerHTML = `<div class="result">It's a draw!</div>`
        }
        if (outcome === 2) {
            matchResult_modal.innerHTML = `<div class="result">${game.getActivePlayer().name} wins!</div>`
        }
        document.querySelector('.modal-container').classList.remove('hide')
        matchResult_modal.classList.remove('hide')
    }
    
    // removes pointer cursor from all cells when game is finished
    function deactivateCells() {
        for(let row = 0; row < 3; row++){
            for (let cell = 0; cell < 3; cell++){
                let cell_Id = '' + row + cell;
                document.getElementById(cell_Id).classList.remove('cell-active');
            };
        };
    }

    // main gameplay loop
    function onClickHandler(e) {
        if (!e.target.id) return;
        let targetedCell = document.getElementById(`${e.target.id}`);
        targetedCell.innerHTML = `${game.getActivePlayer().display}`;
        targetedCell.classList.remove('cell-active')
        game.playTurn(e.target.id);
        // logic to check for winner or tied game
        switch (checkLegalMove(game.board())) {
            case 1:
                gameboard_div.removeEventListener('click', onClickHandler);
                deactivateCells();
                displayMatchResult(1);
                break;
            case 2:
                gameboard_div.removeEventListener('click', onClickHandler);
                deactivateCells();
                displayMatchResult(2);
                break;
            case 0:
                game.switchPlayer();
        }
    }

    gameboard_div.addEventListener('click', onClickHandler)

    // function to initiate a new game
    const restartGame = () => {
        // iterates through all cells to clear UI 
        for(let row = 0; row < 3; row++){
            for (let col = 0; col < 3; col++) {
                let cell_Id = "" + row + col
                document.getElementById(`${cell_Id}`).innerHTML = "";
                document.getElementById(`${cell_Id}`).classList.add('cell-active');
            }
        }
        // initialises backend game state
        game = Gameplay();
        gameboard_div.addEventListener('click', onClickHandler)
    }

    const newGame_btn = document.getElementById("new-game");

    newGame_btn.addEventListener('click', restartGame)
}

GameController()

// general UI functionality
const playerName_inputs = document.querySelectorAll('.name-input')
playerName_inputs.forEach(
    (input) => input.addEventListener('click', () => input.select())
);

window.addEventListener('DOMContentLoaded', () => {
    playerName_inputs.forEach(
        (input) => input.value = input.defaultValue)
})
