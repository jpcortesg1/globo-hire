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

    const result = await gameController.roll(sessionId)
    return res.status(200).json({ result, success: true });
  } catch (error) {
    console.error('Error al realizar la tirada:', error);

    // Comprobar tipo específico de error para dar respuesta adecuada
    if (error instanceof Error) {
      if (error.message === 'Créditos insuficientes') {
        return res.status(400).json({
          success: false,
          error: 'No tienes suficientes créditos para jugar'
        });
      } else if (error.message === 'Sesión no encontrada' || error.message === 'La sesión no está activa') {
        return res.status(401).json({
          success: false,
          error: 'Sesión no válida'
        });
      }
    }

    // Error genérico
    return res.status(500).json({
      success: false,
      error: 'Error al procesar la tirada'
    });
  }
})