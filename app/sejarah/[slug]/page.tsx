'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { ChevronRight, Loader2 } from 'lucide-react'
import Image from "next/image"
import { supabase } from '@/lib/supabase'

// ==========================================
// 1. INTERFACE (Pastikan sama dengan struktur DB)
// ==========================================
interface ContentSection {
  section: string
  text: string
  bullets?: string[]
}

interface SejarahArticle {
  id: number
  slug: string
  title: string
  description: string
  imageUrl: string
  content: ContentSection[]
}

// 1. COMPONENT: Navbar
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
            const isActive = pathname === item.path
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
          className="hidden md:block bg-[#005C43] text-white rounded-full px-6 py-2.5 font-medium text-[15px] hover:opacity-90 transition-opacity text-center"
        >
          Dukung Kami
        </Link>

        <button className="md:hidden p-2 text-[#005C43]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path
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
// ... (Komponen Navbar dan Footer tetap sama, tidak perlu diubah) ...
// 6. COMPONENT: Footer
const Footer = () => (
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
// 2. MAIN DEFAULT EXPORT
// ==========================================
export default function ArticleDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [article, setArticle] = useState<SejarahArticle | null>(null)
  const [loading, setLoading] = useState(true)

  // Fetch Data Dinamis dari Supabase
  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('sejarah')
        .select('*')
        .eq('slug', slug)
        .single() // Mengambil satu data yang slug-nya cocok

      if (data) {
        setArticle(data)
      } else {
        console.error("Error fetching article:", error)
      }
      setLoading(false)
    }

    if (slug) fetchArticle()
  }, [slug])

  // UI Loading State
  if (loading) {
    return (
      <main className="w-full bg-white min-h-screen flex flex-col justify-between items-center justify-center">
         <Loader2 className="w-10 h-10 animate-spin text-[#00664B]" />
      </main>
    )
  }

  // Kondisi jika artikel tidak ditemukan
  if (!article) {
    return (
      <main className="w-full bg-white min-h-screen flex flex-col justify-between">
        <div>
          <Navbar />
          <section className="px-8 py-24 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Artikel tidak ditemukan</h1>
              <p className="text-gray-600 mb-6">Maaf, artikel sejarah yang Anda cari tidak tersedia.</p>
              <Link href="/sejarah" className="text-[#00664B] font-semibold hover:opacity-80 inline-flex items-center gap-1">
                Kembali ke Daftar Sejarah <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="w-full bg-white min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Breadcrumb */}
        <section className="px-8 py-6 border-b border-gray-200">
          <div className="max-w-4xl mx-auto">
             <div className="flex items-center gap-2 text-sm text-gray-600">
                <Link href="/sejarah" className="hover:text-[#00664B] transition-colors">Sejarah</Link>
                <ChevronRight className="w-4 h-4" />
                <span className="text-gray-900 font-medium">{article.title}</span>
            </div>
          </div>
        </section>

        {/* Banner Image */}
        <section className="px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="w-full h-64 md:h-[400px] rounded-2xl bg-gray-50 overflow-hidden relative border border-gray-100 shadow-sm">
              <Image 
                src={article.imageUrl || '/placeholder.png'} 
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-w-4xl) 100vw, 896px"
                priority
              />
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#00664B] mb-6">
              {article.title}
            </h1>
            <p className="text-gray-700 text-lg leading-relaxed mb-10">
              {article.description}
            </p>

            <div className="space-y-10">
              {article.content && article.content.map((section, idx) => (
                <div key={idx} className="space-y-4">
                  <h2 className="text-2xl font-extrabold text-gray-900">{section.section}</h2> 
                  {section.text && <p className="text-gray-700 leading-relaxed">{section.text}</p>}
                  {section.bullets && (
                    <ul className="space-y-3 ml-6">
                      {section.bullets.map((bullet, bulletIdx) => (
                        <li key={bulletIdx} className="text-gray-700 leading-relaxed flex gap-3">
                          <span className="text-[#00664B] font-bold shrink-0 mt-1">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  )
}