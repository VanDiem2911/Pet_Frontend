const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const CART_SESSION_KEY = 'pet_home_cart_session'

const ensureCartSessionId = () => {
  let sessionId = localStorage.getItem(CART_SESSION_KEY)
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem(CART_SESSION_KEY, sessionId)
  }
  return sessionId
}

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.message || 'Không thể kết nối máy chủ')
  }

  if (response.status === 204) return null
  return response.json()
}

const normalizeProduct = product => ({
  ...product,
  oldPrice: product.oldPrice ?? null,
  tab: product.tab || product.category,
})

export const getProducts = async params => {
  const query = new URLSearchParams(
    Object.entries(params || {}).filter(([, value]) => value !== undefined && value !== null && value !== '')
  )
  const products = await request(`/products${query.size ? `?${query}` : ''}`)
  return products.map(normalizeProduct)
}

export const addCartItem = async (productId, quantity = 1) => {
  const sessionId = ensureCartSessionId()
  return request(`/carts/${sessionId}/items`, {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
  })
}

export const subscribeNewsletter = async email => {
  return request('/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export { ensureCartSessionId }
