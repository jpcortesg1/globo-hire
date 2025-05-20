"use client";
import { useState, useEffect, useRef, ReactNode } from "react";

/**
 * Props interface for the AnimatedLightBox component
 * @property children - The content to be displayed inside the light box
 * @property lightSize - Size of each light in pixels (default: 8)
 * @property lightSpacing - Space between lights in pixels (default: 12)
 * @property animationDuration - Duration of a complete animation cycle in milliseconds (default: 5000)
 * @property lightColors - Array of colors for the lights (default: yellow, red, blue, green)
 */
interface AnimatedLightBoxProps {
  children: ReactNode;
  lightSize?: number;
  lightSpacing?: number;
  animationDuration?: number;
  lightColors?: string[];
}

/**
 * AnimatedLightBox component creates a decorative border of animated lights around its children.
 * The lights animate in sequence, creating a casino-like effect with customizable colors and timing.
 */
const AnimatedLightBox = ({
  children,
  lightSize = 8,
  lightSpacing = 12,
  animationDuration = 5000,
  lightColors = ["bg-yellow-400", "bg-red-500", "bg-blue-500", "bg-green-500"]
}: AnimatedLightBoxProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lights, setLights] = useState<{ top: number, right: number, bottom: number, left: number }>({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Calculate number of lights based on container size
  useEffect(() => {
    const calculateLights = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      setContainerSize({ width, height });

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

  /**
   * Determines if a light should be active based on its index and current time
   * Creates a pattern where 3 consecutive lights are active at any time
   */
  const isLightActive = (globalIndex: number, currentTime: number) => {
    const cyclePosition = (currentTime % animationDuration) / animationDuration;
    const activePosition = (cyclePosition * totalLights) % totalLights;

    return (
      (globalIndex <= activePosition && globalIndex > activePosition - 3) ||
      (activePosition < 3 && globalIndex > totalLights + activePosition - 3)
    );
  };

  // Animation state
  const [time, setTime] = useState(Date.now());

  // Update time for animation
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now());
    }, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, []);

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
        const isActive = isLightActive(globalIndex, time);
        return (
          <div
            key={`top-${index}`}
            className={`absolute rounded-full transition-all duration-300 ${isActive ? lightColors[index % lightColors.length] : "bg-gray-800"
              } ${isActive ? "opacity-100" : "opacity-40"}`}
            style={{
              width: lightSize,
              height: lightSize,
              top: 0,
              left: `${(index * lightSpacing) + (lightSpacing / 2)}px`,
              transform: "translateY(-50%)",
              boxShadow: isActive ? `0 0 8px 2px ${lightColors[index % lightColors.length].replace('bg-', 'rgb-')}` : "none",
            }}
          />
        );
      })}

      {/* Right lights */}
      {rightLightsArray.map((_, index) => {
        const globalIndex = lights.top + index;
        const isActive = isLightActive(globalIndex, time);
        return (
          <div
            key={`right-${index}`}
            className={`absolute rounded-full transition-all duration-300 ${isActive ? lightColors[index % lightColors.length] : "bg-gray-800"
              } ${isActive ? "opacity-100" : "opacity-40"}`}
            style={{
              width: lightSize,
              height: lightSize,
              right: 0,
              top: `${(index * lightSpacing) + (lightSpacing / 2)}px`,
              transform: "translateX(50%)",
              boxShadow: isActive ? `0 0 8px 2px ${lightColors[index % lightColors.length].replace('bg-', 'rgb-')}` : "none",
            }}
          />
        );
      })}

      {/* Bottom lights (right to left) */}
      {bottomLightsArray.map((_, index) => {
        const reversedIndex = bottomLightsArray.length - 1 - index;
        const globalIndex = lights.top + lights.right + index;
        const isActive = isLightActive(globalIndex, time);
        return (
          <div
            key={`bottom-${index}`}
            className={`absolute rounded-full transition-all duration-300 ${isActive ? lightColors[reversedIndex % lightColors.length] : "bg-gray-800"
              } ${isActive ? "opacity-100" : "opacity-40"}`}
            style={{
              width: lightSize,
              height: lightSize,
              bottom: 0,
              right: `${(index * lightSpacing) + (lightSpacing / 2)}px`,
              transform: "translateY(50%)",
              boxShadow: isActive ? `0 0 8px 2px ${lightColors[reversedIndex % lightColors.length].replace('bg-', 'rgb-')}` : "none",
            }}
          />
        );
      })}

      {/* Left lights (bottom to top) */}
      {leftLightsArray.map((_, index) => {
        const reversedIndex = leftLightsArray.length - 1 - index;
        const globalIndex = lights.top + lights.right + lights.bottom + index;
        const isActive = isLightActive(globalIndex, time);
        return (
          <div
            key={`left-${index}`}
            className={`absolute rounded-full transition-all duration-300 ${isActive ? lightColors[reversedIndex % lightColors.length] : "bg-gray-800"
              } ${isActive ? "opacity-100" : "opacity-40"}`}
            style={{
              width: lightSize,
              height: lightSize,
              left: 0,
              bottom: `${(index * lightSpacing) + (lightSpacing / 2)}px`,
              transform: "translateX(-50%)",
              boxShadow: isActive ? `0 0 8px 2px ${lightColors[reversedIndex % lightColors.length].replace('bg-', 'rgb-')}` : "none",
            }}
          />
        );
      })}

      {/* Content container */}
      <div className="relative bg-black border border-gray-800 rounded-lg overflow-hidden p-4">
        {children}
      </div>
    </div>
  );
};

export default AnimatedLightBox;