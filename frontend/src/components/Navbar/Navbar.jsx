import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Ticket, Moon, Sun, Calendar, Settings } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useTheme } from '../../context/ThemeContext'
import CartDropdown from '../CartDropdown/CartDropdown'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { cartItems } = useCart()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  const totalTickets = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const isActive = (path) => location.pathname === path

  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.logo}>
        NFT Tickets
      </Link>

      <div className={styles.links}>
        <Link
          to="/"
          className={`${styles.link} ${isActive('/') ? styles.linkActive : ''}`}
        >
          <Calendar size={15} />
          Events
        </Link>
        <Link
          to="/my-tickets"
          className={`${styles.link} ${isActive('/my-tickets') ? styles.linkActive : ''}`}
        >
          <Ticket size={15} />
          My Tickets
        </Link>

        <Link
          to="/admin"
          className={`${styles.link} ${isActive('/admin') ? styles.linkActive : ''}`}
        >
          <Settings size={15} />
          Admin
        </Link>

        <button className={styles.themeToggle} onClick={toggleTheme}>
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>

        <CartDropdown>
          <Link to="/cart" className={styles.cartButton}>
            <ShoppingCart size={16} />
            Cart
            {totalTickets > 0 && (
              <span className={styles.badge}>{totalTickets}</span>
            )}
          </Link>
        </CartDropdown>
      </div>
    </nav>
  )
}