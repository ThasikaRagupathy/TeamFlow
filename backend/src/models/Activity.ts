import mongoose, { Document, Schema } from 'mongoose';

export type ActivityAction =
  | 'TASK_CREATED'
  | 'TASK_DELETED'
  | 'STATUS_CHANGED'
  | 'ASSIGNMENT_CHANGED'
  | 'TASK_UPDATED'
  | 'MEMBER_ADDED'
  | 'MEMBER_REMOVED';

export interface IActivity extends Document {
  _id: mongoose.Types.ObjectId;
  project: mongoose.Types.ObjectId;
  task?: mongoose.Types.ObjectId | null;
  taskTitle?: string;
  user: mongoose.Types.ObjectId;
  userName: string;
  action: ActivityAction;
  details: {
    previousValue?: string | null;
    newValue?: string | null;
    field?: string;
    description?: string;
    targetUserName?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
      index: true,
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },
    taskTitle: {
      type: String,
      default: '',
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      enum: [
        'TASK_CREATED',
        'TASK_DELETED',
        'STATUS_CHANGED',
        'ASSIGNMENT_CHANGED',
        'TASK_UPDATED',
        'MEMBER_ADDED',
        'MEMBER_REMOVED',
      ],
      required: true,
    },
    details: {
      previousValue: { type: String, default: null },
      newValue: { type: String, default: null },
      field: { type: String, default: null },
      description: { type: String, default: null },
      targetUserName: { type: String, default: null },
    },
  },
  {
    timestamps: true,
  }
);

activitySchema.index({ project: 1, createdAt: -1 });

export const Activity = mongoose.model<IActivity>('Activity', activitySchema);
