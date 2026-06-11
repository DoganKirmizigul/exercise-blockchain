import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, CreditCard } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { payWithEur } from '../../services/api'
import styles from './Checkout.module.css'


const INITIAL_FORM = {
  cardNumber: '',
  cardName: '',
  expiry: '',
  cvv: '',
  walletAddress: '',
}

const INITIAL_ERRORS = {
  cardNumber: '',
  cardName: '',
  expiry: '',
  cvv: '',
  walletAddress: '',
}

export default function Checkout() {
  const navigate = useNavigate()
  const { cartItems, totalEur, clearCart } = useCart()

  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState(INITIAL_ERRORS)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = { ...INITIAL_ERRORS }
    let isValid = true

    if (form.cardNumber.replace(/\s/g, '').length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits'
      isValid = false
    }
    if (!form.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required'
      isValid = false
    }
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) {
      newErrors.expiry = 'Format must be MM/YY'
      isValid = false
    }
    if (form.cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3 or 4 digits'
      isValid = false
    }
    if (!form.walletAddress.startsWith('0x') || form.walletAddress.length !== 42) {
      newErrors.walletAddress = 'Invalid Ethereum address'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async () => {
    if (!validate()) return

    setLoading(true)
    try {
      for (const item of cartItems) {
        await payWithEur(item.event_id, item.category_id, {
          buyer_wallet_address: form.walletAddress,
          card_number: form.cardNumber,
          expiry: form.expiry,
          cvv: form.cvv,
        })
      }
      clearCart()
      setSuccess(true)
    } catch (err) {
      alert('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  if (success) {
    return (
      <div className={styles.page}>
        <div className={styles.success}>
          <CheckCircle size={64} color="var(--color-success)" />
          <h2 className={styles.successTitle}>Payment successful!</h2>
          <p className={styles.successText}>
            Your tickets have been minted to your wallet.
          </p>
          <button
            className={styles.successButton}
            onClick={() => navigate('/my-tickets')}
          >
            View my tickets
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <button className={styles.backButton} onClick={() => navigate('/cart')}>
        <ArrowLeft size={16} />
        Back to cart
      </button>

      <h1 className={styles.title}>Checkout</h1>
      <p className={styles.subtitle}>Complete your purchase below.</p>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Order Summary</p>
        <div className={styles.orderItems}>
          {cartItems.map(item => (
            <div key={item.category_id} className={styles.orderItem}>
              <span className={styles.orderItemName}>
                {item.event_name} — {item.category_name} x{item.quantity}
              </span>
              <span className={styles.orderItemPrice}>
                {item.price_eur * item.quantity} EUR
              </span>
            </div>
          ))}
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>{totalEur} EUR</span>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Wallet Address</p>
        <div className={styles.field}>
          <label className={styles.label}>
            Ethereum wallet address (your tickets will be sent here)
          </label>
          <input
            className={`${styles.input} ${errors.walletAddress ? styles.inputError : ''}`}
            name="walletAddress"
            placeholder="0x..."
            value={form.walletAddress}
            onChange={handleChange}
          />
          {errors.walletAddress && (
            <span className={styles.errorText}>{errors.walletAddress}</span>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>
          <CreditCard size={15} />
          Card Details
        </p>

        <div className={styles.field}>
          <label className={styles.label}>Card number</label>
          <input
            className={`${styles.input} ${errors.cardNumber ? styles.inputError : ''}`}
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            maxLength={19}
            value={form.cardNumber}
            onChange={handleChange}
          />
          {errors.cardNumber && (
            <span className={styles.errorText}>{errors.cardNumber}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Cardholder name</label>
          <input
            className={`${styles.input} ${errors.cardName ? styles.inputError : ''}`}
            name="cardName"
            placeholder="Jane Doe"
            value={form.cardName}
            onChange={handleChange}
          />
          {errors.cardName && (
            <span className={styles.errorText}>{errors.cardName}</span>
          )}
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Expiry date</label>
            <input
              className={`${styles.input} ${errors.expiry ? styles.inputError : ''}`}
              name="expiry"
              placeholder="MM/YY"
              maxLength={5}
              value={form.expiry}
              onChange={handleChange}
            />
            {errors.expiry && (
              <span className={styles.errorText}>{errors.expiry}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>CVV</label>
            <input
              className={`${styles.input} ${errors.cvv ? styles.inputError : ''}`}
              name="cvv"
              placeholder="123"
              maxLength={4}
              value={form.cvv}
              onChange={handleChange}
            />
            {errors.cvv && (
              <span className={styles.errorText}>{errors.cvv}</span>
            )}
          </div>
        </div>
      </div>

      <button
        className={styles.submitButton}
        onClick={handleSubmit}
        disabled={loading || cartItems.length === 0}
      >
        {loading ? 'Processing...' : `Pay ${totalEur} EUR`}
      </button>
    </div>
  )
}