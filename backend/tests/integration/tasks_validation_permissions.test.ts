import request from 'supertest';
import app from '../../src/app';

describe('4. Task Validation & Assignment Restrictions Tests', () => {
  let ownerToken: string;
  let memberToken: string;
  let outsideToken: string;
  let outsideUserId: string;
  let memberUserId: string;
  let projectId: string;

  beforeEach(async () => {
    // 1. Owner
    const ownerRes = await request(app).post('/api/auth/register').send({
      name: 'Owner Alice',
      email: 'alice@tasks.local',
      password: 'Password123!',
    });
    ownerToken = ownerRes.body.token;

    // 2. Member
    const memberRes = await request(app).post('/api/auth/register').send({
      name: 'Member Bob',
      email: 'bob@tasks.local',
      password: 'Password123!',
    });
    memberToken = memberRes.body.token;
    memberUserId = memberRes.body.user.id;

    // 3. Outsider
    const outsideRes = await request(app).post('/api/auth/register').send({
      name: 'Outside User',
      email: 'outside@tasks.local',
      password: 'Password123!',
    });
    outsideToken = outsideRes.body.token;
    outsideUserId = outsideRes.body.user.id;

    // 4. Project
    const projRes = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Task Test Project' });
    projectId = projRes.body.project._id;

    // Add Bob to project
    await request(app)
      .post(`/api/projects/${projectId}/members`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ email: 'bob@tasks.local' });
  });

  describe('Validation Rules', () => {
    it('should reject task creation with missing title', async () => {
      const res = await request(app)
        .post(`/api/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          description: 'No title provided',
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('Validation failed');
    });

    it('should reject task title exceeding 150 characters', async () => {
      const longTitle = 'a'.repeat(151);
      const res = await request(app)
        .post(`/api/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          title: longTitle,
        });

      expect(res.status).toBe(400);
    });

    it('should reject invalid status or priority values', async () => {
      const res = await request(app)
        .post(`/api/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          title: 'Valid Title',
          status: 'InvalidStatus',
        });

      expect(res.status).toBe(400);
    });
  });

  describe('Assignment Restrictions', () => {
    it('should reject assigning task to a user who is not a project member', async () => {
      const res = await request(app)
        .post(`/api/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          title: 'Task for outsider',
          assignee: outsideUserId,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain('Assignee must be a current member');
    });

    it('should allow owner to create task and assign to project member', async () => {
      const res = await request(app)
        .post(`/api/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          title: 'Task for member Bob',
          assignee: memberUserId,
        });

      expect(res.status).toBe(201);
      expect(res.body.task.assignee._id).toBe(memberUserId);
    });

    it('Member CANNOT assign or reassign tasks (403)', async () => {
      // Create task by owner
      const taskRes = await request(app)
        .post(`/api/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          title: 'Owner Task',
        });
      const taskId = taskRes.body.task._id;

      // Member attempts to assign task
      const assignRes = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .set('Authorization', `Bearer ${memberToken}`)
        .send({
          assignee: memberUserId,
          version: 1,
        });

      expect(assignRes.status).toBe(403);
      expect(assignRes.body.message).toContain('Only project owners can assign or reassign tasks');
    });
  });

  describe('Task Edit & Delete Permissions', () => {
    let ownerTaskId: string;
    let memberTaskId: string;

    beforeEach(async () => {
      // Owner creates task
      const t1 = await request(app)
        .post(`/api/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ title: 'Task by Owner' });
      ownerTaskId = t1.body.task._id;

      // Member creates task
      const t2 = await request(app)
        .post(`/api/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${memberToken}`)
        .send({ title: 'Task by Member' });
      memberTaskId = t2.body.task._id;
    });

    it('Member CAN change status of ANY task', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${ownerTaskId}/status`)
        .set('Authorization', `Bearer ${memberToken}`)
        .send({
          status: 'In Progress',
          version: 1,
        });

      expect(res.status).toBe(200);
      expect(res.body.task.status).toBe('In Progress');
    });

    it('Member CAN edit details of task they created', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${memberTaskId}`)
        .set('Authorization', `Bearer ${memberToken}`)
        .send({
          title: 'Updated Title by Creator',
          description: 'Updated description',
          version: 1,
        });

      expect(res.status).toBe(200);
      expect(res.body.task.title).toBe('Updated Title by Creator');
    });

    it('Member CANNOT edit details of tasks created by other users (403)', async () => {
      const res = await request(app)
        .patch(`/api/tasks/${ownerTaskId}`)
        .set('Authorization', `Bearer ${memberToken}`)
        .send({
          title: 'Malicious Update by Member',
          version: 1,
        });

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Members can only edit tasks they created');
    });

    it('Member CAN delete task they created', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${memberTaskId}`)
        .set('Authorization', `Bearer ${memberToken}`);

      expect(res.status).toBe(200);
    });

    it('Member CANNOT delete tasks created by other users (403)', async () => {
      const res = await request(app)
        .delete(`/api/tasks/${ownerTaskId}`)
        .set('Authorization', `Bearer ${memberToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Members can only delete tasks they created');
    });

    it('Owner CAN edit and delete tasks created by anyone', async () => {
      // Owner edits member's task
      const editRes = await request(app)
        .patch(`/api/tasks/${memberTaskId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({
          title: 'Owner Edits Member Task',
          version: 1,
        });
      expect(editRes.status).toBe(200);

      // Owner deletes member's task
      const delRes = await request(app)
        .delete(`/api/tasks/${memberTaskId}`)
        .set('Authorization', `Bearer ${ownerToken}`);
      expect(delRes.status).toBe(200);
    });
  });
});
