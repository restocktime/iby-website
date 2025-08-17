# Deployment Guide

This guide covers the complete deployment process for the Interactive Portfolio Website to production on Vercel.

## Prerequisites

Before deploying, ensure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **Vercel CLI**: Install globally with `npm install -g vercel@latest`
3. **Environment Variables**: All required environment variables configured
4. **Domain**: Custom domain configured (optional but recommended)

## Quick Deployment

### Automated Deployment (Recommended)

```bash
# Validate production environment
npm run validate:prod

# Deploy to preview
npm run deploy:preview

# Deploy to production
npm run deploy:prod
```

### Manual Deployment

```bash
# Install Vercel CLI if not already installed
npm install -g vercel@latest

# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Environment Configuration

### Required Environment Variables

Set these in your Vercel dashboard under Project Settings > Environment Variables:

```bash
# Authentication
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://isaacbenyakar.com

# Error Tracking
SENTRY_DSN=your_sentry_dsn_here
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project

# Analytics
GOOGLE_ANALYTICS_ID=your_ga_id_here

# File Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here

# API Authentication
API_TOKEN=your_api_token_here
```

### Optional Environment Variables

```bash
# Database
DATABASE_URL=your_database_url_here

# Real-time Features
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster

# Live Data APIs
SUNDAY_EDGE_PRO_API=https://api.sundayedgepro.com/metrics
RESTOCKTIME_API=https://api.restocktime.com/metrics
SHUK_ONLINE_API=https://api.shukonline.com/metrics
WEBSITE_MONITOR_API=https://api.websitemonitorpro.com/metrics

# Admin Access
ADMIN_EMAIL=admin@isaacbenyakar.com
ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password_here
```

## Custom Domain Setup

### 1. Configure Domain in Vercel

1. Go to your project dashboard on Vercel
2. Navigate to Settings > Domains
3. Add your custom domain: `isaacbenyakar.com`
4. Add www subdomain: `www.isaacbenyakar.com`

### 2. DNS Configuration

Configure your DNS provider with these records:

```
Type: A
Name: @
Value: 76.76.19.19

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. SSL Certificate

Vercel automatically provisions SSL certificates for custom domains. This process typically takes a few minutes.

## Monitoring Setup

### Sentry Configuration

1. Create a Sentry account at [sentry.io](https://sentry.io)
2. Create a new project for your portfolio
3. Copy the DSN and add it to your environment variables
4. Configure release tracking in your CI/CD pipeline

### Analytics Setup

1. Create a Google Analytics 4 property
2. Copy the Measurement ID (GA_MEASUREMENT_ID)
3. Add it to your environment variables as `GOOGLE_ANALYTICS_ID`

### Performance Monitoring

The application includes built-in performance monitoring:

- **Core Web Vitals**: Automatic tracking of LCP, FID, and CLS
- **Custom Metrics**: API response times, user interactions
- **Error Tracking**: Automatic error reporting to Sentry
- **Health Checks**: `/api/health-check` endpoint for monitoring

## CI/CD Pipeline

### GitHub Actions

The project includes a complete GitHub Actions workflow (`.github/workflows/deploy.yml`) that:

1. **Runs Tests**: Unit tests, E2E tests, and linting
2. **Builds Application**: Optimized production build
3. **Deploys to Preview**: For pull requests
4. **Deploys to Production**: For main branch pushes
5. **Runs Lighthouse**: Performance auditing
6. **Creates Sentry Releases**: For error tracking

### Required GitHub Secrets

Add these secrets to your GitHub repository:

```
VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
SENTRY_AUTH_TOKEN=your_sentry_auth_token
SENTRY_ORG=your_sentry_org
SENTRY_PROJECT=your_sentry_project
```

## Performance Optimization

### Build Optimization

The application is configured with:

- **Bundle Analysis**: Use `npm run analyze` to analyze bundle size
- **Image Optimization**: Automatic WebP/AVIF conversion
- **Code Splitting**: Automatic route-based code splitting
- **Tree Shaking**: Unused code elimination

### CDN Configuration

Vercel's Edge Network provides:

- **Global CDN**: 100+ edge locations worldwide
- **Smart Caching**: Automatic static asset caching
- **Edge Functions**: Server-side rendering at the edge
- **Image Optimization**: On-demand image processing

### Performance Targets

The application targets these Core Web Vitals scores:

- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms
- **CLS (Cumulative Layout Shift)**: < 0.1

## Security Configuration

### Security Headers

The application includes comprehensive security headers:

- **Content Security Policy**: Prevents XSS attacks
- **HSTS**: Forces HTTPS connections
- **X-Frame-Options**: Prevents clickjacking
- **X-Content-Type-Options**: Prevents MIME sniffing

### Environment Security

- **Secret Management**: All secrets stored in Vercel environment variables
- **API Security**: Rate limiting and authentication on API routes
- **Input Validation**: Zod schemas for all user inputs

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Check build locally
npm run build

# Analyze bundle size
npm run analyze

# Validate configuration
npm run validate:prod
```

#### Environment Variable Issues

```bash
# Verify environment variables are set
vercel env ls

# Pull environment variables locally
vercel env pull .env.local
```

#### Performance Issues

```bash
# Run Lighthouse audit
npm run lighthouse

# Check health status
curl https://isaacbenyakar.com/api/health-check
```

### Debugging

1. **Check Vercel Logs**: View function logs in Vercel dashboard
2. **Monitor Sentry**: Check error reports and performance issues
3. **Health Check**: Use `/api/health-check` endpoint
4. **Analytics**: Monitor user behavior in Google Analytics

## Maintenance

### Regular Tasks

1. **Update Dependencies**: Monthly security updates
2. **Performance Audits**: Weekly Lighthouse audits
3. **Error Monitoring**: Daily Sentry error review
4. **Backup**: Regular backup of environment variables

### Monitoring Checklist

- [ ] Health check endpoint responding
- [ ] Core Web Vitals within targets
- [ ] Error rate below 1%
- [ ] API response times under 500ms
- [ ] SSL certificate valid
- [ ] Domain DNS configured correctly

## Support

For deployment issues:

1. Check the [Vercel Documentation](https://vercel.com/docs)
2. Review [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
3. Check project logs in Vercel dashboard
4. Monitor error reports in Sentry

## Rollback Procedure

If issues occur after deployment:

```bash
# Rollback to previous deployment
vercel rollback

# Or deploy a specific commit
vercel --prod --force
```

The application includes automatic health checks and will alert if critical issues are detected.