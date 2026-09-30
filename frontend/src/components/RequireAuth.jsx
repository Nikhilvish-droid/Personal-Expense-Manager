import { Navigate, Outlet } from 'react-router-dom'

function RequireAuth({ isLoggedIn }) {
  return isLoggedIn ? <Outlet /> : <Navigate to="/" replace />
}

export default RequireAuth
