import { useState, useEffect, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../../context/AdminAuthContext'

const AdminDashboard = () => {
  const { logout, authFetch, isAdmin } = useAdmin()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState(null)
  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: ChartIcon },
    { id: 'appointments', label: 'Lịch hẹn', icon: CalendarIcon },
    { id: 'products', label: 'Sản phẩm', icon: BoxIcon },
    { id: 'orders', label: 'Đơn hàng', icon: BagIcon },
  ]

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login')
      return
    }
    authFetch('/stats').then(setStats).catch(() => {})
  }, [isAdmin, navigate, authFetch])

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const active = tabs.find(tab => tab.id === activeTab)
  const ActiveIcon = active?.icon || ChartIcon

  return (
    <section className="bg-bg-light border-t border-border-light">
      <div className="container-site py-8">
        <div className="min-h-[76vh] grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          <aside className="bg-white border border-border-light rounded-card shadow-low overflow-hidden self-start lg:sticky lg:top-24">
            <div className="p-5 border-b border-border-light">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-red">
                  <PawIcon size={18} />
                </div>
                <div>
                  <p className="font-heading font-bold text-brown-dark text-sm leading-tight">Pet Shop</p>
                  <p className="text-[10px] text-muted uppercase tracking-wider">Admin workspace</p>
                </div>
              </div>
            </div>

            <nav className="p-3 space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon
                const selected = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-btn text-xs font-semibold transition-all duration-180 ${
                      selected
                        ? 'bg-primary text-white shadow-red'
                        : 'text-text-light hover:bg-bg-light hover:text-primary'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                )
              })}
            </nav>

            <div className="p-3 border-t border-border-light">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-btn text-xs font-semibold text-text-light hover:bg-red-50 hover:text-primary transition-colors"
              >
                <LogoutIcon size={16} />
                Đăng xuất
              </button>
            </div>
          </aside>

          <main className="min-w-0 space-y-6">
            <div className="bg-white border border-border-light rounded-card shadow-low p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <ActiveIcon size={19} />
                </div>
                <div>
                  <h1 className="font-heading font-bold text-brown-dark text-xl sm:text-2xl tracking-tight">
                    {active?.label}
                  </h1>
                  <p className="text-muted text-xs mt-0.5">Quản lý vận hành cửa hàng Pet Shop</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-2 self-start sm:self-center rounded-pill bg-accent/10 px-3 py-1.5 text-[11px] font-semibold text-accent">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                Online
              </div>
            </div>

            {activeTab === 'overview' && <OverviewTab stats={stats} />}
            {activeTab === 'appointments' && <AppointmentsTab authFetch={authFetch} />}
            {activeTab === 'products' && <ProductsTab authFetch={authFetch} />}
            {activeTab === 'orders' && <OrdersTab authFetch={authFetch} />}
          </main>
        </div>
      </div>
    </section>
  )
}

const OverviewTab = ({ stats }) => {
  if (!stats) return <LoadingSpinner />

  const cards = [
    { label: 'Tổng sản phẩm', value: stats.totalProducts, icon: BoxIcon },
    { label: 'Tổng đơn hàng', value: stats.totalOrders, icon: BagIcon },
    { label: 'Lịch hẹn', value: stats.totalAppointments, icon: CalendarIcon },
    { label: 'Chờ xác nhận', value: stats.pendingAppointments, icon: ClockIcon },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(card => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white border border-border-light rounded-card shadow-low p-5">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                <Icon size={18} />
              </div>
              <div className="text-2xl font-bold text-brown-dark">{card.value ?? 0}</div>
              <div className="text-xs text-muted mt-1 font-medium">{card.label}</div>
            </div>
          )
        })}
      </div>

      <Panel title="Hướng dẫn nhanh" icon={SparkIcon}>
        <div className="grid md:grid-cols-3 gap-3">
          {[
            'Theo dõi lịch hẹn và cập nhật trạng thái chăm sóc thú cưng.',
            'Thêm, sửa, xóa sản phẩm trong catalog cửa hàng.',
            'Kiểm tra đơn hàng và chuyển trạng thái giao hàng.',
          ].map(item => (
            <div key={item} className="rounded-btn border border-border-light bg-bg-light p-4 text-xs text-text-light leading-relaxed">
              {item}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  )
}

const AppointmentsTab = ({ authFetch }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setList(await authFetch('/appointments'))
    } catch {
      setList([])
    } finally {
      setLoading(false)
    }
  }, [authFetch])

  useEffect(() => {
    const timer = window.setTimeout(load, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  const updateStatus = async (id, status) => {
    try {
      const updated = await authFetch(`/appointments/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      setList(prev => prev.map(item => item.id === id ? updated : item))
    } catch (error) {
      console.warn(error.message)
    }
  }

  const del = async id => {
    if (!window.confirm('Xóa lịch hẹn này?')) return
    try {
      await authFetch(`/appointments/${id}`, { method: 'DELETE' })
      setList(prev => prev.filter(item => item.id !== id))
    } catch (error) {
      console.warn(error.message)
    }
  }

  const filtered = filter === 'ALL' ? list : list.filter(item => item.status === filter)

  return (
    <Panel title="Lịch hẹn chăm sóc" icon={CalendarIcon}>
      <StatusFilters
        value={filter}
        onChange={setFilter}
        items={list}
        labels={appointmentStatusLabel}
        statuses={['ALL', 'PENDING', 'CONFIRMED', 'DONE', 'CANCELLED']}
      />

      {loading ? <LoadingSpinner /> : filtered.length === 0 ? <EmptyState msg="Không có lịch hẹn nào" /> : (
        <div className="space-y-3 mt-5">
          {filtered.map(item => (
            <div key={item.id} className="rounded-card border border-border-light bg-white p-4 sm:p-5 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
              <div className="min-w-0 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-brown-dark text-sm">{item.customerName}</span>
                  <StatusBadge status={item.status} labels={appointmentStatusLabel} />
                  <span className="rounded-pill bg-bg-light px-2.5 py-1 text-[11px] font-semibold text-text-light">
                    {item.serviceType === 'grooming' ? 'Tắm grooming' : 'Gửi thú'}
                  </span>
                </div>
                <p className="text-xs text-muted">
                  {item.phone} · {item.date}{item.checkoutDate ? ` → ${item.checkoutDate}` : ''}{item.timeSlot ? ` · ${item.timeSlot}` : ''}
                </p>
                {item.notes && <p className="text-xs text-text-light italic">{item.notes}</p>}
              </div>
              <div className="flex gap-2 shrink-0 flex-wrap">
                {item.status === 'PENDING' && (
                  <ActionButton onClick={() => updateStatus(item.id, 'CONFIRMED')}>Xác nhận</ActionButton>
                )}
                {(item.status === 'PENDING' || item.status === 'CONFIRMED') && (
                  <ActionButton onClick={() => updateStatus(item.id, 'DONE')} variant="dark">Hoàn thành</ActionButton>
                )}
                {item.status !== 'CANCELLED' && (
                  <ActionButton onClick={() => updateStatus(item.id, 'CANCELLED')} variant="muted">Hủy</ActionButton>
                )}
                <IconButton onClick={() => del(item.id)} ariaLabel="Xóa lịch hẹn">
                  <TrashIcon size={14} />
                </IconButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}

const EMPTY_PRODUCT = {
  name: '',
  brand: '',
  price: '',
  oldPrice: '',
  discount: 0,
  category: 'Chó',
  stock: 100,
  imageUrl: '',
  hot: false,
}

const ProductsTab = ({ authFetch }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_PRODUCT)
  const [saving, setSaving] = useState(false)
  const [uploadingImg, setUploadingImg] = useState(false)
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [filterStock, setFilterStock] = useState('ALL')
  const [filterHot, setFilterHot] = useState('ALL')

  const uniqueBrands = useMemo(() => {
    return Array.from(new Set(list.map(p => p.brand).filter(Boolean))).sort()
  }, [list])

  const handleImageUpload = async e => {
    const file = e.target.files[0]
    if (!file) return

    setUploadingImg(true)
    const formData = new FormData()
    formData.append('file', file)
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'dpgr5y84c'
    const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'pethome_preset'
    formData.append('upload_preset', preset)

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) {
        throw new Error('Upload failed')
      }
      const data = await res.json()
      setForm(prev => ({ ...prev, imageUrl: data.secure_url }))
    } catch (err) {
      console.error(err)
      alert('Tải ảnh lên Cloudinary thất bại. Vui lòng cấu hình VITE_CLOUDINARY_CLOUD_NAME và VITE_CLOUDINARY_UPLOAD_PRESET trong file .env!')
    } finally {
      setUploadingImg(false)
    }
  }

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setList(await authFetch('/products'))
    } catch {
      setList([])
    } finally {
      setLoading(false)
    }
  }, [authFetch])

  useEffect(() => {
    const timer = window.setTimeout(load, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  const openNew = () => {
    setForm(EMPTY_PRODUCT)
    setEditing('new')
  }

  const openEdit = product => {
    setForm({ ...product, price: product.price ?? '', oldPrice: product.oldPrice ?? '' })
    setEditing(product)
  }

  const save = async () => {
    setSaving(true)
    try {
      const nextId = editing !== 'new'
        ? (Number(editing.id) || Number(form.id))
        : (Math.max(...list.map(p => Number(p.id) || 0), 0) + 1)

      const payload = {
        ...form,
        id: nextId,
        price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        discount: Number(form.discount) || 0,
        stock: Number(form.stock) || 0,
      }

      if (editing === 'new') {
        const created = await authFetch('/products', { method: 'POST', body: JSON.stringify(payload) })
        setList(prev => [...prev, created])
      } else {
        const updated = await authFetch(`/products/${editing.id}`, { method: 'PUT', body: JSON.stringify(payload) })
        setList(prev => prev.map(product => product.id === editing.id ? updated : product))
      }
      setEditing(null)
    } catch (error) {
      console.warn(error.message)
      alert('Không thể lưu sản phẩm: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const del = async id => {
    if (!window.confirm('Xóa sản phẩm này?')) return
    try {
      await authFetch(`/products/${id}`, { method: 'DELETE' })
      setList(prev => prev.filter(product => product.id !== id))
    } catch (error) {
      console.warn(error.message)
    }
  }

  const normalizedSearch = search.toLowerCase()
  const filtered = list.filter(product => {
    const matchSearch = product.name?.toLowerCase().includes(normalizedSearch) ||
                        product.brand?.toLowerCase().includes(normalizedSearch)
    const matchCategory = filterCategory === 'ALL' || product.category === filterCategory
    let matchStock = true
    if (filterStock === 'IN_STOCK') matchStock = (product.stock || 0) > 0
    if (filterStock === 'OUT_OF_STOCK') matchStock = (product.stock || 0) === 0
    const matchHot = filterHot === 'ALL' || (filterHot === 'HOT' && product.hot)
    return matchSearch && matchCategory && matchStock && matchHot
  })

  return (
    <>
      <Panel title="Catalog sản phẩm" icon={BoxIcon}>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
          <div className="relative flex-1 sm:col-span-2">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted">
              <SearchIcon size={15} />
            </span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Tìm theo tên, thương hiệu..."
              className={fieldCls + ' pl-10'}
            />
          </div>

          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className={fieldCls}
          >
            <option value="ALL">Tất cả danh mục</option>
            <option value="Chó">Chó</option>
            <option value="Mèo">Mèo</option>
            <option value="Phụ kiện">Phụ kiện</option>
          </select>

          <select
            value={filterStock}
            onChange={e => setFilterStock(e.target.value)}
            className={fieldCls}
          >
            <option value="ALL">Tất cả trạng thái kho</option>
            <option value="IN_STOCK">Còn hàng (&gt; 0)</option>
            <option value="OUT_OF_STOCK">Hết hàng (= 0)</option>
          </select>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-5 border-t border-border-light pt-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFilterHot(prev => prev === 'ALL' ? 'HOT' : 'ALL')}
              className={`px-3 py-1.5 rounded-pill border text-[11px] font-semibold transition-all ${
                filterHot === 'HOT'
                  ? 'bg-primary text-white border-primary shadow-red'
                  : 'bg-white text-text-light border-border-light hover:border-primary hover:text-primary'
              }`}
            >
              Chỉ sản phẩm HOT 🔥
            </button>
            {(filterCategory !== 'ALL' || filterStock !== 'ALL' || filterHot !== 'ALL' || search) && (
              <button
                type="button"
                onClick={() => {
                  setFilterCategory('ALL')
                  setFilterStock('ALL')
                  setFilterHot('ALL')
                  setSearch('')
                }}
                className="px-3 py-1.5 rounded-pill border border-border-light text-[11px] font-semibold text-text-light hover:bg-red-50 hover:text-primary transition-colors bg-white"
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>
          <button type="button" onClick={openNew} className="btn-accent rounded-btn px-5 py-2.5 text-xs font-semibold self-end sm:self-auto">
            <PlusIcon size={15} />
            Thêm sản phẩm
          </button>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="overflow-x-auto rounded-card border border-border-light">
            <table className="w-full text-xs">
              <thead className="bg-bg-light text-muted uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left font-bold">Sản phẩm</th>
                  <th className="px-4 py-3 text-left font-bold">Thương hiệu</th>
                  <th className="px-4 py-3 text-left font-bold">Danh mục</th>
                  <th className="px-4 py-3 text-right font-bold">Giá</th>
                  <th className="px-4 py-3 text-right font-bold">Tồn kho</th>
                  <th className="px-4 py-3 text-center font-bold">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light bg-white">
                {filtered.map(product => (
                  <tr key={product.id} className="hover:bg-bg-light/70 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-full bg-bg-light flex items-center justify-center text-lg shrink-0">
                          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-brown-dark font-semibold leading-snug line-clamp-2">{product.name}</p>
                          {product.hot && <span className="badge badge-red mt-1 text-[10px]">HOT</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-light">{product.brand}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-pill bg-bg-light px-2.5 py-1 font-semibold text-text-light">{product.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      {product.discount > 0 && product.oldPrice ? (
                        <>
                          <span className="font-bold text-primary block">{Number(product.price).toLocaleString('vi-VN')}đ</span>
                          <span className="text-[10px] text-muted line-through block">{Number(product.oldPrice).toLocaleString('vi-VN')}đ</span>
                          <span className="text-[10px] text-muted block">-{product.discount}%</span>
                        </>
                      ) : (
                        <span className="font-bold text-primary">{Number(product.oldPrice || product.price).toLocaleString('vi-VN')}đ</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-text-light">{product.stock}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 justify-center">
                        <IconButton onClick={() => openEdit(product)} ariaLabel="Sửa sản phẩm">
                          <EditIcon size={14} />
                        </IconButton>
                        <IconButton onClick={() => del(product.id)} ariaLabel="Xóa sản phẩm" tone="danger">
                          <TrashIcon size={14} />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <EmptyState msg="Không tìm thấy sản phẩm" />}
          </div>
        )}
      </Panel>

      {editing !== null && (
        <div className="fixed inset-0 bg-brown-dark/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-border-light rounded-card shadow-high p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h3 className="font-heading font-bold text-brown-dark text-lg">
                {editing === 'new' ? 'Thêm sản phẩm mới' : 'Sửa sản phẩm'}
              </h3>
              <button type="button" onClick={() => setEditing(null)} className="text-muted hover:text-primary transition-colors" aria-label="Đóng">
                <CloseIcon size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <FormField label="Tên sản phẩm">
                <input
                  value={form.name || ''}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="Hạt Royal Canin..."
                  className={fieldCls}
                />
              </FormField>

              <FormField label="Thương hiệu">
                <input
                  list="brand-list"
                  value={form.brand || ''}
                  onChange={e => setForm({ ...form, brand: e.target.value })}
                  placeholder="Chọn hoặc nhập thương hiệu..."
                  className={fieldCls}
                />
                <datalist id="brand-list">
                  {uniqueBrands.map(b => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </FormField>

              <FormField label="Hình ảnh sản phẩm">
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      value={form.imageUrl || ''}
                      onChange={e => setForm({ ...form, imageUrl: e.target.value })}
                      placeholder="https://... hoặc tải ảnh lên"
                      className={fieldCls + ' flex-1'}
                    />
                    <label className="shrink-0 bg-[#111111] hover:bg-primary text-white text-xs font-semibold px-4 py-2.5 rounded-btn flex items-center gap-1.5 cursor-pointer transition-colors select-none">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        disabled={uploadingImg}
                      />
                      {uploadingImg ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/25 border-t-white rounded-full animate-spin" />
                          <span>Đang tải...</span>
                        </>
                      ) : (
                        <>
                          <CloudUploadIcon size={14} />
                          <span>Tải ảnh</span>
                        </>
                      )}
                    </label>
                  </div>
                  {form.imageUrl && (
                    <div className="relative w-16 h-16 rounded-card border border-border-light overflow-hidden bg-bg-light flex items-center justify-center">
                      <img src={form.imageUrl} alt="Preview" className="w-full h-full object-contain p-1" />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, imageUrl: '' })}
                        className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] hover:bg-red-600 transition-colors shadow-sm"
                        title="Xóa hình ảnh"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </FormField>

              <div className="grid grid-cols-2 gap-4">
                <FormField label="Giá (VNĐ)">
                  <input
                    type="number"
                    value={form.price}
                    disabled
                    className={fieldCls + ' opacity-70 bg-bg-light/60 cursor-not-allowed'}
                  />
                </FormField>
                <FormField label="Giá gốc">
                  <input
                    type="number"
                    value={form.oldPrice || ''}
                    onChange={e => {
                      const oldP = Number(e.target.value) || 0
                      const disc = Number(form.discount) || 0
                      const newPrice = disc > 0 ? Math.round(oldP * (1 - disc / 100)) : oldP
                      setForm({ ...form, oldPrice: e.target.value, price: newPrice })
                    }}
                    className={fieldCls}
                  />
                </FormField>
                <FormField label="Giảm giá (%)">
                  <input
                    type="number"
                    value={form.discount}
                    onChange={e => {
                      const disc = Number(e.target.value) || 0
                      const oldP = Number(form.oldPrice) || 0
                      const newPrice = (disc > 0 && oldP) ? Math.round(oldP * (1 - disc / 100)) : (oldP || form.price)
                      setForm({ ...form, discount: e.target.value, price: newPrice })
                    }}
                    className={fieldCls}
                  />
                </FormField>
                <FormField label="Tồn kho">
                  <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} className={fieldCls} />
                </FormField>
              </div>

              <FormField label="Danh mục">
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className={fieldCls}>
                  <option>Chó</option>
                  <option>Mèo</option>
                  <option>Phụ kiện</option>
                </select>
              </FormField>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-text-light">
                <input type="checkbox" checked={form.hot} onChange={e => setForm({ ...form, hot: e.target.checked })} className="accent-primary" />
                Đánh dấu HOT
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setEditing(null)} className="flex-1 btn-outline rounded-btn py-2.5 text-xs font-semibold">
                Hủy
              </button>
              <button type="button" onClick={save} disabled={saving} className="flex-1 btn-accent rounded-btn py-2.5 text-xs font-semibold disabled:opacity-60">
                {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const OrdersTab = ({ authFetch }) => {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setList(await authFetch('/orders'))
    } catch {
      setList([])
    } finally {
      setLoading(false)
    }
  }, [authFetch])

  useEffect(() => {
    const timer = window.setTimeout(load, 0)
    return () => window.clearTimeout(timer)
  }, [load])

  const updateStatus = async (id, status) => {
    try {
      const updated = await authFetch(`/orders/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      setList(prev => prev.map(order => order.id === id ? updated : order))
    } catch (error) {
      console.warn(error.message)
    }
  }

  return (
    <Panel title="Đơn hàng" icon={BagIcon}>
      {loading ? <LoadingSpinner /> : list.length === 0 ? <EmptyState msg="Chưa có đơn hàng nào" /> : (
        <div className="space-y-3">
          {list.map(order => (
            <div key={order.id} className="rounded-card border border-border-light bg-white p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-brown-dark text-sm">{order.customerName}</span>
                    <StatusBadge status={order.status} labels={orderStatusLabel} />
                  </div>
                  <p className="text-xs text-muted">{order.phone} · {order.address}</p>
                  <p className="text-[11px] text-muted">{order.createdAt ? new Date(order.createdAt).toLocaleString('vi-VN') : ''}</p>
                </div>
                <div className="sm:text-right shrink-0">
                  <p className="font-bold text-primary text-base">{Number(order.total || 0).toLocaleString('vi-VN')}đ</p>
                  <p className="text-xs text-muted">{order.items?.length || 0} sản phẩm</p>
                </div>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="bg-bg-light rounded-card p-3 mb-4 space-y-1.5">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between gap-4 text-xs text-text-light">
                      <span>{item.productName || item.name || `SP #${item.productId}`} x {item.quantity}</span>
                      <span className="font-semibold">{Number((item.price || 0) * item.quantity).toLocaleString('vi-VN')}đ</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 flex-wrap">
                {['PROCESSING', 'SHIPPED', 'DELIVERED'].map(status => (
                  order.status !== status && order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                    <ActionButton key={status} onClick={() => updateStatus(order.id, status)}>
                      {orderStatusLabel[status]}
                    </ActionButton>
                  )
                ))}
                {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                  <ActionButton onClick={() => updateStatus(order.id, 'CANCELLED')} variant="muted">
                    Hủy đơn
                  </ActionButton>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}

const appointmentStatusLabel = {
  ALL: 'Tất cả',
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  CANCELLED: 'Đã hủy',
  DONE: 'Hoàn thành',
}

const orderStatusLabel = {
  PENDING: 'Chờ xử lý',
  PROCESSING: 'Đang xử lý',
  SHIPPED: 'Đang giao',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
}

const statusTone = {
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
  CONFIRMED: 'bg-accent/10 text-accent border-accent/20',
  DONE: 'bg-blue-50 text-blue-700 border-blue-200',
  PROCESSING: 'bg-blue-50 text-blue-700 border-blue-200',
  SHIPPED: 'bg-violet-50 text-violet-700 border-violet-200',
  DELIVERED: 'bg-accent/10 text-accent border-accent/20',
  CANCELLED: 'bg-red-50 text-primary border-red-200',
}

const fieldCls = 'w-full bg-bg-light border border-border-light rounded-btn px-4 py-2.5 text-xs text-brown-dark placeholder-muted outline-none focus:border-primary/40 focus:bg-white transition-all'

const Panel = ({ title, icon: Icon, children }) => (
  <section className="bg-white border border-border-light rounded-card shadow-low p-5 sm:p-6">
    <div className="flex items-center gap-3 mb-5">
      <span className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
        <Icon size={16} />
      </span>
      <h2 className="font-heading font-bold text-brown-dark text-base">{title}</h2>
    </div>
    {children}
  </section>
)

const StatusFilters = ({ value, onChange, items, labels, statuses }) => (
  <div className="flex gap-2 flex-wrap">
    {statuses.map(status => (
      <button
        key={status}
        type="button"
        onClick={() => onChange(status)}
        className={`px-3 py-1.5 rounded-pill border text-[11px] font-semibold transition-all ${
          value === status
            ? 'bg-primary text-white border-primary shadow-red'
            : 'bg-white text-text-light border-border-light hover:border-primary hover:text-primary'
        }`}
      >
        {labels[status]} ({status === 'ALL' ? items.length : items.filter(item => item.status === status).length})
      </button>
    ))}
  </div>
)

const StatusBadge = ({ status, labels }) => (
  <span className={`rounded-pill border px-2.5 py-1 text-[11px] font-bold ${statusTone[status] || 'bg-bg-light text-text-light border-border-light'}`}>
    {labels[status] || status}
  </span>
)

const ActionButton = ({ children, onClick, variant = 'primary' }) => {
  const cls = variant === 'dark'
    ? 'bg-brown-dark text-white border-brown-dark hover:bg-brown-warm'
    : variant === 'muted'
      ? 'bg-white text-text-light border-border-light hover:border-primary hover:text-primary'
      : 'bg-primary text-white border-primary hover:bg-secondary'

  return (
    <button type="button" onClick={onClick} className={`px-3 py-1.5 rounded-btn border text-[11px] font-semibold transition-colors ${cls}`}>
      {children}
    </button>
  )
}

const IconButton = ({ children, onClick, ariaLabel, tone = 'default' }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label={ariaLabel}
    title={ariaLabel}
    className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
      tone === 'danger'
        ? 'border-red-100 bg-red-50 text-primary hover:bg-primary hover:text-white'
        : 'border-border-light bg-white text-text-light hover:border-primary hover:text-primary'
    }`}
  >
    {children}
  </button>
)

const FormField = ({ label, children }) => (
  <div className="space-y-1.5">
    <label className="block text-[11px] font-bold text-brown-dark uppercase tracking-wider">{label}</label>
    {children}
  </div>
)

const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-16 text-muted text-xs">
    <div className="w-6 h-6 border-2 border-border-light border-t-primary rounded-full animate-spin mr-3" />
    Đang tải...
  </div>
)

const EmptyState = ({ msg }) => (
  <div className="text-center py-14 text-muted text-xs bg-white">{msg}</div>
)

const Svg = ({ size = 16, children, ...props }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    {children}
  </svg>
)

const PawIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <ellipse cx="6" cy="6.5" rx="2" ry="3" />
    <ellipse cx="17.5" cy="5.5" rx="2" ry="3" />
    <ellipse cx="2" cy="14" rx="2" ry="3" transform="rotate(-45 2 14)" />
    <ellipse cx="22" cy="14" rx="2" ry="3" transform="rotate(45 22 14)" />
    <path d="M12 12c-4 0-7 3-7 6s2.5 4 7 4 7-1 7-4-3-6-7-6z" />
  </svg>
)
const ChartIcon = ({ size }) => <Svg size={size}><path d="M3 3v18h18" /><path d="M8 17V9" /><path d="M13 17V5" /><path d="M18 17v-6" /></Svg>
const CalendarIcon = ({ size }) => <Svg size={size}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" /></Svg>
const BoxIcon = ({ size }) => <Svg size={size}><path d="M21 8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></Svg>
const BagIcon = ({ size }) => <Svg size={size}><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></Svg>
const ClockIcon = ({ size }) => <Svg size={size}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></Svg>
const SparkIcon = ({ size }) => <Svg size={size}><path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8Z" /><path d="M5 3v4" /><path d="M3 5h4" /><path d="M19 17v4" /><path d="M17 19h4" /></Svg>
const LogoutIcon = ({ size }) => <Svg size={size}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5" /><path d="M21 12H9" /></Svg>
const SearchIcon = ({ size }) => <Svg size={size}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></Svg>
const PlusIcon = ({ size }) => <Svg size={size}><path d="M12 5v14" /><path d="M5 12h14" /></Svg>
const EditIcon = ({ size }) => <Svg size={size}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></Svg>
const TrashIcon = ({ size }) => <Svg size={size}><path d="M3 6h18" /><path d="M8 6V4h8v2" /><path d="M19 6l-1 14H6L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></Svg>
const CloseIcon = ({ size }) => <Svg size={size}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></Svg>
const CloudUploadIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

export default AdminDashboard
