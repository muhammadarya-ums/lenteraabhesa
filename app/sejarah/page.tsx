'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import Image from "next/image"
import { usePathname } from 'next/navigation'

// ==========================================
// 1. INTERFACE DATA (Skema Sinkronisasi Admin CMS)
// ==========================================
interface SejarahArticle {
  id: number
  slug: string
  title: string
  category: string      
  author: string        
  excerpt: string       
  content: string       
  imageUrl: string      
  createdAt: string     
}

// ==========================================
// 2. MOCK DATA SOURCE (Sesuai image_9b50be.png)
// ==========================================
const initialSejarahArticles: SejarahArticle[] = [
  {
    id: 1,
    slug: 'perkembangan-bahasa-bawean',
    title: 'Perkembangan bahasa Bawean',
    category: 'SEJARAH',
    author: 'Karya Siswa',
    excerpt: 'Bahasa Bawean adalah bahasa hibrida atau kreolisasi yang berakar dari bahasa Madura. Perkembangannya dipengaruhi oleh percampuran suku (Jawa, Bugis, Maka...',
    content: 'Isi lengkap artikel...',
    imageUrl: '/bahasa.png', // Sesuai dengan data di image_9b50be.png
    createdAt: '2026-06-01'
  },
  {
    id: 2,
    slug: 'tradisi-merantau-masyarakat-bawean',
    title: 'Tradisi Merantau Masyarakat Bawean',
    category: 'BUDAYA',
    author: 'Admin Lentera',
    excerpt: 'Tradisi merantau menjadi bagian penting dalam kehidupan masyarakat Bawean, yang menceritakan tentang pengalaman hidup mereka yang berangkat dari satu pulau...',
    content: 'Isi lengkap artikel...',
    imageUrl: '/budaya.png',
    createdAt: '2026-05-28'
  },
  {
    id: 3,
    slug: 'asal-usul-pulau-bawean',
    title: 'Asal-usul Pulau Bawean',
    category: 'SEJARAH',
    author: 'Tim Riset',
    excerpt: 'Pulau Bawean adalah pulau terpencil yang mencuri perhatian sang pemimpin pulau berpengaruh. Disebut sebagai "Pulau Butan" dalam kitab Negarakertagama...',
    content: 'Isi lengkap artikel...',
    imageUrl: '/asalusul.png',
    createdAt: '2026-05-20'
  },
  {
    id: 4,
    slug: 'budaya-bawean',
    title: 'Budaya Bawean',
    category: 'BUDAYA',
    author: 'Karya Siswa',
    excerpt: 'Budaya Bawean - berkaitan dengan Pulau Bawean, Kabupaten Gresik - mengandung perpaduan unik antara berbagai latar backgrounds seperti Jawa, Madura, Bugis...',
    content: 'Isi lengkap artikel...',
    imageUrl: '/budaya.png',
    createdAt: '2026-05-15'
  },
  {
    id: 5,
    slug: 'kuliner-khas-bawean',
    title: 'Kuliner Khas Bawean',
    category: 'ARTIKEL',
    author: 'Admin Lentera',
    excerpt: 'Makanan tradisional Bawean mencerminkan kekayaan sejarah dan tradisi kuliner yang mendalam dari sebuah masyarakat yang berakar dari akulturasi...',
    content: 'Isi lengkap artikel...',
    imageUrl: '/kuliner.jpg',
    createdAt: '2026-05-10'
  },
  {
    id: 6,
    slug: 'sastra-lisan-bawean',
    title: 'Sastra Lisan dan Puisi Bawean',
    category: 'KARYA SISWA',
    author: 'Siti Rahma',
    excerpt: 'Menelusuri keindahan sastra lisan, pantun, dan kesenian tutur khas masyarakat Bawean yang diwariskan dari generasi ke generasi...',
    content: 'Isi lengkap artikel...',
    imageUrl: '/asalusul.png',
    createdAt: '2026-05-05'
  },
  {
    id: 7,
    slug: 'pakaian-adat-bawean',
    title: 'Karakteristik Pakaian Adat Bawean',
    category: 'BUDAYA',
    author: 'Tim Lentera',
    excerpt: 'Pakaian tradisional suku Bawean merepresentasikan perpaduan corak keislaman yang kuat berpadu dengan estetika Melayu dan Jawa kuno...',
    content: 'Isi lengkap artikel...',
    imageUrl: '/budaya.png',
    createdAt: '2026-05-01'
  }
]

// ==========================================
// 3. COMPONENT: Navbar
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

        <button className="hidden md:block bg-[#005C43] text-white rounded-full px-6 py-2 font-bold text-sm hover:opacity-90 transition-opacity">
          Dukung Kami
        </button>

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
          <button className="w-full bg-[#005C43] text-white rounded-full py-3 font-bold">
            Dukung Kami
          </button>
        </div>
      )}
    </nav>
  )
}

// ==========================================
// 4. COMPONENT: Sejarah List Item Card (FIXED IMAGE)
// ==========================================
const SejarahListItem = ({ article }: { article: SejarahArticle }) => (
  <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center transition-all hover:shadow-md">
    {/* Box Gambar Kiri - Sekarang render gambar asli */}
    <div className="shrink-0 w-full md:w-56 h-36 rounded-2xl bg-gray-50 overflow-hidden relative border border-gray-100">
      <Image 
        src={article.imageUrl} 
        alt={article.title}
        fill
        className="object-cover"
        sizes="(max-w-7xl) 100vw, 224px"
        priority
      />
    </div>

    <div className="flex-1 flex flex-col justify-between w-full py-1">
      <div>
        <span className="text-xs font-bold text-gray-400 tracking-widest block mb-1.5 uppercase">
          {article.category}
        </span>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-2 leading-snug">
          {article.title}
        </h3>
        <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-4 line-clamp-2">
          {article.excerpt}
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
// 5. COMPONENT: Footer
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
            <li><a href="#" className="hover:text-[#005C43] transition-colors">Twitter</a></li>
          </ul>
        </div>

        <div className="flex flex-col">
          <h4 className="font-bold text-[#005C43] text-base mb-3">Kontak</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><a href="mailto:info@lenteraabhesa.com" className="hover:text-[#005C43] transition-colors">Email</a></li>
            <li><a href="tel:+62000000000" className="hover:text-[#005C43] transition-colors">Phone</a></li>
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
// 6. MAIN DEFAULT EXPORT: Halaman Utama Sejarah
// ==========================================
export default function SejarahPage() {
  const [articles, setArticles] = useState<SejarahArticle[]>(initialSejarahArticles)
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  
  // Sesuai kesepakatan: 5 artikel per halaman
  const articlesPerPage = 5 

  // Filter Pencarian
  const filteredArticles = useMemo(() => {
    return articles.filter(article => 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [articles, searchQuery])

  // Hitung total halaman
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage) || 1

  const startIndex = (currentPage - 1) * articlesPerPage
  const currentArticles = filteredArticles.slice(startIndex, startIndex + articlesPerPage)

  return (
    <main className="w-full bg-white min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Header Section */}
        <section className="px-8 py-12 bg-white">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-5xl font-extrabold text-[#00664B] mb-3">
                Sejarah Pulau Bawean
              </h1>
              <p className="text-gray-600 text-lg">
                Mengenal lebih sejarah, sastra dan nilai budaya Pulau Bawean
              </p>
            </div>

            {/* Kotak Pencarian */}
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

        {/* Articles List Section */}
        <section className="px-8 pb-16">
          <div className="max-w-6xl mx-auto flex flex-col gap-6">
            
            {/* Render List Card */}
            {currentArticles.length > 0 ? (
              currentArticles.map((article) => (
                <SejarahListItem key={article.id} article={article} />
              ))
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-400 italic">Tidak ditemukan artikel sejarah.</p>
              </div>
            )}

            {/* Pagination Block */}
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
                    currentPage === page
                      ? 'bg-[#004D37] text-white shadow-sm' 
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
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

          </div>
        </section>
      </div>

      <Footer />
    </main>
  )
}