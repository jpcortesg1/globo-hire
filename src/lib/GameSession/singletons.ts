import { InMemoryGameSessionRepository } from "./infrastructure/repositories/InMemoryGameSessionRepository";
import { SessionController } from "./infrastructure/controllers/SessionController";
import { GameController } from "./infrastructure/controllers/GameController";
import { RollSlots } from "./application/RollSlots";
import { RandomNumberGenerator } from "./infrastructure/services/RandomNumberGenerator";

export const sessionRepository = new InMemoryGameSessionRepository();
export const sessionController = new SessionController(sessionRepository);

const randomGenerator = new RandomNumberGenerator();
const rollSlotsUseCase = new RollSlots(sessionRepository, randomGenerator);
export const gameController = new GameController(rollSlotsUseCase); 