import { useGame } from "@/context/GameContext";
import { useState, useEffect } from "react";

/**
 * StartButton component displays a neon-animated button to start the game.
 * It is shown as an overlay when the game is not active.
 */
const StartButton = () => {
  const { startGame, gameActive, loading } = useGame();
  const [animateNeon, setAnimateNeon] = useState(false);

  // Neon light blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateNeon(prev => !prev);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  if (gameActive) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
      <div
        className={`
          relative 
          transform 
          transition-all 
          duration-500 
          hover:scale-105
          ${animateNeon ? 'scale-[1.02]' : 'scale-100'}
        `}
      >
        {/* Decorative neon lights around the button */}
        <div
          className={`
            absolute 
            inset-0 
            -m-3 
            rounded-xl 
            bg-gradient-to-r 
            from-purple-600 
            via-red-500 
            to-yellow-500 
            opacity-75 
            blur-xl 
            transition-opacity 
            duration-1000
            ${animateNeon ? 'opacity-90' : 'opacity-60'}
          `}
        ></div>

        {/* Main start button */}
        <button
          onClick={startGame}
          disabled={loading}
          className={`
            relative 
            px-10 
            py-6 
            font-bold 
            text-4xl 
            uppercase 
            tracking-wide 
            rounded-lg 
            bg-gradient-to-br 
            from-yellow-400 
            via-yellow-500 
            to-yellow-600
            text-black 
            shadow-[0_0_20px_rgba(255,215,0,0.7)] 
            border-4 
            border-yellow-300
            hover:shadow-[0_0_30px_rgba(255,215,0,0.9)]
            hover:from-yellow-300
            hover:to-yellow-500
            disabled:opacity-70
            disabled:cursor-not-allowed
            overflow-hidden
            cursor-pointer
          `}
        >
          {/* Casino-themed icons */}
          <span className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-lg opacity-80">🎰</span>
          <span className="absolute -right-2 top-1/2 transform -translate-y-1/2 text-lg opacity-80">🎲</span>

          {/* Button text and loading state */}
          <div className="flex flex-col items-center">
            <span className="text-sm text-yellow-900 mb-1">Feeling Lucky?</span>
            {loading ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-yellow-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>LOADING...</span>
              </div>
            ) : (
              <span className="text-shadow-sm shadow-black">PLAY NOW</span>
            )}
            <span className="text-xs text-yellow-900 mt-1">10 FREE CREDITS</span>
          </div>

          {/* Animated shine effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div
              className={`
                absolute 
                top-0 
                -left-[100%] 
                w-[60%] 
                h-full 
                bg-gradient-to-r 
                from-transparent 
                via-white/30 
                to-transparent 
                skew-x-12
                transform
                transition-transform
                duration-1000
                ease-in-out
                ${animateNeon ? 'translate-x-[300%]' : 'translate-x-0'}
              `}
            ></div>
          </div>
        </button>
      </div>

      {/* Welcome text */}
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <h1 className="text-5xl font-extrabold text-center mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-red-500 to-yellow-500">
            VEGAS SLOTS
          </span>
        </h1>
        <p className="text-center text-white text-xl">Try your luck at the slots!</p>
      </div>
    </div>
  );
};

export default StartButton;