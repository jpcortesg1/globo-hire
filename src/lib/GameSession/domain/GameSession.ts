// Possible symbols that can appear on the slot machine reels.
export type Symbol = 'C' | 'L' | 'O' | 'W';

// Represents a single roll/spin in the slot machine game.
export interface Roll {
  symbols: [Symbol, Symbol, Symbol]; // The result of the roll (three symbols)
  isWin: boolean;                   // Whether the roll was a winning roll
  credits: number;                  // Credits after this roll
  timestamp: string;                // When the roll occurred
  wasRerolled?: boolean;            // Optional: whether this roll was a reroll
}

// Represents a user's game session in the slot machine game.
export interface GameSession {
  id: string;           // Unique identifier for the session
  credits: number;      // Current credits available to the player
  createdAt: Date;      // When the session was created
  lastUpdated: Date;    // When the session was last updated
  gameHistory: Roll[];  // History of all rolls in this session
  isActive: boolean;    // Whether the session is currently active
}