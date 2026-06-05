'use client'

import React, { useState, useMemo } from 'react'
import { Volume2, X, Search } from 'lucide-react'
import Image from "next/image"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface VocabularyItem {
  id: number
  word: string
  level: string
  meaning: string
  example: string
  exampleMeaning: string
  pronunciation: string
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

// 2. DATA: Vocabulary Data Lengkap A-Z Sesuai Gambar Lampiran (Tanpa Dummy Card)
const vocabularyData: VocabularyItem[] = [
  { id: 1, word: 'Anape', level: 'Halus', meaning: 'Kenapa', example: 'Anape dhasar ring abdi muka', exampleMeaning: '(Kenapa wajah saya terlihat putih)', pronunciation: 'ah-nah-peh' },
  { id: 2, word: 'Bule', level: 'Halus', meaning: 'Saya', example: 'Bule sare ring tongguan', exampleMeaning: '(Saya tertidur di tempat tidur)', pronunciation: 'boo-leh' },
  { id: 3, word: 'Compok', level: 'Halus', meaning: 'Rumah', example: 'Kulo nggon compok ring Bawean', exampleMeaning: '(Saya punya rumah di Bawean)', pronunciation: 'chom-pok' },
  { id: 4, word: 'Dhahar', level: 'Halus', meaning: 'makan', example: 'Kulo Dhahar nasi goreng', exampleMeaning: '(Saya makan nasi goreng)', pronunciation: 'dhah-har' },
  { id: 5, word: 'Endhog', level: 'Halus', meaning: 'Telur', example: 'Endhog ayam sare ring sarang', exampleMeaning: '(Telur ayam di sarang)', pronunciation: 'end-hog' },
  { id: 6, word: 'Firman', level: 'Halus', meaning: 'Perintah', example: 'Firman saking guru ring murid', exampleMeaning: '(Perintah dari guru ke murid)', pronunciation: 'fir-man' },
  { id: 7, word: 'Gatuk', level: 'Halus', meaning: 'Minum', example: 'Mator sakalangkong jhek gatuk', exampleMeaning: '(Terima kasih sudah minum)', pronunciation: 'gah-took' },
  { id: 8, word: 'Hedhog', level: 'Halus', meaning: 'Sayur', example: 'Hedhog nika bhengal dheddi', exampleMeaning: '(Sayur itu rasanya segar)', pronunciation: 'hed-hog' },
  { id: 9, word: 'Iwak', level: 'Halus', meaning: 'Ikan', example: 'Iwak bandeng nggon Bawean', exampleMeaning: '(Ikan bandeng punya Bawean)', pronunciation: 'ee-wak' },
  { id: 10, word: 'Jajan', level: 'Halus', meaning: 'Makanan ringan', example: 'Melle jajan ring pasar', exampleMeaning: '(Membeli makanan ringan di pasar)', pronunciation: 'jah-jan' },
  { id: 11, word: 'Kebo', level: 'Halus', meaning: 'Kerbau', example: 'Kebo nika mloba ring sabha', exampleMeaning: '(Kerbau itu membajak di sawah)', pronunciation: 'kuh-boh' },
  { id: 12, word: 'Luwih', level: 'Halus', meaning: 'Lebih', example: 'Luwih dheri se dhi-odhi', exampleMeaning: '(Lebih dari yang dikira)', pronunciation: 'loo-wih' },
  { id: 13, word: 'Mangan', level: 'Halus', meaning: 'Makan', example: 'Mangan areng-sareng kanca', exampleMeaning: '(Makan bersama-sama teman)', pronunciation: 'mah-ngan' },
  { id: 14, word: 'Ngombe', level: 'Halus', meaning: 'Minum', example: 'Ngombe aeng dheri genthong', exampleMeaning: '(Minum air dari gentong)', pronunciation: 'ngom-beh' },
  { id: 15, word: 'Omah', level: 'Halus', meaning: 'Rumah', example: 'Omah bhagus nggon abdi', exampleMeaning: '(Rumah bagus milik saya)', pronunciation: 'oh-mah' },
  { id: 16, word: 'Pangan', level: 'Halus', meaning: 'Makanan', example: 'Pangan nika halal dheddi', exampleMeaning: '(Makanan itu halal jadinya)', pronunciation: 'pah-ngan' },
  { id: 17, word: 'Qurban', level: 'Halus', meaning: 'Pengorbanan', example: 'Qurban areng nggon ibadah', exampleMeaning: '(Berkurban demi ibadah)', pronunciation: 'koor-ban' },
  { id: 18, word: 'Rembug', level: 'Halus', meaning: 'Diskusi', example: 'Rembug mufakat areng warga', exampleMeaning: '(Diskusi mufakat bersama warga)', pronunciation: 'rem-boog' },
  { id: 19, word: 'Sakedap', level: 'Halus', meaning: 'Sebentar', example: 'Nantos sakedap melre', exampleMeaning: '(Tunggu sebentar saja)', pronunciation: 'sah-kuh-dap' },
  { id: 20, word: 'Tamba', level: 'Halus', meaning: 'Tambah', example: 'Tamba aeng sacokobbha', exampleMeaning: '(Tambah air secukupnya)', pronunciation: 'tam-bah' },
  { id: 21, word: 'Ulam', level: 'Halus', meaning: 'Sayuran', example: 'Ulam dhing dheddi daddhien', exampleMeaning: '(Sayuran yang dimasak matang)', pronunciation: 'oo-lam' },
  { id: 22, word: 'Vas', level: 'Halus', meaning: 'Penampung bunga', example: 'Vas bhengal ghinto se raddin', exampleMeaning: '(Vas bunga itu indah sekali)', pronunciation: 'vas' },
  { id: 23, word: 'Werni', level: 'Halus', meaning: 'Warna', example: 'Werni kalambhina abdi celleng', exampleMeaning: '(Warna bajunya saya hitam)', pronunciation: 'wer-nee' },
  { id: 24, word: 'Xerxes', level: 'Halus', meaning: 'Nama Raja', example: 'Kisah Raja Xerxes ring buku', exampleMeaning: '(Kisah Raja Xerxes di dalam buku)', pronunciation: 'zerk-zes' },
  { id: 25, word: 'Yuswa', level: 'Halus', meaning: 'Umur', example: 'Yuswana ampon dhi-seppo', exampleMeaning: '(Umurnya sudah sangat tua)', pronunciation: 'yoos-wah' },
  { id: 26, word: 'Zikir', level: 'Halus', meaning: 'Pengingatan Tuhan', example: 'Zikir ampon neng nggon ati', exampleMeaning: '(Zikir sudah menetap di dalam hati)', pronunciation: 'zee-kir' },
]

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Halus': return '#10B981'
    case 'Sedang': return '#3B82F6'
    case 'Kasar': return '#EF4444'
    default: return '#10B981'
  }
}

// 3. COMPONENT: Vocabulary Card (Desain Presisi Mengikuti Gambar)
const VocabularyCard = ({
  word,
  level,
  meaning,
  onClick,
}: {
  word: string
  level: string
  meaning: string
  onClick: () => void
}) => (
  <div
    onClick={onClick}
    className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer flex flex-col gap-3"
  >
    <div className="flex items-center gap-2">
      <h3 className="text-xl font-bold text-gray-900">{word}</h3>
      <Volume2 className="w-5 h-5 text-[#005C43] hover:opacity-80 transition-opacity" />
    </div>
    <div className="flex items-center gap-2">
      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getLevelColor(level) }}></div>
      <span className="text-sm font-medium text-[#00664B]">Bahas {level}</span>
    </div>
    <div className="flex items-center gap-2 mt-1">
      {/* Bendera Merah Putih Mini */}
      <div className="w-5 h-3.5 flex flex-col rounded-sm overflow-hidden border border-gray-200">
        <div className="bg-red-600 h-1/2 w-full"></div>
        <div className="bg-white h-1/2 w-full"></div>
      </div>
      <p className="text-sm text-gray-600 font-medium capitalize">{meaning}</p>
    </div>
  </div>
)

// 4. COMPONENT: Detail Modal
const Modal = ({ isOpen, onClose, item }: { isOpen: boolean; onClose: () => void; item: VocabularyItem | null }) => {
  if (!isOpen || !item) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-11/12 max-w-xl p-8">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-3xl font-extrabold text-gray-900">{item.word}</h3>
              <button className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors cursor-pointer">
                <Volume2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getLevelColor(item.level) }}></div>
              <span className="text-sm font-semibold text-gray-600">{item.level}</span>
              <span className="text-xs text-gray-400 font-mono">/ {item.pronunciation} /</span>
            </div>
            <p className="text-lg text-gray-800 border-t border-gray-100 pt-3">
              <span className="font-semibold text-[#00664B]">Arti:</span> {item.meaning}
            </p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contoh Penggunaan</p>
            <p className="text-lg font-bold text-red-600 mb-1">{item.example}</p>
            <p className="text-sm text-gray-600 italic">{item.exampleMeaning}</p>
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
      const items = vocabularyData.filter(
        (item) => item.word.charAt(0).toUpperCase() === letter
      )
      return { letter, items }
    })
  }, [])

  // Filter untuk pencarian bar atau klik abjad tunggal
  const filteredVocabulary = useMemo(() => {
    return vocabularyData.filter((item) => {
      const matchesSearch =
        item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase())
      
      if (searchQuery.trim() !== '') return matchesSearch

      if (selectedLetter !== '') {
        return item.word.charAt(0).toUpperCase() === selectedLetter.toUpperCase()
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
                    
                    {/* LOGIKA KRUSIAL: Hanya merender grid card jika admin sudah mengisi data */}
                    {group.items.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {group.items.map((item) => (
                          <VocabularyCard
                            key={item.id}
                            word={item.word}
                            level={item.level}
                            meaning={item.meaning}
                            onClick={() => handleCardClick(item)}
                          />
                        ))}
                      </div>
                    ) : (
                      // Jika data kosong, tidak ada card placeholder yang keluar (sesuai request)
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
                        word={item.word}
                        level={item.level}
                        meaning={item.meaning}
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