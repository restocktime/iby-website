#!/usr/bin/env node

/**
 * Comprehensive Security Audit Script
 * Performs security checks and vulnerability assessments
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SECURITY_CHECKS = {
  dependencies: 'Dependency vulnerability scan',
  headers: 'Security headers validation',
  csp: 'Content Security Policy analysis',
  secrets: 'Secret and sensitive data detection',
  permissions: 'File permissions audit',
  ssl: 'SSL/TLS configuration check',
  cors: 'CORS policy validation',
  authentication: 'Authentication security review',
  input: 'Input validation and sanitization',
  output: 'Output encoding and XSS prevention',
};

class SecurityAuditor {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
      recommendations: [],
    };
  }

  async runFullAudit() {
    console.log('🔒 Starting comprehensive security audit...\n');

    // Run all security checks
    await this.checkDependencyVulnerabilities();
    await this.validateSecurityHeaders();
    await this.analyzeContentSecurityPolicy();
    await this.scanForSecrets();
    await this.auditFilePermissions();
    await this.validateCORSPolicy();
    await this.reviewAuthentication();
    await this.checkInputValidation();
    await this.verifyOutputEncoding();

    // Generate security report
    this.generateSecurityReport();
  }

  async checkDependencyVulnerabilities() {
    console.log('🔍 Checking dependency vulnerabilities...');
    
    try {
      // Run npm audit
      const auditOutput = execSync('npm audit --json', { 
        encoding: 'utf8',
        cwd: path.join(__dirname, '..'),
      });
      
      const auditData = JSON.parse(auditOutput);
      
      if (auditData.metadata.vulnerabilities.total === 0) {
        this.results.passed.push('No dependency vulnerabilities found');
      } else {
        const { high, critical, moderate, low } = auditData.metadata.vulnerabilities;
        
        if (critical > 0 || high > 0) {
          this.results.failed.push(`Critical security vulnerabilities found: ${critical} critical, ${high} high`);
        } else if (moderate > 0) {
          this.results.warnings.push(`Moderate vulnerabilities found: ${moderate}`);
        } else {
          this.results.warnings.push(`Low severity vulnerabilities found: ${low}`);
        }
        
        this.results.recommendations.push('Run "npm audit fix" to resolve vulnerabilities');
      }
      
    } catch (error) {
      this.results.warnings.push('Could not run dependency audit: ' + error.message);
    }
  }

  async validateSecurityHeaders() {
    console.log('🛡️  Validating security headers...');
    
    const nextConfigPath = path.join(__dirname, '..', 'next.config.ts');
    
    if (fs.existsSync(nextConfigPath)) {
      const configContent = fs.readFileSync(nextConfigPath, 'utf8');
      
      const requiredHeaders = [
        'Strict-Transport-Security',
        'Content-Security-Policy',
        'X-Content-Type-Options',
        'X-Frame-Options',
        'X-XSS-Protection',
        'Referrer-Policy',
      ];
      
      const missingHeaders = requiredHeaders.filter(header => 
        !configContent.includes(header)
      );
      
      if (missingHeaders.length === 0) {
        this.results.passed.push('All required security headers are configured');
      } else {
        this.results.failed.push(`Missing security headers: ${missingHeaders.join(', ')}`);
      }
      
      // Check for HSTS
      if (configContent.includes('max-age=31536000')) {
        this.results.passed.push('HSTS properly configured with 1-year max-age');
      } else {
        this.results.warnings.push('HSTS max-age should be at least 1 year (31536000 seconds)');
      }
      
    } else {
      this.results.failed.push('Next.js config file not found');
    }
  }

  async analyzeContentSecurityPolicy() {
    console.log('📋 Analyzing Content Security Policy...');
    
    const nextConfigPath = path.join(__dirname, '..', 'next.config.ts');
    
    if (fs.existsSync(nextConfigPath)) {
      const configContent = fs.readFileSync(nextConfigPath, 'utf8');
      
      // Check for unsafe CSP directives
      const unsafeDirectives = [
        "'unsafe-inline'",
        "'unsafe-eval'",
        "'unsafe-hashes'",
        '*',
      ];
      
      const foundUnsafe = unsafeDirectives.filter(directive => 
        configContent.includes(directive)
      );
      
      if (foundUnsafe.length > 0) {
        this.results.warnings.push(`CSP contains potentially unsafe directives: ${foundUnsafe.join(', ')}`);
        this.results.recommendations.push('Consider using nonces or hashes instead of unsafe-inline/unsafe-eval');
      } else {
        this.results.passed.push('CSP does not contain unsafe directives');
      }
      
      // Check for essential CSP directives
      const essentialDirectives = [
        'default-src',
        'script-src',
        'style-src',
        'img-src',
        'connect-src',
      ];
      
      const missingDirectives = essentialDirectives.filter(directive => 
        !configContent.includes(directive)
      );
      
      if (missingDirectives.length === 0) {
        this.results.passed.push('All essential CSP directives are present');
      } else {
        this.results.warnings.push(`Missing CSP directives: ${missingDirectives.join(', ')}`);
      }
    }
  }

  async scanForSecrets() {
    console.log('🔐 Scanning for secrets and sensitive data...');
    
    const sensitivePatterns = [
      { name: 'API Keys', pattern: /api[_-]?key[s]?\s*[:=]\s*['"][^'"]+['"]/gi },
      { name: 'Passwords', pattern: /password[s]?\s*[:=]\s*['"][^'"]+['"]/gi },
      { name: 'Tokens', pattern: /token[s]?\s*[:=]\s*['"][^'"]+['"]/gi },
      { name: 'Private Keys', pattern: /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/gi },
      { name: 'Database URLs', pattern: /mongodb:\/\/|postgres:\/\/|mysql:\/\//gi },
      { name: 'AWS Keys', pattern: /AKIA[0-9A-Z]{16}/gi },
    ];
    
    const filesToScan = [
      '.env',
      '.env.local',
      '.env.development',
      '.env.production',
      'src/**/*.ts',
      'src/**/*.tsx',
      'src/**/*.js',
      'src/**/*.jsx',
    ];
    
    let secretsFound = false;
    
    filesToScan.forEach(pattern => {
      try {
        const files = this.globFiles(pattern);
        
        files.forEach(file => {
          if (fs.existsSync(file)) {
            const content = fs.readFileSync(file, 'utf8');
            
            sensitivePatterns.forEach(({ name, pattern }) => {
              const matches = content.match(pattern);
              if (matches) {
                this.results.failed.push(`Potential ${name} found in ${file}`);
                secretsFound = true;
              }
            });
          }
        });
      } catch (error) {
        // File pattern not found or inaccessible
      }
    });
    
    if (!secretsFound) {
      this.results.passed.push('No hardcoded secrets detected');
    }
    
    // Check for .env files in version control
    const gitignorePath = path.join(__dirname, '..', '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
      
      if (gitignoreContent.includes('.env')) {
        this.results.passed.push('.env files are properly ignored by git');
      } else {
        this.results.failed.push('.env files are not ignored by git');
      }
    }
  }

  async auditFilePermissions() {
    console.log('📁 Auditing file permissions...');
    
    const sensitiveFiles = [
      '.env',
      '.env.local',
      '.env.production',
      'package.json',
      'next.config.ts',
    ];
    
    sensitiveFiles.forEach(file => {
      const filePath = path.join(__dirname, '..', file);
      
      if (fs.existsSync(filePath)) {
        try {
          const stats = fs.statSync(filePath);
          const mode = stats.mode & parseInt('777', 8);
          
          // Check if file is world-readable (should not be for sensitive files)
          if (mode & parseInt('004', 8)) {
            this.results.warnings.push(`${file} is world-readable`);
          } else {
            this.results.passed.push(`${file} has appropriate permissions`);
          }
        } catch (error) {
          this.results.warnings.push(`Could not check permissions for ${file}`);
        }
      }
    });
  }

  async validateCORSPolicy() {
    console.log('🌐 Validating CORS policy...');
    
    // Check API routes for CORS configuration
    const apiDir = path.join(__dirname, '..', 'src', 'app', 'api');
    
    if (fs.existsSync(apiDir)) {
      const apiFiles = this.findFiles(apiDir, /route\.(ts|js)$/);
      
      let corsConfigured = false;
      
      apiFiles.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        
        if (content.includes('Access-Control-Allow-Origin') || 
            content.includes('cors') ||
            content.includes('CORS')) {
          corsConfigured = true;
        }
      });
      
      if (corsConfigured) {
        this.results.passed.push('CORS policy is configured for API routes');
      } else {
        this.results.warnings.push('No explicit CORS configuration found in API routes');
        this.results.recommendations.push('Consider implementing explicit CORS headers for API security');
      }
    }
  }

  async reviewAuthentication() {
    console.log('🔑 Reviewing authentication security...');
    
    const authFiles = [
      'src/lib/auth.ts',
      'middleware.ts',
    ];
    
    const authDirs = [
      'src/app/api/auth',
    ];
    
    let authImplemented = false;
    let secureAuthFound = false;
    
    // Check individual files
    authFiles.forEach(file => {
      const filePath = path.join(__dirname, '..', file);
      
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        authImplemented = true;
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Check for secure authentication practices
        if (content.includes('bcrypt') || 
            content.includes('scrypt') ||
            content.includes('argon2') ||
            content.includes('NextAuth')) {
          secureAuthFound = true;
        }
      }
    });
    
    // Check directories for auth files
    authDirs.forEach(dir => {
      const dirPath = path.join(__dirname, '..', dir);
      
      if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
        authImplemented = true;
        
        // Look for auth files in directory
        const files = this.findFiles(dirPath, /\.(ts|js)$/);
        files.forEach(file => {
          const content = fs.readFileSync(file, 'utf8');
          if (content.includes('NextAuth') || content.includes('bcrypt')) {
            secureAuthFound = true;
          }
        });
      }
    });
    
    if (authImplemented) {
      if (secureAuthFound) {
        this.results.passed.push('Secure authentication implementation found');
      } else {
        this.results.warnings.push('Authentication implemented but security practices unclear');
      }
    } else {
      this.results.warnings.push('No authentication implementation detected');
    }
  }

  async checkInputValidation() {
    console.log('✅ Checking input validation...');
    
    const formFiles = this.findFiles(
      path.join(__dirname, '..', 'src'),
      /\.(ts|tsx|js|jsx)$/
    );
    
    let validationFound = false;
    
    formFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      if (content.includes('zod') ||
          content.includes('yup') ||
          content.includes('joi') ||
          content.includes('validator') ||
          content.includes('sanitize')) {
        validationFound = true;
      }
    });
    
    if (validationFound) {
      this.results.passed.push('Input validation libraries detected');
    } else {
      this.results.warnings.push('No input validation libraries found');
      this.results.recommendations.push('Implement input validation using libraries like Zod or Yup');
    }
  }

  async verifyOutputEncoding() {
    console.log('🔒 Verifying output encoding...');
    
    // React automatically handles XSS prevention through JSX
    // Check for dangerous patterns
    const componentFiles = this.findFiles(
      path.join(__dirname, '..', 'src'),
      /\.(tsx|jsx)$/
    );
    
    let dangerousPatterns = 0;
    
    componentFiles.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for dangerouslySetInnerHTML usage
      if (content.includes('dangerouslySetInnerHTML')) {
        dangerousPatterns++;
      }
    });
    
    if (dangerousPatterns === 0) {
      this.results.passed.push('No dangerous HTML injection patterns found');
    } else {
      this.results.warnings.push(`Found ${dangerousPatterns} uses of dangerouslySetInnerHTML`);
      this.results.recommendations.push('Review dangerouslySetInnerHTML usage for XSS vulnerabilities');
    }
  }

  generateSecurityReport() {
    console.log('\n🔒 Security Audit Report:\n');
    
    // Summary
    console.log(`✅ Passed: ${this.results.passed.length} checks`);
    console.log(`⚠️  Warnings: ${this.results.warnings.length} issues`);
    console.log(`❌ Failed: ${this.results.failed.length} critical issues\n`);
    
    // Detailed results
    if (this.results.passed.length > 0) {
      console.log('✅ Passed Checks:');
      this.results.passed.forEach(check => console.log(`  - ${check}`));
      console.log();
    }
    
    if (this.results.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      this.results.warnings.forEach(warning => console.log(`  - ${warning}`));
      console.log();
    }
    
    if (this.results.failed.length > 0) {
      console.log('❌ Failed Checks:');
      this.results.failed.forEach(failure => console.log(`  - ${failure}`));
      console.log();
    }
    
    if (this.results.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      this.results.recommendations.forEach(rec => console.log(`  - ${rec}`));
      console.log();
    }
    
    // Save detailed report
    const reportPath = path.join(__dirname, '..', 'security-audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.log(`📄 Detailed report saved to: ${reportPath}`);
    
    // Exit with error code if critical issues found
    if (this.results.failed.length > 0) {
      console.log('\n❌ Security audit failed due to critical issues!');
      process.exit(1);
    } else {
      console.log('\n✅ Security audit completed successfully!');
    }
  }

  // Utility methods
  globFiles(pattern) {
    // Simplified glob implementation
    const basePath = path.join(__dirname, '..');
    
    if (pattern.includes('**')) {
      return this.findFiles(basePath, new RegExp(pattern.replace('**/*', '').replace('*', '.*')));
    } else {
      const filePath = path.join(basePath, pattern);
      return fs.existsSync(filePath) ? [filePath] : [];
    }
  }

  findFiles(dir, pattern) {
    const files = [];
    
    if (!fs.existsSync(dir)) return files;
    
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        files.push(...this.findFiles(fullPath, pattern));
      } else if (pattern.test(item)) {
        files.push(fullPath);
      }
    });
    
    return files;
  }
}

if (require.main === module) {
  const auditor = new SecurityAuditor();
  auditor.runFullAudit().catch(console.error);
}

module.exports = SecurityAuditor;