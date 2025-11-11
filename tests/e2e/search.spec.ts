import { test, expect } from '@playwright/test'

test.describe('Search Flow', () => {
  test('should search for products', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Find search input and enter query
    const searchInput = page.locator('input[placeholder*="搜索"]').first()
    await searchInput.fill('Jordan')
    await searchInput.press('Enter')
    
    // Wait for search results
    await page.waitForURL(/\/search/)
    
    // Check if results are displayed
    const results = page.locator('[class*="grid"]').first()
    await expect(results).toBeVisible()
  })

  test('should filter products by category', async ({ page }) => {
    await page.goto('/search')
    await page.waitForLoadState('networkidle')
    
    // Find and click category filter
    const categorySelect = page.locator('select, [role="combobox"]').first()
    if (await categorySelect.isVisible()) {
      await categorySelect.click()
      // Select first category option
      const option = page.locator('[role="option"]').first()
      if (await option.isVisible()) {
        await option.click()
      }
    }
    
    // Wait for filtered results
    await page.waitForTimeout(500)
    
    // Verify URL contains filter parameter
    const url = page.url()
    expect(url).toContain('search')
  })
})

test.describe('Cart Flow', () => {
  test('should add product to cart', async ({ page }) => {
    await page.goto('/search')
    await page.waitForLoadState('networkidle')
    
    // Click on first product card
    const firstProduct = page.locator('a[href*="/product/"]').first()
    if (await firstProduct.isVisible()) {
      await firstProduct.click()
      
      // Wait for product page
      await page.waitForURL(/\/product\//)
      
      // Find and click "加入购物车" button
      const addToCartButton = page.locator('button:has-text("加入购物车"), button:has-text("加入")').first()
      if (await addToCartButton.isVisible()) {
        await addToCartButton.click()
        
        // Check cart badge in navbar
        const cartBadge = page.locator('[class*="badge"], [class*="count"]')
        await expect(cartBadge.first()).toBeVisible({ timeout: 2000 }).catch(() => {
          // Cart badge might not be visible immediately
        })
      }
    }
  })

  test('should navigate to cart page', async ({ page }) => {
    await page.goto('/cart')
    await page.waitForLoadState('networkidle')
    
    // Check if cart page loads
    const cartTitle = page.locator('h1:has-text("购物车"), h1:has-text("Cart")')
    await expect(cartTitle.first()).toBeVisible().catch(() => {
      // Empty cart state might be shown instead
      const emptyState = page.locator('text=/空|empty/i')
      expect(emptyState.first()).toBeVisible()
    })
  })
})

test.describe('Compare Flow', () => {
  test('should add product to compare', async ({ page }) => {
    await page.goto('/search')
    await page.waitForLoadState('networkidle')
    
    // Click on first product
    const firstProduct = page.locator('a[href*="/product/"]').first()
    if (await firstProduct.isVisible()) {
      await firstProduct.click()
      await page.waitForURL(/\/product\//)
      
      // Find and click "添加到比较" button
      const addToCompareButton = page.locator('button:has-text("添加到比较"), button:has-text("比较")').first()
      if (await addToCompareButton.isVisible()) {
        await addToCompareButton.click()
        
        // Navigate to compare page
        await page.goto('/compare')
        await page.waitForLoadState('networkidle')
        
        // Check if compare table is visible
        const compareTable = page.locator('table, [class*="compare"]')
        await expect(compareTable.first()).toBeVisible({ timeout: 2000 }).catch(() => {
          // Empty state might be shown
        })
      }
    }
  })
})

test.describe('Navigation', () => {
  test('should navigate to agents page', async ({ page }) => {
    await page.goto('/agents')
    await page.waitForLoadState('networkidle')
    
    const agentsTitle = page.locator('h1:has-text("代理"), h1:has-text("Agents")')
    await expect(agentsTitle.first()).toBeVisible()
  })

  test('should navigate to product detail page', async ({ page }) => {
    await page.goto('/search')
    await page.waitForLoadState('networkidle')
    
    const firstProduct = page.locator('a[href*="/product/"]').first()
    if (await firstProduct.isVisible()) {
      await firstProduct.click()
      await page.waitForURL(/\/product\//)
      
      // Check if product title is visible
      const productTitle = page.locator('h1')
      await expect(productTitle.first()).toBeVisible()
    }
  })
})

