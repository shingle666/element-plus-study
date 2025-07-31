# Integration Testing with Element Plus

## Overview

Integration testing ensures that different parts of your application work together correctly. When using Element Plus, this involves testing component interactions, form workflows, navigation patterns, and API integrations. This guide covers comprehensive integration testing strategies.

## Testing Setup

### E2E Testing with Playwright

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
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
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
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
})
```

### Testing with Cypress

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
    responseTimeout: 10000
  },
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
})
```

```javascript
// cypress/support/commands.js

// Custom commands for Element Plus components
Cypress.Commands.add('getByTestId', (testId) => {
  return cy.get(`[data-testid="${testId}"]`)
})

Cypress.Commands.add('fillElInput', (testId, value) => {
  cy.getByTestId(testId).find('input').clear().type(value)
})

Cypress.Commands.add('selectElOption', (testId, value) => {
  cy.getByTestId(testId).click()
  cy.get('.el-select-dropdown').contains(value).click()
})

Cypress.Commands.add('clickElButton', (testId) => {
  cy.getByTestId(testId).click()
})

Cypress.Commands.add('checkElCheckbox', (testId) => {
  cy.getByTestId(testId).find('input[type="checkbox"]').check({ force: true })
})

Cypress.Commands.add('uncheckElCheckbox', (testId) => {
  cy.getByTestId(testId).find('input[type="checkbox"]').uncheck({ force: true })
})

Cypress.Commands.add('selectElDate', (testId, date) => {
  cy.getByTestId(testId).click()
  cy.get('.el-date-picker__header-label').first().click()
  cy.get('.el-year-table').contains(date.getFullYear().toString()).click()
  cy.get('.el-month-table').contains(date.toLocaleString('default', { month: 'short' })).click()
  cy.get('.el-date-table').contains(date.getDate().toString()).click()
})

Cypress.Commands.add('waitForElLoading', (timeout = 10000) => {
  cy.get('.el-loading-mask', { timeout }).should('not.exist')
})

Cypress.Commands.add('expectElMessage', (type, message) => {
  cy.get(`.el-message--${type}`).should('contain', message)
})

Cypress.Commands.add('expectElNotification', (type, title) => {
  cy.get(`.el-notification--${type}`).should('contain', title)
})
```

## Form Integration Testing

### Complex Form Workflow

```javascript
// tests/e2e/user-registration.spec.js (Playwright)
import { test, expect } from '@playwright/test'

test.describe('User Registration Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/register')
  })
  
  test('completes full registration process', async ({ page }) => {
    // Step 1: Personal Information
    await page.fill('[data-testid="first-name"] input', 'John')
    await page.fill('[data-testid="last-name"] input', 'Doe')
    await page.fill('[data-testid="email"] input', 'john.doe@example.com')
    await page.fill('[data-testid="phone"] input', '+1234567890')
    
    // Select date of birth
    await page.click('[data-testid="birth-date"]')
    await page.click('.el-year-table td:has-text("1990")')
    await page.click('.el-month-table td:has-text("Jan")')
    await page.click('.el-date-table td:has-text("15")')
    
    // Select gender
    await page.click('[data-testid="gender"]')
    await page.click('.el-select-dropdown__item:has-text("Male")')
    
    await page.click('[data-testid="next-step"]')
    
    // Step 2: Account Information
    await page.fill('[data-testid="username"] input', 'johndoe123')
    await page.fill('[data-testid="password"] input', 'SecurePassword123!')
    await page.fill('[data-testid="confirm-password"] input', 'SecurePassword123!')
    
    // Security questions
    await page.click('[data-testid="security-question-1"]')
    await page.click('.el-select-dropdown__item:has-text("What is your mother\'s maiden name?")')
    await page.fill('[data-testid="security-answer-1"] input', 'Smith')
    
    await page.click('[data-testid="security-question-2"]')
    await page.click('.el-select-dropdown__item:has-text("What was your first pet\'s name?")')
    await page.fill('[data-testid="security-answer-2"] input', 'Buddy')
    
    await page.click('[data-testid="next-step"]')
    
    // Step 3: Preferences
    await page.check('[data-testid="newsletter"] input')
    await page.check('[data-testid="notifications"] input')
    
    // Select interests
    await page.check('[data-testid="interest-technology"] input')
    await page.check('[data-testid="interest-sports"] input')
    
    // Select language
    await page.click('[data-testid="language"]')
    await page.click('.el-select-dropdown__item:has-text("English")')
    
    // Select timezone
    await page.click('[data-testid="timezone"]')
    await page.click('.el-select-dropdown__item:has-text("UTC-5")')
    
    await page.click('[data-testid="next-step"]')
    
    // Step 4: Review and Submit
    await expect(page.locator('[data-testid="review-name"]')).toContainText('John Doe')
    await expect(page.locator('[data-testid="review-email"]')).toContainText('john.doe@example.com')
    await expect(page.locator('[data-testid="review-username"]')).toContainText('johndoe123')
    
    // Accept terms
    await page.check('[data-testid="accept-terms"] input')
    
    // Submit form
    await page.click('[data-testid="submit-registration"]')
    
    // Wait for success message
    await expect(page.locator('.el-message--success')).toContainText('Registration successful')
    
    // Should redirect to login page
    await expect(page).toHaveURL('/login')
  })
  
  test('validates form fields correctly', async ({ page }) => {
    // Try to proceed without filling required fields
    await page.click('[data-testid="next-step"]')
    
    // Should show validation errors
    await expect(page.locator('.el-form-item__error')).toContainText('Please input first name')
    
    // Fill invalid email
    await page.fill('[data-testid="email"] input', 'invalid-email')
    await page.blur('[data-testid="email"] input')
    
    await expect(page.locator('.el-form-item__error')).toContainText('Please input valid email')
    
    // Test password confirmation
    await page.fill('[data-testid="first-name"] input', 'John')
    await page.fill('[data-testid="last-name"] input', 'Doe')
    await page.fill('[data-testid="email"] input', 'john@example.com')
    await page.click('[data-testid="next-step"]')
    
    await page.fill('[data-testid="password"] input', 'password123')
    await page.fill('[data-testid="confirm-password"] input', 'different')
    await page.blur('[data-testid="confirm-password"] input')
    
    await expect(page.locator('.el-form-item__error')).toContainText('Passwords do not match')
  })
  
  test('handles server errors gracefully', async ({ page }) => {
    // Mock server error
    await page.route('**/api/register', route => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Email already exists' })
      })
    })
    
    // Fill form with valid data
    await page.fill('[data-testid="first-name"] input', 'John')
    await page.fill('[data-testid="last-name"] input', 'Doe')
    await page.fill('[data-testid="email"] input', 'existing@example.com')
    await page.click('[data-testid="next-step"]')
    
    await page.fill('[data-testid="username"] input', 'johndoe')
    await page.fill('[data-testid="password"] input', 'password123')
    await page.fill('[data-testid="confirm-password"] input', 'password123')
    await page.click('[data-testid="next-step"]')
    
    await page.click('[data-testid="next-step"]')
    
    await page.check('[data-testid="accept-terms"] input')
    await page.click('[data-testid="submit-registration"]')
    
    // Should show error message
    await expect(page.locator('.el-message--error')).toContainText('Email already exists')
  })
})
```

### Cypress Form Testing

```javascript
// cypress/e2e/contact-form.cy.js
describe('Contact Form Integration', () => {
  beforeEach(() => {
    cy.visit('/contact')
  })
  
  it('submits contact form successfully', () => {
    // Fill personal information
    cy.fillElInput('name', 'John Doe')
    cy.fillElInput('email', 'john@example.com')
    cy.fillElInput('phone', '+1234567890')
    
    // Select inquiry type
    cy.selectElOption('inquiry-type', 'General Question')
    
    // Select priority
    cy.getByTestId('priority').within(() => {
      cy.get('input[value="medium"]').check({ force: true })
    })
    
    // Fill message
    cy.getByTestId('message').find('textarea').type('This is a test message for the contact form.')
    
    // Upload file
    cy.getByTestId('file-upload').selectFile('cypress/fixtures/test-document.pdf')
    
    // Accept privacy policy
    cy.checkElCheckbox('privacy-policy')
    
    // Submit form
    cy.clickElButton('submit-form')
    
    // Wait for loading to complete
    cy.waitForElLoading()
    
    // Verify success message
    cy.expectElMessage('success', 'Your message has been sent successfully')
    
    // Verify form is reset
    cy.getByTestId('name').find('input').should('have.value', '')
    cy.getByTestId('email').find('input').should('have.value', '')
  })
  
  it('validates required fields', () => {
    cy.clickElButton('submit-form')
    
    // Check validation errors
    cy.get('.el-form-item__error').should('contain', 'Please input your name')
    cy.get('.el-form-item__error').should('contain', 'Please input your email')
    cy.get('.el-form-item__error').should('contain', 'Please select inquiry type')
  })
  
  it('handles file upload validation', () => {
    // Try to upload invalid file type
    cy.getByTestId('file-upload').selectFile('cypress/fixtures/invalid-file.txt')
    
    cy.expectElMessage('error', 'Only PDF, DOC, and DOCX files are allowed')
    
    // Try to upload file that's too large
    cy.getByTestId('file-upload').selectFile('cypress/fixtures/large-file.pdf')
    
    cy.expectElMessage('error', 'File size cannot exceed 5MB')
  })
})
```

## Data Table Integration Testing

### Complex Table Operations

```javascript
// tests/e2e/user-management.spec.js (Playwright)
import { test, expect } from '@playwright/test'

test.describe('User Management Table', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/users**', route => {
      const url = new URL(route.request().url())
      const page = parseInt(url.searchParams.get('page') || '1')
      const size = parseInt(url.searchParams.get('size') || '20')
      const search = url.searchParams.get('search') || ''
      
      const allUsers = Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        status: ['active', 'inactive', 'pending'][i % 3],
        role: ['admin', 'user', 'moderator'][i % 3],
        createdAt: new Date(2023, 0, i + 1).toISOString()
      }))
      
      let filteredUsers = allUsers
      if (search) {
        filteredUsers = allUsers.filter(user => 
          user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
        )
      }
      
      const start = (page - 1) * size
      const end = start + size
      const paginatedUsers = filteredUsers.slice(start, end)
      
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: paginatedUsers,
          total: filteredUsers.length,
          page,
          size
        })
      })
    })
    
    await page.goto('/admin/users')
    await page.waitForLoadState('networkidle')
  })
  
  test('loads and displays user data', async ({ page }) => {
    // Check table headers
    await expect(page.locator('th')).toContainText(['Name', 'Email', 'Status', 'Role', 'Created', 'Actions'])
    
    // Check first row data
    const firstRow = page.locator('tbody tr').first()
    await expect(firstRow.locator('td').nth(0)).toContainText('User 1')
    await expect(firstRow.locator('td').nth(1)).toContainText('user1@example.com')
    
    // Check pagination
    await expect(page.locator('.el-pagination__total')).toContainText('Total 100')
  })
  
  test('searches users correctly', async ({ page }) => {
    // Search for specific user
    await page.fill('[data-testid="search-input"] input', 'User 5')
    await page.press('[data-testid="search-input"] input', 'Enter')
    
    // Wait for search results
    await page.waitForResponse('**/api/users**')
    
    // Should show filtered results
    await expect(page.locator('tbody tr')).toHaveCount(11) // User 5, 15, 25, 35, 45, 50-59
    await expect(page.locator('tbody tr').first().locator('td').nth(0)).toContainText('User 5')
  })
  
  test('sorts table columns', async ({ page }) => {
    // Sort by name column
    await page.click('th:has-text("Name") .caret-wrapper')
    
    // Wait for sort request
    await page.waitForResponse('**/api/users**')
    
    // Check if data is sorted (assuming API handles sorting)
    const firstRowName = await page.locator('tbody tr').first().locator('td').nth(0).textContent()
    expect(firstRowName).toBe('User 1')
  })
  
  test('filters by status', async ({ page }) => {
    // Open status filter
    await page.click('th:has-text("Status") .el-table__column-filter-trigger')
    
    // Select active status
    await page.click('.el-table-filter__list .el-checkbox:has-text("Active")')
    await page.click('.el-table-filter__bottom .el-button--primary')
    
    // Wait for filter request
    await page.waitForResponse('**/api/users**')
    
    // Check that only active users are shown
    const statusCells = page.locator('tbody tr td:nth-child(3)')
    const count = await statusCells.count()
    
    for (let i = 0; i < count; i++) {
      await expect(statusCells.nth(i)).toContainText('active')
    }
  })
  
  test('changes page size', async ({ page }) => {
    // Change page size
    await page.click('.el-pagination__sizes .el-select')
    await page.click('.el-select-dropdown__item:has-text("50 / page")')
    
    // Wait for new data
    await page.waitForResponse('**/api/users**')
    
    // Should show 50 rows
    await expect(page.locator('tbody tr')).toHaveCount(50)
  })
  
  test('navigates between pages', async ({ page }) => {
    // Go to next page
    await page.click('.el-pagination .btn-next')
    
    // Wait for new data
    await page.waitForResponse('**/api/users**')
    
    // Check that different data is loaded
    const firstRowName = await page.locator('tbody tr').first().locator('td').nth(0).textContent()
    expect(firstRowName).toBe('User 21')
    
    // Check pagination state
    await expect(page.locator('.el-pagination__current')).toHaveValue('2')
  })
  
  test('performs bulk operations', async ({ page }) => {
    // Select multiple rows
    await page.click('thead .el-checkbox input')
    
    // Check that all visible rows are selected
    const checkboxes = page.locator('tbody .el-checkbox input')
    const count = await checkboxes.count()
    
    for (let i = 0; i < count; i++) {
      await expect(checkboxes.nth(i)).toBeChecked()
    }
    
    // Perform bulk action
    await page.click('[data-testid="bulk-actions"]')
    await page.click('.el-dropdown-menu__item:has-text("Deactivate Selected")')
    
    // Confirm action
    await page.click('.el-message-box__btns .el-button--primary')
    
    // Should show success message
    await expect(page.locator('.el-message--success')).toContainText('Users deactivated successfully')
  })
})
```

## Navigation and Routing Integration

### Multi-step Wizard Navigation

```javascript
// tests/e2e/project-setup-wizard.spec.js (Playwright)
import { test, expect } from '@playwright/test'

test.describe('Project Setup Wizard', () => {
  test('completes project setup workflow', async ({ page }) => {
    await page.goto('/projects/new')
    
    // Step 1: Basic Information
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('1 of 4')
    await expect(page.locator('.el-steps__step.is-process')).toContainText('Basic Info')
    
    await page.fill('[data-testid="project-name"] input', 'Test Project')
    await page.fill('[data-testid="project-description"] textarea', 'This is a test project description')
    
    await page.click('[data-testid="project-type"]')
    await page.click('.el-select-dropdown__item:has-text("Web Application")')
    
    await page.click('[data-testid="next-step"]')
    
    // Step 2: Team Setup
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('2 of 4')
    await expect(page.locator('.el-steps__step.is-process')).toContainText('Team Setup')
    
    // Add team members
    await page.click('[data-testid="add-member"]')
    await page.fill('[data-testid="member-email-0"] input', 'john@example.com')
    await page.click('[data-testid="member-role-0"]')
    await page.click('.el-select-dropdown__item:has-text("Developer")')
    
    await page.click('[data-testid="add-member"]')
    await page.fill('[data-testid="member-email-1"] input', 'jane@example.com')
    await page.click('[data-testid="member-role-1"]')
    await page.click('.el-select-dropdown__item:has-text("Designer")')
    
    await page.click('[data-testid="next-step"]')
    
    // Step 3: Configuration
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('3 of 4')
    await expect(page.locator('.el-steps__step.is-process')).toContainText('Configuration')
    
    // Select technologies
    await page.check('[data-testid="tech-vue"] input')
    await page.check('[data-testid="tech-typescript"] input')
    await page.check('[data-testid="tech-tailwind"] input')
    
    // Configure deployment
    await page.click('[data-testid="deployment-env"]')
    await page.click('.el-select-dropdown__item:has-text("Production")')
    
    await page.fill('[data-testid="domain"] input', 'testproject.com')
    
    await page.click('[data-testid="next-step"]')
    
    // Step 4: Review
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('4 of 4')
    await expect(page.locator('.el-steps__step.is-process')).toContainText('Review')
    
    // Verify review information
    await expect(page.locator('[data-testid="review-project-name"]')).toContainText('Test Project')
    await expect(page.locator('[data-testid="review-project-type"]')).toContainText('Web Application')
    await expect(page.locator('[data-testid="review-team-count"]')).toContainText('2 members')
    await expect(page.locator('[data-testid="review-technologies"]')).toContainText('Vue, TypeScript, Tailwind')
    
    // Create project
    await page.click('[data-testid="create-project"]')
    
    // Wait for creation
    await page.waitForLoadState('networkidle')
    
    // Should redirect to project dashboard
    await expect(page).toHaveURL(/\/projects\/\d+\/dashboard/)
    await expect(page.locator('h1')).toContainText('Test Project')
  })
  
  test('allows navigation between steps', async ({ page }) => {
    await page.goto('/projects/new')
    
    // Fill step 1
    await page.fill('[data-testid="project-name"] input', 'Test Project')
    await page.click('[data-testid="next-step"]')
    
    // Go back to step 1
    await page.click('[data-testid="prev-step"]')
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('1 of 4')
    
    // Data should be preserved
    await expect(page.locator('[data-testid="project-name"] input')).toHaveValue('Test Project')
    
    // Navigate using step indicator
    await page.click('.el-steps__step:nth-child(3)')
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('3 of 4')
  })
  
  test('validates step completion', async ({ page }) => {
    await page.goto('/projects/new')
    
    // Try to proceed without required fields
    await page.click('[data-testid="next-step"]')
    
    // Should show validation errors
    await expect(page.locator('.el-form-item__error')).toContainText('Please input project name')
    
    // Should not advance to next step
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('1 of 4')
  })
})
```

## API Integration Testing

### CRUD Operations Testing

```javascript
// tests/e2e/api-integration.spec.js (Playwright)
import { test, expect } from '@playwright/test'

test.describe('API Integration', () => {
  let apiContext
  
  test.beforeAll(async ({ playwright }) => {
    apiContext = await playwright.request.newContext({
      baseURL: 'http://localhost:3001/api'
    })
  })
  
  test.afterAll(async () => {
    await apiContext.dispose()
  })
  
  test('creates, reads, updates, and deletes user', async ({ page }) => {
    await page.goto('/admin/users')
    
    // CREATE: Add new user
    await page.click('[data-testid="add-user"]')
    
    await page.fill('[data-testid="user-name"] input', 'Test User')
    await page.fill('[data-testid="user-email"] input', 'testuser@example.com')
    await page.click('[data-testid="user-role"]')
    await page.click('.el-select-dropdown__item:has-text("User")')
    
    // Intercept create request
    const createResponse = page.waitForResponse('**/api/users', { method: 'POST' })
    await page.click('[data-testid="save-user"]')
    
    const createResult = await createResponse
    expect(createResult.status()).toBe(201)
    
    // Should show success message
    await expect(page.locator('.el-message--success')).toContainText('User created successfully')
    
    // Should close dialog and refresh table
    await expect(page.locator('.el-dialog')).not.toBeVisible()
    
    // READ: Verify user appears in table
    await page.fill('[data-testid="search-input"] input', 'testuser@example.com')
    await page.press('[data-testid="search-input"] input', 'Enter')
    
    await expect(page.locator('tbody tr')).toHaveCount(1)
    await expect(page.locator('tbody tr td').nth(0)).toContainText('Test User')
    await expect(page.locator('tbody tr td').nth(1)).toContainText('testuser@example.com')
    
    // UPDATE: Edit user
    await page.click('[data-testid="edit-user"]')
    
    await page.fill('[data-testid="user-name"] input', 'Updated Test User')
    await page.click('[data-testid="user-role"]')
    await page.click('.el-select-dropdown__item:has-text("Admin")')
    
    const updateResponse = page.waitForResponse('**/api/users/*', { method: 'PUT' })
    await page.click('[data-testid="save-user"]')
    
    const updateResult = await updateResponse
    expect(updateResult.status()).toBe(200)
    
    // Verify update
    await expect(page.locator('tbody tr td').nth(0)).toContainText('Updated Test User')
    await expect(page.locator('tbody tr td').nth(3)).toContainText('Admin')
    
    // DELETE: Remove user
    await page.click('[data-testid="delete-user"]')
    
    // Confirm deletion
    await page.click('.el-message-box__btns .el-button--primary')
    
    const deleteResponse = page.waitForResponse('**/api/users/*', { method: 'DELETE' })
    const deleteResult = await deleteResponse
    expect(deleteResult.status()).toBe(200)
    
    // Verify user is removed
    await expect(page.locator('tbody tr')).toHaveCount(0)
    await expect(page.locator('.el-empty')).toContainText('No data')
  })
  
  test('handles API errors gracefully', async ({ page }) => {
    // Mock server error
    await page.route('**/api/users', route => {
      if (route.request().method() === 'POST') {
        route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({ error: 'Internal server error' })
        })
      } else {
        route.continue()
      }
    })
    
    await page.goto('/admin/users')
    
    // Try to create user
    await page.click('[data-testid="add-user"]')
    await page.fill('[data-testid="user-name"] input', 'Test User')
    await page.fill('[data-testid="user-email"] input', 'test@example.com')
    await page.click('[data-testid="save-user"]')
    
    // Should show error message
    await expect(page.locator('.el-message--error')).toContainText('Failed to create user')
    
    // Dialog should remain open
    await expect(page.locator('.el-dialog')).toBeVisible()
  })
  
  test('handles network timeouts', async ({ page }) => {
    // Mock slow response
    await page.route('**/api/users', route => {
      setTimeout(() => {
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: [], total: 0 })
        })
      }, 10000) // 10 second delay
    })
    
    await page.goto('/admin/users')
    
    // Should show loading state
    await expect(page.locator('.el-loading-mask')).toBeVisible()
    
    // Should timeout and show error
    await expect(page.locator('.el-message--error')).toContainText('Request timeout', { timeout: 15000 })
  })
})
```

## Real-time Features Testing

### WebSocket Integration

```javascript
// tests/e2e/real-time-chat.spec.js (Playwright)
import { test, expect } from '@playwright/test'

test.describe('Real-time Chat', () => {
  test('sends and receives messages in real-time', async ({ browser }) => {
    // Create two browser contexts for two users
    const context1 = await browser.newContext()
    const context2 = await browser.newContext()
    
    const page1 = await context1.newPage()
    const page2 = await context2.newPage()
    
    // User 1 joins chat
    await page1.goto('/chat/room/123')
    await page1.fill('[data-testid="username"] input', 'User1')
    await page1.click('[data-testid="join-chat"]')
    
    // User 2 joins chat
    await page2.goto('/chat/room/123')
    await page2.fill('[data-testid="username"] input', 'User2')
    await page2.click('[data-testid="join-chat"]')
    
    // Wait for both users to be connected
    await expect(page1.locator('[data-testid="user-list"]')).toContainText('User1')
    await expect(page1.locator('[data-testid="user-list"]')).toContainText('User2')
    await expect(page2.locator('[data-testid="user-list"]')).toContainText('User1')
    await expect(page2.locator('[data-testid="user-list"]')).toContainText('User2')
    
    // User 1 sends a message
    await page1.fill('[data-testid="message-input"] input', 'Hello from User1!')
    await page1.click('[data-testid="send-message"]')
    
    // Both users should see the message
    await expect(page1.locator('[data-testid="message-list"]')).toContainText('User1: Hello from User1!')
    await expect(page2.locator('[data-testid="message-list"]')).toContainText('User1: Hello from User1!')
    
    // User 2 responds
    await page2.fill('[data-testid="message-input"] input', 'Hi there, User1!')
    await page2.click('[data-testid="send-message"]')
    
    // Both users should see the response
    await expect(page1.locator('[data-testid="message-list"]')).toContainText('User2: Hi there, User1!')
    await expect(page2.locator('[data-testid="message-list"]')).toContainText('User2: Hi there, User1!')
    
    // Test typing indicators
    await page1.fill('[data-testid="message-input"] input', 'I am typing...')
    
    // User 2 should see typing indicator
    await expect(page2.locator('[data-testid="typing-indicator"]')).toContainText('User1 is typing...')
    
    // Clear input - typing indicator should disappear
    await page1.fill('[data-testid="message-input"] input', '')
    await expect(page2.locator('[data-testid="typing-indicator"]')).not.toBeVisible()
    
    // Test user leaving
    await page1.close()
    
    // User 2 should see that User 1 left
    await expect(page2.locator('[data-testid="user-list"]')).not.toContainText('User1')
    await expect(page2.locator('[data-testid="message-list"]')).toContainText('User1 left the chat')
    
    await context1.close()
    await context2.close()
  })
})
```

## Performance Integration Testing

### Load Testing with Multiple Users

```javascript
// tests/e2e/performance.spec.js (Playwright)
import { test, expect } from '@playwright/test'

test.describe('Performance Tests', () => {
  test('handles multiple concurrent users', async ({ browser }) => {
    const contexts = []
    const pages = []
    
    // Create 10 concurrent users
    for (let i = 0; i < 10; i++) {
      const context = await browser.newContext()
      const page = await context.newPage()
      contexts.push(context)
      pages.push(page)
    }
    
    // All users navigate to the same page simultaneously
    const navigationPromises = pages.map((page, index) => 
      page.goto(`/dashboard?user=${index + 1}`)
    )
    
    await Promise.all(navigationPromises)
    
    // All users should load successfully
    for (const page of pages) {
      await expect(page.locator('h1')).toContainText('Dashboard')
    }
    
    // All users perform actions simultaneously
    const actionPromises = pages.map(async (page, index) => {
      await page.click('[data-testid="load-data"]')
      await page.waitForLoadState('networkidle')
      return page.locator('[data-testid="data-count"]').textContent()
    })
    
    const results = await Promise.all(actionPromises)
    
    // All requests should succeed
    results.forEach(result => {
      expect(parseInt(result)).toBeGreaterThan(0)
    })
    
    // Clean up
    for (const context of contexts) {
      await context.close()
    }
  })
  
  test('measures page load performance', async ({ page }) => {
    // Start performance measurement
    await page.goto('/dashboard')
    
    // Measure Core Web Vitals
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries()
          const lcp = entries.find(entry => entry.entryType === 'largest-contentful-paint')
          if (lcp) {
            resolve({
              lcp: lcp.startTime,
              fcp: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime,
              domContentLoaded: performance.getEntriesByType('navigation')[0]?.domContentLoadedEventEnd
            })
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] })
      })
    })
    
    // Assert performance thresholds
    expect(metrics.lcp).toBeLessThan(2500) // LCP should be under 2.5s
    expect(metrics.fcp).toBeLessThan(1800) // FCP should be under 1.8s
    expect(metrics.domContentLoaded).toBeLessThan(1500) // DOM ready should be under 1.5s
  })
})
```

## Best Practices

### 1. Test Organization
- Group related tests in describe blocks
- Use descriptive test names
- Set up proper test data and cleanup
- Use page objects for complex interactions

### 2. API Testing
- Mock external dependencies
- Test both success and error scenarios
- Verify request/response data
- Test timeout and retry logic

### 3. UI Integration
- Test complete user workflows
- Verify state changes across components
- Test responsive behavior
- Validate accessibility features

### 4. Performance
- Set performance budgets
- Test with realistic data volumes
- Monitor memory usage
- Test concurrent user scenarios

### 5. Reliability
- Use proper wait strategies
- Handle flaky tests with retries
- Clean up test data
- Use stable selectors

Integration testing ensures that your Element Plus application works correctly as a complete system, providing confidence in the user experience and system reliability.