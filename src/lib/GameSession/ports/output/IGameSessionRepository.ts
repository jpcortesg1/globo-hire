import { GameSession } from "../../domain/GameSession";

/**
 * Interface for game session repository implementations.
 */
export interface IGameSessionRepository {
  save(session: GameSession): Promise<void>;
  findById(sessionId: string): Promise<GameSession | null>;
  update(session: GameSession): Promise<void>;
  delete(sessionId: string): Promise<void>;
}