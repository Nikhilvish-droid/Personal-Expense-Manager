import { Link, NavLink } from 'react-router-dom'
import logo from '../assets/FinNest.png'

function Navbar({ isLoggedIn, onShowLogin, onShowSignup, onLogout }) {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src={logo} alt="FinNest Logo" />
      </Link>

      {!isLoggedIn && (
        <div className="nav-links" id="public-nav">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#about">About</a>
        </div>
      )}

      {isLoggedIn && (
        <div className="nav-links logged-nav" id="logged-nav" style={{ display: 'flex' }}>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/expenses">Expenses</NavLink>
          <NavLink to="/income">Income</NavLink>
          <NavLink to="/savings">Savings</NavLink>
          <NavLink to="/analytics">Analytics</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </div>
      )}

      <div className="nav-auth-buttons" id="nav-auth-buttons">
        {isLoggedIn ? (
          <button className="nav-login" onClick={onLogout}>Logout</button>
        ) : (
          <>
            <button className="nav-signup" onClick={onShowSignup}>Sign Up</button>
            <button className="nav-login" onClick={onShowLogin}>Login</button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
