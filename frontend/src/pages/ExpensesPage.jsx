import { useEffect, useState } from 'react'
import ExpenseForm from '../components/ExpenseForm'

function ExpensesPage({
  user,
  isExpenseFormOpen,
  onOpenExpenseForm,
  onCloseExpenseForm
}) {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [editingExpense, setEditingExpense] = useState(null)
  const [loading, setLoading] = useState(true)

  async function fetchData() {
  if (!user?.userId) {
    setLoading(false)
    return
  }

  try {
    const [transactionsResponse, categoriesResponse] =
      await Promise.all([
        fetch(
          `http://localhost:8082/api/transactions/${user.userId}`
        ),
        fetch(
          'http://localhost:8082/api/categories'
        )
      ])

    if (
      !transactionsResponse.ok ||
      !categoriesResponse.ok
    ) {
      throw new Error('Failed to fetch data')
    }

    const transactionsData =
      await transactionsResponse.json()

    const categoriesData =
      await categoriesResponse.json()

    setTransactions(
      transactionsData.filter(
        (transaction) => transaction.type === 'EXPENSE'
      )
    )

    setCategories(
      categoriesData.filter(
        (category) => category.type === 'EXPENSE'
      )
    )

    } catch (error) {
      console.error('Fetch expense data error:', error)
      alert('Unable to load expense data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [user])

  function handleExpenseSaved() {
    fetchData()
  }

  function handleEdit(expense) {
    setEditingExpense(expense)
    onOpenExpenseForm()
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this expense?'
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
        throw new Error('Failed to delete expense')
      }

      setTransactions((current) =>
        current.filter(
          (transaction) => transaction.id !== id
        )
      )

    } catch (error) {
      console.error('Delete expense error:', error)
      alert('Unable to delete expense.')
    }
  }

  function handleCloseForm() {
    setEditingExpense(null)
    onCloseExpenseForm()
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
    <section
      id="expenses"
      className="expenses-section"
    >

      <div className="section-heading">
        <p>EXPENSE MANAGEMENT</p>

        <h2>Manage Your Expenses</h2>

        <span>
          Keep your spending organized in one place.
        </span>
      </div>

      {isExpenseFormOpen && (
        <div className="expense-form-container">

          <ExpenseForm
            user={user}
            expense={editingExpense}
            categories={categories}
            onClose={handleCloseForm}
            onExpenseAdded={handleExpenseSaved}
          />

        </div>
      )}

      {!isExpenseFormOpen && (
        <div className="expense-form-trigger">

          <button
            className="add-button"
            onClick={() => {
              setEditingExpense(null)
              onOpenExpenseForm()
            }}
          >
            + Add Expense
          </button>

        </div>
      )}

      <div className="table-card">

        {loading ? (
          <p>Loading expenses...</p>
        ) : transactions.length === 0 ? (
          <p>No expenses found.</p>
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

                  <td className="amount-expense">
                    -{formatAmount(tx.amount)}
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

export default ExpensesPage