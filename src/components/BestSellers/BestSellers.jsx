import { useEffect, useMemo, useState } from 'react'
import catalogProducts from '../../../products.json'
import { useCart } from '../../context/CartContext'
import { useLanguage } from '../../context/LanguageContext'
import { fetchProducts } from '../../utils/api'

const groupConfig = [
  {
    id: 'cat-dry',
    title: 'THỨC ĂN HẠT CHO MÈO',
    links: ['Thức ăn hạt', 'Pate, đồ hộp và sữa'],
    pet: 'cat',
    type: 'dry',
  },
  {
    id: 'dog-dry',
    title: 'THỨC ĂN HẠT CHO CHÓ',
    links: ['Thức ăn hạt', 'Pate, đồ hộp và sữa'],
    pet: 'dog',
    type: 'dry',
  },
  {
    id: 'dog-pate',
    title: 'PATE CHO CHÓ',
    links: ['Giường, nệm, thảm', 'Lồng, chuồng'],
    pet: 'dog',
    type: 'pate',
  },
  {
    id: 'cat-pate',
    title: 'PATE CHO MÈO',
    links: ['Chó cưng'],
    pet: 'cat',
    type: 'pate',
  },
  {
    id: 'accessories',
    title: 'PHỤ KIỆN THÚ CƯNG',
    links: ['Thời trang', 'Vòng cổ, dây dẫn', 'Túi, balo'],
    pet: 'accessory',
    type: 'accessory',
  },
]

const BestSellers = () => {
  const { addToCart } = useCart()
  const { t, lang } = useLanguage()
  const [addedIds, setAddedIds] = useState({})
  const [products, setProducts] = useState(catalogProducts)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts()
        setProducts(data?.length ? uniqueProducts([...data, ...catalogProducts]) : catalogProducts)
      } catch (err) {
        console.error('Failed to load products from API, using local catalog:', err)
        setProducts(catalogProducts)
      }
    }

    loadProducts()
  }, [])

  const groups = useMemo(() => {
    return groupConfig.map(config => {
      const primary = products.filter(product => matchesGroup(product, config))
      const fallback = config.type === 'accessory'
        ? products.filter(matchesAccessory)
        : products.filter(product => matchesPet(product, config.pet))

      return {
        ...config,
        products: uniqueProducts([...primary, ...fallback]).slice(0, 8),
      }
    })
  }, [products])

  const handleAdd = async productId => {
    const success = await addToCart(productId, 1)
    if (success) {
      setAddedIds(prev => ({ ...prev, [productId]: true }))
      setTimeout(() => {
        setAddedIds(prev => ({ ...prev, [productId]: false }))
      }, 1500)
    }
  }

  return (
    <section id="best-sellers-section" className="py-14 bg-white border-t border-border-light">
      <div className="container-site space-y-12">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-brown-dark text-xl sm:text-2xl tracking-tight">
            {t('bestSelling')}
          </h2>
          <a href="/shop" className="text-primary text-xs font-semibold hover:underline flex items-center gap-1">
            {t('viewAll')}
            <ChevronRightIcon />
          </a>
        </div>

        {groups.map((group, index) => (
          <div key={group.id} className="space-y-10">
            <ProductGroup group={group} addedIds={addedIds} onAdd={handleAdd} lang={lang} t={t} />
            {index === 1 && <GroomingInlineBanner />}
          </div>
        ))}
      </div>
    </section>
  )
}

const ProductGroup = ({ group, addedIds, onAdd, lang, t }) => (
  <section className="space-y-5">
    <div className="flex items-center justify-between gap-4 border-b border-border-light">
      <div className="relative inline-flex items-center bg-accent text-white font-bold text-xs sm:text-sm uppercase px-4 py-2 rounded-t-sm">
        {group.title}
        <span className="absolute -right-3 top-0 h-full w-4 bg-accent [clip-path:polygon(0_0,100%_50%,0_100%)]" />
      </div>
      <div className="hidden sm:flex items-center gap-4 text-[11px] text-muted">
        {group.links.map(link => (
          <a key={link} href="/shop?category=Phụ kiện" className="hover:text-primary transition-colors">
            {link}
          </a>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8">
      {group.products.map(product => (
        <BestSellerCard
          key={product.id}
          product={product}
          isAdded={addedIds[product.id]}
          onAdd={onAdd}
          lang={lang}
          t={t}
        />
      ))}
    </div>
  </section>
)

const BestSellerCard = ({ product, isAdded, onAdd, lang, t }) => (
  <article className="group bg-white flex flex-col">
    <button
      type="button"
      onClick={() => onAdd(product.id)}
      className="relative aspect-square bg-white border border-transparent hover:border-border-light rounded-btn overflow-hidden flex items-center justify-center transition-all duration-280"
      aria-label={product.name}
    >
      {product.imageUrl ? (
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-contain p-2 transition-transform duration-280 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <span className="text-5xl">{product.emoji || '🐾'}</span>
      )}

      {product.discount > 0 && (
        <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-sm">
          {product.discount}%
        </span>
      )}
    </button>

    <div className="pt-3 flex flex-col gap-1 min-w-0">
      <h3 className="text-xs font-semibold text-brown-dark leading-snug line-clamp-2 min-h-[34px] group-hover:text-primary transition-colors">
        {product.name}
      </h3>

      <div className="flex items-center gap-1.5 text-[10px]">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        <span className="text-muted">
          {lang === 'vi' ? `Còn ${product.stock || 100} sản phẩm` : `${product.stock || 100} items in stock`}
        </span>
      </div>

      <div className="flex items-end gap-2 mt-1">
        {product.oldPrice && (
          <span className="text-[10px] text-muted line-through">
            {Number(product.oldPrice).toLocaleString('vi-VN')}đ
          </span>
        )}
        <span className="text-sm font-bold text-brown-dark">
          {Number(product.price).toLocaleString('vi-VN')}đ
        </span>
      </div>

      <button
        type="button"
        onClick={() => onAdd(product.id)}
        className="mt-2 py-2 rounded-btn border border-border-light text-[11px] font-semibold text-text-light hover:bg-primary hover:border-primary hover:text-white transition-colors"
      >
        {isAdded ? t('added') : t('addToCart')}
      </button>
    </div>
  </article>
)

const GroomingInlineBanner = () => (
  <a
    href="/services"
    className="block overflow-hidden rounded-card border border-border-light bg-[#4fa373] shadow-low transition-all duration-280 hover:-translate-y-1 hover:shadow-mid"
    aria-label="Đặt lịch tắm gội cho thú cưng"
  >
    <img
      src="/banner-grooming-price.png"
      alt="Đồng giá tắm gội cho thú cưng"
      className="w-full aspect-[2048/335] object-cover"
      loading="lazy"
    />
  </a>
)

const uniqueProducts = items => {
  const seen = new Set()
  return items.filter(item => {
    if (!item?.id || seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

const matchesGroup = (product, config) => {
  if (config.type === 'accessory') return matchesAccessory(product)
  return matchesPet(product, config.pet) && matchesType(product, config.type)
}

const matchesAccessory = product => {
  const category = normalizeText(product.category || '')
  const name = normalizeText(product.name || '')
  if (category.includes('phu kien')) return true

  return (name.includes('thoi trang') ||
    name.includes('vong co') ||
    name.includes('day dan') ||
    name.includes('yem deo') ||
    name.includes('ao ') ||
    name.includes('balo') ||
    name.includes('tui xach')) &&
    !name.includes('thuc an') &&
    !name.includes('pate') &&
    !name.includes('banh thuong') &&
    !name.includes('sua ')
}

const matchesPet = (product, pet) => {
  const text = normalizeText(`${product.name || ''} ${product.category || ''}`)
  if (pet === 'cat') return text.includes('meo') || text.includes('cat')
  return text.includes('cho') || text.includes('dog')
}

const matchesType = (product, type) => {
  const text = normalizeText(product.name || '')
  const isPate = text.includes('pate') || text.includes('wet') || text.includes('uot') || text.includes('sot')
  if (type === 'pate') return isPate
  return (text.includes('hat') || text.includes('dry')) && !isPate
}

const normalizeText = value => value
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')
  .replace(/Ä‘/g, 'd')

const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

export default BestSellers
