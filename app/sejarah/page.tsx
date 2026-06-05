'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import Image from "next/image"
import { usePathname } from 'next/navigation'

// 1. COMPONENT: Navbar (Sinkronisasi Navigasi & Active State Dinamis)
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Sesuai dengan tatanan folder di image_b368c4.png
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
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Lentera Abhesa" width={100} height={50} priority className="cursor-pointer" />
          </Link>
        </div>

        {/* Desktop Menu */}
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

        {/* Right Button (Desktop Only) */}
        <button className="hidden md:block bg-[#005C43] text-white rounded-full px-6 py-2 font-bold text-sm hover:opacity-90 transition-opacity">
          Dukung Kami
        </button>

        {/* Hamburger Icon (Mobile) */}
        <button className="md:hidden p-2 text-[#005C43]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top-4">
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

// 2. DATA: Sejarah Articles
const sejarahArticles = [
  {
    id: 1,
    slug: 'perkembangan-bahasa-bawean',
    title: 'Perkembangan bahasa Bawean',
    excerpt: 'Bahasa Bawean adalah bahasa nilo-Autik yang berkaitan dengan bahasa Maduara. Perkembangannya dipengaruhi oleh percampuran dari Jawa, Bugis, Madura, Banggal dan budaya Melayu sehingga tradisi merantau masyarakatnya ke ne...',
  },
  {
    id: 2,
    slug: 'asai-usul-pulau-bawean',
    title: 'Asai-usul Pulau Bawean',
    excerpt: 'Pulau Bawean adalah pulau terpencil yang mencuri perhatian sang pemimpin pulau berpengaruh. Disebut sebagai "Pulau Butan" dalam kitab Negarakertagama, pulau ini dikenal oleh perjalanan Taku Maduria, Jawi dan...',
  },
  {
    id: 3,
    slug: 'budaya-bawean',
    title: 'Budaya Bawean',
    excerpt: 'Budaya Bawean - berkaitan dengan Pulau Bawean, Kabupaten Gresik - mengandung perpaduan unik antara berbagai latar backgrounds seperti Jawa, Madura, Bugis, dan Makassar. Ciri khasnya meliputi tradisi merantau, arsitektur khas, serta penyisihan keagamaan yang...',
  },
  {
    id: 4,
    slug: 'kuliner-khas-bawean',
    title: 'Kuliner Khas Bawean',
    excerpt: 'Makanan tradisional Bawean mencerminkan kekayaan sejarah dan tradisi kuliner yang mendalam dari sebuah masyarakat. Budaya Maduran, Jawa, dan Melayu. Habitanya sepanjang sejarah Bawean and lain faktor merajut memiliki...',
  },
  {
    id: 5,
    slug: 'tradisi-merantau-masyarakat-bawean',
    title: 'Tradisi Merantau Masyarakat Bawean',
    excerpt: 'Tradisi merantau menjadi bagian penting dalam kehidupan masyarakat Bawean, yang menceritakan tentang pengalaman hidup mereka yang berangkat dari satu pulau, di Nusantara di satu gelombang dan sekitar mampertahannya...',
  },
]

// 3. COMPONENT: Sejarah List Item
const SejarahListItem = ({ article, onItemClick }: { article: typeof sejarahArticles[0], onItemClick: (slug: string) => void }) => (
  <div className="flex gap-6 py-8 border-b border-gray-200 last:border-b-0">
    {/* Image Placeholder */}
    <div className="shrink-0 w-48 h-36 rounded-lg bg-gradient-to-br from-blue-300 to-blue-400 overflow-hidden">
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-gray-400 font-medium">GAMBAR</span>
      </div>
    </div>

    {/* Content */}
    <div className="flex-1 flex flex-col justify-between">
      <div>
        <h3 className="text-2xl font-extrabold text-gray-900 mb-3">
          {article.title}
        </h3>
        <p className="text-gray-700 text-base leading-relaxed line-clamp-3">
          {article.excerpt}
        </p>
      </div>
      <Link
        href={`/sejarah/${article.slug}`}
        onClick={() => onItemClick(article.slug)}
        className="text-[#00664B] font-semibold text-base flex items-center gap-1 hover:opacity-80 transition-opacity w-fit"
      >
        Selengkapnya
        <ChevronRight className="w-5 h-5" />
      </Link>
    </div>
  </div>
)

// 4. COMPONENT: Footer (Sinkronisasi Navigasi)
const Footer = () => (
  <footer className="w-full bg-[#EAF2ED] py-12 px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Column 1: Logo & Description */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Image src="/logo.png" alt="Lentera Abhesa" width={180} height={100} priority />
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            Platform digital untuk melestarikan bahasa dan sastra Bawean
          </p>
        </div>

        {/* Column 2: Navigasi */}
        <div className="flex flex-col">
          <h4 className="font-bold text-[#005C43] text-base mb-3">Navigasi</h4>
          <ul className="space-y-2 text-sm text-gray-700 flex flex-col">
            <li><Link href="/" className="hover:text-[#005C43] transition-colors">Beranda</Link></li>
            <li><Link href="/kamus" className="hover:text-[#005C43] transition-colors">Kamus</Link></li>
            <li><Link href="/sejarah" className="hover:text-[#005C43] transition-colors">Sejarah</Link></li>
            <li><Link href="/game" className="hover:text-[#005C43] transition-colors">Game🚀</Link></li>
          </ul>
        </div>

        {/* Column 3: Media Sosial */}
        <div className="flex flex-col">
          <h4 className="font-bold text-[#005C43] text-base mb-3">Media Sosial</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><a href="#" className="hover:text-[#005C43] transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-[#005C43] transition-colors">Facebook</a></li>
            <li><a href="#" className="hover:text-[#005C43] transition-colors">Twitter</a></li>
          </ul>
        </div>

        {/* Column 4: Kontak */}
        <div className="flex flex-col">
          <h4 className="font-bold text-[#005C43] text-base mb-3">Kontak</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><a href="mailto:info@lenteraabhesa.com" className="hover:text-[#005C43] transition-colors">Email</a></li>
            <li><a href="tel:+62000000000" className="hover:text-[#005C43] transition-colors">Phone</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-300 pt-6 text-center">
        <p className="text-sm text-gray-700">© 2026 Lentera Abhesa. All rights reserved.</p>
      </div>
    </div>
  </footer>
)

// 5. MAIN DEFAULT EXPORT: Halaman Utama Sejarah
export default function SejarahPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 5
  const totalPages = Math.ceil(sejarahArticles.length / articlesPerPage)

  const startIndex = (currentPage - 1) * articlesPerPage
  const endIndex = startIndex + articlesPerPage
  const currentArticles = sejarahArticles.slice(startIndex, endIndex)

  return (
    <main className="w-full bg-white min-h-screen flex flex-col justify-between">
      <div>
        {/* Navbar */}
        <Navbar />

        {/* Header Section */}
        <section className="px-8 py-12 border-b border-gray-200">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-5xl font-extrabold text-[#00664B] mb-3">
              Sejarah Pulau Bawean
            </h1>
            <p className="text-gray-700 text-lg">
              Mengenal lebih sejarah, sastra dan nilai budaya Pulau Bawean
            </p>
          </div>
        </section>

        {/* Articles List Section */}
        <section className="px-8 py-12">
          <div className="max-w-6xl mx-auto">
            {currentArticles.map((article) => (
              <SejarahListItem
                key={article.id}
                article={article}
                onItemClick={() => setCurrentPage(1)}
              />
            ))}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 mt-12">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-10 h-10 rounded-full font-semibold transition-all ${
                    currentPage === page
                      ? 'bg-[#00664B] text-white'
                      : 'border-2 border-[#00664B] text-[#00664B] hover:bg-[#00664B]/10'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}