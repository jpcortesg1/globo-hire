import { SessionController } from "@/lib/GameSession/infrastructure/controllers/SessionController";
import { InMemoryGameSessionRepository } from "@/lib/GameSession/infrastructure/repositories/InMemoryGameSessionRepository";
import { withSessionRoute } from "@/lib/GameSession/infrastructure/middlewares/WithSession";
import { NextApiRequest, NextApiResponse } from "next/types";
import { v4 as uuidv4 } from 'uuid';
// Singleton instances for session management across the application
const sessionRepository = new InMemoryGameSessionRepository();
const sessionController = new SessionController(sessionRepository);

// API route for creating a new game session
export default withSessionRoute(async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests for session creation
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create a new session using the controller
    const session = await sessionController.createSession();
    
    // Store the session ID in the user's cookie
    req.setSessionId(session.id);

    // Return the created session to the client
    return res.status(201).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error('Error creating session:', error);
    return res.status(500).json({
      success: false,
      error: 'Error creating game session',
    });
  }
});

// Export controller and repository for use in other endpoints
export { sessionController, sessionRepository };