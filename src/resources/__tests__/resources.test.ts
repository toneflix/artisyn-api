import Resource, { ApiResource } from '../index';

import app from '../../index'
import request from 'supertest'

describe('Test dynamic routing system', () => {
  beforeAll(() => {
    app.get('/tester', (req, res) => {
      Resource(req, res, {
        version: '1.0.0',
      }).json()
    });

    app.get('/tester/context', (req, res) => {
      Resource(req, res, {
        version: '1.0.0',
      }).json().additional({
        status: 'success',
      })
    });
  });

  it('should render resource', async () => {
    const response = await request(app).get('/tester');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('data.version', '1.0.0');
  });

  it('should pass context data to rendered resource', async () => {
    const response = await request(app).get('/tester/context');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('status', 'success');
  });
});
