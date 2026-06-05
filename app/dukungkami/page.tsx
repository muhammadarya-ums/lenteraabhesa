'use client'

import React, { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import Image from "next/image"
import Link from 'next/link'

// ==========================================
// 1. COMPONENT: Navbar
// ==========================================
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const menuItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Kamus', path: '/kamus' },
    { name: 'Sejarah', path: '/sejarah' },
    { name: 'Game 🚀', path: '/game' },
    { name: 'Tentang Kami', path: '/tentang-kami' },
  ]

  return (
    <nav className="w-full bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Lentera Abhesa" width={140} height={60} priority className="cursor-pointer object-contain" />
          </Link>
        </div>

        {/* Desktop Menu Links */}
        <div className="hidden md:flex gap-8 items-center">
          {menuItems.map((item) => (
            <Link 
              key={item.name} 
              href={item.path} 
              className="text-[15px] font-medium text-gray-500 hover:text-[#005C43] transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Right CTA Button (Pill Shape) */}
        <Link 
  href="/dukungkami" 
  className="hidden md:block bg-[#005C43] text-white rounded-full px-6 py-2.5 font-medium text-[15px] hover:opacity-90 transition-opacity text-center"
>
  Dukung Kami
</Link>

        {/* Hamburger Mobile Icon */}
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
              className="text-left font-semibold text-gray-700 text-[15px]"
            >
              {item.name}
            </Link>
          ))}
          <Link 
  href="/dukungkami" 
  className="hidden md:block bg-[#005C43] text-white rounded-full px-6 py-2.5 font-medium text-[15px] hover:opacity-90 transition-opacity text-center"
>
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
  <section className="w-full px-6 pt-16 pb-10 bg-white text-center">
    <div className="max-w-4xl mx-auto">
      {/* Main Heading Text */}
      <h1 className="text-[32px] md:text-[36px] font-bold text-[#005C43] leading-tight mb-5 tracking-tight">
        Belajar, Melestarikan, dan Mendukung Bahasa Lokal
      </h1>
      {/* Subtitle Description */}
      <p className="text-gray-800 text-[15px] md:text-[15px] leading-relaxed max-w-[820px] mx-auto text-center">
        Abhesa halus adalah warisan yang perlu dijaga bersama. Melalui pembelian buku dan merchandise resmi, Anda turut mendukung pengembangan konten edukasi, program pembelajaran, dan pelestarian bahasa daerah untuk generasi mendatang.
      </p>
    </div>
  </section>
)

// ==========================================
// 3. COMPONENT: Products Grid Section
// ==========================================
const ProductsSection = () => {
  const products = [
    {
      id: 1,
      title: "Buku Saku Kamus Abhesa Halus",
      price: "Rp 75,000",
      image: "/dukungkami.png"
    },
    {
      id: 2,
      title: "Ganci Merchandise Resmi",
      price: "Rp 35,000",
      image: "/dukungkami.png" // Menggunakan aset gambar placeholder yang sama sesuai gambar UI
    },
    {
      id: 3,
      title: "Ganci Merchandise Resmi",
      price: "Rp 35,000",
      image: "/dukungkami.png"
    }
  ]

  return (
    <section className="w-full px-6 py-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 lg:gap-8">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="bg-white rounded-[24px] border border-gray-100 p-4 shadow-[0_4px_25px_rgba(0,0,0,0.02)] flex flex-col justify-between"
            >
              {/* Product Card Image Container */}
              <div className="w-full aspect-[3/4] rounded-[18px] overflow-hidden relative mb-4 bg-[#F8F9FA]">
                <Image 
                  src={product.image} 
                  alt={product.title} 
                  fill 
                  priority
                  className="object-cover p-1 rounded-[18px]"
                />
              </div>
              
              {/* Product Info Labels */}
              <div className="px-1 mb-4">
                <h3 className="font-bold text-black text-[16px] leading-snug mb-1">
                  {product.title}
                </h3>
                <p className="text-gray-500 text-[14px] font-medium">
                  {product.price}
                </p>
              </div>

              {/* Action Button - Pill Green */}
              <button className="w-full bg-[#005C43] text-white rounded-full py-3 px-4 font-semibold text-[15px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                <span>Beli</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==========================================
// 4. COMPONENT: Value Proposition Section
// ==========================================
const ValueSection = () => {
  const values = [
    {
      number: "1",
      text: "Melestarikan dan mendokumentasikan kosakata abhesa halus dan budaya lokal"
    },
    {
      number: "2",
      text: "Menyediakan sumber belajar yang mudah diakses kapanpun dan dimanapun"
    },
    {
      number: "3",
      text: "Memperluas jangkauan edukasi bahasa daerah ke lebih banyak sekolah dan komunitas"
    },
    {
      number: "4",
      text: "Mengembangkan materi pembelajaran yang lebih berkualitas"
    }
  ]

  return (
    <section className="w-full px-6 py-16 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading Left Aligned */}
        <h2 className="text-[32px] md:text-[34px] font-bold text-black leading-tight mb-8 max-w-md">
          Mengapa dukungan anda penting?
        </h2>

        {/* 2x2 Grid System for Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {values.map((item) => (
            <div 
              key={item.number} 
              className="bg-[#EBF2EF] rounded-[16px] p-5 flex items-center gap-4"
            >
              {/* Number Circular Badge */}
              <div className="w-10 h-10 rounded-full bg-[#005C43] text-white flex items-center justify-center font-bold text-[16px] shrink-0">
                {item.number}
              </div>
              {/* Core Text Description */}
              <p className="text-gray-900 text-[15px] font-medium leading-relaxed">
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
// 5. COMPONENT: Footer Footer Asli
// ==========================================
const Footer = () => (
  <footer className="w-full bg-[#EBF2EF] pt-16 pb-6 border-t border-gray-100">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 mb-16">
        {/* Brand/Description Block */}
        <div className="flex flex-col pr-4">
          <Image src="/logo.png" alt="Lentera Abhesa" width={140} height={60} className="mb-4 object-contain" />
          <p className="text-[15px] text-black leading-relaxed">
            Platform digital untuk<br />
            melestarikan bahasa dan<br />
            sastra Bawean
          </p>
        </div>

        {/* Navigation Block */}
        <div className="flex flex-col">
          <h4 className="font-bold text-black text-[15px] mb-4">Navigasi</h4>
          <ul className="space-y-3 text-[15px] text-black">
            <li><Link href="/kamus" className="hover:text-[#005C43]">Kamus</Link></li>
            <li><Link href="/sejarah" className="hover:text-[#005C43]">Sejarah</Link></li>
            <li><Link href="/game" className="hover:text-[#005C43]">Game</Link></li>
            <li><Link href="/tentang-kami" className="hover:text-[#005C43]">Tentang Kami</Link></li>
          </ul>
        </div>

        {/* Social Media Block */}
        <div className="flex flex-col">
          <h4 className="font-bold text-black text-[15px] mb-4">Media Sosial</h4>
          <ul className="space-y-3 text-[15px] text-black">
            <li><a href="#" className="hover:text-[#005C43]">Instagram</a></li>
          </ul>
        </div>

        {/* Contact Info Block */}
        <div className="flex flex-col">
          <h4 className="font-bold text-black text-[15px] mb-4">Kontak</h4>
          <ul className="space-y-3 text-[15px] text-black">
            <li>Email :</li>
            <li>Phone :</li>
          </ul>
        </div>
      </div>

      {/* Centered Copyright with rule divider */}
      <div className="text-center pt-6 border-t border-gray-300/40">
        <p className="text-[13px] text-gray-500 font-medium">
          © 2026 Lentera Abhesa - All rights reserved.
        </p>
      </div>
    </div>
  </footer>
)

// ==========================================
// 6. MAIN PAGE CONTAINER EXPORT
// ==========================================
export default function DukungKamiPage() {
  return (
    <main className="w-full min-h-screen bg-white font-sans antialiased text-gray-900">
      <Navbar />
      <HeroSection />
      <ProductsSection />
      <ValueSection />
      <Footer />
    </main>
  )
}