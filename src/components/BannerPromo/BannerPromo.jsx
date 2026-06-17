// BannerPromo — Mid-page promotional banners
const banners = [
  {
    id: 'banner-food',
    bg: 'bg-gradient-to-r from-[#362116] to-[#27150b]',
    tag: 'Thức ăn cao cấp',
    title: 'Royal Canin\n& Whiskas',
    sub: 'Dinh dưỡng hoàn hảo, chính hãng 100%',
    cta: 'Xem ngay',
    emoji: '🥩',
    accent: '#ed3f46',
  },
  {
    id: 'banner-accessories',
    bg: 'bg-gradient-to-r from-[#0f0f0f] to-[#191919]',
    tag: 'Phụ kiện & Đồ chơi',
    title: 'Vui mỗi ngày\ncùng thú cưng',
    sub: 'Hàng trăm lựa chọn phụ kiện thú vị',
    cta: 'Khám phá',
    emoji: '🎾',
    accent: '#74c05e',
  },
]

const BannerPromo = () => {
  return (
    <section id="promo-banners" className="py-8 bg-bg-light">
      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {banners.map(b => (
            <div
              key={b.id}
              id={b.id}
              className={`${b.bg} rounded-card p-8 relative overflow-hidden cursor-pointer group transition-all duration-280 hover:shadow-high hover:-translate-y-1`}
            >
              {/* BG pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full border-4 border-white" />
                <div className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full border-2 border-white" />
              </div>

              {/* Emoji float */}
              <div className="absolute right-6 top-1/2 -translate-y-1/2 text-7xl opacity-30 group-hover:opacity-50 group-hover:scale-110 transition-all duration-280 select-none">
                {b.emoji}
              </div>

              <div className="relative z-10 space-y-3 max-w-[60%]">
                <div className="flex items-center gap-2">
                  <span className="h-px w-6" style={{ background: b.accent }} />
                  <span className="text-caption font-medium uppercase tracking-wider" style={{ color: b.accent }}>
                    {b.tag}
                  </span>
                </div>
                <h3
                  className="text-white font-heading font-medium leading-tight whitespace-pre-line"
                  style={{ fontSize: '22px' }}
                >
                  {b.title}
                </h3>
                <p className="text-white/60 text-xs leading-relaxed">{b.sub}</p>
                <button
                  className="btn-filled mt-2 text-xs px-5 py-2 rounded-pill"
                  style={{ background: b.accent, border: 'none', color: '#fff' }}
                >
                  {b.cta}
                  <ArrowSvg />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Full-width sale banner ── */}
        <div className="mt-4 bg-gradient-to-r from-primary to-secondary rounded-card p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* BG deco */}
          <div className="absolute right-0 top-0 w-64 h-full opacity-10">
            <div className="absolute right-10 top-4 w-32 h-32 rounded-full border-4 border-white" />
            <div className="absolute right-4 bottom-4 w-20 h-20 rounded-full border-2 border-white" />
          </div>

          <div className="space-y-2 relative z-10 text-center sm:text-left">
            <div className="text-white/70 text-caption font-medium uppercase tracking-widest">Ưu đãi đặc biệt</div>
            <h3 className="text-white font-heading font-medium" style={{ fontSize: '26px' }}>
              Giảm đến <span className="text-4xl font-bold">50%</span> 🎉
            </h3>
            <p className="text-white/80 text-xs">Áp dụng cho đơn hàng từ 299.000đ — Hôm nay thôi!</p>
          </div>

          {/* Countdown */}
          <div className="flex gap-3 relative z-10" id="countdown">
            {[
              { val: '05', label: 'Giờ' },
              { val: '32', label: 'Phút' },
              { val: '18', label: 'Giây' },
            ].map(t => (
              <div key={t.label} className="flex flex-col items-center">
                <div className="w-14 h-14 bg-white/20 rounded-btn flex items-center justify-center text-white font-bold text-xl border border-white/30 backdrop-blur-sm">
                  {t.val}
                </div>
                <div className="text-white/60 text-[10px] mt-1">{t.label}</div>
              </div>
            ))}
          </div>

          <button
            id="sale-banner-cta"
            className="relative z-10 bg-white text-primary font-medium text-sm px-8 py-3 rounded-btn shadow-red hover:shadow-none hover:bg-bg-light transition-all duration-280 whitespace-nowrap"
          >
            Mua ngay trước khi hết
          </button>
        </div>
      </div>
    </section>
  )
}

const ArrowSvg = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
)

export default BannerPromo
