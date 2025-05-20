/**
 * Utility functions for interacting with Slot Machine API endpoints.
 * Each function returns a typed response and handles errors gracefully.
 */

// --- Types ---
export interface Session {
  id: string;
  credits: number;
  createdAt: string;
  lastUpdated: string;
  gameHistory: any[];
  isActive: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  session?: Session;
  status?: Session;
  result?: any;
  credits?: number;
  message?: string;
  error?: string;
  [key: string]: any;
}

/**
 * Creates a new game session.
 * @returns ApiResponse with session data or error.
 */
export const createSession = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch('/api/session/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Failed to create session.' };
  }
};

/**
 * Gets the current session status.
 * @returns ApiResponse with session status or error.
 */
export const getSessionStatus = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch('/api/session/status');
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Failed to get session status.' };
  }
};

/**
 * Rolls the slot machine for the current session.
 * @returns ApiResponse with roll result or error.
 */
export const rollSlots = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch('/api/game/roll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Failed to roll slots.' };
  }
};

/**
 * Cashes out the current session.
 * @returns ApiResponse with credits or error.
 */
export const cashOut = async (): Promise<ApiResponse> => {
  try {
    const response = await fetch('/api/session/cashout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Failed to cash out.' };
  }
};