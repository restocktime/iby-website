#!/usr/bin/env node

/**
 * Production Environment Validation Script
 * Validates that all required environment variables and configurations are set for production deployment
 */

const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logInfo(message) {
  log(`ℹ️  ${message}`, 'blue');
}

// Required environment variables for production
const requiredEnvVars = [
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'SENTRY_DSN',
  'GOOGLE_ANALYTICS_ID',
  'BLOB_READ_WRITE_TOKEN',
  'API_TOKEN',
];

// Optional but recommended environment variables
const recommendedEnvVars = [
  'DATABASE_URL',
  'PUSHER_APP_ID',
  'PUSHER_KEY',
  'PUSHER_SECRET',
  'PUSHER_CLUSTER',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD_HASH',
];

// API endpoints to validate
const apiEndpoints = [
  'SUNDAY_EDGE_PRO_API',
  'RESTOCKTIME_API',
  'SHUK_ONLINE_API',
  'WEBSITE_MONITOR_API',
];

function validateEnvironmentVariables() {
  logInfo('Validating environment variables...');
  
  let hasErrors = false;
  let hasWarnings = false;

  // Check required variables
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      logError(`Required environment variable ${varName} is not set`);
      hasErrors = true;
    } else {
      logSuccess(`${varName} is set`);
    }
  });

  // Check recommended variables
  recommendedEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      logWarning(`Recommended environment variable ${varName} is not set`);
      hasWarnings = true;
    } else {
      logSuccess(`${varName} is set`);
    }
  });

  // Check API endpoints
  apiEndpoints.forEach(varName => {
    if (!process.env[varName]) {
      logWarning(`API endpoint ${varName} is not set`);
      hasWarnings = true;
    } else {
      logSuccess(`${varName} is set`);
    }
  });

  return { hasErrors, hasWarnings };
}

function validateConfigFiles() {
  logInfo('Validating configuration files...');
  
  const requiredFiles = [
    'next.config.ts',
    'vercel.json',
    'package.json',
    'tailwind.config.ts',
    'tsconfig.json',
  ];

  const optionalFiles = [
    'lighthouserc.json',
    'sentry.client.config.ts',
    'sentry.server.config.ts',
    'sentry.edge.config.ts',
  ];

  let hasErrors = false;

  requiredFiles.forEach(fileName => {
    const filePath = path.join(process.cwd(), fileName);
    if (!fs.existsSync(filePath)) {
      logError(`Required configuration file ${fileName} is missing`);
      hasErrors = true;
    } else {
      logSuccess(`${fileName} exists`);
    }
  });

  optionalFiles.forEach(fileName => {
    const filePath = path.join(process.cwd(), fileName);
    if (!fs.existsSync(filePath)) {
      logWarning(`Optional configuration file ${fileName} is missing`);
    } else {
      logSuccess(`${fileName} exists`);
    }
  });

  return hasErrors;
}

function validatePackageJson() {
  logInfo('Validating package.json...');
  
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    let hasErrors = false;

    // Check required scripts
    const requiredScripts = ['build', 'start', 'dev', 'lint'];
    requiredScripts.forEach(script => {
      if (!packageJson.scripts || !packageJson.scripts[script]) {
        logError(`Required script "${script}" is missing from package.json`);
        hasErrors = true;
      } else {
        logSuccess(`Script "${script}" is defined`);
      }
    });

    // Check for production dependencies
    const requiredDeps = [
      'next',
      'react',
      'react-dom',
      '@sentry/nextjs',
    ];

    requiredDeps.forEach(dep => {
      if (!packageJson.dependencies || !packageJson.dependencies[dep]) {
        logError(`Required dependency "${dep}" is missing`);
        hasErrors = true;
      } else {
        logSuccess(`Dependency "${dep}" is installed`);
      }
    });

    return hasErrors;
  } catch (error) {
    logError(`Failed to parse package.json: ${error.message}`);
    return true;
  }
}

function validateNextConfig() {
  logInfo('Validating Next.js configuration...');
  
  try {
    // Check if next.config.ts exists and has basic structure
    const configPath = path.join(process.cwd(), 'next.config.ts');
    if (!fs.existsSync(configPath)) {
      logError('next.config.ts is missing');
      return true;
    }

    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Check for important configurations
    const checks = [
      { pattern: /headers\(\)/, name: 'Security headers configuration' },
      { pattern: /images:/, name: 'Image optimization configuration' },
      { pattern: /compress:\s*true/, name: 'Compression enabled' },
      { pattern: /poweredByHeader:\s*false/, name: 'X-Powered-By header disabled' },
    ];

    let hasWarnings = false;
    checks.forEach(check => {
      if (check.pattern.test(configContent)) {
        logSuccess(check.name);
      } else {
        logWarning(`${check.name} not found in next.config.ts`);
        hasWarnings = true;
      }
    });

    return false; // No critical errors, only warnings
  } catch (error) {
    logError(`Failed to validate next.config.ts: ${error.message}`);
    return true;
  }
}

function validateVercelConfig() {
  logInfo('Validating Vercel configuration...');
  
  try {
    const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
    if (!fs.existsSync(vercelConfigPath)) {
      logWarning('vercel.json is missing (optional but recommended)');
      return false;
    }

    const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
    
    // Check for important Vercel configurations
    const checks = [
      { key: 'headers', name: 'Security headers' },
      { key: 'regions', name: 'Global regions configuration' },
      { key: 'functions', name: 'Function configuration' },
    ];

    checks.forEach(check => {
      if (vercelConfig[check.key]) {
        logSuccess(`${check.name} configured`);
      } else {
        logWarning(`${check.name} not configured in vercel.json`);
      }
    });

    return false;
  } catch (error) {
    logError(`Failed to validate vercel.json: ${error.message}`);
    return true;
  }
}

async function validateExternalServices() {
  logInfo('Validating external services...');
  
  const services = [
    {
      name: 'Sentry',
      check: () => !!process.env.SENTRY_DSN,
      url: process.env.SENTRY_DSN,
    },
    {
      name: 'Google Analytics',
      check: () => !!process.env.GOOGLE_ANALYTICS_ID,
      url: null,
    },
    {
      name: 'Vercel Blob',
      check: () => !!process.env.BLOB_READ_WRITE_TOKEN,
      url: null,
    },
  ];

  let hasErrors = false;

  for (const service of services) {
    if (service.check()) {
      logSuccess(`${service.name} is configured`);
    } else {
      logError(`${service.name} is not configured`);
      hasErrors = true;
    }
  }

  return hasErrors;
}

function generateReport(results) {
  log('\n' + '='.repeat(50), 'cyan');
  log('PRODUCTION VALIDATION REPORT', 'cyan');
  log('='.repeat(50), 'cyan');

  const totalErrors = Object.values(results).filter(result => result.hasErrors).length;
  const totalWarnings = Object.values(results).filter(result => result.hasWarnings).length;

  if (totalErrors === 0) {
    logSuccess('✨ All critical validations passed! Ready for production deployment.');
  } else {
    logError(`❌ ${totalErrors} critical issue(s) found. Please fix before deploying.`);
  }

  if (totalWarnings > 0) {
    logWarning(`⚠️  ${totalWarnings} warning(s) found. Consider addressing these for optimal performance.`);
  }

  log('\nNext steps:', 'blue');
  if (totalErrors === 0) {
    log('1. Run: npm run build', 'blue');
    log('2. Run: npm run test:ci', 'blue');
    log('3. Deploy: ./scripts/deploy.sh --production', 'blue');
  } else {
    log('1. Fix the critical issues listed above', 'blue');
    log('2. Run this validation script again', 'blue');
    log('3. Proceed with deployment once all issues are resolved', 'blue');
  }

  return totalErrors === 0;
}

async function main() {
  log('🚀 Starting production environment validation...', 'magenta');
  log('');

  const results = {
    envVars: validateEnvironmentVariables(),
    configFiles: { hasErrors: validateConfigFiles() },
    packageJson: { hasErrors: validatePackageJson() },
    nextConfig: { hasErrors: validateNextConfig() },
    vercelConfig: { hasErrors: validateVercelConfig() },
    externalServices: { hasErrors: await validateExternalServices() },
  };

  log('');
  const isReady = generateReport(results);
  
  process.exit(isReady ? 0 : 1);
}

// Run the validation
if (require.main === module) {
  main().catch(error => {
    logError(`Validation failed: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  validateEnvironmentVariables,
  validateConfigFiles,
  validatePackageJson,
  validateNextConfig,
  validateVercelConfig,
  validateExternalServices,
};