import { Link } from 'react-router-dom'

const serviceBanners = [
  {
    id: 'grooming',
    title: 'Combo đẹp toàn diện',
    image: '/banner-grooming.png',
    to: '/services',
  },
  {
    id: 'hotel',
    title: 'Hotel lưu trú chuẩn 5 sao',
    image: '/banner-hotel.png',
    to: '/services',
  },
]

const CategoryBar = () => {
  return (
    <section id="service-banners" className="py-8 bg-white border-t border-border-light">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {serviceBanners.map(banner => (
            <Link
              key={banner.id}
              to={banner.to}
              className="group block overflow-hidden rounded-card border border-border-light bg-bg-light shadow-low transition-all duration-280 hover:-translate-y-1 hover:shadow-mid"
              aria-label={`Đặt lịch ${banner.title}`}
            >
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full aspect-[1898/774] object-cover transition-transform duration-[400ms] group-hover:scale-[1.02]"
                loading="lazy"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryBar
