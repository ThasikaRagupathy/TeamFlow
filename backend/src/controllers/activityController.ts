import { Request, Response, NextFunction } from 'express';
import { Activity } from '../models/Activity';

export const getProjectActivities = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = req.project!;
    const { page = '1', limit = '20' } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 20);
    const skip = (pageNum - 1) * limitNum;

    const [activities, total] = await Promise.all([
      Activity.find({ project: project._id })
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Activity.countDocuments({ project: project._id }),
    ]);

    res.status(200).json({
      activities,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      limit: limitNum,
    });
  } catch (error) {
    next(error);
  }
};
