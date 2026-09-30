import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import LoginModal from './components/LoginModal'
import SignupModal from './components/SignupModal'
import RequireAuth from './components/RequireAuth'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import ExpensesPage from './pages/ExpensesPage'
import IncomePage from './pages/IncomePage'
import SavingsGoalsPage from './pages/SavingsGoalsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import ProfilePage from './pages/ProfilePage'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeModal, setActiveModal] = useState(null) // 'login' | 'signup' | null
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false)
  const navigate = useNavigate()

  function handleLogin() {
    setActiveModal(null)
    setIsLoggedIn(true)
    navigate('/dashboard')
  }

  function handleLogout() {
    setIsLoggedIn(false)
    setIsExpenseFormOpen(false)
    navigate('/')
  }

  function openExpenseForm() {
    setIsExpenseFormOpen(true)
    navigate('/expenses')
  }

  function scrollToId(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        onShowLogin={() => setActiveModal('login')}
        onShowSignup={() => setActiveModal('signup')}
        onLogout={handleLogout}
      />

      <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <HomePage
                onGetStarted={() => setActiveModal('signup')}
                onExploreFeatures={() => scrollToId('features')}
              />
            )
          }
        />

        <Route element={<RequireAuth isLoggedIn={isLoggedIn} />}>
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                onLogout={handleLogout}
                onViewAllTransactions={() => navigate('/expenses')}
                onAddExpense={openExpenseForm}
                onAddIncome={() => navigate('/income')}
                onViewAnalytics={() => navigate('/analytics')}
              />
            }
          />
          <Route
            path="/expenses"
            element={
              <ExpensesPage
                isExpenseFormOpen={isExpenseFormOpen}
                onOpenExpenseForm={() => setIsExpenseFormOpen(true)}
                onCloseExpenseForm={() => setIsExpenseFormOpen(false)}
              />
            }
          />
          <Route path="/income" element={<IncomePage />} />
          <Route path="/savings" element={<SavingsGoalsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/profile" element={<ProfilePage onLogout={handleLogout} />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {activeModal === 'login' && (
        <LoginModal
          onClose={() => setActiveModal(null)}
          onSwitchToSignup={() => setActiveModal('signup')}
          onLogin={handleLogin}
        />
      )}

      {activeModal === 'signup' && (
        <SignupModal
          onClose={() => setActiveModal(null)}
          onSwitchToLogin={() => setActiveModal('login')}
        />
      )}

      <Footer />
    </>
  )
}

export default App
