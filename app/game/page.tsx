'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from "next/image"
import { usePathname } from 'next/navigation'

// 1. COMPONENT: Navbar (Sinkronisasi Navigasi & Active State Dinamis)
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

// 2. COMPONENT: Game Card
const GameCard = ({ title, description, icon: Icon, href }: { title: string; description: string; icon: React.ComponentType<{ className?: string }>; href: string }) => (
  <Link href={href}>
    <div className="cursor-pointer rounded-3xl bg-linear-to-br from-[#F0F5F3] to-[#E8F0ED] p-8 text-center hover:shadow-lg transition-shadow duration-300 h-full flex flex-col justify-between items-center">
      <div>
        <div className="flex justify-center mb-4">
          <Icon />
        </div>
        <h3 className="text-2xl font-bold text-[#00664B] mb-2">{title}</h3>
        <p className="text-gray-700 text-sm leading-relaxed mb-6">{description}</p>
      </div>
      <button className="bg-[#00664B] text-white rounded-full px-6 py-2 font-bold text-sm hover:opacity-90 transition-opacity mt-auto">
        Ayo Mulai →
      </button>
    </div>
  </Link>
)

// 3. COMPONENT: Footer (Sinkronisasi Navigasi)
const Footer = () => (
  <footer className="w-full bg-[#EAF2ED] py-12 px-8 mt-12">
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

// 4. MAIN DEFAULT EXPORT: Halaman Utama Game
export default function GamePage() {
  return (
    <main className="w-full min-h-screen bg-white flex flex-col justify-between">
      <div>
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-16">
          <h1 className="text-5xl font-extrabold text-[#00664B] mb-2">Game 🎮</h1>
          <p className="text-gray-700 text-lg mb-12">Bermain sambil belajar, selesaikan semua tantangan seru</p>

          {/* Game Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tebak Gambar */}
            <GameCard
              title="Tebak Gambar"
              description="Lihat gambar dan tebak bahasa Bawean berdasarkan gambar yang muncul"
              icon={() => (
                <div className="w-20 h-20 rounded-full bg-[#E8F0ED] flex items-center justify-center">
                  <span className="text-4xl">🦌</span>
                </div>
              )}
              href="/game/tebak-gambar"
            />

            {/* Tebak Kata */}
            <GameCard
              title="Tebak Kata"
              description="Tebak arti kata bahasa Bawean dengan tepat dan kumpulkan poinmu"
              icon={() => (
                <div className="w-20 h-20 rounded-full bg-[#E8F0ED] flex items-center justify-center">
                  <span className="text-4xl">📝</span>
                </div>
              )}
              href="/game/tebak-kata"
            />

            {/* Susun Kata */}
            <GameCard
              title="Susun Kata"
              description="Susun huruf acak menjadi kosakata bahasa Bawean yang benar"
              icon={() => (
                <div className="w-20 h-20 rounded-full bg-[#E8F0ED] flex items-center justify-center">
                  <span className="text-4xl">🔤</span>
                </div>
              )}
              href="/game/susun-kata"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}