import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security configuration
const SECURITY_CONFIG = {
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // requests per window
    adminMaxRequests: 20, // stricter limit for admin routes
  },
  blockedUserAgents: [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
  ],
  allowedOrigins: [
    'https://isaacbenyakar.com',
    'https://www.isaacbenyakar.com',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
};

function getClientIP(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  const realIP = req.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return req.ip || 'unknown';
}

function isRateLimited(ip: string, isAdmin: boolean = false): boolean {
  const now = Date.now();
  const key = `${ip}:${isAdmin ? 'admin' : 'general'}`;
  const limit = isAdmin ? SECURITY_CONFIG.rateLimit.adminMaxRequests : SECURITY_CONFIG.rateLimit.maxRequests;
  
  const current = rateLimitStore.get(key);
  
  if (!current || now > current.resetTime) {
    // Reset or initialize
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + SECURITY_CONFIG.rateLimit.windowMs,
    });
    return false;
  }
  
  if (current.count >= limit) {
    return true;
  }
  
  current.count++;
  rateLimitStore.set(key, current);
  return false;
}

function isBlockedUserAgent(userAgent: string): boolean {
  return SECURITY_CONFIG.blockedUserAgents.some(pattern => pattern.test(userAgent));
}

function validateOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  
  // Allow requests without origin (direct navigation)
  if (!origin && !referer) {
    return true;
  }
  
  const requestOrigin = origin || (referer ? new URL(referer).origin : '');
  
  return SECURITY_CONFIG.allowedOrigins.some(allowed => {
    if (allowed.includes('localhost')) {
      return requestOrigin.includes('localhost');
    }
    return requestOrigin === allowed;
  });
}

function addSecurityHeaders(response: NextResponse): NextResponse {
  // Additional security headers not in next.config.ts
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  response.headers.set('X-Download-Options', 'noopen');
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none');
  response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
  
  // Remove server information
  response.headers.delete('Server');
  response.headers.delete('X-Powered-By');
  
  return response;
}

export default withAuth(
  function middleware(req) {
    const ip = getClientIP(req);
    const userAgent = req.headers.get('user-agent') || '';
    const isAdminRoute = req.nextUrl.pathname.startsWith('/admin');
    
    // Block suspicious user agents
    if (isBlockedUserAgent(userAgent)) {
      console.log(`Blocked suspicious user agent: ${userAgent} from ${ip}`);
      return new NextResponse('Forbidden', { status: 403 });
    }
    
    // Validate origin for API routes and admin routes
    if ((req.nextUrl.pathname.startsWith('/api') || isAdminRoute) && !validateOrigin(req)) {
      console.log(`Blocked request from invalid origin: ${req.headers.get('origin')} from ${ip}`);
      return new NextResponse('Forbidden', { status: 403 });
    }
    
    // Rate limiting
    if (isRateLimited(ip, isAdminRoute)) {
      console.log(`Rate limited: ${ip} on ${req.nextUrl.pathname}`);
      return new NextResponse('Too Many Requests', { 
        status: 429,
        headers: {
          'Retry-After': '900', // 15 minutes
        },
      });
    }
    
    // Log security events
    if (isAdminRoute) {
      console.log(`Admin route access: ${req.nextUrl.pathname} from ${ip} (${userAgent})`);
    }
    
    // Continue with the request
    const response = NextResponse.next();
    
    // Add security headers
    return addSecurityHeaders(response);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect admin routes
        if (req.nextUrl.pathname.startsWith("/admin") && !req.nextUrl.pathname.includes("/login")) {
          return token?.role === "admin"
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)",
  ]
}