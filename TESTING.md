# Testing Documentation

This document outlines the comprehensive testing strategy implemented for the Interactive Portfolio Website.

## Testing Stack

### Unit & Integration Testing
- **Jest**: JavaScript testing framework
- **React Testing Library**: Testing utilities for React components
- **@testing-library/jest-dom**: Custom Jest matchers for DOM elements
- **@testing-library/user-event**: User interaction simulation

### End-to-End Testing
- **Playwright**: Cross-browser end-to-end testing
- **@axe-core/playwright**: Accessibility testing integration

### Visual Regression Testing
- **Playwright Screenshots**: Built-in visual regression testing
- **Storybook**: Component development and visual testing
- **Chromatic**: Visual regression testing service (optional)

### Performance Testing
- **Lighthouse**: Performance auditing
- **Web Vitals**: Core Web Vitals monitoring
- **Custom Performance Metrics**: Memory usage, animation performance

### Accessibility Testing
- **axe-core**: Automated accessibility testing
- **jest-axe**: Jest integration for accessibility tests
- **Manual Testing**: Keyboard navigation, screen reader compatibility

## Test Structure

```
src/
├── __tests__/
│   ├── components/
│   │   ├── ui/
│   │   └── sections/
│   ├── hooks/
│   ├── lib/
│   ├── utils/
│   └── accessibility/
e2e/
├── tests/
│   ├── homepage.spec.ts
│   ├── contact-form.spec.ts
│   ├── accessibility.spec.ts
│   ├── performance.spec.ts
│   └── visual-regression.spec.ts
```

## Running Tests

### Unit Tests
```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI
npm run test:ci
```

### End-to-End Tests
```bash
# Install Playwright browsers
npm run playwright:install

# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode
npm run test:e2e:headed
```

### Specific Test Suites
```bash
# Run accessibility tests only
npm run test:accessibility

# Run performance tests only
npm run test:performance

# Run visual regression tests only
npm run test:visual

# Run all tests
npm run test:all
```

## Test Coverage

### Coverage Targets
- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Coverage Reports
Coverage reports are generated in the `coverage/` directory and include:
- HTML report: `coverage/lcov-report/index.html`
- LCOV format: `coverage/lcov.info`
- JSON format: `coverage/coverage-final.json`

## Testing Guidelines

### Unit Tests
1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Use Descriptive Test Names**: Test names should clearly describe what is being tested
3. **Arrange, Act, Assert**: Structure tests with clear setup, execution, and verification phases
4. **Mock External Dependencies**: Use mocks for API calls, external libraries, and complex dependencies

### Integration Tests
1. **Test User Workflows**: Focus on complete user interactions and workflows
2. **Test Component Integration**: Verify that components work together correctly
3. **Test Error Boundaries**: Ensure error handling works as expected

### E2E Tests
1. **Test Critical User Paths**: Focus on the most important user journeys
2. **Use Page Object Model**: Organize tests with reusable page objects
3. **Handle Async Operations**: Properly wait for elements and operations to complete
4. **Test Across Browsers**: Ensure compatibility across different browsers

### Accessibility Tests
1. **Automated Testing**: Use axe-core for automated accessibility checks
2. **Manual Testing**: Test keyboard navigation and screen reader compatibility
3. **Color Contrast**: Verify color contrast meets WCAG standards
4. **Focus Management**: Ensure proper focus management for interactive elements

### Performance Tests
1. **Core Web Vitals**: Monitor LCP, FID, and CLS metrics
2. **Load Times**: Ensure pages load within acceptable timeframes
3. **Bundle Size**: Monitor JavaScript bundle sizes
4. **Memory Usage**: Check for memory leaks and excessive memory usage

### Visual Regression Tests
1. **Component States**: Test different states of components
2. **Responsive Design**: Test across different viewport sizes
3. **Cross-Browser**: Ensure visual consistency across browsers
4. **Animation States**: Test components with animations disabled

## Continuous Integration

### GitHub Actions
The project includes GitHub Actions workflows for:
- **Unit Tests**: Run on Node.js 18.x and 20.x
- **E2E Tests**: Run on Ubuntu with Playwright
- **Accessibility Tests**: Dedicated accessibility testing
- **Performance Tests**: Performance monitoring
- **Visual Regression**: Visual comparison testing

### Test Reports
Test reports are automatically generated and uploaded as artifacts:
- **Coverage Reports**: Unit test coverage
- **Playwright Reports**: E2E test results with screenshots and videos
- **Accessibility Reports**: Detailed accessibility findings
- **Performance Reports**: Performance metrics and recommendations

## Best Practices

### Writing Tests
1. **Keep Tests Simple**: Each test should focus on one specific behavior
2. **Use Real User Interactions**: Simulate how users actually interact with the application
3. **Avoid Testing Implementation Details**: Focus on user-visible behavior
4. **Make Tests Independent**: Tests should not depend on each other
5. **Use Meaningful Assertions**: Assertions should clearly express the expected behavior

### Test Data
1. **Use Factories**: Create test data using factory functions
2. **Mock External APIs**: Use consistent mock data for external services
3. **Clean Up**: Ensure tests clean up after themselves

### Performance
1. **Parallel Execution**: Run tests in parallel when possible
2. **Selective Testing**: Use test patterns to run specific test suites
3. **Optimize Setup**: Minimize test setup time

## Debugging Tests

### Unit Tests
```bash
# Debug specific test file
npm run test -- --testPathPattern=Button.test.tsx

# Debug with verbose output
npm run test -- --verbose

# Debug with coverage
npm run test -- --coverage --testPathPattern=Button.test.tsx
```

### E2E Tests
```bash
# Debug with headed browser
npm run test:e2e:headed

# Debug specific test
npx playwright test homepage.spec.ts --debug

# Generate trace
npx playwright test --trace on
```

### Visual Tests
```bash
# Update visual baselines
npx playwright test --update-snapshots

# Compare visual differences
npx playwright show-report
```

## Maintenance

### Regular Tasks
1. **Update Dependencies**: Keep testing dependencies up to date
2. **Review Coverage**: Monitor test coverage and add tests for uncovered code
3. **Update Baselines**: Update visual regression baselines when UI changes
4. **Performance Monitoring**: Regularly check performance metrics

### When Adding New Features
1. **Write Tests First**: Consider TDD approach for new features
2. **Update E2E Tests**: Add E2E tests for new user workflows
3. **Check Accessibility**: Ensure new features are accessible
4. **Monitor Performance**: Check impact on performance metrics

## Troubleshooting

### Common Issues
1. **Flaky Tests**: Use proper waits and stable selectors
2. **Memory Leaks**: Clean up event listeners and timers in tests
3. **Timeout Issues**: Increase timeouts for slow operations
4. **Visual Differences**: Check for animation timing and font loading

### Getting Help
- Check the [Jest documentation](https://jestjs.io/docs/getting-started)
- Review [React Testing Library guides](https://testing-library.com/docs/react-testing-library/intro/)
- Consult [Playwright documentation](https://playwright.dev/docs/intro)
- Check [axe-core documentation](https://github.com/dequelabs/axe-core) for accessibility testing