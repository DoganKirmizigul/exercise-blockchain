import { createContext, useContext, useState } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([])

  const addTicket = (event, category) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.category_id === category.id)

      if (existing) {
        if (existing.quantity >= category.max_supply) return prev
        return prev.map(item =>
          item.category_id === category.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [...prev, {
        category_id: category.id,
        event_id: event.id,
        event_name: event.name,
        category_name: category.name,
        price_eth: category.price_eth,
        price_eur: category.price_eur,
        max_supply: category.max_supply,
        contract_address: category.contract_address,
        quantity: 1
      }]
    })
  }

  // Decrease quantity, remove if quantity reaches 0
  const decreaseTicket = (category_id) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.category_id === category_id)
      if (!existing) return prev

      if (existing.quantity === 1) {
        return prev.filter(item => item.category_id !== category_id)
      }

      return prev.map(item =>
        item.category_id === category_id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    })
  }

  const removeTicket = (category_id) => {
    setCartItems(prev => prev.filter(item => item.category_id !== category_id))
  }

  const clearCart = () => setCartItems([])

  const totalEur = cartItems.reduce(
    (sum, item) => sum + item.price_eur * item.quantity, 0
  )

  const totalEth = cartItems.reduce(
    (sum, item) => sum + parseFloat(item.price_eth) * item.quantity, 0
  ).toFixed(4)

  return (
    <CartContext.Provider value={{
      cartItems,
      addTicket,
      decreaseTicket,
      removeTicket,
      clearCart,
      totalEur,
      totalEth
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}