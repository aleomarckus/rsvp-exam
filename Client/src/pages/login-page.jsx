import { useState } from 'react'
import { setUsername } from '../auth.js'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const [name, setName] = useState('')
  const nav = useNavigate()

  return (
    <div style={{ marginTop: 24 }}>
      <h2>Login</h2>
      <p>Enter a username (no password).</p>
      <form onSubmit={(e) => { e.preventDefault(); if (!name.trim()) return; setUsername(name); nav('/') }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="username" />
        <button style={{ marginLeft: 8 }}>Continue</button>
      </form>
    </div>
  )
}