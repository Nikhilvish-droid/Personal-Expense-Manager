import { useEffect, useState } from 'react'
import IncomeForm from '../components/IncomeForm'

function IncomePage({ user }) {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [editingIncome, setEditingIncome] = useState(null)
  const [isIncomeFormOpen, setIsIncomeFormOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  async function fetchData() {
    if (!user?.userId) {
      setLoading(false)
      return
    }

    try {
      const [transactionsResponse, categoriesResponse] =
        await Promise.all([
          fetch(`http://localhost:8082/api/transactions/${user.userId}`),
          fetch('http://localhost:8082/api/categories')
        ])

      if (!transactionsResponse.ok || !categoriesResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const transactionsData = await transactionsResponse.json()
      const categoriesData = await categoriesResponse.json()

      setTransactions(
        transactionsData.filter(
          (transaction) => transaction.type === 'INCOME'
        )
      )

      setCategories(
        categoriesData.filter(
          (category) => category.type === 'INCOME'
        )
      )
    } catch (error) {
      console.error('Fetch income data error:', error)
      alert('Unable to load income data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  function handleIncomeSaved() {
    fetchData()
  }

  function handleEdit(income) {
    setEditingIncome(income)
    setIsIncomeFormOpen(true)
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this income?'
    )

    if (!confirmed) return

    try {
      const response = await fetch(
        `http://localhost:8082/api/transactions/${id}`,
        {
          method: 'DELETE'
        }
      )

      if (!response.ok) {
        throw new Error('Failed to delete income')
      }

      setTransactions((current) =>
        current.filter((transaction) => transaction.id !== id)
      )
    } catch (error) {
      console.error('Delete income error:', error)
      alert('Unable to delete income.')
    }
  }

  function handleCloseForm() {
    setEditingIncome(null)
    setIsIncomeFormOpen(false)
  }

  function getCategoryName(categoryId) {
    const category = categories.find(
      (category) => category.id === categoryId
    )

    return category?.name || 'Other'
  }

  function formatDate(date) {
    if (!date) return ''

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  function formatAmount(amount) {
    return `₹${Number(amount || 0).toLocaleString('en-IN')}`
  }

  return (
    <section id="income" className="expenses-section">

      <div className="section-heading">
        <p>INCOME MANAGEMENT</p>
        <h2>Manage Your Income</h2>
        <span>Track where your money comes from.</span>
      </div>

      {isIncomeFormOpen && (
        <div className="expense-form-container">
          <IncomeForm
            user={user}
            income={editingIncome}
            categories={categories}
            onClose={handleCloseForm}
            onIncomeAdded={handleIncomeSaved}
          />
        </div>
      )}

      {!isIncomeFormOpen && (
        <div className="expense-form-trigger">
          <button
            className="add-button"
            onClick={() => {
              setEditingIncome(null)
              setIsIncomeFormOpen(true)
            }}
          >
            + Add Income
          </button>
        </div>
      )}

      <div className="table-card">

        {loading ? (
          <p>Loading income...</p>
        ) : transactions.length === 0 ? (
          <p>No income found.</p>
        ) : (
          <table>

            <thead>
              <tr>
                <th>Description</th>
                <th>Category</th>
                <th>Date</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id}>

                  <td>
                    {tx.description || 'No description'}
                  </td>

                  <td>
                    {getCategoryName(tx.categoryId)}
                  </td>

                  <td>
                    {formatDate(tx.transactionDate)}
                  </td>

                  <td>
                    {tx.paymentMethod}
                  </td>

                  <td className="amount-income">
                    +{formatAmount(tx.amount)}
                  </td>

                  <td>
                    <button
                      className="edit-button"
                      onClick={() => handleEdit(tx)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-button"
                      onClick={() => handleDelete(tx.id)}
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

    </section>
  )
}

export default IncomePage