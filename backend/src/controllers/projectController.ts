import { Request, Response, NextFunction } from 'express';
import mongoose, { isValidObjectId } from 'mongoose';
import { Project } from '../models/Project';
import { User } from '../models/User';
import { Task } from '../models/Task';
import { Comment } from '../models/Comment';
import { Activity } from '../models/Activity';
import { logActivity } from '../services/activityService';

export const createProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description } = req.body;
    const userId = req.user!._id;

    const project = await Project.create({
      name,
      description: description || '',
      owner: userId,
      members: [
        {
          user: userId,
          role: 'owner',
          joinedAt: new Date(),
        },
      ],
    });

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    res.status(201).json({
      message: 'Project created successfully',
      project: populatedProject,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjects = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!._id;

    const projects = await Project.find({
      $or: [{ owner: userId }, { 'members.user': userId }],
    })
      .populate('owner', 'name email')
      .populate('members.user', 'name email')
      .sort({ updatedAt: -1 });

    res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const project = await Project.findById(req.project!._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    res.status(200).json({
      project,
      currentUserRole: req.projectRole,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description } = req.body;
    const project = req.project!;

    if (name !== undefined) project.name = name;
    if (description !== undefined) project.description = description;

    await project.save();

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    res.status(200).json({
      message: 'Project updated successfully',
      project: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const projectId = req.project!._id;

    // Clean up all related resources
    await Promise.all([
      Project.findByIdAndDelete(projectId),
      Task.deleteMany({ project: projectId }),
      Comment.deleteMany({ project: projectId }),
      Activity.deleteMany({ project: projectId }),
    ]);

    res.status(200).json({ message: 'Project and all related data deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email } = req.body;
    const project = req.project!;

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      res.status(404).json({ message: `No registered user found with email: ${email}` });
      return;
    }

    const alreadyMember = project.members.some(
      (m) => m.user.toString() === userToAdd._id.toString()
    );

    if (alreadyMember) {
      res.status(400).json({ message: 'This user is already a member of this project' });
      return;
    }

    project.members.push({
      user: userToAdd._id,
      role: 'member',
      joinedAt: new Date(),
    });

    await project.save();

    // Log activity
    await logActivity({
      project: project._id,
      user: req.user!._id,
      userName: req.user!.name,
      action: 'MEMBER_ADDED',
      details: {
        description: `Added ${userToAdd.name} (${userToAdd.email}) to the project`,
        targetUserName: userToAdd.name,
      },
    });

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    res.status(200).json({
      message: 'Member added successfully',
      project: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { memberId } = req.params;
    const project = req.project!;

    if (!isValidObjectId(memberId)) {
      res.status(400).json({ message: 'Invalid member ID format' });
      return;
    }

    // Owner cannot be removed
    if (project.owner.toString() === memberId) {
      res.status(400).json({ message: 'The project owner cannot be removed from the project' });
      return;
    }

    const memberIndex = project.members.findIndex(
      (m) => m.user.toString() === memberId
    );

    if (memberIndex === -1) {
      res.status(404).json({ message: 'Member not found in this project' });
      return;
    }

    const removedUser = await User.findById(memberId);
    const removedName = removedUser ? removedUser.name : 'Unknown User';

    project.members.splice(memberIndex, 1);
    await project.save();

    // Requirement: Removing a member clears their task assignments and revokes project access
    await Task.updateMany(
      { project: project._id, assignee: memberId },
      { $set: { assignee: null } }
    );

    // Requirement: Existing comments and task history remain after a member leaves
    // Log activity
    await logActivity({
      project: project._id,
      user: req.user!._id,
      userName: req.user!.name,
      action: 'MEMBER_REMOVED',
      details: {
        description: `Removed ${removedName} from the project`,
        targetUserName: removedName,
      },
    });

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email')
      .populate('members.user', 'name email');

    res.status(200).json({
      message: 'Member removed and task assignments cleared successfully',
      project: updated,
    });
  } catch (error) {
    next(error);
  }
};
