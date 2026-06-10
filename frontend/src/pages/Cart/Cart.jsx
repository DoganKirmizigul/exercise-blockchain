import { useNavigate } from 'react-router-dom'
import { Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import styles from './Cart.module.css'

export default function Cart() {
  const navigate = useNavigate()
  const { cartItems, removeTicket, decreaseTicket, addTicket, clearCart, totalEur, totalEth } = useCart()

  if (cartItems.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>Your Cart</h1>
        <div className={styles.empty}>
          <ShoppingCart size={48} color="var(--color-text-muted)" />
          <p className={styles.emptyText}>Your cart is empty.</p>
          <button className={styles.browseButton} onClick={() => navigate('/')}>
            Browse events
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Your Cart</h1>

      <div className={styles.items}>
        {cartItems.map(item => (
          <div key={item.category_id} className={styles.item}>
            <div className={styles.itemInfo}>
              <span className={styles.itemEvent}>{item.event_name}</span>
              <span className={styles.itemCategory}>{item.category_name}</span>
              <span className={styles.itemPrice}>
                {item.price_eur} EUR &middot; {item.price_eth} ETH per ticket
              </span>
            </div>

            <div className={styles.itemActions}>
              <div className={styles.quantity}>
                <button
                  className={styles.quantityButton}
                  onClick={() => decreaseTicket(item.category_id)}
                >
                  <Minus size={14} />
                </button>
                <span className={styles.quantityValue}>{item.quantity}</span>
                <button
                  className={styles.quantityButton}
                  onClick={() => addTicket(
                    { id: item.event_id, name: item.event_name },
                    {
                      id: item.category_id,
                      name: item.category_name,
                      price_eth: item.price_eth,
                      price_eur: item.price_eur,
                      max_supply: item.max_supply,
                      contract_address: item.contract_address
                    }
                  )}
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                className={styles.removeButton}
                onClick={() => removeTicket(item.category_id)}
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Subtotal (EUR)</span>
          <span className={styles.summaryValue}>{totalEur} EUR</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.summaryLabel}>Subtotal (ETH)</span>
          <span className={styles.summaryValue}>{totalEth} ETH</span>
        </div>
        <div className={styles.summaryRow}>
          <span className={styles.totalLabel}>Total</span>
          <span className={styles.totalValue}>{totalEur} EUR</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.checkoutEur}
          onClick={() => navigate('/checkout')}
        >
          Pay in EUR — {totalEur} EUR
        </button>
        <button
          className={styles.checkoutEth}
          onClick={() => {/* P4 will handle ETH checkout */}}
        >
          Pay in ETH — {totalEth} ETH
        </button>
        <button className={styles.clearButton} onClick={clearCart}>
          Clear cart
        </button>
      </div>
    </div>
  )
}