// Cart Page — Pet's Home
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { placeOrder } from '../utils/api'

const Cart = () => {
  const { cart, loading, updateQuantity, removeItem, refreshCart } = useCart()
  const { t } = useLanguage()
  const [checkoutStep, setCheckoutStep] = useState(false) // toggle checkout details form
  const [formData, setFormData] = useState({ customerName: '', email: '', phone: '', address: '' })
  const [ordering, setOrdering] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(null)

  if (loading) {
    return (
      <div className="container-site py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-xs text-muted mt-2">{t('loadingProducts')}</p>
      </div>
    )
  }

  const items = cart?.items || []

  // Calculates subtotal
  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  
  // Shipping: Free for orders above 199K, otherwise 30K
  const shippingThreshold = 199000
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 30000
  
  const total = subtotal + shippingCost

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault()
    setOrdering(true)
    try {
      const order = await placeOrder({
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        items: items
      })
      setOrderSuccess(order)
      // Reset cart locally after order succeeds
      await refreshCart()
    } catch (err) {
      console.error(err)
      alert('Failed to place order. Please try again.')
    } finally {
      setOrdering(false)
    }
  }

  if (orderSuccess) {
    return (
      <div className="container-site py-20 max-w-md mx-auto text-center space-y-4">
        <div className="w-16 h-16 bg-[#eefcf3] border border-[#c6f4d6] text-accent rounded-full flex items-center justify-center text-3xl mx-auto shadow-sm animate-pulse-soft">
          ✓
        </div>
        <div className="space-y-2">
          <h2 className="font-heading font-bold text-brown-dark text-xl sm:text-2xl">
            {t('orderPlacedSuccess')}
          </h2>
          <p className="text-xs text-muted leading-relaxed">
            {t('orderSuccessDesc')} <span className="font-mono bg-bg-light px-2 py-0.5 border border-border-light rounded text-xs font-semibold text-primary">{orderSuccess.id || 'ORDER_SUCCESS'}</span>.
          </p>
          <p className="text-[11px] text-muted">
            {t('orderEmailNotify')}
          </p>
        </div>
        <div className="pt-2">
          <Link
            to={`/track-order?phone=${encodeURIComponent(formData.phone)}`}
            className="inline-block px-8 py-2.5 bg-[#111111] hover:bg-primary text-white text-xs font-semibold rounded-pill transition-colors shadow-sm"
          >
            Theo dõi đơn hàng
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="container-site py-20 text-center max-w-sm mx-auto space-y-4">
        <span className="mx-auto flex h-16 w-16 items-center justify-center text-brown-dark select-none">
          <CartIcon size={54} />
        </span>
        <div className="space-y-1">
          <h2 className="font-heading font-bold text-brown-dark text-lg sm:text-xl">
            {t('cartEmpty')}
          </h2>
          <p className="text-xs text-muted">
            {t('cartEmptyDesc')}
          </p>
        </div>
        <div className="pt-2">
          <a
            href="#"
            className="inline-block px-8 py-2.5 bg-primary hover:bg-primary text-white text-xs font-semibold rounded-pill transition-all duration-280 shadow-sm"
          >
            {t('shopProductsBtn')}
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="container-site py-10">
      <h2 className="font-heading font-bold text-brown-dark text-xl sm:text-2xl tracking-tight mb-8">
        {t('shoppingCart')}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Cart list / Checkout Form Column */}
        <div className="lg:col-span-8 space-y-6">
          {!checkoutStep ? (
            /* Item list view */
            <div className="border border-border-light rounded-card overflow-hidden bg-white shadow-sm">
              <div className="divide-y divide-[#eeeeee]">
                {items.map(item => (
                  <div
                    key={item.productId}
                    className="flex flex-col sm:flex-row items-center gap-4 p-5 hover:bg-bg-light/30 transition-colors"
                  >
                    {/* Product image (or Emoji representation if missing) */}
                    <div className="w-16 h-16 rounded-card bg-bg-light flex items-center justify-center shrink-0 select-none shadow-sm">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-full h-full object-contain p-1" />
                      ) : (
                        <span className="text-4xl">{item.emoji || '📦'}</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <h3 className="font-heading font-bold text-brown-dark text-xs sm:text-sm leading-snug line-clamp-1">
                        {item.name}
                      </h3>
                      <span className="block text-[10px] text-muted uppercase tracking-wider font-semibold">
                        Brand: {item.brand || 'PetShop'}
                      </span>
                      <span className="block text-xs font-semibold text-primary">
                        {item.price.toLocaleString('vi-VN')}đ
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 border border-border-light rounded-pill px-2.5 py-1 bg-white shadow-sm">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="text-muted hover:text-primary px-1.5 text-xs font-bold transition-colors"
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="text-xs text-brown-dark font-bold w-6 text-center tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="text-muted hover:text-primary px-1.5 text-xs font-bold transition-colors"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    {/* Total Price & Delete button */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 sm:gap-1 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 shrink-0">
                      <span className="text-xs font-bold text-brown-dark">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </span>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-[10px] font-semibold text-primary hover:text-brown-dark transition-colors flex items-center gap-0.5"
                        aria-label="Delete item"
                      >
                        {t('cancel')}
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Checkout user details form */
            <div className="bg-white border border-[#eeeeee] p-6 sm:p-8 rounded-card shadow-sm">
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <div className="space-y-1 border-b border-border-light pb-2">
                  <h3 className="font-heading font-bold text-brown-dark text-base sm:text-lg">
                    {t('deliveryDetails')}
                  </h3>
                  <p className="text-[11px] text-muted">
                    {t('checkoutDesc')}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="checkout-name" className="block text-[11px] font-semibold text-brown-dark">{t('yourName')}</label>
                    <input
                      id="checkout-name"
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.customerName}
                      onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                      className="w-full bg-[#f8f9fa] border border-[#eeeeee] rounded-pill px-4 py-2.5 text-xs outline-none focus:border-primary focus:bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="checkout-phone" className="block text-[11px] font-semibold text-brown-dark">{t('phoneNum')}</label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      required
                      placeholder="e.g. 0901234567"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#f8f9fa] border border-[#eeeeee] rounded-pill px-4 py-2.5 text-xs outline-none focus:border-primary focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="checkout-email" className="block text-[11px] font-semibold text-brown-dark">{t('emailTitle')}</label>
                  <input
                    id="checkout-email"
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#f8f9fa] border border-[#eeeeee] rounded-pill px-4 py-2.5 text-xs outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="checkout-addr" className="block text-[11px] font-semibold text-brown-dark">{t('deliveryAddr')}</label>
                  <input
                    id="checkout-addr"
                    type="text"
                    required
                    placeholder="e.g. 45 Nguyen Trai, Ward 2, District 5, HCMC"
                    value={formData.address}
                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                    className="w-full bg-[#f8f9fa] border border-[#eeeeee] rounded-pill px-4 py-2.5 text-xs outline-none focus:border-primary focus:bg-white"
                  />
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(false)}
                    className="flex-1 py-2.5 rounded-pill border border-border-light text-xs font-semibold text-brown-dark hover:bg-bg-light transition-colors"
                  >
                    {t('backToItems')}
                  </button>
                  <button
                    type="submit"
                    disabled={ordering}
                    className="flex-1 py-2.5 rounded-pill bg-[#111111] hover:bg-primary text-white text-xs font-semibold transition-colors disabled:bg-muted"
                  >
                    {ordering ? t('processing') : t('placeOrder')}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Pricing Summary Column */}
        <div className="lg:col-span-4 bg-[#f8f9fa] border border-border-light p-6 rounded-card space-y-4 shadow-sm">
          <h3 className="font-heading font-bold text-brown-dark text-sm border-b border-border-light pb-2">
            {t('orderSummary')}
          </h3>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-muted">
              <span>Subtotal:</span>
              <span className="font-semibold text-brown-dark">{subtotal.toLocaleString('vi-VN')}đ</span>
            </div>
            
            <div className="flex items-center justify-between text-muted">
              <span>{t('shippingCost')}:</span>
              <span className="font-semibold text-brown-dark">
                {shippingCost === 0 ? t('free') : `${shippingCost.toLocaleString('vi-VN')}đ`}
              </span>
            </div>

            {shippingCost > 0 && (
              <p className="text-[10px] text-muted italic">
                Tip: {t('shippingTip1')} <span className="font-bold text-primary">{(shippingThreshold - subtotal).toLocaleString('vi-VN')}đ</span> {t('shippingTip2')}
              </p>
            )}
          </div>

          <div className="h-px bg-[#eeeeee] my-2" />

          <div className="flex items-center justify-between text-brown-dark text-sm sm:text-base font-bold">
            <span>{t('total')}:</span>
            <span className="text-primary">{total.toLocaleString('vi-VN')}đ</span>
          </div>

          {!checkoutStep && (
            <div className="pt-2">
              <button
                onClick={() => setCheckoutStep(true)}
                className="w-full py-3 bg-[#111111] hover:bg-primary text-white text-xs font-semibold rounded-pill transition-colors shadow-md hover:shadow-red"
              >
                {t('placeOrder')}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

const CartIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
  </svg>
)

export default Cart


