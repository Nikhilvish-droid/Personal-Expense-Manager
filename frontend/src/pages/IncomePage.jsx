import { useState } from 'react'
import { incomeHistory } from '../data/sampleData'

function IncomePage() {
  const [source, setSource] = useState('Salary')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    alert('Income added.')
    setSource('Salary')
    setAmount('')
    setDate('')
  }

  return (
    <section id="income" className="income-section">
      <div className="section-heading">
        <p>INCOME MANAGEMENT</p>
        <h2>Manage Your Income</h2>
        <span>Track where your money comes from.</span>
      </div>
      <div className="income-grid">
        <div className="income-form-card">
          <p className="form-label">INCOME</p>
          <h3>Add Income</h3>
          <form onSubmit={handleSubmit}>
            <label>Income Source</label>
            <select value={source} onChange={(e) => setSource(e.target.value)}>
              <option>Salary</option>
              <option>Freelancing</option>
              <option>Scholarship</option>
              <option>Business</option>
              <option>Other</option>
            </select>
            <label>Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              min="1"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <label>Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button type="submit" className="save-button">Add Income</button>
          </form>
        </div>
        <div className="income-history-card">
          <div className="card-header">
            <h3>Income History</h3>
            <span>This Month</span>
          </div>
          {incomeHistory.map((item) => (
            <div className="income-item" key={item.title}>
              <div className="income-item-icon">{item.icon}</div>
              <div>
                <strong>{item.title}</strong>
                <small>{item.date}</small>
              </div>
              <strong className="amount-income">{item.amount}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default IncomePage
