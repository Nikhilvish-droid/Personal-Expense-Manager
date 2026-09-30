import { useState } from 'react'
import logo from '../assets/FinNest.png'

function SignupModal({ onClose, onSwitchToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()

    if (name === '' || email === '' || password === '') {
      alert('Please fill in all fields.')
      return
    }

    alert('Account created. Please log in.')
    setName('')
    setEmail('')
    setPassword('')
    onSwitchToLogin()
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
        <h2>Create Account</h2>
        <p>Join FinNest to manage your money</p>
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
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
            placeholder="Create a password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="login-submit">Sign Up</button>
        </form>
        <p className="signup-text">
          Already have an account?{' '}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onSwitchToLogin()
            }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  )
}

export default SignupModal
