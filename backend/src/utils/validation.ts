import { z } from 'zod';
import mongoose from 'express';
import { isValidObjectId } from 'mongoose';

export const registerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be under 100 characters').trim(),
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
  password: z.string().min(1, 'Password is required'),
});

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100, 'Name must be under 100 characters').trim(),
  description: z.string().max(1000, 'Description must be under 1000 characters').optional().default(''),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1, 'Project name cannot be empty').max(100, 'Name must be under 100 characters').trim().optional(),
  description: z.string().max(1000, 'Description must be under 1000 characters').optional(),
});

export const addMemberSchema = z.object({
  email: z.string().email('Please provide a valid member email').toLowerCase().trim(),
});

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(150, 'Title cannot exceed 150 characters').trim(),
  description: z.string().max(5000, 'Description cannot exceed 5000 characters').optional().default(''),
  status: z.enum(['Backlog', 'To Do', 'In Progress', 'Done']).optional().default('To Do'),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional().default('Medium'),
  assignee: z
    .string()
    .refine((val) => !val || isValidObjectId(val), { message: 'Invalid assignee ID' })
    .nullable()
    .optional(),
  dueDate: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), { message: 'Invalid due date format' })
    .nullable()
    .optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Task title cannot be empty').max(150, 'Title cannot exceed 150 characters').trim().optional(),
  description: z.string().max(5000, 'Description cannot exceed 5000 characters').optional(),
  status: z.enum(['Backlog', 'To Do', 'In Progress', 'Done']).optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  assignee: z
    .string()
    .refine((val) => !val || isValidObjectId(val), { message: 'Invalid assignee ID' })
    .nullable()
    .optional(),
  dueDate: z
    .string()
    .refine((val) => !val || !isNaN(Date.parse(val)), { message: 'Invalid due date format' })
    .nullable()
    .optional(),
  version: z.number({ required_error: 'Task version is required for concurrency control' }),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['Backlog', 'To Do', 'In Progress', 'Done']),
  version: z.number({ required_error: 'Task version is required for concurrency control' }),
});

export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(2000, 'Comment cannot exceed 2000 characters').trim(),
});
