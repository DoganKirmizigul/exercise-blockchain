import { useState, useEffect } from 'react'
import { LogOut, Plus, Calendar } from 'lucide-react'
import { createEvent, createCategory, getEvents } from '../../services/api'
import styles from './Admin.module.css'

const PASSWORD = 'toto'

const INITIAL_EVENT_FORM = {
  name: '',
  description: '',
  location: '',
  event_date: '',
  seller_address: '',
}

const INITIAL_CATEGORY_FORM = {
  event_id: '',
  name: '',
  price_eth: '',
  price_eur: '',
  max_supply: '',
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [activeTab, setActiveTab] = useState('event')

  const [eventForm, setEventForm] = useState(INITIAL_EVENT_FORM)
  const [categoryForm, setCategoryForm] = useState(INITIAL_CATEGORY_FORM)

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAuthenticated) {
      fetchEvents()
    }
  }, [isAuthenticated])

  const fetchEvents = async () => {
    try {
      const response = await getEvents()
      setEvents(response.data)
    } catch (err) {
      console.error('Failed to fetch events', err)
    }
  }

  const handleLogin = () => {
    if (password === PASSWORD) {
      setIsAuthenticated(true)
      setLoginError('')
    } else {
      setLoginError('Wrong password.')
    }
  }

  const handleEventChange = (e) => {
    const { name, value } = e.target
    setEventForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCategoryChange = (e) => {
    const { name, value } = e.target
    setCategoryForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateEvent = async () => {
    setLoading(true)
    setSuccess('')
    setError('')
    try {
      await createEvent({
        ...eventForm,
        event_date: new Date(eventForm.event_date).toISOString(),
      })
      setSuccess('Event created successfully!')
      setEventForm(INITIAL_EVENT_FORM)
      fetchEvents()
    } catch (err) {
      setError('Failed to create event. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = async () => {
    setLoading(true)
    setSuccess('')
    setError('')
    try {
      await createCategory(categoryForm.event_id, {
        name: categoryForm.name,
        price_eth: categoryForm.price_eth,
        price_eur: parseInt(categoryForm.price_eur),
        max_supply: parseInt(categoryForm.max_supply),
      })
      setSuccess('Category created successfully!')
      setCategoryForm(INITIAL_CATEGORY_FORM)
    } catch (err) {
      setError('Failed to create category. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Login page
  if (!isAuthenticated) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginBox}>
          <h2 className={styles.loginTitle}>Admin Access</h2>
          <p className={styles.loginSubtitle}>Enter the admin password to continue.</p>

          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />

          {loginError && <p className={styles.loginError}>{loginError}</p>}

          <button className={styles.submitButton} onClick={handleLogin}>
            Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.title}>Admin</h1>
          <p className={styles.subtitle}>Manage events and ticket categories.</p>
        </div>
        <button
          className={styles.logoutButton}
          onClick={() => setIsAuthenticated(false)}
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'event' ? styles.tabActive : ''}`}
          onClick={() => { setActiveTab('event'); setSuccess(''); setError('') }}
        >
          <Calendar size={14} /> Create Event
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'category' ? styles.tabActive : ''}`}
          onClick={() => { setActiveTab('category'); setSuccess(''); setError('') }}
        >
          <Plus size={14} /> Add Ticket Category
        </button>
      </div>

      {activeTab === 'event' && (
        <div className={styles.form}>
          <h2 className={styles.formTitle}>Create a new event</h2>

          <div className={styles.field}>
            <label className={styles.label}>Event name</label>
            <input
              className={styles.input}
              name="name"
              placeholder="Ladybug Live Tour"
              value={eventForm.name}
              onChange={handleEventChange}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              name="description"
              placeholder="Describe the event..."
              value={eventForm.description}
              onChange={handleEventChange}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Location</label>
              <input
                className={styles.input}
                name="location"
                placeholder="Paris, Accor Arena"
                value={eventForm.location}
                onChange={handleEventChange}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Date</label>
              <input
                className={styles.input}
                name="event_date"
                type="datetime-local"
                value={eventForm.event_date}
                onChange={handleEventChange}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Seller wallet address</label>
            <input
              className={styles.input}
              name="seller_address"
              placeholder="0x..."
              value={eventForm.seller_address}
              onChange={handleEventChange}
            />
          </div>

          {success && <p className={styles.successMessage}>{success}</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}

          <button
            className={styles.submitButton}
            onClick={handleCreateEvent}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      )}

      {activeTab === 'category' && (
        <div className={styles.form}>
          <h2 className={styles.formTitle}>Add a ticket category</h2>

          <div className={styles.field}>
            <label className={styles.label}>Event</label>
            <select
              className={styles.select}
              name="event_id"
              value={categoryForm.event_id}
              onChange={handleCategoryChange}
            >
              <option value="">Select an event</option>
              {events.map(event => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Category name</label>
            <input
              className={styles.input}
              name="name"
              placeholder="Fosse, VIP, Carré Or..."
              value={categoryForm.name}
              onChange={handleCategoryChange}
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>Price in EUR</label>
              <input
                className={styles.input}
                name="price_eur"
                type="number"
                placeholder="150"
                value={categoryForm.price_eur}
                onChange={handleCategoryChange}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Price in ETH</label>
              <input
                className={styles.input}
                name="price_eth"
                placeholder="0.05"
                value={categoryForm.price_eth}
                onChange={handleCategoryChange}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Max supply (total tickets)</label>
            <input
              className={styles.input}
              name="max_supply"
              type="number"
              placeholder="100"
              value={categoryForm.max_supply}
              onChange={handleCategoryChange}
            />
          </div>

          {success && <p className={styles.successMessage}>{success}</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}

          <button
            className={styles.submitButton}
            onClick={handleCreateCategory}
            disabled={loading || !categoryForm.event_id}
          >
            {loading ? 'Creating...' : 'Add Category'}
          </button>
        </div>
      )}
    </div>
  )
}