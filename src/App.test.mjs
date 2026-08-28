// No test runner is configured in this project (no vitest/jest, no test script
// in package.json), so this uses Node's built-in test runner directly:
//   node --test src/App.test.mjs
import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const appSource = readFileSync(fileURLToPath(new URL('./App.jsx', import.meta.url)), 'utf8')

test('landing page greeting is "Hello Code"', () => {
  assert.match(appSource, /data-testid="greeting">Hello Code</)
})

test('landing page no longer greets with "Hello World"', () => {
  assert.doesNotMatch(appSource, /Hello World/)
})
