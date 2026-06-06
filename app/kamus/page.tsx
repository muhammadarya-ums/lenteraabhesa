'use client'

import React, { useState, useMemo } from 'react'
import { Volume2, X, Search } from 'lucide-react'
import Image from "next/image"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface VocabularyItem {
  id: number
  kata_alos: string
  kata_sedang: string
  kata_kasar: string
  arti_indonesia: string
  contoh_kalimat: string
  arti_contoh: string
  pelafalan: string
  audio_url?: string
}

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

        <Link 
          href="/dukungkami" 
          className="hidden md:block bg-[#005C43] text-white rounded-full px-6 py-2 font-bold text-sm hover:opacity-90 transition-opacity"
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

// 2. DATA: Vocabulary Data Lengkap A-Z (Disempurnakan dengan Struktur 3 Tingkat)
const vocabularyData: VocabularyItem[] = [
  { id: 1, kata_alos: 'Anape', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Kenapa', contoh_kalimat: 'Anape dhasar ring abdi muka', arti_contoh: '(Kenapa wajah saya terlihat putih)', pelafalan: 'ah-nah-peh' },
  { id: 2, kata_alos: 'Bule', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Saya', contoh_kalimat: 'Bule sare ring tongguan', arti_contoh: '(Saya tertidur di tempat tidur)', pelafalan: 'boo-leh' },
  { id: 3, kata_alos: 'Compok', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Rumah', contoh_kalimat: 'Kulo nggon compok ring Bawean', arti_contoh: '(Saya punya rumah di Bawean)', pelafalan: 'chom-pok' },
  { id: 4, kata_alos: 'Dhahar', kata_sedang: '', kata_kasar: '', arti_indonesia: 'makan', contoh_kalimat: 'Kulo Dhahar nasi goreng', arti_contoh: '(Saya makan nasi goreng)', pelafalan: 'dhah-har' },
  { id: 5, kata_alos: 'Endhog', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Telur', contoh_kalimat: 'Endhog ayam sare ring sarang', arti_contoh: '(Telur ayam di sarang)', pelafalan: 'end-hog' },
  { id: 6, kata_alos: 'Firman', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Perintah', contoh_kalimat: 'Firman saking guru ring murid', arti_contoh: '(Perintah dari guru ke murid)', pelafalan: 'fir-man' },
  { id: 7, kata_alos: 'Gatuk', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Minum', contoh_kalimat: 'Mator sakalangkong jhek gatuk', arti_contoh: '(Terima kasih sudah minum)', pelafalan: 'gah-took' },
  { id: 8, kata_alos: 'Hedhog', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Sayur', contoh_kalimat: 'Hedhog nika bhengal dheddi', arti_contoh: '(Sayur itu rasanya segar)', pelafalan: 'hed-hog' },
  { id: 9, kata_alos: 'Iwak', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Ikan', contoh_kalimat: 'Iwak bandeng nggon Bawean', arti_contoh: '(Ikan bandeng punya Bawean)', pelafalan: 'ee-wak' },
  { id: 10, kata_alos: 'Jajan', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Makanan ringan', contoh_kalimat: 'Melle jajan ring pasar', arti_contoh: '(Membeli makanan ringan di pasar)', pelafalan: 'jah-jan' },
  { id: 11, kata_alos: 'Kebo', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Kerbau', contoh_kalimat: 'Kebo nika mloba ring sabha', arti_contoh: '(Kerbau itu membajak di sawah)', pelafalan: 'kuh-boh' },
  { id: 12, kata_alos: 'Luwih', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Lebih', contoh_kalimat: 'Luwih dheri se dhi-odhi', arti_contoh: '(Lebih dari yang dikira)', pelafalan: 'loo-wih' },
  { id: 13, kata_alos: 'Mangan', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Makan', contoh_kalimat: 'Mangan areng-sareng kanca', arti_contoh: '(Makan bersama-sama teman)', pelafalan: 'mah-ngan' },
  { id: 14, kata_alos: 'Ngombe', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Minum', contoh_kalimat: 'Ngombe aeng dheri genthong', arti_contoh: '(Minum air dari gentong)', pelafalan: 'ngom-beh' },
  { id: 15, kata_alos: 'Omah', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Rumah', contoh_kalimat: 'Omah bhagus nggon abdi', arti_contoh: '(Rumah bagus milik saya)', pelafalan: 'oh-mah' },
  { id: 16, kata_alos: 'Pangan', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Makanan', contoh_kalimat: 'Pangan nika halal dheddi', arti_contoh: '(Makanan itu halal jadinya)', pelafalan: 'pah-ngan' },
  { id: 17, kata_alos: 'Qurban', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Pengorbanan', contoh_kalimat: 'Qurban areng nggon ibadah', arti_contoh: '(Berkurban demi ibadah)', pelafalan: 'koor-ban' },
  { id: 18, kata_alos: 'Rembug', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Diskusi', contoh_kalimat: 'Rembug mufakat areng warga', arti_contoh: '(Diskusi mufakat bersama warga)', pelafalan: 'rem-boog' },
  { id: 19, kata_alos: 'Sakedap', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Sebentar', contoh_kalimat: 'Nantos sakedap melre', arti_contoh: '(Tunggu sebentar saja)', pelafalan: 'sah-kuh-dap' },
  { id: 20, kata_alos: 'Tamba', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Tambah', contoh_kalimat: 'Tamba aeng sacokobbha', arti_contoh: '(Tambah air secukupnya)', pelafalan: 'tam-bah' },
  { id: 21, kata_alos: 'Ulam', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Sayuran', contoh_kalimat: 'Ulam dhing dheddi daddhien', arti_contoh: '(Sayuran yang dimasak matang)', pelafalan: 'oo-lam' },
  { id: 22, kata_alos: 'Vas', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Penampung bunga', contoh_kalimat: 'Vas bhengal ghinto se raddin', arti_contoh: '(Vas bunga itu indah sekali)', pelafalan: 'vas' },
  { id: 23, kata_alos: 'Werni', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Warna', contoh_kalimat: 'Werni kalambhina abdi celleng', arti_contoh: '(Warna bajunya saya hitam)', pelafalan: 'wer-nee' },
  { id: 24, kata_alos: 'Xerxes', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Nama Raja', contoh_kalimat: 'Kisah Raja Xerxes ring buku', arti_contoh: '(Kisah Raja Xerxes di dalam buku)', pelafalan: 'zerk-zes' },
  { id: 25, kata_alos: 'Yuswa', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Umur', contoh_kalimat: 'Yuswana ampon dhi-seppo', arti_contoh: '(Umurnya sudah sangat tua)', pelafalan: 'yoos-wah' },
  { id: 26, kata_alos: 'Zikir', kata_sedang: '', kata_kasar: '', arti_indonesia: 'Pengingatan Tuhan', contoh_kalimat: 'Zikir ampon neng nggon ati', arti_contoh: '(Zikir sudah menetap di dalam hati)', pelafalan: 'zee-kir' },
]

// 3. COMPONENT: Vocabulary Card
const VocabularyCard = ({
  item,
  onClick,
}: {
  item: VocabularyItem
  onClick: () => void
}) => (
  <div
    onClick={onClick}
    className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-4"
  >
    <div className="flex flex-col gap-3">
      {item.kata_alos && (
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#10B981] bg-[#10B981]/10 rounded-md">Alus</span>
          <span className="text-xl font-bold text-gray-900">{item.kata_alos}</span>
          {item.audio_url && <Volume2 className="w-4 h-4 text-gray-400" />}
        </div>
      )}
      
      {item.kata_sedang && (
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#3B82F6] bg-[#3B82F6]/10 rounded-md">Sedang</span>
          <span className="text-xl font-bold text-gray-900">{item.kata_sedang}</span>
        </div>
      )}

      {item.kata_kasar && (
        <div className="flex items-center gap-3">
          <span className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#EF4444] bg-[#EF4444]/10 rounded-md">Kasar</span>
          <span className="text-xl font-bold text-gray-900">{item.kata_kasar}</span>
        </div>
      )}
    </div>

    <div className="flex items-center gap-2 mt-1 pt-4 border-t border-gray-50">
      {/* Bendera Merah Putih Mini */}
      <div className="w-5 h-3.5 flex flex-col rounded-sm overflow-hidden border border-gray-200 shrink-0">
        <div className="bg-red-600 h-1/2 w-full"></div>
        <div className="bg-white h-1/2 w-full"></div>
      </div>
      <p className="text-sm text-gray-600 font-medium capitalize line-clamp-2">{item.arti_indonesia}</p>
    </div>
  </div>
)

// 4. COMPONENT: Detail Modal
const Modal = ({ isOpen, onClose, item }: { isOpen: boolean; onClose: () => void; item: VocabularyItem | null }) => {
  if (!isOpen || !item) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-11/12 max-w-xl p-8 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            
            {/* Tingkatan Kata */}
            <div className="flex flex-col gap-3">
              {item.kata_alos && (
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#10B981] bg-[#10B981]/10 rounded-md w-20 text-center">Alus</span>
                  <h3 className="text-2xl font-extrabold text-gray-900">{item.kata_alos}</h3>
                </div>
              )}
              {item.kata_sedang && (
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#3B82F6] bg-[#3B82F6]/10 rounded-md w-20 text-center">Sedang</span>
                  <h3 className="text-2xl font-extrabold text-gray-900">{item.kata_sedang}</h3>
                </div>
              )}
              {item.kata_kasar && (
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#EF4444] bg-[#EF4444]/10 rounded-md w-20 text-center">Kasar</span>
                  <h3 className="text-2xl font-extrabold text-gray-900">{item.kata_kasar}</h3>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button className="p-2 bg-[#EBF2EF] rounded-full hover:bg-[#005C43]/20 transition-colors cursor-pointer text-[#005C43]">
                <Volume2 className="w-5 h-5" />
              </button>
              <span className="text-sm text-gray-500 font-mono">/ {item.pelafalan} /</span>
            </div>

            <div className="border-t border-gray-100 pt-4 mt-2">
              <div className="flex items-center gap-2 mb-2">
                 <div className="w-6 h-4 flex flex-col rounded-sm overflow-hidden border border-gray-200">
                  <div className="bg-red-600 h-1/2 w-full"></div>
                  <div className="bg-white h-1/2 w-full"></div>
                </div>
                <span className="font-semibold text-gray-500 text-sm">Arti Bahasa Indonesia:</span>
              </div>
              <p className="text-xl text-gray-800 font-medium">{item.arti_indonesia}</p>
            </div>
          </div>

          <div className="bg-[#EAF2ED]/50 p-5 rounded-xl border border-[#005C43]/10">
            <p className="text-xs font-bold text-[#005C43] uppercase tracking-wider mb-2">Contoh Penggunaan</p>
            <p className="text-lg font-bold text-gray-800 mb-1">{item.contoh_kalimat}</p>
            <p className="text-sm text-gray-600 italic">{item.arti_contoh}</p>
          </div>
        </div>
      </div>
    </>
  )
}

// 5. COMPONENT: Footer
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

// Helper untuk mendapatkan kata utama (Acuan pengelompokan abjad)
const getPrimaryWord = (item: VocabularyItem) => {
  return item.kata_alos || item.kata_sedang || item.kata_kasar || ''
}

// 6. MAIN DEFAULT EXPORT
export default function KamusPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLetter, setSelectedLetter] = useState('')
  const [selectedWordItem, setSelectedWordItem] = useState<VocabularyItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  // Menyiapkan list grup A-Z untuk halaman utama secara dinamis
  const groupedVocabulary = useMemo(() => {
    return alphabet.map((letter) => {
      const items = vocabularyData.filter((item) => {
        const primary = getPrimaryWord(item)
        return primary.charAt(0).toUpperCase() === letter
      })
      return { letter, items }
    })
  }, [])

  // Filter untuk pencarian bar atau klik abjad tunggal
  const filteredVocabulary = useMemo(() => {
    return vocabularyData.filter((item) => {
      // Cek semua variasi kata dan arti Indonesianya
      const matchesSearch =
        (item.kata_alos && item.kata_alos.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.kata_sedang && item.kata_sedang.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.kata_kasar && item.kata_kasar.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.arti_indonesia && item.arti_indonesia.toLowerCase().includes(searchQuery.toLowerCase()))
      
      if (searchQuery.trim() !== '') return matchesSearch

      if (selectedLetter !== '') {
        const primary = getPrimaryWord(item)
        return primary.charAt(0).toUpperCase() === selectedLetter.toUpperCase()
      }

      return true
    })
  }, [selectedLetter, searchQuery])

  const handleCardClick = (item: VocabularyItem) => {
    setSelectedWordItem(item)
    setIsModalOpen(true)
  }

  const isInitialDefaultView = searchQuery.trim() === '' && selectedLetter === ''

  return (
    <main className="w-full bg-white min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Header Section */}
        <section className="w-full px-8 py-12 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-extrabold text-[#00664B] mb-3">Kamus Bawean</h1>
            <p className="text-gray-700 mb-8">
              Telusuri arti kata dalam bahasa bawean dengan mudah
            </p>

            {/* Search Input */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Ketik kata bahasa Bawean atau Indonesia di sini..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    if (e.target.value.trim() !== '') {
                      setSelectedLetter('')
                    }
                  }}
                  className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00664B]"
                />
              </div>
              <button className="bg-[#00664B] text-white rounded-full px-8 py-3 font-bold flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer">
                <Search className="w-5 h-5" />
                Cari
              </button>
            </div>

            {/* Alphabet Filter */}
            {searchQuery.trim() === '' && (
              <div className="flex flex-wrap gap-2">
                {alphabet.map((letter) => (
                  <button
                    key={letter}
                    onClick={() => {
                      setSelectedLetter((prev) => (prev === letter ? '' : letter))
                    }}
                    className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors cursor-pointer ${
                      selectedLetter === letter
                        ? 'bg-[#00664B] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {letter}
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Vocabulary Grid */}
        <section className="w-full px-8 py-12 bg-white">
          <div className="max-w-7xl mx-auto">
            
            {/* KONDISI 1: Tampilan Awal Berkelompok A-Z */}
            {isInitialDefaultView ? (
              <div className="flex flex-col gap-10">
                {groupedVocabulary.map((group) => (
                  <div key={group.letter} className="flex flex-col">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{group.letter}</h2>
                    
                    {group.items.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {group.items.map((item) => (
                          <VocabularyCard
                            key={item.id}
                            item={item}
                            onClick={() => handleCardClick(item)}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic">Belum ada data kata.</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              /* KONDISI 2: Tampilan Hasil Filter Abjad / Pencarian Kata */
              filteredVocabulary.length > 0 ? (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    {searchQuery.trim() !== '' ? `Hasil Pencarian: "${searchQuery}"` : `Huruf ${selectedLetter}`}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredVocabulary.map((item) => (
                      <VocabularyCard
                        key={item.id}
                        item={item}
                        onClick={() => handleCardClick(item)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Tidak ada kata yang ditemukan</p>
                </div>
              )
            )}

          </div>
        </section>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={selectedWordItem} />
      <Footer />
    </main>
  )
}