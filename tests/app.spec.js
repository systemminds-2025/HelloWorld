import { test, expect } from '@playwright/test'

/**
 * What the page must always do.
 *
 * Assertions go through the test id and the heading role rather than matching
 * text anywhere on the page: a loose text match passes when the same words
 * appear somewhere unrelated, which is a test that cannot fail usefully.
 */

test('the page loads and greets', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByTestId('greeting')).toHaveText('Hello World')
})

test('the greeting is the page heading, not just text on it', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Hello World', level: 1 })).toBeVisible()
})

test('the navigation has Home, About and Contact Us, and they switch the page', async ({ page }) => {
  await page.goto('/')

  const nav = page.getByTestId('nav')
  await expect(nav.getByTestId('nav-home')).toHaveText('Home')
  await expect(nav.getByTestId('nav-about')).toHaveText('About')
  await expect(nav.getByTestId('nav-contact')).toHaveText('Contact Us')

  await nav.getByTestId('nav-about').click()
  await expect(page.getByTestId('greeting')).toHaveText('About')

  await nav.getByTestId('nav-contact').click()
  await expect(page.getByTestId('greeting')).toHaveText('Contact Us')

  await nav.getByTestId('nav-home').click()
  await expect(page.getByTestId('greeting')).toHaveText('Hello World')
})

test('the page background is orange', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(249, 115, 22)')
})

test('nothing errors in the console', async ({ page }) => {
  const errors = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()) })
  page.on('pageerror', e => errors.push(e.message))

  await page.goto('/')
  await expect(page.getByTestId('greeting')).toBeVisible()

  expect(errors).toEqual([])
})
