import { useState } from 'react'

/**
 * The three sections the nav links switch between. Kept as plain text here
 * rather than routes: there is no router in this project, and the ticket only
 * asks for the navigation itself.
 */
const PAGES = {
  home: { label: 'Home', heading: 'Hello World' },
  about: { label: 'About', heading: 'About' },
  contact: { label: 'Contact Us', heading: 'Contact Us' },
}

export default function App() {
  const [page, setPage] = useState('home')

  return (
    <>
      <nav className="nav" data-testid="nav">
        {Object.entries(PAGES).map(([key, { label }]) => (
          <button
            key={key}
            type="button"
            className="nav-link"
            data-testid={`nav-${key}`}
            aria-current={page === key ? 'page' : undefined}
            onClick={() => setPage(key)}
          >
            {label}
          </button>
        ))}
      </nav>
      <main className="centre">
        <h1 data-testid="greeting">{PAGES[page].heading}</h1>
      </main>
    </>
  )
}
