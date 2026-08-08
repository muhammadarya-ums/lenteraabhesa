'use client'

import React, { useState, useEffect } from 'react'
import { ArrowRight, Loader2, X, ShoppingBag, Phone, MessageCircle } from 'lucide-react'
import Image from "next/image"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// 1. COMPONENT: Navbar
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Kamus', path: '/kamus' },
    { name: 'Sejarah', path: '/sejarah' },
    { name: 'Game 🚀', path: '/game' },
    { name: 'Tentang Kami', path: '/tentang-kami' },
  ]

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Lentera Abhesa" width={90} height={30} priority className="cursor-pointer" />
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-8">
          {menuItems.map((item) => {
            const isActive = item.name === 'Tentang Kami'
            return (
              <Link 
                key={item.name} 
                href={item.path} 
                className={`text-[15px] font-medium transition-colors ${
                  isActive ? 'text-[#005C43] font-bold' : 'text-gray-500 hover:text-[#005C43]'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>

        {/* Right Buttons (Desktop Only) -> Dibungkus div biar justify-between rapi */}
        <div className="hidden md:flex items-center gap-3">
          <Link 
            href="/dukungkami" 
            className="bg-[#005C43] text-white rounded-full px-6 py-2.5 font-medium text-[15px] hover:opacity-90 transition-opacity text-center"
          >
            Dukung Kami
          </Link>
          <Link 
            href="/tanya-lentera" 
            className="border-2 border-[#005C43] text-[#005C43] rounded-full px-6 py-2.5 font-medium text-[15px] hover:bg-gray-50 transition-colors text-center"
          >
            Tanya Lentera AI
          </Link>
        </div>

        {/* Hamburger Icon (Mobile) */}
        <button className="md:hidden p-2 text-[#005C43]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-6 flex flex-col gap-4">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path} 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="text-left font-semibold text-gray-700"
            >
              {item.name}
            </Link>
          ))}
          
          {/* Bagian ini gue ilangin hidden md:block-nya biar beneran muncul di HP */}
          <Link 
            href="/dukungkami" 
            className="w-full bg-[#005C43] text-white rounded-full px-6 py-2.5 font-medium text-[15px] hover:opacity-90 transition-opacity text-center mt-2"
          >
            Dukung Kami
          </Link>
          <Link 
            href="/tanya-lentera" 
            className="w-full border-2 border-[#005C43] text-[#005C43] rounded-full px-6 py-2.5 font-medium text-[15px] hover:bg-gray-50 transition-colors text-center"
          >
            Tanya Lentera AI
          </Link>
        </div>
      )}
    </nav>
  )
}
// ==========================================
// 2. COMPONENT: Hero Section
// ==========================================
const HeroSection = () => (
  <section className="w-full px-6 pt-16 pb-12 bg-linear-to-b from-emerald-50/50 to-white text-center">
    <div className="max-w-4xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/50 border border-emerald-200 text-emerald-700 font-bold text-xs uppercase tracking-wider mb-6">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        Official Store
      </div>
      <h1 className="text-[36px] md:text-[44px] font-black text-[#005C43] leading-tight mb-6 tracking-tight drop-shadow-sm">
        Belajar, Melestarikan, dan <br className="hidden md:block" /> Mendukung Bahasa Lokal
      </h1>
      <p className="text-gray-600 text-[16px] md:text-[18px] leading-relaxed max-w-[800px] mx-auto text-center font-medium">
        Abhesa halus adalah warisan yang perlu dijaga bersama. Melalui pembelian buku dan merchandise resmi, Anda turut mendukung pengembangan konten edukasi, program pembelajaran, dan pelestarian bahasa daerah untuk generasi mendatang.
      </p>
    </div>
  </section>
)

// ==========================================
// 3. COMPONENT: Products Grid & Checkout
// ==========================================
interface Product {
  id: string
  nama: string
  deskripsi: string
  harga: number
  stok: number
  gambar_url: string
}

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  
  // Checkout Modal States
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  // State form sudah mencakup varian dan jumlah
  const [formData, setFormData] = useState({ 
    name: '', 
    wa: '', 
    address: '',
    jumlah: 1,
    varian: '' 
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const ADMIN_WA_NUMBER = "6282335859946" 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('produk').select('*').order('created_at', { ascending: false })
        if (error) throw error
        setProducts(data || [])
      } catch (err) {
        console.error("Gagal mengambil produk:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProduct) return
    setIsSubmitting(true)

    try {
      const totalHarga = selectedProduct.harga * formData.jumlah

      // Payload lengkap untuk database
      const payload = {
        produk_id: selectedProduct.id,
        nama_pembeli: formData.name,
        kontak_pembeli: formData.wa,
        alamat_kirim: formData.address, // Disimpan ke DB
        jumlah: formData.jumlah,
        varian: formData.varian || null,
        total_harga: totalHarga,
        status: 'pending',
      }

      // Insert dan minta data kembalian untuk mendapatkan ID
      const { data, error } = await supabase
        .from('pesanan')
        .insert([payload])
        .select()
        .single()

      if (error) throw error

      const orderId = data.id // Tracking ID

      // Redirect ke WhatsApp Admin dengan format pesan yang rapi dan profesional
      const waMessage = `Halo Admin Lentera Abhesa, saya ingin memproses pesanan baru.\n\n*ORDER ID: ${orderId}*\n_(Simpan Order ID ini untuk mengecek status pesanan)_\n\n*Detail Pesanan:*\n- Produk: ${selectedProduct.nama}\n- Varian: ${formData.varian || '-'}\n- Jumlah: ${formData.jumlah} pcs\n- Total Harga: Rp ${totalHarga.toLocaleString('id-ID')}\n\n*Data Pengiriman:*\n- Nama: ${formData.name}\n- No. WA: ${formData.wa}\n- Alamat Lengkap: ${formData.address}\n\nMohon informasi total biaya (termasuk ongkir) dan instruksi pembayarannya. Saya akan mengirimkan bukti transfer di chat ini. Terima kasih.`
      
      const waUrl = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(waMessage)}`
      
      setIsModalOpen(false)
      setFormData({ name: '', wa: '', address: '', jumlah: 1, varian: '' }) // Reset state form
      window.open(waUrl, '_blank')

    } catch (err: any) {
      alert("Terjadi kesalahan saat memproses pesanan: " + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="w-full py-32 flex flex-col justify-center items-center gap-4 bg-white">
        <Loader2 className="w-10 h-10 text-[#005C43] animate-spin" />
        <p className="font-bold text-gray-500">Memuat Katalog Produk...</p>
      </div>
    )
  }

  return (
    <section className="w-full px-6 py-12 bg-white">
      <div className="max-w-6xl mx-auto relative">
        
        {products.length === 0 ? (
          <div className="text-center py-20 px-4 bg-gray-50 rounded-[32px] border border-gray-100 shadow-sm">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <ShoppingBag className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum Ada Merchandise</h3>
            <p className="font-medium text-gray-500">Katalog produk saat ini sedang kosong. Silakan kembali lagi nanti.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-[24px] border border-gray-100 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
                
                {/* Product Image */}
                <div className="w-full aspect-[4/5] rounded-[16px] overflow-hidden relative mb-5 bg-[#F8F9FA]">
                  {product.gambar_url ? (
                    <Image 
                      src={product.gambar_url} 
                      alt={product.nama} 
                      fill 
                      sizes="(max-w-768px) 100vw, 25vw" 
                      priority 
                      className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                       <ShoppingBag className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  
                  {/* Stock Badge */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm">
                    {product.stok > 0 ? (
                      <span className="text-[#005C43]">Stok: {product.stok}</span>
                    ) : (
                      <span className="text-red-500">Habis</span>
                    )}
                  </div>
                </div>
                
                {/* Product Details */}
                <div className="px-1 mb-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-900 text-[16px] leading-snug mb-1.5 line-clamp-2">{product.nama}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3 leading-relaxed flex-1">{product.deskripsi || 'Merchandise resmi Lentera Abhesa.'}</p>
                  <p className="text-[#005C43] text-[18px] font-black tracking-tight">Rp {product.harga.toLocaleString('id-ID')}</p>
                </div>

                {/* Action Button */}
                <button 
                  onClick={() => handleBuyClick(product)} 
                  disabled={product.stok <= 0}
                  className={`w-full text-white rounded-xl py-3.5 px-4 font-bold text-[14px] flex items-center justify-center gap-2 transition-all ${
                    product.stok > 0 
                      ? 'bg-[#005C43] shadow-[0_4px_0_#004733] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#004733] active:translate-y-0 active:shadow-none' 
                      : 'bg-gray-300 cursor-not-allowed opacity-70'
                  }`}
                >
                  <span>{product.stok > 0 ? 'Beli Sekarang' : 'Stok Habis'}</span>
                  {product.stok > 0 && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Modal Checkout */}
        {isModalOpen && selectedProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-[32px] w-full max-w-lg p-8 relative animate-in zoom-in-95 duration-200 shadow-2xl my-8">
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="absolute right-6 top-6 p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-8 pr-10">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-50 rounded-2xl mb-4">
                  <ShoppingBag className="w-6 h-6 text-[#005C43]" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">Form Pengiriman</h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Lengkapi data untuk pesanan <span className="font-bold text-[#005C43]">"{selectedProduct.nama}"</span>.
                </p>
              </div>

              <form onSubmit={handleCheckout} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nama Lengkap *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-semibold text-gray-900 focus:border-[#005C43] focus:ring-1 focus:ring-[#005C43] outline-none transition-all" 
                    placeholder="Masukkan nama Anda" 
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">No. WhatsApp Aktif *</label>
                  <input 
                    required 
                    type="tel" 
                    value={formData.wa} 
                    onChange={e => setFormData({...formData, wa: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-semibold text-gray-900 focus:border-[#005C43] focus:ring-1 focus:ring-[#005C43] outline-none transition-all" 
                    placeholder="0812xxxxxx" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Alamat Pengiriman *</label>
                  <textarea 
                    required 
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-semibold text-gray-900 h-28 focus:border-[#005C43] focus:ring-1 focus:ring-[#005C43] outline-none resize-none custom-scrollbar transition-all" 
                    placeholder="Jalan, RT/RW, Desa, Kecamatan, Kota, Kode Pos" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Varian / Ukuran</label>
                    <input 
                      type="text" 
                      value={formData.varian} 
                      onChange={e => setFormData({...formData, varian: e.target.value})} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-semibold text-gray-900 focus:border-[#005C43] focus:ring-1 focus:ring-[#005C43] outline-none transition-all" 
                      placeholder="Misal: L, M, Biru" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Jumlah *</label>
                    <input 
                      required 
                      type="number" 
                      min="1"
                      max={selectedProduct.stok}
                      value={formData.jumlah} 
                      onChange={e => setFormData({...formData, jumlah: parseInt(e.target.value) || 1})} 
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-sm font-semibold text-gray-900 focus:border-[#005C43] focus:ring-1 focus:ring-[#005C43] outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="py-3 flex justify-between items-center border-t border-gray-100 mt-4">
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Harga:</span>
                  <span className="text-xl font-black text-[#005C43]">
                    Rp {(selectedProduct.harga * formData.jumlah).toLocaleString('id-ID')}
                  </span>
                </div>
                
                <div className="pt-2">
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full bg-[#005C43] text-white py-4 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 shadow-[0_4px_0_#004733] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#004733] active:translate-y-0 active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Memproses...</>
                    ) : (
                      'Lanjut ke Pembayaran (WhatsApp)'
                    )}
                  </button>
                  <p className="text-center text-[11px] font-bold text-gray-400 mt-4 uppercase tracking-wide">
                    Anda akan diarahkan ke WhatsApp Admin
                  </p>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </section>
  )
}

// ==========================================
// 4. COMPONENT: Value Proposition
// ==========================================
const ValueSection = () => {
  const values = [
    { number: "1", text: "Melestarikan dan mendokumentasikan kosakata abhesa halus dan budaya lokal" },
    { number: "2", text: "Menyediakan sumber belajar yang mudah diakses kapanpun dan dimanapun" },
    { number: "3", text: "Memperluas jangkauan edukasi bahasa daerah ke lebih banyak sekolah dan komunitas" },
    { number: "4", text: "Mengembangkan materi pembelajaran yang lebih berkualitas" }
  ]

  return (
    <section className="w-full px-6 py-20 bg-[#F8F9FA] border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-[28px] md:text-[36px] font-black text-gray-900 leading-tight mb-10 max-w-md">
          Mengapa dukungan <span className="text-[#005C43]">Anda penting?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {values.map((item) => (
            <div key={item.number} className="bg-white rounded-[24px] p-6 flex items-start gap-5 shadow-sm border border-gray-100">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#005C43] flex items-center justify-center font-black text-[18px] shrink-0 border border-emerald-100">
                {item.number}
              </div>
              <p className="text-gray-700 text-[15px] font-medium leading-relaxed pt-1">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==========================================
// 5. COMPONENT: Footer
// ==========================================
// 6. COMPONENT: Footer
const Footer = () => {
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)

  const adminContacts = [
    {
      name: "Admin 1 (Lentera Abhesa)",
      number: "+62 812-1744-7473",
      waLink: "https://wa.me/6281217447473?text=Halo%20Admin%201%20Lentera%20Abhesa,%20saya%20ingin%20bertanya...",
    },
    {
      name: "Admin 2 (Lentera Abhesa)",
      number: "+62 851-5852-4995",
      waLink: "https://wa.me/6285158524995?text=Halo%20Admin%202%20Lentera%20Abhesa,%20saya%20ingin%20bertanya...",
    }
  ]

  return (
    <>
      <footer className="w-full bg-[#EAF2ED] py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <Image src="/logo.png" alt="Lentera Abhesa" width={180} height={100} priority />
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                Platform digital untuk melestarikan bahasa dan sastra Bawean
              </p>
            </div>

            <div className="flex flex-col">
              <h4 className="font-bold text-[#005C43] text-base mb-3">Navigasi</h4>
              <ul className="space-y-2 text-sm text-gray-700 flex flex-col">
                <li><Link href="/" className="hover:text-[#005C43] transition-colors">Beranda</Link></li>
                <li><Link href="/kamus" className="hover:text-[#005C43] transition-colors">Kamus</Link></li>
                <li><Link href="/sejarah" className="hover:text-[#005C43] transition-colors">Sejarah</Link></li>
                <li><Link href="/facebookgame" className="hover:text-[#005C43] transition-colors">Game🚀</Link></li>
              </ul>
            </div>

            <div className="flex flex-col">
              <h4 className="font-bold text-[#005C43] text-base mb-3">Media Sosial</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><a href="https://www.instagram.com/lentera.abhesa?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="hover:text-[#005C43] transition-colors">Instagram</a></li>
                <li><a href="https://www.facebook.com/share/1LtwHxumjB/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="hover:text-[#005C43] transition-colors">Facebook</a></li>
                <li><a href="https://x.com/Lenteraabhesa" target="_blank" rel="noopener noreferrer" className="hover:text-[#005C43] transition-colors">Twitter</a></li>
              </ul>
            </div>

            <div className="flex flex-col">
              <h4 className="font-bold text-[#005C43] text-base mb-3">Kontak</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><a href="mailto:lenteraabhesa@gmail.com" className="hover:text-[#005C43] transition-colors">Email</a></li>
                <li>
                  {/* Diganti jadi Button supaya buka Modal Pop-up */}
                  <button 
                    onClick={() => setIsPhoneModalOpen(true)} 
                    className="hover:text-[#005C43] transition-colors text-left cursor-pointer"
                  >
                    Phone
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-300 pt-6 text-center">
            <p className="text-sm text-gray-700">© 2026 Lentera Abhesa. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ================= MODAL POP-UP PILIH ADMIN ================= */}
      {isPhoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-gray-100">
            {/* Tombol Close */}
            <button
              onClick={() => setIsPhoneModalOpen(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header Modal */}
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-[#EAF2ED] flex items-center justify-center text-[#005C43]">
                <Phone size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#005C43]">Hubungi Admin</h3>
                <p className="text-xs text-gray-500">Pilih salah satu nomor admin di bawah</p>
              </div>
            </div>

            {/* List Pilihan Admin */}
            <div className="mt-5 space-y-3">
              {adminContacts.map((admin, idx) => (
                <a
                  key={idx}
                  href={admin.waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 hover:border-[#005C43] hover:bg-[#F4F9F6] transition-all group"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-gray-500 group-hover:text-[#005C43]">
                      {admin.name}
                    </span>
                    <span className="text-sm font-bold text-gray-800 mt-0.5">
                      {admin.number}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#005C43] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MessageCircle size={16} />
                  </div>
                </a>
              ))}
            </div>

            {/* Footer Modal */}
            <p className="text-[11px] text-gray-400 text-center mt-5">
              Klik kotak untuk membuka obrolan via WhatsApp
            </p>
          </div>
        </div>
      )}
    </>
  )
}

// ==========================================
// 6. MAIN PAGE CONTAINER EXPORT
// ==========================================
export default function DukungKamiPage() {
  return (
    <main className="w-full min-h-screen bg-white font-sans antialiased text-gray-900 selection:bg-emerald-100 selection:text-emerald-900">
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <ValueSection />
      <Footer />
    </main>
  )
}