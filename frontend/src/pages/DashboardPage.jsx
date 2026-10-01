import { useEffect, useState } from 'react'

function DashboardPage({
  user,
  onViewAllTransactions,
  onAddExpense,
  onAddIncome,
  onViewAnalytics
}) {
  const [analytics, setAnalytics] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0
  })

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.userId) return

    async function fetchDashboardData() {
      try {
        const [analyticsResponse, transactionsResponse] = await Promise.all([
          fetch(`http://localhost:8082/api/analytics/${user.userId}`),
          fetch(`http://localhost:8082/api/transactions/${user.userId}`)
        ])

        if (!analyticsResponse.ok || !transactionsResponse.ok) {
          throw new Error('Failed to fetch dashboard data')
        }

        const analyticsData = await analyticsResponse.json()
        const transactionsData = await transactionsResponse.json()

        setAnalytics(analyticsData)
        setTransactions(transactionsData)
      } catch (error) {
        console.error('Dashboard error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  const recentTransactions = [...transactions]
    .sort((a, b) => {
      return new Date(b.transactionDate) - new Date(a.transactionDate)
    })
    .slice(0, 5)

  function formatAmount(amount) {
    return `₹${Number(amount || 0).toLocaleString('en-IN')}`
  }

  function formatDate(date) {
    if (!date) return ''

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  function getTransactionTitle(tx) {
    return tx.description || tx.source || 'Transaction'
  }

  function getTransactionIcon(tx) {
    return tx.type === 'INCOME' ? '↓' : '↑'
  }

  if (loading) {
    return (
      <section id="dashboard" className="dashboard-section">
        <div className="ledger-container">
          <p>Loading dashboard...</p>
        </div>
      </section>
    )
  }

  return (
    <section id="dashboard" className="dashboard-section">
      <div className="ledger-container">

        <div className="ledger-hero">
          <div className="ledger-balance-block">
            <span className="dashboard-label">Total Balance</span>

            <h1 className="hero-balance-val">
              {formatAmount(analytics.balance)}
            </h1>

            <p className="hero-balance-meta">
              Available balance
            </p>
          </div>

          <div className="ledger-actions">
            <button
              onClick={onAddExpense}
              className="ledger-btn ledger-btn-dark"
            >
              Add Expense
            </button>

            <button
              onClick={onAddIncome}
              className="ledger-btn ledger-btn-accent"
            >
              Add Income
            </button>

            <button
              onClick={onViewAnalytics}
              className="ledger-btn ledger-btn-outline"
            >
              Analytics ↗
            </button>
          </div>
        </div>

        <div className="metrics-strip">

          <div className="metric-strip-item">
            <div className="strip-heading">
              <span className="strip-icon">↓</span>
              <span className="strip-label">Total Income</span>
            </div>

            <div className="strip-value">
              {formatAmount(analytics.totalIncome)}
            </div>

            <small className="strip-caption">
              Total money received
            </small>
          </div>

          <div className="metric-strip-item">
            <div className="strip-heading">
              <span className="strip-icon">↑</span>
              <span className="strip-label">Total Expense</span>
            </div>

            <div className="strip-value">
              {formatAmount(analytics.totalExpense)}
            </div>

            <small className="strip-caption">
              Total money spent
            </small>
          </div>

        </div>

        <div className="ledger-card">
          <div className="ledger-card-header">
            <div>
              <h3>Recent Transactions</h3>
              <p>Latest movements across all accounts</p>
            </div>

            <button
              className="view-link"
              onClick={onViewAllTransactions}
            >
              View All History →
            </button>
          </div>

          <div className="ledger-list">

            {recentTransactions.length === 0 ? (
              <p>No transactions yet.</p>
            ) : (
              recentTransactions.map((tx, idx) => (
                <div
                  className="ledger-row"
                  key={tx.id || idx}
                >
                  <div className="ledger-row-left">

                    <div className="transaction-icon">
                      {getTransactionIcon(tx)}
                    </div>

                    <div className="transaction-details">
                      <strong>
                        {getTransactionTitle(tx)}
                      </strong>

                      <small>
                        {formatDate(tx.transactionDate)}
                      </small>
                    </div>

                  </div>

                  <div
                    className={
                      tx.type === 'INCOME'
                        ? 'amount-income'
                        : 'amount-expense'
                    }
                  >
                    {tx.type === 'INCOME' ? '+' : '-'}
                    {formatAmount(tx.amount)}
                  </div>

                </div>
              ))
            )}

          </div>
        </div>

      </div>
    </section>
  )
}

export default DashboardPage