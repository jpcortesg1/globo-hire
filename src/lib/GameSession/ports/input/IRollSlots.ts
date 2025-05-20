/**
 * Input for rolling slots in a game session.
 */
export interface IRollSlotsInput {
  sessionId: string;
}

/**
 * Output/result of a slot roll operation.
 */
export interface IRollSlotsOutput {
  symbols: [string, string, string];
  isWin: boolean;
  credits: number;
  message?: string;
}

/**
 * Interface for slot roll application service.
 */
export interface IRollSlots {
  execute(input: IRollSlotsInput): Promise<IRollSlotsOutput>;
}