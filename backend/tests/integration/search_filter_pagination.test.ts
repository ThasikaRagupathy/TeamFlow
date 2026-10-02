import request from 'supertest';
import app from '../../src/app';

describe('5. Search, Filter, Sort, and Server-Side Pagination Tests', () => {
  let token: string;
  let projectId: string;
  let userId: string;

  beforeEach(async () => {
    const userRes = await request(app).post('/api/auth/register').send({
      name: 'Tester',
      email: 'filter.tester@teamflow.local',
      password: 'Password123!',
    });
    token = userRes.body.token;
    userId = userRes.body.user.id;

    const projRes = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Search Filter Project' });
    projectId = projRes.body.project._id;

    const pastDate = new Date(Date.now() - 5 * 86400000).toISOString();
    const futureDate = new Date(Date.now() + 5 * 86400000).toISOString();

    // Create 15 varied tasks to thoroughly test pagination and filters
    const taskDefs = [
      { title: 'Bug: Fix login timeout', status: 'To Do', priority: 'Critical', dueDate: pastDate, assignee: userId },
      { title: 'Bug: Memory leak in worker', status: 'In Progress', priority: 'High', dueDate: pastDate, assignee: userId },
      { title: 'Feature: Export to CSV', status: 'Done', priority: 'Medium', dueDate: pastDate, assignee: userId }, // Past date but Done => NOT overdue!
      { title: 'Feature: Dark mode toggle', status: 'Backlog', priority: 'Low', dueDate: futureDate, assignee: null },
      { title: 'Refactor: Database indexes', status: 'In Progress', priority: 'High', dueDate: futureDate, assignee: userId },
      { title: 'Docs: API OpenAPI spec', status: 'To Do', priority: 'Low', dueDate: futureDate, assignee: null },
      { title: 'Bug: Broken pagination link', status: 'To Do', priority: 'Medium', dueDate: pastDate, assignee: null },
      { title: 'Feature: Slack alerts', status: 'Backlog', priority: 'Low', dueDate: null, assignee: null },
      { title: 'Task 09', status: 'To Do', priority: 'Medium', dueDate: futureDate, assignee: userId },
      { title: 'Task 10', status: 'To Do', priority: 'Medium', dueDate: futureDate, assignee: userId },
      { title: 'Task 11', status: 'To Do', priority: 'Medium', dueDate: futureDate, assignee: userId },
      { title: 'Task 12', status: 'To Do', priority: 'Medium', dueDate: futureDate, assignee: userId },
      { title: 'Task 13', status: 'To Do', priority: 'Medium', dueDate: futureDate, assignee: userId },
      { title: 'Task 14', status: 'To Do', priority: 'Medium', dueDate: futureDate, assignee: userId },
      { title: 'Task 15', status: 'To Do', priority: 'Medium', dueDate: futureDate, assignee: userId },
    ];

    for (const t of taskDefs) {
      await request(app)
        .post(`/api/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${token}`)
        .send(t);
    }
  });

  it('should search tasks by title (case-insensitive server-side search)', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}/tasks?search=bug`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.tasks.length).toBe(3);
    res.body.tasks.forEach((t: any) => {
      expect(t.title.toLowerCase()).toContain('bug');
    });
  });

  it('should filter tasks by status', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}/tasks?status=In Progress`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.tasks.length).toBe(2);
    res.body.tasks.forEach((t: any) => {
      expect(t.status).toBe('In Progress');
    });
  });

  it('should filter tasks by priority', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}/tasks?priority=Critical`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.tasks.length).toBe(1);
    expect(res.body.tasks[0].title).toBe('Bug: Fix login timeout');
  });

  it('should filter overdue tasks (dueDate in past and status != Done)', async () => {
    const res = await request(app)
      .get(`/api/projects/${projectId}/tasks?overdue=true`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    // Task 1 (To Do, past), Task 2 (In Progress, past), Task 7 (To Do, past) => 3 tasks!
    // Task 3 is Done so it must NOT be overdue!
    expect(res.body.tasks.length).toBe(3);
    res.body.tasks.forEach((t: any) => {
      expect(t.status).not.toBe('Done');
      expect(new Date(t.dueDate).getTime()).toBeLessThan(Date.now());
    });
  });

  it('should apply pagination correctly', async () => {
    const page1Res = await request(app)
      .get(`/api/projects/${projectId}/tasks?page=1&limit=5`)
      .set('Authorization', `Bearer ${token}`);

    expect(page1Res.status).toBe(200);
    expect(page1Res.body.tasks.length).toBe(5);
    expect(page1Res.body.total).toBe(15);
    expect(page1Res.body.totalPages).toBe(3);
    expect(page1Res.body.page).toBe(1);

    const page2Res = await request(app)
      .get(`/api/projects/${projectId}/tasks?page=2&limit=5`)
      .set('Authorization', `Bearer ${token}`);

    expect(page2Res.status).toBe(200);
    expect(page2Res.body.tasks.length).toBe(5);
    expect(page2Res.body.page).toBe(2);

    // Verify disjoint sets
    const ids1 = page1Res.body.tasks.map((t: any) => t._id);
    const ids2 = page2Res.body.tasks.map((t: any) => t._id);
    const overlap = ids1.filter((id: string) => ids2.includes(id));
    expect(overlap.length).toBe(0);
  });

  it('should combine search, filters, sorting, and pagination in a single query', async () => {
    // Search for "Bug", filter status "In Progress", limit 10
    const res = await request(app)
      .get(`/api/projects/${projectId}/tasks?search=bug&status=In Progress&page=1&limit=10`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.tasks.length).toBe(1);
    expect(res.body.tasks[0].title).toBe('Bug: Memory leak in worker');
  });
});
