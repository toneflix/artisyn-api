import request from 'supertest';
import express from 'express';
import { getRateLimiter } from '../rateLimiter';

describe('Rate Limiter Middleware', () => {
  let app: express.Express;
  beforeEach(() => {
    app = express();
    app.use(getRateLimiter('guest'));
    app.get('/', (_req, res) => { res.send('ok'); });
  });

  it('should allow requests under the limit', async () => {
    for (let i = 0; i < 5; i++) {
      const res = await request(app).get('/');
      expect(res.status).toBe(200);
    }
  });

  it('should block requests over the limit', async () => {
    for (let i = 0; i < 31; i++) {
      await request(app).get('/');
    }
    const res = await request(app).get('/');
    expect(res.status).toBe(429);
    expect(res.body.error).toBeDefined();
  });
});
