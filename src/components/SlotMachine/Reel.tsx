"use client";
import { useGame } from '@/context/GameContext';
import { useState, useEffect, useRef } from 'react';

/**
 * Symbol mapping for the slot machine
 * Maps character codes to emoji symbols
 */
const symbolMap: Record<string, string> = {
  'C': '🍒', // Cherry
  'L': '🍋', // Lemon
  'O': '🍊', // Orange
  'W': '🍉', // Watermelon
};

/**
 * Props for the Reel component
 * @property symbol - The symbol to display when stopped
 * @property spinning - Whether the reel is currently spinning
 * @property delay - Delay in ms before the reel stops
 * @property onStop - Callback function when the reel stops spinning
 */
interface ReelProps {
  symbol: string;
  delay: number;
  onStop?: () => void;
}

/**
 * Reel component represents a single slot machine reel
 * Handles spinning animation and symbol display
 */
const Reel = ({ symbol, delay, onStop }: ReelProps) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const stopCalledRef = useRef(false);
  const { spinning } = useGame();
  const prevSpinningRef = useRef(spinning);

  useEffect(() => {
    const spinningChanged = prevSpinningRef.current && !spinning;
    prevSpinningRef.current = spinning;

    if (spinning) {
      setIsSpinning(true);
      stopCalledRef.current = false;
    }
    else if (spinningChanged) {
      const timer = setTimeout(() => {
        setIsSpinning(false);
        if (onStop && !stopCalledRef.current) {
          stopCalledRef.current = true;
          onStop();
        }
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [spinning, delay, onStop]);

  return (
    <div className={`
      relative
      w-28 h-28
      mx-2
      rounded-lg
      overflow-hidden
      border-4
      ${isSpinning ? 'border-yellow-400 shadow-[0_0_15px_rgba(255,215,0,0.7)]' : 'border-gray-700'}
      transition-all duration-300
      bg-gradient-to-b from-gray-800 to-gray-900
    `}>
      {/* Top reflection */}
      <div className="absolute top-0 left-0 right-0 h-1/4 bg-gradient-to-b from-white/10 to-transparent z-10"></div>

      {/* Reel content */}
      {isSpinning ? (
        <>
          {/* Blur effect during spin */}
          <div className="absolute inset-0 bg-gray-800/50 backdrop-blur-sm z-0"></div>

          {/* Spinning symbols container */}
          <div className="relative h-full w-full overflow-hidden">
            <div className={`
              absolute top-0 left-0 right-0
              flex flex-col items-center
              animate-spinReel
            `}>
              {/* Repeat symbols multiple times to create continuous reel illusion */}
              {[...Array(10)].map((_, outerIdx) => (
                <div key={outerIdx} className="w-full">
                  {Object.values(symbolMap).map((s, i) => (
                    <div
                      key={`${outerIdx}-${i}`}
                      className="flex items-center justify-center h-28 text-5xl"
                    >
                      {s}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Scanning lines for visual effect */}
          <div className="absolute inset-x-0 top-0 h-[1px] bg-white/20 z-20"></div>
          <div className="absolute inset-x-0 bottom-0 h-[1px] bg-white/20 z-20"></div>
        </>
      ) : (
        <>
          {/* Static symbol when not spinning */}
          <div className={`
            flex items-center justify-center
            h-full w-full
            text-5xl
            ${symbol ? 'animate-symbolAppear' : ''}
          `}>
            {symbol ? symbolMap[symbol] || symbol : '?'}
          </div>

          {/* Glow effect when stopped on a symbol */}
          {symbol && (
            <div className="absolute inset-0 bg-white/10 animate-symbolGlow rounded-md z-0"></div>
          )}
        </>
      )}
    </div>
  );
};

export default Reel;