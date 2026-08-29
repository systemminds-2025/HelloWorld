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

/**
 * Where the recordings go.
 *
 * Keyed by ticket, so runs of different tickets do not overwrite each other and
 * a video can be traced back to the change it was recording. TASK_ID is set by
 * the agent VM; a local run without one lands in `local` rather than failing.
 *
 * The path sits beside the checkout rather than inside it — a video written
 * into the working tree shows up as an untracked file in the ticket's diff.
 */
const TASK_ID = process.env.TASK_ID || 'local'
const ARTEFACTS = process.env.PW_ARTEFACT_DIR || `../.test-runs/${TASK_ID}`

export default defineConfig({
  testDir: './tests',

  // One retry: a first failure on CI is usually the dev server still warming
  // up, and a test that only fails once is not a test that found a bug.
  retries: process.env.CI ? 1 : 0,

  // Fail the run if a test was left with `.only` — that silently skips
  // everything else, and it passes.
  forbidOnly: !!process.env.CI,

  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',

  // Everything a run produces — videos, traces, screenshots — under one
  // ticket-scoped folder, so collecting them afterwards is one directory read.
  outputDir: ARTEFACTS,

  use: {
    baseURL: BASE,

    // Recorded every run, not only on failure: the point of the recording is
    // to show a person what the change looks like working, which is exactly
    // the run that passed.
    video: { mode: 'on', size: { width: 1280, height: 720 } },

    // These two stay failure-only. A trace is large and only read when
    // something broke, and the video already shows what the screenshot would.
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
