import { IRollSlots, IRollSlotsInput } from "../../ports/input/IRollSlots";

/**
 * Controller for handling game actions such as rolling the slot machine.
 * Always return plain JSON objects, not class instances.
 */
export class GameController {
  constructor (private readonly rollSlotsUseCase: IRollSlots) {}

  /**
   * Rolls the slot machine for the given session ID.
   * Returns a plain JSON result.
   */
  async roll(sessionId: string) {
    const input: IRollSlotsInput = {
      sessionId
    }
    // The use case returns a plain object, not a class instance
    return await this.rollSlotsUseCase.execute(input);
  }
}