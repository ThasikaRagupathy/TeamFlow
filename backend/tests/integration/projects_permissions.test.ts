import request from 'supertest';
import app from '../../src/app';

describe('2 & 3. Project Isolation & Owner/Member Permissions Tests', () => {
  let ownerToken: string;
  let memberToken: string;
  let nonMemberToken: string;
  let projectId: string;
  let memberEmail: string;

  beforeEach(async () => {
    // 1. Create Project Owner (Alice)
    const ownerRes = await request(app).post('/api/auth/register').send({
      name: 'Alice Owner',
      email: 'owner@teamflow.local',
      password: 'Password123!',
    });
    ownerToken = ownerRes.body.token;

    // 2. Create Member (Bob)
    memberEmail = 'member@teamflow.local';
    const memberRes = await request(app).post('/api/auth/register').send({
      name: 'Bob Member',
      email: memberEmail,
      password: 'Password123!',
    });
    memberToken = memberRes.body.token;

    // 3. Create Non-Member (Eve from another team)
    const nonMemberRes = await request(app).post('/api/auth/register').send({
      name: 'Eve Outside',
      email: 'eve@outside.local',
      password: 'Password123!',
    });
    nonMemberToken = nonMemberRes.body.token;

    // 4. Create Project by Owner
    const projRes = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        name: 'Alpha Project',
        description: 'Internal project',
      });
    projectId = projRes.body.project._id;

    // 5. Add Bob as member
    await request(app)
      .post(`/api/projects/${projectId}/members`)
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ email: memberEmail });
  });

  describe('Requirement 2: Prevention of access to another team project data', () => {
    it('should deny non-member access to project details with 403', async () => {
      const res = await request(app)
        .get(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${nonMemberToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Access denied');
    });

    it('should deny non-member access to project tasks with 403', async () => {
      const res = await request(app)
        .get(`/api/projects/${projectId}/tasks`)
        .set('Authorization', `Bearer ${nonMemberToken}`);

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Access denied');
    });

    it('should deny non-member access to project dashboard with 403', async () => {
      const res = await request(app)
        .get(`/api/projects/${projectId}/dashboard`)
        .set('Authorization', `Bearer ${nonMemberToken}`);

      expect(res.status).toBe(403);
    });

    it('should deny non-member access to project activity feed with 403', async () => {
      const res = await request(app)
        .get(`/api/projects/${projectId}/activity`)
        .set('Authorization', `Bearer ${nonMemberToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe('Requirement 3: Owner vs Member permission differences', () => {
    it('Owner CAN update project settings', async () => {
      const res = await request(app)
        .patch(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ name: 'Alpha Project Renamed' });

      expect(res.status).toBe(200);
      expect(res.body.project.name).toBe('Alpha Project Renamed');
    });

    it('Member CANNOT update project settings (403)', async () => {
      const res = await request(app)
        .patch(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${memberToken}`)
        .send({ name: 'Hacked Project Name' });

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Forbidden: Only the project owner');
    });

    it('Owner CAN add new members', async () => {
      const charlieRes = await request(app).post('/api/auth/register').send({
        name: 'Charlie New',
        email: 'charlie@teamflow.local',
        password: 'Password123!',
      });

      const res = await request(app)
        .post(`/api/projects/${projectId}/members`)
        .set('Authorization', `Bearer ${ownerToken}`)
        .send({ email: 'charlie@teamflow.local' });

      expect(res.status).toBe(200);
      expect(res.body.project.members.length).toBe(3); // owner, bob, charlie
    });

    it('Member CANNOT add new members (403)', async () => {
      const res = await request(app)
        .post(`/api/projects/${projectId}/members`)
        .set('Authorization', `Bearer ${memberToken}`)
        .send({ email: 'eve@outside.local' });

      expect(res.status).toBe(403);
      expect(res.body.message).toContain('Forbidden: Only the project owner');
    });

    it('Member CANNOT delete project (403)', async () => {
      const res = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${memberToken}`);

      expect(res.status).toBe(403);
    });

    it('Owner CAN delete project', async () => {
      const res = await request(app)
        .delete(`/api/projects/${projectId}`)
        .set('Authorization', `Bearer ${ownerToken}`);

      expect(res.status).toBe(200);
    });
  });
});
