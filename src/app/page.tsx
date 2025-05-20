import SlotMachine from "@/components/SlotMachine";
import { GameProvider } from "@/context/GameContext";

/**
 * Main page component that wraps the SlotMachine with the game context provider
 * This ensures game state is available throughout the application
 */
export default function Home() {
  return (
    <GameProvider>
      <SlotMachine />
    </GameProvider>
  );
}
