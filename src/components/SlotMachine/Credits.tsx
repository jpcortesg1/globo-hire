"use client";
import { useGame } from "@/context/GameContext";
import { useState, useEffect } from "react";

/**
 * Credits component displays the current credit balance and rolling status
 * Includes animations for credit changes and rolling state
 */
const Credits = () => {
  const { credits } = useGame();
  const [displayCredits, setDisplayCredits] = useState(credits);
  const [prevCreditsRef, setPrevCreditsRef] = useState(credits);
  
  useEffect(() => {
    setDisplayCredits(credits);    
    setPrevCreditsRef(credits);
  }, [credits, prevCreditsRef]);
  
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