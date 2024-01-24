import type { Request, Response, NextFunction } from 'express';
import { user } from './utils';

type AuthenticatedRequest = Request & {
  isAuthenticated?: boolean;
};

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(404);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
}

export function isAuthenticated(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const sessionId = req.headers.cookie?.split('=')[1];
    const session = user.findUserBySessionId(sessionId);
    if (!session) {
      res.status(404);
      throw new Error('Unauthorized');
    }
    if (Date.now() > session.idleExpiresAt.getTime()) {
      user.removeSessionForUser(session.sessionId);
      res.status(404);
      throw new Error('Unauthorized');
    }
    if (Date.now() > session.activeExpiresAt.getTime()) {
      user.updateSessionForUser(session.sessionId);
    }
    next();
  } catch (error) {
    next(error);
  }
}
