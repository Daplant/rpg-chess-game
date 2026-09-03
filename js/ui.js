// UI Management and rendering

class UI {
    constructor() {
        this.selectedSquare = null;
        this.validMoveSquares = [];
    }
    
    renderBoard(board) {
        const boardElement = document.getElementById('chess-board');
        boardElement.innerHTML = '';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const square = document.createElement('div');
                const isWhiteSquare = (row + col) % 2 === 0;
                square.className = `square ${isWhiteSquare ? 'white' : 'black'}`;
                square.id = `square-${row}-${col}`;
                
                const piece = board.getPiece(row, col);
                if (piece) {
                    const pieceEl = document.createElement('div');
                    pieceEl.className = 'piece';
                    pieceEl.textContent = piece.getSymbol();
                    pieceEl.style.color = piece.color === 'white' ? '#FFF' : '#000';
                    pieceEl.style.fontSize = '2.5rem';
                    pieceEl.style.textShadow = '0 0 3px rgba(0,0,0,0.5)';
                    pieceEl.style.cursor = 'grab';
                    
                    square.appendChild(pieceEl);
                }
                
                square.addEventListener('click', () => gameState.selectSquare(row, col));
                boardElement.appendChild(square);
            }
        }
        
        this.updateCapturedPieces(board);
    }
    
    highlightSquare(row, col) {
        this.clearHighlights();
        const square = document.getElementById(`square-${row}-${col}`);
        if (square) {
            square.classList.add('selected');
        }
        this.selectedSquare = { row, col };
    }
    
    highlightValidMoves(moves) {
        moves.forEach(move => {
            const square = document.getElementById(`square-${move.row}-${move.col}`);
            if (square) {
                square.classList.add('valid-move');
                this.validMoveSquares.push(square);
            }
        });
    }
    
    clearHighlights() {
        document.querySelectorAll('.square.selected, .square.valid-move').forEach(square => {
            square.classList.remove('selected', 'valid-move');
        });
        this.validMoveSquares = [];
    }
    
    updatePlayerInfo(players) {
        document.getElementById('player-white-name').textContent = players.white.name;
        document.getElementById('player-white-level').textContent = `Lvl ${players.white.level}`;
        const whiteHealthPercent = 100;
        document.getElementById('player-white-health').style.width = whiteHealthPercent + '%';
        
        document.getElementById('player-black-name').textContent = players.black.name;
        document.getElementById('player-black-level').textContent = `Lvl ${players.black.level}`;
        const blackHealthPercent = 100;
        document.getElementById('player-black-health').style.width = blackHealthPercent + '%';
    }
    
    updateCapturedPieces(board) {
        const capturedList = document.getElementById('captured-list');
        capturedList.innerHTML = '';
        
        const allCaptured = [...board.capturedBlack, ...board.capturedWhite];
        allCaptured.forEach(piece => {
            const span = document.createElement('span');
            span.className = 'captured-piece';
            span.textContent = piece.getSymbol();
            span.style.opacity = '0.6';
            capturedList.appendChild(span);
        });
        
        if (allCaptured.length === 0) {
            capturedList.innerHTML = '<span style="opacity: 0.5; font-size: 0.9rem;">No captures yet</span>';
        }
    }
    
    addLogEntry(message, type = 'move') {
        const logContent = document.getElementById('game-log');
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.textContent = `> ${message}`;
        logContent.appendChild(entry);
        logContent.scrollTop = logContent.scrollHeight;
    }
}

const ui = new UI();
