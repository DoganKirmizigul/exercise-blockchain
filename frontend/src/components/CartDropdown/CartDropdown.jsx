import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import styles from './CartDropdown.module.css'

export default function CartDropdown({ children }) {
  const { cartItems, totalEur } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef(null)
  const timeoutRef = useRef(null)

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    // Small delay before closing — gives time to move to the dropdown
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 200)
  }

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div
      className={styles.wrapper}
      ref={wrapperRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.header}>
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
          </div>

          {cartItems.length === 0 ? (
            <p className={styles.empty}>Your cart is empty.</p>
          ) : (
            <>
              <div className={styles.items}>
                {cartItems.map(item => (
                  <div key={item.category_id} className={styles.item}>
                    <div className={styles.itemLeft}>
                      <span className={styles.itemEvent}>{item.event_name}</span>
                      <span className={styles.itemCategory}>{item.category_name}</span>
                    </div>
                    <div className={styles.itemRight}>
                      <span className={styles.itemQuantity}>x{item.quantity}</span>
                      <span className={styles.itemPrice}>
                        {item.price_eur * item.quantity} EUR
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.footer}>
                <div className={styles.total}>
                  <span className={styles.totalLabel}>Total</span>
                  <span className={styles.totalValue}>{totalEur} EUR</span>
                </div>
                <Link
                  to="/cart"
                  className={styles.viewButton}
                  onClick={() => setIsOpen(false)}
                >
                  View cart
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}