import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Check various system components
    const checks = {
      timestamp: new Date().toISOString(),
      status: 'healthy',
      version: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
      environment: process.env.NODE_ENV,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      checks: {
        database: await checkDatabase(),
        externalAPIs: await checkExternalAPIs(),
        storage: await checkStorage(),
      }
    };

    // Determine overall health status
    const allChecksHealthy = Object.values(checks.checks).every(check => check.status === 'healthy');
    
    return NextResponse.json({
      ...checks,
      status: allChecksHealthy ? 'healthy' : 'degraded'
    }, {
      status: allChecksHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      version: process.env.VERCEL_GIT_COMMIT_SHA || 'development',
      environment: process.env.NODE_ENV,
    }, {
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}

async function checkDatabase(): Promise<{ status: string; responseTime?: number; error?: string }> {
  try {
    const start = Date.now();
    
    // If using a database, add actual database connectivity check here
    // For now, we'll simulate a quick check
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const responseTime = Date.now() - start;
    
    return {
      status: 'healthy',
      responseTime
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Database check failed'
    };
  }
}

async function checkExternalAPIs(): Promise<{ status: string; apis?: Record<string, any>; error?: string }> {
  try {
    const apiChecks = await Promise.allSettled([
      checkAPI('Sunday Edge Pro', process.env.SUNDAY_EDGE_PRO_API),
      checkAPI('Restocktime', process.env.RESTOCKTIME_API),
      checkAPI('Shuk Online', process.env.SHUK_ONLINE_API),
    ]);

    const results = apiChecks.reduce((acc, result, index) => {
      const apiNames = ['sundayEdgePro', 'restocktime', 'shukOnline'];
      acc[apiNames[index]] = result.status === 'fulfilled' ? result.value : { status: 'failed', error: result.reason };
      return acc;
    }, {} as Record<string, any>);

    const allHealthy = Object.values(results).every(result => result.status === 'healthy');

    return {
      status: allHealthy ? 'healthy' : 'degraded',
      apis: results
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'External API check failed'
    };
  }
}

async function checkAPI(name: string, url?: string): Promise<{ status: string; responseTime?: number; error?: string }> {
  if (!url) {
    return { status: 'skipped', error: 'URL not configured' };
  }

  try {
    const start = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Portfolio-HealthCheck/1.0'
      }
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - start;

    return {
      status: response.ok ? 'healthy' : 'degraded',
      responseTime
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'API check failed'
    };
  }
}

async function checkStorage(): Promise<{ status: string; error?: string }> {
  try {
    // Check if Vercel Blob is configured
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return { status: 'skipped', error: 'Storage not configured' };
    }

    // For now, just check if the token exists
    return { status: 'healthy' };
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Storage check failed'
    };
  }
}