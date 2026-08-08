'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from "next/image"
import { usePathname } from 'next/navigation'
import { BookOpen, History, Gamepad2, ChevronDown, X, Phone, MessageCircle } from 'lucide-react'

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
// 2. COMPONENT: Game Card (Sesuai Desain Figma)
// ==========================================
interface GameCardProps {
  title: string
  description: string
  imageSrc: string
  href: string
  isAvailable?: boolean
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
          Ayo Mulai →
        </button>
      ) : (
        <button className="w-full bg-gray-400 text-white rounded-full py-3.5 font-bold text-base cursor-not-allowed">
          Segera Hadir
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

            {/* 2. Tebak Kata (Sekarang Aktif!) */}
            <GameCard
              title="Tebak Kata"
              description="Tebak arti kata bahasa Bawean dengan tepat"
              imageSrc="/tebakkata.png" 
              href="/game/tebak-kata"
              isAvailable={true} 
            />

            {/* 3. Susun Kata (Sekarang Aktif!) */}
            <GameCard
              title="Susun Kata"
              description="Susun huruf acak menjadi kata bahas Bawean"
              imageSrc="/susunkata.png" 
              href="/game/susun-kata"
              isAvailable={true} 
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </main>
  )
}