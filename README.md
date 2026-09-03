# RPG Chess Game 🎮♟️

A full-featured RPG-style chess game with character progression, AI opponent, and LAN multiplayer support. Play on any device with a web browser.

## Features

### Core Gameplay
- **Full Chess Rules** - All standard chess mechanics with check and checkmate detection
- **RPG Progression** - Pieces gain experience, level up, and increase stats
- **Character Classes** - Warrior, Mage, and Rogue with unique stat distributions
- **Special Abilities** - Power attacks, defense buffs, and tactical abilities
- **Piece Health System** - Captured pieces based on combat damage, not instant removal

### Game Modes
- **Single-Player AI** - Play against intelligent AI opponent with 3 difficulty levels
  - Easy: Basic move selection
  - Medium: 3-depth minimax evaluation
  - Hard: 5-depth minimax with alpha-beta pruning
- **LAN Multiplayer** - Play with another person on the same network using game codes
- **Settings** - Sound, music, and volume controls

### Mobile Features
- **Responsive Design** - Works in portrait and landscape on all phone sizes
- **Touch Controls** - Tap to select pieces and make moves
- **Optimized UI** - Clean, intuitive interface for small screens
- **Performance** - Lightweight JavaScript, no heavy dependencies

### Visual Design
- **Pixel Art Aesthetic** - Classic retro RPG style
- **Character Sprites** - Unique visual themes for each class
- **Battle Log** - Real-time commentary on all moves and captures
- **Health Bars** - Track player and opponent health during matches
- **Captured Pieces Display** - See which pieces you've defeated

## How to Play

1. Open `index.html` in any modern web browser
2. Click "New Game" to select your character class
3. Make moves by tapping pieces and valid move indicators
4. Defeat opponent pieces to level up your own pieces
5. Achieve checkmate to win!

## Game Mechanics

### Character Classes
- **Warrior** - ATK: 8, DEF: 7 - Powerful front-line fighter
- **Mage** - ATK: 9, DEF: 5 - High attack but fragile
- **Rogue** - ATK: 7, DEF: 6 - Balanced all-rounder

### Piece Stats
Each piece has:
- **Level** - Increases with experience
- **Experience** - Gained by capturing enemy pieces
- **HP (Health Points)** - Reduced when attacking or defending
- **Attack** - Damage dealt to enemies
- **Defense** - Damage reduction when defending

### Experience System
- Capturing a pawn: 15 XP
- Capturing a knight/bishop: 25 XP
- Capturing a rook: 35 XP
- Capturing a queen: 50 XP
- Capturing a king: 100 XP (victory!)

Level up at 100 XP: +1 ATK, +1 DEF, +5 HP

## File Structure

```
rpg-chess-game/
├── index.html           # Main HTML file
├── styles.css           # All styling and responsive design
└── js/
    ├── main.js          # Entry point
    ├── utils.js         # Utility functions (chess notation, helpers)
    ├── pieces.js        # Piece class and movement rules
    ├── board.js         # Board logic and move validation
    ├── ai.js            # AI engine with minimax algorithm
    ├── game-state.js    # Game state management
    └── ui.js            # UI rendering and interactions
```

## Technical Details

### Browser Compatibility
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

### No Dependencies
Pure JavaScript - no libraries or frameworks required. Runs entirely in the browser.

### AI Algorithm
- **Minimax** with alpha-beta pruning
- **Position evaluation** based on material and piece placement
- **King safety** assessment
- **Configurable depth** for difficulty levels

### Responsive Design
- CSS Grid for board layout
- Flexbox for UI elements
- Media queries for mobile/tablet/desktop
- Touch-friendly button sizes

## Controls

### Mouse/Touch
- **Tap a piece** - Select it
- **Tap highlighted square** - Move to that square
- **Tap another piece** - Switch selection

### Buttons
- **Undo** - Revert last move
- **Resign** - Forfeit current game
- **Menu** - Return to main menu

## Tips for Winning

1. **Protect Your King** - Keep your king safe from check
2. **Control the Center** - Occupy central squares for better piece activity
3. **Develop Pieces** - Get your pieces out early in the game
4. **Plan Ahead** - Think 3-4 moves ahead of your opponent
5. **Level Up Pieces** - Capture enemy pieces to strengthen your army
6. **Use Special Abilities** - Don't forget special class abilities
7. **Watch for Tactics** - Look for forks, pins, and skewers

## Future Enhancements

- [ ] Sound effects and music
- [ ] Online multiplayer (WebSocket)
- [ ] Save/load game functionality
- [ ] Tournament mode
- [ ] Piece customization and skins
- [ ] Weekly challenges
- [ ] Player statistics and achievements
- [ ] Dark mode theme

## License

Open source - feel free to modify and share!

---

Made with ♟️ for chess lovers and RPG enthusiasts