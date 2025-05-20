import { GameSession } from "../../domain/GameSession";
import { IGameSessionRepository } from "../../ports/output/IGameSessionRepository";
import { v4 as uuidv4 } from 'uuid';

/**
 * Controller for managing game session lifecycle operations.
 */
export class SessionController {
  constructor(private readonly sessionRepository: IGameSessionRepository) { }

  /**
   * Creates a new game session and persists it in the repository.
   */
  async createSession(): Promise<{ id: string; credits: number }> {
    const sessionId = uuidv4();
    const session = new GameSession(sessionId, 10);
    await this.sessionRepository.save(session);
    return {
      id: session.getId(),
      credits: session.getCredits(),
    };
  }

  /**
   * Retrieves a game session by its ID.
   */
  async getSession(sessionId: string): Promise<GameSession | null> {
    return this.sessionRepository.findById(sessionId);
  }

  /**
   * Ends a session and returns the remaining credits to the player.
   * Throws if the session is not found or not active.
   */
  async cashOut(sessionId: string): Promise<{ credits: number, message: string }> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    if (!session.isActive()) {
      throw new Error('Session is not active');
    }
    const credits = session.cashOut();
    await this.sessionRepository.update(session);
    return { credits, message: `Session ended successfully, you have received ${credits} credits` };
  }

  /**
   * Returns the status of a session, including a message and current credits.
   * Throws if the session is not found.
   */
  async getStatus(sessionId: string): Promise<{ session: GameSession, message: string }> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    return {
      session,
      message: `Session is active, you have ${session.getCredits()} credits`,
    };
  }
}