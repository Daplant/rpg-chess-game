// Utility functions for the game

// Chess notation utilities
const COLUMNS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const ROWS = ['8', '7', '6', '5', '4', '3', '2', '1'];

function posToNotation(row, col) {
    return COLUMNS[col] + ROWS[row];
}

function notationToPos(notation) {
    const col = COLUMNS.indexOf(notation[0]);
    const row = ROWS.indexOf(notation[1]);
    return { row, col };
}

function coordsToIndex(row, col) {
    return row * 8 + col;
}

function indexToCoords(index) {
    return {
        row: Math.floor(index / 8),
        col: index % 8
    };
}

function isValidPosition(row, col) {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}

// Distance calculation
function getDistance(r1, c1, r2, c2) {
    return Math.max(Math.abs(r1 - r2), Math.abs(c1 - c2));
}

function getDiagonalDistance(r1, c1, r2, c2) {
    return Math.abs(r1 - r2) === Math.abs(c1 - c2) ? Math.abs(r1 - r2) : Infinity;
}

function getOrthogonalDistance(r1, c1, r2, c2) {
    return (r1 === r2 || c1 === c2) ? Math.max(Math.abs(r1 - r2), Math.abs(c1 - c2)) : Infinity;
}

// Path checking
function getPath(r1, c1, r2, c2) {
    const path = [];
    const rowDir = Math.sign(r2 - r1);
    const colDir = Math.sign(c2 - c1);
    
    let r = r1 + rowDir;
    let c = c1 + colDir;
    
    while (r !== r2 || c !== c2) {
        if (!isValidPosition(r, c)) break;
        path.push({ row: r, col: c });
        r += rowDir;
        c += colDir;
    }
    
    return path;
}

function isPathClear(board, r1, c1, r2, c2) {
    const path = getPath(r1, c1, r2, c2);
    return path.every(pos => board[pos.row][pos.col] === null);
}

// Piece color detection
function getPieceColor(piece) {
    if (!piece) return null;
    return piece.color;
}

// Deep clone
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (obj instanceof Object) {
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = deepClone(obj[key]);
            }
        }
        return cloned;
    }
}

// Random utilities
function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function shuffle(arr) {
    const shuffled = [...arr];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Time formatting
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}
