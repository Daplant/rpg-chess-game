// Chess piece definitions with RPG attributes

class Piece {
    constructor(type, color, row, col, stats = {}) {
        this.type = type; // pawn, knight, bishop, rook, queen, king
        this.color = color; // 'white' or 'black'
        this.row = row;
        this.col = col;
        this.hasMoved = false;
        this.captured = false;
        
        // RPG Stats
        this.level = stats.level || 1;
        this.experience = stats.experience || 0;
        this.attack = stats.attack || this.getBaseAttack();
        this.defense = stats.defense || this.getBaseDefense();
        this.hp = stats.hp || this.getBaseHP();
        this.maxHp = this.hp;
        this.abilities = stats.abilities || [];
    }
    
    getBaseAttack() {
        const baseStats = {
            pawn: 2,
            knight: 4,
            bishop: 3,
            rook: 5,
            queen: 8,
            king: 6
        };
        return baseStats[this.type] || 0;
    }
    
    getBaseDefense() {
        const baseStats = {
            pawn: 1,
            knight: 2,
            bishop: 2,
            rook: 3,
            queen: 3,
            king: 4
        };
        return baseStats[this.type] || 0;
    }
    
    getBaseHP() {
        const baseStats = {
            pawn: 10,
            knight: 20,
            bishop: 18,
            rook: 25,
            queen: 30,
            king: 40
        };
        return baseStats[this.type] || 0;
    }
    
    getSymbol() {
        const symbols = {
            pawn: '♟',
            knight: '♞',
            bishop: '♝',
            rook: '♜',
            queen: '♛',
            king: '♚'
        };
        return symbols[this.type] || '♟';
    }
    
    gainExperience(amount) {
        this.experience += amount;
        const expToLevel = 100;
        
        if (this.experience >= expToLevel) {
            this.level++;
            this.experience -= expToLevel;
            this.attack += 1;
            this.defense += 1;
            this.maxHp += 5;
            this.hp = this.maxHp;
            return true; // Level up!
        }
        return false;
    }
    
    takeDamage(damage) {
        const reducedDamage = Math.max(1, damage - this.defense);
        this.hp -= reducedDamage;
        return reducedDamage;
    }
    
    heal(amount) {
        this.hp = Math.min(this.maxHp, this.hp + amount);
    }
    
    clone() {
        return new Piece(
            this.type,
            this.color,
            this.row,
            this.col,
            {
                level: this.level,
                experience: this.experience,
                attack: this.attack,
                defense: this.defense,
                hp: this.hp,
                abilities: [...this.abilities]
            }
        );
    }
}

// Piece movement rules
const MovementRules = {
    pawn: (row, col, newRow, newCol, color, board) => {
        const direction = color === 'white' ? -1 : 1;
        const startRow = color === 'white' ? 6 : 1;
        
        // Forward move
        if (col === newCol && board[newRow][newCol] === null) {
            const distance = Math.abs(newRow - row);
            if (distance === 1) return true;
            if (row === startRow && distance === 2) {
                return isPathClear(board, row, col, newRow, newCol);
            }
        }
        
        // Capture diagonal
        if (Math.abs(col - newCol) === 1 && newRow - row === direction) {
            const target = board[newRow][newCol];
            return target !== null && target.color !== color;
        }
        
        return false;
    },
    
    knight: (row, col, newRow, newCol, color, board) => {
        const rowDiff = Math.abs(row - newRow);
        const colDiff = Math.abs(col - newCol);
        return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
    },
    
    bishop: (row, col, newRow, newCol, color, board) => {
        if (getDiagonalDistance(row, col, newRow, newCol) === Infinity) return false;
        return isPathClear(board, row, col, newRow, newCol);
    },
    
    rook: (row, col, newRow, newCol, color, board) => {
        if (getOrthogonalDistance(row, col, newRow, newCol) === Infinity) return false;
        return isPathClear(board, row, col, newRow, newCol);
    },
    
    queen: (row, col, newRow, newCol, color, board) => {
        const isDiagonal = getDiagonalDistance(row, col, newRow, newCol) !== Infinity;
        const isOrthogonal = getOrthogonalDistance(row, col, newRow, newCol) !== Infinity;
        
        if (!isDiagonal && !isOrthogonal) return false;
        return isPathClear(board, row, col, newRow, newCol);
    },
    
    king: (row, col, newRow, newCol, color, board) => {
        return getDistance(row, col, newRow, newCol) === 1;
    }
};

// Special abilities for pieces
const Abilities = {
    // Warrior abilities
    powerAttack: {
        name: 'Power Attack',
        description: 'Deal 2x damage to target piece',
        cost: 20,
        effect: (attacker, defender) => {
            return attacker.attack * 2;
        }
    },
    
    defend: {
        name: 'Defend',
        description: 'Reduce damage by 50% for this turn',
        cost: 15,
        effect: (defender) => {
            defender.defense *= 1.5;
        }
    },
    
    // Mage abilities
    fireBlast: {
        name: 'Fire Blast',
        description: 'Deal 1.5x damage in area',
        cost: 25,
        effect: (attacker, targets) => {
            return attacker.attack * 1.5;
        }
    },
    
    // Rogue abilities
    backstab: {
        name: 'Backstab',
        description: 'Deal double damage if enemy not ready',
        cost: 20,
        effect: (attacker, defender) => {
            return attacker.attack * 2.5;
        }
    }
};
