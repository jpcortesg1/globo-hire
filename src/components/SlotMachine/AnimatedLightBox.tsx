"use client";
import { useGame } from "@/context/GameContext";
import { useState, useEffect, useRef, ReactNode, useMemo, useCallback } from "react";

/**
 * AnimatedLightBox Component
 * 
 * A dynamic container that creates a casino-style light box effect with animated LED lights
 * around its border. The lights animate faster during spinning and create a vibrant,
 * attention-grabbing effect.
 * 
 * Features:
 * - Responsive LED light grid that adapts to container size
 * - Dynamic light animation with configurable speed and colors
 * - Optimized performance using refs and memoization
 * - Smooth transitions between spinning and idle states
 */

interface AnimatedLightBoxProps {
  children: ReactNode;
  lightSize?: number;      // Size of each LED light in pixels
  lightSpacing?: number;   // Space between lights in pixels
  lightColors?: string[];  // Array of Tailwind color classes for lights
}

const AnimatedLightBox = ({
  children,
  lightSize = 8,
  lightSpacing = 12,
  lightColors = ["bg-yellow-400", "bg-red-500", "bg-blue-500", "bg-green-500"],
}: AnimatedLightBoxProps) => {
  // Container reference for calculating light positions
  const containerRef = useRef<HTMLDivElement>(null);
  
  // State for tracking the number of lights on each side
  const [lights, setLights] = useState<{ top: number, right: number, bottom: number, left: number }>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });

  // External spinning state from game context
  const { spinning: externalSpinning } = useGame();
  
  // Internal spinning state for animation control
  const [internalSpinning, setInternalSpinning] = useState(false);
  
  // Refs for managing timers and animation
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const animationTimeRef = useRef(0);
  const animationFrameRef = useRef<number>(0);
  const lightsRefs = useRef<HTMLDivElement[]>([]);

  // Memoized total number of lights
  const totalLights = useMemo(() => 
    lights.top + lights.right + lights.bottom + lights.left, 
    [lights]
  );

  // Memoized arrays for each side's lights
  const lightArrays = useMemo(() => ({
    top: Array.from({ length: lights.top }, (_, i) => i),
    right: Array.from({ length: lights.right }, (_, i) => i),
    bottom: Array.from({ length: lights.bottom }, (_, i) => i),
    left: Array.from({ length: lights.left }, (_, i) => i)
  }), [lights]);

  // Memoized RGB color mapping for light effects
  const rgbColors = useMemo(() => {
    const colorMap: Record<string, string> = {
      'yellow-400': 'rgb(250 204 21)',
      'red-500': 'rgb(239 68 68)',
      'blue-500': 'rgb(59 130 246)',
      'green-500': 'rgb(34 197 94)'
    };
    return lightColors.map(color => colorMap[color.replace('bg-', '')] || colorMap['green-500']);
  }, [lightColors]);

  /**
   * Determines if a light should be active based on its position and current animation time
   * @param globalIndex - The light's position in the sequence
   * @param animationTime - Current animation time
   * @returns boolean indicating if the light should be active
   */
  const isLightActive = useCallback((globalIndex: number, animationTime: number) => {
    const speed = internalSpinning ? 1.5 : 0.5;
    const cyclePosition = (animationTime * speed) % totalLights;
    const activeLightCount = internalSpinning ? 5 : 3;
    
    return (
      (globalIndex <= cyclePosition && globalIndex > cyclePosition - activeLightCount) ||
      (cyclePosition < activeLightCount && globalIndex > totalLights + cyclePosition - activeLightCount)
    );
  }, [internalSpinning, totalLights]);

  /**
   * Updates light states without causing re-renders
   * Uses direct DOM manipulation for better performance
   */
  const updateLights = useCallback(() => {
    if (lightsRefs.current.length === 0) return;

    lightsRefs.current.forEach((lightRef, index) => {
      if (!lightRef) return;
      
      const isActive = isLightActive(index, animationTimeRef.current);
      const colorIndex = index % lightColors.length;
      const lightColor = lightColors[colorIndex];
      const rgbColor = rgbColors[colorIndex];

      // Update classes and styles directly
      if (isActive) {
        lightRef.className = lightRef.className.replace('bg-gray-800', lightColor).replace('opacity-40', 'opacity-100');
        lightRef.style.boxShadow = `0 0 ${internalSpinning ? '12px' : '8px'} 2px ${rgbColor}`;
      } else {
        lightRef.className = lightRef.className.replace(lightColor, 'bg-gray-800').replace('opacity-100', 'opacity-40');
        lightRef.style.boxShadow = 'none';
      }
    });
  }, [isLightActive, lightColors, rgbColors, internalSpinning]);

  /**
   * Manages internal spinning state
   * Ensures animation lasts exactly 3 seconds regardless of external state changes
   */
  useEffect(() => {
    if (externalSpinning) {
      setInternalSpinning(true);
      startTimeRef.current = Date.now();
      
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        const elapsedTime = Date.now() - (startTimeRef.current || 0);
        if (elapsedTime >= 3000) {
          setInternalSpinning(false);
        }
      }, 3000);
    } else {
      const elapsedTime = startTimeRef.current ? Date.now() - startTimeRef.current : 0;
      const remainingTime = Math.max(0, 3000 - elapsedTime);
      
      if (remainingTime > 0) {
        setTimeout(() => {
          setInternalSpinning(false);
        }, remainingTime);
      } else {
        setInternalSpinning(false);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [externalSpinning]);

  /**
   * Calculates the number of lights that fit on each side of the container
   * Updates on container resize
   */
  const calculateLights = useCallback(() => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const topLights = Math.floor(width / lightSpacing);
    const rightLights = Math.floor(height / lightSpacing);
    const bottomLights = Math.floor(width / lightSpacing);
    const leftLights = Math.floor(height / lightSpacing);

    setLights({ top: topLights, right: rightLights, bottom: bottomLights, left: leftLights });
  }, [lightSpacing]);

  // Initialize and handle resize
  useEffect(() => {
    calculateLights();
    window.addEventListener("resize", calculateLights);
    return () => window.removeEventListener("resize", calculateLights);
  }, [calculateLights]);

  /**
   * Main animation loop
   * Updates light states on each frame
   */
  useEffect(() => {
    const animate = () => {
      animationTimeRef.current += (internalSpinning ? 3 : 1);
      updateLights();
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [internalSpinning, updateLights]);

  /**
   * Creates a light element with proper positioning and styling
   * @param side - Which side the light belongs to
   * @param index - Position in the side's sequence
   * @param globalIndex - Position in the overall sequence
   * @param style - CSS styles for positioning
   * @param isReversed - Whether to reverse the color sequence
   */
  const createLight = useCallback((
    side: string, 
    index: number, 
    globalIndex: number, 
    style: React.CSSProperties
  ) => {
    return (
      <div
        key={`${side}-${index}`}
        ref={(el) => {
          if (el) lightsRefs.current[globalIndex] = el;
        }}
        className={`absolute rounded-full transition-opacity duration-150 bg-gray-800 opacity-40`}
        style={{
          width: lightSize,
          height: lightSize,
          ...style
        }}
      />
    );
  }, [lightSize]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        padding: `${lightSize + 4}px`,
      }}
    >
      {/* Top lights */}
      {lightArrays.top.map((_, index) => 
        createLight('top', index, index, {
          top: 0,
          left: `${(index * lightSpacing) + (lightSpacing / 2)}px`,
          transform: "translateY(-50%)",
        })
      )}

      {/* Right lights */}
      {lightArrays.right.map((_, index) => 
        createLight('right', index, lights.top + index, {
          right: 0,
          top: `${(index * lightSpacing) + (lightSpacing / 2)}px`,
          transform: "translateX(50%)",
        })
      )}

      {/* Bottom lights */}
      {lightArrays.bottom.map((_, index) => 
        createLight('bottom', index, lights.top + lights.right + index, {
          bottom: 0,
          right: `${(index * lightSpacing) + (lightSpacing / 2)}px`,
          transform: "translateY(50%)",
        })
      )}

      {/* Left lights */}
      {lightArrays.left.map((_, index) => 
        createLight('left', index, lights.top + lights.right + lights.bottom + index, {
          left: 0,
          bottom: `${(index * lightSpacing) + (lightSpacing / 2)}px`,
          transform: "translateX(-50%)",
        })
      )}

      {/* Content container with dynamic border and effects */}
      <div 
        className={`
          relative 
          bg-black 
          border 
          ${internalSpinning ? 'border-yellow-600' : 'border-gray-800'} 
          rounded-lg 
          overflow-visible 
          p-4
          ${internalSpinning ? 'shadow-inner shadow-yellow-900/30' : ''}
          transition-all duration-300
        `}
      >
        {/* Vibrating effect during spinning */}
        {internalSpinning && (
          <div className="absolute inset-0 opacity-30 bg-gradient-to-t from-yellow-900/20 to-transparent pointer-events-none animate-pulse-fast"></div>
        )}
        {children}
      </div>
    </div>
  );
};

export default AnimatedLightBox;