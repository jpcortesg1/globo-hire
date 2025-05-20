"use client";
import StartButton from "./StartButton";
import Credits from "./Credits";
import AnimatedLightBox from "./AnimatedLightBox";
import Controls from "./Controls";
import Reel from "./Reel";
import { useGame } from "@/context/GameContext";

/**
 * SlotMachine component is the main container for the slot machine game
 * Integrates all game components and manages their layout
 */
const SlotMachine = () => {
  const { symbols, spinning } = useGame();
  return (
    <>
      <StartButton />
      <div className="flex flex-col items-center justify-center gap-4 h-screen">
        <AnimatedLightBox>
          <Credits />
          {/* Reels container with sequential animation delays */}
          <div className="flex justify-center items-center my-6 bg-black/30 p-6 rounded-xl">
            <Reel symbol={symbols[0] || ''} spinning={spinning} delay={1000} />
            <Reel symbol={symbols[1] || ''} spinning={spinning} delay={2000} />
            <Reel symbol={symbols[2] || ''} spinning={spinning} delay={3000} />
          </div>
          <Controls />
        </AnimatedLightBox>
      </div>
    </>
  );
};

export default SlotMachine;