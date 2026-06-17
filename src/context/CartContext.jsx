// CartContext — Pet's Home
import { createContext, useContext, useState, useEffect } from 'react'
import * as api from '../utils/api'

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const refreshCart = async () => {
    try {
      const data = await api.fetchCart()
      setCart(data)
      // Calculate total count
      const count = data.items ? data.items.reduce((acc, item) => acc + item.quantity, 0) : 0
      setCartCount(count)
    } catch (err) {
      console.error('Failed to load cart:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = async (productId, quantity = 1) => {
    try {
      const updatedCart = await api.addToCart(productId, quantity)
      setCart(updatedCart)
      const count = updatedCart.items ? updatedCart.items.reduce((acc, item) => acc + item.quantity, 0) : 0
      setCartCount(count)
      return true
    } catch (err) {
      console.error('Failed to add item to cart:', err)
      return false
    }
  }

  const handleUpdateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        return handleRemoveItem(productId)
      }
      const updatedCart = await api.updateCartItemQuantity(productId, quantity)
      setCart(updatedCart)
      const count = updatedCart.items ? updatedCart.items.reduce((acc, item) => acc + item.quantity, 0) : 0
      setCartCount(count)
    } catch (err) {
      console.error('Failed to update quantity:', err)
    }
  }

  const handleRemoveItem = async (productId) => {
    try {
      const updatedCart = await api.removeCartItem(productId)
      setCart(updatedCart)
      const count = updatedCart.items ? updatedCart.items.reduce((acc, item) => acc + item.quantity, 0) : 0
      setCartCount(count)
    } catch (err) {
      console.error('Failed to remove item:', err)
    }
  }

  useEffect(() => {
    refreshCart()
  }, [])

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        refreshCart,
        addToCart: handleAddToCart,
        updateQuantity: handleUpdateQuantity,
        removeItem: handleRemoveItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
