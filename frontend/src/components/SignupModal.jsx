import { useState } from 'react'

function SignupModal({ onClose, onSwitchToLogin }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()

    if (name === '' || email === '' || password === '') {
      alert('Please fill in all fields.')
      return
    }

    try {
      const response = await fetch('http://localhost:8082/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        alert(data.message || 'Signup failed.')
        return
      }

      alert('Account created successfully. Please log in.')

      setName('')
      setEmail('')
      setPassword('')

      onSwitchToLogin()

    } catch (error) {
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
      </div>
    </div>
  )
}

export default SignupModal
