import { useState } from 'react'

function LoginModal({ onClose, onSwitchToSignup, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    if (email === '' || password === '') {
      alert('Please enter email and password.')
      return
    }

    try{
      const response = await fetch('http://localhost:8082/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'login failed.')
        return
      }

      onLogin(data)
      setEmail('')
      setPassword('')

    }catch (error) {
      console.error(error)
      alert('Unable to connect to the server.')
    }

  }

  return (
    <div
      className="modal"
      style={{ display: 'flex' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="login-box">
        <button type="button" className="close-button" onClick={onClose}>×</button>
        <h2>Welcome Back!</h2>
        <p>Login to continue to FinNest</p>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-submit">Login</button>
        </form>
      </div>
    </div>
  )
}

export default LoginModal
