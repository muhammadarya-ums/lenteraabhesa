'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'
import Image from "next/image"

// 1. COMPONENT: Navbar (Sinkronisasi Navigasi & Active State Dinamis)
const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Sesuai dengan tatanan folder aplikasi
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
            // Mencegah "/" mencocokkan semua rute, dan memastikan rute anak seperti /sejarah/[slug] tetap mengaktifkan menu Sejarah
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

// 2. DATA: Detail Artikel Sejarah
const articleData: Record<string, {
  title: string
  description: string
  content: {
    section: string
    text: string
    bullets?: string[]
  }[]
}> = {
  'perkembangan-bahasa-bawean': {
    title: 'Perkembangan bahasa Bawean',
    description: 'Bahasa Bawean adalah bahasa nilo-Autik yang berkaitan dengan bahasa Maduara. Perkembangannya dipengaruhi oleh percampuran dari berbagai budaya dan tradisi merantau masyarakatnya ke negeri-negeri seperti Malaysia dan Singapura.',
    content: [
      {
        section: '1. Karakteristik & Pembentukan Bahasa',
        text: '',
        bullets: [
          'Hlodalisasi & Koneksi: Bahasa Bawean meliputi berbagai istilah guna tata bahasa Triol yang berkaitan dengan isolasinya dari pulau tersebut, kemudian menjadi bahasa triol.',
          'Ciri-cirinya: penyebutan kata "saya" memiliki variasi yang berbeda-beda di tiap desa, seperti Leon (Desa Luar), Ithon (Desa Sangat), Blue (Desa Bujur), dan lain-lain.',
          'Keunikan Tata Bahasa: Sistem ofikasi dan pelatihan bahasa Bawean telah bergeser sehingga sangat berbeda dan lebih iflas dibandingkan bahasa Madura.'
        ]
      },
      {
        section: '2. Pengaruh Budaya Lokal',
        text: '',
        bullets: [
          'Bahasa Arab: Memperkayani kosakata yang berhubungan dengan agama, antara lain.',
          'Bahasa internasional: Korena mobilitas suku Bawean (atau Orang Boyan) yang tinggi ke Malaysia dan Singapura, terdapat penyerapan sejumlah kata bahasa Inggris, Melayu, hingga bahasa Tagalog ke dalam percakapan sehari-hari.',
          'Campur Kode: Penggunaan bahasa Bawean di ruang publik sering kali bercampur dengan bahasa Indonesia atau bahasa Jawa dirasa.'
        ]
      },
      {
        section: '3. Tantangan di Era Modern',
        text: '',
        bullets: [
          'Penurunan Penutut Bahasa Halus: Generasi muda saat ini cenderung lebih akrab dengan bahasa Indonesia dibanding bahasa Bawean.',
          'Pengaruh Media: Penggunaan bahasa Bawean di ruang publik sering kali bercampur dengan bahasa Indonesia atau bahasa Jawa dirasa.',
          'Campur Kode: Penggunaan bahasa Bawean di ruang publik sering kali bercampur dengan bahasa Indonesia atau bahasa Jawa dirasa Gresik.'
        ]
      }
    ]
  },
  'asai-usul-pulau-bawean': {
    title: 'Asai-usul Pulau Bawean',
    description: 'Pulau Bawean adalah pulau terpencil yang mencuri perhatian dari berbagai sumber sejarah. Disebutkan dalam berbagai catatan historis sebagai bagian penting dari kerajaan maritim Nusantara.',
    content: [
      {
        section: '1. Asal-usul Nama Bawean',
        text: '',
        bullets: [
          'Etimologi: Nama "Bawean" diduga berasal dari kata "Ba-wé-an" yang berarti pulau dengan sumber air.',
          'Referensi Historis: Pulau ini disebut dalam berbagai manuskrip kuno sebagai bagian dari jaringan perdagangan maritim.',
          'Pengaruh Budaya: Nama tersebut mencerminkan karakteristik geografis dan budaya masyarakat setempat.'
        ]
      }
    ]
  },
  'budaya-bawean': {
    title: 'Budaya Bawean',
    description: 'Budaya Bawean merepresentasikan perpaduan unik dari berbagai tradisi yang telah bercampur selama berabad-abad.',
    content: [
      {
        section: '1. Tradisi & Adat Istiadat',
        text: '',
        bullets: [
          'Pernikahan Adat: Upacara pernikahan Bawean memiliki rangkaian ritual yang unik dan bermakna mendalam.',
          'Kesenian Tradisional: Berbagai bentuk kesenian seperti tari dan musik tradisional masih dilestarikan hingga kini.',
          'Sistem Kekerabatan: Struktur sosial masyarakat Bawean masih mempertahankan nilai-nilai kolektivitas yang kuat.'
        ]
      }
    ]
  },
}

// 3. COMPONENT: Breadcrumb
const Breadcrumb = ({ slug }: { slug: string }) => {
  const article = articleData[slug]
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
      <Link href="/sejarah" className="hover:text-[#00664B] transition-colors">
        Sejarah
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium">{article?.title || 'Detail Artikel'}</span>
    </div>
  )
}

// 4. COMPONENT: Footer (Sinkronisasi Navigasi)
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

// 5. MAIN DEFAULT EXPORT: Halaman Detail Artikel
export default function ArticleDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const article = articleData[slug]

  // Kondisi jika artikel tidak ditemukan
  if (!article) {
    return (
      <main className="w-full bg-white min-h-screen flex flex-col justify-between">
        <div>
          <Navbar />
          <section className="px-8 py-24 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Artikel tidak ditemukan</h1>
              <p className="text-gray-600 mb-6">Maaf, halaman sejarah yang Anda cari tidak tersedia atau telah dihapus.</p>
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
        {/* Navbar */}
        <Navbar />

        {/* Breadcrumb */}
        <section className="px-8 py-6 border-b border-gray-200">
          <div className="max-w-4xl mx-auto">
            <Breadcrumb slug={slug} />
          </div>
        </section>

        {/* Banner Image */}
        <section className="px-8 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="w-full h-64 rounded-2xl bg-gradient-to-br from-blue-300 to-blue-400 flex items-center justify-center overflow-hidden">
              <span className="text-gray-400 font-medium text-lg">BAWEAN</span>
            </div>
          </div>
        </section>

        {/* Article Content */}
        <section className="px-8 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#00664B] mb-6">
              {article.title}
            </h1>

            {/* Description */}
            <p className="text-gray-700 text-lg leading-relaxed mb-10">
              {article.description}
            </p>

            {/* Sections */}
            <div className="space-y-10">
              {article.content.map((section, idx) => (
                <div key={idx} className="space-y-4">
                  {/* Section Heading */}
                  <h2 className="text-2xl font-extrabold text-gray-900">
                    {section.section}
                  </h2> 

                  {/* Section Text */}
                  {section.text && (
                    <p className="text-gray-700 leading-relaxed">
                      {section.text}
                    </p>
                  )}

                  {/* Bullets */}
                  {section.bullets && (
                    <ul className="space-y-3 ml-6">
                      {section.bullets.map((bullet, bulletIdx) => (
                        <li
                          key={bulletIdx}
                          className="text-gray-700 leading-relaxed flex gap-3"
                        >
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

      {/* Footer Bersama */}
      <Footer />
    </main>
  )
}