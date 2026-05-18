# Allure Report & Playwright Upgrade Guide

## 🔴 Allure Report Issues

### Root Causes
1. **Allure CLI not found** — Using `npx allure` instead of `npx allure-commandline`
2. **Missing test results** — No `.json` files in `allure-results/` directory
3. **Java not installed** — Allure CLI requires Java runtime

### Fix Steps
1. **Verify test results exist:**
   ```bash
   ls -la allure-results/ | grep .json
   ```

2. **Check Java is installed:**
   ```bash
   java -version
   ```

3. **Update [global-teardown.ts](global-teardown.ts#L18) to use correct command:**
   ```bash
   npx allure-commandline generate ./allure-results --clean -o ./allure-report
   ```

## 🟢 Playwright 1.50.1 → 1.56.0 Upgrade

### Why Safe?
- ✅ Node 24 compatible
- ✅ allure-playwright 3.0.5 compatible
- ✅ @types/node ^22.10.2 already supports Node 24

### Changes Required

**1. Update [package.json](package.json):**
```json
"@playwright/test": "^1.56.0"
```

**2. Update [playwright.config.ts](playwright.config.ts#L64):**
```typescript
PlaywrightVersion: '1.56.0',
```

**3. Install & update packages:**
```bash
npm install
npm install -g allure-commandline
```

### Verify After Upgrade
```bash
npm run test:api:local
npm run test:e2e:local
```

## 🚀 Quick Action Checklist
- [ ] Verify `allure-commandline` is installed globally
- [ ] Check Java is installed: `java -version`
- [ ] Upgrade Playwright to 1.56.0
- [ ] Update playwright.config.ts version reference
- [ ] Run tests and verify Allure report generates
