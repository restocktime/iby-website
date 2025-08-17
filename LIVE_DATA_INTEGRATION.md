# Live Data Integration System

This document describes the live data integration system implemented for the interactive portfolio website.

## Overview

The live data integration system provides real-time metrics and status updates for Isaac's projects, including:

- **Live Project Metrics**: Real-time performance data from Sunday Edge Pro, Restocktime, Shuk Online, and other projects
- **Scraper Status Dashboard**: Live monitoring of Google scrapers and website monitoring tools
- **Automated Data Refresh**: Background data fetching with error handling and fallback mechanisms
- **WebSocket Support**: Real-time updates (with polling fallback)

## Architecture

### API Routes

#### `/api/live-metrics`
- **Purpose**: Fetches live metrics from project APIs
- **Parameters**: 
  - `projectId` (optional): Specific project to fetch metrics for
- **Response**: Live metrics data with fallback to static data on API failures
- **Features**:
  - 5-second timeout per API call
  - Automatic fallback to static data
  - Error handling with detailed error messages
  - Support for both individual and bulk project metrics

#### `/api/scraper-status`
- **Purpose**: Provides real-time status of scrapers and monitoring systems
- **Parameters**:
  - `type`: 'scrapers' | 'monitors' | 'all'
- **Response**: Live scraper status, monitoring metrics, and system health data
- **Features**:
  - Real-time scraper performance metrics
  - Website monitoring status
  - System uptime and alert information

#### `/api/websocket`
- **Purpose**: WebSocket endpoint information (placeholder for future implementation)
- **Features**:
  - WebSocket connection details
  - Fallback polling configuration
  - Message type definitions

### React Hooks

#### `useLiveMetrics(options)`
- **Purpose**: Manages live metrics data fetching and real-time updates
- **Options**:
  - `projectId`: Specific project to monitor
  - `refreshInterval`: Update frequency (default: 30 seconds)
  - `enableRealTime`: Enable WebSocket connections
  - `fallbackToStatic`: Use static data on failures
- **Returns**:
  - `data`: Live metrics data
  - `isLoading`: Loading state
  - `error`: Error messages
  - `refresh`: Manual refresh function
  - `connectionStatus`: Real-time connection status

#### `useScraperStatus(type)`
- **Purpose**: Manages scraper and monitoring status data
- **Parameters**:
  - `type`: 'scrapers' | 'monitors' | 'all'
- **Features**:
  - 15-second refresh interval
  - Automatic error handling
  - Real-time status updates

### Components

#### `LiveMetrics`
- **Purpose**: Displays real-time project metrics with visual indicators
- **Features**:
  - Project-specific metric displays
  - Real-time connection status indicator
  - Trend indicators (up/down/stable)
  - Fallback data notifications

#### `ScraperDashboard`
- **Purpose**: Comprehensive dashboard for scraper and monitoring status
- **Features**:
  - Tabbed interface (Scrapers/Monitoring)
  - Real-time status cards
  - Performance metrics summaries
  - Alert notifications

### Data Refresh Service

#### `DataRefreshService`
- **Purpose**: Automated background data fetching with error handling
- **Features**:
  - Configurable refresh intervals
  - Exponential backoff retry logic
  - Global error handling
  - Job management (start/stop/remove)
  - Memory cleanup on page unload

## Configuration

### Environment Variables

Create a `.env.local` file with the following variables:

```env
# Live Data Integration API Endpoints
SUNDAY_EDGE_PRO_API=https://api.sundayedgepro.com/metrics
RESTOCKTIME_API=https://api.restocktime.com/metrics
SHUK_ONLINE_API=https://api.shukonline.com/metrics
WEBSITE_MONITOR_API=https://api.websitemonitorpro.com/metrics

# API Authentication
API_TOKEN=your_api_token_here

# WebSocket Configuration (optional)
WEBSOCKET_URL=ws://localhost:3001
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster
```

### API Integration

To integrate with real APIs:

1. **Update API endpoints** in `.env.local`
2. **Configure authentication** tokens
3. **Implement API-specific data mapping** in the route handlers
4. **Test error handling** with real API failures

## Usage Examples

### Basic Live Metrics Display

```tsx
import LiveMetrics from '@/components/sections/projects/LiveMetrics'

function ProjectPage({ projectId }: { projectId: string }) {
  return (
    <div>
      <LiveMetrics 
        projectId={projectId}
        showRealTimeIndicator={true}
        className="mb-6"
      />
    </div>
  )
}
```

### Scraper Dashboard

```tsx
import ScraperDashboard from '@/components/sections/projects/ScraperDashboard'

function AdminDashboard() {
  return (
    <div>
      <ScraperDashboard className="w-full" />
    </div>
  )
}
```

### Custom Data Refresh

```tsx
import { useDataRefresh, REFRESH_CONFIGS } from '@/lib/dataRefreshService'

function CustomComponent() {
  const { startRefresh, stopRefresh } = useDataRefresh()
  
  useEffect(() => {
    // Start refreshing Sunday Edge Pro data every minute
    startRefresh('sunday-edge-pro', REFRESH_CONFIGS.sundayEdgePro())
    
    return () => {
      stopRefresh('sunday-edge-pro')
    }
  }, [])
  
  // Component implementation...
}
```

## Error Handling

The system implements comprehensive error handling:

### API Failures
- **Timeout handling**: 5-second timeout for API calls
- **Retry logic**: Exponential backoff with configurable attempts
- **Fallback data**: Static data when live APIs are unavailable
- **Error notifications**: User-friendly error messages

### Network Issues
- **Connection status**: Real-time connection indicators
- **Graceful degradation**: Continues functioning with cached data
- **Automatic recovery**: Retries failed connections automatically

### Data Validation
- **Type safety**: Full TypeScript type checking
- **Data sanitization**: Validates incoming API data
- **Error boundaries**: Prevents crashes from malformed data

## Performance Optimizations

### Caching Strategy
- **Browser caching**: Intelligent caching of API responses
- **Memory management**: Cleanup of unused data and timers
- **Request deduplication**: Prevents duplicate API calls

### Efficient Updates
- **Selective updates**: Only updates changed data
- **Batch processing**: Groups multiple updates together
- **Lazy loading**: Loads data only when needed

### Resource Management
- **Timer cleanup**: Automatic cleanup of intervals and timeouts
- **Memory leaks prevention**: Proper cleanup on component unmount
- **Connection pooling**: Efficient WebSocket connection management

## Testing

### API Testing
```bash
# Test live metrics API
curl http://localhost:3000/api/live-metrics

# Test specific project metrics
curl http://localhost:3000/api/live-metrics?projectId=sunday-edge-pro

# Test scraper status
curl http://localhost:3000/api/scraper-status?type=scrapers
```

### Component Testing
The components include loading states, error handling, and fallback content for comprehensive testing scenarios.

## Future Enhancements

### WebSocket Implementation
- Real-time bidirectional communication
- Instant metric updates
- Live notification system

### Advanced Analytics
- Historical data tracking
- Performance trend analysis
- Predictive metrics

### Enhanced Monitoring
- Custom alert thresholds
- Multi-channel notifications
- Automated incident response

## Troubleshooting

### Common Issues

1. **API Connection Failures**
   - Check environment variables
   - Verify API endpoints are accessible
   - Review authentication tokens

2. **Slow Performance**
   - Adjust refresh intervals
   - Enable caching
   - Optimize API response sizes

3. **Memory Leaks**
   - Ensure proper cleanup in useEffect
   - Check for unclosed intervals
   - Monitor component unmounting

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
DEBUG=live-data:*
```

This comprehensive live data integration system provides a robust foundation for displaying real-time project metrics and system status while maintaining excellent user experience through intelligent fallbacks and error handling.