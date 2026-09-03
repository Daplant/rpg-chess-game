// Chess board logic and game state management

class ChessBoard {
    constructor() {
        this.board = this.initializeBoard();
        this.moveHistory = [];
        this.capturedWhite = [];
        this.capturedBlack = [];
    }
    
    initializeBoard() {
        const board = Array(8).fill(null).map(() => Array(8).fill(null));
        
        // Setup white pieces (bottom)
        this.placePieces(board, 'white', [6, 7]);
        
        // Setup black pieces (top)
        this.placePieces(board, 'black', [0, 1]);
        
        return board;
    }
    
    placePieces(board, color, rows) {
        const pawnRow = rows[0];
        const backRow = rows[1];
        
        // Pawns
        for (let col = 0; col < 8; col++) {
            board[pawnRow][col] = new Piece('pawn', color, pawnRow, col);
        }
        
        // Back row
        board[backRow][0] = new Piece('rook', color, backRow, 0);
        board[backRow][1] = new Piece('knight', color, backRow, 1);
        board[backRow][2] = new Piece('bishop', color, backRow, 2);
        board[backRow][3] = new Piece('queen', color, backRow, 3);
        board[backRow][4] = new Piece('king', color, backRow, 4);
        board[backRow][5] = new Piece('bishop', color, backRow, 5);
        board[backRow][6] = new Piece('knight', color, backRow, 6);
        board[backRow][7] = new Piece('rook', color, backRow, 7);
    }
    
    getPiece(row, col) {
        if (!isValidPosition(row, col)) return null;
        return this.board[row][col];
    }
    
    setPiece(row, col, piece) {
        if (!isValidPosition(row, col)) return false;
        this.board[row][col] = piece;
        return true;
    }
    
    isSquareEmpty(row, col) {
        return this.getPiece(row, col) === null;
    }
    
    isSquareOccupied(row, col, color) {
        const piece = this.getPiece(row, col);
        return piece !== null && piece.color === color;
    }
    
    isEnemySquare(row, col, color) {
        const piece = this.getPiece(row, col);
        return piece !== null && piece.color !== color;
    }
    
    getValidMoves(row, col) {
        const piece = this.getPiece(row, col);
        if (!piece) return [];
        
        const validMoves = [];
        const moveRule = MovementRules[piece.type];
        
        if (!moveRule) return validMoves;
        
        for (let newRow = 0; newRow < 8; newRow++) {
            for (let newCol = 0; newCol < 8; newCol++) {
                if (newRow === row && newCol === col) continue;
                
                const targetPiece = this.getPiece(newRow, newCol);
                
                // Can't move to own piece
                if (targetPiece && targetPiece.color === piece.color) continue;
                
                // Check movement rules
                if (moveRule(row, col, newRow, newCol, piece.color, this.board)) {
                    // Special check for king moving into check
                    if (piece.type === 'king') {
                        const tempBoard = this.getTempBoard();
                        tempBoard[newRow][newCol] = piece;
                        tempBoard[row][col] = null;
                        
                        if (!this.isKingInCheck(newRow, newCol, piece.color, tempBoard)) {
                            validMoves.push({ row: newRow, col: newCol });
                        }
                    } else {
                        // Check if move puts own king in check
                        const tempBoard = this.getTempBoard();
                        tempBoard[newRow][newCol] = piece;
                        tempBoard[row][col] = null;
                        
                        const kingPos = this.findKing(piece.color, tempBoard);
                        if (!this.isKingInCheck(kingPos.row, kingPos.col, piece.color, tempBoard)) {
                            validMoves.push({ row: newRow, col: newCol });
                        }
                    }
                }
            }
        }
        
        return validMoves;
    }
    
    isLegalMove(fromRow, fromCol, toRow, toCol) {
        const validMoves = this.getValidMoves(fromRow, fromCol);
        return validMoves.some(m => m.row === toRow && m.col === toCol);
    }
    
    movePiece(fromRow, fromCol, toRow, toCol) {
        const piece = this.getPiece(fromRow, fromCol);
        if (!piece) return null;
        
        if (!this.isLegalMove(fromRow, fromCol, toRow, toCol)) {
            return null;
        }
        
        const target = this.getPiece(toRow, toCol);
        const moveData = {
            piece: piece.clone(),
            from: { row: fromRow, col: fromCol },
            to: { row: toRow, col: toCol },
            captured: target ? target.clone() : null,
            timestamp: Date.now()
        };
        
        // Handle captures with RPG mechanics
        if (target) {
            const damage = piece.attack + Math.floor(Math.random() * 5) - Math.floor(Math.random() * 5);
            target.takeDamage(damage);
            
            if (target.hp <= 0) {
                if (piece.color === 'white') {
                    this.capturedBlack.push(target);
                } else {
                    this.capturedWhite.push(target);
                }
                piece.gainExperience(10 + target.level * 5);
            } else {
                // Damaged but not captured - put it back
                this.board[toRow][toCol] = target;
                return null;
            }
        }
        
        // Move the piece
        piece.row = toRow;
        piece.col = toCol;
        piece.hasMoved = true;
        this.board[toRow][toCol] = piece;
        this.board[fromRow][fromCol] = null;
        
        // Pawn promotion
        if (piece.type === 'pawn') {
            if ((piece.color === 'white' && toRow === 0) || 
                (piece.color === 'black' && toRow === 7)) {
                piece.type = 'queen';
                piece.attack = piece.getBaseAttack();
                piece.defense = piece.getBaseDefense();
            }
        }
        
        this.moveHistory.push(moveData);
        return moveData;
    }
    
    undoMove() {
        if (this.moveHistory.length === 0) return false;
        
        const lastMove = this.moveHistory.pop();
        const piece = lastMove.piece;
        
        this.board[lastMove.from.row][lastMove.from.col] = piece;
        
        if (lastMove.captured) {
            this.board[lastMove.to.row][lastMove.to.col] = lastMove.captured;
            if (lastMove.captured.color === 'white') {
                this.capturedWhite = this.capturedWhite.filter(p => p !== lastMove.captured);
            } else {
                this.capturedBlack = this.capturedBlack.filter(p => p !== lastMove.captured);
            }
        } else {
            this.board[lastMove.to.row][lastMove.to.col] = null;
        }
        
        return true;
    }
    
    findKing(color, board = null) {
        const searchBoard = board || this.board;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = searchBoard[row][col];
                if (piece && piece.type === 'king' && piece.color === color) {
                    return { row, col };
                }
            }
        }
        return null;
    }
    
    isKingInCheck(kingRow, kingCol, color, board = null) {
        const searchBoard = board || this.board;
        const enemyColor = color === 'white' ? 'black' : 'white';
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = searchBoard[row][col];
                if (piece && piece.color === enemyColor) {
                    const moveRule = MovementRules[piece.type];
                    if (moveRule && moveRule(row, col, kingRow, kingCol, enemyColor, searchBoard)) {
                        // Path must be clear (except for captures)
                        if (piece.type === 'knight') return true;
                        if (isPathClear(searchBoard, row, col, kingRow, kingCol)) return true;
                    }
                }
            }
        }
        
        return false;
    }
    
    isCheckmate(color) {
        const kingPos = this.findKing(color);
        if (!kingPos) return false;
        
        if (!this.isKingInCheck(kingPos.row, kingPos.col, color)) {
            return false;
        }
        
        // Check if any legal move exists
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = this.getPiece(row, col);
                if (piece && piece.color === color) {
                    const validMoves = this.getValidMoves(row, col);
                    if (validMoves.length > 0) {
                        return false;
                    }
                }
            }
        }
        
        return true;
    }
    
    getTempBoard() {
        return this.board.map(row => row.map(piece => piece ? piece.clone() : null));
    }
    
    clone() {
        const cloned = new ChessBoard();
        cloned.board = this.getTempBoard();
        cloned.moveHistory = deepClone(this.moveHistory);
        cloned.capturedWhite = this.capturedWhite.map(p => p.clone());
        cloned.capturedBlack = this.capturedBlack.map(p => p.clone());
        return cloned;
    }
}
