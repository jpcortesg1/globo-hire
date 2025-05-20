import { GameSession } from "../../domain/GameSession";
import { IGameSessionRepository } from "../../ports/output/IGameSessionRepository";

/**
 * In-memory implementation of the game session repository interface.
 * Used for development and testing purposes.
 */
export class InMemoryGameSessionRepository implements IGameSessionRepository {
  private sessions: Record<string, GameSession> = {};

  async save(session: GameSession): Promise<void> {
    this.sessions[session.getId()] = session;
  }

  async findById(sessionId: string): Promise<GameSession | null> {
    return this.sessions[sessionId] || null;
  }

  async update(session: GameSession): Promise<void> {
    this.sessions[session.getId()] = session;
  }

  async delete(sessionId: string): Promise<void> {
    delete this.sessions[sessionId];
  }
}