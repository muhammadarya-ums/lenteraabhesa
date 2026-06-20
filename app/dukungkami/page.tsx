'use client'

import React, { useState, useEffect } from 'react'
import { ArrowRight, Loader2, X, ShoppingBag } from 'lucide-react'
import Image from "next/image"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// ==========================================
// 1. COMPONENT: Navbar
// ==========================================
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
    <nav className="w-full bg-white sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Lentera Abhesa" width={140} height={60} priority className="cursor-pointer object-contain" />
          </Link>
        </div>
        <div className="hidden md:flex gap-8 items-center">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.path) && (item.path !== '/' || pathname === '/')
            return (
              <Link 
                key={item.name} 
                href={item.path} 
                className={`text-[15px] font-semibold transition-colors ${
                  isActive ? 'text-[#005C43]' : 'text-gray-500 hover:text-[#005C43]'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>
        <Link href="/dukungkami" className="hidden md:block bg-[#005C43] text-white rounded-full px-6 py-2.5 font-bold text-[14px] hover:opacity-90 transition-opacity text-center shadow-md">
          Dukung Kami
        </Link>
        <button className="md:hidden p-2 text-[#005C43] bg-gray-50 rounded-lg" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : '☰'}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top-4">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.path) && (item.path !== '/' || pathname === '/')
            return (
              <Link 
                key={item.name} 
                href={item.path} 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={`text-left font-bold transition-colors ${
                  isActive ? 'text-[#005C43]' : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
          <Link href="/dukungkami" className="w-full bg-[#005C43] text-white rounded-full px-6 py-3 font-bold text-[15px] hover:opacity-90 transition-opacity text-center mt-2 shadow-md">
            Dukung Kami
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
// Updated interface to match 'produk' table
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
  const [formData, setFormData] = useState({ name: '', wa: '', address: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Nomor WA Admin (Ganti dengan nomor WA Anda yang aktif)
  const ADMIN_WA_NUMBER = "6281234567890" 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Changed from 'merchandise' to 'produk'
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
      // Updated payload to match your 'pesanan' table schema
      const payload = {
        produk_id: selectedProduct.id,
        nama_pembeli: formData.name,
        kontak_pembeli: formData.wa, // Mapping to kontak_pembeli
        jumlah: 1, // Defaulting to 1 for now, can be made dynamic later
        total_harga: selectedProduct.harga, // Assuming 1 quantity
        status: 'pending',
        // Assuming your table doesn't have an explicit 'alamat_kirim' column based on the ERD, 
        // but if it does (like in the admin code), you might need to append it to the WA message 
        // or add it to the database if the column exists. 
        // I will include it in the WA message for sure.
      }

      // If your actual table has an address field, uncomment the line below and adjust the key name
      // (payload as any).alamat_kirim = formData.address;

      const { error } = await supabase.from('pesanan').insert([payload])
      if (error) throw error

      // Redirect ke WhatsApp Admin
      const waMessage = `Halo Admin Lentera Abhesa, saya ingin memesan merchandise:\n\n*Produk:* ${selectedProduct.nama}\n*Harga:* Rp ${selectedProduct.harga.toLocaleString('id-ID')}\n\n*Data Pengiriman:*\nNama: ${formData.name}\nNo. WA: ${formData.wa}\nAlamat Lengkap: ${formData.address}\n\nMohon informasi ongkos kirim dan instruksi pembayarannya. Terima kasih.`
      const waUrl = `https://wa.me/${ADMIN_WA_NUMBER}?text=${encodeURIComponent(waMessage)}`
      
      setIsModalOpen(false)
      setFormData({ name: '', wa: '', address: '' })
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-[32px] w-full max-w-lg p-8 relative animate-in zoom-in-95 duration-200 shadow-2xl">
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
                  Lengkapi data untuk pesanan <span className="font-bold text-[#005C43]">"{selectedProduct.nama}"</span> seharga <span className="font-bold text-gray-700">Rp {selectedProduct.harga.toLocaleString('id-ID')}</span>.
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
                
                <div className="pt-4">
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
const Footer = () => (
  <footer className="w-full bg-white py-16 px-8 border-t border-gray-100">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div className="flex flex-col md:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <Image src="/logo.png" alt="Lentera Abhesa" width={160} height={80} priority />
          </div>
          <p className="text-sm text-gray-500 font-medium leading-relaxed">
            Platform digital untuk melestarikan bahasa dan sastra Bawean.
          </p>
        </div>
        <div className="flex flex-col">
          <h4 className="font-bold text-gray-900 text-base mb-4 uppercase tracking-wider text-xs">Navigasi</h4>
          <ul className="space-y-3 text-sm font-semibold text-gray-500 flex flex-col">
            <li><Link href="/" className="hover:text-[#005C43] transition-colors">Beranda</Link></li>
            <li><Link href="/kamus" className="hover:text-[#005C43] transition-colors">Kamus</Link></li>
            <li><Link href="/sejarah" className="hover:text-[#005C43] transition-colors">Sejarah</Link></li>
            <li><Link href="/game" className="hover:text-[#005C43] transition-colors flex items-center gap-1">Game 🚀</Link></li>
          </ul>
        </div>
        <div className="flex flex-col">
          <h4 className="font-bold text-gray-900 text-base mb-4 uppercase tracking-wider text-xs">Media Sosial</h4>
          <ul className="space-y-3 text-sm font-semibold text-gray-500">
            <li><a href="#" className="hover:text-[#005C43] transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-[#005C43] transition-colors">Facebook</a></li>
            <li><a href="#" className="hover:text-[#005C43] transition-colors">YouTube</a></li>
          </ul>
        </div>
        <div className="flex flex-col">
          <h4 className="font-bold text-gray-900 text-base mb-4 uppercase tracking-wider text-xs">Kontak</h4>
          <ul className="space-y-3 text-sm font-semibold text-gray-500">
            <li><a href="mailto:info@lenteraabhesa.com" className="hover:text-[#005C43] transition-colors">hello@lenteraabhesa.com</a></li>
            <li><a href="tel:+62000000000" className="hover:text-[#005C43] transition-colors">+62 812 3456 7890</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm font-semibold text-gray-400">© 2026 Lentera Abhesa. All rights reserved.</p>
        <div className="flex gap-4">
          <Link href="#" className="text-sm font-semibold text-gray-400 hover:text-gray-600">Privacy Policy</Link>
          <Link href="#" className="text-sm font-semibold text-gray-400 hover:text-gray-600">Terms of Service</Link>
        </div>
      </div>
    </div>
  </footer>
)

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