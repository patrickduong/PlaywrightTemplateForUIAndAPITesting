# Quick Start Guide - Improved Playwright Template

## 🎯 5-Minute Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Environment
```bash
# Copy template
cp configs/.env.example configs/.env.local

# Edit with YOUR credentials
# IMPORTANT: You need a real test account on the contact list app!
# See AUTHENTICATION_SETUP.md for detailed instructions
nano configs/.env.local
```

**What to fill in:**
```env
USER_NAME=your_test_email@example.com    # Email from your test account
PASS_WORD=your_test_password             # Password from your test account
```

> **Don't have a test account yet?** See `AUTHENTICATION_SETUP.md` for step-by-step instructions on creating one.

### Step 3: Verify Setup
```bash
# List available tests (uses local environment from npm script)
npm run test:api:local -- --list

# Expected output: ✓ Environment loaded: local
#                  ✓ Loaded configuration data...
#                  Total: 5 tests found
```

### Step 4: Run Your First Test
```bash
# Run smoke tests only using npm script (includes ENV=local)
npm run test:api:local -- --grep "@smoke"

# Or run all API tests
npm run test:api:local

# Or run E2E tests
npm run test:e2e:local

# Or use direct npx command with environment variable
npx playwright test --grep "@smoke"
```

### Step 5: View Reports
```bash
# Generate and open Allure report
npx allure serve allure-results
```

---

## 📋 What's New?

### ✨ New Files
- `tsconfig.json` - TypeScript strict mode configuration
- `configs/.env.example` - Environment template
- `README_IMPROVED.md` - Comprehensive documentation
- `IMPROVEMENTS.md` - Detailed improvement log
- `TEST_PROJECT/API/tests/features/API_Feature_1/improved-contact-api.spec.ts` - Best practices example

### 🔧 Improved Files
- `UTILS/loadenv.ts` - Better error handling
- `constants.ts` - New test tags and enums
- `playwright.config.ts` - Configurable via environment
- `.gitignore` - Better security
- `package.json` - Clean dependencies
- `UTILS/*` - JSDoc comments added

---

## 🚀 Common Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install all dependencies |
| `npm run test:api:local` | Run all API tests (local env) |
| `npm run test:e2e:local` | Run all E2E tests (local env) |
| `npx playwright test --grep "@smoke"` | Run smoke tests only |
| `npx playwright test --grep "@smoke\|@regression"` | Run multiple tags |
| `npx playwright test --headed` | Run with visible browser |
| `npx playwright test --debug` | Debug mode |
| `npx allure serve allure-results` | View test report |
| `ENV=staging npx playwright test --project=api_testing` | Run on staging environment |

---

## 🏷️ Test Tags

Use these tags to organize and filter tests:

- `@smoke` - Quick smoke tests
- `@regression` - Full regression suite
- `@api` - API tests
- `@e2e` - End-to-end tests
- `@critical` - Critical tests
- `@slow` - Long-running tests

**Example:**
```bash
# Run only API and smoke tests
npx playwright test --grep "@api|@smoke"

# Run regression tests excluding slow ones
npx playwright test --grep "@regression" --grep-invert "@slow"
```

---

## 🔐 Important Security Notes

### ❌ Never Commit These Files
```
.env.local              # Your credentials
.env                    # Environment file
configs/.auth/          # Browser state
node_modules/           # Dependencies
allure-results/         # Test artifacts
test-results/           # Test reports
```

These are already in `.gitignore` ✓

### ✅ Safe to Commit
```
.env.example            # Template only
tsconfig.json           # Configuration
playwright.config.ts    # Settings
README_IMPROVED.md      # Documentation
IMPROVEMENTS.md         # Change log
TEST_PROJECT/           # Test code
UTILS/                  # Helper code
```

---

## 📊 Project Structure

```
PlaywrightTemplateForUIAndAPITesting/
├── configs/
│   ├── .env.example              ← Copy this to .env.local
│   └── .env.local               ← Add YOUR credentials here
├── TEST_PROJECT/
│   ├── API/
│   │   └── tests/features/       ← Your API tests
│   └── E2E/
│       └── tests/features/       ← Your E2E tests
├── UTILS/                        ← Helper utilities
├── constants.ts                  ← Test enums & tags
├── playwright.config.ts          ← Playwright settings
├── README_IMPROVED.md            ← Full documentation
├── IMPROVEMENTS.md               ← What changed
└── package.json                  ← Dependencies
```

---

## 🐛 Troubleshooting

### "Environment file not found"
```bash
# Solution: Create the file
cp configs/.env.example configs/.env.local
nano configs/.env.local  # Add your credentials
```

### "Missing required environment variables"
```bash
# Edit .env.local and fill in:
USER_NAME=your_username
PASS_WORD=your_password
```

### "No tests found"
```bash
# Verify tags are correct
npx playwright test --grep "@smoke"  # lowercase, no spaces

# List all tests to verify
npm run test:api:local -- --list
```

### "Browser fails to launch"
```bash
# Reinstall browsers
npx playwright install
npx playwright install-deps
```

---

## 🎓 Learn More

- **Full Documentation**: See `README_IMPROVED.md`
- **What Changed**: See `IMPROVEMENTS.md`
- **Test Example**: See `TEST_PROJECT/API/tests/features/API_Feature_1/improved-contact-api.spec.ts`
- **Constants**: See `constants.ts` for all enums

---

## ✅ Verification Checklist

Before running tests, verify:

- [ ] You have Node.js v18+ installed (`node -v`)
- [ ] Dependencies installed (`npm install`)
- [ ] `configs/.env.local` exists with your credentials
- [ ] You created account on https://thinking-tester-contact-list.herokuapp.com
- [ ] `.env.local` has your username and password
- [ ] Tests are discoverable (`npm run test:api:local -- --list`)

---

## 🎉 You're Ready!

Run your first test:
```bash
npm run test:api:local
```

View the results:
```bash
npx allure serve allure-results
```

---

**Need help?** Read `README_IMPROVED.md` for comprehensive documentation.
