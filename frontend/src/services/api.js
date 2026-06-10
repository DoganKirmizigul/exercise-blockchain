import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000'
})

// Events
export const getEvents = () => api.get('/events')
export const getEvent = (id) => api.get(`/events/${id}`)
export const createEvent = (data) => api.post('/events', data)

// Categories
export const createCategory = (eventId, data) => 
  api.post(`/events/${eventId}/categories`, data)

// Purchases — EUR (fake payment, API mints NFT)
export const payWithEur = (eventId, categoryId, data) =>
  api.post(`/events/${eventId}/categories/${categoryId}/pay/eur`, data)

// Purchases — ETH (record on-chain purchase)
export const recordEthPurchase = (eventId, categoryId, data) =>
  api.post(`/events/${eventId}/categories/${categoryId}/pay/eth`, data)

// My tickets by wallet address
export const getTicketsByWallet = (address) =>
  api.get(`/wallets/${address}/tickets`)

export default api