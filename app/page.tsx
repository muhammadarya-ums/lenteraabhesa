'use client'

import React, { useState, useEffect } from 'react'
import { BookOpen, History, Gamepad2 } from 'lucide-react'
import Image from "next/image"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getCookie, setCookie } from '@/lib/cookies'

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

// 2. COMPONENT: Hero Section
const HeroSection = ({
  totalKamus,
  totalSejarah,
  totalPengunjung,
}: {
  totalKamus: number | string
  totalSejarah: number | string
  totalPengunjung: number | string
}) => (
  <section className="w-full px-8 py-16 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#005C43] leading-tight mb-6">
            Menjaga Bahasa, Merawat Identitas
          </h1>

          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-2">
            Platform digital untuk melestarikan bahasa dan sastra
          </p>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-10">
            Pulau Bawean, memahami dan bangga menjadi bagian dari Pulau Bawean.
          </p>

          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col items-start">
              <p className="text-4xl font-extrabold text-[#005C43] animate-pulse-once">{totalKamus}</p>
              <p className="text-sm text-gray-700 mt-1">Total Kosakata</p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-4xl font-extrabold text-[#005C43] animate-pulse-once">{totalSejarah}</p>
              <p className="text-sm text-gray-700 mt-1">Artikel Sejarah</p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-4xl font-extrabold text-[#005C43] animate-pulse-once">{totalPengunjung}</p>
              <p className="text-sm text-gray-700 mt-1">Total Pengunjung</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center h-83 rounded-3xl">
          <Image
            src="/image2.png"
            alt=""
            width={340}
            height={70}
            priority
          />
        </div>
      </div>
    </div>
  </section>
)

// 3. COMPONENT: Features Section
const FeaturesSection = () => (
  <section className="w-full px-8 py-16 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-[#E5ECE8] hover:-translate-y-1 transition-transform">
          <div className="w-16 h-16 rounded-full bg-[#FFFFFF] flex items-center justify-center mb-4">
            <Image src="/book.png" alt="Kamus Digital" width={32} height={32} className="object-contain" />
          </div>
          <h3 className="text-xl font-bold text-[#005C43] mb-2">Kamus Digital</h3>
          <p className="text-sm text-gray-700">Cari dan pelajari kosakata bawean</p>
        </div>

        <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-[#E5ECE8] hover:-translate-y-1 transition-transform">
          <div className="w-16 h-16 rounded-full bg-[#FFFFFF] flex items-center justify-center mb-4">
            <Image src="/archive-book.png" alt="Sejarah" width={32} height={32} className="object-contain" />
          </div>
          <h3 className="text-xl font-bold text-[#005C43] mb-2">Sejarah</h3>
          <p className="text-sm text-gray-700">Telusuri asal-usul dan ragam halus abhesa</p>
        </div>

        <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-[#E5ECE8] hover:-translate-y-1 transition-transform">
          <div className="w-16 h-16 rounded-full bg-[#FFFFFF] flex items-center justify-center mb-4">
            <Image src="/teacher.png" alt="Belajar Bahasa" width={32} height={32} className="object-contain" />
          </div>
          <h3 className="text-xl font-bold text-[#005C43] mb-2">Belajar Bahasa</h3>
          <p className="text-sm text-gray-700">Belajar seru dan interaktif bahasa halus</p>
        </div>

        <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-[#E5ECE8] hover:-translate-y-1 transition-transform">
          <div className="w-16 h-16 rounded-full bg-[#FFFFFF] flex items-center justify-center mb-4">
            <Image src="/game1.png" alt="Game" width={32} height={32} className="object-contain" />
          </div>
          <h3 className="text-xl font-bold text-[#005C43] mb-2">Game</h3>
          <p className="text-sm text-gray-700">Selesaikan semua tantangan seru</p>
        </div>
      </div>
    </div>
  </section>
)

// 4. COMPONENT: Why Section
const WhySection = () => (
  <section className="w-full px-8 py-16 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#005C43] text-left max-w-sm leading-tight">
          Mengapa Lentera Abhesa?
        </h2>
        <p className="text-gray-700 text-lg text-left max-w-xl leading-relaxed md:pt-2">
          Terbuka untuk semua pelajar, masyarakat dan semua kalangan dimanapun berada untuk belajar dan melestarikan ragam halus abhesa Bawean
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-stretch">
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="rounded-3xl overflow-hidden bg-[#005C43] text-white p-8 md:p-10 h-[240px] flex flex-col justify-start">
            <h3 className="text-3xl font-extrabold mb-4">Melestarikan Bahasa</h3>
            <p className="text-base text-gray-100 leading-relaxed">
              Menangani bahasa halus melalui teknologi digital untuk menjangkau lebih banyak generasi muda
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden bg-gray-200 h-[320px] relative">
            <Image src="/rusa.png" alt="Foto Fauna Bawean" fill className="object-cover" />
          </div>
        </div>

        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="rounded-3xl overflow-hidden bg-gray-200 h-[340px] relative">
            <Image src="/rumah.png" alt="Foto Rumah Bawean" fill className="object-cover" priority />
          </div>
          <div className="rounded-3xl overflow-hidden bg-[#005C43] text-white p-6 h-[220px] flex flex-col justify-start">
            <h3 className="text-2xl font-extrabold mb-3">Edukasi Interaktif</h3>
            <p className="text-sm text-gray-100 leading-relaxed">
              Sediakan akses mudah dan menyenangkan untuk pembelajaran bahasa lokal
            </p>
          </div>
        </div>

        <div className="md:col-span-1 flex flex-col">
          <div className="rounded-3xl overflow-hidden bg-[#005C43] text-white p-8 flex flex-col justify-start h-full min-h-[300px]">
            <h3 className="text-2xl font-extrabold mb-4">Budaya Pulau Bawean</h3>
            <p className="text-base text-gray-100 leading-relaxed">
              Menjaga tradisi lokal dengan dokumentasi budaya yang komprehensif
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
)

// 5. COMPONENT: CTA Section
const CTASection = () => (
  <section className="w-full px-8 py-16 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="bg-linear-to-b from-[#002b1f] to-[#005C43] rounded-3xl text-white p-12 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          Dukung Pelestarian Abhesa Halus Bawean
        </h2>
        <p className="text-base md:text-lg leading-relaxed mb-10 max-w-3xl mx-auto">
          Bersama kita jaga, lestarikan dan contohkan bahasa dan sastra bawean untuk generasi akan datang. Punya usulan kata atau menemukan arti yang berbeda? yuk, beritahu kami!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/dukungkami"
            className="px-8 py-3 rounded-full bg-white text-[#005C43] font-bold hover:bg-gray-100 transition-colors"
          >
            Dukung Kami
          </Link>
          <button className="px-8 py-3 rounded-full border-2 border-white text-white font-bold hover:bg-white/10 transition-colors">
            Ikuti Jejak Kami
          </button>
        </div>
      </div>
    </div>
  </section>
)

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

// MAIN EXPORT
export default function Page() {
  const [totalKamus, setTotalKamus] = useState<number | string>('...')
  const [totalSejarah, setTotalSejarah] = useState<number | string>('...')
  const [totalPengunjung, setTotalPengunjung] = useState<number | string>('...')

  useEffect(() => {
    // --- 1. Fetch stats dari Supabase ---
    const fetchStats = async () => {
      try {
        const { count: countKamus } = await supabase
          .from('kamus')
          .select('*', { count: 'exact', head: true })
        if (countKamus !== null) setTotalKamus(countKamus)

        const { count: countSejarah } = await supabase
          .from('sejarah')
          .select('*', { count: 'exact', head: true })
        if (countSejarah !== null) setTotalSejarah(countSejarah)
      } catch (error) {
        console.error('Gagal mengambil data statistik:', error)
        setTotalKamus(312)
        setTotalSejarah(11)
      }
    }

    // --- 2. Visitor Counter via API Route proxy (bebas CORS) ---
    const handleVisitorCount = async () => {
      try {
        const hasVisited = getCookie('lentera_visited')

        // 'up' untuk pengunjung baru, 'read' untuk yang sudah pernah kunjungi
        const action = hasVisited ? 'read' : 'up'

        const res = await fetch(`/api/visitors?action=${action}`)

        if (!res.ok) throw new Error(`HTTP error: ${res.status}`)

        const data = await res.json()

        if (data?.count !== undefined) {
          // Set cookie SETELAH berhasil increment
          if (!hasVisited) {
            setCookie('lentera_visited', '1', 24)
          }
          setTotalPengunjung(data.count.toLocaleString('id-ID'))
        }
      } catch (error) {
        console.error('Gagal mengambil data pengunjung:', error)
        setTotalPengunjung('2.009')
      }
    }

    fetchStats()
    handleVisitorCount()
  }, [])

  return (
    <main className="w-full bg-white">
      <Navbar />
      <HeroSection
        totalKamus={totalKamus}
        totalSejarah={totalSejarah}
        totalPengunjung={totalPengunjung}
      />
      <FeaturesSection />
      <WhySection />
      <CTASection />
      <Footer />
    </main>
  )
}
