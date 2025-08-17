# API Documentation

## Overview

This document provides comprehensive documentation for all API endpoints in the Interactive Portfolio Website. The API is built using Next.js API routes and follows RESTful conventions where applicable.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://isaacbenyakar.com/api`

## Authentication

Most endpoints are public, but admin endpoints require authentication via NextAuth.js.

### Admin Authentication
```javascript
// Login required for admin endpoints
// Session token must be present in cookies
```

## API Endpoints

### Public Endpoints

#### Contact Form
Submit contact form inquiries.

**Endpoint**: `POST /api/contact`

**Request Body**:
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "subject": "string (required)",
  "message": "string (required)",
  "contactMethod": "email | whatsapp | discord",
  "urgency": "low | medium | high",
  "projectType": "web-development | scraping | crm | analytics | other"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "id": "contact_123456"
}
```

**Error Response**:
```json
{
  "success": false,
  "error": "Validation error",
  "details": {
    "email": "Invalid email format"
  }
}
```

#### Live Metrics
Get real-time project metrics and statistics.

**Endpoint**: `GET /api/live-metrics`

**Query Parameters**:
- `project`: Filter by project ID (optional)
- `timeframe`: `1h | 24h | 7d | 30d` (default: 24h)

**Response**:
```json
{
  "success": true,
  "data": {
    "sundayEdgePro": {
      "accuracy": 89.3,
      "predictions": 847,
      "lastUpdate": "2024-01-15T10:30:00Z"
    },
    "restocktime": {
      "activeMonitors": 156,
      "alertsSent": 23,
      "uptime": 99.8
    },
    "shukOnline": {
      "orders": 45,
      "revenue": 2340.50,
      "conversionRate": 3.2
    }
  }
}
```

#### Scraper Status
Get status of active scrapers and monitoring systems.

**Endpoint**: `GET /api/scraper-status`

**Response**:
```json
{
  "success": true,
  "data": {
    "scrapers": [
      {
        "id": "google_scraper_1",
        "name": "Google Search Results",
        "status": "active",
        "lastRun": "2024-01-15T10:25:00Z",
        "successRate": 98.5,
        "requestsToday": 1247
      }
    ],
    "monitors": [
      {
        "id": "website_monitor_1",
        "url": "https://example.com",
        "status": "online",
        "responseTime": 245,
        "uptime": 99.9
      }
    ]
  }
}
```

#### Health Check
System health and status endpoint.

**Endpoint**: `GET /api/health-check`

**Response**:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "services": {
    "database": "connected",
    "external_apis": "operational",
    "cache": "operational"
  },
  "version": "1.0.0"
}
```

### Analytics Endpoints

#### Track Event
Track custom analytics events.

**Endpoint**: `POST /api/analytics/events`

**Request Body**:
```json
{
  "event": "string (required)",
  "properties": {
    "section": "hero | projects | skills | contact",
    "action": "view | click | scroll | interact",
    "value": "number (optional)"
  },
  "userId": "string (optional)",
  "sessionId": "string (required)"
}
```

**Response**:
```json
{
  "success": true,
  "eventId": "evt_123456"
}
```

#### Get Analytics Data
Retrieve analytics data (public summary).

**Endpoint**: `GET /api/analytics`

**Query Parameters**:
- `timeframe`: `1d | 7d | 30d | 90d`
- `metric`: `pageviews | sessions | events | conversions`

**Response**:
```json
{
  "success": true,
  "data": {
    "pageviews": 1247,
    "sessions": 892,
    "bounceRate": 0.34,
    "avgSessionDuration": 185,
    "topSections": [
      {"section": "projects", "views": 456},
      {"section": "skills", "views": 234}
    ]
  }
}
```

### Admin Endpoints

All admin endpoints require authentication and admin role.

#### Project Management

**Get Projects**: `GET /api/admin/projects`
**Create Project**: `POST /api/admin/projects`
**Update Project**: `PUT /api/admin/projects/[id]`
**Delete Project**: `DELETE /api/admin/projects/[id]`

**Project Schema**:
```json
{
  "id": "string",
  "title": "string (required)",
  "description": "string (required)",
  "technologies": ["string"],
  "liveUrl": "string (optional)",
  "githubUrl": "string (optional)",
  "images": ["string"],
  "featured": "boolean",
  "status": "active | completed | archived",
  "metrics": {
    "views": "number",
    "clicks": "number",
    "conversions": "number"
  },
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

#### Analytics Dashboard

**Get Dashboard Data**: `GET /api/admin/analytics`

**Response**:
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalVisitors": 5247,
      "totalPageviews": 12456,
      "avgSessionDuration": 245,
      "bounceRate": 0.32
    },
    "traffic": {
      "sources": [
        {"source": "direct", "visitors": 2134},
        {"source": "google", "visitors": 1876}
      ],
      "devices": [
        {"device": "desktop", "percentage": 65},
        {"device": "mobile", "percentage": 35}
      ]
    },
    "engagement": {
      "topPages": [
        {"page": "/", "views": 3456},
        {"page": "/#projects", "views": 2134}
      ],
      "events": [
        {"event": "contact_form_submit", "count": 23},
        {"event": "project_view", "count": 156}
      ]
    }
  }
}
```

#### Metrics Management

**Get Metrics**: `GET /api/admin/metrics`
**Update Metrics**: `PUT /api/admin/metrics/[id]`
**Refresh Metrics**: `POST /api/admin/metrics/refresh`

#### File Upload

**Upload File**: `POST /api/admin/upload`

**Request**: Multipart form data with file
**Response**:
```json
{
  "success": true,
  "url": "https://storage.example.com/file.jpg",
  "filename": "file.jpg",
  "size": 1024000
}
```

#### Backup and Restore

**Create Backup**: `POST /api/admin/backup`
**Restore Backup**: `POST /api/admin/restore`

### Real-time Endpoints

#### WebSocket Connection
Real-time updates for live metrics and notifications.

**Endpoint**: `GET /api/websocket`

**Connection**: WebSocket upgrade
**Messages**:
```json
{
  "type": "metric_update",
  "data": {
    "project": "sundayEdgePro",
    "metric": "accuracy",
    "value": 89.4,
    "timestamp": "2024-01-15T10:35:00Z"
  }
}
```

#### Real-time Analytics

**Get Real-time Visitors**: `GET /api/analytics/real-time/visitors`
**Get Real-time Metrics**: `GET /api/analytics/real-time/metrics`

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {
    "field": "Specific error details"
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### Common Error Codes

- `VALIDATION_ERROR`: Request validation failed
- `AUTHENTICATION_REQUIRED`: Authentication needed
- `AUTHORIZATION_FAILED`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMITED`: Too many requests
- `INTERNAL_ERROR`: Server error
- `SERVICE_UNAVAILABLE`: External service unavailable

## Rate Limiting

- **General endpoints**: 100 requests per 15 minutes per IP
- **Admin endpoints**: 20 requests per 15 minutes per IP
- **Contact form**: 5 submissions per hour per IP

Rate limit headers:
- `X-RateLimit-Limit`: Request limit
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Reset timestamp

## CORS Policy

- **Allowed Origins**: 
  - `https://isaacbenyakar.com`
  - `https://www.isaacbenyakar.com`
  - `http://localhost:3000` (development)
- **Allowed Methods**: `GET, POST, PUT, DELETE, OPTIONS`
- **Allowed Headers**: `Content-Type, Authorization, X-Requested-With`

## Security

### Headers
All responses include security headers:
- `Strict-Transport-Security`
- `Content-Security-Policy`
- `X-Content-Type-Options`
- `X-Frame-Options`
- `X-XSS-Protection`

### Input Validation
- All inputs are validated using Zod schemas
- SQL injection protection via parameterized queries
- XSS protection via input sanitization
- File upload restrictions and scanning

### Authentication
- JWT tokens via NextAuth.js
- Secure session management
- CSRF protection
- Role-based access control

## Testing

### Test Endpoints
```bash
# Health check
curl https://isaacbenyakar.com/api/health-check

# Contact form (POST)
curl -X POST https://isaacbenyakar.com/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message"}'

# Live metrics
curl https://isaacbenyakar.com/api/live-metrics
```

### Test Data
Development environment includes test data for:
- Sample projects
- Mock analytics data
- Test user accounts
- Simulated live metrics

## Changelog

### Version 1.0.0 (Current)
- Initial API implementation
- Contact form endpoint
- Live metrics integration
- Admin dashboard APIs
- Real-time WebSocket support
- Analytics tracking
- File upload system

---

**Last Updated**: [Current Date]
**API Version**: 1.0.0
**Next Review**: [Date + 1 month]