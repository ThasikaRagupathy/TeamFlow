import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import { Project } from '../models/Project';

export const requireProjectAccess = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projectId = req.params.projectId || req.params.id;

    if (!projectId || !isValidObjectId(projectId)) {
      res.status(400).json({ message: 'Invalid or missing project ID' });
      return;
    }

    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const userIdStr = req.user._id.toString();
    const isOwner = project.owner.toString() === userIdStr;
    const isMember = project.members.some((m) => m.user.toString() === userIdStr);

    if (!isOwner && !isMember) {
      res.status(403).json({ message: 'Access denied: You are not a member of this project' });
      return;
    }

    req.project = project;
    req.projectRole = isOwner ? 'owner' : 'member';
    next();
  } catch (error) {
    next(error);
  }
};

export const requireProjectOwner = (req: Request, res: Response, next: NextFunction): void => {
  if (req.projectRole !== 'owner') {
    res.status(403).json({ message: 'Forbidden: Only the project owner can perform this action' });
    return;
  }
  next();
};
