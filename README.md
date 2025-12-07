# Playwright Template for UI and API Testing

A comprehensive Playwright testing framework for both E2E and API testing with best practices, test data management, and integrated reporting via Allure.

**Test Application:** [Contact List Management](https://thinking-tester-contact-list.herokuapp.com)

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Setup Guide](#setup-guide)
3. [Project Structure](#project-structure)
4. [Running Tests](#running-tests)
5. [Test Tags and Filtering](#test-tags-and-filtering)
6. [Environment Configuration](#environment-configuration)
7. [API Base Testing](#api-base-testing)
8. [Test Data Management](#test-data-management)
9. [Reporting](#reporting)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)

## Prerequisites

- **Node.js**: v18.0.0 or higher ([Download LTS](https://nodejs.org/en/))
- **npm**: Comes bundled with Node.js
- **VS Code**: Recommended IDE
- **Playwright Plugin**: VS Code extension for test execution
- **Git**: For version control

## Setup Guide

### 1. Initial Setup

```bash
# Clone the repository
git clone https://github.com/patrickduong/PlaywrightTemplateForUIAndAPITesting.git
cd PlaywrightTemplateForUIAndAPITesting

# Install Node.js dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### 2. VS Code Extensions (Optional but Recommended)

Install from VS Code Extensions marketplace:
- **Playwright Test for VS Code** - Run tests directly from editor
- **Prettier - Code formatter** - Automatic code formatting
- **Thunder Client** - Test APIs manually

### 3. Environment Configuration

```bash
# Copy the example environment file
cp configs/.env.example configs/.env.local

# Edit with your credentials
nano configs/.env.local
```

**Required Environment Variables:**
```env
BASE_URL=https://thinking-tester-contact-list.herokuapp.com
API_URL=https://thinking-tester-contact-list.herokuapp.com
USER_NAME=<your_test_email@example.com>
PASS_WORD=<your_test_password>
```

> **🔐 Detailed Setup:** See `AUTHENTICATION_SETUP.md` for complete instructions on creating a test account and configuring credentials. This is required for API tests to work!

## Project Structure

```
.
├── TEST_PROJECT/
│   ├── API/
│   │   ├── base/
│   │   │   └── api-base-test.ts          # Custom fixtures for API testing
│   │   ├── data-test/
│   │   │   └── contact/                  # Test data JSON files
│   │   ├── dataobject/
│   │   │   └── object.types.ts           # TypeScript types
│   │   └── tests/
│   │       ├── features/                 # API test specs
│   │       └── setups/                   # Setup/auth helpers
│   ├── E2E/
│   │   ├── pages/
│   │   │   ├── base.page.ts              # Base Page Object Model
│   │   │   └── common.page.ts            # Shared page actions
│   │   └── tests/
│   │       ├── features/                 # E2E test specs
│   │       └── setups/                   # Login setup
│
├── UTILS/
│   ├── loadenv.ts                        # Environment variable loader
│   ├── config-data-helper.ts             # Load test data from JSON
│   ├── dynamic-data-generator.ts         # Generate random test data
│   ├── date-time-data-helper.ts          # Date/time utilities
│   └── file-helper.ts                    # File operations
│
├── configs/
│   ├── .env.example                      # Environment template
│   ├── .env.local                        # Local credentials (not committed)
│   └── .auth/                            # Browser auth state (auto-generated)
│
├── constants.ts                          # Shared constants & enums
├── playwright.config.ts                  # Playwright configuration
├── global-setup.ts                       # Global test setup
├── global-teardown.ts                    # Global test teardown
└── tsconfig.json                         # TypeScript configuration
```

## Running Tests

### CLI Commands

```bash
# Run all API tests on local environment (using npm script)
npm run test:api:local

# Run all E2E tests on local environment (using npm script)
npm run test:e2e:local

# Run specific project directly
npx playwright test --project=api_testing

# Run with specific environment (if using direct npx command)
ENV=local npx playwright test --project=api_testing

# Run E2E tests with specific browser and headed mode
npx playwright test --project=e2e_testing --headed --browser=chromium

# Run in debug mode
npx playwright test --debug

# View test report
npx allure serve allure-results
```

### Alternative: Using Environment Variable Directly

If you need to run tests on a different environment (not local):

```bash
# Run API tests on staging environment
ENV=staging npx playwright test --project=api_testing

# Run E2E tests on production environment
ENV=production npx playwright test --project=e2e_testing
```

### VS Code UI Testing

1. Open the **Testing** tab (left sidebar)
2. Select test project and file
3. Click the ▶️ **Run** icon next to any test

## Test Tags and Filtering

### Available Tags

```typescript
@smoke      // Quick smoke tests
@regression // Full regression suite
@sanity     // Basic sanity checks
@e2e        // End-to-end tests
@api        // API tests
@integration// Integration tests
@critical   // Critical business logic
@slow       // Long-running tests
@flaky      // Known flaky tests
```

### Running Tagged Tests

```bash
# Run smoke tests only
npx playwright test --grep "@smoke"

# Run multiple tags (OR condition)
npx playwright test --grep "@smoke|@regression"

# Run API tests excluding slow tests (NOT condition)
npx playwright test --grep "@api" --grep-invert "@slow"

# Run API tests with specific environment
ENV=staging npx playwright test --grep "@api"
```

## Environment Configuration

### Supported Environments

Create environment-specific `.env` files:

- `configs/.env.local` - Local development
- `configs/.env.staging` - Staging environment
- `configs/.env.production` - Production environment

**Example:**
```bash
# Run tests on staging
ENV=staging npm run test:api:local
```

### Custom Configuration Variables

```env
# Test execution
HEADLESS=false                    # Run browser in headed mode
TEST_TIMEOUT=60000               # Global test timeout (ms)
E2E_RETRIES=2                    # Retry failed E2E tests

# Project info
PROJECT_NAME=My-Test-Project     # Display name in reports
```

## API Base Testing

### Custom Fixtures

The API base test provides helpful fixtures:

```typescript
import { test, expect } from '../base/api-base-test';

test('Example API test', async ({ apiContext, assertResponseCode }) => {
    // apiContext - Pre-configured request context with auth headers
    const response = await apiContext.get('/contacts');
    
    // assertResponseCode - Helper to assert HTTP status codes
    await assertResponseCode(response, 200);
});
```

### Response Code Enums

```typescript
import { APIResponseCodes } from '../../../../constants';

await assertResponseCode(response, APIResponseCodes.OK);        // 200
await assertResponseCode(response, APIResponseCodes.CREATED);  // 201
await assertResponseCode(response, APIResponseCodes.NOT_FOUND); // 404
```

## Test Data Management

### Loading Test Data

Test data files support **dynamic placeholder replacement**:

```typescript
// Load data from configs/data-test/contact/contact_data_local.json
const contactData = loadDataConfig('TEST_PROJECT/API', 'contact', 'local');
```

### Placeholder Syntax

In your JSON test data files:

```json
{
    "title": "Test_{timestamp}",
    "email": "user_{random}@test.com",
    "code": "{random2}",
    "date": "{full_date}",
    "day": "{single_date}"
}
```

**Available Placeholders:**
- `{timestamp}` - Current full timestamp
- `{random}` - Random 4-digit number
- `{random2}` - Random 2-digit number (1-50)
- `{single_date}` - Day (dd)
- `{full_date}` - Full date (mm/dd/yyyy)

### Generating Random Data

```typescript
import { DynamicDataGenerator } from '../../../../UTILS/dynamic-data-generator';
import { faker } from '@faker-js/faker';

// Custom generators
const uniqueTitle = DynamicDataGenerator.generateUniqueTitle('Contact');
const randomAddress = DynamicDataGenerator.generateRandomAddress();

// Faker for rich data
const email = faker.internet.email();
const phone = faker.phone.number();
const name = faker.person.fullName();
```

## Reporting

### Allure Reports

Generate and view detailed test reports:

```bash
# Generate and serve the report
npx allure serve allure-results

# Generate static HTML report
npx allure generate allure-results --clean -o allure-report
```

### Report Contents

- Test execution timeline
- Pass/fail statistics
- Failure screenshots and videos
- Test categories and severity
- Retry information
- Environment details

## Best Practices

### Test Structure (AAA Pattern)

```typescript
test('Should create a contact successfully', async ({ apiContext, assertResponseCode }) => {
    // Arrange - Setup test data
    const contactData = generateContactData();
    
    // Act - Execute the action
    const response = await apiContext.post('/contacts', { data: contactData });
    
    // Assert - Verify results
    await assertResponseCode(response, 201);
    const body = await response.json();
    expect(body._id).toBeTruthy();
});
```

### Naming Conventions

- **Test files:** `*.spec.ts` (kebab-case)
- **Page Objects:** `PascalCase` classes
- **Variables:** `camelCase`
- **Enums:** `UPPER_CASE` or `PascalCase`

### Error Handling

```typescript
try {
    const data = loadDataConfig('TEST_PROJECT/API', 'contact', 'local');
} catch (error) {
    console.error('Failed to load test data:', error.message);
    throw error;
}
```

### Wait Best Practices

```typescript
import { DefaultWaits } from '../../../../constants';

// Instead of: await page.waitForTimeout(1000)
// Use: 
await page.waitForTimeout(DefaultWaits.SHORT);
await page.waitForTimeout(DefaultWaits.MEDIUM);
await page.waitForTimeout(DefaultWaits.LONG);
```

## Troubleshooting

### Issue: "Environment file not found"

```bash
# Solution: Copy the example file
cp configs/.env.example configs/.env.local

# Edit with your values
nano configs/.env.local
```

### Issue: "No tests found" when running with tags

```bash
# Verify tags are properly formatted in test file
test('@smoke @api Create contact', async ({...}) => {
    // Test code
});

# Run with correct grep pattern
npx playwright test --grep "@smoke"
```

### Issue: "Expected response code [201], but got [401]"

This is an **authentication error** - the API rejected your request because your credentials are invalid or missing.

**Root Causes:**
1. Test account credentials are incorrect
2. Test account doesn't exist
3. Email/password mismatch

**How to Fix:**

1. **Verify Credentials**
   ```bash
   # Check your .env.local
   cat configs/.env.local
   # Make sure USER_NAME and PASS_WORD are filled correctly
   ```

2. **Test Manually**
   ```bash
   # Try logging in on the website first
   # https://thinking-tester-contact-list.herokuapp.com
   # If you can't log in there, the credentials are wrong
   ```

3. **Create a New Test Account**
   - Follow instructions in `AUTHENTICATION_SETUP.md`
   - Use the new credentials in `.env.local`

4. **Delete Old Token**
   ```bash
   # Reset the token so a new one will be generated
   sed -i '' 's/ACCESS_TOKEN=.*/ACCESS_TOKEN=/' configs/.env.local
   
   # Try again
   npm run test:api:local -- --list
   ```

**See:** `AUTHENTICATION_SETUP.md` for complete authentication troubleshooting guide.

### Issue: "Browser fails to launch"

```bash
# Reinstall Playwright browsers
npx playwright install

# Run with system dependencies
npx playwright install-deps
```

### Clear Cache and Rebuild

```bash
# Clean test artifacts
rm -rf allure-results test-results

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild and reinstall browsers
npx playwright install
```

## Important Notes

### Files to Never Commit

These are already in `.gitignore`:

```
node_modules/           # Dependencies
.env*                   # Credentials
configs/.auth/          # Browser auth state
allure-results/         # Test artifacts
test-results/           # Test reports
```

### Creating Test Accounts

For the contact list app:
1. Go to https://thinking-tester-contact-list.herokuapp.com
2. Click **"Sign up"**
3. Create test account
4. Add credentials to `.env.local`

## Quick Reference

| Command | Purpose |
|---------|---------|
| `npm install` | Install dependencies |
| `npm run test:api:local` | Run all API tests |
| `npm run test:e2e:local` | Run all E2E tests |
| `npx playwright test --headed` | Run with visible browser |
| `npx playwright test --debug` | Run in debug mode |
| `npx allure serve` | View test report |

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Follow naming conventions
3. Add tests for new features
4. Update this README if adding new utilities
5. Submit pull request

## License

ISC License - See LICENSE file for details

## Contact

**Author:** MyDuong  
**Project:** [GitHub Repository](https://github.com/patrickduong/PlaywrightTemplateForUIAndAPITesting)
