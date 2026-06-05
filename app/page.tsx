'use client'

import React, { useState } from 'react'
import { BookOpen, History, Gamepad2 } from 'lucide-react'
import Image from "next/image";

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState('Beranda')

  return (
  <nav className="w-full flex justify-between items-center py-4 px-50 bg-white border-b border-gray-200">
    <div className="flex items-center">
      <Image
        src="/logo.png"
        alt="Lentera Abhesa"
        width={120}
        height={70}
        priority
      />
    </div>
  

      {/* Center Navigation */}
      <div className="hidden md:flex gap-6">
        {['Beranda', 'Kamus', 'Sejarah', 'Game', 'Tentang Kami'].map((item) => (
          <button
            key={item}
            onClick={() => setActiveMenu(item)}
            className={`text-sm font-semibold transition-colors ${
              activeMenu === item
                ? 'text-[#005C43]'
                : 'text-gray-700 hover:text-[#005C43]'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Right Button */}
      <button className="bg-[#005C43] text-white rounded-full px-6 py-2 font-bold text-sm hover:opacity-90 transition-opacity">
        Dukung Kami
      </button>
    </nav>
  )
}

const HeroSection = () => (
  <section className="w-full px-8 py-16 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Content */}
        <div className="flex flex-col justify-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#005C43] leading-tight mb-6">
            Menjaga Bahasa, Merawat Identitas
          </h1>
          
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-2">
            Platform digital untuk melestarikan dan mengembangkan bahasa lokal.
          </p>
          <p className="text-base md:text-lg text-gray-700 leading-relaxed mb-10">
            Bersama-sama menjaga warisan budaya melalui teknologi modern yang terjangkau.
          </p>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col items-start">
              <p className="text-4xl font-extrabold text-[#005C43]">312</p>
              <p className="text-sm text-gray-700 mt-1">Total Kosakata</p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-4xl font-extrabold text-[#005C43]">11</p>
              <p className="text-sm text-gray-700 mt-1">Abjad Sejarah</p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-4xl font-extrabold text-[#005C43]">2,009</p>
              <p className="text-sm text-gray-700 mt-1">Total Pengucapan</p>
            </div>
          </div>
        </div>

        {/* Right Illustration */}
        <div className="flex items-center justify-center h-83 rounded-3xl bg-[#F0F5F3]">
          <Image
        src="/image2.png"
        alt=""
        width={350}
        height={70}
        priority
      />
        </div>
      </div>
    </div>
  </section>
)

const FeaturesSection = () => (
  <section className="w-full px-8 py-16 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Kamus Digital */}
        <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-[#F0F5F3] hover:-translate-y-1 transition-transform">
          <div className="w-16 h-16 rounded-full bg-[#E0EAE6] flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-[#005C43]" />
          </div>
          <h3 className="text-xl font-bold text-[#005C43] mb-2">Kamus Digital</h3>
          <p className="text-sm text-gray-700">Cari dan pelajari ribuan kosakata lokal dengan mudah</p>
        </div>

        {/* Sejarah */}
        <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-[#F0F5F3] hover:-translate-y-1 transition-transform">
          <div className="w-16 h-16 rounded-full bg-[#E0EAE6] flex items-center justify-center mb-4">
            <History className="w-8 h-8 text-[#005C43]" />
          </div>
          <h3 className="text-xl font-bold text-[#005C43] mb-2">Sejarah</h3>
          <p className="text-sm text-gray-700">Telusuri asal-usul dan perkembangan bahasa lokal</p>
        </div>

        {/* Game */}
        <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-[#F0F5F3] hover:-translate-y-1 transition-transform">
          <div className="w-16 h-16 rounded-full bg-[#E0EAE6] flex items-center justify-center mb-4">
            <Gamepad2 className="w-8 h-8 text-[#005C43]" />
          </div>
          <h3 className="text-xl font-bold text-[#005C43] mb-2">Game</h3>
          <p className="text-sm text-gray-700">Belajar sambil bermain dengan mini-game edukatif</p>
        </div>

        {/* Seksologi Bahasa */}
        <div className="flex flex-col items-center text-center p-8 rounded-3xl bg-[#F0F5F3] hover:-translate-y-1 transition-transform">
          <div className="w-16 h-16 rounded-full bg-[#E0EAE6] flex items-center justify-center mb-4">
            <span className="text-[#005C43] font-bold text-2xl">Σ</span>
          </div>
          <h3 className="text-xl font-bold text-[#005C43] mb-2">Seksologi Bahasa</h3>
          <p className="text-sm text-gray-700">Memahami aturan tata bahasa dan penggunaannya</p>
        </div>
      </div>
    </div>
  </section>
)

const WhySection = () => (
  <section className="w-full px-8 py-16 bg-white">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-5xl font-extrabold text-[#005C43] mb-4 text-center">
        Mengapa Lentera Abhesa?
      </h2>
      <p className="text-center text-gray-700 mb-12 max-w-2xl mx-auto text-lg">
        Kami menyediakan platform terlengkap untuk melestarikan bahasa lokal dengan teknologi modern dan pendekatan yang inklusif
      </p>

      {/* Bento Grid: grid-cols-1 md:grid-cols-4 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Item 1: Melestarikan Bahasa - md:col-span-2 */}
        <div className="md:col-span-2 rounded-2xl overflow-hidden bg-[#005C43] text-white p-8 flex flex-col justify-between min-h-[280px]">
          <div>
            <h3 className="text-3xl font-extrabold mb-4">Melestarikan Bahasa</h3>
            <p className="text-base leading-relaxed">
              Menangani abhasa halus melalui teknologi digital untuk menjangkau lebih banyak generasi muda
            </p>
          </div>
        </div>

        {/* Item 2: Foto Rumah - md:col-span-1 */}
        <div className="md:col-span-1 rounded-2xl overflow-hidden bg-gray-300 h-48 flex items-center justify-center">
          <p className="text-gray-600 font-medium">Foto Rumah</p>
        </div>

        {/* Item 3: Budaya Pulau Bawean - md:col-span-1 md:row-span-2 */}
        <div className="md:col-span-1 md:row-span-2 rounded-2xl overflow-hidden bg-[#005C43] text-white p-8 flex flex-col justify-between min-h-[280px]">
          <div>
            <h3 className="text-2xl font-extrabold mb-3">Budaya Pulau Bawean</h3>
            <p className="text-base leading-relaxed">
              Menjaga tradisi lokal dengan dokumentasi budaya yang komprehensif
            </p>
          </div>
        </div>

        {/* Item 4: Foto Rusa - md:col-span-2 */}
        <div className="md:col-span-2 rounded-2xl overflow-hidden bg-gray-300 h-48 flex items-center justify-center">
          <p className="text-gray-600 font-medium">Foto Fauna</p>
        </div>

        {/* Item 5: Edukasi Interaktif - md:col-span-1 */}
        <div className="md:col-span-1 rounded-2xl overflow-hidden bg-[#005C43] text-white p-8 flex flex-col justify-between min-h-[148px]">
          <div>
            <h3 className="text-2xl font-extrabold mb-3">Edukasi Interaktif</h3>
            <p className="text-sm leading-relaxed">
              Sediakan akses mudah dan menyenangkan untuk pembelajaran bahasa lokal
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const CTASection = () => (
  <section className="w-full px-8 py-16 bg-white">
    <div className="max-w-5xl mx-auto">
      <div className="bg-linear-to-b from-[#002b1f] to-[#005C43] rounded-3xl text-white p-12 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          Dukung Pelestarian Abhesa Halus Bawean
        </h2>
        <p className="text-base md:text-lg leading-relaxed mb-10 max-w-3xl mx-auto">
          Bergabunglah dengan kami dalam misi melestarikan warisan bahasa dan budaya Indonesia. Setiap kontribusi Anda membantu generasi mendatang memahami akar identitas mereka.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="px-8 py-3 rounded-full bg-white text-[#005C43] font-bold hover:bg-gray-100 transition-colors">
            Dukung Kami
          </button>
          <button className="px-8 py-3 rounded-full border-2 border-white text-white font-bold hover:bg-white/10 transition-colors">
            Ikuti Jejak Kami
          </button>
        </div>
      </div>
    </div>
  </section>
)

const Footer = () => (
  <footer className="w-full bg-[#EAF2ED] py-12 px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Column 1: Logo & Description */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <Image
        src="/logo.png"
        alt="Lentera Abhesa"
        width={120}
        height={70}
        priority
      />
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            Platform digital untuk melestarikan bahasa lokal dan budaya Indonesia
          </p>
        </div>

        {/* Column 2: Navigasi */}
        <div className="flex flex-col">
          <h4 className="font-bold text-[#005C43] text-base mb-3">Navigasi</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><a href="/app" className="hover:text-[#005C43] transition-colors">Beranda</a></li>
            <li><a href="#" className="hover:text-[#005C43] transition-colors">Kamus</a></li>
            <li><a href="#" className="hover:text-[#005C43] transition-colors">Sejarah</a></li>
            <li><a href="#" className="hover:text-[#005C43] transition-colors">Game</a></li>
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

export default function Page() {
  return (
    <main className="w-full bg-white">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <WhySection />
      <CTASection />
      <Footer />
    </main>
  )
}
