'use client'

import React, { useState, useEffect } from 'react'
import { BookOpen, History, Gamepad2, ChevronDown } from 'lucide-react'
import Image from "next/image"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import FloatingKomentar from '@/components/FloatingKomentar'
import FeedbackWidget from '@/components/FeedbackWidget'
import TestimoniSection from '@/components/TestimoniSection'
import ChatInterface from '@/components/lentera/ChatInterface'

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
const FeaturesSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const features = [
    {
      title: "Kamus Digital",
      icon: "/book.png",
      shortDesc: "Cari dan pelajari kosakata bawean",
      details: [
        "Pencarian kosakata yang cepat, presisi, dan mudah digunakan.",
        "Menyediakan panduan pelafalan dan contoh penggunaan dalam kalimat sehari-hari.",
        "Terus diperbarui secara berkala dengan kosakata dari penutur asli."
      ]
    },
    {
      title: "Sejarah",
      icon: "/archive-book.png",
      shortDesc: "Telusuri asal-usul dan ragam halus abhesa",
      details: [
        "Eksplorasi artikel mendalam tentang sejarah Pulau Bawean.",
        "Dokumentasi tradisi lisan, adat istiadat, dan budaya lokal yang komprehensif.",
        "Akses ke arsip digital terkait asal-usul perkembangan ragam halus Abhesa."
      ]
    },
    {
      title: "Belajar Bahasa",
      icon: "/teacher.png",
      shortDesc: "Belajar seru dan interaktif bahasa halus",
      details: [
        "Modul pembelajaran yang dirancang bertahap dari level dasar hingga mahir.",
        "Materi tata bahasa dan pembentukan kalimat yang interaktif.",
        "Tips dan trik berkomunikasi langsung menggunakan ragam halus Bawean."
      ]
    },
    {
      title: "Game",
      icon: "/game1.png",
      shortDesc: "Selesaikan semua tantangan seru",
      details: [
        "Mini-games edukatif untuk menguji ingatan kosakata dengan cara yang tidak membosankan.",
        "Dapatkan skor tertinggi dan pecahkan rekor di papan peringkat.",
        "Tantangan harian yang dirancang untuk mempercepat pemahaman bahasa."
      ]
    }
  ]

  return (
    <section className="w-full px-8 py-16 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* ================= 1. DESKTOP VIEW ================= */}
        <div className="hidden md:grid grid-cols-4 gap-6 items-start">
          {features.map((feature, index) => {
            const isOpen = openIndex === index

            return (
              <div
                key={index}
                onClick={() => toggleAccordion(index)}
                className={`flex flex-col items-center text-center p-8 rounded-3xl bg-[#E5ECE8] cursor-pointer transition-all duration-300 select-none ${
                  isOpen ? 'ring-2 ring-[#005C43]/30 shadow-md' : 'hover:-translate-y-1'
                }`}
              >
                <div className="w-16 h-16 rounded-full bg-[#FFFFFF] flex items-center justify-center mb-4 shadow-sm shrink-0">
                  <Image 
                    src={feature.icon} 
                    alt={feature.title} 
                    width={32} 
                    height={32} 
                    className="object-contain" 
                  />
                </div>
                
                <h3 className="text-xl font-bold text-[#005C43] mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-700">{feature.shortDesc}</p>
                
                <ChevronDown 
                  className={`text-[#005C43]/70 mt-3 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[#005C43]' : ''}`} 
                  size={20} 
                />

                <div
                  className={`grid transition-all duration-300 ease-in-out text-left w-full ${
                    isOpen ? "grid-rows-[1fr] opacity-100 mt-5 pt-4 border-t border-[#005C43]/15" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <ul className="space-y-2.5">
                      {feature.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-gray-700 text-xs leading-relaxed">
                          <span className="text-[#005C43] font-bold mt-0.5 shrink-0">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/*2. MOBILE VIEW */}
        <div className="flex md:hidden flex-col gap-4 max-w-md mx-auto">
          {features.map((feature, index) => {
            const isOpen = openIndex === index

            return (
              <div
                key={index}
                className="border border-[#005C43]/20 rounded-3xl overflow-hidden transition-all duration-300 bg-[#E5ECE8]"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-5 py-4 flex items-center justify-between bg-transparent focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                      <Image
                        src={feature.icon}
                        alt={feature.title}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold text-[#005C43]">{feature.title}</h3>
                      <p className="text-xs text-gray-700 mt-0.5">{feature.shortDesc}</p>
                    </div>
                  </div>
                  
                  <ChevronDown
                    className={`text-[#005C43] transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    size={24}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 pt-1">
                      <div className="border-t border-[#005C43]/15 pt-3 ml-[64px]">
                        <ul className="space-y-2">
                          {feature.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-700 text-xs leading-relaxed">
                              <span className="text-[#005C43] font-bold mt-0.5">•</span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

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
          <div className="rounded-3xl overflow-hidden bg-[#005C43] text-white p-8 md:p-10 h-[260px] flex flex-col justify-start">
            <h3 className="text-3xl font-extrabold mb-4">Pulau Bawean</h3>
            <p className="text-base text-gray-100 leading-relaxed">
              Bawean merupakan sebuah pulau kecil yang terletak di bagian utara pulau Jawa. Secara administratif, pulau ini termasuk ke dalam wilayah pemerintahan kabupaten Gresik, Jawa Timur. Dalam kehidupan sehari-hari, masyarakat pulau Bawean berkomunikasi dengan menggunakan bahasa Bawean, yang biasanya disebut masyarakat setempat sebagai bahasa Bahasa Bhebien.
            </p>
          </div>
          <div className="rounded-3xl overflow-hidden bg-gray-200 h-[320px] relative">
            <Image src="/rusa.png" alt="Foto Fauna Bawean" fill className="object-cover" />
          </div>
        </div>

        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="rounded-3xl overflow-hidden bg-gray-200 h-[320px] relative">
            <Image src="/rumah.png" alt="Foto Rumah Bawean" fill className="object-cover" priority />
          </div>
          <div className="rounded-3xl overflow-hidden bg-[#005C43] text-white p-6 h-[260px] flex flex-col justify-start">
            <h3 className="text-2xl font-extrabold mb-3">Edukasi Interaktif</h3>
            <p className="text-sm text-gray-100 leading-relaxed">
              Menghadirkan alternatif pembelajaran bahasa lokal yang dinamis dan sistematis. Lewat pendekatan digital yang interaktif, generasi muda dan generasi lainnya dapat mengenali susunan kosakata dan konteks tutur luhur Bawean dengan lebih mudah dan terarah.
            </p>
          </div>
        </div>

        <div className="md:col-span-1 flex flex-col">
          <div className="rounded-3xl overflow-hidden bg-[#005C43] text-white p-8 flex flex-col justify-start h-full min-h-[300px]">
            <h3 className="text-2xl font-extrabold mb-4">Melestarikan Bahasa</h3>
            <p className="text-base text-gray-100 leading-relaxed">
              Menghidupkan kembali keindahan ragam halus Abhesa melalui platform pembelajaran berbasis teknologi. Inovasi ini hadir sebagai wadah dokumentasi digital sekaligus media interaktif bagi generasi muda untuk merawat identitas budaya Pulau Bawean.
              ​Secara linguistik, bahasa Bawean kerap dinilai memiliki kemiripan makna dan pelafalan dengan bahasa Jawa serta Madura, fenomena yang dikenal sebagai integrasi. Keunikan relasi bahasa inilah yang juga ingin diabadikan dan dipelajari lebih dalam melalui platform ini.
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
          <Link
            href="/tanya-lentera" // 👈 Mengarah ke halaman rute Next.js
            className="px-8 py-3 rounded-full border-2 border-white text-white font-bold hover:bg-white/10 transition-colors"
          >
            Tanya Lentera AI
          </Link>
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
  
  // State baru untuk menampung data feedback
  const [feedbacks, setFeedbacks] = useState<any[]>([])

  useEffect(() => {
    // --- 1. Fetch stats murni dari Supabase ---
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
      }
    }

    // --- 2. SISTEM PENGUNJUNG MURNI SUPABASE (ANTI SPAM) ---
    const handleVisitorCount = async () => {
      try {
        const today = new Date().toISOString().split('T')[0] 
        const lastVisit = localStorage.getItem('lentera_last_visit')

        if (lastVisit !== today) {
           const { error: insertError } = await supabase
            .from('pengunjung')
            .insert([{ ip_address: navigator.userAgent }])  
           
           if (!insertError) {
             localStorage.setItem('lentera_last_visit', today)
           } else {
             console.error("Gagal mencatat kunjungan ke database:", insertError)
           }
        }

        const { count, error: countError } = await supabase
          .from('pengunjung')
          .select('*', { count: 'exact', head: true })
        
        if (countError) throw countError
        if (count !== null) setTotalPengunjung(count.toLocaleString('id-ID'))

      } catch (error) {
        console.error('Sistem pengunjung error:', error)
        setTotalPengunjung('...')
      }
    }

    // --- 3. Ambil data Feedback / Komentar ---
    const fetchFeedbacks = async () => {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('id, name, topic, rating')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(5)

        if (error) throw error
        if (data) setFeedbacks(data)
      } catch (error) {
        console.error('Gagal mengambil feedback:', error)
      }
    }

    fetchStats()
    handleVisitorCount()
    fetchFeedbacks() // Panggil function fetch feedback-nya
  }, [])

  return (
    <main className="w-full bg-white relative">
      <Navbar />
      <HeroSection
        totalKamus={totalKamus}
        totalSejarah={totalSejarah}
        totalPengunjung={totalPengunjung}
      />
      <FeaturesSection />
      <WhySection />
      
      {/* TARUH TESTIMONI DI SINI */}
      <TestimoniSection />
      
      <CTASection />
      <Footer />

      {/* Widget buat ngisi form */}
      <FeedbackWidget />

      {/* Widget floating yang pop-up */}
      {feedbacks && feedbacks.length > 0 && (
        <FloatingKomentar feedbacks={feedbacks} />
      )}
    </main>
  )
}