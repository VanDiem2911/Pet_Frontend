// ProductGrid — Reusable product grid section
import { useState } from 'react'
import { useCart } from '../../context/CartContext'
import { useLanguage } from '../../context/LanguageContext'

// Shared star rating
const Stars = ({ rating = 5 }) => (
  <div className="flex gap-0.5">
    {[1,2,3,4,5].map(i => (
      <svg key={i} width="10" height="10" viewBox="0 0 24 24"
        fill={i <= rating ? '#f5a623' : '#e2e2e2'}
        stroke={i <= rating ? '#f5a623' : '#e2e2e2'} strokeWidth="1">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ))}
  </div>
)

// Single product card
const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { lang } = useLanguage()
  const [added, setAdded] = useState(false)

  const handleAdd = async () => {
    const success = await addToCart(product.id, 1)
    if (success) {
      setAdded(true)
      setTimeout(() => setAdded(false), 1500)
    }
  }

  return (
    <div className="product-card group">
      {/* Image */}
      <div className="product-card__img-wrap">
        {/* Emoji or Image-based product image */}
        <div className="w-full h-full flex items-center justify-center bg-bg-light select-none">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-280" 
            />
          ) : (
            <span className="text-5xl">{product.emoji}</span>
          )}
        </div>
        {/* Discount badge */}
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            -{product.discount}%
          </span>
        )}
        {/* Hot badge */}
        {product.hot && !product.discount && (
          <span className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
            HOT
          </span>
        )}
        {/* Wishlist */}
        <button
          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white shadow-low flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-180 hover:bg-primary hover:text-white text-muted"
          aria-label="Thêm yêu thích"
        >
          <HeartSvg />
        </button>
      </div>

      {/* Body */}
      <div className="p-2.5 flex flex-col gap-1.5 flex-1">
        <div className="text-caption text-muted">{product.brand}</div>
        <div className="text-xs text-[#333333] leading-snug line-clamp-2 font-normal">
          {product.name}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Stars rating={product.rating} />
          <span className="text-[10px] text-muted">({product.reviews})</span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
          <span className="text-text-light">
            {lang === 'vi' ? `Còn ${product.stock || 100} sản phẩm` : `${product.stock || 100} items in stock`}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-auto pt-1">
          {product.discount > 0 && product.oldPrice ? (
            <>
              <span className="text-xs font-medium text-primary">
                {product.price.toLocaleString('vi-VN')}đ
              </span>
              <span className="text-[11px] text-muted line-through">
                {product.oldPrice.toLocaleString('vi-VN')}đ
              </span>
            </>
          ) : (
            <span className="text-xs font-medium text-primary">
              {Number(product.oldPrice || product.price).toLocaleString('vi-VN')}đ
            </span>
          )}
        </div>
      </div>

      {/* Footer actions */}
      <div className="px-2.5 pb-2.5 flex gap-1.5">
        <button
          onClick={handleAdd}
          className={`flex-1 py-1.5 rounded-sm text-[11px] font-medium transition-all duration-180 border ${
            added
              ? 'bg-accent text-white border-accent'
              : 'bg-brown-dark text-white border-brown-dark hover:bg-brown-warm'
          }`}
        >
          {added ? '✓ Đã thêm' : 'Thêm vào giỏ'}
        </button>
        <button
          className="w-8 flex items-center justify-center bg-primary text-white rounded-sm hover:bg-secondary transition-colors"
          aria-label="Mua ngay"
        >
          <FlashSvg />
        </button>
      </div>
    </div>
  )
}

// Tab filter
const TABS = ['Tất cả', 'Chó', 'Mèo', 'Chim', 'Phụ kiện']

const ProductGrid = ({ title, badge, products, cols = 5, showTabs = false }) => {
  const [activeTab, setActiveTab] = useState(0)

  const filtered = showTabs && activeTab > 0
    ? products.filter(p => p.tab === TABS[activeTab])
    : products

  return (
    <section className="py-8 bg-white border-t border-border-light">
      <div className="container-site">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <h2 className="section-title">{title}</h2>
            {badge && (
              <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-sm animate-pulse-soft">
                {badge}
              </span>
            )}
          </div>

          {showTabs ? (
            <div className="flex gap-1 flex-wrap">
              {TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(i)}
                  className={`px-3 py-1 rounded-full text-xs transition-all duration-180 border ${
                    activeTab === i
                      ? 'bg-brown-dark text-white border-brown-dark'
                      : 'bg-white text-[#333333] border-border-light hover:border-primary hover:text-primary'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          ) : (
            <a href="#" className="text-primary text-xs font-medium hover:underline flex items-center gap-1 shrink-0">
              Xem tất cả <ChevronRSvg />
            </a>
          )}
        </div>

        {/* Grid */}
        <div className={`grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 ${cols >= 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'}`}>
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {showTabs && (
          <div className="text-center mt-6">
            <button className="btn-outline text-xs px-8 py-2.5">
              Xem tất cả sản phẩm
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

const HeartSvg = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
  </svg>
)
const FlashSvg = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
)
const ChevronRSvg = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

export { ProductCard, Stars }
export default ProductGrid
