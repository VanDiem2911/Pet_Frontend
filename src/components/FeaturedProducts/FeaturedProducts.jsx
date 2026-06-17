import { useState, useEffect } from 'react'
import { FEATURED_PRODUCTS } from '../../data/products'
import { ProductCard } from '../ProductGrid/ProductGrid'
import { useLanguage } from '../../context/LanguageContext'
import { fetchProducts } from '../../utils/api'
import featuredCat from '../../assets/featured_cat.png'

const FeaturedProducts = () => {
  const { t } = useLanguage()
  const [products, setProducts] = useState([])

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const data = await fetchProducts({ section: 'featured' })
        if (data && data.length > 0) {
          setProducts(data.slice(0, 3))
        } else {
          setProducts(FEATURED_PRODUCTS.slice(0, 3))
        }
      } catch (err) {
        console.error('Failed to load featured products from API, using mock:', err)
        setProducts(FEATURED_PRODUCTS.slice(0, 3))
      }
    }
    loadFeatured()
  }, [])


  return (
    <section id="featured-section" className="py-16 bg-white border-t border-border-light">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column — Cat silhouettes inside orange blob */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            <div className="relative w-[300px] h-[300px] sm:w-[380px] sm:h-[380px] flex items-center justify-center">
              
              {/* Organic orange blob background */}
              <div className="absolute inset-0 z-0 animate-pulse-soft">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#ffa94d] fill-current">
                  <path d="M43.7,-64.9C56.6,-57.4,67.1,-45.5,74.7,-31.6C82.3,-17.7,87.1,-1.9,84.1,12.5C81.1,26.9,70.3,39.9,58.3,49.9C46.3,59.9,33.1,66.9,19.2,70.5C5.3,74.1,-9.3,74.3,-23.4,70C-37.5,65.6,-51.2,56.7,-61.2,44.7C-71.2,32.7,-77.6,17.7,-79.8,1.7C-82.1,-14.2,-80.4,-31,-72.1,-43.9C-63.8,-56.9,-49,-66,-35.1,-72.7C-21.2,-79.3,-8.2,-83.4,3.2,-87.8C14.7,-92.3,29.4,-97.1,43.7,-64.9Z" transform="translate(100 100)" />
                </svg>
              </div>

              {/* Dynamic cat photo on top of the blob */}
              <div className="relative z-10 w-[240px] h-[240px] sm:w-[285px] sm:h-[285px] overflow-hidden rounded-full border-4 border-white shadow-lg flex items-center justify-center bg-white">
                <img 
                  src={featuredCat} 
                  alt="Featured Cat" 
                  className="w-full h-full object-cover" 
                />
              </div>

            </div>
          </div>

          {/* Right Column — Featured products grid */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-heading font-bold text-brown-dark text-xl sm:text-2xl tracking-tight">
              {t('featuredProducts')}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
