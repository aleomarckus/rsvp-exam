import { Link, Outlet, useLocation } from 'react-router-dom'
import { getUsername, clearUsername } from './auth.js'

export default function App() {
  const u = getUsername()
  const loc = useLocation()

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <header style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <nav style={{ display: 'flex', gap: 12 }}>
          <Link to="/">Public Events</Link>
          <Link to="/my">My Events</Link>
        </nav>
        <div>
          {u ? (
            <>
              <strong>Logged in as: {u}</strong>
              <button style={{ marginLeft: 12 }} onClick={() => { clearUsername(); window.location.href = loc.pathname }}>
                Log out
              </button>
            </>
          ) : (
            <Link to="/login">Log in</Link>
          )}
        </div>
      </header>
      <hr />
      <Outlet />
    </div>
  )
}