import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { trackOrdersByPhone } from '../utils/api'

const statusSteps = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']

const statusLabels = {
  vi: {
    PENDING: 'Chờ xử lý',
    PROCESSING: 'Đang xử lý',
    SHIPPED: 'Đang giao',
    DELIVERED: 'Đã giao',
    CANCELLED: 'Đã hủy',
  },
  en: {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipping',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
  },
}

const statusDescriptions = {
  vi: {
    PENDING: 'Đơn hàng đã được ghi nhận và đang chờ xác nhận.',
    PROCESSING: 'Pet Shop đang chuẩn bị sản phẩm cho đơn hàng.',
    SHIPPED: 'Đơn hàng đang trên đường giao tới bạn.',
    DELIVERED: 'Đơn hàng đã giao thành công.',
    CANCELLED: 'Đơn hàng đã bị hủy.',
  },
  en: {
    PENDING: 'Your order has been received and is waiting for confirmation.',
    PROCESSING: 'Pet Shop is preparing the products in your order.',
    SHIPPED: 'Your order is on the way.',
    DELIVERED: 'Your order has been delivered successfully.',
    CANCELLED: 'This order has been cancelled.',
  },
}

const trackingCopy = {
  vi: {
    title: 'Theo dõi đơn hàng',
    intro: 'Nhập số điện thoại đã dùng khi đặt hàng để xem trạng thái xử lý và giao hàng.',
    phoneLabel: 'Số điện thoại',
    phonePlaceholder: 'Ví dụ: 0901234567',
    loading: 'Đang tra cứu...',
    searchButton: 'Tra cứu đơn',
    help: 'Bạn có thể tìm lại đơn bằng số điện thoại đã dùng khi đặt hàng. Nếu cần hỗ trợ, hãy liên hệ Pet Shop qua hotline.',
    readyTitle: 'Sẵn sàng tra cứu',
    readyDesc: 'Các đơn hàng khớp với số điện thoại sẽ hiển thị tại đây.',
    emptyTitle: 'Không tìm thấy đơn hàng',
    emptyDesc: 'Kiểm tra lại số điện thoại hoặc đặt mua sản phẩm mới tại cửa hàng.',
    shopNow: 'Mua sắm ngay',
    requiredPhone: 'Vui lòng nhập số điện thoại đặt hàng.',
    searchFailed: 'Không thể tra cứu đơn hàng lúc này. Vui lòng thử lại sau.',
    orderPrefix: 'Đơn',
    updatingTime: 'Đang cập nhật thời gian',
    updatingOrder: 'Đơn hàng đang được cập nhật.',
    totalPayment: 'Tổng thanh toán',
    receiver: 'Người nhận',
    phone: 'Số điện thoại',
    email: 'Email',
    address: 'Địa chỉ',
    progress: 'Tiến trình đơn hàng',
    cancelledNotice: 'Đơn hàng này đã bị hủy.',
    products: 'Sản phẩm',
    productFallback: 'Sản phẩm',
    brandFallback: 'Pet Shop',
    updating: 'Đang cập nhật',
  },
  en: {
    title: 'Track Order',
    intro: 'Enter the phone number used at checkout to view processing and delivery status.',
    phoneLabel: 'Phone number',
    phonePlaceholder: 'Example: 0901234567',
    loading: 'Searching...',
    searchButton: 'Track order',
    help: 'You can look up your order with the phone number used at checkout. For support, contact Pet Shop via hotline.',
    readyTitle: 'Ready to track',
    readyDesc: 'Orders matching the phone number will appear here.',
    emptyTitle: 'No orders found',
    emptyDesc: 'Check the phone number again or place a new order in the shop.',
    shopNow: 'Shop now',
    requiredPhone: 'Please enter the phone number used for the order.',
    searchFailed: 'Unable to track orders right now. Please try again later.',
    orderPrefix: 'Order',
    updatingTime: 'Updating time',
    updatingOrder: 'Order status is being updated.',
    totalPayment: 'Total payment',
    receiver: 'Receiver',
    phone: 'Phone',
    email: 'Email',
    address: 'Address',
    progress: 'Order progress',
    cancelledNotice: 'This order has been cancelled.',
    products: 'Products',
    productFallback: 'Product',
    brandFallback: 'Pet Shop',
    updating: 'Updating',
  },
}

const OrderTracking = () => {
  const { lang } = useLanguage()
  const copy = trackingCopy[lang] || trackingCopy.vi
  const labels = statusLabels[lang] || statusLabels.vi
  const descriptions = statusDescriptions[lang] || statusDescriptions.vi
  const locale = lang === 'en' ? 'en-US' : 'vi-VN'
  const [searchParams, setSearchParams] = useSearchParams()
  const phoneFromUrl = searchParams.get('phone') || ''
  const [phone, setPhone] = useState(phoneFromUrl)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(Boolean(phoneFromUrl))
  const [error, setError] = useState('')

  const normalizedPhone = useMemo(() => phone.trim(), [phone])

  const searchOrders = async (targetPhone = normalizedPhone) => {
    if (!targetPhone) {
      setError(copy.requiredPhone)
      setOrders([])
      setSearched(false)
      return
    }

    setLoading(true)
    setError('')
    setSearched(true)
    setSearchParams({ phone: targetPhone })

    try {
      setOrders(await trackOrdersByPhone(targetPhone))
    } catch (err) {
      console.error(err)
      setError(copy.searchFailed)
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (phoneFromUrl) {
      const timer = window.setTimeout(() => searchOrders(phoneFromUrl), 0)
      return () => window.clearTimeout(timer)
    }
    return undefined
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = e => {
    e.preventDefault()
    searchOrders()
  }

  return (
    <section className="bg-bg-light border-t border-border-light">
      <div className="container-site py-10 sm:py-14">
        <div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">
          <aside className="bg-white border border-border-light rounded-card shadow-low p-6 lg:sticky lg:top-24">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              <TruckIcon size={22} />
            </div>
            <h1 className="font-heading font-bold text-brown-dark text-2xl tracking-tight">
              {copy.title}
            </h1>
            <p className="text-xs text-muted leading-relaxed mt-2">
              {copy.intro}
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <div className="space-y-1.5">
                <label htmlFor="tracking-phone" className="block text-[11px] font-bold text-brown-dark uppercase tracking-wider">
                  {copy.phoneLabel}
                </label>
                <input
                  id="tracking-phone"
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder={copy.phonePlaceholder}
                  className="w-full bg-bg-light border border-border-light rounded-btn px-4 py-2.5 text-xs text-brown-dark placeholder-muted outline-none focus:border-primary/40 focus:bg-white transition-all"
                />
              </div>
              {error && <p className="text-[11px] text-primary">{error}</p>}
              <button type="submit" disabled={loading} className="w-full btn-accent rounded-btn py-2.5 text-xs font-semibold disabled:opacity-60">
                {loading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {copy.loading}
                  </>
                ) : (
                  <>
                    {copy.searchButton}
                    <SearchIcon size={14} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 rounded-card bg-bg-light border border-border-light p-4 text-xs text-text-light leading-relaxed">
              {copy.help}
            </div>
          </aside>

          <main className="space-y-4">
            {!searched && (
              <EmptyState title={copy.readyTitle} desc={copy.readyDesc} />
            )}

            {searched && !loading && orders.length === 0 && (
              <EmptyState
                title={copy.emptyTitle}
                desc={copy.emptyDesc}
                action={<Link to="/shop" className="btn-outline rounded-btn px-5 py-2 text-xs font-semibold">{copy.shopNow}</Link>}
              />
            )}

            {orders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                copy={copy}
                labels={labels}
                descriptions={descriptions}
                locale={locale}
              />
            ))}
          </main>
        </div>
      </div>
    </section>
  )
}

const OrderCard = ({ order, copy, labels, descriptions, locale }) => {
  const isCancelled = order.status === 'CANCELLED'
  const currentStep = Math.max(0, statusSteps.indexOf(order.status))
  const items = order.items || []

  return (
    <article className="bg-white border border-border-light rounded-card shadow-low overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-border-light flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-heading font-bold text-brown-dark text-lg">
              {copy.orderPrefix} #{shortId(order.id)}
            </h2>
            <StatusBadge status={order.status} labels={labels} />
          </div>
          <p className="text-xs text-muted mt-1">
            {order.createdAt ? new Date(order.createdAt).toLocaleString(locale) : copy.updatingTime}
          </p>
          <p className="text-xs text-text-light mt-2">
            {descriptions[order.status] || copy.updatingOrder}
          </p>
        </div>
        <div className="sm:text-right">
          <p className="text-[11px] text-muted font-semibold uppercase tracking-wider">{copy.totalPayment}</p>
          <p className="text-xl font-bold text-primary">{Number(order.total || 0).toLocaleString('vi-VN')}d</p>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        <div className="rounded-card bg-bg-light border border-border-light p-4">
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <InfoLine label={copy.receiver} value={order.customerName} emptyText={copy.updating} />
            <InfoLine label={copy.phone} value={order.phone} emptyText={copy.updating} />
            <InfoLine label={copy.email} value={order.email} emptyText={copy.updating} />
            <InfoLine label={copy.address} value={order.address} emptyText={copy.updating} />
          </div>
        </div>

        <div>
          <h3 className="font-bold text-brown-dark text-sm mb-3">{copy.progress}</h3>
          {isCancelled ? (
            <div className="rounded-card border border-red-200 bg-red-50 text-primary px-4 py-3 text-xs font-semibold">
              {copy.cancelledNotice}
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-2">
              {statusSteps.map((step, index) => {
                const active = index <= currentStep
                return (
                  <div key={step} className="min-w-0">
                    <div className={`h-1.5 rounded-full ${active ? 'bg-primary' : 'bg-border-light'}`} />
                    <p className={`mt-2 text-[10px] sm:text-[11px] font-semibold ${active ? 'text-primary' : 'text-muted'}`}>
                      {labels[step]}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-bold text-brown-dark text-sm mb-3">{copy.products}</h3>
          <div className="divide-y divide-border-light rounded-card border border-border-light overflow-hidden">
            {items.map((item, index) => (
              <div key={`${item.productId}-${index}`} className="flex items-center justify-between gap-4 p-3 bg-white">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-10 h-10 rounded-full bg-bg-light flex items-center justify-center text-xl shrink-0">
                    {item.emoji || '📦'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-brown-dark line-clamp-1">{item.name || `${copy.productFallback} #${item.productId}`}</p>
                    <p className="text-[11px] text-muted">{item.brand || copy.brandFallback} · x{item.quantity}</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary shrink-0">
                  {Number((item.price || 0) * item.quantity).toLocaleString('vi-VN')}d
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}

const InfoLine = ({ label, value, emptyText }) => (
  <div>
    <p className="text-[10px] text-muted font-bold uppercase tracking-wider">{label}</p>
    <p className="text-brown-dark font-semibold mt-0.5">{value || emptyText}</p>
  </div>
)

const EmptyState = ({ title, desc, action }) => (
  <div className="bg-white border border-border-light rounded-card shadow-low p-8 sm:p-10 text-center">
    <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
      <ReceiptIcon size={24} />
    </div>
    <h2 className="font-heading font-bold text-brown-dark text-lg">{title}</h2>
    <p className="text-xs text-muted mt-2 max-w-md mx-auto leading-relaxed">{desc}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
)

const StatusBadge = ({ status, labels }) => {
  const cls = {
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    PROCESSING: 'bg-blue-50 text-blue-700 border-blue-200',
    SHIPPED: 'bg-violet-50 text-violet-700 border-violet-200',
    DELIVERED: 'bg-accent/10 text-accent border-accent/20',
    CANCELLED: 'bg-red-50 text-primary border-red-200',
  }[status] || 'bg-bg-light text-text-light border-border-light'

  return (
    <span className={`rounded-pill border px-2.5 py-1 text-[11px] font-bold ${cls}`}>
      {labels[status] || status}
    </span>
  )
}

const shortId = id => id ? id.slice(-8).toUpperCase() : 'ORDER'

const Svg = ({ size = 16, children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)

const TruckIcon = ({ size }) => <Svg size={size}><path d="M10 17h4V5H2v12h3" /><path d="M14 17h1" /><path d="M19 17h3v-6l-3-4h-5" /><circle cx="7.5" cy="17.5" r="2.5" /><circle cx="17.5" cy="17.5" r="2.5" /></Svg>
const SearchIcon = ({ size }) => <Svg size={size}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></Svg>
const ReceiptIcon = ({ size }) => <Svg size={size}><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2Z" /><path d="M8 7h8" /><path d="M8 12h8" /><path d="M8 17h5" /></Svg>

export default OrderTracking
