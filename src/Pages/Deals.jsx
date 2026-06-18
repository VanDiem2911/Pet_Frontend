// Deals Page — Pet's Home
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { fetchProducts } from '../utils/api'
import catalogProducts from '../../products.json'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { Stars } from '../components/ProductGrid/ProductGrid'

const CATEGORY_OPTIONS = [
  { value: 'Chó', image: '/pets.png', labelVi: 'Chó', labelEn: 'Dog' },
  { value: 'Mèo', image: '/cat.png', labelVi: 'Mèo', labelEn: 'Cat' },
  { value: 'Phụ kiện', image: '/pet-collar.png', labelVi: 'Phụ kiện', labelEn: 'Accessories' },
]

const normalizeText = value => (value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/đ/g, 'd')

const filterLocalProducts = (category, query) => {
  const normalizedQuery = normalizeText(query)
  return catalogProducts.filter(product => {
    const matchCategory = !category || product.category === category
    const matchDeals = category === 'Phụ kiện' || product.discount > 0 || product.sections?.includes('deals') || product.sections?.includes('flashSale')
    const haystack = normalizeText(`${product.name || ''} ${product.brand || ''}`)
    const matchQuery = !normalizedQuery || haystack.includes(normalizedQuery)
    return matchCategory && matchDeals && matchQuery
  })
}

const mergeProducts = items => {
  const seen = new Set()
  return items.filter(product => {
    const key = normalizeText(product.name || `${product.id}`)
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const Deals = () => {
  const { addToCart } = useCart()
  const { t, lang } = useLanguage()
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortOption, setSortOption] = useState('discount') // Default to sorting by discount
  const [addedIds, setAddedIds] = useState({})

  // Advanced Filters States
  const [selectedBrands, setSelectedBrands] = useState([])
  const [selectedTypes, setSelectedTypes] = useState([])
  const [selectedPrices, setSelectedPrices] = useState([])

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)

  const filterCategory = searchParams.get('category') || 'Chó'
  const searchQuery = searchParams.get('q') || ''
  const activePet = filterCategory === 'Mèo' ? 'Mèo' : filterCategory === 'Phụ kiện' ? 'Phụ kiện' : 'Chó'

  const handleBrandToggle = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  const handleTypeToggle = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const handlePriceToggle = (priceRange) => {
    setSelectedPrices(prev =>
      prev.includes(priceRange) ? prev.filter(p => p !== priceRange) : [...prev, priceRange]
    )
  }

  const handleResetAll = () => {
    setSelectedBrands([])
    setSelectedTypes([])
    setSelectedPrices([])
    setSearchQuery('')
  }

  const setFilterCategory = (val) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (val) next.set('category', val); else next.delete('category')
      return next
    })
  }

  const setSearchQuery = (val) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev)
      if (val) next.set('q', val); else next.delete('q')
      return next
    })
  }

  useEffect(() => {
    const loadDeals = async () => {
      setLoading(true)
      try {
        const data = await fetchProducts({
          section: 'deals',
          category: filterCategory,
          q: searchQuery,
        })
        setProducts(mergeProducts([...(data || []), ...filterLocalProducts(filterCategory, searchQuery)]))
      } catch (err) {
        console.error(err)
        setProducts(filterLocalProducts(filterCategory, searchQuery))
      } finally {
        setLoading(false)
      }
    }
    loadDeals()
  }, [filterCategory, searchQuery])

  // Reset pagination when search or filters change
  useEffect(() => {
    const timer = window.setTimeout(() => setCurrentPage(1), 0)
    return () => window.clearTimeout(timer)
  }, [filterCategory, searchQuery, selectedBrands, selectedTypes, selectedPrices])

  // Sorting logic for promotional items
  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === 'lowToHigh') return a.price - b.price
    if (sortOption === 'highToLow') return b.price - a.price
    if (sortOption === 'discount') return b.discount - a.discount
    return a.id - b.id
  })

  // Secondary Filters logic
  const displayedProducts = sortedProducts.filter(product => {
    // 1. Brand Filter
    if (selectedBrands.length > 0) {
      const matchBrand = selectedBrands.some(brand => {
        const brandLower = brand.toLowerCase()
        const productBrandLower = (product.brand || '').toLowerCase()
        const productNameLower = (product.name || '').toLowerCase()
        if (brandLower === 'city zoo' || brandLower === 'cityzoo') {
          return productBrandLower.includes('city zoo') || productBrandLower.includes('cityzoo') || productNameLower.includes('city zoo') || productNameLower.includes('cityzoo')
        }
        return productBrandLower.includes(brandLower) || productNameLower.includes(brandLower)
      })
      if (!matchBrand) return false
    }
    
    // 2. Type Filter
    if (selectedTypes.length > 0) {
      let matchType = false
      const nameLower = product.name.toLowerCase()
      const nameSearch = normalizeText(product.name)
      
      selectedTypes.forEach(t => {
        if (t === 'fashion_accessory' && (nameSearch.includes('ao') || nameSearch.includes('vay') || nameSearch.includes('yem') || nameSearch.includes('cosplay') || nameSearch.includes('no'))) {
          matchType = true
        }
        if (t === 'leash_accessory' && (nameSearch.includes('vong co') || nameSearch.includes('day dan') || nameSearch.includes('yem'))) {
          matchType = true
        }
        if (t === 'carrier_accessory' && (nameSearch.includes('balo') || nameSearch.includes('tui') || nameSearch.includes('van chuyen'))) {
          matchType = true
        }
        if (t === 'toy_accessory' && (nameSearch.includes('do choi') || nameSearch.includes('bong') || nameSearch.includes('chuot') || nameSearch.includes('can cau'))) {
          matchType = true
        }

        // Dog types
        if (t === 'pate_cho' && (nameLower.includes('pate') || nameLower.includes('ướt') || nameLower.includes('sốt') || nameLower.includes('chén') || nameLower.includes('lon'))) {
          matchType = true
        }
        if (t === 'banh_thuong_cho' && (nameLower.includes('bánh') || nameLower.includes('thưởng') || nameLower.includes('snack') || nameLower.includes('treat') || nameLower.includes('que') || nameLower.includes('xương') || nameLower.includes('gặm'))) {
          matchType = true
        }
        if (t === 'do_choi_cho' && (nameLower.includes('đồ chơi') || nameLower.includes('toy') || nameLower.includes('bóng') || nameLower.includes('kéo co') || nameLower.includes('squeaky'))) {
          matchType = true
        }
        if ((t === 'sua_cho_lower' || t === 'sua_cho_upper') && (nameLower.includes('sữa') || nameLower.includes('milk'))) {
          matchType = true
        }
        if (t === 'hat_cho' && (nameLower.includes('hạt') || nameLower.includes('khô') || nameLower.includes('dry') || nameLower.includes('kibble'))) {
          matchType = true
        }
        
        // Cat types
        if (t === 'pate_meo' && (nameLower.includes('pate') || nameLower.includes('ướt') || nameLower.includes('sốt') || nameLower.includes('chén') || nameLower.includes('lon') || nameLower.includes('súp thưởng') || nameLower.includes('ciao') || nameLower.includes('churu'))) {
          matchType = true
        }
        if (t === 'banh_thuong_meo' && (nameLower.includes('bánh') || nameLower.includes('thưởng') || nameLower.includes('snack') || nameLower.includes('treat') || nameLower.includes('cỏ mèo') || nameLower.includes('catnip'))) {
          matchType = true
        }
        if (t === 'do_choi_meo' && (nameLower.includes('đồ chơi') || nameLower.includes('toy') || nameLower.includes('chuột') || nameLower.includes('cần câu') || nameLower.includes('bóng'))) {
          matchType = true
        }
        if (t === 'cat_meo' && (nameLower.includes('cát') || nameLower.includes('litter') || nameLower.includes('vệ sinh'))) {
          matchType = true
        }
        if (t === 'hat_meo' && (nameLower.includes('hạt') || nameLower.includes('khô') || nameLower.includes('dry') || nameLower.includes('kibble'))) {
          matchType = true
        }
      })
      
      if (!matchType) return false
    }

    // 3. Price Filter
    if (selectedPrices.length > 0) {
      let matchPrice = false
      const price = product.price
      if (selectedPrices.includes('under500') && price < 500000) matchPrice = true
      if (selectedPrices.includes('500to1000') && price >= 500000 && price <= 1000000) matchPrice = true
      if (selectedPrices.includes('1000to1500') && price >= 1000000 && price <= 1500000) matchPrice = true
      if (selectedPrices.includes('2000to5000') && price >= 2000000 && price <= 5000000) matchPrice = true
      if (selectedPrices.includes('above5000') && price > 5000000) matchPrice = true
      if (!matchPrice) return false
    }

    return true
  })

  // Pagination calculation
  const itemsPerPage = 12
  const totalPages = Math.ceil(displayedProducts.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedProducts = displayedProducts.slice(startIndex, startIndex + itemsPerPage)

  const handleAddToCart = async (productId) => {
    const success = await addToCart(productId, 1)
    if (success) {
      setAddedIds(prev => ({ ...prev, [productId]: true }))
      setTimeout(() => {
        setAddedIds(prev => ({ ...prev, [productId]: false }))
      }, 1500)
    }
  }

  return (
    <div className="container-site py-10">
      
      {/* Deals Header Banner */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-8 rounded-card border border-primary/20 mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
            {lang === 'vi' ? 'Ưu đãi đặc biệt' : 'Limited Offers'}
          </span>
          <h2 className="font-heading font-bold text-brown-dark text-xl sm:text-2xl tracking-tight">
            {lang === 'vi' ? 'Sản Phẩm Khuyến Mãi' : 'Hot Promotions & Deals'}
          </h2>
          <p className="text-xs text-muted max-w-md">
            {lang === 'vi' 
              ? 'Khám phá các sản phẩm thức ăn, phụ kiện và đồ chơi cho thú cưng đang được giảm giá cực mạnh tại Pet Shop. Nhanh tay kẻo lỡ!' 
              : 'Discover pet food, clothing, and toys on super deal discounts at Pet Shop. Hurry up, limited stock!'}
          </p>
        </div>
        <div className="flex items-center gap-4 bg-white px-5 py-3 rounded-card border border-border-light shadow-sm text-center">
          <div>
            <div className="text-xl font-bold text-primary">{products.length}</div>
            <div className="text-[10px] text-muted uppercase tracking-wider font-semibold">
              {lang === 'vi' ? 'Sản phẩm đang sale' : 'Active Deals'}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-1/4 space-y-5">
          
          {/* Main Filter Title */}
          <div className="border-l-[4px] border-brown-dark bg-[#f8f6f5] py-3 pl-4 pr-3 flex items-center justify-between select-none">
            <span className="font-heading font-bold text-brown-dark text-xs uppercase tracking-wider">
              {lang === 'vi' ? 'Bộ lọc' : 'Filters'}
            </span>
          </div>

          {/* Search box */}
          <div className="bg-[#f8f9fa] p-5 rounded-card border border-border-light">
            <h3 className="font-heading font-bold text-brown-dark text-[11px] uppercase tracking-wider mb-3">
              {t('searchProducts')}
            </h3>
            <div className="relative">
              <input
                type="text"
                placeholder={t('typeToSearch')}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#eeeeee] rounded-pill pl-4 pr-10 py-2 text-xs outline-none focus:border-primary transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
              </span>
            </div>
          </div>

          {/* Pet Selector (Chó / Mèo) - dynamic switcher */}
          <div className="bg-[#f8f9fa] p-5 rounded-card border border-border-light space-y-3">
            <h3 className="font-heading font-bold text-brown-dark text-[11px] uppercase tracking-wider border-b border-border-light pb-2">
              {lang === 'vi' ? 'Chọn thú cưng' : 'Select Pet'}
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORY_OPTIONS.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setFilterCategory(option.value)
                    setSelectedTypes([])
                  }}
                  className={`min-h-[56px] flex items-center justify-center gap-1.5 rounded-card border px-1.5 py-2 transition-all duration-280 font-bold text-[10px] sm:text-[11px] leading-tight text-center ${
                    activePet === option.value
                      ? 'bg-primary border-primary text-white shadow-red'
                      : 'bg-white border-[#eeeeee] text-brown-dark hover:border-primary/40 hover:text-primary hover:shadow-low'
                  }`}
                >
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full ${
                    activePet === option.value ? 'bg-white/15' : 'bg-bg-light'
                  }`}>
                    <img
                      src={option.image}
                      alt=""
                      className={`max-h-4 max-w-4 object-contain ${activePet === option.value ? 'brightness-0 invert' : ''}`}
                      aria-hidden="true"
                    />
                  </span>
                  <span className="whitespace-nowrap">{lang === 'vi' ? option.labelVi : option.labelEn}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Brand Filter (Thương hiệu) */}
          <div className="bg-[#f8f9fa] p-5 rounded-card border border-border-light space-y-3">
            <h3 className="font-heading font-bold text-brown-dark text-[11px] uppercase tracking-wider border-b border-border-light pb-2">
              {lang === 'vi' ? 'Thương hiệu' : 'Brands'}
            </h3>
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {[
                'Bio', 'Monge', 'AFP', 'Doggyman', 'Thái Lan',
                'Morando', 'City zoo', 'Cityzoo', 'Pawise', 'Inu Fonti'
              ].map(brand => {
                const checked = selectedBrands.includes(brand)
                return (
                  <label key={brand} className="flex items-center gap-3 text-xs text-[#555555] cursor-pointer select-none hover:text-primary transition-colors font-medium">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleBrandToggle(brand)}
                      className="w-4.5 h-4.5 accent-primary rounded-sm border-[#cccccc] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span>{brand}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Product Type Filter (Loại sản phẩm) */}
          <div className="bg-[#f8f9fa] p-5 rounded-card border border-border-light space-y-3">
            <h3 className="font-heading font-bold text-brown-dark text-[11px] uppercase tracking-wider border-b border-border-light pb-2">
              {lang === 'vi' ? 'Loại sản phẩm' : 'Product Type'}
            </h3>
            <div className="space-y-2.5">
              {(activePet === 'Phụ kiện'
                ? [
                    { label: lang === 'vi' ? 'Thời trang thú cưng' : 'Pet Fashion', value: 'fashion_accessory' },
                    { label: lang === 'vi' ? 'Vòng cổ / Dây dẫn' : 'Collars & Leashes', value: 'leash_accessory' },
                    { label: lang === 'vi' ? 'Balo / Túi vận chuyển' : 'Carriers & Bags', value: 'carrier_accessory' },
                    { label: lang === 'vi' ? 'Đồ chơi phụ kiện' : 'Accessory Toys', value: 'toy_accessory' }
                  ]
                : activePet === 'Mèo'
                ? [
                    { label: lang === 'vi' ? 'Pate Mèo' : 'Cat Pate', value: 'pate_meo' },
                    { label: lang === 'vi' ? 'Bánh thưởng Mèo' : 'Cat Treats', value: 'banh_thuong_meo' },
                    { label: lang === 'vi' ? 'Đồ chơi Mèo' : 'Cat Toys', value: 'do_choi_meo' },
                    { label: lang === 'vi' ? 'Cát vệ sinh Mèo' : 'Cat Litter', value: 'cat_meo' },
                    { label: lang === 'vi' ? 'Hạt Mèo' : 'Cat Kibbles', value: 'hat_meo' }
                  ]
                : [
                    { label: lang === 'vi' ? 'Pate Chó' : 'Dog Pate', value: 'pate_cho' },
                    { label: lang === 'vi' ? 'Bánh thưởng Chó' : 'Dog Treats', value: 'banh_thuong_cho' },
                    { label: lang === 'vi' ? 'Đồ chơi Chó' : 'Dog Toys', value: 'do_choi_cho' },
                    { label: lang === 'vi' ? 'Sữa chó' : 'Dog Milk', value: 'sua_cho_lower' },
                    { label: lang === 'vi' ? 'Sữa Chó' : 'Dog Milk (Alt)', value: 'sua_cho_upper' },
                    { label: lang === 'vi' ? 'Hạt Chó' : 'Dog Kibbles', value: 'hat_cho' }
                  ]
              ).map(type => {
                const checked = selectedTypes.includes(type.value)
                return (
                  <label key={type.value} className="flex items-center gap-3 text-xs text-[#555555] cursor-pointer select-none hover:text-primary transition-colors font-medium">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleTypeToggle(type.value)}
                      className="w-4.5 h-4.5 accent-primary rounded-sm border-[#cccccc] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span>{type.label}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Price Range Filter (Giá sản phẩm) */}
          <div className="bg-[#f8f9fa] p-5 rounded-card border border-border-light space-y-3">
            <h3 className="font-heading font-bold text-brown-dark text-[11px] uppercase tracking-wider border-b border-border-light pb-2">
              {lang === 'vi' ? 'Giá sản phẩm' : 'Product Prices'}
            </h3>
            <div className="space-y-2.5">
              {[
                { label: lang === 'vi' ? 'Dưới 500,000đ' : 'Under 500,000đ', value: 'under500' },
                { label: '500,000đ - 1,000,000đ', value: '500to1000' },
                { label: '1,000,000đ - 1,500,000đ', value: '1000to1500' },
                { label: '2,000,000đ - 5,000,000đ', value: '2000to5000' },
                { label: lang === 'vi' ? 'Trên 5,000,000đ' : 'Over 5,000,000đ', value: 'above5000' }
              ].map(range => {
                const checked = selectedPrices.includes(range.value)
                return (
                  <label key={range.value} className="flex items-center gap-3 text-xs text-[#555555] cursor-pointer select-none hover:text-primary transition-colors font-medium">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handlePriceToggle(range.value)}
                      className="w-4.5 h-4.5 accent-primary rounded-sm border-[#cccccc] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <span>{range.label}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Reset All Button */}
          {(selectedBrands.length > 0 || selectedTypes.length > 0 || selectedPrices.length > 0 || searchQuery) && (
            <button
              onClick={handleResetAll}
              className="w-full py-2 border border-primary text-primary hover:bg-primary hover:text-white text-xs font-semibold rounded-pill transition-colors duration-180"
            >
              {lang === 'vi' ? 'Xóa tất cả bộ lọc' : 'Clear All Filters'}
            </button>
          )}

        </aside>

        {/* Products Display Area */}
        <main className="flex-1 space-y-6">
          
          {/* Products Header Controls */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-[#f8f9fa] rounded-card border border-border-light">
            <span className="text-xs text-[#555555]">
              {t('showing')} <span className="font-bold">{displayedProducts.length}</span> {t('productsLabel')}
            </span>
            
            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#555555] shrink-0">{t('sortBy')}:</span>
              <select
                value={sortOption}
                onChange={e => setSortOption(e.target.value)}
                className="bg-white border border-[#eeeeee] rounded-pill px-4 py-1.5 text-xs text-brown-dark outline-none focus:border-primary"
              >
                <option value="discount">{lang === 'vi' ? 'Mức giảm giá: Cao đến Thấp' : 'Discount: High to Low'}</option>
                <option value="lowToHigh">{t('lowToHigh')}</option>
                <option value="highToLow">{t('highToLow')}</option>
              </select>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
              <p className="text-xs text-muted mt-2">{t('loadingProducts')}</p>
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="py-20 text-center text-muted">
              <span className="text-5xl">🔍</span>
              <p className="text-sm font-bold mt-4">{t('noProducts')}</p>
              <p className="text-xs mt-1">{t('resetFilters')}</p>
            </div>
          ) : (
            <>
              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {paginatedProducts.map(product => {
                  const isAdded = addedIds[product.id]

                  return (
                    <div
                      key={product.id}
                      className="group bg-white border border-[#eeeeee] hover:border-primary/20 rounded-card p-4 flex flex-col transition-all duration-280 hover:shadow-mid"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-square bg-[#f8f9fa] rounded-card overflow-hidden flex items-center justify-center select-none group-hover:scale-102 transition-transform duration-280">
                        {product.imageUrl ? (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-280" 
                          />
                        ) : (
                          <span className="text-5xl">{product.emoji}</span>
                        )}
                        
                        {product.discount > 0 && (
                          <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                            -{product.discount}%
                          </span>
                        )}
                        {product.hot && (
                          <span className="absolute top-2 left-2 bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">
                            HOT
                          </span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="mt-4 flex-1 flex flex-col gap-1">
                        <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">
                          {product.brand}
                        </span>
                        <h3 className="text-xs font-bold text-brown-dark line-clamp-2 min-h-[32px] group-hover:text-primary transition-colors leading-tight">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Stars rating={product.rating} />
                          <span className="text-[10px] text-muted">({product.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px]">
                          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                          <span className="text-text-light">
                            {lang === 'vi' ? `Còn ${product.stock || 100} sản phẩm` : `${product.stock || 100} items in stock`}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          {product.discount > 0 && product.oldPrice ? (
                            <>
                              <span className="text-xs font-bold text-primary">
                                {product.price.toLocaleString('vi-VN')}đ
                              </span>
                              <span className="text-[10px] text-muted line-through">
                                {product.oldPrice.toLocaleString('vi-VN')}đ
                              </span>
                            </>
                          ) : (
                            <span className="text-xs font-bold text-primary">
                              {Number(product.oldPrice || product.price).toLocaleString('vi-VN')}đ
                            </span>
                          )}
                        </div>
                      </div>

                      {/* CTA Button */}
                      <div className="mt-4">
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          className={`w-full py-2 rounded-pill text-[11px] font-semibold transition-all duration-180 border ${
                            isAdded
                              ? 'bg-accent text-white border-accent'
                              : 'bg-[#111111] hover:bg-primary text-white border-[#111111] hover:border-primary'
                          }`}
                        >
                          {isAdded ? t('added') : t('addToCart')}
                        </button>
                      </div>

                    </div>
                  )
                })}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10 py-4 select-none">
                  {/* Previous Page Button */}
                  <button
                    onClick={() => {
                      setCurrentPage(prev => Math.max(prev - 1, 1))
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    disabled={currentPage === 1}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-280 ${
                      currentPage === 1
                        ? 'border-[#eeeeee] text-[#cccccc] cursor-not-allowed'
                        : 'border-[#dddddd] text-brown-dark hover:border-primary hover:text-white hover:bg-primary'
                    }`}
                    aria-label="Previous page"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="15 18 9 12 15 6"/>
                    </svg>
                  </button>

                  {/* Page Numbers */}
                  {Array.from({ length: totalPages }, (_, idx) => {
                    const pageNum = idx + 1
                    const active = currentPage === pageNum
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          setCurrentPage(pageNum)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-280 ${
                          active
                            ? 'bg-primary border-primary text-white shadow-red'
                            : 'border border-[#dddddd] text-[#555555] hover:border-primary hover:text-white hover:bg-primary bg-white'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}

                  {/* Next Page Button */}
                  <button
                    onClick={() => {
                      setCurrentPage(prev => Math.min(prev + 1, totalPages))
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    disabled={currentPage === totalPages}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all duration-280 ${
                      currentPage === totalPages
                        ? 'border-[#eeeeee] text-[#cccccc] cursor-not-allowed'
                        : 'border-[#dddddd] text-brown-dark hover:border-primary hover:text-white hover:bg-primary'
                    }`}
                    aria-label="Next page"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}

        </main>

      </div>
    </div>
  )
}

export default Deals


