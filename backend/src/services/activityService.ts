import mongoose from 'mongoose';
import { Activity, ActivityAction } from '../models/Activity';

interface RecordActivityParams {
  project: mongoose.Types.ObjectId | string;
  task?: mongoose.Types.ObjectId | string | null;
  taskTitle?: string;
  user: mongoose.Types.ObjectId | string;
  userName: string;
  action: ActivityAction;
  details?: {
    previousValue?: string | null;
    newValue?: string | null;
    field?: string;
    description?: string;
    targetUserName?: string;
  };
  session?: mongoose.ClientSession;
}

export const logActivity = async (params: RecordActivityParams): Promise<void> => {
  try {
    const activityData = {
      project: params.project,
      task: params.task || null,
      taskTitle: params.taskTitle || '',
      user: params.user,
      userName: params.userName,
      action: params.action,
      details: {
        previousValue: params.details?.previousValue || null,
        newValue: params.details?.newValue || null,
        field: params.details?.field || null,
        description: params.details?.description || null,
        targetUserName: params.details?.targetUserName || null,
      },
    };

    if (params.session) {
      await Activity.create([activityData], { session: params.session });
    } else {
      await Activity.create(activityData);
    }
  } catch (error) {
    console.error('Failed to record activity log:', error);
    // Don't crash request if secondary logging fails outside transaction, but log clearly
  }
};
