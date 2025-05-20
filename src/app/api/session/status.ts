import { withSessionRoute } from "@/lib/GameSession/infrastructure/middlewares/WithSession";
import { NextApiRequest, NextApiResponse } from "next";
import { sessionController } from "./create";

export default withSessionRoute(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const sessionId = req.getSessionId();
    if (!sessionId) {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    const result = await sessionController.getStatus(sessionId);

    return res.status(200).json({
      success: true,
      status: result.session.toJSON(),
      message: result.message,
    });
  } catch (error) {
    console.error('Error retrieving session status:', error);
    if (error instanceof Error && error.message === 'Session not found') {
      return res.status(401).json({
        success: false,
        error: 'Session is not valid.'
      });
    }
    return res.status(500).json({
      success: false,
      error: 'Error retrieving session status.'
    });
  }
});
