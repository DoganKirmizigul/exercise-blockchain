import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Wallet, Ticket } from 'lucide-react'
import { getTicketsByWallet } from '../../services/api'
import styles from './MyTickets.module.css'

export default function MyTickets() {
  const navigate = useNavigate()

  // Will be replaced by useAccount() from Wagmi once P4 sets it up
  const walletAddress = null

  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!walletAddress) return

    const fetchTickets = async () => {
      setLoading(true)
      try {
        const response = await getTicketsByWallet(walletAddress)
        setTickets(response.data)
      } catch (err) {
        setError('Failed to fetch tickets.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [walletAddress])

  if (!walletAddress) {
    return (
      <div className={styles.page}>
        <div className={styles.notConnected}>
          <div className={styles.notConnectedIcon}>
            <Wallet size={28} />
          </div>
          <h2 className={styles.notConnectedTitle}>Connect your wallet</h2>
          <p className={styles.notConnectedText}>
            You need to connect your Ethereum wallet to view your tickets.
          </p>
          {/* P4 will replace this button with Wagmi connect */}
          <button className={styles.connectButton}>
            Connect Wallet
          </button>
        </div>
      </div>
    )
  }

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

  if (tickets.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>My Tickets</h1>
        <div className={styles.empty}>
          <Ticket size={48} color="var(--color-text-muted)" />
          <p className={styles.emptyText}>You don't own any tickets yet.</p>
          <button className={styles.browseButton} onClick={() => navigate('/')}>
            Browse events
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>My Tickets</h1>
      <p className={styles.subtitle}>
        {tickets.length} ticket{tickets.length > 1 ? 's' : ''} in your wallet
      </p>

      <div className={styles.grid}>
        {tickets.map(ticket => (
          <div key={ticket.token_id} className={styles.ticketCard}>
            <div className={styles.ticketBanner}>
              <span className={styles.ticketBannerLetter}>
                {ticket.event_name.charAt(0)}
              </span>
              <span className={styles.tokenBadge}>#{ticket.token_id}</span>
            </div>

            <div className={styles.ticketContent}>
              <p className={styles.ticketEvent}>{ticket.event_name}</p>
              <p className={styles.ticketCategory}>{ticket.category_name}</p>

              <div className={styles.ticketMeta}>
                <div className={styles.ticketMetaItem}>
                  <span className={styles.ticketMetaLabel}>Contract</span>
                  <span className={styles.ticketMetaValue}>
                    {ticket.contract_address}
                  </span>
                </div>
                <div className={styles.ticketMetaItem}>
                  <span className={styles.ticketMetaLabel}>Date</span>
                  <span className={styles.ticketMetaValue}>
                    {new Date(ticket.created_at).toLocaleDateString('en-GB')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}