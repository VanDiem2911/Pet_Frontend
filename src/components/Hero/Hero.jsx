// Hero Section — Pet's Home
import poodleHero from '../../assets/poodle_hero.png'
import { useLanguage } from '../../context/LanguageContext'

const Hero = () => {
  const { t } = useLanguage()

  return (
    <section id="hero" className="relative bg-[#fbfaf8] overflow-hidden py-16 lg:py-24">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-[#ffeedd] rounded-full filter blur-3xl opacity-50" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#ffe3cb] rounded-full filter blur-3xl opacity-30" />

      <div className="container-site relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column — Text Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#fff5eb] border border-[#ffe0cc]">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#e67e22]">
                {t('petStore')}
              </span>
            </div>
            
            <h1 className="font-heading font-bold text-brown-dark tracking-tight leading-tight" style={{ fontSize: '48px', lineHeight: '1.15' }}>
              {t('heroTitle1')} <br className="hidden sm:inline" />
              {t('heroTitle2')} <span className="text-primary relative inline-block">{t('heroTitle3')}<span className="absolute bottom-1 left-0 w-full h-2 bg-[#ffebeb] -z-10 rounded-sm"></span></span>
            </h1>
            
            <p className="text-[#555555] text-sm leading-relaxed max-w-lg mx-auto lg:mx-0">
              {t('heroDesc')}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 relative">
              <a
                href="shop"
                className="px-8 py-3 bg-[#111111] hover:bg-primary text-white text-xs font-semibold rounded-pill shadow-lg hover:shadow-red transition-all duration-280"
              >
                {t('shopNow')}
              </a>
              
              {/* Extra orange blob highlight behind the CTA area */}
              <div className="absolute -left-8 -bottom-12 w-24 h-24 bg-[#ffe0cc] rounded-full filter blur-2xl opacity-40 -z-10 pointer-events-none" />
            </div>
          </div>

          {/* Right Column — Orange Blob & Poodle */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            <div className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] flex items-center justify-center">
              
              {/* Organic orange blob background using custom SVG path */}
              <div className="absolute inset-0 z-0 animate-pulse-soft">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-[#ffa94d] opacity-90 fill-current">
                  <path d="M42.3,-58.5C54.8,-51.5,64.9,-38.8,70.5,-23.7C76.1,-8.6,77.2,8.8,72.4,24.4C67.6,40.1,56.9,53.9,43.2,62.8C29.4,71.7,12.7,75.7,-3.6,80.7C-19.9,85.6,-35.8,91.4,-48.9,86.2C-62.1,81.1,-72.5,64.9,-78,48.2C-83.6,31.5,-84.3,14.4,-81.7,-1.5C-79.1,-17.4,-73.2,-32,-63.9,-43C-54.7,-54.1,-42,-61.7,-29.4,-67.9C-16.7,-74.1,-4,-79,8.5,-75.4C21,-71.9,30,-65.6,42.3,-58.5Z" transform="translate(100 100)" />
                </svg>
              </div>

              {/* White background decorative circle */}
              <div className="absolute w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] bg-white rounded-full opacity-10 border border-white/20 z-0" />

              {/* The Poodle Image with multiply blend mode to remove white background */}
              <img
                src={poodleHero}
                alt="Cute poodle puppy wearing a sweater"
                className="relative z-10 w-[240px] h-[240px] sm:w-[330px] sm:h-[330px] object-contain select-none mix-blend-multiply"
              />
              
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Hero
