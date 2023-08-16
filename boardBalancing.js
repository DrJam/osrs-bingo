function calcDifficulty(arr) {
    return arr.reduce((sum, current) => sum + current.difficulty, 0);
}

function swapRows(matrix, r1, r2, centerIndex) {
    let temp = matrix[r1];
    matrix[r1] = matrix[r2];
    matrix[r2] = temp;

    // Keep the center tile in the middle
    [matrix[r1][centerIndex], matrix[r2][centerIndex]] = [matrix[r2][centerIndex], matrix[r1][centerIndex]];
}

function swapCols(matrix, c1, c2, centerIndex) {
    for (let i = 0; i < matrix.length; i++) {
        if (i !== centerIndex) { // Skip the center row
            [matrix[i][c1], matrix[i][c2]] = [matrix[i][c2], matrix[i][c1]];
        }
    }
}

function balanceBoard(board, size) {
    let numRows = size;
    let numCols = size;

    // Step 1: Calculate the difficulty scores of each row and column
    let rowDifficulties = [];
    for (let i = 0; i < numRows; i++) {
        rowDifficulties[i] = calcDifficulty(board[i]);
    }

    let colDifficulties = [];
    for (let j = 0; j < numCols; j++) {
        let col = [];
        for (let i = 0; i < numRows; i++) {
            col.push(board[i][j]);
        }
        colDifficulties[j] = calcDifficulty(col);
    }

    let centerIndex = Math.floor(size / 2);

    // Balance the rows
    for (let targetRank = 0; targetRank < numRows; targetRank++) {
        if (targetRank !== centerIndex) { // Skip the center row
            let targetIndex = rowDifficulties.indexOf(Math.min(...rowDifficulties));
            if (targetIndex !== targetRank) {
                swapRows(board, targetIndex, targetRank, centerIndex);
                swapRows(rowDifficulties, targetIndex, targetRank);
            }
        }
    }

    // Balance the columns
    for (let targetRank = 0; targetRank < numCols; targetRank++) {
        if (targetRank !== centerIndex) { // Skip the center column
            let targetIndex = colDifficulties.indexOf(Math.min(...colDifficulties));
            if (targetIndex !== targetRank) {
                swapCols(board, targetIndex, targetRank, centerIndex);
                swapCols(colDifficulties, targetIndex, targetRank);
            }
        }
    }

    return board;
}

module.exports = {
    balanceListBoard: (boardObj) => {
        let size = boardObj.size;
        let center = boardObj.center;
        let tiles = boardObj.tiles;

        // Convert the 1D tiles array into a 2D board array
        let board = [];
        for (let i = 0; i < size; i++) {
            let row = [];
            for (let j = 0; j < size; j++) {
                if (i === Math.floor(size / 2) && j === Math.floor(size / 2)) {
                    row.push(center);
                } else {
                    let index = i * size + j;
                    if (index >= Math.floor(size * size / 2)) {
                        index -= 1; // Adjust the index to account for the center tile
                    }
                    row.push(tiles[index]);
                }
            }
            board.push(row);
        }

        // Balance the board as before
        board = balanceBoard(board, size);

        // Convert the 2D board array back into a 1D tiles array
        tiles = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (i !== Math.floor(size / 2) || j !== Math.floor(size / 2)) {
                    tiles.push(board[i][j]);
                }
            }
        }

        // Update the board object
        boardObj.center = board[Math.floor(size / 2)][Math.floor(size / 2)];
        boardObj.tiles = tiles;

        return boardObj;
    }
}