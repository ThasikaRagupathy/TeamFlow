import request from 'supertest';
import app from '../../src/app';

describe('8. Member Removal, Unassignment, and Access Revocation Tests', () => {
  let ownerToken: string;
  let ownerUserId: string;
  let memberToken: string;
  let memberUserId: string;
  let projectId: string;
  let assignedTaskId: string;
  let commentId: string;

  beforeEach(async () => {
    // 1. Owner
    const ownerRes = await request(app).post('/api/auth/register').send({
      name: 'Owner Alice',
      email: 'alice.rem@teamflow.local',
      password: 'Password123!',
    });
    ownerToken = ownerRes.body.token;
    ownerUserId = ownerRes.body.user.id;

    // 2. Member
    const memberRes = await request(app).post('/api/auth/register').send({
      name: 'Member Bob',
      email: 'bob.rem@teamflow.local',
      password: 'Password123!',
    });
    memberToken = memberRes.body.token;
    memberUserId = memberRes.body.user.id;

    // 3. Project
    const projRes = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Removal Test Project' });
    projectId = projRes.body.project._id;

    // Add Bob to project
    await request(app)
      .post(`/api/projects/${projectId}/members`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ email: 'bob.rem@teamflow.local' });

    // 4. Create task assigned to Member Bob
    const taskRes = await request(app)
      .post(`/api/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        title: 'Task Assigned to Bob',
        assignee: memberUserId,
      });
    assignedTaskId = taskRes.body.task._id;

    // 5. Member Bob posts a comment on the task
    const commentRes = await request(app)
      .post(`/api/tasks/${assignedTaskId}/comments`)
      .set('Authorization', `Bearer ${memberToken}`)
      .send({ content: 'I am working on this task!' });
    commentId = commentRes.body.comment._id;
  });

  it('Owner CANNOT be removed from the project (rejected with 400)', async () => {
    const res = await request(app)
      .delete(`/api/projects/${projectId}/members/${ownerUserId}`)
      .set('Authorization', `Bearer ${ownerToken}`);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('The project owner cannot be removed');
  });

  it('REASONING CHECK: Removing a member clears task assignments and revokes project access', async () => {
    // 1. Verify Bob has access and task assignment before removal
    const preCheckTask = await request(app)
      .get(`/api/tasks/${assignedTaskId}`)
      .set('Authorization', `Bearer ${memberToken}`);
    expect(preCheckTask.status).toBe(200);
    expect(preCheckTask.body.task.assignee._id).toBe(memberUserId);

    // 2. Owner removes Bob from the project
    const removeRes = await request(app)
      .delete(`/api/projects/${projectId}/members/${memberUserId}`)
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(removeRes.status).toBe(200);

    // 3. Verify Bob's access is immediately REVOKED (403 Forbidden)
    const postRemoveAccess = await request(app)
      .get(`/api/projects/${projectId}/tasks`)
      .set('Authorization', `Bearer ${memberToken}`);
    expect(postRemoveAccess.status).toBe(403);
    expect(postRemoveAccess.body.message).toContain('Access denied');

    // 4. Verify Bob's task assignments have been CLEARED (unassigned)
    const checkTaskAsOwner = await request(app)
      .get(`/api/tasks/${assignedTaskId}`)
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(checkTaskAsOwner.status).toBe(200);
    expect(checkTaskAsOwner.body.task.assignee).toBeNull();

    // 5. Verify existing comments by Bob RETAIN after member leaves
    const commentsRes = await request(app)
      .get(`/api/tasks/${assignedTaskId}/comments`)
      .set('Authorization', `Bearer ${ownerToken}`);
    expect(commentsRes.status).toBe(200);
    expect(commentsRes.body.comments.length).toBe(1);
    expect(commentsRes.body.comments[0].content).toBe('I am working on this task!');
    expect(commentsRes.body.comments[0].author._id).toBe(memberUserId);
  });
});
