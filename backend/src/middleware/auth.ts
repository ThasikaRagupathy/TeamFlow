import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { Session } from '../models/Session';

interface JwtPayload {
  userId: string;
  email: string;
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token: string | undefined;

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ message: 'Authentication required. No token provided.' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'fallback_secret_for_dev_mode';

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, secret) as JwtPayload;
    } catch (err: any) {
      if (err.name === 'TokenExpiredError') {
        res.status(401).json({ message: 'Session token has expired. Please log in again.' });
        return;
      }
      res.status(401).json({ message: 'Invalid authentication token.' });
      return;
    }

    // Check database session for revocation / logout validation
    const session = await Session.findOne({ token, isActive: true });
    if (!session) {
      res.status(401).json({ message: 'Session has been invalidated or logged out. Please log in again.' });
      return;
    }

    if (session.expiresAt && session.expiresAt.getTime() < Date.now()) {
      session.isActive = false;
      await session.save();
      res.status(401).json({ message: 'Session has expired. Please log in again.' });
      return;
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ message: 'Authenticated user no longer exists.' });
      return;
    }

    req.user = user;
    req.sessionDoc = session;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
};
