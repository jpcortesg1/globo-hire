// Domain model representing a user's slot machine game session
import { Roll } from './Roll';
import { Symbol } from './Symbol';

export class GameSession {
  private _gameHistory: Roll[] = [];
  private _lastUpdated: Date;

  constructor(
    private readonly _id: string,
    private _credits: number = 10,
    private readonly _createdAt: Date = new Date(),
    private _isActive: boolean = true
  ) {
    this._lastUpdated = _createdAt;
  }

  // Getters for session properties
  public getId(): string {
    return this._id;
  }

  public getCredits(): number {
    return this._credits;
  }

  public getCreatedAt(): Date {
    return this._createdAt;
  }

  public getLastUpdated(): Date {
    return this._lastUpdated;
  }

  public getGameHistory(): ReadonlyArray<Roll> {
    return [...this._gameHistory];
  }

  public isActive(): boolean {
    return this._isActive;
  }

  /**
   * Adds a new roll to the session, updates credits, and handles win logic.
   * Throws if the session is inactive or credits are insufficient.
   */
  public addRoll(symbols: [Symbol, Symbol, Symbol], wasRerolled: boolean = false): Roll {
    if (!this._isActive) {
      throw new Error('Cannot add a roll to an inactive session');
    }

    if (this._credits < 0) {
      throw new Error('Insufficient credits to play');
    }

    // Create the Roll object
    const roll = new Roll(
      symbols,
      this._credits,
      new Date(),
      wasRerolled
    );

    // If it's a winning combination, add credits
    if (roll.isWinningCombination()) {
      this._credits += roll.getWinAmount();
    }

    // Add the roll to the history
    this._gameHistory.push(roll);
    
    // Update timestamp
    this._lastUpdated = new Date();

    return roll;
  }

  /**
   * Deactivates the session, preventing further play.
   */
  public deactivate(): void {
    this._isActive = false;
    this._lastUpdated = new Date();
  }

  /**
   * Increases the player's credits by a positive amount.
   */
  public increaseCredits(amount: number): void {
    if (amount <= 0) {
      throw new Error('Credit increment must be positive');
    }

    this._credits += amount;
    this._lastUpdated = new Date();
  }

  /**
   * Decreases the player's credits by a positive amount, if sufficient credits exist.
   */
  public decreaseCredits(amount: number): void {
    if (amount <= 0) {
      throw new Error('Credit decrement must be positive');
    }

    if (this._credits < amount) {
      throw new Error('Insufficient credits');
    }

    this._credits -= amount;
    this._lastUpdated = new Date();
  }

  /**
   * Ends the session and returns the remaining credits to the player.
   */
  public cashOut(): number {
    if (!this._isActive) {
      throw new Error('Cannot cash out from an inactive session');
    }
    
    const creditsToReturn = this._credits;
    this._credits = 0;
    this.deactivate();
    
    return creditsToReturn;
  }

  /**
   * Determines if the system should force a reroll (cheat) based on credits.
   * Returns true if cheating should occur.
   */
  public shouldCheat(): boolean {
    if (this._credits < 40) {
      return false; // No cheating below 40 credits
    } else if (this._credits <= 60) {
      return Math.random() < 0.3; // 30% chance to cheat
    } else {
      return Math.random() < 0.6; // 60% chance to cheat
    }
  }

  /**
   * Serializes the session for persistence or transmission.
   */
  public toJSON() {
    return {
      id: this._id,
      credits: this._credits,
      createdAt: this._createdAt.toISOString(),
      lastUpdated: this._lastUpdated.toISOString(),
      gameHistory: this._gameHistory.map(roll => roll.toJSON()),
      isActive: this._isActive
    };
  }

  /**
   * Reconstructs a GameSession from persisted data.
   * Note: Game history is not fully reconstructed for simplicity.
   */
  public static fromJSON(data: unknown): GameSession {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid data');
    }
    if (!('id' in data) || typeof data.id !== 'string') {
      throw new Error('Invalid data');
    }
    if (!('credits' in data) || typeof data.credits !== 'number') {
      throw new Error('Invalid data');
    }
    if (!('createdAt' in data) || typeof data.createdAt !== 'string') {
      throw new Error('Invalid data');
    }
    if (!('lastUpdated' in data) || typeof data.lastUpdated !== 'string') {
      throw new Error('Invalid data');
    }
    if (!('isActive' in data) || typeof data.isActive !== 'boolean') {
      throw new Error('Invalid data');
    }
    
    const session = new GameSession(
      data.id,
      data.credits,
      new Date(data.createdAt),
      data.isActive
    );
    
    session._lastUpdated = new Date(data.lastUpdated);
    
    // Note: In a full implementation, rolls should be reconstructed as well.
    return session;
  }
}