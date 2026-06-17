// Home page — Pet's Home
import { Link } from 'react-router-dom'
import Hero             from '../components/Hero/Hero'
import CategoryBar      from '../components/CategoryBar/CategoryBar'
import FeaturedProducts from '../components/FeaturedProducts/FeaturedProducts'
import TrustBadges      from '../components/TrustBadges/TrustBadges'
import BestSellers      from '../components/BestSellers/BestSellers'

const DealBanners = () => (
  <section id="featured-deal-banners" className="py-8 bg-white border-t border-border-light">
    <div className="container-site">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { image: '/banner-royal-canin.png', alt: 'Khuyến mãi Royal Canin' },
          { image: '/banner-buy-get-free.png', alt: 'Mua là giảm' },
        ].map(banner => (
          <Link
            key={banner.image}
            to="/deals"
            className="block overflow-hidden rounded-card border border-border-light bg-bg-light shadow-low transition-all duration-280 hover:-translate-y-1 hover:shadow-mid"
            aria-label="Xem khuyến mãi"
          >
            <img
              src={banner.image}
              alt={banner.alt}
              className="w-full aspect-[512/114] object-cover"
              loading="lazy"
            />
          </Link>
        ))}
      </div>
    </div>
  </section>
)


/* ────────────────────────────────────
   Main Home page
──────────────────────────────────── */
const Home = () => {
  return (
    <div className="space-y-0">
      
      {/* 1. Hero Banner */}
      <Hero />

      {/* 2. Deal banners */}
      
      <DealBanners />
      {/* 3. Featured Products */}
      <FeaturedProducts />

      {/* 4. Browse by Category*/}
      <CategoryBar />

      {/* 5. Trust/Value Badges */}
      <TrustBadges />

      {/* 6. Best Sellers Grid */}
      <BestSellers />

    </div>
  )
}

export default Home
