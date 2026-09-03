// AI logic for computer opponent

class ChessAI {
    constructor(difficulty = 'medium') {
        this.difficulty = difficulty; // easy, medium, hard
        this.searchDepth = this.getSearchDepth();
    }
    
    getSearchDepth() {
        const depths = {
            easy: 1,
            medium: 3,
            hard: 5
        };
        return depths[this.difficulty] || 3;
    }
    
    getBestMove(board) {
        const legalMoves = this.getAllLegalMoves(board, 'black');
        
        if (legalMoves.length === 0) return null;
        
        if (this.difficulty === 'easy') {
            return getRandomElement(legalMoves);
        }
        
        // Minimax with alpha-beta pruning
        let bestMove = legalMoves[0];
        let bestScore = -Infinity;
        
        for (const move of legalMoves) {
            const tempBoard = board.clone();
            tempBoard.movePiece(move.from.row, move.from.col, move.to.row, move.to.col);
            
            const score = this.minimax(tempBoard, this.searchDepth - 1, -Infinity, Infinity, true);
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        
        return bestMove;
    }
    
    minimax(board, depth, alpha, beta, isMaximizing) {
        if (depth === 0) {
            return this.evaluateBoard(board);
        }
        
        const color = isMaximizing ? 'black' : 'white';
        const legalMoves = this.getAllLegalMoves(board, color);
        
        if (legalMoves.length === 0) {
            // Checkmate or stalemate
            if (board.isCheckmate(color)) {
                return isMaximizing ? -10000 : 10000;
            }
            return 0; // Stalemate
        }
        
        if (isMaximizing) {
            let maxEval = -Infinity;
            for (const move of legalMoves) {
                const tempBoard = board.clone();
                tempBoard.movePiece(move.from.row, move.from.col, move.to.row, move.to.col);
                const eval_ = this.minimax(tempBoard, depth - 1, alpha, beta, false);
                maxEval = Math.max(maxEval, eval_);
                alpha = Math.max(alpha, eval_);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (const move of legalMoves) {
                const tempBoard = board.clone();
                tempBoard.movePiece(move.from.row, move.from.col, move.to.row, move.to.col);
                const eval_ = this.minimax(tempBoard, depth - 1, alpha, beta, true);
                minEval = Math.min(minEval, eval_);
                beta = Math.min(beta, eval_);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }
    
    evaluateBoard(board) {
        let score = 0;
        
        // Material value
        const materialValues = {
            pawn: 1,
            knight: 3,
            bishop: 3,
            rook: 5,
            queen: 9,
            king: 0
        };
        
        // Piece count evaluation
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board.getPiece(row, col);
                if (piece) {
                    const value = materialValues[piece.type] || 0;
                    const multiplier = piece.color === 'black' ? 1 : -1;
                    score += value * multiplier;
                    
                    // Add RPG stats evaluation
                    score += (piece.attack + piece.defense + piece.level) * 0.1 * multiplier;
                    
                    // Position evaluation
                    score += this.evaluatePosition(piece, row, col) * multiplier;
                }
            }
        }
        
        // King safety
        const blackKingPos = board.findKing('black');
        const whiteKingPos = board.findKing('white');
        
        if (blackKingPos && board.isKingInCheck(blackKingPos.row, blackKingPos.col, 'black')) {
            score -= 50;
        }
        if (whiteKingPos && board.isKingInCheck(whiteKingPos.row, whiteKingPos.col, 'white')) {
            score += 50;
        }
        
        return score;
    }
    
    evaluatePosition(piece, row, col) {
        const positionWeights = {
            pawn: [
                [0, 0, 0, 0, 0, 0, 0, 0],
                [5, 5, 5, 5, 5, 5, 5, 5],
                [1, 1, 2, 3, 3, 2, 1, 1],
                [0, 0, 1, 3, 3, 1, 0, 0],
                [0, 0, 0, 2, 2, 0, 0, 0],
                [0, 0, 0, 1, 1, 0, 0, 0],
                [0, 0, 0, -1, -1, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0]
            ],
            knight: [
                [-5, -4, -3, -3, -3, -3, -4, -5],
                [-4, -2, 0, 1, 1, 0, -2, -4],
                [-3, 0, 1, 2, 2, 1, 0, -3],
                [-3, 1, 2, 2, 2, 2, 1, -3],
                [-3, 0, 2, 2, 2, 2, 0, -3],
                [-3, 1, 1, 2, 2, 1, 1, -3],
                [-4, -2, 0, 0, 0, 0, -2, -4],
                [-5, -4, -3, -3, -3, -3, -4, -5]
            ],
            king: [
                [-3, -2, -1, 0, 0, -1, -2, -3],
                [-3, -1, 1, 2, 2, 1, -1, -3],
                [-3, -1, 2, 3, 3, 2, -1, -3],
                [-3, -1, 2, 3, 3, 2, -1, -3],
                [-3, -1, 2, 3, 3, 2, -1, -3],
                [-3, -1, 2, 3, 3, 2, -1, -3],
                [-3, -1, 1, 2, 2, 1, -1, -3],
                [-3, -2, -1, 0, 0, -1, -2, -3]
            ]
        };
        
        const weights = positionWeights[piece.type] || [];
        return weights[row] ? weights[row][piece.color === 'black' ? col : 7 - col] : 0;
    }
    
    getAllLegalMoves(board, color) {
        const moves = [];
        
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const piece = board.getPiece(row, col);
                if (piece && piece.color === color) {
                    const validMoves = board.getValidMoves(row, col);
                    for (const move of validMoves) {
                        moves.push({
                            from: { row, col },
                            to: { row: move.row, col: move.col }
                        });
                    }
                }
            }
        }
        
        return moves;
    }
}
