import request from 'supertest';
import app from '../index';
import { blockIP } from '../middleware/ipBlocker';

describe('Security & Rate Limiting', () => {
  it('should block requests after exceeding rate limit', async () => {
    for (let i = 0; i < 35; i++) {
      await request(app).get('/').send();
    }
    const res = await request(app).get('/').send();
    expect(res.status).toBe(429);
  });

  it('should block abusive IPs', async () => {
    blockIP('::ffff:127.0.0.1');
    const res = await request(app).get('/').send();
    expect(res.status).toBe(403);
  });

  it('should reject requests with invalid API key', async () => {
    const res = await request(app)
      .get('/api/external')
      .set('x-api-key', 'invalid')
      .send();
    expect(res.status).toBe(401);
  });
});
