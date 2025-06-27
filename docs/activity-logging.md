# Activity Logging System Documentation

## Overview
This system tracks user actions for security, analytics, and auditing. It logs all significant user and system actions, supports querying, exporting, anonymization, and analytics.

## Logged Activities
- All API requests (method, path, user, target, metadata)
- Actions: login, logout, create/update/delete resources, etc.
- Metadata: request body, query, status code, IP, user agent

## Data Retention & Privacy
- Logs are anonymized after 90 days (userId, IP, userAgent removed)
- Logs are deleted after 1 year
- Anonymization is performed by a scheduled job or admin endpoint

## Query & Export
- API: `/api/activity-logs` (filter by user, action, date, anonymized)
- Export: CSV or JSON

## Analytics & Anomaly Detection
- Aggregation: count by action, user, date
- Anomaly: high activity in short window

## Performance
- Indexed fields: userId, action, createdAt, anonymized
- Designed for high-volume log processing

## Maintainers
- See `src/middleware/activityLogger.ts` for logging logic
- See `src/utils/activityRetention.ts` for retention/anonymization
- See `src/utils/activityAnalytics.ts` for analytics
- See `src/utils/activityAnomaly.ts` for anomaly detection
