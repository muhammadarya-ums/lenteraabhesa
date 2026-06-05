'use client'

import React, { useState } from 'react'
import { ChevronRight } from 'lucide-react'
import Image from "next/image"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// 1. COMPONENT: Navbar (Sinkronisasi Navigasi)
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
          <button className="w-full bg-[#005C43] text-white rounded-full py-3 font-bold">
            Dukung Kami
          </button>
        </div>
      )}
    </nav>
  )
}

// 2. COMPONENT: Header Section
const HeaderSection = () => (
  <section className="w-full px-8 py-12 bg-white">
    <div className="max-w-7xl mx-auto">
      {/* Small Header */}
      <p className="text-sm font-bold text-[#005C43] mb-2">Tentang kami</p>
      
      {/* Main Header with Description */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#005C43] leading-tight">
            Menjaga Bahasa, Merawat Identitas
          </h1>
        </div>
        
        <div className="flex flex-col justify-center">
          <p className="text-base md:text-lg text-gray-700 leading-relaxed">
            LENTERA ABHESA menghadirkan Platform digital untuk melestarikan abhesa halus dan satwa Pulau Bawean
          </p>
        </div>
      </div>
    </div>
  </section>
)

// 3. COMPONENT: Proposal Section
const ProposalSection = () => (
  <section className="w-full px-8 py-16 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Proposal Placeholder */}
        <div className="flex items-center justify-center rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 h-64 md:col-span-1">
          <p className="text-center text-gray-500 font-bold text-xl">PROPOSAL</p>
        </div>

        {/* Right: Description and Link */}
        <div className="md:col-span-2 flex flex-col justify-center">
          <p className="text-sm md:text-base text-gray-600 font-bold mb-3">PROPOSAL</p>
          
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-6">
            Lentera Abhesa adalah platform digital inovatif yang dirancang khusus untuk melestarikan dan mengembangkan bahasa lokal. Kami memahami bahwa setiap bahasa lokal membawa nilai budaya yang luar biasa dan harus dijaga untuk generasi mendatang. Dengan teknologi terkini, kami menyediakan akses mudah terhadap kamus digital, sejarah bahasa, dan pembelajaran interaktif yang menyenangkan untuk semua usia.
          </p>

          <a href="#" className="text-[#005C43] font-bold text-base flex items-center gap-2 hover:opacity-75 transition-opacity w-fit">
            Download Proposal
            <ChevronRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  </section>
)

// 4. COMPONENT: Team Section
const TeamSection = () => (
  <section className="w-full px-8 py-16 bg-white">
    <div className="max-w-7xl mx-auto">
      {/* Title */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-[#005C43] mb-2">Tim Kami</h2>
      <p className="text-gray-600 text-base md:text-lg mb-12">Sekelompok individu berdedikasi untuk melestarikan bahasa lokal</p>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Rossalinda */}
        <div className="flex flex-col">
          <div className="rounded-2xl bg-[#EAF2ED] h-64 mb-4 flex items-center justify-center">
            <p className="text-gray-400 font-medium">Foto Profil</p>
          </div>
          <h3 className="text-xl font-bold text-[#005C43] mb-1">Rossalinda</h3>
          <p className="text-sm text-gray-600">Guru Pembimbing</p>
        </div>

        {/* Card 2: Adelia */}
        <div className="flex flex-col">
          <div className="rounded-2xl bg-[#EAF2ED] h-64 mb-4 flex items-center justify-center">
            <p className="text-gray-400 font-medium">Foto Profil</p>
          </div>
          <h3 className="text-xl font-bold text-[#005C43] mb-1">Adelia</h3>
          <p className="text-sm text-gray-600">Siswa</p>
        </div>

        {/* Card 3: Dewi Kartika */}
        <div className="flex flex-col">
          <div className="rounded-2xl bg-[#EAF2ED] h-64 mb-4 flex items-center justify-center">
            <p className="text-gray-400 font-medium">Foto Profil</p>
          </div>
          <h3 className="text-xl font-bold text-[#005C43] mb-1">Dewi Kartika</h3>
          <p className="text-sm text-gray-600">Siswa</p>
        </div>
      </div>
    </div>
  </section>
)

// 5. COMPONENT: Support Section
const SupportSection = () => (
  <section className="w-full px-8 py-16 bg-white">
    <div className="max-w-7xl mx-auto">
      {/* Title */}
      <p className="text-gray-700 font-semibold text-base md:text-lg mb-8">Didukung penuh oleh</p>

      {/* Logo Placeholders */}
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* SMA NEGERI 1 SANGKAPURA */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs font-bold text-gray-700">SMA NEGERI 1</p>
              <p className="text-xs font-bold text-gray-700">SANGKAPURA</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px h-16 bg-gray-300"></div>

        {/* DINAS PENDIDIKAN KAB GRESIK */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
            <div className="text-center">
              <p className="text-xs font-bold text-gray-700">DINAS</p>
              <p className="text-xs font-bold text-gray-700">PENDIDIKAN</p>
              <p className="text-xs font-bold text-gray-700">KAB GRESIK</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

// 6. COMPONENT: Footer (Sinkronisasi Navigasi)
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
            <li><Link href="/game" className="hover:text-[#005C43] transition-colors">🚀</Link></li>
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

// MAIN EXPORT
export default function TentangKamiPage() {
  return (
    <main className="w-full bg-white">
      <Navbar />
      <HeaderSection />
      <ProposalSection />
      <TeamSection />
      <SupportSection />
      <Footer />
    </main>
  )
}