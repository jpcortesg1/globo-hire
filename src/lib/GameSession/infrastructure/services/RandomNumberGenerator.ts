import { Symbol, SymbolType } from "../../domain/Symbol";
import { IRandomGenerator } from "../../ports/output/IRandomGenerator";

/**
 * Service for generating random slot machine symbols and reroll logic.
 */
export class RandomNumberGenerator implements IRandomGenerator {
  private symbols: SymbolType[] = ['C', 'L', 'O', 'W'];

  /**
   * Generates a random symbol instance.
   */
  generateSymbol(): Symbol {
    const randomIndex = Math.floor(Math.random() * this.symbols.length);
    return new Symbol(this.symbols[randomIndex]);
  }

  /**
   * Generates an array of random symbol instances.
   */
  generateSymbols(count: number): Symbol[] {
    const result: Symbol[] = [];
    for (let i = 0; i < count; i++) {
      result.push(this.generateSymbol());
    }
    return result;
  }

  /**
   * Determines if a reroll (cheat) should occur based on the player's credits.
   */
  shouldReroll(credits: number): boolean {
    if (credits < 40) {
      return false;
    } else if (credits >= 40 && credits <= 60) {
      return Math.random() < 0.3;
    } else {
      return Math.random() < 0.6;
    }
  }
}