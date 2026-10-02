import { Request, Response, NextFunction } from 'express';
import { Task } from '../models/Task';
import { Activity } from '../models/Activity';

export const getProjectDashboard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = req.project!;
    const userId = req.user!._id;
    const now = new Date();

    // Aggregations and counts covering the entire project
    const [
      totalTasks,
      statusGroupAgg,
      overdueCount,
      assignedToMeTasks,
      recentActivities,
    ] = await Promise.all([
      // 1. Total tasks
      Task.countDocuments({ project: project._id }),

      // 2. Tasks grouped by status
      Task.aggregate([
        { $match: { project: project._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // 3. Overdue task count: dueDate < now and status != 'Done'
      Task.countDocuments({
        project: project._id,
        dueDate: { $lt: now },
        status: { $ne: 'Done' },
      }),

      // 4. Tasks assigned to current user
      Task.find({
        project: project._id,
        assignee: userId,
      })
        .populate('creator', 'name email')
        .sort({ dueDate: 1, createdAt: -1 }),

      // 5. Ten most recent activity entries
      Activity.find({ project: project._id })
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(10),
    ]);

    // Format status counts with defaults for all standard statuses
    const statusCounts: Record<string, number> = {
      Backlog: 0,
      'To Do': 0,
      'In Progress': 0,
      Done: 0,
    };
    statusGroupAgg.forEach((item: { _id: string; count: number }) => {
      if (item._id) {
        statusCounts[item._id] = item.count;
      }
    });

    res.status(200).json({
      project: {
        id: project._id,
        name: project.name,
        description: project.description,
      },
      dashboard: {
        totalTasks,
        tasksByStatus: statusCounts,
        overdueTasksCount: overdueCount,
        assignedToCurrentUserCount: assignedToMeTasks.length,
        assignedToCurrentUser: assignedToMeTasks,
        recentActivities,
      },
    });
  } catch (error) {
    next(error);
  }
};
