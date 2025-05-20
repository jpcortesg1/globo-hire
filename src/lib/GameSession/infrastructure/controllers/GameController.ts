import { SymbolType } from "../../domain/Symbol";
import { IRollSlots, IRollSlotsInput } from "../../ports/input/IRollSlots";
import { IGameSessionRepository } from "../../ports/output/IGameSessionRepository";

/**
 * Controller for handling game actions such as rolling the slot machine.
 */
export class GameController {
  constructor (private readonly rollSlotsUseCase: IRollSlots) {}

  /**
   * Rolls the slot machine for the given session ID.
   */
  async roll(sessionId: string) {
    const input: IRollSlotsInput = {
      sessionId
    }
    return await this.rollSlotsUseCase.execute(input);
  }
}