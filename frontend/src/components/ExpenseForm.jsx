import { useState } from 'react'

function ExpenseForm({ onClose }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [date, setDate] = useState('')
  const [payment, setPayment] = useState('UPI')

  function handleSubmit(e) {
    e.preventDefault()
    alert('Expense added.')
    setDescription('')
    setAmount('')
    setCategory('Food')
    setDate('')
    setPayment('UPI')
    onClose()
  }

  return (
    <section id="expense-form" className="form-section" style={{ display: 'block' }}>
      <div className="form-box">
        <div className="form-header">
          <div>
            <p>EXPENSE</p>
            <h2>Add New Expense</h2>
          </div>
          <button onClick={onClose} className="close-form">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <label>Expense Description</label>
          <input
            type="text"
            placeholder="e.g. Grocery shopping"
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label>Amount</label>
          <input
            type="number"
            placeholder="Enter amount"
            min="1"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Food</option>
            <option>Transport</option>
            <option>Shopping</option>
            <option>Bills</option>
            <option>Other</option>
          </select>
          <label>Date</label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <label>Payment Method</label>
          <select value={payment} onChange={(e) => setPayment(e.target.value)}>
            <option>UPI</option>
            <option>Cash</option>
            <option>Card</option>
            <option>Bank Transfer</option>
          </select>
          <button type="submit" className="save-button">Save Expense</button>
        </form>
      </div>
    </section>
  )
}

export default ExpenseForm
