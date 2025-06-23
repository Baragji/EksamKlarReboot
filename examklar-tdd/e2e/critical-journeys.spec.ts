import { test, expect } from '@playwright/test'

/**
 * 🔴 RED PHASE: E2E Tests for Critical User Journeys
 * Phase 4 - Quality Assurance & Deployment
 * 
 * These tests will initially FAIL - this is expected in TDD RED phase
 */

test.describe('ExamKlar E2E - Critical User Journeys', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the app before each test
    await page.goto('/')
  })

  test('should complete full onboarding flow from start to dashboard', async ({ page }) => {
    // 🔴 RED: This will fail initially - we need to implement the flow
    
    // Should start at onboarding page - use specific selector to avoid header h1
    await expect(page.getByRole('heading', { name: 'Welcome to ExamKlar' })).toBeVisible()
    
    // Step 1: Welcome screen
    await page.click('button:has-text("Get Started")')
    
    // Step 2: Add first subject
    await expect(page.getByRole('heading', { name: 'Add Your First Subject' })).toBeVisible()
    await page.fill('input[name="subject-name"]', 'Mathematics')
    await page.fill('input[name="exam-date"]', '2025-08-01')
    await page.fill('input[name="estimated-hours"]', '40')
    await page.click('button:has-text("Next")')
    
    // Step 3: Completion
    await expect(page.getByRole('heading', { name: "You're All Set!" })).toBeVisible()
    await page.click('button:has-text("Go to Dashboard")')
    
    // Should complete onboarding and redirect to dashboard
    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('heading', { name: 'Dashboard', exact: true })).toBeVisible()
    
    // Should show the added subject
    await expect(page.locator('[data-testid="subject-card"]')).toContainText('Mathematics')
  })

  test('should create and study flashcards end-to-end', async ({ page }) => {
    // 🔴 RED: This will fail - flashcard flow needs implementation
    
    // Skip onboarding (assume user is already set up)
    await page.goto('/flashcards')
    
    // Create new deck
    await page.click('button:has-text("Create New Deck")')
    await page.fill('input[name="deck-name"]', 'Calculus Formulas')
    await page.fill('textarea[name="deck-description"]', 'Essential calculus formulas for exam')
    await page.click('button:has-text("Create Deck")')
    
    // Add flashcards to deck
    await page.click('button:has-text("Add Card")')
    await page.fill('textarea[name="card-front"]', 'What is the derivative of x²?')
    await page.fill('textarea[name="card-back"]', '2x')
    await page.click('button:has-text("Save Card")')
    
    // Start study session
    await page.click('button:has-text("Study Deck")')
    
    // Study flow
    await expect(page.locator('[data-testid="flashcard-front"]')).toContainText('What is the derivative of x²?')
    await page.click('button:has-text("Show Answer")')
    await expect(page.locator('[data-testid="flashcard-back"]')).toContainText('2x')
    await page.click('button:has-text("Easy")')
    
    // Should show progress
    await expect(page.locator('[data-testid="study-progress"]')).toContainText('1 / 1')
  })

  test('should complete quiz flow with results tracking', async ({ page }) => {
    // 🔴 RED: This will fail - quiz flow needs implementation
    
    await page.goto('/quiz')
    
    // Select subject for quiz
    await page.click('[data-testid="subject-selector"]')
    await page.click('option:has-text("Mathematics")')
    
    // Configure quiz
    await page.selectOption('select[name="question-count"]', '5')
    await page.selectOption('select[name="difficulty"]', 'medium')
    await page.click('button:has-text("Start Quiz")')
    
    // Answer quiz questions
    for (let i = 0; i < 5; i++) {
      await expect(page.locator('[data-testid="quiz-question"]')).toBeVisible()
      await page.click('[data-testid="quiz-option"]:first-child')
      await page.click('button:has-text("Next")')
    }
    
    // Check results
    await expect(page.locator('[data-testid="quiz-results"]')).toBeVisible()
    await expect(page.locator('[data-testid="quiz-score"]')).toBeVisible()
    
    // Should be able to review answers
    await page.click('button:has-text("Review Answers")')
    await expect(page.locator('[data-testid="answer-review"]')).toBeVisible()
  })

  test('should track study progress and display analytics', async ({ page }) => {
    // 🔴 RED: This will fail - analytics flow needs implementation
    
    await page.goto('/dashboard')
    
    // Should show study statistics
    await expect(page.locator('[data-testid="total-study-time"]')).toBeVisible()
    await expect(page.locator('[data-testid="weekly-progress"]')).toBeVisible()
    await expect(page.locator('[data-testid="upcoming-exams"]')).toBeVisible()
    
    // Should display progress charts
    await expect(page.locator('[data-testid="progress-charts"]')).toBeVisible()
    await expect(page.locator('canvas')).toBeVisible() // Chart.js canvas elements
    
    // Should show study calendar
    await expect(page.locator('[data-testid="study-calendar"]')).toBeVisible()
    
    // Navigate to study page and start session
    await page.goto('/study')
    await page.click('button:has-text("Start Study Session")')
    
    // Should show study timer
    await expect(page.locator('[data-testid="study-timer"]')).toBeVisible()
    await page.click('[data-testid="timer-play"]')
    
    // Timer should be running
    await expect(page.locator('[data-testid="timer-display"]')).toContainText('00:')
    
    // Complete session
    await page.click('[data-testid="timer-stop"]')
    await page.click('button:has-text("End Session")')
    
    // Should update progress
    await page.goto('/dashboard')
    await expect(page.locator('[data-testid="recent-session"]')).toBeVisible()
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    // 🔴 RED: This will fail - responsive design needs verification
    
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    await page.goto('/')
    
    // Navigation should be mobile-friendly
    await expect(page.locator('[data-testid="mobile-menu-toggle"]')).toBeVisible()
    await page.click('[data-testid="mobile-menu-toggle"]')
    await expect(page.locator('[data-testid="mobile-navigation"]')).toBeVisible()
    
    // Cards should stack vertically on mobile
    await page.goto('/dashboard')
    const subjectCards = page.locator('[data-testid="subject-card"]')
    
    if (await subjectCards.count() > 1) {
      const firstCard = subjectCards.first()
      const secondCard = subjectCards.nth(1)
      
      const firstCardBox = await firstCard.boundingBox()
      const secondCardBox = await secondCard.boundingBox()
      
      // Cards should be stacked vertically (second card below first)
      if (firstCardBox && secondCardBox) {
        expect(secondCardBox.y).toBeGreaterThan(firstCardBox.y + firstCardBox.height - 10)
      }
    }
    
    // Forms should be mobile-friendly
    await page.goto('/flashcards')
    await page.click('button:has-text("Create New Deck")')
    
    // Form inputs should be full width on mobile
    const nameInput = page.locator('input[name="deck-name"]')
    const inputBox = await nameInput.boundingBox()
    expect(inputBox?.width).toBeGreaterThan(300) // Should take most of mobile width
  })

  test('should be accessible with keyboard navigation', async ({ page }) => {
    // 🔴 RED: This will fail - accessibility needs implementation
    
    await page.goto('/')
    
    // Should be able to navigate with Tab key
    await page.keyboard.press('Tab')
    await expect(page.locator(':focus')).toBeVisible()
    
    // Skip link should be available
    await page.keyboard.press('Tab')
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toHaveAttribute('href', '#main-content')
    
    // All interactive elements should be keyboard accessible
    await page.goto('/dashboard')
    
    let tabCount = 0
    const maxTabs = 20 // Prevent infinite loop
    
    while (tabCount < maxTabs) {
      await page.keyboard.press('Tab')
      const focused = page.locator(':focus')
      
      if (await focused.count() > 0) {
        // Check if focused element is actually interactive
        const tagName = await focused.evaluate(el => el.tagName.toLowerCase())
        const role = await focused.getAttribute('role')
        const tabIndex = await focused.getAttribute('tabindex')
        
        const isInteractive = ['button', 'a', 'input', 'select', 'textarea'].includes(tagName) ||
                             ['button', 'link', 'textbox'].includes(role || '') ||
                             tabIndex === '0'
        
        if (isInteractive) {
          await expect(focused).toBeVisible()
        }
      }
      
      tabCount++
    }
    
    // Should be able to activate buttons with Enter/Space
    const firstButton = page.locator('button').first()
    await firstButton.focus()
    await page.keyboard.press('Enter')
    // Should trigger button action (specific assertion depends on button function)
  })
})
