"use client";
import { useState, useRef, useEffect } from "react";
import { useGame } from "@/context/GameContext";

/**
 * Controls component provides the main game controls (Roll and Cash Out buttons)
 * Includes special "cheating" behavior for the Cash Out button
 */
const Controls = () => {
  const { performRoll, performCashOut, credits, gameActive, quantityOfRolls } = useGame();
  const [isRolling, setIsRolling] = useState(false);
  const [cashOutStyle, setCashOutStyle] = useState({});
  const [cashOutDisabled, setCashOutDisabled] = useState(false);
  const [buttonPressed, setButtonPressed] = useState("");
  const rollInProgressRef = useRef(false);
  const currentPositionRef = useRef({ x: 0, y: 0 });
  
  /**
   * Handles the roll action
   * Prevents multiple calls and manages roll animation state
   */
  const handleRoll = async () => {
    // Prevent multiple calls if already in progress
    if (isRolling || !gameActive || credits < 1 || rollInProgressRef.current) return;
    
    rollInProgressRef.current = true;
    setIsRolling(true);
    setButtonPressed("roll");
    
    try {
      // Single call to performRoll - handles all necessary logic
      await performRoll();
      
      // Allow time for animation - NO updateSession call here
      setTimeout(() => {
        setIsRolling(false);
        setButtonPressed("");
        rollInProgressRef.current = false;
      }, 3000); // 4 seconds to cover all reel animations
    } catch (error) {
      console.error("Roll error:", error);
      setIsRolling(false);
      setButtonPressed("");
      rollInProgressRef.current = false;
    }
  };

  /**
   * "Cheating" behavior for Cash Out button
   * Randomly moves button or makes it temporarily unclickable
   * If it jumps, it stays in its new position and can jump again from there
   */
  const handleCashOutHover = () => {
    // 50% chance to jump
    if (Math.random() < 0.5) {
      const randomX = (Math.random() * 600 - 300);
      const randomY = (Math.random() * 200 - 100);
      
      // Accumulate the new position
      currentPositionRef.current.x += randomX;
      currentPositionRef.current.y += randomY;
      
      setCashOutStyle({
        transform: `translate(${currentPositionRef.current.x}px, ${currentPositionRef.current.y}px)`,
        transition: 'transform 0.3s cubic-bezier(.17,.67,.83,.67)'
      });
    }
    
    // 40% chance to be temporarily unclickable
    if (Math.random() < 0.4) {
      setCashOutDisabled(true);
      setTimeout(() => setCashOutDisabled(false), 1500);
    }
  };

  /**
   * Handles the cash out action
   * Prevents action if button is disabled or game is not active
   */
  const handleCashOut = async () => {
    if (cashOutDisabled || isRolling || !gameActive || credits <= 0) return;
    
    setButtonPressed("cashout");
    await performCashOut();
    setButtonPressed("");
  };

  /**
   * Disables the cash out button if the quantity of rolls is less than 3
   * Resets the position of the cash out button if the quantity of rolls is 0
   */
  useEffect(() => {
    if(quantityOfRolls < 2) {
      setCashOutDisabled(true);
    } else {
      setCashOutDisabled(false);
    }
    if(quantityOfRolls === 0) {
      // Reset position reference
      currentPositionRef.current = { x: 0, y: 0 };
      // Reset visual position
      setCashOutStyle({
        transform: 'translate(0px, 0px)',
        transition: 'transform 0.3s cubic-bezier(.17,.67,.83,.67)'
      });
    }
  }, [quantityOfRolls]);

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8 px-4">
      {/* Roll Button */}
      <button
        onClick={handleRoll}
        disabled={isRolling || !gameActive || credits < 1}
        className={`
          relative
          w-48
          h-20
          rounded-full
          font-bold
          text-2xl
          uppercase
          tracking-wider
          overflow-hidden
          focus:outline-none
          transition-all
          duration-300
          shadow-lg
          ${buttonPressed === "roll" ? 'translate-y-1 scale-[0.98]' : 'translate-y-0'}
          ${isRolling || !gameActive || credits < 1 ? 
            'bg-gray-600 text-gray-400 cursor-not-allowed' : 
            'bg-gradient-to-b from-red-500 to-red-700 text-white hover:from-red-400 hover:to-red-600 cursor-pointer'
          }
        `}
      >
        <span className="relative z-10 flex items-center justify-center">
          {isRolling ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>ROLLING</span>
            </div>
          ) : (
            <>
              <span className="mr-2">🎲</span>
              <span>ROLL</span>
            </>
          )}
        </span>
      </button>

      {/* Cash Out Button */}
      <button
        onClick={handleCashOut}
        onMouseEnter={handleCashOutHover}
        disabled={cashOutDisabled || isRolling || !gameActive || credits <= 0 || quantityOfRolls < 2}
        style={cashOutStyle}
        className={`
          relative
          w-48
          h-20
          rounded-full
          font-bold
          text-2xl
          uppercase
          tracking-wider
          overflow-hidden
          focus:outline-none
          transition-all
          duration-300
          shadow-lg
          ${buttonPressed === "cashout" ? 'translate-y-1 scale-[0.98]' : 'translate-y-0'}
          ${cashOutDisabled || isRolling || !gameActive || credits <= 0 ? 
            'bg-gray-600 text-gray-400 cursor-not-allowed' : 
            'bg-gradient-to-b from-green-500 to-green-700 text-white hover:from-green-400 hover:to-green-600 cursor-pointer'
          }
        `}
      >
        <span className="relative z-10 flex items-center justify-center">
          <span className="mr-2">💰</span>
          <span>CASH OUT</span>
        </span>
      </button>
    </div>
  );
};

export default Controls;