#!/usr/bin/env node

/**
 * Bundle Analysis and Optimization Script
 * Analyzes bundle sizes and provides optimization recommendations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const BUNDLE_SIZE_LIMITS = {
  // First Load JS (critical)
  firstLoadJS: 250 * 1024, // 250KB
  // Total bundle size
  totalBundle: 1024 * 1024, // 1MB
  // Individual chunk limits
  chunk: 200 * 1024, // 200KB
  // CSS limits
  css: 50 * 1024, // 50KB
};

async function analyzeBundles() {
  console.log('📦 Starting bundle analysis...\n');

  try {
    // Build the application first
    console.log('🔨 Building application...');
    execSync('npm run build', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });

    // Run bundle analyzer
    console.log('\n📊 Generating bundle analysis...');
    execSync('ANALYZE=true npm run build', { 
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });

    // Analyze Next.js build output
    const buildOutputPath = path.join(__dirname, '..', '.next', 'analyze');
    if (fs.existsSync(buildOutputPath)) {
      console.log('\n✅ Bundle analysis complete!');
      console.log('📄 Report available at: .next/analyze/client.html');
    }

    // Parse build stats
    await parseBuildStats();

  } catch (error) {
    console.error('❌ Bundle analysis failed:', error.message);
    process.exit(1);
  }
}

async function parseBuildStats() {
  console.log('\n🔍 Analyzing build statistics...\n');

  try {
    // Read Next.js build output
    const buildManifest = path.join(__dirname, '..', '.next', 'build-manifest.json');
    
    if (fs.existsSync(buildManifest)) {
      const manifest = JSON.parse(fs.readFileSync(buildManifest, 'utf8'));
      
      // Analyze pages and chunks
      const analysis = {
        pages: {},
        chunks: {},
        totalSize: 0,
        recommendations: []
      };

      // Analyze each page
      Object.entries(manifest.pages).forEach(([page, files]) => {
        const pageSize = calculatePageSize(files);
        analysis.pages[page] = {
          files: files.length,
          size: pageSize,
          sizeFormatted: formatBytes(pageSize)
        };
        analysis.totalSize += pageSize;

        // Check against limits
        if (pageSize > BUNDLE_SIZE_LIMITS.firstLoadJS) {
          analysis.recommendations.push({
            type: 'warning',
            page,
            message: `Page ${page} exceeds first load JS limit (${formatBytes(pageSize)} > ${formatBytes(BUNDLE_SIZE_LIMITS.firstLoadJS)})`
          });
        }
      });

      // Generate recommendations
      generateOptimizationRecommendations(analysis);

      // Display results
      displayAnalysisResults(analysis);

      // Save detailed report
      const reportPath = path.join(__dirname, '..', 'bundle-analysis-report.json');
      fs.writeFileSync(reportPath, JSON.stringify(analysis, null, 2));
      console.log(`\n📄 Detailed report saved to: ${reportPath}`);

    } else {
      console.log('⚠️  Build manifest not found. Run npm run build first.');
    }

  } catch (error) {
    console.error('❌ Failed to parse build stats:', error.message);
  }
}

function calculatePageSize(files) {
  let totalSize = 0;
  const staticDir = path.join(__dirname, '..', '.next', 'static');
  
  files.forEach(file => {
    try {
      const filePath = path.join(staticDir, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
      }
    } catch (error) {
      // File might not exist or be accessible
    }
  });
  
  return totalSize;
}

function generateOptimizationRecommendations(analysis) {
  // Check total bundle size
  if (analysis.totalSize > BUNDLE_SIZE_LIMITS.totalBundle) {
    analysis.recommendations.push({
      type: 'error',
      message: `Total bundle size exceeds limit (${formatBytes(analysis.totalSize)} > ${formatBytes(BUNDLE_SIZE_LIMITS.totalBundle)})`
    });
  }

  // Check for large pages
  const largePages = Object.entries(analysis.pages)
    .filter(([_, data]) => data.size > BUNDLE_SIZE_LIMITS.chunk)
    .sort(([_, a], [__, b]) => b.size - a.size);

  if (largePages.length > 0) {
    analysis.recommendations.push({
      type: 'warning',
      message: `${largePages.length} pages exceed recommended chunk size`,
      details: largePages.map(([page, data]) => `${page}: ${data.sizeFormatted}`)
    });
  }

  // General optimization recommendations
  analysis.recommendations.push(
    {
      type: 'info',
      message: 'Consider implementing dynamic imports for heavy components'
    },
    {
      type: 'info', 
      message: 'Use Next.js Image component for automatic optimization'
    },
    {
      type: 'info',
      message: 'Enable gzip/brotli compression on your server'
    },
    {
      type: 'info',
      message: 'Consider using a CDN for static assets'
    }
  );
}

function displayAnalysisResults(analysis) {
  console.log('📊 Bundle Analysis Results:\n');
  
  // Total size
  console.log(`📦 Total Bundle Size: ${formatBytes(analysis.totalSize)}`);
  console.log(`🎯 Target Limit: ${formatBytes(BUNDLE_SIZE_LIMITS.totalBundle)}\n`);

  // Page breakdown
  console.log('📄 Page Sizes:');
  Object.entries(analysis.pages)
    .sort(([_, a], [__, b]) => b.size - a.size)
    .forEach(([page, data]) => {
      const status = data.size > BUNDLE_SIZE_LIMITS.firstLoadJS ? '⚠️ ' : '✅ ';
      console.log(`  ${status}${page}: ${data.sizeFormatted} (${data.files} files)`);
    });

  // Recommendations
  if (analysis.recommendations.length > 0) {
    console.log('\n💡 Optimization Recommendations:');
    analysis.recommendations.forEach(rec => {
      const icon = rec.type === 'error' ? '❌' : rec.type === 'warning' ? '⚠️ ' : 'ℹ️ ';
      console.log(`  ${icon}${rec.message}`);
      if (rec.details) {
        rec.details.forEach(detail => console.log(`    - ${detail}`));
      }
    });
  }
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Code splitting recommendations
function generateCodeSplittingRecommendations() {
  console.log('\n🔀 Code Splitting Recommendations:\n');
  
  const recommendations = [
    {
      component: 'Three.js components',
      strategy: 'Dynamic import with loading fallback',
      example: `const Scene = dynamic(() => import('./Scene'), { 
  loading: () => <div>Loading 3D scene...</div>,
  ssr: false 
});`
    },
    {
      component: 'Admin dashboard',
      strategy: 'Route-based code splitting',
      example: 'Separate admin routes into different chunks'
    },
    {
      component: 'Analytics components',
      strategy: 'Lazy load with intersection observer',
      example: 'Load analytics when user scrolls to relevant section'
    },
    {
      component: 'Contact form',
      strategy: 'Dynamic import on user interaction',
      example: 'Load form validation libraries when form is focused'
    }
  ];

  recommendations.forEach(rec => {
    console.log(`📦 ${rec.component}:`);
    console.log(`   Strategy: ${rec.strategy}`);
    console.log(`   Example: ${rec.example}\n`);
  });
}

if (require.main === module) {
  analyzeBundles()
    .then(() => {
      generateCodeSplittingRecommendations();
      console.log('\n✅ Bundle analysis complete!');
    })
    .catch(console.error);
}

module.exports = { analyzeBundles, parseBuildStats };