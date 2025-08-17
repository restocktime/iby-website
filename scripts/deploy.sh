#!/bin/bash

# Interactive Portfolio Deployment Script
# This script handles deployment to Vercel with proper environment setup

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the interactive-portfolio directory."
    exit 1
fi

# Parse command line arguments
ENVIRONMENT="preview"
RUN_TESTS=true
SKIP_BUILD=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --prod|--production)
            ENVIRONMENT="production"
            shift
            ;;
        --skip-tests)
            RUN_TESTS=false
            shift
            ;;
        --skip-build)
            SKIP_BUILD=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --prod, --production    Deploy to production"
            echo "  --skip-tests           Skip running tests"
            echo "  --skip-build          Skip build step"
            echo "  -h, --help            Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

print_status "Starting deployment to $ENVIRONMENT environment..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel@latest
fi

# Check if required environment variables are set
if [ -z "$VERCEL_TOKEN" ]; then
    print_error "VERCEL_TOKEN environment variable is not set."
    print_status "Please set your Vercel token: export VERCEL_TOKEN=your_token_here"
    exit 1
fi

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Run tests if not skipped
if [ "$RUN_TESTS" = true ]; then
    print_status "Running tests..."
    
    # Run linting
    print_status "Running ESLint..."
    npm run lint
    
    # Run unit tests
    print_status "Running unit tests..."
    npm run test:ci
    
    # Install Playwright browsers if needed
    if [ ! -d "node_modules/@playwright" ]; then
        print_status "Installing Playwright browsers..."
        npx playwright install --with-deps
    fi
    
    # Run E2E tests
    print_status "Running E2E tests..."
    npm run test:e2e
    
    print_success "All tests passed!"
fi

# Build the application if not skipped
if [ "$SKIP_BUILD" = false ]; then
    print_status "Building application..."
    npm run build
    print_success "Build completed!"
fi

# Pull Vercel environment information
print_status "Pulling Vercel environment information..."
if [ "$ENVIRONMENT" = "production" ]; then
    vercel pull --yes --environment=production --token="$VERCEL_TOKEN"
else
    vercel pull --yes --environment=preview --token="$VERCEL_TOKEN"
fi

# Build project artifacts for Vercel
print_status "Building project artifacts for Vercel..."
if [ "$ENVIRONMENT" = "production" ]; then
    vercel build --prod --token="$VERCEL_TOKEN"
else
    vercel build --token="$VERCEL_TOKEN"
fi

# Deploy to Vercel
print_status "Deploying to Vercel..."
if [ "$ENVIRONMENT" = "production" ]; then
    DEPLOY_URL=$(vercel deploy --prebuilt --prod --token="$VERCEL_TOKEN")
else
    DEPLOY_URL=$(vercel deploy --prebuilt --token="$VERCEL_TOKEN")
fi

print_success "Deployment completed!"
print_status "Deployment URL: $DEPLOY_URL"

# Run post-deployment checks
print_status "Running post-deployment health checks..."

# Wait a moment for deployment to be ready
sleep 10

# Check if the deployment is accessible
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOY_URL/api/health-check" || echo "000")

if [ "$HTTP_STATUS" = "200" ]; then
    print_success "Health check passed! Deployment is healthy."
else
    print_warning "Health check returned status: $HTTP_STATUS"
    print_warning "The deployment might still be initializing. Please check manually."
fi

# If production deployment, run additional checks
if [ "$ENVIRONMENT" = "production" ]; then
    print_status "Running production-specific checks..."
    
    # Check Core Web Vitals (if lighthouse is available)
    if command -v lighthouse &> /dev/null; then
        print_status "Running Lighthouse audit..."
        lighthouse "$DEPLOY_URL" --output=json --output-path=./lighthouse-report.json --chrome-flags="--headless --no-sandbox" --quiet
        
        # Parse Lighthouse results
        PERFORMANCE_SCORE=$(node -p "JSON.parse(require('fs').readFileSync('./lighthouse-report.json', 'utf8')).categories.performance.score * 100")
        print_status "Performance Score: $PERFORMANCE_SCORE/100"
        
        if (( $(echo "$PERFORMANCE_SCORE >= 80" | bc -l) )); then
            print_success "Performance score meets requirements!"
        else
            print_warning "Performance score is below 80. Consider optimizing."
        fi
        
        # Clean up
        rm -f lighthouse-report.json
    fi
    
    print_success "Production deployment completed successfully!"
    print_status "Live URL: https://isaacbenyakar.com"
else
    print_success "Preview deployment completed successfully!"
    print_status "Preview URL: $DEPLOY_URL"
fi

print_status "Deployment summary:"
print_status "- Environment: $ENVIRONMENT"
print_status "- Tests run: $RUN_TESTS"
print_status "- Build skipped: $SKIP_BUILD"
print_status "- Deployment URL: $DEPLOY_URL"

print_success "Deployment process completed!"