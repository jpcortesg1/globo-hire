// This API route handles the creation of a new game session. It uses a session middleware to manage session IDs via cookies.
import { GameSession } from "@/lib/GameSession/domain/GameSession";
import { withSessionRoute } from "@/lib/GameSession/infrastructure/WithSession";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from 'uuid';

// In-memory store for active game sessions, keyed by session ID.
const activeSessions: Record<string, GameSession> = {}

// API handler wrapped with session management middleware.
export default withSessionRoute(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests for session creation.
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Generate a unique session ID for the new game session.
    const sessionId = uuidv4();
    
    // Initialize a new game session with default values.
    const newSession: GameSession = {
      id: sessionId,
      credits: 10,
      createdAt: new Date(),
      lastUpdated: new Date(),
      gameHistory: [],
      isActive: true,
    };

    // Store the new session in the in-memory session store.
    activeSessions[sessionId] = newSession;

    // Attach the session ID to the user's session cookie.
    req.setSessionId(sessionId);

    // Respond with the new session's basic information.
    return res.status(201).json({
      success: true,
      session: {
        id: sessionId,
        credits: newSession.credits,
      },
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return res.status(500).json({
      success: false,
      error: 'Error creating game session',
    });
  }
});

// Export the activeSessions store for use in other modules.
export { activeSessions };