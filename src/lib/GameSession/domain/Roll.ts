// Domain model representing a single roll/spin in the slot machine game
import { Symbol } from './Symbol';

export class Roll {
  private readonly id: string;

  constructor(
    private readonly _symbols: [Symbol, Symbol, Symbol],
    private readonly _credits: number,
    private readonly _timestamp: Date = new Date(),
    private readonly _wasRerolled: boolean = false
  ) {
    this.id = this.generateId();
  }

  // Generates a unique identifier for the roll
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  // Getters for roll properties
  public getId(): string {
    return this.id;
  }

  public getSymbols(): [Symbol, Symbol, Symbol] {
    return this._symbols;
  }

  public getCredits(): number {
    return this._credits;
  }

  public getTimestamp(): Date {
    return this._timestamp;
  }

  public wasRerolled(): boolean {
    return this._wasRerolled;
  }

  /**
   * Determines if the roll is a winning combination (all symbols equal).
   */
  public isWinningCombination(): boolean {
    const [first, second, third] = this._symbols;
    return first.equals(second) && second.equals(third);
  }

  /**
   * Returns the win amount for this roll, or 0 if not a win.
   */
  public getWinAmount(): number {
    if (!this.isWinningCombination()) {
      return 0;
    }
    
    return this._symbols[0].getValue();
  }

  /**
   * Serializes the roll for persistence or transmission.
   */
  public toJSON() {
    return {
      id: this.id,
      symbols: this._symbols.map(s => s.getType()),
      isWin: this.isWinningCombination(),
      winAmount: this.getWinAmount(),
      credits: this._credits,
      timestamp: this._timestamp.toISOString(),
      wasRerolled: this._wasRerolled
    };
  }
}