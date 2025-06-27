# Artisyn API Security & Rate Limiting

## Rate Limiting
- **Tiered limits**: Different rate limits for guests, users, and admins.
- **429 response**: Exceeding the limit returns a 429 error.

## Request Validation
- Centralized validation using `express-validator`.
- Invalid requests return 400 with error details.

## IP-Based Blocking
- Abusive IPs are blocked in-memory (extendable to persistent storage).
- Blocked IPs receive a 403 error.

## API Key Management
- API key required for protected external endpoints (via `x-api-key` header).
- Keys are securely checked (move to DB or vault for production).

## Security Headers
- Sets headers: `X-Content-Type-Options`, `X-Frame-Options`, `X-XSS-Protection`, `Strict-Transport-Security`, `Referrer-Policy`, `Content-Security-Policy`.

## Monitoring & Alerting
- Monitors error rates per IP and logs alerts if abuse threshold is exceeded.
- Abuse counts reset hourly.

## Logging
- Security events (4xx/5xx) are logged with method, URL, status, duration, and IP.

## Penetration Testing
- Security-focused tests should be added in `src/__tests__/security.test.ts` (see below for template).

## Usage
- Middleware is applied globally in `src/index.ts`.
- Customize rate limits and API key protection per route as needed.

---

# Example Security Test Template
```typescript
import request from 'supertest';
import app from '../index';

describe('Security & Rate Limiting', () => {
  it('should block requests after exceeding rate limit', async () => {
    for (let i = 0; i < 35; i++) {
      await request(app).get('/').send();
    }
    const res = await request(app).get('/').send();
    expect(res.status).toBe(429);
  });

  it('should block abusive IPs', async () => {
    // Simulate IP block (use blockIP from ipBlocker)
  });

  it('should reject requests with invalid API key', async () => {
    const res = await request(app)
      .get('/api/external')
      .set('x-api-key', 'invalid')
      .send();
    expect(res.status).toBe(401);
  });
});
```

---

# API Usage Policies
- Respect rate limits and security headers.
- Use valid API keys for protected endpoints.
- Abusive behavior will result in IP blocking.
