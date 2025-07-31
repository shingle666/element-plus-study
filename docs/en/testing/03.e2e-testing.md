# End-to-End Testing with Element Plus

## Overview

End-to-End (E2E) testing validates your entire application from the user's perspective, ensuring that all components, services, and integrations work together correctly. This guide covers comprehensive E2E testing strategies for Element Plus applications.

## Testing Framework Setup

### Playwright Configuration

```bash
# Install Playwright
npm install --save-dev @playwright/test
npx playwright install
```

```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },
})
```

### Cypress Configuration

```bash
# Install Cypress
npm install --save-dev cypress
```

```javascript
// cypress.config.js
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    retries: {
      runMode: 2,
      openMode: 0
    },
    env: {
      apiUrl: 'http://localhost:3001/api',
      coverage: false
    }
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.js'
  },
})
```

## Page Object Model

### Base Page Class

```javascript
// tests/e2e/pages/BasePage.js
export class BasePage {
  constructor(page) {
    this.page = page
  }
  
  async goto(path = '/') {
    await this.page.goto(path)
    await this.page.waitForLoadState('networkidle')
  }
  
  async waitForElement(selector, options = {}) {
    return await this.page.waitForSelector(selector, { timeout: 10000, ...options })
  }
  
  async clickElement(selector) {
    await this.page.click(selector)
  }
  
  async fillInput(selector, value) {
    await this.page.fill(selector, value)
  }
  
  async selectOption(selector, value) {
    await this.page.click(selector)
    await this.page.click(`.el-select-dropdown__item:has-text("${value}")`)
  }
  
  async uploadFile(selector, filePath) {
    await this.page.setInputFiles(selector, filePath)
  }
  
  async waitForLoading() {
    await this.page.waitForSelector('.el-loading-mask', { state: 'hidden', timeout: 30000 })
  }
  
  async expectMessage(type, text) {
    const messageSelector = `.el-message--${type}`
    await this.page.waitForSelector(messageSelector)
    const message = this.page.locator(messageSelector)
    await expect(message).toContainText(text)
  }
  
  async expectNotification(type, title) {
    const notificationSelector = `.el-notification--${type}`
    await this.page.waitForSelector(notificationSelector)
    const notification = this.page.locator(notificationSelector)
    await expect(notification).toContainText(title)
  }
  
  async takeScreenshot(name) {
    await this.page.screenshot({ path: `screenshots/${name}.png`, fullPage: true })
  }
}
```

### Login Page Object

```javascript
// tests/e2e/pages/LoginPage.js
import { BasePage } from './BasePage.js'
import { expect } from '@playwright/test'

export class LoginPage extends BasePage {
  constructor(page) {
    super(page)
    this.usernameInput = '[data-testid="username"] input'
    this.passwordInput = '[data-testid="password"] input'
    this.loginButton = '[data-testid="login-button"]'
    this.forgotPasswordLink = '[data-testid="forgot-password"]'
    this.registerLink = '[data-testid="register-link"]'
    this.rememberMeCheckbox = '[data-testid="remember-me"] input'
    this.errorMessage = '.el-form-item__error'
  }
  
  async goto() {
    await super.goto('/login')
    await this.waitForElement(this.loginButton)
  }
  
  async login(username, password, rememberMe = false) {
    await this.fillInput(this.usernameInput, username)
    await this.fillInput(this.passwordInput, password)
    
    if (rememberMe) {
      await this.page.check(this.rememberMeCheckbox)
    }
    
    await this.clickElement(this.loginButton)
  }
  
  async expectLoginSuccess() {
    await this.page.waitForURL('/dashboard')
    await expect(this.page.locator('h1')).toContainText('Dashboard')
  }
  
  async expectLoginError(message) {
    await this.expectMessage('error', message)
  }
  
  async expectValidationError(field, message) {
    const errorElement = this.page.locator(`[data-testid="${field}"] + ${this.errorMessage}`)
    await expect(errorElement).toContainText(message)
  }
  
  async clickForgotPassword() {
    await this.clickElement(this.forgotPasswordLink)
    await this.page.waitForURL('/forgot-password')
  }
  
  async clickRegister() {
    await this.clickElement(this.registerLink)
    await this.page.waitForURL('/register')
  }
}
```

### Dashboard Page Object

```javascript
// tests/e2e/pages/DashboardPage.js
import { BasePage } from './BasePage.js'
import { expect } from '@playwright/test'

export class DashboardPage extends BasePage {
  constructor(page) {
    super(page)
    this.userMenu = '[data-testid="user-menu"]'
    this.logoutButton = '[data-testid="logout"]'
    this.profileButton = '[data-testid="profile"]'
    this.settingsButton = '[data-testid="settings"]'
    this.notificationBell = '[data-testid="notifications"]'
    this.sidebarToggle = '[data-testid="sidebar-toggle"]'
    this.breadcrumb = '.el-breadcrumb'
    this.statsCards = '[data-testid="stats-card"]'
    this.chartContainer = '[data-testid="chart-container"]'
  }
  
  async goto() {
    await super.goto('/dashboard')
    await this.waitForElement(this.userMenu)
  }
  
  async logout() {
    await this.clickElement(this.userMenu)
    await this.clickElement(this.logoutButton)
    await this.page.waitForURL('/login')
  }
  
  async openProfile() {
    await this.clickElement(this.userMenu)
    await this.clickElement(this.profileButton)
    await this.page.waitForURL('/profile')
  }
  
  async openSettings() {
    await this.clickElement(this.userMenu)
    await this.clickElement(this.settingsButton)
    await this.page.waitForURL('/settings')
  }
  
  async toggleSidebar() {
    await this.clickElement(this.sidebarToggle)
  }
  
  async expectStatsLoaded() {
    await this.waitForElement(this.statsCards)
    const cards = this.page.locator(this.statsCards)
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  }
  
  async expectChartLoaded() {
    await this.waitForElement(this.chartContainer)
    // Wait for chart to render
    await this.page.waitForTimeout(2000)
  }
  
  async getNotificationCount() {
    const badge = this.page.locator(`${this.notificationBell} .el-badge__content`)
    if (await badge.isVisible()) {
      return parseInt(await badge.textContent())
    }
    return 0
  }
}
```

## Complete User Workflows

### User Authentication Flow

```javascript
// tests/e2e/auth-flow.spec.js
import { test, expect } from '@playwright/test'
import { LoginPage } from './pages/LoginPage.js'
import { DashboardPage } from './pages/DashboardPage.js'

test.describe('Authentication Flow', () => {
  let loginPage
  let dashboardPage
  
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page)
    dashboardPage = new DashboardPage(page)
  })
  
  test('successful login and logout', async ({ page }) => {
    await loginPage.goto()
    
    // Login with valid credentials
    await loginPage.login('admin@example.com', 'password123')
    await loginPage.expectLoginSuccess()
    
    // Verify dashboard loads
    await dashboardPage.expectStatsLoaded()
    await dashboardPage.expectChartLoaded()
    
    // Logout
    await dashboardPage.logout()
    
    // Should redirect to login page
    await expect(page).toHaveURL('/login')
  })
  
  test('login with invalid credentials', async ({ page }) => {
    await loginPage.goto()
    
    // Try invalid credentials
    await loginPage.login('invalid@example.com', 'wrongpassword')
    await loginPage.expectLoginError('Invalid credentials')
    
    // Should remain on login page
    await expect(page).toHaveURL('/login')
  })
  
  test('form validation', async ({ page }) => {
    await loginPage.goto()
    
    // Try to login without credentials
    await loginPage.login('', '')
    
    // Should show validation errors
    await loginPage.expectValidationError('username', 'Please input your email')
    await loginPage.expectValidationError('password', 'Please input your password')
    
    // Try invalid email format
    await loginPage.login('invalid-email', 'password')
    await loginPage.expectValidationError('username', 'Please input valid email')
  })
  
  test('remember me functionality', async ({ page, context }) => {
    await loginPage.goto()
    
    // Login with remember me checked
    await loginPage.login('admin@example.com', 'password123', true)
    await loginPage.expectLoginSuccess()
    
    // Close browser and reopen
    await page.close()
    const newPage = await context.newPage()
    
    // Should automatically redirect to dashboard
    await newPage.goto('/login')
    await expect(newPage).toHaveURL('/dashboard')
  })
  
  test('forgot password flow', async ({ page }) => {
    await loginPage.goto()
    
    // Click forgot password
    await loginPage.clickForgotPassword()
    
    // Should navigate to forgot password page
    await expect(page).toHaveURL('/forgot-password')
    
    // Fill email and submit
    await page.fill('[data-testid="email"] input', 'admin@example.com')
    await page.click('[data-testid="send-reset"]')
    
    // Should show success message
    await loginPage.expectMessage('success', 'Password reset email sent')
  })
  
  test('registration flow', async ({ page }) => {
    await loginPage.goto()
    
    // Click register link
    await loginPage.clickRegister()
    
    // Should navigate to registration page
    await expect(page).toHaveURL('/register')
    
    // Fill registration form
    await page.fill('[data-testid="first-name"] input', 'John')
    await page.fill('[data-testid="last-name"] input', 'Doe')
    await page.fill('[data-testid="email"] input', 'john.doe@example.com')
    await page.fill('[data-testid="password"] input', 'password123')
    await page.fill('[data-testid="confirm-password"] input', 'password123')
    await page.check('[data-testid="accept-terms"] input')
    
    // Submit registration
    await page.click('[data-testid="register-button"]')
    
    // Should show success and redirect to login
    await loginPage.expectMessage('success', 'Registration successful')
    await expect(page).toHaveURL('/login')
  })
})
```

### E-commerce Checkout Flow

```javascript
// tests/e2e/checkout-flow.spec.js
import { test, expect } from '@playwright/test'

test.describe('E-commerce Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as customer
    await page.goto('/login')
    await page.fill('[data-testid="username"] input', 'customer@example.com')
    await page.fill('[data-testid="password"] input', 'password123')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/dashboard')
  })
  
  test('complete purchase flow', async ({ page }) => {
    // Browse products
    await page.goto('/products')
    
    // Search for product
    await page.fill('[data-testid="search-input"] input', 'laptop')
    await page.press('[data-testid="search-input"] input', 'Enter')
    
    // Select first product
    await page.click('[data-testid="product-card"]:first-child')
    
    // Add to cart
    await page.click('[data-testid="add-to-cart"]')
    await expect(page.locator('.el-message--success')).toContainText('Added to cart')
    
    // Go to cart
    await page.click('[data-testid="cart-icon"]')
    await page.waitForURL('/cart')
    
    // Verify item in cart
    await expect(page.locator('[data-testid="cart-item"]')).toHaveCount(1)
    
    // Update quantity
    await page.click('[data-testid="quantity-increase"]')
    await expect(page.locator('[data-testid="quantity-input"] input')).toHaveValue('2')
    
    // Proceed to checkout
    await page.click('[data-testid="checkout-button"]')
    await page.waitForURL('/checkout')
    
    // Fill shipping information
    await page.fill('[data-testid="shipping-address"] textarea', '123 Main St, City, State 12345')
    await page.click('[data-testid="shipping-method"]')
    await page.click('.el-select-dropdown__item:has-text("Standard Shipping")')
    
    // Continue to payment
    await page.click('[data-testid="continue-to-payment"]')
    
    // Fill payment information
    await page.fill('[data-testid="card-number"] input', '4111111111111111')
    await page.fill('[data-testid="card-expiry"] input', '12/25')
    await page.fill('[data-testid="card-cvv"] input', '123')
    await page.fill('[data-testid="card-name"] input', 'John Doe')
    
    // Review order
    await page.click('[data-testid="review-order"]')
    
    // Verify order summary
    await expect(page.locator('[data-testid="order-total"]')).toContainText('$')
    
    // Place order
    await page.click('[data-testid="place-order"]')
    
    // Wait for order confirmation
    await page.waitForURL('/order-confirmation')
    await expect(page.locator('h1')).toContainText('Order Confirmed')
    
    // Verify order number
    const orderNumber = await page.locator('[data-testid="order-number"]').textContent()
    expect(orderNumber).toMatch(/^ORD-\d+$/)
  })
  
  test('cart persistence across sessions', async ({ page, context }) => {
    // Add item to cart
    await page.goto('/products')
    await page.click('[data-testid="product-card"]:first-child')
    await page.click('[data-testid="add-to-cart"]')
    
    // Close browser and reopen
    await page.close()
    const newPage = await context.newPage()
    
    // Login again
    await newPage.goto('/login')
    await newPage.fill('[data-testid="username"] input', 'customer@example.com')
    await newPage.fill('[data-testid="password"] input', 'password123')
    await newPage.click('[data-testid="login-button"]')
    
    // Check cart
    await newPage.click('[data-testid="cart-icon"]')
    
    // Item should still be in cart
    await expect(newPage.locator('[data-testid="cart-item"]')).toHaveCount(1)
  })
  
  test('handles payment failures', async ({ page }) => {
    // Mock payment failure
    await page.route('**/api/payments', route => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Payment declined' })
      })
    })
    
    // Add item and proceed to checkout
    await page.goto('/products')
    await page.click('[data-testid="product-card"]:first-child')
    await page.click('[data-testid="add-to-cart"]')
    await page.click('[data-testid="cart-icon"]')
    await page.click('[data-testid="checkout-button"]')
    
    // Fill forms and attempt payment
    await page.fill('[data-testid="shipping-address"] textarea', '123 Main St')
    await page.click('[data-testid="continue-to-payment"]')
    
    await page.fill('[data-testid="card-number"] input', '4000000000000002') // Declined card
    await page.fill('[data-testid="card-expiry"] input', '12/25')
    await page.fill('[data-testid="card-cvv"] input', '123')
    await page.fill('[data-testid="card-name"] input', 'John Doe')
    
    await page.click('[data-testid="place-order"]')
    
    // Should show payment error
    await expect(page.locator('.el-message--error')).toContainText('Payment declined')
    
    // Should remain on checkout page
    await expect(page).toHaveURL('/checkout')
  })
})
```

### Admin Panel Workflow

```javascript
// tests/e2e/admin-workflow.spec.js
import { test, expect } from '@playwright/test'

test.describe('Admin Panel Workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login')
    await page.fill('[data-testid="username"] input', 'admin@example.com')
    await page.fill('[data-testid="password"] input', 'admin123')
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/admin/dashboard')
  })
  
  test('manages users', async ({ page }) => {
    // Navigate to users section
    await page.click('[data-testid="sidebar-users"]')
    await page.waitForURL('/admin/users')
    
    // Create new user
    await page.click('[data-testid="add-user"]')
    
    await page.fill('[data-testid="user-name"] input', 'Test User')
    await page.fill('[data-testid="user-email"] input', 'testuser@example.com')
    await page.fill('[data-testid="user-password"] input', 'password123')
    
    await page.click('[data-testid="user-role"]')
    await page.click('.el-select-dropdown__item:has-text("User")')
    
    await page.click('[data-testid="save-user"]')
    
    // Verify user created
    await expect(page.locator('.el-message--success')).toContainText('User created successfully')
    
    // Search for user
    await page.fill('[data-testid="search-input"] input', 'testuser@example.com')
    await page.press('[data-testid="search-input"] input', 'Enter')
    
    await expect(page.locator('tbody tr')).toHaveCount(1)
    await expect(page.locator('tbody tr td').nth(1)).toContainText('testuser@example.com')
    
    // Edit user
    await page.click('[data-testid="edit-user"]')
    await page.fill('[data-testid="user-name"] input', 'Updated Test User')
    await page.click('[data-testid="save-user"]')
    
    await expect(page.locator('tbody tr td').nth(0)).toContainText('Updated Test User')
    
    // Delete user
    await page.click('[data-testid="delete-user"]')
    await page.click('.el-message-box__btns .el-button--primary')
    
    await expect(page.locator('.el-empty')).toContainText('No data')
  })
  
  test('manages content', async ({ page }) => {
    // Navigate to content section
    await page.click('[data-testid="sidebar-content"]')
    await page.waitForURL('/admin/content')
    
    // Create new article
    await page.click('[data-testid="add-article"]')
    
    await page.fill('[data-testid="article-title"] input', 'Test Article')
    await page.fill('[data-testid="article-slug"] input', 'test-article')
    
    // Use rich text editor
    const editor = page.locator('[data-testid="article-content"] .ql-editor')
    await editor.fill('This is a test article content.')
    
    // Set category
    await page.click('[data-testid="article-category"]')
    await page.click('.el-select-dropdown__item:has-text("Technology")')
    
    // Set tags
    await page.click('[data-testid="article-tags"]')
    await page.type('[data-testid="article-tags"] input', 'test')
    await page.press('[data-testid="article-tags"] input', 'Enter')
    await page.type('[data-testid="article-tags"] input', 'demo')
    await page.press('[data-testid="article-tags"] input', 'Enter')
    
    // Upload featured image
    await page.setInputFiles('[data-testid="featured-image"]', 'tests/fixtures/test-image.jpg')
    
    // Set publish date
    await page.click('[data-testid="publish-date"]')
    await page.click('.el-date-picker__header-label')
    await page.click('.el-year-table td:has-text("2024")')
    await page.click('.el-month-table td:has-text("Dec")')
    await page.click('.el-date-table td:has-text("25")')
    
    // Save as draft
    await page.click('[data-testid="save-draft"]')
    
    await expect(page.locator('.el-message--success')).toContainText('Article saved as draft')
    
    // Publish article
    await page.click('[data-testid="publish-article"]')
    
    await expect(page.locator('.el-message--success')).toContainText('Article published successfully')
    
    // Verify in articles list
    await page.goto('/admin/content')
    await expect(page.locator('tbody tr').first().locator('td').nth(0)).toContainText('Test Article')
    await expect(page.locator('tbody tr').first().locator('td').nth(3)).toContainText('Published')
  })
  
  test('views analytics dashboard', async ({ page }) => {
    // Navigate to analytics
    await page.click('[data-testid="sidebar-analytics"]')
    await page.waitForURL('/admin/analytics')
    
    // Wait for charts to load
    await page.waitForSelector('[data-testid="visitors-chart"]')
    await page.waitForSelector('[data-testid="revenue-chart"]')
    
    // Change date range
    await page.click('[data-testid="date-range"]')
    await page.click('.el-picker-panel__shortcut:has-text("Last 30 days")')
    
    // Wait for charts to update
    await page.waitForTimeout(2000)
    
    // Export report
    await page.click('[data-testid="export-report"]')
    await page.click('.el-dropdown-menu__item:has-text("Export as PDF")')
    
    // Wait for download
    const downloadPromise = page.waitForEvent('download')
    const download = await downloadPromise
    expect(download.suggestedFilename()).toContain('analytics-report')
  })
})
```

## Mobile Testing

### Responsive Design Testing

```javascript
// tests/e2e/mobile.spec.js
import { test, expect, devices } from '@playwright/test'

test.describe('Mobile Responsive Tests', () => {
  test('mobile navigation', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12']
    })
    const page = await context.newPage()
    
    await page.goto('/dashboard')
    
    // Mobile menu should be collapsed by default
    await expect(page.locator('[data-testid="sidebar"]')).not.toBeVisible()
    
    // Open mobile menu
    await page.click('[data-testid="mobile-menu-toggle"]')
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible()
    
    // Navigate to different section
    await page.click('[data-testid="sidebar-users"]')
    await page.waitForURL('/admin/users')
    
    // Menu should close after navigation
    await expect(page.locator('[data-testid="sidebar"]')).not.toBeVisible()
    
    await context.close()
  })
  
  test('mobile form interactions', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12']
    })
    const page = await context.newPage()
    
    await page.goto('/contact')
    
    // Test mobile-optimized form
    await page.fill('[data-testid="name"] input', 'John Doe')
    await page.fill('[data-testid="email"] input', 'john@example.com')
    
    // Test mobile select
    await page.click('[data-testid="inquiry-type"]')
    await expect(page.locator('.el-select-dropdown')).toBeVisible()
    await page.click('.el-select-dropdown__item:has-text("Support")')
    
    // Test mobile date picker
    await page.click('[data-testid="preferred-date"]')
    await expect(page.locator('.el-date-picker')).toBeVisible()
    await page.click('.el-date-table td:has-text("15")')
    
    // Submit form
    await page.click('[data-testid="submit-form"]')
    
    await expect(page.locator('.el-message--success')).toContainText('Message sent successfully')
    
    await context.close()
  })
  
  test('mobile table interactions', async ({ browser }) => {
    const context = await browser.newContext({
      ...devices['iPhone 12']
    })
    const page = await context.newPage()
    
    await page.goto('/admin/users')
    
    // Table should be horizontally scrollable on mobile
    const table = page.locator('.el-table')
    await expect(table).toHaveCSS('overflow-x', 'auto')
    
    // Test mobile-optimized actions
    await page.click('[data-testid="mobile-actions-toggle"]')
    await expect(page.locator('[data-testid="mobile-actions-menu"]')).toBeVisible()
    
    await page.click('[data-testid="mobile-action-edit"]')
    await expect(page.locator('.el-dialog')).toBeVisible()
    
    await context.close()
  })
})
```

## Performance Testing

### Load Time and Core Web Vitals

```javascript
// tests/e2e/performance.spec.js
import { test, expect } from '@playwright/test'

test.describe('Performance Tests', () => {
  test('measures Core Web Vitals', async ({ page }) => {
    // Navigate to page
    await page.goto('/dashboard')
    
    // Measure performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lcp = entries.find(entry => entry.entryType === 'largest-contentful-paint')
          
          if (lcp) {
            const navigation = performance.getEntriesByType('navigation')[0]
            const paint = performance.getEntriesByType('paint')
            
            resolve({
              // Core Web Vitals
              lcp: lcp.startTime,
              fcp: paint.find(entry => entry.name === 'first-contentful-paint')?.startTime,
              
              // Other metrics
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
              loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
              
              // Resource timing
              resourceCount: performance.getEntriesByType('resource').length,
              totalResourceSize: performance.getEntriesByType('resource')
                .reduce((total, resource) => total + (resource.transferSize || 0), 0)
            })
          }
        })
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] })
      })
    })
    
    // Assert performance thresholds
    expect(metrics.lcp).toBeLessThan(2500) // LCP should be under 2.5s
    expect(metrics.fcp).toBeLessThan(1800) // FCP should be under 1.8s
    expect(metrics.domContentLoaded).toBeLessThan(1000) // DOM ready should be under 1s
    expect(metrics.totalResourceSize).toBeLessThan(2 * 1024 * 1024) // Total resources under 2MB
    
    console.log('Performance Metrics:', metrics)
  })
  
  test('measures JavaScript bundle size', async ({ page }) => {
    const resourceSizes = []
    
    page.on('response', async (response) => {
      if (response.url().includes('.js') && response.status() === 200) {
        const headers = response.headers()
        const contentLength = headers['content-length']
        if (contentLength) {
          resourceSizes.push({
            url: response.url(),
            size: parseInt(contentLength)
          })
        }
      }
    })
    
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    
    const totalJSSize = resourceSizes.reduce((total, resource) => total + resource.size, 0)
    const mainBundle = resourceSizes.find(resource => resource.url.includes('main'))
    
    // Assert bundle size thresholds
    expect(totalJSSize).toBeLessThan(1024 * 1024) // Total JS under 1MB
    if (mainBundle) {
      expect(mainBundle.size).toBeLessThan(512 * 1024) // Main bundle under 512KB
    }
    
    console.log('JavaScript Bundle Sizes:', resourceSizes)
  })
  
  test('tests with slow network', async ({ browser }) => {
    const context = await browser.newContext()
    
    // Simulate slow 3G network
    await context.route('**/*', async route => {
      await new Promise(resolve => setTimeout(resolve, 100)) // Add 100ms delay
      route.continue()
    })
    
    const page = await context.newPage()
    
    const startTime = Date.now()
    await page.goto('/dashboard')
    await page.waitForLoadState('networkidle')
    const loadTime = Date.now() - startTime
    
    // Should still load within reasonable time even on slow network
    expect(loadTime).toBeLessThan(10000) // Under 10 seconds
    
    // Verify critical content is visible
    await expect(page.locator('h1')).toContainText('Dashboard')
    
    await context.close()
  })
})
```

## Accessibility Testing

### A11y Compliance Testing

```javascript
// tests/e2e/accessibility.spec.js
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility Tests', () => {
  test('dashboard accessibility', async ({ page }) => {
    await page.goto('/dashboard')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze()
    
    expect(accessibilityScanResults.violations).toEqual([])
  })
  
  test('keyboard navigation', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Test tab navigation
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toBeVisible()
    
    // Navigate through main menu
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    
    // Should navigate to focused item
    await page.waitForURL('/admin/users')
  })
  
  test('screen reader compatibility', async ({ page }) => {
    await page.goto('/contact')
    
    // Check for proper ARIA labels
    const nameInput = page.locator('[data-testid="name"] input')
    await expect(nameInput).toHaveAttribute('aria-label')
    
    const emailInput = page.locator('[data-testid="email"] input')
    await expect(emailInput).toHaveAttribute('aria-describedby')
    
    // Check form validation announcements
    await page.click('[data-testid="submit-form"]')
    
    const errorMessage = page.locator('.el-form-item__error')
    await expect(errorMessage).toHaveAttribute('role', 'alert')
  })
  
  test('color contrast', async ({ page }) => {
    await page.goto('/dashboard')
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('.el-button')
      .analyze()
    
    const colorContrastViolations = accessibilityScanResults.violations
      .filter(violation => violation.id === 'color-contrast')
    
    expect(colorContrastViolations).toEqual([])
  })
})
```

## Cross-browser Testing

### Browser Compatibility

```javascript
// tests/e2e/cross-browser.spec.js
import { test, expect, devices } from '@playwright/test'

const browsers = ['chromium', 'firefox', 'webkit']

browsers.forEach(browserName => {
  test.describe(`${browserName} compatibility`, () => {
    test(`login flow works in ${browserName}`, async ({ browser }) => {
      const context = await browser.newContext()
      const page = await context.newPage()
      
      await page.goto('/login')
      await page.fill('[data-testid="username"] input', 'admin@example.com')
      await page.fill('[data-testid="password"] input', 'password123')
      await page.click('[data-testid="login-button"]')
      
      await expect(page).toHaveURL('/dashboard')
      await expect(page.locator('h1')).toContainText('Dashboard')
      
      await context.close()
    })
    
    test(`form interactions work in ${browserName}`, async ({ browser }) => {
      const context = await browser.newContext()
      const page = await context.newPage()
      
      await page.goto('/contact')
      
      // Test various form elements
      await page.fill('[data-testid="name"] input', 'Test User')
      await page.fill('[data-testid="email"] input', 'test@example.com')
      
      await page.click('[data-testid="inquiry-type"]')
      await page.click('.el-select-dropdown__item:first-child')
      
      await page.click('[data-testid="date"]')
      await page.click('.el-date-table td:has-text("15")')
      
      await page.fill('[data-testid="message"] textarea', 'Test message')
      
      await page.click('[data-testid="submit-form"]')
      
      await expect(page.locator('.el-message--success')).toContainText('Message sent')
      
      await context.close()
    })
  })
})
```

## Test Data Management

### Database Seeding and Cleanup

```javascript
// tests/e2e/helpers/database.js
export class DatabaseHelper {
  static async seedTestData() {
    // Seed test users
    await fetch('http://localhost:3001/api/test/seed-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        users: [
          { email: 'admin@example.com', role: 'admin', password: 'password123' },
          { email: 'user@example.com', role: 'user', password: 'password123' },
          { email: 'customer@example.com', role: 'customer', password: 'password123' }
        ]
      })
    })
    
    // Seed test products
    await fetch('http://localhost:3001/api/test/seed-products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        products: [
          { name: 'Laptop', price: 999.99, category: 'Electronics' },
          { name: 'Phone', price: 599.99, category: 'Electronics' },
          { name: 'Book', price: 19.99, category: 'Books' }
        ]
      })
    })
  }
  
  static async cleanupTestData() {
    await fetch('http://localhost:3001/api/test/cleanup', {
      method: 'DELETE'
    })
  }
  
  static async createTestUser(userData) {
    const response = await fetch('http://localhost:3001/api/test/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    })
    return response.json()
  }
}
```

### Global Test Setup

```javascript
// tests/e2e/global-setup.js
import { DatabaseHelper } from './helpers/database.js'

export default async function globalSetup() {
  console.log('Setting up test environment...')
  
  // Wait for server to be ready
  await waitForServer('http://localhost:3001/health')
  
  // Seed test data
  await DatabaseHelper.seedTestData()
  
  console.log('Test environment ready')
}

async function waitForServer(url, timeout = 30000) {
  const start = Date.now()
  
  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(url)
      if (response.ok) {
        return
      }
    } catch (error) {
      // Server not ready yet
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  throw new Error(`Server not ready after ${timeout}ms`)
}
```

```javascript
// tests/e2e/global-teardown.js
import { DatabaseHelper } from './helpers/database.js'

export default async function globalTeardown() {
  console.log('Cleaning up test environment...')
  
  // Cleanup test data
  await DatabaseHelper.cleanupTestData()
  
  console.log('Test environment cleaned up')
}
```

## CI/CD Integration

### GitHub Actions Configuration

```yaml
# .github/workflows/e2e-tests.yml
name: E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:13
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build application
      run: npm run build
    
    - name: Install Playwright
      run: npx playwright install --with-deps
    
    - name: Start application
      run: |
        npm run start:test &
        npx wait-on http://localhost:3000
      env:
        NODE_ENV: test
        DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
    
    - name: Run E2E tests
      run: npx playwright test
      env:
        CI: true
    
    - name: Upload test results
      uses: actions/upload-artifact@v3
      if: failure()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

## Best Practices

### 1. Test Strategy
- Focus on critical user journeys
- Test happy paths and error scenarios
- Maintain test independence
- Use realistic test data

### 2. Reliability
- Use explicit waits instead of fixed delays
- Handle flaky tests with proper retry logic
- Clean up test data between runs
- Use stable selectors

### 3. Maintainability
- Implement Page Object Model
- Create reusable helper functions
- Keep tests simple and focused
- Document complex test scenarios

### 4. Performance
- Run tests in parallel when possible
- Use test data fixtures
- Optimize test execution time
- Monitor test suite performance

### 5. Reporting
- Generate comprehensive test reports
- Include screenshots and videos for failures
- Track test metrics over time
- Integrate with CI/CD pipelines

E2E testing ensures your Element Plus application works correctly from the user's perspective, providing confidence in your application's quality and reliability.