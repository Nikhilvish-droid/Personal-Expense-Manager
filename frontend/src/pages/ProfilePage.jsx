import { useState } from 'react'

function ProfilePage({ user, onLogout }) {
  const [isEditing, setIsEditing] = useState(false)

  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')

  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  function handleSave(e) {
    e.preventDefault()

    alert('Profile update API is not connected yet.')
    setIsEditing(false)
  }

  return (
    <section id="profile" className="profile-section">

      <div className="section-heading">
        <p>ACCOUNT</p>
        <h2>Your Profile</h2>
      </div>

      <div className="profile-card">

        <div className="profile-avatar">
          {initials}
        </div>

        {!isEditing ? (
          <>
            <h3>{name}</h3>
            <p>{email}</p>

            <div className="profile-info">

              <div className="profile-info-row">
                <span className="profile-info-label">
                  Name
                </span>

                <span className="profile-info-value">
                  {name}
                </span>
              </div>

              <div className="profile-info-row">
                <span className="profile-info-label">
                  Email
                </span>

                <span className="profile-info-value">
                  {email}
                </span>
              </div>

            </div>

            <div className="profile-actions">

              <button
                type="button"
                className="edit-profile-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>

              <button
                onClick={onLogout}
                className="profile-logout"
              >
                Logout
              </button>

            </div>
          </>
        ) : (

          <form
            className="profile-edit-form"
            onSubmit={handleSave}
          >

            <label htmlFor="profile-name">
              Name
            </label>

            <input
              id="profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="profile-email">
              Email
            </label>

            <input
              id="profile-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="profile-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() => {
                  setName(user?.name || '')
                  setEmail(user?.email || '')
                  setIsEditing(false)
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="profile-save-btn"
              >
                Save Changes
              </button>

            </div>

          </form>

        )}

      </div>

    </section>
  )
}

export default ProfilePage