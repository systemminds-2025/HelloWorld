/**
 * The landing page: Hello Sharan, and nothing else.
 *
 * Deliberately one screen with one message. The heading carries a test id so a
 * generated test can assert on it directly rather than matching loose text
 * somewhere on the page.
 */
export default function App() {
  return (
    <main className="centre">
      <h1 data-testid="greeting">Hello Sharan</h1>
    </main>
  )
}
