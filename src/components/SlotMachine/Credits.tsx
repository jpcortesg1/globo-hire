"use client";
import { useGame } from "@/context/GameContext";
import { useState, useEffect } from "react";

/**
 * Credits component displays the current credit balance and rolling status
 * Includes animations for credit changes and rolling state
 */
const Credits = () => {
  const { credits, spinning, quantityOfRolls } = useGame();
  const [displayCredits, setDisplayCredits] = useState(credits);
  const [prevCredits, setPrevCredits] = useState(credits);
  
  useEffect(() => {
    // If credits decreased (loss) OR game just started, update immediately
    if (credits < prevCredits || quantityOfRolls === 0) {
      setDisplayCredits(credits);
    }
    // If credits increased (win), wait for spinning to finish
    else if (credits > prevCredits && !spinning) {
      const timer = setTimeout(() => {
        setDisplayCredits(credits);
      }, 3000);
      return () => clearTimeout(timer);
    }
    // Update previous credits reference
    setPrevCredits(credits);
  }, [credits, prevCredits, spinning, quantityOfRolls]);
  
  return (
    <div className="relative flex flex-col items-center my-4">
      <div className="bg-gradient-to-r from-yellow-800 via-yellow-600 to-yellow-800 
                      px-6 py-3 rounded-lg border-2 border-yellow-400 shadow-lg">
        <div className="flex items-center justify-center gap-3">
          <span className="text-yellow-300 font-bold tracking-wide text-lg uppercase">
            Credits
          </span>
          
          <div className="bg-black py-1 px-4 rounded-md min-w-[80px] flex justify-center">
            <span className="font-mono text-2xl font-bold text-yellow-400 tabular-nums">
              {displayCredits}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Credits;