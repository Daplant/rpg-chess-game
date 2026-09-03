// Game state management

class GameState {
    constructor() {
        this.currentScreen = 'main-menu';
        this.board = null;
        this.players = {
            white: null,
            black: null
        };
        this.currentTurn = 'white';
        this.gameMode = null; // 'single-player', 'multiplayer-lan'
        this.gameStatus = 'active'; // active, checkmate, stalemate, resigned
        this.selectedSquare = null;
        this.validMoves = [];
        this.ai = null;
        this.difficulty = 'medium';
        this.gameLog = [];
        this.moveCount = 0;
    }
    
    showScreen(screenName) {
        // Hide all screens
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        
        // Show selected screen
        const screen = document.getElementById(screenName);
        if (screen) {
            screen.classList.add('active');
        }
        
        this.currentScreen = screenName;
    }
    
    selectCharacter(character) {
        // Create player character with selected class
        const stats = this.getCharacterStats(character);
        this.players.white = {
            name: 'Player',
            character: character,
            stats: stats,
            level: 1,
            experience: 0
        };
        
        // Start single-player game
        this.startSinglePlayerGame();
    }
    
    getCharacterStats(character) {
        const stats = {
            warrior: { attack: 8, defense: 7, hp: 100 },
            mage: { attack: 9, defense: 5, hp: 80 },
            rogue: { attack: 7, defense: 6, hp: 90 }
        };
        return stats[character] || stats.warrior;
    }
    
    startSinglePlayerGame() {
        this.gameMode = 'single-player';
        this.board = new ChessBoard();
        this.ai = new ChessAI(this.difficulty);
        this.players.black = {
            name: 'AI Opponent',
            character: 'mage',
            stats: { attack: 8, defense: 6, hp: 90 },
            level: 1,
            experience: 0
        };
        this.currentTurn = 'white';
        this.gameStatus = 'active';
        this.gameLog = [];
        this.moveCount = 0;
        
        this.showScreen('game-screen');
        ui.renderBoard(this.board);
        ui.updatePlayerInfo(this.players);
    }
    
    createLANGame() {
        // Generate LAN game code and wait for opponent
        const gameCode = this.generateGameCode();
        alert(`LAN Game Created!\nCode: ${gameCode}\nShare this with your opponent!`);
        this.gameMode = 'multiplayer-lan';
        this.setupLANGame(gameCode);
    }
    
    joinLANGame() {
        const gameCode = prompt('Enter LAN Game Code:');
        if (gameCode) {
            this.gameMode = 'multiplayer-lan';
            this.setupLANGame(gameCode);
        }
    }
    
    setupLANGame(gameCode) {
        this.players.white = {
            name: 'Player 1',
            character: 'warrior',
            stats: { attack: 8, defense: 7, hp: 100 },
            level: 1,
            experience: 0
        };
        
        this.players.black = {
            name: 'Player 2',
            character: 'mage',
            stats: { attack: 9, defense: 5, hp: 80 },
            level: 1,
            experience: 0
        };
        
        this.board = new ChessBoard();
        this.currentTurn = 'white';
        this.gameStatus = 'active';
        this.gameLog = [];
        this.moveCount = 0;
        
        this.showScreen('game-screen');
        ui.renderBoard(this.board);
        ui.updatePlayerInfo(this.players);
    }
    
    selectSquare(row, col) {
        const piece = this.board.getPiece(row, col);
        
        // If clicking on own piece, select it
        if (piece && piece.color === this.currentTurn) {
            this.selectedSquare = { row, col };
            this.validMoves = this.board.getValidMoves(row, col);
            ui.highlightSquare(row, col);
            ui.highlightValidMoves(this.validMoves);
            return;
        }
        
        // If clicking on valid move, make the move
        if (this.selectedSquare) {
            const isValidMove = this.validMoves.some(m => m.row === row && m.col === col);
            if (isValidMove) {
                this.makeMove(this.selectedSquare.row, this.selectedSquare.col, row, col);
                this.selectedSquare = null;
                this.validMoves = [];
            } else if (piece && piece.color === this.currentTurn) {
                // Select new piece
                this.selectSquare(row, col);
            } else {
                // Deselect
                this.selectedSquare = null;
                this.validMoves = [];
                ui.clearHighlights();
            }
        }
    }
    
    makeMove(fromRow, fromCol, toRow, toCol) {
        const moveData = this.board.movePiece(fromRow, fromCol, toRow, toCol);
        
        if (!moveData) {
            this.addGameLog(`Move blocked or illegal!`, 'attack');
            return false;
        }
        
        this.moveCount++;
        const piece = moveData.piece;
        const notation = `${posToNotation(fromRow, fromCol)} → ${posToNotation(toRow, toCol)}`;
        
        // Create log message
        let logMessage = `${piece.type.toUpperCase()} moves to ${posToNotation(toRow, toCol)}`;
        
        if (moveData.captured) {
            logMessage += ` and captures ${moveData.captured.type.toUpperCase()}!`;
            this.addGameLog(logMessage, 'attack');
        } else {
            this.addGameLog(logMessage, 'move');
        }
        
        // Check game status
        if (this.board.isCheckmate(this.currentTurn === 'white' ? 'black' : 'white')) {
            this.gameStatus = 'checkmate';
            this.endGame();
            return true;
        }
        
        // Switch turn
        this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
        
        // AI turn if single-player
        if (this.gameMode === 'single-player' && this.currentTurn === 'black' && this.gameStatus === 'active') {
            setTimeout(() => this.aiMove(), 800);
        }
        
        ui.renderBoard(this.board);
        ui.updatePlayerInfo(this.players);
        return true;
    }
    
    aiMove() {
        if (this.gameStatus !== 'active') return;
        
        const move = this.ai.getBestMove(this.board);
        
        if (!move) {
            if (this.board.isCheckmate('black')) {
                this.gameStatus = 'checkmate';
                this.addGameLog('Checkmate! You win!', 'buff');
            } else {
                this.gameStatus = 'stalemate';
                this.addGameLog('Stalemate!', 'buff');
            }
            this.endGame();
            return;
        }
        
        this.makeMove(move.from.row, move.from.col, move.to.row, move.to.col);
    }
    
    undoMove() {
        if (this.board.moveHistory.length === 0) {
            this.addGameLog('No moves to undo!', 'attack');
            return;
        }
        
        if (this.board.undoMove()) {
            this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
            this.addGameLog('Move undone', 'buff');
            ui.renderBoard(this.board);
            ui.updatePlayerInfo(this.players);
        }
    }
    
    resign() {
        if (confirm(`${this.players[this.currentTurn].name} resigns. Continue?`)) {
            this.gameStatus = 'resigned';
            this.addGameLog(`${this.players[this.currentTurn].name} resigned!`, 'attack');
            this.endGame();
        }
    }
    
    endGame() {
        const winner = this.currentTurn === 'white' ? 'black' : 'white';
        this.showGameOverScreen(winner);
    }
    
    showGameOverScreen(winner) {
        const winnerName = this.players[winner].name;
        document.getElementById('game-over-title').textContent = `${winnerName} Wins!`;
        
        const stats = `
            Moves: ${this.moveCount}<br>
            Winner: ${winnerName}<br>
            Defeated: ${this.board.capturedBlack.length + this.board.capturedWhite.length} pieces
        `;
        document.getElementById('game-over-stats').innerHTML = stats;
        
        this.showScreen('game-over');
    }
    
    playAgain() {
        this.startSinglePlayerGame();
    }
    
    mainMenu() {
        this.showScreen('main-menu');
        this.board = null;
        this.currentTurn = 'white';
        this.selectedSquare = null;
        this.validMoves = [];
    }
    
    addGameLog(message, type = 'move') {
        this.gameLog.push({ message, type, timestamp: Date.now() });
        ui.addLogEntry(message, type);
    }
    
    generateGameCode() {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }
}

const gameState = new GameState();
