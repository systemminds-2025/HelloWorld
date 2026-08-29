import { defineConfig, devices } from '@playwright/test'

/**
 * The app is served under a base path, not the domain root, so every test URL
 * has to carry `/react-ui-demo/`. Putting it in baseURL means a test says
 * `page.goto('/')` and still lands in the right place.
 *
 * PORT is set by the agent VM when it starts the app; 5173 is Vite's default
 * for a local run.
 */
const PORT = process.env.PORT || 5173
const BASE = `http://127.0.0.1:${PORT}/react-ui-demo/`

export default defineConfig({
  testDir: './tests',

  // One retry: a first failure on CI is usually the dev server still warming
  // up, and a test that only fails once is not a test that found a bug.
  retries: process.env.CI ? 1 : 0,

  // Fail the run if a test was left with `.only` — that silently skips
  // everything else, and it passes.
  forbidOnly: !!process.env.CI,

  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL: BASE,
    // Kept only for failures. Recording every run fills the disk with videos
    // of tests that passed.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  /**
   * Start the app if it is not already up, and wait for it to answer.
   *
   * `reuseExistingServer` matters on the agent VM: the run command has usually
   * started the app already, and a second Vite on the same port would fail to
   * bind rather than share.
   */
  webServer: {
    command: `npx vite --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: BASE,
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
