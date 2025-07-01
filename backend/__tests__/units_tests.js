const request = require('supertest');
const app = require('../server');

describe('API Endpoints', () => {
  let token;
  const adminCredentials = { email: 'admin@test.com', password: 'password' };

  // Health check
  describe('GET /health', () => {
    it('should return status OK', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'OK');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  // 404 fallback
  describe('Unknown route', () => {
    it('should return 404 for missing route', async () => {
      const res = await request(app).get('/unknown');
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Route non trouvée');
    });
  });

  // Authentication
  describe('Authentication', () => {
    it('should login existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send(adminCredentials);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', adminCredentials.email);
      token = res.body.token;
    });

    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'admin@test.com', password: 'wrong' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Identifiants invalides');
    });

    it('should register a new user', async () => {
      const newUser = { email: 'user@test.com', password: 'pass123', name: 'Test User' };
      const res = await request(app)
        .post('/api/auth/register')
        .send(newUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body).toHaveProperty('user');
      expect(res.body.user).toHaveProperty('email', newUser.email);
    });

    it('should not register an existing user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(adminCredentials);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Utilisateur déjà existant');
    });
  });

  // Protected routes
  describe('Tasks Endpoints', () => {
    it('should get all tasks', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should get a specific task', async () => {
      const res = await request(app)
        .get('/api/tasks/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('id', '1');
    });

    it('should return 404 for non-existing task', async () => {
      const res = await request(app)
        .get('/api/tasks/999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Tâche non trouvée');
    });

    it('should create a new task', async () => {
      const taskData = { title: 'New Task', description: 'Test', priority: 'high' };
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send(taskData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('title', 'New Task');
      expect(res.body).toHaveProperty('status', 'todo');
    });

    it('should not create task without title', async () => {
      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ description: 'No title' });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error', 'Le titre est requis');
    });

    it('should update an existing task', async () => {
      // First create
      const { body: newTask } = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task to update' });

      const res = await request(app)
        .put(`/api/tasks/${newTask.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'done' });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'done');
    });

    it('should return 404 when updating non-existing task', async () => {
      const res = await request(app)
        .put('/api/tasks/999')
        .set('Authorization', `Bearer ${token}`)
        .send({ status: 'done' });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Tâche non trouvée');
    });

    it('should delete an existing task', async () => {
      // Create to delete
      const { body: taskToDelete } = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Task to delete' });

      const res = await request(app)
        .delete(`/api/tasks/${taskToDelete.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(204);
    });

    it('should return 404 when deleting non-existing task', async () => {
      const res = await request(app)
        .delete('/api/tasks/999')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error', 'Tâche non trouvée');
    });
  });

  // Users endpoint
  describe('GET /api/users', () => {
    it('should return users without passwords', async () => {
      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      res.body.forEach(user => {
        expect(user).not.toHaveProperty('password');
      });
    });
  });
});
