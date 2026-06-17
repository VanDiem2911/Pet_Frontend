// API Utility — Pet's Home
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

// Helper to get or create a persistent sessionId for the cart
export const getSessionId = () => {
  let sessionId = localStorage.getItem('petshop_session_id')
  if (!sessionId) {
    sessionId = 'session_' + Math.random().toString(36).substring(2, 15)
    localStorage.setItem('petshop_session_id', sessionId)
  }
  return sessionId
}

// ── Products API ──
export const fetchProducts = async (filters = {}) => {
  const params = new URLSearchParams()
  if (filters.section) params.append('section', filters.section)
  if (filters.category) params.append('category', filters.category)
  if (filters.q) params.append('q', filters.q)

  const url = `${API_BASE_URL}/products?${params.toString()}`
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch products')
  return response.json()
}

export const fetchProductById = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`)
  if (!response.ok) throw new Error('Product not found')
  return response.json()
}

// ── Cart API ──
export const fetchCart = async () => {
  const sessionId = getSessionId()
  const response = await fetch(`${API_BASE_URL}/carts/${sessionId}`)
  if (!response.ok) throw new Error('Failed to fetch cart')
  return response.json()
}

export const addToCart = async (productId, quantity = 1) => {
  const sessionId = getSessionId()
  const response = await fetch(`${API_BASE_URL}/carts/${sessionId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, quantity }),
  })
  if (!response.ok) throw new Error('Failed to add item to cart')
  return response.json()
}

export const updateCartItemQuantity = async (productId, quantity) => {
  const sessionId = getSessionId()
  const response = await fetch(
    `${API_BASE_URL}/carts/${sessionId}/items/${productId}?quantity=${quantity}`,
    { method: 'PATCH' }
  )
  if (!response.ok) throw new Error('Failed to update item quantity')
  return response.json()
}

export const removeCartItem = async (productId) => {
  const sessionId = getSessionId()
  const response = await fetch(
    `${API_BASE_URL}/carts/${sessionId}/items/${productId}`,
    { method: 'DELETE' }
  )
  if (!response.ok) throw new Error('Failed to remove item from cart')
  return response.json()
}

// ── Orders API ──
export const placeOrder = async (orderDetails) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...orderDetails,
      sessionId: getSessionId(),
    }),
  })
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.message || 'Failed to place order')
  }
  return response.json()
}

export const trackOrdersByPhone = async (phone) => {
  const params = new URLSearchParams({ phone })
  const response = await fetch(`${API_BASE_URL}/orders/track?${params}`)
  if (!response.ok) throw new Error('Failed to track orders')
  return response.json()
}

// ── Newsletter API ──
export const subscribeNewsletter = async (email) => {
  const response = await fetch(`${API_BASE_URL}/newsletter`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!response.ok) throw new Error('Newsletter subscription failed')
  return response.json()
}

// ── Appointments API ──
export const bookAppointment = async (appointmentData) => {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(appointmentData),
  })
  if (!response.ok) throw new Error('Failed to book appointment')
  return response.json()
}

export const fetchBookedSlots = async (date, serviceType = 'grooming') => {
  if (!date) return []
  const params = new URLSearchParams({ date, serviceType })
  const response = await fetch(`${API_BASE_URL}/appointments/booked-slots?${params}`)
  if (!response.ok) throw new Error('Failed to fetch booked slots')
  return response.json() // returns string[]
}
