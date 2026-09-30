import { summaryCards, recentTransactions } from '../data/sampleData'

function DashboardPage({ onLogout, onViewAllTransactions, onAddExpense, onAddIncome, onViewAnalytics }) {
  return (
    <section id="dashboard" className="dashboard-section">
      <div className="dashboard-welcome">
        <div>
          <p className="dashboard-label">DASHBOARD</p>
          <h1>Welcome back</h1>
          <p>Here's your financial overview.</p>
        </div>
        <button className="logout-dashboard" onClick={onLogout}>Logout</button>
      </div>

      <div className="summary-grid">
        {summaryCards.map((card) => (
          <div className="summary-card" key={card.label}>
            <div className="summary-icon">{card.icon}</div>
            <p>{card.label}</p>
            <h2>{card.value}</h2>
            <small>{card.small}</small>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <div className="card-header">
            <h3>Recent Transactions</h3>
            <button onClick={onViewAllTransactions}>View All</button>
          </div>
          {recentTransactions.map((tx) => (
            <div className="recent-transaction" key={tx.title}>
              <div className={`transaction-icon ${tx.iconClass}`}>{tx.icon}</div>
              <div className="transaction-details">
                <strong>{tx.title}</strong>
                <small>{tx.meta}</small>
              </div>
              <span className={tx.amountClass}>{tx.amount}</span>
            </div>
          ))}
        </div>

        <div className="dashboard-card quick-actions">
          <h3>Quick Actions</h3>
          <button onClick={onAddExpense} className="action-expense">Add Expense</button>
          <button onClick={onAddIncome} className="action-income">Add Income</button>
          <button onClick={onViewAnalytics} className="action-analytics">View Analytics</button>
        </div>
      </div>
    </section>
  )
}

export default DashboardPage
