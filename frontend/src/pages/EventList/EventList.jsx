import { useState, useEffect } from 'react'
import { getEvents } from '../../services/api'
import EventCard from '../../components/EventCard/EventCard'
import styles from './EventList.module.css'

export default function EventList() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getEvents()
        setEvents(response.data)
      } catch (err) {
        setError('Failed to load events. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (loading) return (
    <div className={styles.centered}>
      <div className={styles.spinner} />
    </div>
  )

  if (error) return (
    <div className={styles.centered}>
      <p className={styles.error}>{error}</p>
    </div>
  )

  if (events.length === 0) return (
    <div className={styles.centered}>
      <p className={styles.empty}>No events available.</p>
    </div>
  )

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Upcoming Events</h1>
        <p className={styles.subtitle}>{events.length} events available</p>
      </div>

      <div className={styles.grid}>
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  )
}