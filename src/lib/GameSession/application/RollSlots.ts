import { IGameSessionRepository } from '../ports/output/IGameSessionRepository';
import { IRandomGenerator } from '../ports/output/IRandomGenerator';
import { IRollSlots, IRollSlotsInput, IRollSlotsOutput } from '../ports/input/IRollSlots';
import { Symbol } from '../domain/Symbol';

/**
 * Application service for handling slot machine rolls, reroll logic, and win calculation.
 */
export class RollSlots implements IRollSlots {
  constructor(
    private readonly sessionRepository: IGameSessionRepository,
    private readonly randomGenerator: IRandomGenerator
  ) {}

  /**
   * Executes a slot roll for a given session, applies reroll logic, and updates credits.
   * Throws if the session is not found, not active, or credits are insufficient.
   */
  async execute(input: IRollSlotsInput): Promise<IRollSlotsOutput> {
    const session = await this.sessionRepository.findById(input.sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    if (!session.isActive()) {
      throw new Error('Session is not active');
    }
    if (session.getCredits() < 1) {
      throw new Error('Insufficient credits');
    }
    session.decreaseCredits(1);
    const symbols = this.randomGenerator.generateSymbols(3);
    const allEqual = symbols.every(s => s.getType() === symbols[0].getType());
    let finalSymbols = symbols;
    let wasRerolled = false;
    // If all symbols are equal, check if a reroll (cheat) should occur
    if (allEqual) {
      const credits = session.getCredits();
      if (this.randomGenerator.shouldReroll(credits)) {
        do {
          finalSymbols = this.randomGenerator.generateSymbols(3);
          wasRerolled = true;
        } while (finalSymbols.every(s => s.getType() === finalSymbols[0].getType()));
      }
    }
    // Add the roll to the session's game history and handle win logic
    const roll = session.addRoll(finalSymbols as [Symbol, Symbol, Symbol], wasRerolled);
    await this.sessionRepository.update(session);
    return {
      symbols: finalSymbols.map(s => s.getType()) as [string, string, string],
      isWin: roll.isWinningCombination(),
      credits: session.getCredits(),
      message: roll.isWinningCombination() ? `You won ${roll.getWinAmount()} credits!` : undefined,
      winAmount: roll.isWinningCombination() ? roll.getWinAmount() : undefined,
    };
  }
}