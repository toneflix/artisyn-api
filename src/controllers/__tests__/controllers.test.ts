import UserController from '../UserController';
import app from '../../index'
import request from 'supertest'

describe('Test controllers', () => {
  beforeAll(() => {
    app.get('/tester', new UserController().index);
    app.get('/tester/:id', new UserController().show);
    app.post('/tester', new UserController().create);
    app.put('/tester/:id', new UserController().update);
    app.put('/tester/:id', new UserController().delete);
  });

  it('should access controller index', async () => {
    const response = await request(app).get('/tester');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body.data)).toBeTruthy();
  });

  it('should access controller show', async () => {
    const response = await request(app).get('/tester/1');
    expect(response.statusCode).toBe(200);
  });

  it('should access controller create', async () => {
    const response = await request(app).post('/tester');
    expect(response.statusCode).toBe(201);
  });

  it('should access controller update', async () => {
    const response = await request(app).put('/tester/1');
    expect(response.statusCode).toBe(202);
  });

  it('should access controller delete', async () => {
    const response = await request(app).put('/tester/1');
    expect(response.statusCode).toBe(202);
  });
});
