import { RollSlots } from "@/lib/GameSession/application/RollSlots";
import { GameController } from "@/lib/GameSession/infrastructure/controllers/GameController";
import { withSessionRoute } from "@/lib/GameSession/infrastructure/middlewares/WithSession";
import { InMemoryGameSessionRepository } from "@/lib/GameSession/infrastructure/repositories/InMemoryGameSessionRepository";
import { RandomNumberGenerator } from "@/lib/GameSession/infrastructure/services/RandomNumberGenerator";
import { NextApiRequest, NextApiResponse } from "next";

const sessionRepository = new InMemoryGameSessionRepository();
const randomGenerator = new RandomNumberGenerator();
const rollSlotsUseCase = new RollSlots(sessionRepository, randomGenerator);
const gameController = new GameController(rollSlotsUseCase);

export default withSessionRoute(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const sessionId = req.getSessionId();
    if (!sessionId) {
      return res.status(401).json({ message: 'Unauthorized', success: false });
    }

    const result = await gameController.roll(sessionId);
    return res.status(200).json({ result, success: true });
  } catch (error) {
    console.error('Error processing roll:', error);
    if (error instanceof Error) {
      if (error.message === 'Insufficient credits') {
        return res.status(400).json({
          success: false,
          error: 'You do not have enough credits to play.'
        });
      } else if (error.message === 'Session not found' || error.message === 'Session is not active') {
        return res.status(401).json({
          success: false,
          error: 'Session is not valid.'
        });
      }
    }
    return res.status(500).json({
      success: false,
      error: 'Error processing roll.'
    });
  }
});