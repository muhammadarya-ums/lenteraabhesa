'use client'

import React, { useState } from 'react'
import { ArrowRight, BookOpen, Award, Download } from 'lucide-react'
import Image from "next/image"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// ==========================================
// 1. COMPONENT: Navbar (UI ASLI LU)
// ==========================================
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
    <nav className="w-full bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Lentera Abhesa" width={140} height={60} priority className="cursor-pointer" />
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

        {/* Right Button (Desktop Only) */}
        <button className="hidden md:block bg-[#005C43] text-white rounded-full px-6 py-2.5 font-medium text-[15px] hover:opacity-90 transition-opacity">
          Dukung Kami
        </button>

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
          <button className="w-full bg-[#005C43] text-white rounded-full py-3 font-bold mt-2">
            Dukung Kami
          </button>
        </div>
      )}
    </nav>
  )
}

// ==========================================
// 2. COMPONENT: Header Section (UI ASLI LU)
// ==========================================
const HeaderSection = () => (
  <section className="w-full px-6 py-12 bg-white">
    <div className="max-w-6xl mx-auto">
      {/* Small Header */}
      <h2 className="text-[32px] font-bold text-[#005C43] mb-1">Tentang kami</h2>
      <p className="text-gray-800 text-[15px]">Yuk! kenalan dengan Lentera Abhesa dan Tim</p>
      
      {/* Main Big Title & Desc */}
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-8 mt-16 items-center">
        <h1 className="text-[44px] md:text-[54px] font-bold text-black leading-[1.15]">
          Menjaga Bahasa,<br />Merawat Identitas
        </h1>
        <p className="text-[17px] text-gray-800 leading-relaxed md:pl-4">
          LENTERA ABHESA merupakan Platform digital<br />
          untuk melestarikan abhesa halus dan sastra<br />
          Pulau Bawean
        </p>
      </div>
    </div>
  </section>
)

// ==========================================
// 3. COMPONENT: Proposal Section (UI GUE YANG LEBIH BAGUS)
// ==========================================
const ProposalSection = () => {
  // Fungsi untuk memaksa download agar tidak kena redirect
  const handleDownload = async () => {
    try {
      const response = await fetch('/proposal.pdf'); // Nama file harus sama dengan di folder public
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Proposal-Penelitian-OPSI.pdf';
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Gagal download:", error);
      alert("File tidak ditemukan, pastikan file bernama 'proposal.pdf' ada di folder public");
    }
  };

  return (
    <section className="w-full px-6 py-20 bg-white border-t border-b border-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2.2fr] gap-12 lg:gap-16 items-center">
          
          {/* Card Proposal */}
          <div className="w-full aspect-[3/4] max-h-[420px] rounded-[24px] shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-gray-100 bg-[#FAFBFB] flex flex-col justify-between p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EBF2EF] rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-[#DCEBE5] transition-colors"></div>
            <div className="flex justify-between items-start z-10">
              <BookOpen className="w-10 h-10 text-[#005C43]" />
              <span className="text-xs font-bold text-gray-400 tracking-wider">OPSI 2026</span>
            </div>
            <div className="z-10">
              <p className="text-xs font-bold text-[#005C43] tracking-widest uppercase mb-2">PROPOSAL PENELITIAN</p>
              <h4 className="text-gray-900 font-extrabold text-lg leading-snug">Revitalisasi Ragam Halus Bahasa Bawean</h4>
            </div>
          </div>

          {/* Right: Actual Academic Context from OPSI Paper */}
        <div className="flex flex-col">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-7 h-7 text-[#005C43]" />
            Latar Belakang Proyek OPSI
          </h3>
          
          <p className="text-[16px] text-gray-700 leading-relaxed mb-6 text-justify">
            Di era globalisasi, generasi muda Bawean mengalami degradasi linguistik yang cukup signifikan. 
            Para generasi muda saat ini cenderung hanya menguasai ragam bahasa kasar atau bahkan beralih sepenuhnya 
            menggunakan bahasa Indonesia dalam komunikasi harian. Memudarnya penguasaan ragam halus (*abhesa alos*) 
            ini secara langsung berdampak buruk pada hilangnya nilai-nilai etika, tata krama, serta jati diri kultural 
            asli masyarakat Bawean.
          </p>
          
          <p className="text-[16px] text-gray-700 leading-relaxed mb-8 text-justify">
            Melalui gagasan platform <strong>"Lentera Abhesa"</strong>, penelitian ini menyelaraskan strategi pelestarian 
            bahasa ibu menggunakan teknologi interaktif yang mudah diakses. Fokusnya adalah menciptakan ekosistem pembelajaran 
            digital yang komprehensif, mencakup pencarian leksikal presisi, klasifikasi hierarki kesopanan, dan dukungan multimedia.
          </p>

            {/* Tombol yang dipaksa download via fungsi di atas */}
            <button 
              onClick={handleDownload}
              className="inline-flex items-center gap-3 bg-[#005C43] hover:bg-[#004431] text-white font-medium text-[16px] px-6 py-3.5 rounded-full transition-all duration-200 shadow-md w-fit group"
            >
              <Download className="w-5 h-5" />
              Unduh Berkas Proposal Resmi
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
// ==========================================
// 4. COMPONENT: Team Section (UI ASLI LU)
// ==========================================
const TeamSection = () => (
  <section className="w-full px-6 py-16 bg-white">
    <div className="max-w-6xl mx-auto">
      {/* Title */}
      <div className="mb-12">
        <h2 className="text-[32px] font-bold text-[#005C43] mb-1">Tim Kami</h2>
        <p className="text-gray-800 text-[15px]"></p>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12">
        {/* Card 1: Rossalinda */}
        <div className="flex flex-col">
          <div className="w-full aspect-square rounded-[32px] bg-[#EBF2EF] mb-4"></div>
          <h3 className="text-lg font-bold text-black">Rosa Diah Shinvani, S.Pd., Gr.</h3>
          <p className="text-[15px] text-gray-800">Guru Pembimbing</p>
        </div>

        {/* Card 2: Adelia */}
        <div className="flex flex-col">
          <div className="w-full aspect-square rounded-[32px] bg-[#EBF2EF] mb-4"></div>
          <h3 className="text-lg font-bold text-black">Najwa Adela Humairah</h3>
          <p className="text-[15px] text-gray-800">Siswa</p>
        </div>

        {/* Card 3: Dewi Kartika */}
        <div className="flex flex-col">
          <div className="w-full aspect-square rounded-[32px] bg-[#EBF2EF] mb-4"></div>
          <h3 className="text-lg font-bold text-black">Dewi Kartika Sari</h3>
          <p className="text-[15px] text-gray-800">Siswa</p>
        </div>
      </div>
    </div>
  </section>
)

// ==========================================
// 5. COMPONENT: Support Section (UI ASLI LU)
// ==========================================
const SupportSection = () => (
  <section className="w-full px-6 py-20 bg-white">
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-10 md:gap-16">
      <p className="text-[18px] text-black">Didukung penuh oleh</p>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-10 md:gap-12">
        {/* Logo 1: SMAN 1 Sangkapura */}
        <div className="flex items-center gap-4">
          <div className="w-[80px] h-[90px] relative">
             <Image src="/SMA.png" alt="SMA NEGERI 1 SANGKAPURA" fill className="object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-bold text-black leading-tight">SMA NEGERI 1</span>
            <span className="text-[16px] font-bold text-black leading-tight">SANGKAPURA</span>
          </div>
        </div>

        {/* Logo 2: Disdik Gresik */}
        <div className="flex items-center gap-4">
          <div className="w-[80px] h-[90px] relative">
             <Image src="/DINAS.png" alt="DINAS PENDIDIKAN KAB GRESIK" fill className="object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="text-[16px] font-bold text-black leading-tight">DINAS PENDIDIKAN</span>
            <span className="text-[16px] font-bold text-black leading-tight">KAB GRESIK</span>
          </div>
        </div>
      </div>
    </div>
  </section>
)

// ==========================================
// 6. COMPONENT: Footer (UI ASLI LU)
// ==========================================
const Footer = () => (
  <footer className="w-full bg-[#EBF2EF] pt-16 pb-6">
    <div className="max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 mb-16">
        {/* Description Column */}
        <div className="flex flex-col pr-4">
          <Image src="/logo.png" alt="Lentera Abhesa" width={140} height={60} className="mb-4" priority />
          <p className="text-[15px] text-black leading-relaxed">
            Platform digital untuk<br />
            melestarikan bahasa dan<br />
            sastra Bawean
          </p>
        </div>

        {/* Navigasi Column */}
        <div className="flex flex-col">
          <h4 className="font-bold text-black text-[15px] mb-4">Navigasi</h4>
          <ul className="space-y-3 text-[15px] text-black">
            <li><Link href="/kamus" className="hover:text-[#005C43]">Kamus</Link></li>
            <li><Link href="/sejarah" className="hover:text-[#005C43]">Sejarah</Link></li>
            <li><Link href="/game" className="hover:text-[#005C43]">Game</Link></li>
            <li><Link href="/tentang-kami" className="hover:text-[#005C43]">Tentang Kami</Link></li>
          </ul>
        </div>

        {/* Media Sosial Column */}
        <div className="flex flex-col">
          <h4 className="font-bold text-black text-[15px] mb-4">Media Sosial</h4>
          <ul className="space-y-3 text-[15px] text-black">
            <li><a href="#" className="hover:text-[#005C43]">Instagram</a></li>
          </ul>
        </div>

        {/* Kontak Column */}
        <div className="flex flex-col">
          <h4 className="font-bold text-black text-[15px] mb-4">Kontak</h4>
          <ul className="space-y-3 text-[15px] text-black">
            <li>Email :</li>
            <li>Phone :</li>
          </ul>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="text-center pt-8 border-t border-gray-300/60">
        <p className="text-[13px] text-gray-500">
          © 2026 Lentera Abhesa · All rights reserved.
        </p>
      </div>
    </div>
  </footer>
)

// ==========================================
// 7. MAIN EXPORT PAGE CONTAINER
// ==========================================
export default function TentangKamiPage() {
  return (
    <main className="w-full min-h-screen bg-white font-sans text-gray-900">
      <Navbar />
      <HeaderSection />
      <ProposalSection />
      <TeamSection />
      <SupportSection />
      <Footer />
    </main>
  )
}