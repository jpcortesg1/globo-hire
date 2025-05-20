/**
 * Input for rolling slots in a game session.
 */
export interface IRollSlotsInput {
  sessionId: string;
}

/**
 * Output/result of a slot roll operation.
 * winAmount is present only if the roll is a win.
 */
export interface IRollSlotsOutput {
  symbols: [string, string, string];
  isWin: boolean;
  credits: number;
  message?: string;
  winAmount?: number;
}

/**
 * Interface for slot roll application service.
 */
export interface IRollSlots {
  execute(input: IRollSlotsInput): Promise<IRollSlotsOutput>;
}