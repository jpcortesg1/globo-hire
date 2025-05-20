"use client";
import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { createSession, getSessionStatus, cashOut, rollSlots, ApiResponse, Session } from '../utils/api';

/**
 * GameContextType defines the shape of the game context
 * Provides access to game state and actions throughout the application
 */
interface GameContextType {
  session: Session | null;
  credits: number;
  loading: boolean;
  error: string | null;
  gameActive: boolean;
  symbols: string[];
  spinning: boolean;
  startGame: () => Promise<void>;
  updateSession: () => Promise<Session | null>;
  endSession: (message?: string) => Promise<void>;
  performCashOut: () => Promise<number>;
  performRoll: () => Promise<ApiResponse>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

/**
 * GameProvider component manages the global game state and provides game-related functionality
 * to all child components through React Context.
 */
export function GameProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gameActive, setGameActive] = useState(false);
  const [symbols, setSymbols] = useState<string[]>(['', '', '']);
  const [spinning, setSpinning] = useState(false);

  // Check for existing active session on load
  useEffect(() => {
    const checkExistingSession = async () => {
      setLoading(true);
      try {
        const status: ApiResponse = await getSessionStatus();
        if (status.success && status.status && status.status.isActive) {
          setSession(status.status);
          setCredits(status.status.credits);
          setGameActive(true);
        }
      } catch (err) {
        // No active session, stay in initial state
      } finally {
        setLoading(false);
      }
    };

    checkExistingSession();
  }, []);

  /**
   * Starts a new game session
   * Creates a new session and initializes game state
   */
  const startGame = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const newSession: ApiResponse = await createSession();
      if (newSession.success && newSession.session) {
        setSession(newSession.session);
        setCredits(newSession.session.credits);
        setGameActive(true);
      } else {
        setError(newSession.error || 'Failed to create game session');
      }
    } catch (err) {
      setError('Network error creating session');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Updates the current session state
   * Returns the updated session or null if update fails
   */
  const updateSession = async (): Promise<Session | null> => {
    try {
      const status: ApiResponse = await getSessionStatus();
      if (status.success && status.status) {
        setSession(status.status);
        setCredits(status.status.credits);

        // End session if credits reach zero
        if (status.status.credits <= 0) {
          await endSession('Game over! You ran out of credits.');
        }

        return status.status;
      } else {
        setError(status.error || 'Failed to update session');
        return null;
      }
    } catch (err) {
      setError('Network error updating session');
      return null;
    }
  };

  /**
   * Ends the current game session
   * Resets all game state and optionally displays a message
   */
  const endSession = async (message?: string): Promise<void> => {
    if (message) {
      alert(message);
    }
    setSession(null);
    setCredits(0);
    setGameActive(false);
  };

  /**
   * Performs a cash out operation
   * Returns the amount of credits cashed out
   */
  const performCashOut = async (): Promise<number> => {
    try {
      const result = await cashOut();
      if (result.success) {
        const cashedOutCredits = result.credits || 0;
        await endSession(`You cashed out ${cashedOutCredits} credits!`);
        return cashedOutCredits;
      } else {
        setError(result.error || 'Failed to cash out');
        return 0;
      }
    } catch (err) {
      setError('Network error during cash out');
      return 0;
    }
  };

  /**
   * Performs a slot machine roll
   * Handles the roll animation sequence and updates game state
   */
  const performRoll = async (): Promise<ApiResponse> => {
    if (!session || credits < 1) {
      return {
        success: false,
        error: 'No active session or insufficient credits'
      };
    }

    try {
      // Start spinning animation
      setSpinning(true);
      setSymbols(['', '', '']);

      // Call roll API
      const result = await rollSlots();

      if (result.success) {
        // Show symbols sequentially
        setTimeout(() => setSymbols([result.result.symbols[0], '', '']), 1000);
        setTimeout(() => setSymbols([result.result.symbols[0], result.result.symbols[1], '']), 2000);
        setTimeout(() => {
          setSymbols(result.result.symbols);

          // Update session with new credits
          updateSession();

          // Stop spinning after additional delay
          setTimeout(() => {
            setSpinning(false);
          }, 1000);
        }, 3000);
      } else {
        // Stop spinning immediately on error
        setSpinning(false);
      }

      return result;
    } catch (err) {
      setError('Network error during roll');
      setSpinning(false);
      return {
        success: false,
        error: 'Network error during roll'
      };
    }
  };

  return (
    <GameContext.Provider
      value={{
        session,
        credits,
        loading,
        error,
        gameActive,
        symbols,
        spinning,
        startGame,
        updateSession,
        endSession,
        performCashOut,
        performRoll
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

/**
 * Custom hook to access the game context
 * @throws Error if used outside of GameProvider
 */
export function useGame() {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
}