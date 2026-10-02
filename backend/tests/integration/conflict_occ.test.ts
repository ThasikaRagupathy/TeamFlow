import request from 'supertest';
import app from '../../src/app';

describe('6. Optimistic Concurrency Control (OCC) & Conflict Detection Tests', () => {
  let user1Token: string;
  let user2Token: string;
  let projectId: string;
  let taskId: string;

  beforeEach(async () => {
    // User 1 (Alice)
    const u1 = await request(app).post('/api/auth/register').send({
      name: 'Alice User',
      email: 'alice.occ@teamflow.local',
      password: 'Password123!',
    });
    user1Token = u1.body.token;

    // User 2 (Bob)
    const u2 = await request(app).post('/api/auth/register').send({
      name: 'Bob User',
      email: 'bob.occ@teamflow.local',
      password: 'Password123!',
    });
    user2Token = u2.body.token;

    // Project by Alice
    const proj = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ name: 'OCC Project' });
    projectId = proj.body.project._id;

    // Add Bob to project
    await request(app)
      .post(`/api/projects/${projectId}/members`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({ email: 'bob.occ@teamflow.local' });

    // Create initial task (Version 1)
    const taskRes = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Initial Concurrency Test Task',
        description: 'Original description',
        status: 'To Do',
      });
    taskId = taskRes.body.task._id;
  });

  it('REASONING CHECK: Detection of conflicting updates between two users editing the same task', async () => {
    // Both User 1 and User 2 fetch the task at version 1
    const getAlice = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${user1Token}`);
    expect(getAlice.body.task.version).toBe(1);

    const getBob = await request(app)
      .get(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${user2Token}`);
    expect(getBob.body.task.version).toBe(1);

    // 1. User 1 submits an edit with version 1 -> SUCCEEDS and increments to version 2
    const update1 = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        title: 'Title Updated by Alice',
        version: 1,
      });

    expect(update1.status).toBe(200);
    expect(update1.body.task.title).toBe('Title Updated by Alice');
    expect(update1.body.task.version).toBe(2);

    // 2. User 2 submits an edit with stale version 1 -> MUST BE REJECTED with 409 Conflict
    const update2 = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        status: 'In Progress',
        version: 1, // Stale version!
      });

    expect(update2.status).toBe(409);
    expect(update2.body.message).toContain('Conflict');
    expect(update2.body.message).toContain('reload the latest task');
    expect(update2.body).toHaveProperty('latestTask');
    expect(update2.body.latestTask.version).toBe(2);
    expect(update2.body.latestTask.title).toBe('Title Updated by Alice');

    // 3. User 2 updates their state to version 2 and retries -> SUCCEEDS and increments to version 3
    const retryUpdate = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send({
        status: 'In Progress',
        version: 2, // Latest version
      });

    expect(retryUpdate.status).toBe(200);
    expect(retryUpdate.body.task.status).toBe('In Progress');
    expect(retryUpdate.body.task.version).toBe(3);
  });
});
