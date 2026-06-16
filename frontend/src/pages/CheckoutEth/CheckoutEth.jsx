import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Wallet } from 'lucide-react'
import { BrowserProvider, Contract, parseEther } from 'ethers'
import { useCart } from '../../context/CartContext'
import { recordEthPurchase } from '../../services/api'
import styles from './CheckoutEth.module.css'

const BUY_ABI = [
  {
    name: 'buy',
    type: 'function',
    inputs: [{ name: 'quantity', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256[]' }],
    stateMutability: 'payable',
  },
  {
    name: 'price',
    type: 'function',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
]

export default function CheckoutEth() {
  const navigate = useNavigate()
  const { cartItems, totalEth, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const handlePayEth = async () => {
    if (!window.ethereum) {
      setError('MetaMask not found. Please install MetaMask.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const provider = new BrowserProvider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = await provider.getSigner()
      const walletAddress = await signer.getAddress()

      for (const item of cartItems) {
        if (!item.contract_address) {
          throw new Error(`No contract deployed for "${item.category_name}"`)
        }

        const contract = new Contract(item.contract_address, BUY_ABI, signer)
        const priceWei = await contract.price()
        const totalWei = priceWei * BigInt(item.quantity)

        const tx = await contract.buy(item.quantity, { value: totalWei })
        const receipt = await tx.wait()

        // Extract token id from Transfer event
        const transferEvent = receipt.logs.find(
          log => log.topics[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
        )
        const tokenId = transferEvent
          ? parseInt(transferEvent.topics[3], 16)
          : 0

        await recordEthPurchase(item.event_id, item.category_id, {
          buyer_wallet_address: walletAddress,
          tx_hash: receipt.hash,
          token_id: tokenId,
        })
      }

      clearCart()
      setSuccess(true)
    } catch (err) {
      setError(err.message || 'Transaction failed.')
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
          <button className={styles.successButton} onClick={() => navigate('/my-tickets')}>
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

      <h1 className={styles.title}>Pay with ETH</h1>
      <p className={styles.subtitle}>Your MetaMask wallet will be used to complete the purchase.</p>

      <div className={styles.section}>
        <p className={styles.sectionTitle}>Order Summary</p>
        <div className={styles.orderItems}>
          {cartItems.map(item => (
            <div key={item.category_id} className={styles.orderItem}>
              <span className={styles.orderItemName}>
                {item.event_name} — {item.category_name} x{item.quantity}
              </span>
              <span className={styles.orderItemPrice}>
                {(parseFloat(item.price_eth) * item.quantity).toFixed(6)} ETH
              </span>
            </div>
          ))}
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>{totalEth} ETH</span>
          </div>
        </div>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button
        className={styles.submitButton}
        onClick={handlePayEth}
        disabled={loading || cartItems.length === 0}
      >
        <Wallet size={18} />
        {loading ? 'Waiting for MetaMask...' : `Pay ${totalEth} ETH with MetaMask`}
      </button>
    </div>
  )
}
