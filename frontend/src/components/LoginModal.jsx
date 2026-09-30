import { useState } from 'react'
import logo from '../assets/FinNest.png'

function LoginModal({ onClose, onSwitchToSignup, onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    if (email === '' || password === '') {
      alert('Please enter email and password.')
      return
    }

    onLogin()
    setEmail('')
    setPassword('')
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
        <img src={logo} alt="FinNest" className="login-logo" />
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
          <div className="login-options">
            <label className="remember"><input type="checkbox" /> Remember me</label>
            <a href="#">Forgot Password?</a>
          </div>
          <button type="submit" className="login-submit">Login</button>
        </form>
        <p className="signup-text">
          Don't have an account?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onSwitchToSignup()
            }}
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  )
}

export default LoginModal
