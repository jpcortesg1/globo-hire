import { GameSession } from "../../domain/GameSession";
import { IGameSessionRepository } from "../../ports/output/IGameSessionRepository";
import { v4 as uuidv4 } from 'uuid';

/**
 * Controller for managing game session lifecycle operations.
 */
export class SessionController {
  constructor(private readonly sessionRepository: IGameSessionRepository) {}

  /**
   * Creates a new game session and persists it in the repository.
   */
  async createSession(): Promise<{ id: string; credits: number }> {
    const sessionId = uuidv4();
    const session = new GameSession(sessionId, 10);
    
    await this.sessionRepository.save(session);
    
    return {
      id: sessionId,
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
   * Throws if the session is not found.
   */
  async cashOut(sessionId: string): Promise<{ credits: number }> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }
    
    const credits = session.getCredits();
    
    // End the session by deleting it from the repository
    await this.sessionRepository.delete(sessionId);
    
    return { credits };
  }
}