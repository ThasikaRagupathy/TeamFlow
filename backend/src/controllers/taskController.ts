import { Request, Response, NextFunction } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import { Task, TaskPriority, TaskStatus } from '../models/Task';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { Comment } from '../models/Comment';
import { logActivity } from '../services/activityService';

export const createTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = req.project!;
    const userId = req.user!._id;
    const { title, description, status, priority, assignee, dueDate } = req.body;

    // Check assignee permission: Only current project members can be assigned tasks
    if (assignee) {
      const isMember = project.members.some((m) => m.user.toString() === assignee);
      if (!isMember) {
        res.status(400).json({ message: 'Assignee must be a current member of the project' });
        return;
      }
    }

    const task = await Task.create({
      project: project._id,
      title,
      description: description || '',
      status: status || 'To Do',
      priority: priority || 'Medium',
      assignee: assignee || null,
      dueDate: dueDate ? new Date(dueDate) : null,
      creator: userId,
      version: 1,
    });

    // Populate creator and assignee
    const populated = await Task.findById(task._id)
      .populate('creator', 'name email')
      .populate('assignee', 'name email');

    // Log Activity
    await logActivity({
      project: project._id,
      task: task._id,
      taskTitle: task.title,
      user: userId,
      userName: req.user!.name,
      action: 'TASK_CREATED',
      details: {
        description: `Created task "${task.title}"`,
      },
    });

    res.status(201).json({
      message: 'Task created successfully',
      task: populated,
    });
  } catch (error) {
    next(error);
  }
};

export const getTasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = req.project!;
    const {
      search,
      status,
      priority,
      assignee,
      overdue,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = '1',
      limit = '10',
    } = req.query;

    const query: any = { project: project._id };

    // Search by title (server-side, case-insensitive)
    if (search && typeof search === 'string' && search.trim()) {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    // Status filter
    if (status && typeof status === 'string' && status !== 'all') {
      query.status = status;
    }

    // Priority filter
    if (priority && typeof priority === 'string' && priority !== 'all') {
      query.priority = priority;
    }

    // Assignee filter
    if (assignee && typeof assignee === 'string') {
      if (assignee === 'unassigned') {
        query.assignee = null;
      } else if (isValidObjectId(assignee)) {
        query.assignee = assignee;
      }
    }

    // Overdue filter: dueDate < now and status is not Done
    if (overdue === 'true') {
      query.dueDate = { $lt: new Date() };
      query.status = { $ne: 'Done' };
    }

    // Sorting
    const sortFieldMap: Record<string, string> = {
      createdAt: 'createdAt',
      dueDate: 'dueDate',
      priority: 'priority',
    };
    const sortField = sortFieldMap[sortBy as string] || 'createdAt';
    const direction = sortOrder === 'asc' ? 1 : -1;

    let sortOptions: any = {};
    if (sortField === 'priority') {
      // Map priority custom order if needed or alphabet
      sortOptions = { priority: direction, createdAt: -1 };
    } else {
      sortOptions = { [sortField]: direction };
    }

    const pageNum = Math.max(1, parseInt(page as string, 10) || 1);
    const limitNum = Math.max(1, parseInt(limit as string, 10) || 10);
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .populate('creator', 'name email')
        .populate('assignee', 'name email')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum),
      Task.countDocuments(query),
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    res.status(200).json({
      tasks,
      total,
      page: pageNum,
      totalPages,
      limit: limitNum,
    });
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { taskId } = req.params;

    if (!isValidObjectId(taskId)) {
      res.status(400).json({ message: 'Invalid task ID format' });
      return;
    }

    const task = await Task.findById(taskId)
      .populate('creator', 'name email')
      .populate('assignee', 'name email');

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Verify user has access to task's project
    const project = await Project.findById(task.project);
    if (!project) {
      res.status(404).json({ message: 'Associated project not found' });
      return;
    }

    const userIdStr = req.user!._id.toString();
    const isOwner = project.owner.toString() === userIdStr;
    const isMember = project.members.some((m) => m.user.toString() === userIdStr);

    if (!isOwner && !isMember) {
      res.status(403).json({ message: 'Access denied: You are not a member of this project' });
      return;
    }

    const comments = await Comment.find({ task: task._id })
      .populate('author', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json({
      task,
      comments,
      userRole: isOwner ? 'owner' : 'member',
      isCreator: task.creator._id.toString() === userIdStr,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { title, description, status, priority, assignee, dueDate, version } = req.body;

    if (!isValidObjectId(taskId)) {
      res.status(400).json({ message: 'Invalid task ID format' });
      return;
    }

    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const project = await Project.findById(task.project);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const userIdStr = req.user!._id.toString();
    const isOwner = project.owner.toString() === userIdStr;
    const isCreator = task.creator.toString() === userIdStr;
    const isMember = project.members.some((m) => m.user.toString() === userIdStr);

    if (!isOwner && !isMember) {
      res.status(403).json({ message: 'Access denied: You are not a member of this project' });
      return;
    }

    // Permission check:
    // Members can ONLY edit or delete tasks they created
    // However, ANY member can change any task's status
    const isChangingOtherFields =
      title !== undefined ||
      description !== undefined ||
      priority !== undefined ||
      dueDate !== undefined;

    if (isChangingOtherFields && !isOwner && !isCreator) {
      res.status(403).json({
        message: 'Forbidden: Members can only edit tasks they created',
      });
      return;
    }

    // Permission check: Only owner can assign or reassign tasks
    const isChangingAssignee = assignee !== undefined && String(task.assignee || '') !== String(assignee || '');
    if (isChangingAssignee && !isOwner) {
      res.status(403).json({
        message: 'Forbidden: Only project owners can assign or reassign tasks',
      });
      return;
    }

    // Assignee must be a project member if provided
    if (assignee) {
      const isAssigneeMember = project.members.some((m) => m.user.toString() === assignee);
      if (!isAssigneeMember) {
        res.status(400).json({ message: 'Assignee must be a current member of the project' });
        return;
      }
    }

    // OPTIMISTIC CONCURRENCY CONTROL (OCC)
    // If incoming version does not match database version, reject update
    if (version === undefined || version === null) {
      res.status(400).json({ message: 'Task version must be provided for concurrency control' });
      return;
    }

    if (task.version !== version) {
      const latestTask = await Task.findById(taskId)
        .populate('creator', 'name email')
        .populate('assignee', 'name email');

      res.status(409).json({
        message: 'Conflict: This task has been modified by another user. Please reload the latest task to view changes before editing.',
        currentVersion: task.version,
        latestTask,
      });
      return;
    }

    // Track changes for activity logs
    const activitiesToLog: any[] = [];

    // Status change check
    if (status !== undefined && status !== task.status) {
      activitiesToLog.push({
        action: 'STATUS_CHANGED',
        details: {
          previousValue: task.status,
          newValue: status,
          field: 'status',
          description: `Changed status from "${task.status}" to "${status}"`,
        },
      });
      task.status = status as TaskStatus;
    }

    // Assignee change check
    if (isChangingAssignee) {
      let prevAssigneeName = 'Unassigned';
      if (task.assignee) {
        const prevUser = await User.findById(task.assignee);
        if (prevUser) prevAssigneeName = prevUser.name;
      }

      let newAssigneeName = 'Unassigned';
      if (assignee) {
        const nextUser = await User.findById(assignee);
        if (nextUser) newAssigneeName = nextUser.name;
      }

      activitiesToLog.push({
        action: 'ASSIGNMENT_CHANGED',
        details: {
          previousValue: prevAssigneeName,
          newValue: newAssigneeName,
          field: 'assignee',
          description: `Reassigned task from ${prevAssigneeName} to ${newAssigneeName}`,
          targetUserName: newAssigneeName,
        },
      });
      task.assignee = assignee || null;
    }

    // Other fields
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (priority !== undefined) task.priority = priority as TaskPriority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;

    // Increment OCC version on successful mutation
    task.version += 1;

    await task.save();

    // Log all accumulated activities
    for (const act of activitiesToLog) {
      await logActivity({
        project: project._id,
        task: task._id,
        taskTitle: task.title,
        user: req.user!._id,
        userName: req.user!.name,
        action: act.action,
        details: act.details,
      });
    }

    const updated = await Task.findById(task._id)
      .populate('creator', 'name email')
      .populate('assignee', 'name email');

    res.status(200).json({
      message: 'Task updated successfully',
      task: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTaskStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { status, version } = req.body;

    if (!isValidObjectId(taskId)) {
      res.status(400).json({ message: 'Invalid task ID format' });
      return;
    }

    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const project = await Project.findById(task.project);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const userIdStr = req.user!._id.toString();
    const isOwner = project.owner.toString() === userIdStr;
    const isMember = project.members.some((m) => m.user.toString() === userIdStr);

    if (!isOwner && !isMember) {
      res.status(403).json({ message: 'Access denied: You are not a member of this project' });
      return;
    }

    // Both Owner and Member can change any task's status!
    // Concurrency check
    if (task.version !== version) {
      const latestTask = await Task.findById(taskId)
        .populate('creator', 'name email')
        .populate('assignee', 'name email');

      res.status(409).json({
        message: 'Conflict: This task has been modified by another user. Please reload the latest task to view changes before editing.',
        currentVersion: task.version,
        latestTask,
      });
      return;
    }

    const oldStatus = task.status;
    task.status = status;
    task.version += 1;
    await task.save();

    await logActivity({
      project: project._id,
      task: task._id,
      taskTitle: task.title,
      user: req.user!._id,
      userName: req.user!.name,
      action: 'STATUS_CHANGED',
      details: {
        previousValue: oldStatus,
        newValue: status,
        field: 'status',
        description: `Moved task from "${oldStatus}" to "${status}"`,
      },
    });

    const updated = await Task.findById(task._id)
      .populate('creator', 'name email')
      .populate('assignee', 'name email');

    res.status(200).json({
      message: 'Status updated successfully',
      task: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { taskId } = req.params;

    if (!isValidObjectId(taskId)) {
      res.status(400).json({ message: 'Invalid task ID format' });
      return;
    }

    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    const project = await Project.findById(task.project);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const userIdStr = req.user!._id.toString();
    const isOwner = project.owner.toString() === userIdStr;
    const isCreator = task.creator.toString() === userIdStr;

    // Permissions: Owner can delete any task; Member can only delete tasks they created
    if (!isOwner && !isCreator) {
      res.status(403).json({
        message: 'Forbidden: Members can only delete tasks they created',
      });
      return;
    }

    const taskTitle = task.title;

    await Promise.all([
      Task.findByIdAndDelete(taskId),
      Comment.deleteMany({ task: taskId }),
    ]);

    // Requirement: Deleted tasks must leave a readable activity record
    await logActivity({
      project: project._id,
      task: null, // task is removed, but title is preserved
      taskTitle,
      user: req.user!._id,
      userName: req.user!.name,
      action: 'TASK_DELETED',
      details: {
        description: `Deleted task "${taskTitle}"`,
      },
    });

    res.status(200).json({
      message: `Task "${taskTitle}" deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
