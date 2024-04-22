const array = [
    [0,1,1],
    [1,0,2],
    [2,0,0]
]

const array1 = [
    [1,1,1],
    [1,0,2],
    [2,0,2]
]

const array2 = [
    [1,0,2],
    [1,2,1],
    [1,0,1]
]

const array3 = [
    [2,0,1],
    [1,2,2],
    [1,0,2]
]


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



console.log(checkForWinner(array1)) // 1 row
console.log(checkForWinner(array2)) // 1 col
console.log(checkForWinner(array3)) // 2 diag