'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from "next/image"
import { usePathname } from 'next/navigation'

// ==========================================
// 1. COMPONENT: Navbar (Sinkronisasi Navigasi)
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
        <Link 
  href="/dukungkami" 
  className="hidden md:block bg-[#005C43] text-white rounded-full px-6 py-2 font-bold text-sm hover:opacity-90 transition-opacity"
>
  Dukung Kami
</Link>

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
// 2. COMPONENT: Game Card (Sesuai Desain Figma)
// ==========================================
interface GameCardProps {
  title: string
  description: string
  imageSrc: string // Prop baru untuk file foto game
  href: string
  isAvailable?: boolean // Kondisi game aktif atau Coming Soon
}

const GameCard = ({ title, description, imageSrc, href, isAvailable = true }: GameCardProps) => {
  const CardContent = (
    <div className="rounded-[32px] bg-[#EBF2EE] p-8 text-center h-full flex flex-col justify-between items-center transition-all duration-300 hover:shadow-md">
      {/* Bagian Atas: Judul & Deskripsi */}
      <div className="w-full flex flex-col items-center">
        <h3 className="text-3xl font-bold text-[#005C43] mb-3">{title}</h3>
        <p className="text-gray-700 text-sm leading-relaxed max-w-[260px] mb-6">{description}</p>
      </div>

      {/* Bagian Tengah: Foto Ilustrasi Game */}
      <div className="w-full h-48 relative mb-8 flex items-center justify-center">
        <Image 
          src={imageSrc} 
          alt={title} 
          fill
          className="object-contain"
          sizes="(max-w-md) 100vw, 300px"
        />
      </div>

      {/* Bagian Bawah: Tombol Status */}
      {isAvailable ? (
        <button className="w-full bg-[#005C43] text-white rounded-full py-3.5 font-bold text-base hover:opacity-95 transition-opacity">
          Ayo Main →
        </button>
      ) : (
        <button disabled className="w-full bg-[#F1F3F2] text-gray-400 rounded-full py-3.5 font-bold text-sm tracking-wider uppercase cursor-not-allowed">
          COMING SOON
        </button>
      )}
    </div>
  )

  // Jika game tersedia maka bisa di-klik link-nya, jika tidak maka matikan link-nya
  return isAvailable ? (
    <Link href={href} className="block h-full">
      {CardContent}
    </Link>
  ) : (
    <div className="h-full">{CardContent}</div>
  )
}

// ==========================================
// 3. COMPONENT: Footer
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
// 4. MAIN DEFAULT EXPORT: Halaman Utama Game
// ==========================================
export default function GamePage() {
  return (
    <main className="w-full min-h-screen bg-white flex flex-col justify-between">
      <div>
        {/* Navbar */}
        <Navbar />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-16">
          {/* Header menyontek copywriting persis di image_9b3e14.png */}
          <h1 className="text-5xl font-extrabold text-[#005C43] mb-3 flex items-center gap-2">
            Game 🚀
          </h1>
          <p className="text-gray-700 text-lg mb-12">
            Bermain sambil belajar! selesaikan semua tantangan seru
          </p>

          {/* Game Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 1. Tebak Gambar (Aktif) */}
            <GameCard
              title="Tebak Gambar"
              description="Lihat gambar dan tebak bahasa baweannya"
              imageSrc="/tebakgambar.png"
              href="/game/tebak-gambar"
              isAvailable={true}
            />

            {/* 2. Tebak Kata (Coming Soon) */}
            <GameCard
              title="Tebak Kata"
              description="Tebak arti kata bahasa Bawean dengan tepat"
              imageSrc="/tebakkata.png" // Taruh file fotomu di folder public/game-tebak-kata.png
              href="/game/tebak-kata"
              isAvailable={false}
            />

            {/* 3. Susun Kata (Coming Soon) */}
            <GameCard
              title="Susun Kata"
              description="Susun huruf acak menjadi kata bahas Bawean"
              imageSrc="/susunkata.png" // Taruh file fotomu di folder public/game-susun-kata.png
              href="/game/susun-kata"
              isAvailable={false}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}