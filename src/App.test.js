import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const appSource = readFileSync(fileURLToPath(new URL('./App.jsx', import.meta.url)), 'utf8')

test('landing page greets Sharan, not the world', () => {
  assert.match(appSource, /hello Sharan/)
  assert.doesNotMatch(appSource, /Hello World/)
})
