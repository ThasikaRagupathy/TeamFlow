import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Session } from '../models/Session';

import crypto from 'crypto';

const generateTokenAndSession = async (user: any): Promise<{ token: string; expiresAt: Date }> => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_dev_mode';
  const expiresInDays = 7;
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);

  const token = jwt.sign(
    {
      userId: user._id.toString(),
      email: user.email,
      jti: crypto.randomUUID(), // Guarantee uniqueness across fast successive logins
    },
    secret,
    { expiresIn: `${expiresInDays}d` }
  );

  await Session.create({
    userId: user._id,
    token,
    isActive: true,
    expiresAt,
  });

  return { token, expiresAt };
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: 'A user with this email already exists' });
      return;
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    const { token } = await generateTokenAndSession(user);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const { token } = await generateTokenAndSession(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (req.sessionDoc) {
      req.sessionDoc.isActive = false;
      await req.sessionDoc.save();
    } else if (req.token) {
      await Session.updateOne({ token: req.token }, { isActive: false });
    }

    res.status(200).json({ message: 'Logged out successfully. Session invalidated.' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    res.status(200).json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};
