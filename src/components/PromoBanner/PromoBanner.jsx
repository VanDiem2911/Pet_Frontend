// PromoBanner component — Pet's Home
import { useLanguage } from '../../context/LanguageContext'

const PromoBanner = () => {
  const { t } = useLanguage()

  return (
    <section id="promo-banner" className="py-16 bg-[#f8f9fa] border-t border-b border-border-light text-center">
      <div className="container-site max-w-2xl mx-auto space-y-4">
        <h2 className="font-heading font-bold text-brown-dark text-xl sm:text-2xl tracking-tight">
          {t('smarterWay')}
        </h2>
        <p className="text-[#555555] text-xs sm:text-sm leading-relaxed">
          {t('smarterDesc')}
        </p>
        <div className="pt-2">
          <a
            href="#learn-more"
            className="inline-block px-8 py-3 bg-[#111111] hover:bg-primary text-white text-xs font-semibold rounded-pill transition-all duration-280 shadow-md hover:shadow-red"
          >
            {t('learnMore')}
          </a>
        </div>
      </div>
    </section>
  )
}

export default PromoBanner
