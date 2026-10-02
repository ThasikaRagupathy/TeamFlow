import mongoose, { Document, Schema } from 'mongoose';

export type TaskStatus = 'Backlog' | 'To Do' | 'In Progress' | 'Done';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface ITask extends Document {
  _id: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: mongoose.Types.ObjectId | null;
  dueDate?: Date | null;
  creator: mongoose.Types.ObjectId;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      maxlength: [150, 'Task title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [5000, 'Task description cannot exceed 5000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['Backlog', 'To Do', 'In Progress', 'Done'],
        message: '{VALUE} is not a valid task status',
      },
      default: 'To Do',
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High', 'Critical'],
        message: '{VALUE} is not a valid task priority',
      },
      default: 'Medium',
      index: true,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    dueDate: {
      type: Date,
      default: null,
      index: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task creator is required'],
      index: true,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for performant search, filter, and sorting
taskSchema.index({ project: 1, status: 1 });
taskSchema.index({ project: 1, priority: 1 });
taskSchema.index({ project: 1, dueDate: 1 });
taskSchema.index({ project: 1, assignee: 1 });
taskSchema.index({ project: 1, createdAt: -1 });

// Text index for server-side title search
taskSchema.index({ title: 'text' });

export const Task = mongoose.model<ITask>('Task', taskSchema);
