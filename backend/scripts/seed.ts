import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../src/models/User';
import { Project } from '../src/models/Project';
import { Task, TaskStatus, TaskPriority } from '../src/models/Task';
import { Comment } from '../src/models/Comment';
import { Activity } from '../src/models/Activity';
import { connectDatabase, disconnectDatabase } from '../src/config/db';

dotenv.config();

const seed = async () => {
  try {
    console.log('🌱 Starting TeamFlow database seed...');
    await connectDatabase();

    // Clear existing collections
    await Promise.all([
      User.deleteMany({}),
      Project.deleteMany({}),
      Task.deleteMany({}),
      Comment.deleteMany({}),
      Activity.deleteMany({}),
    ]);
    console.log('🧹 Cleaned existing database records');

    // 1. Create 4 Seed Users
    const defaultPassword = 'Password123!';
    const users = await User.create([
      {
        name: 'Alice Johnson',
        email: 'alice@example.com',
        password: defaultPassword,
      },
      {
        name: 'Bob Smith',
        email: 'bob@example.com',
        password: defaultPassword,
      },
      {
        name: 'Charlie Davis',
        email: 'charlie@example.com',
        password: defaultPassword,
      },
      {
        name: 'Dana Lee',
        email: 'dana@example.com',
        password: defaultPassword,
      },
    ]);

    const [alice, bob, charlie, dana] = users;
    console.log(`👤 Created 4 users (password for all: ${defaultPassword})`);

    // 2. Create 2 Projects with different memberships
    // Project 1: Alice owner, Bob and Charlie members
    const project1 = await Project.create({
      name: 'TeamFlow Core Platform',
      description: 'Building the core collaboration, task management, and activity feed infrastructure.',
      owner: alice._id,
      members: [
        { user: alice._id, role: 'owner', joinedAt: new Date(Date.now() - 30 * 86400000) },
        { user: bob._id, role: 'member', joinedAt: new Date(Date.now() - 28 * 86400000) },
        { user: charlie._id, role: 'member', joinedAt: new Date(Date.now() - 25 * 86400000) },
      ],
    });

    // Project 2: Bob owner, Alice, Charlie, Dana members
    const project2 = await Project.create({
      name: 'Mobile App Redesign',
      description: 'Revamping the cross-platform mobile client with modern offline-first capabilities.',
      owner: bob._id,
      members: [
        { user: bob._id, role: 'owner', joinedAt: new Date(Date.now() - 20 * 86400000) },
        { user: alice._id, role: 'member', joinedAt: new Date(Date.now() - 19 * 86400000) },
        { user: charlie._id, role: 'member', joinedAt: new Date(Date.now() - 18 * 86400000) },
        { user: dana._id, role: 'member', joinedAt: new Date(Date.now() - 15 * 86400000) },
      ],
    });

    console.log('📁 Created 2 projects with varied team memberships');

    // Helper dates
    const now = Date.now();
    const daysAgo = (d: number) => new Date(now - d * 86400000);
    const daysAhead = (d: number) => new Date(now + d * 86400000);

    // 3. Create 30 Tasks across different statuses
    const tasksData = [
      // --- Project 1: TeamFlow Core Platform (18 Tasks) ---
      {
        project: project1._id,
        title: 'Design database schema for tasks and activity history',
        description: 'Define Mongoose models for Tasks, Comments, Sessions, and immutable audit logs.',
        status: 'Done' as TaskStatus,
        priority: 'High' as TaskPriority,
        assignee: bob._id,
        creator: alice._id,
        dueDate: daysAgo(10),
      },
      {
        project: project1._id,
        title: 'Implement JWT authentication with token revocation',
        description: 'Support login, registration, logout with session tracking in DB to block reuse.',
        status: 'Done' as TaskStatus,
        priority: 'Critical' as TaskPriority,
        assignee: bob._id,
        creator: alice._id,
        dueDate: daysAgo(5),
      },
      {
        project: project1._id,
        title: 'Create Kanban Board view with drag/drop and status update',
        description: 'Build responsive columns for Backlog, To Do, In Progress, Done with cards.',
        status: 'In Progress' as TaskStatus,
        priority: 'High' as TaskPriority,
        assignee: charlie._id,
        creator: alice._id,
        dueDate: daysAhead(2),
      },
      {
        project: project1._id,
        title: 'Implement Optimistic Concurrency Control (OCC)',
        description: 'Detect conflicting edits when two users modify the same task simultaneously.',
        status: 'In Progress' as TaskStatus,
        priority: 'Critical' as TaskPriority,
        assignee: bob._id,
        creator: alice._id,
        dueDate: daysAhead(1),
      },
      {
        project: project1._id,
        title: 'Build task filter and server-side pagination table',
        description: 'Provide filters by status, priority, assignee, and overdue status with URL sync.',
        status: 'To Do' as TaskStatus,
        priority: 'Medium' as TaskPriority,
        assignee: charlie._id,
        creator: bob._id,
        dueDate: daysAhead(4),
      },
      {
        project: project1._id,
        title: 'Fix edge-case: Unassign tasks when member removed',
        description: 'Removing a team member must revoke project access and unset their task assignments.',
        status: 'In Progress' as TaskStatus,
        priority: 'High' as TaskPriority,
        assignee: bob._id,
        creator: alice._id,
        dueDate: daysAgo(2), // OVERDUE!
      },
      {
        project: project1._id,
        title: 'Implement project dashboard with summary KPIs',
        description: 'Compute whole-project counts for total tasks, overdue tasks, and status breakdown.',
        status: 'To Do' as TaskStatus,
        priority: 'Medium' as TaskPriority,
        assignee: charlie._id,
        creator: alice._id,
        dueDate: daysAgo(1), // OVERDUE!
      },
      {
        project: project1._id,
        title: 'Rate limiting for authentication endpoints',
        description: 'Limit brute force attempts on login/register endpoints.',
        status: 'Done' as TaskStatus,
        priority: 'Medium' as TaskPriority,
        assignee: bob._id,
        creator: alice._id,
        dueDate: daysAgo(7),
      },
      {
        project: project1._id,
        title: 'Add comment section to task details modal',
        description: 'Allow users to comment on tasks and delete their own comments or owners delete any.',
        status: 'In Progress' as TaskStatus,
        priority: 'Medium' as TaskPriority,
        assignee: charlie._id,
        creator: bob._id,
        dueDate: daysAhead(3),
      },
      {
        project: project1._id,
        title: 'Implement activity log feed for project actions',
        description: 'Store previous/new values for status changes, reassignments, member additions.',
        status: 'Done' as TaskStatus,
        priority: 'High' as TaskPriority,
        assignee: bob._id,
        creator: alice._id,
        dueDate: daysAgo(4),
      },
      {
        project: project1._id,
        title: 'Setup automated integration tests with isolated test database',
        description: 'Write Supertest suites covering all 8 required scenarios from the brief.',
        status: 'To Do' as TaskStatus,
        priority: 'Critical' as TaskPriority,
        assignee: bob._id,
        creator: alice._id,
        dueDate: daysAhead(5),
      },
      {
        project: project1._id,
        title: 'Enforce team permissions: Owner vs Member restrictions',
        description: 'Ensure members cannot edit other users tasks or reassign tasks.',
        status: 'Done' as TaskStatus,
        priority: 'Critical' as TaskPriority,
        assignee: alice._id,
        creator: alice._id,
        dueDate: daysAgo(6),
      },
      {
        project: project1._id,
        title: 'Implement confirmation dialogs for destructive actions',
        description: 'Prompt user before deleting tasks, comments, or removing team members.',
        status: 'To Do' as TaskStatus,
        priority: 'Low' as TaskPriority,
        assignee: charlie._id,
        creator: alice._id,
        dueDate: daysAhead(7),
      },
      {
        project: project1._id,
        title: 'Accessibility audit for keyboard navigation',
        description: 'Ensure visible focus rings and accessible aria labels on all interactive elements.',
        status: 'Backlog' as TaskStatus,
        priority: 'Low' as TaskPriority,
        assignee: null,
        creator: charlie._id,
        dueDate: null,
      },
      {
        project: project1._id,
        title: 'Write comprehensive AI_USAGE.md documentation',
        description: 'Document tools, prompts, verification techniques, and rejected suggestions.',
        status: 'To Do' as TaskStatus,
        priority: 'Medium' as TaskPriority,
        assignee: alice._id,
        creator: alice._id,
        dueDate: daysAhead(6),
      },
      {
        project: project1._id,
        title: 'Resolve race condition on concurrent task deletion',
        description: 'Ensure deleted tasks leave a readable record in project activity feed.',
        status: 'Done' as TaskStatus,
        priority: 'High' as TaskPriority,
        assignee: bob._id,
        creator: alice._id,
        dueDate: daysAgo(3),
      },
      {
        project: project1._id,
        title: 'Audit Docker compose configuration for production preview',
        description: 'Optional container setup for staging deployment.',
        status: 'Backlog' as TaskStatus,
        priority: 'Low' as TaskPriority,
        assignee: null,
        creator: bob._id,
        dueDate: null,
      },
      {
        project: project1._id,
        title: 'Investigate WebSockets for optional real-time updates',
        description: 'Research live synchronization trade-offs vs polling.',
        status: 'Backlog' as TaskStatus,
        priority: 'Low' as TaskPriority,
        assignee: null,
        creator: charlie._id,
        dueDate: null,
      },

      // --- Project 2: Mobile App Redesign (12 Tasks) ---
      {
        project: project2._id,
        title: 'Mobile navigation header and responsive bottom drawer',
        description: 'Create responsive navigation for small screen viewports.',
        status: 'Done' as TaskStatus,
        priority: 'High' as TaskPriority,
        assignee: charlie._id,
        creator: bob._id,
        dueDate: daysAgo(8),
      },
      {
        project: project2._id,
        title: 'Setup mobile offline sync with SQLite local storage',
        description: 'Cache tasks locally when network disconnects.',
        status: 'In Progress' as TaskStatus,
        priority: 'Critical' as TaskPriority,
        assignee: bob._id,
        creator: bob._id,
        dueDate: daysAgo(3), // OVERDUE!
      },
      {
        project: project2._id,
        title: 'Touch gesture swipe to change task status',
        description: 'Enable swipe left/right on cards to transition between Backlog, In Progress, Done.',
        status: 'To Do' as TaskStatus,
        priority: 'Medium' as TaskPriority,
        assignee: charlie._id,
        creator: bob._id,
        dueDate: daysAhead(4),
      },
      {
        project: project2._id,
        title: 'Push notifications for task mentions and status updates',
        description: 'Integrate FCM for real-time mobile push notifications.',
        status: 'Backlog' as TaskStatus,
        priority: 'Medium' as TaskPriority,
        assignee: null,
        creator: bob._id,
        dueDate: daysAhead(14),
      },
      {
        project: project2._id,
        title: 'Mobile UI dark mode theme tokens',
        description: 'Support seamless light and dark color schemes matching system preference.',
        status: 'Done' as TaskStatus,
        priority: 'Low' as TaskPriority,
        assignee: charlie._id,
        creator: charlie._id,
        dueDate: daysAgo(5),
      },
      {
        project: project2._id,
        title: 'Automated end-to-end mobile smoke tests',
        description: 'Verify login and task creation flows on simulated mobile devices.',
        status: 'In Progress' as TaskStatus,
        priority: 'High' as TaskPriority,
        assignee: dana._id,
        creator: bob._id,
        dueDate: daysAhead(2),
      },
      {
        project: project2._id,
        title: 'Fix touch target sizing for task action buttons',
        description: 'Increase clickable touch targets to at least 44x44px for WCAG compliance.',
        status: 'Done' as TaskStatus,
        priority: 'Medium' as TaskPriority,
        assignee: charlie._id,
        creator: dana._id,
        dueDate: daysAgo(4),
      },
      {
        project: project2._id,
        title: 'Implement haptic feedback on task completion',
        description: 'Trigger gentle vibration upon dragging a task into the Done column.',
        status: 'Backlog' as TaskStatus,
        priority: 'Low' as TaskPriority,
        assignee: null,
        creator: bob._id,
        dueDate: null,
      },
      {
        project: project2._id,
        title: 'Optimize image attachments and avatar compression',
        description: 'Serve WebP responsive images to minimize cellular mobile data usage.',
        status: 'To Do' as TaskStatus,
        priority: 'Low' as TaskPriority,
        assignee: dana._id,
        creator: bob._id,
        dueDate: daysAhead(6),
      },
      {
        project: project2._id,
        title: 'Deep linking for task URL routing',
        description: 'Allow clicking shared task URLs to directly open the specific task modal.',
        status: 'In Progress' as TaskStatus,
        priority: 'High' as TaskPriority,
        assignee: alice._id,
        creator: bob._id,
        dueDate: daysAgo(1), // OVERDUE!
      },
      {
        project: project2._id,
        title: 'Crash reporting and error telemetry integration',
        description: 'Configure Sentry telemetry for mobile crash reporting.',
        status: 'Done' as TaskStatus,
        priority: 'Medium' as TaskPriority,
        assignee: dana._id,
        creator: bob._id,
        dueDate: daysAgo(9),
      },
      {
        project: project2._id,
        title: 'App Store submission checklist and privacy policy',
        description: 'Prepare screenshots, descriptions, and privacy declarations.',
        status: 'Backlog' as TaskStatus,
        priority: 'High' as TaskPriority,
        assignee: bob._id,
        creator: bob._id,
        dueDate: daysAhead(20),
      },
    ];

    const createdTasks = await Task.create(tasksData);
    console.log(`📋 Created ${createdTasks.length} tasks across various statuses and priorities`);

    // 4. Create sample comments
    const sampleComments = [
      {
        task: createdTasks[0]._id,
        project: project1._id,
        author: bob._id,
        content: 'I have finalized the schema draft with optimistic concurrency control fields.',
      },
      {
        task: createdTasks[0]._id,
        project: project1._id,
        author: alice._id,
        content: 'Looks great! Make sure compound indexes are applied on project and status.',
      },
      {
        task: createdTasks[2]._id,
        project: project1._id,
        author: charlie._id,
        content: 'Kanban columns are responsive and support keyboard-accessible tab switches.',
      },
      {
        task: createdTasks[3]._id,
        project: project1._id,
        author: bob._id,
        content: 'OCC tested with simultaneous requests. It reliably throws 409 Conflict.',
      },
      {
        task: createdTasks[18]._id,
        project: project2._id,
        author: dana._id,
        content: 'Smoke test pipeline passed on Android and iOS simulators.',
      },
    ];

    await Comment.create(sampleComments);
    console.log(`💬 Created ${sampleComments.length} sample comments`);

    // 5. Create initial activity records
    const sampleActivities = [
      {
        project: project1._id,
        task: createdTasks[0]._id,
        taskTitle: createdTasks[0].title,
        user: alice._id,
        userName: alice.name,
        action: 'TASK_CREATED',
        details: { description: `Created task "${createdTasks[0].title}"` },
      },
      {
        project: project1._id,
        task: createdTasks[0]._id,
        taskTitle: createdTasks[0].title,
        user: bob._id,
        userName: bob.name,
        action: 'STATUS_CHANGED',
        details: { previousValue: 'In Progress', newValue: 'Done', field: 'status' },
      },
      {
        project: project1._id,
        task: createdTasks[2]._id,
        taskTitle: createdTasks[2].title,
        user: alice._id,
        userName: alice.name,
        action: 'ASSIGNMENT_CHANGED',
        details: { previousValue: 'Unassigned', newValue: 'Charlie Davis', field: 'assignee' },
      },
      {
        project: project1._id,
        user: alice._id,
        userName: alice.name,
        action: 'MEMBER_ADDED',
        details: { description: 'Added Charlie Davis to TeamFlow Core Platform', targetUserName: 'Charlie Davis' },
      },
      {
        project: project2._id,
        task: createdTasks[18]._id,
        taskTitle: createdTasks[18].title,
        user: bob._id,
        userName: bob.name,
        action: 'TASK_CREATED',
        details: { description: `Created task "${createdTasks[18].title}"` },
      },
      {
        project: project2._id,
        user: bob._id,
        userName: bob.name,
        action: 'MEMBER_ADDED',
        details: { description: 'Added Dana Lee to Mobile App Redesign', targetUserName: 'Dana Lee' },
      },
    ];

    await Activity.create(sampleActivities);
    console.log(`📜 Created ${sampleActivities.length} activity audit log records`);

    console.log('\n=============================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('=============================================');
    console.log('Demo Accounts:');
    console.log('  1. alice@example.com   | Password123! (Owner of TeamFlow Core Platform)');
    console.log('  2. bob@example.com     | Password123! (Owner of Mobile App Redesign)');
    console.log('  3. charlie@example.com | Password123! (Team Member)');
    console.log('  4. dana@example.com    | Password123! (Team Member / QA)');
    console.log('=============================================\n');

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    await disconnectDatabase();
    process.exit(1);
  }
};

seed();
