import request from 'supertest';
import app from '../../src/app';

describe('7. Task Changes & Activity History Consistency Tests', () => {
  let ownerToken: string;
  let memberToken: string;
  let memberUserId: string;
  let projectId: string;

  beforeEach(async () => {
    // Owner
    const ownerRes = await request(app).post('/api/auth/register').send({
      name: 'Alice Activity',
      email: 'alice.act@teamflow.local',
      password: 'Password123!',
    });
    ownerToken = ownerRes.body.token;

    // Member
    const memberRes = await request(app).post('/api/auth/register').send({
      name: 'Bob Activity',
      email: 'bob.act@teamflow.local',
      password: 'Password123!',
    });
    memberToken = memberRes.body.token;
    memberUserId = memberRes.body.user.id;

    // Project
    const projRes = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Activity Logging Project' });
    projectId = projRes.body.project._id;

    // Add Bob to project
    await request(app)
      .post(`/api/projects/${projectId}/members`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ email: 'bob.act@teamflow.local' });
  });

  it('should automatically record TASK_CREATED activity when task is created', async () => {
    const taskRes = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Build Activity Feed' });

    expect(taskRes.status).toBe(201);
    const taskId = taskRes.body.task._id;

    const actRes = await request(app)
      .get(`/api/projects/${projectId}/activity`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(actRes.status).toBe(200);
    const createLog = actRes.body.activities.find((a: any) => a.action === 'TASK_CREATED');
    expect(createLog).toBeDefined();
    expect(createLog.taskTitle).toBe('Build Activity Feed');
    expect(createLog.userName).toBe('Alice Activity');
  });

  it('should record STATUS_CHANGED activity with previous and new values', async () => {
    const taskRes = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Status Tracking Task', status: 'To Do' });
    const taskId = taskRes.body.task._id;

    // Change status
    const updateRes = await request(app)
      .patch(`/api/tasks/${taskId}/status`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ status: 'Done', version: 1 });
    expect(updateRes.status).toBe(200);

    const actRes = await request(app)
      .get(`/api/projects/${projectId}/activity`)
      .set('Authorization', `Bearer ${ownerToken}`);

    const statusLog = actRes.body.activities.find((a: any) => a.action === 'STATUS_CHANGED');
    expect(statusLog).toBeDefined();
    expect(statusLog.details.previousValue).toBe('To Do');
    expect(statusLog.details.newValue).toBe('Done');
    expect(statusLog.details.field).toBe('status');
  });

  it('REASONING CHECK: Consistency check - failed task update must NOT create activity record', async () => {
    const taskRes = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'OCC Fail Task', status: 'To Do' });
    const taskId = taskRes.body.task._id;

    // Get current activity count
    const initialActRes = await request(app)
      .get(`/api/projects/${projectId}/activity`)
      .set('Authorization', `Bearer ${ownerToken}`);
    const initialCount = initialActRes.body.total;

    // Attempt invalid update with mismatched version -> fails with 409
    const failedUpdate = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ status: 'Done', version: 999 }); // Invalid version!

    expect(failedUpdate.status).toBe(409);

    // Verify activity count has NOT changed
    const postActRes = await request(app)
      .get(`/api/projects/${projectId}/activity`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(postActRes.body.total).toBe(initialCount);
  });

  it('Deleted tasks must leave a readable activity record with the preserved task title', async () => {
    const taskRes = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Task Destined For Deletion' });
    const taskId = taskRes.body.task._id;

    // Delete task
    const delRes = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(delRes.status).toBe(200);

    // Check activity log
    const actRes = await request(app)
      .get(`/api/projects/${projectId}/activity`)
      .set('Authorization', `Bearer ${ownerToken}`);

    const deleteLog = actRes.body.activities.find((a: any) => a.action === 'TASK_DELETED');
    expect(deleteLog).toBeDefined();
    expect(deleteLog.taskTitle).toBe('Task Destined For Deletion');
    expect(deleteLog.details.description).toContain('Deleted task "Task Destined For Deletion"');
  });
});
