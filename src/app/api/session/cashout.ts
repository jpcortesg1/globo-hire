import { withSessionRoute } from "@/lib/GameSession/infrastructure/middlewares/WithSession";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionController } from "./create";

export default withSessionRoute(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const sessionId = req.getSessionId();
    if (!sessionId) {
      return res.status(401).json({ error: 'Unauthorized', success: false });
    }

    const result = await sessionController.cashOut(sessionId);

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Error processing cash out:', error);
    if (error instanceof Error) {
      if (error.message === 'Session not found' || error.message === 'Session is not active') {
        return res.status(401).json({
          success: false,
          error: 'Session not valid'
        });
      }
    }
    return res.status(500).json({
      success: false,
      error: 'Error processing cash out'
    });
  }
})