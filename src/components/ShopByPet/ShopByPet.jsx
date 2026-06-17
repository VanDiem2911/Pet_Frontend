// ShopByPet component — Pet's Home
import { useLanguage } from '../../context/LanguageContext'

const ShopByPet = () => {
  const { t } = useLanguage()

  const pets = [
    {
      id: 'cat',
      label: t('cats').split(' ')[0], // grabs the main label
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5c-1.66 0-3 1.34-3 3 0 .74.27 1.42.71 1.95A4.98 4.98 0 0 0 5 14.5c0 2.48 2.02 4.5 4.5 4.5 1.07 0 2.06-.38 2.83-1.01a4.5 4.5 0 0 0 3.34-4.49 4.98 4.98 0 0 0-3.66-4.55C12.44 8.41 12 7.74 12 7c0-.74-.27-1.42-.71-1.95L12 5z"/>
          <path d="M16 11c0-1.66 1.34-3 3-3s3 1.34 3 3c0 2.5-3 5-3 5s-3-2.5-3-5z"/>
          <path d="M12 19v3"/>
        </svg>
      )
    },
    {
      id: 'hamster',
      label: 'Hamster',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <ellipse cx="12" cy="12" rx="9" ry="7"/>
          <circle cx="8" cy="11" r="1.5"/>
          <circle cx="16" cy="11" r="1.5"/>
          <path d="M11 14s1 1 2 0"/>
        </svg>
      )
    },
    {
      id: 'dog',
      label: t('dogs').split(' ')[0],
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 18a6 6 0 0 1 12 0"/>
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5.67 1.5 1.5 1.5 1.5-.67 1.5-1.5zM12 13c-2.33 0-4.5-1.2-4.5-3.5S9.67 6 12 6s4.5 1.2 4.5 3.5-2.17 3.5-4.5 3.5z"/>
        </svg>
      )
    },
    {
      id: 'bird',
      label: 'Bird',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M16 3c-1.66 0-3 1.34-3 3 0 .74.27 1.42.71 1.95A4.98 4.98 0 0 0 9 12.5c0 2.48 2.02 4.5 4.5 4.5 1.07 0 2.06-.38 2.83-1.01a4.5 4.5 0 0 0 3.34-4.49 4.98 4.98 0 0 0-3.66-4.55C16.44 6.41 16 5.74 16 5c0-.74-.27-1.42-.71-1.95L16 3z"/>
          <path d="M9 12.5C9 8.5 4 8 4 8s1.5 4.5 5 4.5z"/>
        </svg>
      )
    },
    {
      id: 'rabbit',
      label: 'Rabbit',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 22a4 4 0 0 1-8 0v-4a4 4 0 0 1 8 0v4z"/>
          <path d="M22 22a4 4 0 0 1-8 0v-4a4 4 0 0 1 8 0v4z"/>
          <circle cx="12" cy="11" r="5"/>
          <path d="M10 6L9 2"/>
          <path d="M14 6l1-4"/>
        </svg>
      )
    },
    {
      id: 'turtle',
      label: 'Turtle',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5.67 1.5 1.5 1.5 1.5-.67 1.5-1.5zm2.5-5.5c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3z"/>
        </svg>
      )
    }
  ]

  return (
    <section id="shop-by-pet" className="py-12 bg-white border-t border-border-light">
      <div className="container-site">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading font-bold text-brown-dark text-xl sm:text-2xl tracking-tight">
            {t('shopByPet')}
          </h2>
          
          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              id="pet-prev"
              className="w-8 h-8 rounded-full bg-white border border-border-light hover:border-brown-dark flex items-center justify-center text-brown-dark transition-colors duration-180"
              aria-label="Previous pets"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button
              id="pet-next"
              className="w-8 h-8 rounded-full bg-[#111111] hover:bg-primary flex items-center justify-center text-white transition-colors duration-180"
              aria-label="Next pets"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Circular badging list */}
        <div className="flex items-center gap-6 overflow-x-auto pb-4 scrollbar-none md:grid md:grid-cols-6 md:gap-8 justify-items-center">
          {pets.map(pet => (
            <a
              key={pet.id}
              href={`#shop-${pet.id}`}
              className="flex flex-col items-center gap-2 shrink-0 group"
            >
              {/* Circular Container with hover outline and orange styling */}
              <div className="w-20 h-20 rounded-full border-2 border-border-light group-hover:border-primary flex items-center justify-center text-[#ff9e42] bg-[#fdfdfd] group-hover:bg-[#fff5eb] transition-all duration-280 shadow-sm group-hover:scale-105">
                {pet.icon}
              </div>
              <span className="font-heading font-bold text-xs text-[#555555] group-hover:text-primary transition-colors duration-180 text-center">
                {pet.label}
              </span>
            </a>
          ))}
        </div>

      </div>
    </section>
  )
}

export default ShopByPet
