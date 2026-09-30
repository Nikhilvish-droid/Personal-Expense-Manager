import { useState } from 'react'
import { savingsGoals } from '../data/sampleData'

function SavingsGoalsPage() {
  const [name, setName] = useState('')
  const [target, setTarget] = useState('')
  const [deadline, setDeadline] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    alert('Goal added.')
    setName('')
    setTarget('')
    setDeadline('')
  }

  return (
    <section id="savings" className="savings-section">
      <div className="section-heading">
        <p>SAVINGS GOALS</p>
        <h2>Save Toward Something</h2>
        <span>Set a target and keep an eye on how close you are.</span>
      </div>

      <div className="savings-grid">
        <div className="income-form-card">
          <p className="form-label">GOAL</p>
          <h3>Add Goal</h3>
          <form onSubmit={handleSubmit}>
            <label>Goal Name</label>
            <input
              type="text"
              placeholder="e.g. New Laptop"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label>Target Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              min="1"
              required
              value={target}
              onChange={(e) => setTarget(e.target.value)}
            />
            <label>Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
            <button type="submit" className="save-button">Add Goal</button>
          </form>
        </div>

        <div className="income-history-card">
          <div className="card-header">
            <h3>Your Goals</h3>
            <span>{savingsGoals.length} total</span>
          </div>
          {savingsGoals.map((goal) => {
            const percent = Math.min(100, Math.round((goal.current / goal.target) * 100))
            return (
              <div className="goal-card" key={goal.name}>
                <div className="goal-card-header">
                  <strong>{goal.name}</strong>
                  <span className={`goal-status goal-status-${goal.status.toLowerCase()}`}>
                    {goal.status}
                  </span>
                </div>
                <div className="goal-progress-bar">
                  <div className="goal-progress-fill" style={{ width: `${percent}%` }}></div>
                </div>
                <div className="goal-progress-meta">
                  <small>
                    ₹{goal.current.toLocaleString('en-IN')} of ₹{goal.target.toLocaleString('en-IN')}
                  </small>
                  <small>{percent}%</small>
                </div>
                {goal.deadline && <small className="goal-deadline">Target date: {goal.deadline}</small>}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default SavingsGoalsPage
