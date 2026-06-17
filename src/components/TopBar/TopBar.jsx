import './TopBar.css'

const TopBar = () => {
  return (
    <div className="topbar" role="banner">
      <div className="container topbar__inner">
        <div className="topbar__left">
          <span className="topbar__item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82a19.79 19.79 0 01-3.07-8.63A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
            1800.xxxx
          </span>
          <span className="topbar__item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            contact@petshome.vn
          </span>
          <span className="topbar__item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
            45 Nguyễn Trãi, TP. HCM
          </span>
        </div>
        <div className="topbar__right">
          <a href="#" className="topbar__link">Theo dõi đơn hàng</a>
          <a href="#" className="topbar__link">Hệ thống cửa hàng</a>
          <a href="#" className="topbar__link">Liên hệ</a>
        </div>
      </div>
    </div>
  )
}

export default TopBar
