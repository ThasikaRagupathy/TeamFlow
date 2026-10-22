import { Project, Task, Comment, Activity, User, TaskStatus, TaskPriority } from '../types';

const STORAGE_KEY_PREFIX = 'teamflow_mock_';

// Initial Seed Data
const DEFAULT_USERS: User[] = [
  { id: 'user_alice_01', name: 'Alice Johnson', email: 'alice@example.com' },
  { id: 'user_bob_02', name: 'Bob Smith', email: 'bob@example.com' },
  { id: 'user_charlie_03', name: 'Charlie Davis', email: 'charlie@example.com' },
  { id: 'user_dana_04', name: 'Dana Lee', email: 'dana@example.com' },
];

const DEFAULT_PROJECTS: Project[] = [
  {
    _id: 'proj_teamflow_core',
    name: 'TeamFlow Core Platform',
    description: 'Next-generation team collaboration, task tracking, and audit feed infrastructure.',
    owner: DEFAULT_USERS[0],
    members: [
      { user: DEFAULT_USERS[0], role: 'owner', joinedAt: new Date(Date.now() - 30 * 86400000).toISOString() },
      { user: DEFAULT_USERS[1], role: 'member', joinedAt: new Date(Date.now() - 28 * 86400000).toISOString() },
      { user: DEFAULT_USERS[2], role: 'member', joinedAt: new Date(Date.now() - 25 * 86400000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    _id: 'proj_mobile_redesign',
    name: 'Mobile App Redesign',
    description: 'Revamping the cross-platform mobile client with modern offline-first capabilities.',
    owner: DEFAULT_USERS[1],
    members: [
      { user: DEFAULT_USERS[1], role: 'owner', joinedAt: new Date(Date.now() - 20 * 86400000).toISOString() },
      { user: DEFAULT_USERS[0], role: 'member', joinedAt: new Date(Date.now() - 19 * 86400000).toISOString() },
      { user: DEFAULT_USERS[2], role: 'member', joinedAt: new Date(Date.now() - 18 * 86400000).toISOString() },
      { user: DEFAULT_USERS[3], role: 'member', joinedAt: new Date(Date.now() - 15 * 86400000).toISOString() },
    ],
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
];

const daysAgo = (d: number) => new Date(Date.now() - d * 86400000).toISOString();
const daysAhead = (d: number) => new Date(Date.now() + d * 86400000).toISOString();

const DEFAULT_TASKS: Task[] = [
  // --- Project 1: TeamFlow Core Platform (18 Tasks) ---
  {
    _id: 'task_01',
    project: 'proj_teamflow_core',
    title: 'Design database schema for tasks and activity history',
    description: 'Define models for Tasks, Comments, Sessions, and immutable audit logs.',
    status: 'Done',
    priority: 'High',
    assignee: DEFAULT_USERS[1],
    dueDate: daysAgo(10),
    creator: DEFAULT_USERS[0],
    version: 2,
    createdAt: daysAgo(15),
    updatedAt: daysAgo(10),
  },
  {
    _id: 'task_02',
    project: 'proj_teamflow_core',
    title: 'Implement JWT authentication with token revocation',
    description: 'Support login, registration, logout with session tracking to block reuse.',
    status: 'Done',
    priority: 'Critical',
    assignee: DEFAULT_USERS[1],
    dueDate: daysAgo(5),
    creator: DEFAULT_USERS[0],
    version: 3,
    createdAt: daysAgo(12),
    updatedAt: daysAgo(5),
  },
  {
    _id: 'task_03',
    project: 'proj_teamflow_core',
    title: 'Create Kanban Board view with drag/drop and status update',
    description: 'Build responsive columns for Backlog, To Do, In Progress, Done with cards.',
    status: 'In Progress',
    priority: 'High',
    assignee: DEFAULT_USERS[2],
    dueDate: daysAhead(2),
    creator: DEFAULT_USERS[0],
    version: 1,
    createdAt: daysAgo(8),
    updatedAt: daysAgo(2),
  },
  {
    _id: 'task_04',
    project: 'proj_teamflow_core',
    title: 'Implement Optimistic Concurrency Control (OCC)',
    description: 'Detect conflicting edits when two users modify the same task simultaneously.',
    status: 'In Progress',
    priority: 'Critical',
    assignee: DEFAULT_USERS[1],
    dueDate: daysAhead(1),
    creator: DEFAULT_USERS[0],
    version: 2,
    createdAt: daysAgo(7),
    updatedAt: daysAgo(1),
  },
  {
    _id: 'task_05',
    project: 'proj_teamflow_core',
    title: 'Build task filter and server-side pagination table',
    description: 'Provide filters by status, priority, assignee, and overdue status with URL sync.',
    status: 'To Do',
    priority: 'Medium',
    assignee: DEFAULT_USERS[2],
    dueDate: daysAhead(4),
    creator: DEFAULT_USERS[1],
    version: 1,
    createdAt: daysAgo(6),
    updatedAt: daysAgo(6),
  },
  {
    _id: 'task_06',
    project: 'proj_teamflow_core',
    title: 'Fix edge-case: Unassign tasks when member removed',
    description: 'Removing a team member must revoke project access and unset their task assignments.',
    status: 'In Progress',
    priority: 'High',
    assignee: DEFAULT_USERS[1],
    dueDate: daysAgo(2), // OVERDUE!
    creator: DEFAULT_USERS[0],
    version: 1,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(2),
  },
  {
    _id: 'task_07',
    project: 'proj_teamflow_core',
    title: 'Implement project dashboard with summary KPIs',
    description: 'Compute whole-project counts for total tasks, overdue tasks, and status breakdown.',
    status: 'To Do',
    priority: 'Medium',
    assignee: DEFAULT_USERS[2],
    dueDate: daysAgo(1), // OVERDUE!
    creator: DEFAULT_USERS[0],
    version: 1,
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
  },
  {
    _id: 'task_08',
    project: 'proj_teamflow_core',
    title: 'Rate limiting for authentication endpoints',
    description: 'Limit brute force attempts on login/register endpoints.',
    status: 'Done',
    priority: 'Medium',
    assignee: DEFAULT_USERS[1],
    dueDate: daysAgo(7),
    creator: DEFAULT_USERS[0],
    version: 1,
    createdAt: daysAgo(9),
    updatedAt: daysAgo(7),
  },
  {
    _id: 'task_09',
    project: 'proj_teamflow_core',
    title: 'Add comment section to task details modal',
    description: 'Allow users to comment on tasks and delete their own comments or owners delete any.',
    status: 'In Progress',
    priority: 'Medium',
    assignee: DEFAULT_USERS[2],
    dueDate: daysAhead(3),
    creator: DEFAULT_USERS[1],
    version: 2,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(1),
  },
  {
    _id: 'task_10',
    project: 'proj_teamflow_core',
    title: 'Implement activity log feed for project actions',
    description: 'Store previous/new values for status changes, reassignments, member additions.',
    status: 'Done',
    priority: 'High',
    assignee: DEFAULT_USERS[1],
    dueDate: daysAgo(4),
    creator: DEFAULT_USERS[0],
    version: 2,
    createdAt: daysAgo(7),
    updatedAt: daysAgo(4),
  },
  {
    _id: 'task_11',
    project: 'proj_teamflow_core',
    title: 'Setup automated integration tests with isolated test database',
    description: 'Write test suites covering all 8 required scenarios from the brief.',
    status: 'To Do',
    priority: 'Critical',
    assignee: DEFAULT_USERS[1],
    dueDate: daysAhead(5),
    creator: DEFAULT_USERS[0],
    version: 1,
    createdAt: daysAgo(3),
    updatedAt: daysAgo(3),
  },
  {
    _id: 'task_12',
    project: 'proj_teamflow_core',
    title: 'Enforce team permissions: Owner vs Member restrictions',
    description: 'Ensure members cannot edit other users tasks or reassign tasks.',
    status: 'Done',
    priority: 'Critical',
    assignee: DEFAULT_USERS[0],
    dueDate: daysAgo(6),
    creator: DEFAULT_USERS[0],
    version: 1,
    createdAt: daysAgo(8),
    updatedAt: daysAgo(6),
  },
  {
    _id: 'task_13',
    project: 'proj_teamflow_core',
    title: 'Implement confirmation dialogs for destructive actions',
    description: 'Prompt user before deleting tasks, comments, or removing team members.',
    status: 'To Do',
    priority: 'Low',
    assignee: DEFAULT_USERS[2],
    dueDate: daysAhead(7),
    creator: DEFAULT_USERS[0],
    version: 1,
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    _id: 'task_14',
    project: 'proj_teamflow_core',
    title: 'Accessibility audit for keyboard navigation',
    description: 'Ensure visible focus rings and accessible aria labels on all interactive elements.',
    status: 'Backlog',
    priority: 'Low',
    assignee: null,
    dueDate: null,
    creator: DEFAULT_USERS[2],
    version: 1,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(5),
  },
  {
    _id: 'task_15',
    project: 'proj_teamflow_core',
    title: 'Write comprehensive documentation and AI_USAGE guide',
    description: 'Document tools, prompts, verification techniques, and rejected suggestions.',
    status: 'To Do',
    priority: 'Medium',
    assignee: DEFAULT_USERS[0],
    dueDate: daysAhead(6),
    creator: DEFAULT_USERS[0],
    version: 1,
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    _id: 'task_16',
    project: 'proj_teamflow_core',
    title: 'Resolve race condition on concurrent task deletion',
    description: 'Ensure deleted tasks leave a readable record in project activity feed.',
    status: 'Done',
    priority: 'High',
    assignee: DEFAULT_USERS[1],
    dueDate: daysAgo(3),
    creator: DEFAULT_USERS[0],
    version: 1,
    createdAt: daysAgo(6),
    updatedAt: daysAgo(3),
  },
  {
    _id: 'task_17',
    project: 'proj_teamflow_core',
    title: 'Audit Docker compose configuration for preview',
    description: 'Optional container setup for staging deployment.',
    status: 'Backlog',
    priority: 'Low',
    assignee: null,
    dueDate: null,
    creator: DEFAULT_USERS[1],
    version: 1,
    createdAt: daysAgo(7),
    updatedAt: daysAgo(7),
  },
  {
    _id: 'task_18',
    project: 'proj_teamflow_core',
    title: 'Investigate WebSockets for live status updates',
    description: 'Research live synchronization trade-offs vs polling.',
    status: 'Backlog',
    priority: 'Low',
    assignee: null,
    dueDate: null,
    creator: DEFAULT_USERS[2],
    version: 1,
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
  },

  // --- Project 2: Mobile App Redesign (12 Tasks) ---
  {
    _id: 'task_19',
    project: 'proj_mobile_redesign',
    title: 'Mobile navigation header and responsive bottom drawer',
    description: 'Create responsive navigation for small screen viewports.',
    status: 'Done',
    priority: 'High',
    assignee: DEFAULT_USERS[2],
    dueDate: daysAgo(8),
    creator: DEFAULT_USERS[1],
    version: 2,
    createdAt: daysAgo(14),
    updatedAt: daysAgo(8),
  },
  {
    _id: 'task_20',
    project: 'proj_mobile_redesign',
    title: 'Setup mobile offline sync with local storage',
    description: 'Cache tasks locally when network disconnects.',
    status: 'In Progress',
    priority: 'Critical',
    assignee: DEFAULT_USERS[1],
    dueDate: daysAgo(3), // OVERDUE!
    creator: DEFAULT_USERS[1],
    version: 1,
    createdAt: daysAgo(10),
    updatedAt: daysAgo(3),
  },
  {
    _id: 'task_21',
    project: 'proj_mobile_redesign',
    title: 'Touch gesture swipe to change task status',
    description: 'Enable swipe left/right on cards to transition between Backlog, In Progress, Done.',
    status: 'To Do',
    priority: 'Medium',
    assignee: DEFAULT_USERS[2],
    dueDate: daysAhead(4),
    creator: DEFAULT_USERS[1],
    version: 1,
    createdAt: daysAgo(7),
    updatedAt: daysAgo(7),
  },
  {
    _id: 'task_22',
    project: 'proj_mobile_redesign',
    title: 'Push notifications for task mentions and status updates',
    description: 'Integrate FCM for real-time mobile push notifications.',
    status: 'Backlog',
    priority: 'Medium',
    assignee: null,
    dueDate: daysAhead(14),
    creator: DEFAULT_USERS[1],
    version: 1,
    createdAt: daysAgo(6),
    updatedAt: daysAgo(6),
  },
  {
    _id: 'task_23',
    project: 'proj_mobile_redesign',
    title: 'Mobile UI dark mode theme tokens',
    description: 'Support seamless light and dark color schemes matching system preference.',
    status: 'Done',
    priority: 'Low',
    assignee: DEFAULT_USERS[2],
    dueDate: daysAgo(5),
    creator: DEFAULT_USERS[2],
    version: 1,
    createdAt: daysAgo(9),
    updatedAt: daysAgo(5),
  },
  {
    _id: 'task_24',
    project: 'proj_mobile_redesign',
    title: 'Automated end-to-end mobile smoke tests',
    description: 'Verify login and task creation flows on simulated mobile devices.',
    status: 'In Progress',
    priority: 'High',
    assignee: DEFAULT_USERS[3],
    dueDate: daysAhead(2),
    creator: DEFAULT_USERS[1],
    version: 1,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(2),
  },
  {
    _id: 'task_25',
    project: 'proj_mobile_redesign',
    title: 'Fix touch target sizing for task action buttons',
    description: 'Increase clickable touch targets to at least 44x44px for WCAG compliance.',
    status: 'Done',
    priority: 'Medium',
    assignee: DEFAULT_USERS[2],
    dueDate: daysAgo(4),
    creator: DEFAULT_USERS[3],
    version: 1,
    createdAt: daysAgo(8),
    updatedAt: daysAgo(4),
  },
  {
    _id: 'task_26',
    project: 'proj_mobile_redesign',
    title: 'Implement haptic feedback on task completion',
    description: 'Trigger gentle vibration upon dragging a task into the Done column.',
    status: 'Backlog',
    priority: 'Low',
    assignee: null,
    dueDate: null,
    creator: DEFAULT_USERS[1],
    version: 1,
    createdAt: daysAgo(6),
    updatedAt: daysAgo(6),
  },
  {
    _id: 'task_27',
    project: 'proj_mobile_redesign',
    title: 'Optimize image attachments and avatar compression',
    description: 'Serve WebP responsive images to minimize cellular mobile data usage.',
    status: 'To Do',
    priority: 'Low',
    assignee: DEFAULT_USERS[3],
    dueDate: daysAhead(6),
    creator: DEFAULT_USERS[1],
    version: 1,
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
  },
  {
    _id: 'task_28',
    project: 'proj_mobile_redesign',
    title: 'Deep linking for task URL routing',
    description: 'Allow clicking shared task URLs to directly open the specific task modal.',
    status: 'In Progress',
    priority: 'High',
    assignee: DEFAULT_USERS[0],
    dueDate: daysAgo(1), // OVERDUE!
    creator: DEFAULT_USERS[1],
    version: 2,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1),
  },
  {
    _id: 'task_29',
    project: 'proj_mobile_redesign',
    title: 'Crash reporting and error telemetry integration',
    description: 'Configure telemetry for mobile crash reporting.',
    status: 'Done',
    priority: 'Medium',
    assignee: DEFAULT_USERS[3],
    dueDate: daysAgo(9),
    creator: DEFAULT_USERS[1],
    version: 1,
    createdAt: daysAgo(12),
    updatedAt: daysAgo(9),
  },
  {
    _id: 'task_30',
    project: 'proj_mobile_redesign',
    title: 'App Store submission checklist and privacy policy',
    description: 'Prepare screenshots, descriptions, and privacy declarations.',
    status: 'Backlog',
    priority: 'High',
    assignee: DEFAULT_USERS[1],
    dueDate: daysAhead(20),
    creator: DEFAULT_USERS[1],
    version: 1,
    createdAt: daysAgo(8),
    updatedAt: daysAgo(8),
  },
];

const DEFAULT_COMMENTS: Comment[] = [
  {
    _id: 'com_01',
    task: 'task_01',
    project: 'proj_teamflow_core',
    author: DEFAULT_USERS[1],
    content: 'Finalized the schema draft with optimistic concurrency control fields and indexes.',
    createdAt: daysAgo(12),
    updatedAt: daysAgo(12),
  },
  {
    _id: 'com_02',
    task: 'task_01',
    project: 'proj_teamflow_core',
    author: DEFAULT_USERS[0],
    content: 'Looks great! Make sure compound indexes are applied on project and status.',
    createdAt: daysAgo(11),
    updatedAt: daysAgo(11),
  },
  {
    _id: 'com_03',
    task: 'task_03',
    project: 'proj_teamflow_core',
    author: DEFAULT_USERS[2],
    content: 'Kanban columns are responsive and support keyboard-accessible tab switches.',
    createdAt: daysAgo(4),
    updatedAt: daysAgo(4),
  },
  {
    _id: 'com_04',
    task: 'task_04',
    project: 'proj_teamflow_core',
    author: DEFAULT_USERS[1],
    content: 'OCC tested with simultaneous requests. It reliably throws 409 Conflict.',
    createdAt: daysAgo(2),
    updatedAt: daysAgo(2),
  },
  {
    _id: 'com_05',
    task: 'task_19',
    project: 'proj_mobile_redesign',
    author: DEFAULT_USERS[3],
    content: 'Smoke test pipeline passed on Android and iOS simulators.',
    createdAt: daysAgo(9),
    updatedAt: daysAgo(9),
  },
];

const DEFAULT_ACTIVITIES: Activity[] = [
  {
    _id: 'act_01',
    project: 'proj_teamflow_core',
    task: 'task_01',
    taskTitle: 'Design database schema for tasks and activity history',
    user: DEFAULT_USERS[0],
    userName: DEFAULT_USERS[0].name,
    action: 'TASK_CREATED',
    details: { description: 'Created task "Design database schema for tasks and activity history"' },
    createdAt: daysAgo(15),
  },
  {
    _id: 'act_02',
    project: 'proj_teamflow_core',
    task: 'task_01',
    taskTitle: 'Design database schema for tasks and activity history',
    user: DEFAULT_USERS[1],
    userName: DEFAULT_USERS[1].name,
    action: 'STATUS_CHANGED',
    details: { previousValue: 'In Progress', newValue: 'Done', field: 'status' },
    createdAt: daysAgo(10),
  },
  {
    _id: 'act_03',
    project: 'proj_teamflow_core',
    task: 'task_03',
    taskTitle: 'Create Kanban Board view with drag/drop and status update',
    user: DEFAULT_USERS[0],
    userName: DEFAULT_USERS[0].name,
    action: 'ASSIGNMENT_CHANGED',
    details: { previousValue: 'Unassigned', newValue: 'Charlie Davis', field: 'assignee' },
    createdAt: daysAgo(8),
  },
  {
    _id: 'act_04',
    project: 'proj_teamflow_core',
    user: DEFAULT_USERS[0],
    userName: DEFAULT_USERS[0].name,
    action: 'MEMBER_ADDED',
    details: { description: 'Added Charlie Davis to TeamFlow Core Platform', targetUserName: 'Charlie Davis' },
    createdAt: daysAgo(25),
  },
  {
    _id: 'act_05',
    project: 'proj_mobile_redesign',
    task: 'task_19',
    taskTitle: 'Mobile navigation header and responsive bottom drawer',
    user: DEFAULT_USERS[1],
    userName: DEFAULT_USERS[1].name,
    action: 'TASK_CREATED',
    details: { description: 'Created task "Mobile navigation header and responsive bottom drawer"' },
    createdAt: daysAgo(14),
  },
  {
    _id: 'act_06',
    project: 'proj_mobile_redesign',
    user: DEFAULT_USERS[1],
    userName: DEFAULT_USERS[1].name,
    action: 'MEMBER_ADDED',
    details: { description: 'Added Dana Lee to Mobile App Redesign', targetUserName: 'Dana Lee' },
    createdAt: daysAgo(15),
  },
];

// Helper to access and persist to localStorage
class MockDatabase {
  private getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const data = localStorage.getItem(STORAGE_KEY_PREFIX + key);
      return data ? JSON.parse(data) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.warn('localStorage setItem failed:', e);
    }
  }

  // Initialize seed data if not present
  public init(): void {
    if (typeof window === 'undefined') return;
    if (!localStorage.getItem(STORAGE_KEY_PREFIX + 'initialized_v1')) {
      this.setItem('users', DEFAULT_USERS);
      this.setItem('projects', DEFAULT_PROJECTS);
      this.setItem('tasks', DEFAULT_TASKS);
      this.setItem('comments', DEFAULT_COMMENTS);
      this.setItem('activities', DEFAULT_ACTIVITIES);
      this.setItem('initialized_v1', true);
    }
  }

  // Auth
  public async login(email: string, pass: string): Promise<{ token: string; user: User }> {
    this.init();
    const users = this.getItem<User[]>('users', DEFAULT_USERS);
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const token = `mock_token_${user.id}_${Date.now()}`;
    return { token, user };
  }

  public async register(name: string, email: string, pass: string): Promise<{ token: string; user: User }> {
    this.init();
    const users = this.getItem<User[]>('users', DEFAULT_USERS);
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('A user with this email already exists');
    }

    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email: email.toLowerCase(),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this.setItem('users', users);

    const token = `mock_token_${newUser.id}_${Date.now()}`;
    return { token, user: newUser };
  }

  public async getMe(currentUser: User | null): Promise<{ user: User }> {
    if (!currentUser) throw new Error('Not authenticated');
    return { user: currentUser };
  }

  // Projects
  public async getProjects(currentUser: User | null): Promise<{ projects: Project[] }> {
    this.init();
    const projects = this.getItem<Project[]>('projects', DEFAULT_PROJECTS);
    if (!currentUser) return { projects: [] };

    const cId = currentUser.id || (currentUser as any)._id;
    const userProjects = projects.filter((p) => {
      const isOwner = (p.owner.id || (p.owner as any)._id) === cId;
      const isMember = p.members.some((m) => (m.user.id || (m.user as any)._id) === cId);
      return isOwner || isMember;
    });

    return { projects: userProjects };
  }

  public async getProjectById(projectId: string, currentUser: User | null): Promise<{ project: Project; currentUserRole: 'owner' | 'member' }> {
    this.init();
    const projects = this.getItem<Project[]>('projects', DEFAULT_PROJECTS);
    const project = projects.find((p) => p._id === projectId);
    if (!project) throw new Error('Project not found');

    const cId = currentUser?.id || (currentUser as any)?._id;
    const isOwner = (project.owner.id || (project.owner as any)._id) === cId;
    const isMember = project.members.some((m) => (m.user.id || (m.user as any)._id) === cId);

    if (!isOwner && !isMember) {
      throw new Error('Access denied: You are not a member of this project');
    }

    return { project, currentUserRole: isOwner ? 'owner' : 'member' };
  }

  public async createProject(payload: { name: string; description?: string }, currentUser: User): Promise<{ project: Project }> {
    this.init();
    const projects = this.getItem<Project[]>('projects', DEFAULT_PROJECTS);

    const newProject: Project = {
      _id: `proj_${Date.now()}`,
      name: payload.name,
      description: payload.description || '',
      owner: currentUser,
      members: [
        { user: currentUser, role: 'owner', joinedAt: new Date().toISOString() },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    projects.unshift(newProject);
    this.setItem('projects', projects);

    return { project: newProject };
  }

  public async addMember(projectId: string, email: string, currentUser: User): Promise<{ project: Project }> {
    this.init();
    const projects = this.getItem<Project[]>('projects', DEFAULT_PROJECTS);
    const users = this.getItem<User[]>('users', DEFAULT_USERS);

    const project = projects.find((p) => p._id === projectId);
    if (!project) throw new Error('Project not found');

    const userToAdd = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!userToAdd) throw new Error(`No registered user found with email: ${email}`);

    const uId = userToAdd.id || (userToAdd as any)._id;
    if (project.members.some((m) => (m.user.id || (m.user as any)._id) === uId)) {
      throw new Error('This user is already a member of this project');
    }

    project.members.push({
      user: userToAdd,
      role: 'member',
      joinedAt: new Date().toISOString(),
    });

    this.setItem('projects', projects);
    this.logActivity(projectId, currentUser, 'MEMBER_ADDED', {
      description: `Added ${userToAdd.name} (${userToAdd.email}) to the project`,
      targetUserName: userToAdd.name,
    });

    return { project };
  }

  public async removeMember(projectId: string, memberId: string, currentUser: User): Promise<{ project: Project }> {
    this.init();
    const projects = this.getItem<Project[]>('projects', DEFAULT_PROJECTS);
    const project = projects.find((p) => p._id === projectId);
    if (!project) throw new Error('Project not found');

    const ownerId = project.owner.id || (project.owner as any)._id;
    if (memberId === ownerId) {
      throw new Error('The project owner cannot be removed from the project');
    }

    const mIdx = project.members.findIndex((m) => (m.user.id || (m.user as any)._id) === memberId);
    if (mIdx === -1) throw new Error('Member not found in this project');

    const removedName = project.members[mIdx].user.name;
    project.members.splice(mIdx, 1);
    this.setItem('projects', projects);

    // Requirement: Removing a member clears their task assignments and revokes project access
    const tasks = this.getItem<Task[]>('tasks', DEFAULT_TASKS);
    tasks.forEach((t) => {
      if (t.project === projectId && t.assignee && (t.assignee.id || (t.assignee as any)._id) === memberId) {
        t.assignee = null;
      }
    });
    this.setItem('tasks', tasks);

    this.logActivity(projectId, currentUser, 'MEMBER_REMOVED', {
      description: `Removed ${removedName} from the project`,
      targetUserName: removedName,
    });

    return { project };
  }

  // Tasks
  public async getTasks(
    projectId: string,
    params: Record<string, string | number | boolean | undefined> = {}
  ): Promise<{ tasks: Task[]; total: number; page: number; totalPages: number; limit: number }> {
    this.init();
    let tasks = this.getItem<Task[]>('tasks', DEFAULT_TASKS).filter((t) => t.project === projectId);

    const search = params.search ? String(params.search).toLowerCase().trim() : '';
    const status = params.status ? String(params.status) : 'all';
    const priority = params.priority ? String(params.priority) : 'all';
    const assignee = params.assignee ? String(params.assignee) : 'all';
    const overdue = String(params.overdue) === 'true';
    const sortBy = (params.sortBy as string) || 'createdAt';
    const sortOrder = (params.sortOrder as string) || 'desc';
    const page = Math.max(1, parseInt(String(params.page || 1), 10));
    const limit = Math.max(1, parseInt(String(params.limit || 10), 10));

    // Search filter
    if (search) {
      tasks = tasks.filter((t) => t.title.toLowerCase().includes(search));
    }

    // Status filter
    if (status && status !== 'all') {
      tasks = tasks.filter((t) => t.status === status);
    }

    // Priority filter
    if (priority && priority !== 'all') {
      tasks = tasks.filter((t) => t.priority === priority);
    }

    // Assignee filter
    if (assignee && assignee !== 'all') {
      if (assignee === 'unassigned') {
        tasks = tasks.filter((t) => !t.assignee);
      } else {
        tasks = tasks.filter((t) => t.assignee && (t.assignee.id || (t.assignee as any)._id) === assignee);
      }
    }

    // Overdue filter: dueDate < now and status != Done
    if (overdue) {
      const now = Date.now();
      tasks = tasks.filter((t) => t.dueDate && new Date(t.dueDate).getTime() < now && t.status !== 'Done');
    }

    // Sorting
    tasks.sort((a: any, b: any) => {
      let valA = a[sortBy];
      let valB = b[sortBy];

      if (sortBy === 'dueDate') {
        valA = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        valB = b.dueDate ? new Date(b.dueDate).getTime() : 0;
      } else if (sortBy === 'createdAt') {
        valA = new Date(a.createdAt).getTime();
        valB = new Date(b.createdAt).getTime();
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    const total = tasks.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = tasks.slice((page - 1) * limit, page * limit);

    return { tasks: paginated, total, page, totalPages, limit };
  }

  public async getTaskById(taskId: string, currentUser: User | null): Promise<{ task: Task; comments: Comment[]; userRole: string; isCreator: boolean }> {
    this.init();
    const tasks = this.getItem<Task[]>('tasks', DEFAULT_TASKS);
    const task = tasks.find((t) => t._id === taskId);
    if (!task) throw new Error('Task not found');

    const comments = this.getItem<Comment[]>('comments', DEFAULT_COMMENTS).filter((c) => c.task === taskId);
    const cId = currentUser?.id || (currentUser as any)?._id;
    const isCreator = (task.creator.id || (task.creator as any)._id) === cId;

    return { task, comments, userRole: 'owner', isCreator };
  }

  public async createTask(projectId: string, payload: any, currentUser: User): Promise<{ task: Task }> {
    this.init();
    const tasks = this.getItem<Task[]>('tasks', DEFAULT_TASKS);
    const users = this.getItem<User[]>('users', DEFAULT_USERS);

    let assigneeUser: User | null = null;
    if (payload.assignee) {
      assigneeUser = users.find((u) => u.id === payload.assignee || (u as any)._id === payload.assignee) || null;
    }

    const newTask: Task = {
      _id: `task_${Date.now()}`,
      project: projectId,
      title: payload.title,
      description: payload.description || '',
      status: payload.status || 'To Do',
      priority: payload.priority || 'Medium',
      assignee: assigneeUser,
      dueDate: payload.dueDate || null,
      creator: currentUser,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.unshift(newTask);
    this.setItem('tasks', tasks);

    this.logActivity(projectId, currentUser, 'TASK_CREATED', {
      description: `Created task "${newTask.title}"`,
    }, newTask._id, newTask.title);

    return { task: newTask };
  }

  public async updateTask(taskId: string, payload: any, currentUser: User): Promise<{ task: Task }> {
    this.init();
    const tasks = this.getItem<Task[]>('tasks', DEFAULT_TASKS);
    const users = this.getItem<User[]>('users', DEFAULT_USERS);
    const task = tasks.find((t) => t._id === taskId);
    if (!task) throw new Error('Task not found');

    // OCC Check
    if (payload.version !== undefined && payload.version !== task.version) {
      const err: any = new Error('Conflict: This task has been modified by another user. Please reload the latest task to view changes before editing.');
      err.statusCode = 409;
      err.isConflict = true;
      err.latestTask = task;
      throw err;
    }

    if (payload.title !== undefined) task.title = payload.title;
    if (payload.description !== undefined) task.description = payload.description;
    if (payload.priority !== undefined) task.priority = payload.priority;
    if (payload.dueDate !== undefined) task.dueDate = payload.dueDate;
    if (payload.status !== undefined && payload.status !== task.status) {
      const old = task.status;
      task.status = payload.status;
      this.logActivity(task.project, currentUser, 'STATUS_CHANGED', {
        previousValue: old,
        newValue: payload.status,
        field: 'status',
        description: `Changed status from "${old}" to "${payload.status}"`,
      }, task._id, task.title);
    }

    if (payload.assignee !== undefined) {
      const newAssignee = users.find((u) => u.id === payload.assignee || (u as any)._id === payload.assignee) || null;
      task.assignee = newAssignee;
    }

    task.version += 1;
    task.updatedAt = new Date().toISOString();
    this.setItem('tasks', tasks);

    return { task };
  }

  public async updateTaskStatus(taskId: string, status: TaskStatus, version: number, currentUser: User): Promise<{ task: Task }> {
    this.init();
    const tasks = this.getItem<Task[]>('tasks', DEFAULT_TASKS);
    const task = tasks.find((t) => t._id === taskId);
    if (!task) throw new Error('Task not found');

    // OCC Check
    if (version !== undefined && version !== task.version) {
      const err: any = new Error('Conflict: This task has been modified by another user. Please reload the latest task to view changes before editing.');
      err.statusCode = 409;
      err.isConflict = true;
      err.latestTask = task;
      throw err;
    }

    const oldStatus = task.status;
    task.status = status;
    task.version += 1;
    task.updatedAt = new Date().toISOString();
    this.setItem('tasks', tasks);

    this.logActivity(task.project, currentUser, 'STATUS_CHANGED', {
      previousValue: oldStatus,
      newValue: status,
      field: 'status',
      description: `Moved task from "${oldStatus}" to "${status}"`,
    }, task._id, task.title);

    return { task };
  }

  public async deleteTask(taskId: string, currentUser: User): Promise<{ message: string }> {
    this.init();
    const tasks = this.getItem<Task[]>('tasks', DEFAULT_TASKS);
    const tIdx = tasks.findIndex((t) => t._id === taskId);
    if (tIdx === -1) throw new Error('Task not found');

    const taskTitle = tasks[tIdx].title;
    const projectId = tasks[tIdx].project;

    tasks.splice(tIdx, 1);
    this.setItem('tasks', tasks);

    // Requirement: Deleted tasks must leave a readable activity record
    this.logActivity(projectId, currentUser, 'TASK_DELETED', {
      description: `Deleted task "${taskTitle}"`,
    }, null, taskTitle);

    return { message: 'Task deleted successfully' };
  }

  // Comments
  public async getComments(taskId: string): Promise<{ comments: Comment[] }> {
    this.init();
    const comments = this.getItem<Comment[]>('comments', DEFAULT_COMMENTS).filter((c) => c.task === taskId);
    return { comments };
  }

  public async addComment(taskId: string, content: string, currentUser: User): Promise<{ comment: Comment }> {
    this.init();
    const comments = this.getItem<Comment[]>('comments', DEFAULT_COMMENTS);
    const tasks = this.getItem<Task[]>('tasks', DEFAULT_TASKS);
    const task = tasks.find((t) => t._id === taskId);

    const newComment: Comment = {
      _id: `com_${Date.now()}`,
      task: taskId,
      project: task ? task.project : '',
      author: currentUser,
      content,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    comments.push(newComment);
    this.setItem('comments', comments);
    return { comment: newComment };
  }

  public async deleteComment(commentId: string): Promise<{ message: string }> {
    this.init();
    const comments = this.getItem<Comment[]>('comments', DEFAULT_COMMENTS);
    const cIdx = comments.findIndex((c) => c._id === commentId);
    if (cIdx !== -1) {
      comments.splice(cIdx, 1);
      this.setItem('comments', comments);
    }
    return { message: 'Comment deleted successfully' };
  }

  // Dashboard & Activity
  public async getDashboard(projectId: string, currentUser: User | null): Promise<{ project: any; dashboard: any }> {
    this.init();
    const tasks = this.getItem<Task[]>('tasks', DEFAULT_TASKS).filter((t) => t.project === projectId);
    const activities = this.getItem<Activity[]>('activities', DEFAULT_ACTIVITIES).filter((a) => a.project === projectId);
    const cId = currentUser?.id || (currentUser as any)?._id;

    const totalTasks = tasks.length;
    const now = Date.now();
    const overdueTasksCount = tasks.filter((t) => t.dueDate && new Date(t.dueDate).getTime() < now && t.status !== 'Done').length;

    const tasksByStatus: Record<string, number> = {
      Backlog: 0,
      'To Do': 0,
      'In Progress': 0,
      Done: 0,
    };
    tasks.forEach((t) => {
      if (tasksByStatus[t.status] !== undefined) {
        tasksByStatus[t.status] += 1;
      }
    });

    const assignedToCurrentUser = tasks.filter((t) => t.assignee && (t.assignee.id || (t.assignee as any)._id) === cId);
    const recentActivities = activities.slice(0, 10);

    return {
      project: { id: projectId },
      dashboard: {
        totalTasks,
        tasksByStatus,
        overdueTasksCount,
        assignedToCurrentUserCount: assignedToCurrentUser.length,
        assignedToCurrentUser,
        recentActivities,
      },
    };
  }

  public async getActivities(projectId: string, page = 1, limit = 20): Promise<{ activities: Activity[]; total: number; page: number; totalPages: number }> {
    this.init();
    const activities = this.getItem<Activity[]>('activities', DEFAULT_ACTIVITIES).filter((a) => a.project === projectId);
    const total = activities.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = activities.slice((page - 1) * limit, page * limit);

    return { activities: paginated, total, page, totalPages };
  }

  private logActivity(
    projectId: string,
    user: User,
    action: Activity['action'],
    details: Activity['details'],
    taskId: string | null = null,
    taskTitle: string = ''
  ): void {
    const activities = this.getItem<Activity[]>('activities', DEFAULT_ACTIVITIES);
    const newAct: Activity = {
      _id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      project: projectId,
      task: taskId,
      taskTitle,
      user,
      userName: user.name,
      action,
      details,
      createdAt: new Date().toISOString(),
    };
    activities.unshift(newAct);
    this.setItem('activities', activities);
  }
}

export const mockDb = new MockDatabase();
