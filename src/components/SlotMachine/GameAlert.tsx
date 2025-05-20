"use client";
import { useGame } from "@/context/GameContext";

/**
 * GameAlert component displays important game messages as an overlay
 * Used for showing game state changes, wins, losses, and session end messages
 * Automatically disappears after a timeout (handled by GameContext)
 */
const GameAlert = () => {
  const { gameAlert } = useGame();

  // Don't render anything if there's no alert
  if (!gameAlert) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-51 bg-black/70">
      {gameAlert && (
        <div className="text-white text-2xl font-bold">
          {gameAlert}
        </div>
      )}
    </div>
  );
};

export default GameAlert;