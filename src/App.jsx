import { useState } from 'react'

/**
 * A small UI, deliberately with no back end.
 *
 * It exists to be driven by a browser: sign in, look at some numbers, add and
 * complete a task. Every element a test needs to find is labelled, so a test
 * can be written against roles and visible text rather than brittle selectors.
 *
 * The sign-in accepts any non-empty pair. There is no server to check against,
 * and the point is to exercise the flow — whichever account is stored in the
 * PM tool should get through.
 */

const STATS = [
  { id: 'projects',  label: 'Active Projects', value: 12, tone: '#2563eb' },
  { id: 'tasks',     label: 'Open Tasks',      value: 47, tone: '#7c3aed' },
  { id: 'reviews',   label: 'In Review',       value: 8,  tone: '#d97706' },
  { id: 'done',      label: 'Completed',       value: 156, tone: '#16a34a' },
]

function SignIn({ onSignIn }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Enter a username and password.')
      return
    }
    setError('')
    onSignIn(username.trim())
  }

  return (
    <div className="centre">
      <form className="card signin" onSubmit={submit}>
        <h1>React UI Demo</h1>
        <p className="muted">Sign in to continue</p>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="you@example.com"
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />

        {error && <p role="alert" className="error">{error}</p>}

        <button type="submit">Sign in</button>
      </form>
    </div>
  )
}

function Dashboard({ user, onSignOut }) {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Design the settings page', done: true },
    { id: 2, title: 'Fix the date filter', done: false },
    { id: 3, title: 'Write release notes', done: false },
  ])
  const [draft, setDraft] = useState('')

  const addTask = (e) => {
    e.preventDefault()
    const title = draft.trim()
    if (!title) return
    setTasks((t) => [...t, { id: Date.now(), title, done: false }])
    setDraft('')
  }

  const toggle = (id) =>
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, done: !x.done } : x)))

  const remaining = tasks.filter((t) => !t.done).length

  return (
    <div className="page">
      <header className="bar">
        <h1>Dashboard</h1>
        <div className="bar-right">
          <span className="muted" data-testid="signed-in-as">Signed in as {user}</span>
          <button className="ghost" onClick={onSignOut}>Sign out</button>
        </div>
      </header>

      <section aria-label="Statistics" className="stats">
        {STATS.map((s) => (
          <div key={s.id} className="card stat" data-testid={`stat-${s.id}`}>
            <span className="stat-value" style={{ color: s.tone }}>{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      <section aria-label="Tasks" className="card tasks">
        <div className="tasks-head">
          <h2>Tasks</h2>
          <span className="muted" data-testid="remaining">{remaining} remaining</span>
        </div>

        <form className="add" onSubmit={addTask}>
          <label className="sr-only" htmlFor="new-task">New task</label>
          <input
            id="new-task"
            name="new-task"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a task…"
          />
          <button type="submit">Add task</button>
        </form>

        <ul className="list">
          {tasks.map((t) => (
            <li key={t.id} className={t.done ? 'done' : ''}>
              <label>
                <input
                  type="checkbox"
                  checked={t.done}
                  onChange={() => toggle(t.id)}
                  aria-label={`Mark "${t.title}" as done`}
                />
                <span>{t.title}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)

  return user
    ? <Dashboard user={user} onSignOut={() => setUser(null)} />
    : <SignIn onSignIn={setUser} />
}
