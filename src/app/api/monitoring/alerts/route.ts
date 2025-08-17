import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

interface AlertRule {
  id: string;
  name: string;
  condition: (metrics: any) => boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
}

const alertRules: AlertRule[] = [
  {
    id: 'high_error_rate',
    name: 'High Error Rate',
    condition: (metrics) => metrics.errorRate > 0.05, // 5% error rate
    severity: 'high',
    message: 'Error rate is above 5%',
  },
  {
    id: 'slow_response_time',
    name: 'Slow Response Time',
    condition: (metrics) => metrics.avgResponseTime > 2000, // 2 seconds
    severity: 'medium',
    message: 'Average response time is above 2 seconds',
  },
  {
    id: 'high_memory_usage',
    name: 'High Memory Usage',
    condition: (metrics) => metrics.memoryUsage > 0.9, // 90% memory usage
    severity: 'high',
    message: 'Memory usage is above 90%',
  },
  {
    id: 'external_api_failure',
    name: 'External API Failure',
    condition: (metrics) => metrics.externalApiFailureRate > 0.3, // 30% failure rate
    severity: 'medium',
    message: 'External API failure rate is above 30%',
  },
  {
    id: 'low_core_web_vitals',
    name: 'Poor Core Web Vitals',
    condition: (metrics) => metrics.coreWebVitalsScore < 0.75, // Below 75%
    severity: 'medium',
    message: 'Core Web Vitals score is below 75%',
  },
];

export async function GET(request: NextRequest) {
  try {
    // Get current metrics (this would typically come from your monitoring system)
    const metrics = await getCurrentMetrics();
    
    // Check alert rules
    const triggeredAlerts = alertRules.filter(rule => rule.condition(metrics));
    
    // Send alerts if any are triggered
    if (triggeredAlerts.length > 0) {
      await sendAlerts(triggeredAlerts, metrics);
    }
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      alertsChecked: alertRules.length,
      alertsTriggered: triggeredAlerts.length,
      alerts: triggeredAlerts.map(alert => ({
        id: alert.id,
        name: alert.name,
        severity: alert.severity,
        message: alert.message,
      })),
      metrics: {
        errorRate: metrics.errorRate,
        avgResponseTime: metrics.avgResponseTime,
        memoryUsage: metrics.memoryUsage,
        externalApiFailureRate: metrics.externalApiFailureRate,
        coreWebVitalsScore: metrics.coreWebVitalsScore,
      },
    });
  } catch (error) {
    console.error('Alert monitoring error:', error);
    
    // Report the monitoring system failure to Sentry
    Sentry.captureException(error, {
      tags: {
        component: 'alert-monitoring',
      },
    });
    
    return NextResponse.json({
      error: 'Alert monitoring failed',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

async function getCurrentMetrics() {
  // This would typically fetch from your monitoring system
  // For now, we'll simulate some metrics
  
  try {
    // Get health check data
    const healthResponse = await fetch(`${process.env.NEXTAUTH_URL}/api/health-check`);
    const healthData = await healthResponse.json();
    
    // Calculate metrics based on health data and other sources
    const metrics = {
      errorRate: Math.random() * 0.1, // Simulate 0-10% error rate
      avgResponseTime: 500 + Math.random() * 1000, // Simulate 500-1500ms response time
      memoryUsage: healthData.memory ? (healthData.memory.used / healthData.memory.total) : 0.5,
      externalApiFailureRate: calculateExternalApiFailureRate(healthData),
      coreWebVitalsScore: 0.8 + Math.random() * 0.2, // Simulate 80-100% score
      timestamp: new Date().toISOString(),
    };
    
    return metrics;
  } catch (error) {
    console.error('Failed to get current metrics:', error);
    
    // Return default metrics if we can't fetch real ones
    return {
      errorRate: 0,
      avgResponseTime: 1000,
      memoryUsage: 0.5,
      externalApiFailureRate: 0,
      coreWebVitalsScore: 0.8,
      timestamp: new Date().toISOString(),
    };
  }
}

function calculateExternalApiFailureRate(healthData: any): number {
  if (!healthData.checks?.externalAPIs?.apis) {
    return 0;
  }
  
  const apis = Object.values(healthData.checks.externalAPIs.apis);
  const failedApis = apis.filter((api: any) => api.status !== 'healthy').length;
  
  return apis.length > 0 ? failedApis / apis.length : 0;
}

async function sendAlerts(alerts: AlertRule[], metrics: any) {
  // Send alerts to various channels
  
  // 1. Log to console (for development)
  console.warn('🚨 Alerts triggered:', alerts.map(a => a.name).join(', '));
  
  // 2. Send to Sentry
  alerts.forEach(alert => {
    Sentry.captureMessage(`Alert: ${alert.name} - ${alert.message}`, {
      level: getSentryLevel(alert.severity),
      tags: {
        alertId: alert.id,
        severity: alert.severity,
        component: 'monitoring-alerts',
      },
      extra: {
        metrics,
        alertRule: alert,
      },
    });
  });
  
  // 3. Send critical alerts to external services (if configured)
  const criticalAlerts = alerts.filter(alert => alert.severity === 'critical');
  if (criticalAlerts.length > 0) {
    await sendCriticalAlerts(criticalAlerts, metrics);
  }
}

function getSentryLevel(severity: string): 'info' | 'warning' | 'error' | 'fatal' {
  switch (severity) {
    case 'low':
      return 'info';
    case 'medium':
      return 'warning';
    case 'high':
      return 'error';
    case 'critical':
      return 'fatal';
    default:
      return 'warning';
  }
}

async function sendCriticalAlerts(alerts: AlertRule[], metrics: any) {
  // This is where you would integrate with external alerting services
  // Examples: PagerDuty, Slack, Discord, email, SMS, etc.
  
  try {
    // Example: Send to a webhook (could be Slack, Discord, etc.)
    const webhookUrl = process.env.ALERT_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: `🚨 Critical Alert: ${alerts.map(a => a.name).join(', ')}`,
          attachments: [
            {
              color: 'danger',
              fields: alerts.map(alert => ({
                title: alert.name,
                value: alert.message,
                short: true,
              })),
              footer: 'Portfolio Monitoring',
              ts: Math.floor(Date.now() / 1000),
            },
          ],
        }),
      });
    }
    
    // Example: Send email alert (if email service is configured)
    const emailService = process.env.EMAIL_SERVICE_URL;
    if (emailService) {
      await fetch(emailService, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EMAIL_SERVICE_TOKEN}`,
        },
        body: JSON.stringify({
          to: process.env.ADMIN_EMAIL,
          subject: '🚨 Critical Portfolio Alert',
          html: generateAlertEmail(alerts, metrics),
        }),
      });
    }
  } catch (error) {
    console.error('Failed to send critical alerts:', error);
    
    // Report the alert system failure to Sentry
    Sentry.captureException(error, {
      tags: {
        component: 'critical-alerts',
      },
      extra: {
        alerts,
        metrics,
      },
    });
  }
}

function generateAlertEmail(alerts: AlertRule[], metrics: any): string {
  return `
    <h2>🚨 Critical Portfolio Alerts</h2>
    <p>The following critical alerts have been triggered:</p>
    
    <ul>
      ${alerts.map(alert => `
        <li>
          <strong>${alert.name}</strong> (${alert.severity})<br>
          ${alert.message}
        </li>
      `).join('')}
    </ul>
    
    <h3>Current Metrics</h3>
    <ul>
      <li>Error Rate: ${(metrics.errorRate * 100).toFixed(2)}%</li>
      <li>Avg Response Time: ${metrics.avgResponseTime.toFixed(0)}ms</li>
      <li>Memory Usage: ${(metrics.memoryUsage * 100).toFixed(1)}%</li>
      <li>External API Failure Rate: ${(metrics.externalApiFailureRate * 100).toFixed(1)}%</li>
      <li>Core Web Vitals Score: ${(metrics.coreWebVitalsScore * 100).toFixed(1)}%</li>
    </ul>
    
    <p>Please investigate and resolve these issues as soon as possible.</p>
    <p>Timestamp: ${new Date().toISOString()}</p>
  `;
}