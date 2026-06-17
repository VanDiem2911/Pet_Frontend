// TrustBadges component — Pet's Home
import { useLanguage } from '../../context/LanguageContext'

const TrustBadges = () => {
  const { t } = useLanguage()

  const badges = [
    {
      id: 'shipping',
      title: t('fastShipping'),
      desc: t('onAllOrders'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="3" width="15" height="13"/>
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
          <circle cx="5.5" cy="18.5" r="2.5"/>
          <circle cx="18.5" cy="18.5" r="2.5"/>
        </svg>
      )
    },
    {
      id: 'payment',
      title: t('safePayment'),
      desc: t('secureCheckout'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
          <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      )
    },
    {
      id: 'returns',
      title: t('easyReturns'),
      desc: t('returnPolicy'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 4 23 10 17 10"/>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
      )
    },
    {
      id: 'support',
      title: t('support247'),
      desc: t('dedicatedSupport'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      )
    },
    {
      id: 'guarantee',
      title: t('qualityGuarantee'),
      desc: t('certifiedProducts'),
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="8" r="7"/>
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
        </svg>
      )
    }
  ]

  return (
    <section id="trust-badges" className="py-10 bg-white border-b border-border-light">
      <div className="container-site">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {badges.map(badge => (
            <div
              key={badge.id}
              className="flex flex-col items-center text-center space-y-2 group cursor-pointer"
            >
              {/* Icon Container in primary (orange-red) color */}
              <div className="w-12 h-12 rounded-full bg-[#fff5eb] border border-[#ffe0cc] text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-280">
                {badge.icon}
              </div>
              <div className="space-y-0.5">
                <span className="block font-heading font-bold text-xs text-brown-dark group-hover:text-primary transition-colors">
                  {badge.title}
                </span>
                <span className="block text-[10px] text-muted font-normal">
                  {badge.desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TrustBadges
