'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Search, Loader2 } from 'lucide-react'
import Image from "next/image"
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// ==========================================
// 1. INTERFACE DATA (DISESUAIKAN DENGAN DATABASE & ADMIN)
// ==========================================
interface SejarahArticle {
  id: string | number
  slug: string
  judul: string          // Mengganti title -> judul
  kategori: string       // Mengganti category -> kategori
  penulis: string        // Mengganti author -> penulis
  konten: string         // Mengganti content -> konten
  gambar_url: string | null // Mengganti imageUrl -> gambar_url
  created_at: string     // Mengganti createdAt -> created_at
}

// ==========================================
// 3. COMPONENT: Navbar (Identik dengan aslinya)
// ==========================================
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const menuItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Kamus', path: '/kamus' },
    { name: 'Sejarah', path: '/sejarah' },
    { name: 'Game🚀', path: '/game' },
    { name: 'Tentang Kami', path: '/tentang-kami' },
  ]

  return (
    <nav className="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Lentera Abhesa" width={100} height={50} priority className="cursor-pointer" />
          </Link>
        </div>

        <div className="hidden md:flex gap-6">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.path) && (item.path !== '/' || pathname === '/')
            return (
              <Link 
                key={item.name} 
                href={item.path} 
                className={`text-sm font-semibold transition-colors ${
                  isActive ? 'text-[#005C43]' : 'text-gray-700 hover:text-[#005C43]'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
        </div>

        <Link 
          href="/dukungkami" 
          className="hidden md:block bg-[#005C43] text-white rounded-full px-6 py-2 font-bold text-sm hover:opacity-90 transition-opacity"
        >
          Dukung Kami
        </Link>

        <button className="md:hidden p-2 text-[#005C43]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-6 flex flex-col gap-4">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.path) && (item.path !== '/' || pathname === '/')
            return (
              <Link 
                key={item.name} 
                href={item.path} 
                onClick={() => setIsMobileMenuOpen(false)} 
                className={`text-left font-semibold transition-colors ${
                  isActive ? 'text-[#005C43]' : 'text-gray-700'
                }`}
              >
                {item.name}
              </Link>
            )
          })}
          <Link 
            href="/dukungkami" 
            className="w-full bg-[#005C43] text-white rounded-full py-3 font-bold text-center"
          >
            Dukung Kami
          </Link>
        </div>
      )}
    </nav>
  )
}

// ==========================================
// 4. COMPONENT: SejarahListItem (DIPERBARUI TOTAL)
// ==========================================
const SejarahListItem = ({ article }: { article: SejarahArticle }) => (
  <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center transition-all hover:shadow-md">
    <div className="shrink-0 w-full md:w-56 h-36 rounded-2xl bg-gray-50 overflow-hidden relative border border-gray-100">
      <Image 
        src={article.gambar_url || '/placeholder.png'} 
        alt={article.judul || 'Cover Artikel'}
        fill
        className="object-cover"
        sizes="(max-w-7xl) 100vw, 224px"
        priority
      />
    </div>

    <div className="flex-1 flex flex-col justify-between w-full py-1">
      <div>
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className="text-[10px] font-extrabold bg-[#EBF2EF] text-[#005C43] tracking-wider px-2.5 py-1 rounded-md uppercase">
            {article.kategori || 'Umum'}
          </span>
          <span className="text-xs text-gray-400 font-medium">
            Oleh: <span className="text-gray-600 font-semibold">{article.penulis || 'Admin'}</span>
          </span>
        </div>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-2 leading-snug">
          {article.judul}
        </h3>
        {/* Konten otomatis ter-truncate dengan aman lewat CSS line-clamp */}
        <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-4 line-clamp-2">
          {article.konten}
        </p>
      </div>

      <Link
        href={`/sejarah/${article.slug}`}
        className="text-[#00664B] font-bold text-base flex items-center gap-1.5 hover:opacity-80 transition-opacity w-fit"
      >
        Selengkapnya <span className="text-lg leading-none">→</span>
      </Link>
    </div>
  </div>
)

// ==========================================
// 5. COMPONENT: Footer (Identik dengan aslinya)
// ==========================================
const Footer = () => (
  <footer className="w-full bg-[#EAF2ED] py-12 px-8 mt-12">
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
            <li><Link href="/game" className="hover:text-[#005C43] transition-colors">Game🚀</Link></li>
          </ul>
        </div>
        <div className="flex flex-col">
            <h4 className="font-bold text-[#005C43] text-base mb-3">Media Sosial</h4>
            <ul className="space-y-2 text-sm text-gray-700">
                <li><a href="#" className="hover:text-[#005C43] transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-[#005C43] transition-colors">Facebook</a></li>
            </ul>
        </div>
        <div className="flex flex-col">
            <h4 className="font-bold text-[#005C43] text-base mb-3">Kontak</h4>
            <ul className="space-y-2 text-sm text-gray-700">
                <li><a href="mailto:info@lenteraabhesa.com" className="hover:text-[#005C43] transition-colors">Email</a></li>
            </ul>
        </div>
      </div>
      <div className="border-t border-gray-300 pt-6 text-center">
        <p className="text-sm text-gray-700">© 2026 Lentera Abhesa. All rights reserved.</p>
      </div>
    </div>
  </footer>
)

// ==========================================
// 6. MAIN DEFAULT EXPORT
// ==========================================
export default function SejarahPage() {
  const [articles, setArticles] = useState<SejarahArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  
  const articlesPerPage = 5 

  // Fetch dari Supabase
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('sejarah')
        .select('*')
        .order('created_at', { ascending: false })

      if (data) setArticles(data as SejarahArticle[])
      setLoading(false)
    }
    fetchArticles()
  }, [])

  // Mengubah pemfilteran agar membaca kolom 'judul' dan 'kategori'
  const filteredArticles = useMemo(() => {
    return articles.filter(article => 
      (article.judul || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (article.kategori || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [articles, searchQuery])

  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage) || 1
  const startIndex = (currentPage - 1) * articlesPerPage
  const currentArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage)

  return (
    <main className="w-full bg-white min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />
        <section className="px-8 py-12 bg-white">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-extrabold text-[#00664B] mb-3">Sejarah Pulau Bawean</h1>
              <p className="text-gray-600 text-lg">Mengenal lebih sejarah, sastra dan nilai budaya Pulau Bawean</p>
            </div>
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Cari artikel sejarah..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1) 
                }}
                className="w-full pl-4 pr-10 py-2.5 rounded-full border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#00664B]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-4 top-3.5" />
            </div>
          </div>
        </section>

        <section className="px-8 pb-16">
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 className="animate-spin w-10 h-10 text-[#00664B]" /></div>
            ) : currentArticles.length > 0 ? (
              currentArticles.map((article) => (
                <SejarahListItem key={article.id} article={article} />
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 italic">Tidak ditemukan artikel sejarah.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-end items-center gap-2 mt-8">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-full font-bold text-sm transition-all flex items-center justify-center cursor-pointer ${
                      currentPage === page ? 'bg-[#004D37] text-white shadow-sm' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}