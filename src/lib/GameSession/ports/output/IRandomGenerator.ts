import { Symbol } from "../../domain/Symbol";

/**
 * Interface for random symbol generator implementations.
 */
export interface IRandomGenerator {
  generateSymbol(): Symbol;
  generateSymbols(count: number): Symbol[];
  shouldReroll(credits: number): boolean;
}