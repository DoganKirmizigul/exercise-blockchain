import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, User, ShoppingCart } from 'lucide-react'
import { getEvent } from '../../services/api'
import { useCart } from '../../context/CartContext'
import styles from './EventDetail.module.css'

export default function EventDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addTicket, cartItems } = useCart()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getEvent(id)
        setEvent(response.data)
      } catch (err) {
        setError('Event not found.')
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  const getQuantityInCart = (categoryId) => {
    const item = cartItems.find(i => i.category_id === categoryId)
    return item ? item.quantity : 0
  }

  const formattedDate = (date) => new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

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

  const categories = event.ticket_categories || event.ticketCategories || []

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate('/')}>
        <ArrowLeft size={16} />
        Back to events
      </button>

      <div className={styles.header}>
        <h1 className={styles.title}>{event.name}</h1>
        <div className={styles.meta}>
          <div className={styles.metaItem}>
            <Calendar size={14} />
            <div>
              <span className={styles.metaLabel}>Date</span>
              <span className={styles.metaValue}>{formattedDate(event.event_date)}</span>
            </div>
          </div>
          <div className={styles.metaItem}>
            <MapPin size={14} />
            <div>
              <span className={styles.metaLabel}>Location</span>
              <span className={styles.metaValue}>{event.location}</span>
            </div>
          </div>
          <div className={styles.metaItem}>
            <User size={14} />
            <div>
              <span className={styles.metaLabel}>Organizer</span>
              <span className={styles.metaValue}>
                {event.seller_address.slice(0, 6)}...{event.seller_address.slice(-4)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <p className={styles.description}>{event.description}</p>

      <h2 className={styles.sectionTitle}>Ticket Categories</h2>

      {categories.length === 0 ? (
        <p style={{ color: 'var(--color-text-muted)' }}>No ticket categories available yet.</p>
      ) : (
        <div className={styles.categories}>
          {categories.map(category => {
            const quantityInCart = getQuantityInCart(category.id)
            const remainingStock = category.max_supply - quantityInCart
            const isLowStock = remainingStock <= 5
            const isSoldOut = remainingStock <= 0

            return (
              <div key={category.id} className={styles.categoryCard}>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryName}>{category.name}</span>
                  <div className={styles.categoryPrices}>
                    <span className={styles.priceEur}>{category.price_eur} EUR</span>
                    <span className={styles.priceEth}>{category.price_eth} ETH</span>
                  </div>
                  <span className={`${styles.categoryStock} ${isLowStock ? styles.stockLow : ''}`}>
                    {isSoldOut ? 'Sold out' : `${remainingStock} tickets remaining`}
                  </span>
                </div>

                <button
                  className={styles.addButton}
                  onClick={() => addTicket(event, category)}
                  disabled={isSoldOut}
                >
                  <ShoppingCart size={16} />
                  {isSoldOut ? 'Sold out' : quantityInCart > 0 ? `Buy (${quantityInCart})` : 'Add to cart'}
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}