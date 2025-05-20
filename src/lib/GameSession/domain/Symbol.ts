// Represents a symbol on the slot machine reels
export type SymbolType = 'C' | 'L' | 'O' | 'W'; // Cherry, Lemon, Orange, Watermelon

export class Symbol {
  // Mapping of symbol types to their win values
  private values: Record<SymbolType, number> = {
    C: 10,
    L: 20,
    O: 30,
    W: 40,
  };

  constructor(private readonly type: SymbolType) { }

  /**
   * Returns the type of the symbol (e.g., 'C', 'L', 'O', 'W').
   */
  public getType(): SymbolType {
    return this.type;
  }

  /**
   * Returns the win value associated with this symbol.
   */
  public getValue(): number {
    return this.values?.[this.type] ?? 0;
  }

  /**
   * Checks if this symbol is equal to another symbol by type.
   */
  public equals(symbol: Symbol): boolean {
    return this.type === symbol.getType();
  }
}