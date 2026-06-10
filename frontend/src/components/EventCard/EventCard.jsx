import { useNavigate } from 'react-router-dom'
import styles from './EventCard.module.css'

export default function EventCard({ event }) {
  const navigate = useNavigate()

  const categories = event.ticket_categories || event.ticketCategories || []
  const minPrice = categories.length > 0
    ? Math.min(...categories.map(c => c.price_eur))
    : 0
  const categoriesCount = categories.length

  const formattedDate = new Date(event.event_date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className={styles.card} onClick={() => navigate(`/events/${event.id}`)}>
      <div className={styles.banner}>
        <span className={styles.bannerLetter}>{event.name.charAt(0)}</span>
        <div className={styles.bannerOverlay} />
        <span className={styles.categoryBadge}>
          {categoriesCount} {categoriesCount > 1 ? 'categories' : 'category'}
        </span>
      </div>

      <div className={styles.content}>
        <h2 className={styles.name}>{event.name}</h2>
        <p className={styles.description}>{event.description}</p>

        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Date</span>
            <span className={styles.metaValue}>{formattedDate}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>Location</span>
            <span className={styles.metaValue}>{event.location}</span>
          </div>
          <div className={styles.metaItem}>
            <span className={styles.metaLabel}>From</span>
            <span className={styles.metaValue}>
              {categories.length > 0 ? `${minPrice} EUR` : 'No tickets yet'}
            </span>
          </div>
        </div>

        <button className={styles.button}>View tickets</button>
      </div>
    </div>
  )
}