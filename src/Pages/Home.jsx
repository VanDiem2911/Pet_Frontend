import { Link } from 'react-router-dom'
import Hero from '../components/Hero/Hero'
import CategoryBar from '../components/CategoryBar/CategoryBar'
import FeaturedProducts from '../components/FeaturedProducts/FeaturedProducts'
import TrustBadges from '../components/TrustBadges/TrustBadges'
import BestSellers from '../components/BestSellers/BestSellers'

const DealBanners = () => (
  <section id="featured-deal-banners" className="py-8 bg-white border-t border-border-light">
    <div className="container-site">
      <Link
        to="/deals"
        className="block overflow-hidden rounded-card border border-border-light bg-bg-light shadow-low transition-all duration-280 hover:-translate-y-1 hover:shadow-mid"
        aria-label="Xem khuyen mai thanh vien"
      >
        <img
          src="/banner-member-discount.png"
          alt="Chuong trinh thanh vien giam gia"
          className="w-full aspect-[2048/613] object-cover"
          loading="lazy"
        />
      </Link>
    </div>
  </section>
)

const GroomingInlineBanner = () => (
  <section className="py-8 bg-white border-t border-border-light">
    <div className="container-site">
      <a
        href="/services"
        className="block overflow-hidden rounded-card border border-border-light bg-[#4fa373] shadow-low transition-all duration-280 hover:-translate-y-1 hover:shadow-mid"
        aria-label="Dat lich tam goi cho thu cung"
      >
        <img
          src="/banner-grooming-price.png"
          alt="Dong gia tam goi cho thu cung"
          className="w-full aspect-[2048/335] object-cover"
          loading="lazy"
        />
      </a>
    </div>
  </section>
)

const Home = () => {
  return (
    <div className="space-y-0">
      <Hero />
      <DealBanners />
      <FeaturedProducts />
      <CategoryBar />
      <TrustBadges />
      <BestSellers />
      <GroomingInlineBanner />
    </div>
  )
}

export default Home
