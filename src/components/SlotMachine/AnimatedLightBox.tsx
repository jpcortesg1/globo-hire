"use client";
import { useGame } from "@/context/GameContext";
import { useState, useEffect, useRef, ReactNode } from "react";

interface AnimatedLightBoxProps {
  children: ReactNode;
  lightSize?: number;
  lightSpacing?: number;
  lightColors?: string[];
}

const AnimatedLightBox = ({
  children,
  lightSize = 8,
  lightSpacing = 12,
  lightColors = ["bg-yellow-400", "bg-red-500", "bg-blue-500", "bg-green-500"],
}: AnimatedLightBoxProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lights, setLights] = useState<{ top: number, right: number, bottom: number, left: number }>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });
  const { spinning } = useGame();
  
  // Time tracking for animation
  const [animationTime, setAnimationTime] = useState(0);
  
  // Calculate number of lights based on container size
  useEffect(() => {
    const calculateLights = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      // Calculate how many lights fit on each side
      const topLights = Math.floor(width / lightSpacing);
      const rightLights = Math.floor(height / lightSpacing);
      const bottomLights = Math.floor(width / lightSpacing);
      const leftLights = Math.floor(height / lightSpacing);

      setLights({ top: topLights, right: rightLights, bottom: bottomLights, left: leftLights });
    };

    // Initial calculation
    calculateLights();

    // Recalculate on window resize
    window.addEventListener("resize", calculateLights);
    return () => window.removeEventListener("resize", calculateLights);
  }, [lightSpacing]);

  // Create arrays of lights for each side
  const topLightsArray = Array.from({ length: lights.top }, (_, i) => i);
  const rightLightsArray = Array.from({ length: lights.right }, (_, i) => i);
  const bottomLightsArray = Array.from({ length: lights.bottom }, (_, i) => i);
  const leftLightsArray = Array.from({ length: lights.left }, (_, i) => i);

  // Calculate total number of lights for animation
  const totalLights = lights.top + lights.right + lights.bottom + lights.left;

  // Animation logic
  useEffect(() => {
    let frameId: number;
    
    const animate = () => {
      // Use a predictable incrementing time value instead of absolute time
      setAnimationTime(prev => prev + (spinning ? 3 : 1));
      
      frameId = requestAnimationFrame(animate);
    };
    
    frameId = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [spinning]);

  // Simplify the light active detection logic
  const isLightActive = (globalIndex: number) => {
    const speed = spinning ? 1.5 : 0.5;
    const cyclePosition = (animationTime * speed) % totalLights;
    const activeLightCount = spinning ? 5 : 3;
    
    // Check if this light should be active in the current animation frame
    return (
      // Light is within the active range in the current position
      (globalIndex <= cyclePosition && globalIndex > cyclePosition - activeLightCount) ||
      // Handle wrap-around case at the beginning of the array
      (cyclePosition < activeLightCount && globalIndex > totalLights + cyclePosition - activeLightCount)
    );
  };

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        padding: `${lightSize + 4}px`,
      }}
    >
      {/* Top lights */}
      {topLightsArray.map((_, index) => {
        const globalIndex = index;
        const isActive = isLightActive(globalIndex);
        const lightColor = lightColors[index % lightColors.length];
        const rgbColor = lightColor.replace('bg-', '');
        
        return (
          <div
            key={`top-${index}`}
            className={`
              absolute 
              rounded-full 
              transition-opacity 
              duration-150
              ${isActive ? lightColor : "bg-gray-800"}
              ${isActive ? "opacity-100" : "opacity-40"}
            `}
            style={{
              width: lightSize,
              height: lightSize,
              top: 0,
              left: `${(index * lightSpacing) + (lightSpacing / 2)}px`,
              transform: "translateY(-50%)",
              boxShadow: isActive 
                ? `0 0 ${spinning ? '12px' : '8px'} 2px ${rgbColor === 'yellow-400' ? 'rgb(250 204 21)' : 
                   rgbColor === 'red-500' ? 'rgb(239 68 68)' : 
                   rgbColor === 'blue-500' ? 'rgb(59 130 246)' : 
                   'rgb(34 197 94)'}`
                : "none",
            }}
          />
        );
      })}

      {/* Right lights */}
      {rightLightsArray.map((_, index) => {
        const globalIndex = lights.top + index;
        const isActive = isLightActive(globalIndex);
        const lightColor = lightColors[index % lightColors.length];
        const rgbColor = lightColor.replace('bg-', '');
        
        return (
          <div
            key={`right-${index}`}
            className={`
              absolute 
              rounded-full 
              transition-opacity 
              duration-150
              ${isActive ? lightColor : "bg-gray-800"}
              ${isActive ? "opacity-100" : "opacity-40"}
            `}
            style={{
              width: lightSize,
              height: lightSize,
              right: 0,
              top: `${(index * lightSpacing) + (lightSpacing / 2)}px`,
              transform: "translateX(50%)",
              boxShadow: isActive 
                ? `0 0 ${spinning ? '12px' : '8px'} 2px ${rgbColor === 'yellow-400' ? 'rgb(250 204 21)' : 
                   rgbColor === 'red-500' ? 'rgb(239 68 68)' : 
                   rgbColor === 'blue-500' ? 'rgb(59 130 246)' : 
                   'rgb(34 197 94)'}`
                : "none",
            }}
          />
        );
      })}

      {/* Bottom lights */}
      {bottomLightsArray.map((_, index) => {
        const reversedIndex = bottomLightsArray.length - 1 - index;
        const globalIndex = lights.top + lights.right + index;
        const isActive = isLightActive(globalIndex);
        const lightColor = lightColors[reversedIndex % lightColors.length];
        const rgbColor = lightColor.replace('bg-', '');
        
        return (
          <div
            key={`bottom-${index}`}
            className={`
              absolute 
              rounded-full 
              transition-opacity 
              duration-150
              ${isActive ? lightColor : "bg-gray-800"}
              ${isActive ? "opacity-100" : "opacity-40"}
            `}
            style={{
              width: lightSize,
              height: lightSize,
              bottom: 0,
              right: `${(index * lightSpacing) + (lightSpacing / 2)}px`,
              transform: "translateY(50%)",
              boxShadow: isActive 
                ? `0 0 ${spinning ? '12px' : '8px'} 2px ${rgbColor === 'yellow-400' ? 'rgb(250 204 21)' : 
                   rgbColor === 'red-500' ? 'rgb(239 68 68)' : 
                   rgbColor === 'blue-500' ? 'rgb(59 130 246)' : 
                   'rgb(34 197 94)'}`
                : "none",
            }}
          />
        );
      })}

      {/* Left lights */}
      {leftLightsArray.map((_, index) => {
        const reversedIndex = leftLightsArray.length - 1 - index;
        const globalIndex = lights.top + lights.right + lights.bottom + index;
        const isActive = isLightActive(globalIndex);
        const lightColor = lightColors[reversedIndex % lightColors.length];
        const rgbColor = lightColor.replace('bg-', '');
        
        return (
          <div
            key={`left-${index}`}
            className={`
              absolute 
              rounded-full 
              transition-opacity 
              duration-150
              ${isActive ? lightColor : "bg-gray-800"}
              ${isActive ? "opacity-100" : "opacity-40"}
            `}
            style={{
              width: lightSize,
              height: lightSize,
              left: 0,
              bottom: `${(index * lightSpacing) + (lightSpacing / 2)}px`,
              transform: "translateX(-50%)",
              boxShadow: isActive 
                ? `0 0 ${spinning ? '12px' : '8px'} 2px ${rgbColor === 'yellow-400' ? 'rgb(250 204 21)' : 
                   rgbColor === 'red-500' ? 'rgb(239 68 68)' : 
                   rgbColor === 'blue-500' ? 'rgb(59 130 246)' : 
                   'rgb(34 197 94)'}`
                : "none",
            }}
          />
        );
      })}

      {/* Content container */}
      <div 
        className={`
          relative 
          bg-black 
          border 
          ${spinning ? 'border-yellow-600' : 'border-gray-800'} 
          rounded-lg 
          overflow-hidden 
          p-4
          ${spinning ? 'shadow-inner shadow-yellow-900/30' : ''}
          transition-all duration-300
        `}
      >
        {/* Vibrating effect during spinning */}
        {spinning && (
          <div className="absolute inset-0 opacity-30 bg-gradient-to-t from-yellow-900/20 to-transparent pointer-events-none animate-pulse-fast"></div>
        )}
        {children}
      </div>
    </div>
  );
};

export default AnimatedLightBox;