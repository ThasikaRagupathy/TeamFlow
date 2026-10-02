import { Request, Response, NextFunction } from 'express';
import { isValidObjectId } from 'mongoose';
import { Comment } from '../models/Comment';
import { Task } from '../models/Task';
import { Project } from '../models/Project';

export const addComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;
    const userId = req.user!._id;

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

    const userIdStr = userId.toString();
    const isOwner = project.owner.toString() === userIdStr;
    const isMember = project.members.some((m) => m.user.toString() === userIdStr);

    if (!isOwner && !isMember) {
      res.status(403).json({ message: 'Access denied: You are not a member of this project' });
      return;
    }

    const comment = await Comment.create({
      task: task._id,
      project: project._id,
      author: userId,
      content,
    });

    const populated = await Comment.findById(comment._id).populate('author', 'name email');

    res.status(201).json({
      message: 'Comment added successfully',
      comment: populated,
    });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    const isMember = project.members.some((m) => m.user.toString() === userIdStr);

    if (!isOwner && !isMember) {
      res.status(403).json({ message: 'Access denied: You are not a member of this project' });
      return;
    }

    const comments = await Comment.find({ task: taskId })
      .populate('author', 'name email')
      .sort({ createdAt: 1 });

    res.status(200).json({ comments });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { commentId } = req.params;

    if (!isValidObjectId(commentId)) {
      res.status(400).json({ message: 'Invalid comment ID format' });
      return;
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    const project = await Project.findById(comment.project);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const userIdStr = req.user!._id.toString();
    const isOwner = project.owner.toString() === userIdStr;
    const isAuthor = comment.author.toString() === userIdStr;

    // Requirement: "Users can delete their own comments; owners can delete any comment within their project."
    if (!isOwner && !isAuthor) {
      res.status(403).json({
        message: 'Forbidden: You can only delete your own comments unless you are the project owner',
      });
      return;
    }

    await Comment.findByIdAndDelete(commentId);

    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    next(error);
  }
};
