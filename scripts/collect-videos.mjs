/**
 * Copy each test's recording somewhere the running app will serve it.
 *
 * The agent VM has no route that returns a file, so a video sitting in
 * .test-runs is invisible to anything outside the machine. Vite serves
 * everything under public/ at the app's base path, so a copy placed there is
 * reachable at the same address the app is already published on - which is the
 * only channel out of the VM that exists today.
 *
 * public/__test-runs is gitignored: these are build output of a test run, not
 * part of anyone's change.
 */
import { mkdir, readdir, copyFile, rm, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT     = join(dirname(fileURLToPath(import.meta.url)), '..')
const TASK_ID  = process.env.TASK_ID || 'local'
const SOURCE   = process.env.PW_ARTEFACT_DIR || join(ROOT, '..', '.test-runs', TASK_ID)
const TARGET   = join(ROOT, 'public', '__test-runs', TASK_ID)

if (!existsSync(SOURCE)) {
  console.log(`no recordings at ${SOURCE}`)
  process.exit(0)
}

// Cleared first: a case removed from the suite should stop being listed, and a
// stale video is worse than none - it shows a passing run of code that is gone.
await rm(TARGET, { recursive: true, force: true })
await mkdir(TARGET, { recursive: true })

const entries = await readdir(SOURCE, { withFileTypes: true })
const cases = []

for (const dir of entries.filter(e => e.isDirectory())) {
  const files = await readdir(join(SOURCE, dir.name))
  const video = files.find(f => f.endsWith('.webm'))
  if (!video) continue

  const name = `${dir.name}.webm`
  await copyFile(join(SOURCE, dir.name, video), join(TARGET, name))

  cases.push({
    // The folder name is playwright's slug of the test title. Turning it back
    // into words is what makes the dropdown readable.
    title: dir.name.replace(/-chromium$/, '').replace(/^app-/, '').replace(/-/g, ' '),
    file: name,
  })
}

// An index so the PM tool can list what exists without guessing file names.
await writeFile(
  join(TARGET, 'index.json'),
  JSON.stringify({ task_id: TASK_ID, recorded_at: new Date().toISOString(), cases }, null, 2),
)

console.log(`collected ${cases.length} recording(s) to public/__test-runs/${TASK_ID}`)
for (const c of cases) console.log(`   ${c.file}`)
