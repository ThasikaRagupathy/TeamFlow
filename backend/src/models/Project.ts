import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectMember {
  user: mongoose.Types.ObjectId;
  role: 'owner' | 'member';
  joinedAt: Date;
}

export interface IProject extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  owner: mongoose.Types.ObjectId;
  members: IProjectMember[];
  createdAt: Date;
  updatedAt: Date;
}

const projectMemberSchema = new Schema<IProjectMember>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'member'],
      default: 'member',
      required: true,
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const projectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Project description cannot exceed 1000 characters'],
      default: '',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    members: {
      type: [projectMemberSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast queries
projectSchema.index({ 'members.user': 1 });

export const Project = mongoose.model<IProject>('Project', projectSchema);
