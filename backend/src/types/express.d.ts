import { IUser } from '../models/User';
import { ISession } from '../models/Session';
import { IProject } from '../models/Project';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      sessionDoc?: ISession;
      token?: string;
      project?: IProject;
      projectRole?: 'owner' | 'member';
    }
  }
}
