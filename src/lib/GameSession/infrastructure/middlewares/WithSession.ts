import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { sign, verify } from 'jsonwebtoken';

// Secret key for signing and verifying session tokens.
const TOKEN_SECRET = process.env.TOKEN_SECRET || 'development-secret-key-min-32-chars-long';
// Name of the cookie used to store the session token.
const COOKIE_NAME = 'slot-machine-session';

/**
 * Middleware to wrap API route handlers with session management.
 * Adds getSessionId and setSessionId methods to the request object for handling session tokens via cookies.
 * @param handler The API route handler to wrap.
 */
export function withSessionRoute(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {    
    // Attach a method to retrieve the session ID from the cookie.
    req.getSessionId = () => {      
      const cookies = req.cookies;
      const sessionCookie = cookies[COOKIE_NAME];
      
      if (!sessionCookie) {
        return null;
      }
      
      try {        
        // Verify and decode the session token.
        const decoded = verify(sessionCookie, TOKEN_SECRET) as { sessionId: string };
        return decoded.sessionId;
      } catch (error) {        
        console.error('Error verifying session token:', error);
        return null;
      }
    };
        
    // Attach a method to set the session ID in a cookie.
    req.setSessionId = (sessionId: string) => {      
      const token = sign({ sessionId }, TOKEN_SECRET, { expiresIn: '24h' });
            
      const cookie = serialize(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, 
        path: '/',
      });
            
      res.setHeader('Set-Cookie', cookie);
    };
        
    return handler(req, res);
  };
}

// Type augmentation for Next.js API requests to include session helpers.
declare module 'next' {
  interface NextApiRequest {
    getSessionId: () => string | null;
    setSessionId: (sessionId: string) => void;
  }
}