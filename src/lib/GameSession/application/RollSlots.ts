import { IGameSessionRepository } from '../ports/output/IGameSessionRepository';
import { IRandomGenerator } from '../ports/output/IRandomGenerator';
import { IRollSlots, IRollSlotsInput, IRollSlotsOutput } from '../ports/input/IRollSlots';

/**
 * Application service for handling slot machine rolls and win logic.
 */
export class RollSlots implements IRollSlots {
  constructor(
    private readonly sessionRepository: IGameSessionRepository,
    private readonly randomGenerator: IRandomGenerator
  ) {}

  /**
   * Executes a slot roll for a given session, applies reroll logic, and updates credits.
   * Throws if the session is not found or credits are insufficient.
   */
  async execute(input: IRollSlotsInput): Promise<IRollSlotsOutput> {
    const session = await this.sessionRepository.findById(input.sessionId);
    if (!session) {
      throw new Error('Session not found');
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
    
    const finalAllEqual = finalSymbols.every(s => s.getType() === finalSymbols[0].getType());
    
    // If the final result is a win, increase credits
    if (finalAllEqual) {
      const winAmount = finalSymbols[0].getValue();
      session.increaseCredits(winAmount);
    }
    
    await this.sessionRepository.update(session);
    
    return {
      symbols: finalSymbols.map(s => s.getType()) as [string, string, string],
      isWin: finalAllEqual,
      credits: session.getCredits(),
      message: finalAllEqual ? `You won ${finalSymbols[0].getValue()} credits!` : undefined,
    };
  }
}