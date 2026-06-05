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

// 1. COMPONENT: Navbar (Sinkronisasi Navigasi & Active State Dinamis)
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
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image src="/logo.png" alt="Lentera Abhesa" width={100} height={50} priority className="cursor-pointer" />
          </Link>
        </div>

        {/* Desktop Menu */}
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

        {/* Right Button */}
        <button className="hidden md:block bg-[#005C43] text-white rounded-full px-6 py-2 font-bold text-sm hover:opacity-90 transition-opacity">
          Dukung Kami
        </button>

        {/* Hamburger Icon */}
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

// 2. DATA: Vocabulary Data
const vocabularyData: VocabularyItem[] = [
  {
    id: 1,
    word: 'Anape',
    level: 'Halus',
    meaning: 'Wajah',
    example: 'Anape dhasar ring abdi muka',
    exampleMeaning: '(Wajah saya terlihat putih)',
    pronunciation: 'ah-nah-peh',
  },
  {
    id: 2,
    word: 'Bule',
    level: 'Halus',
    meaning: 'Saya',
    example: 'Bule sare ring tongguan',
    exampleMeaning: '(Saya tertidur di tempat tidur)',
    pronunciation: 'boo-leh',
  },
  {
    id: 3,
    word: 'Compok',
    level: 'Halus',
    meaning: 'Rumah',
    example: 'Kulo nggon compok ring Bawean',
    exampleMeaning: '(Saya punya rumah di Bawean)',
    pronunciation: 'chom-pok',
  },
  {
    id: 4,
    word: 'Dhahar',
    level: 'Halus',
    meaning: 'Makan',
    example: 'Kulo Dhahar nasi goreng',
    exampleMeaning: '(Saya makan nasi goreng)',
    pronunciation: 'dhah-har',
  },
  {
    id: 5,
    word: 'Endhog',
    level: 'Halus',
    meaning: 'Telur',
    example: 'Endhog ayam sare ring sarang',
    exampleMeaning: '(Telur ayam tidur di sarang)',
    pronunciation: 'end-hog',
  },
  {
    id: 6,
    word: 'Firman',
    level: 'Halus',
    meaning: 'Perintah',
    example: 'Firman saking guru ring murid',
    exampleMeaning: '(Perintah dari guru ke murid)',
    pronunciation: 'fir-man',
  },
  {
    id: 7,
    word: 'Gajah',
    level: 'Sedang',
    meaning: 'Gajah',
    example: 'Gajah ring taman sare',
    exampleMeaning: '(Gajah di taman sedang tidur)',
    pronunciation: 'gah-jah',
  },
  {
    id: 8,
    word: 'Hati',
    level: 'Halus',
    meaning: 'Hati',
    example: 'Hati ring dada',
    exampleMeaning: '(Hati di dada)',
    pronunciation: 'hah-tee',
  },
  {
    id: 9,
    word: 'Ikan',
    level: 'Sedang',
    meaning: 'Ikan',
    example: 'Ikan ring segoro',
    exampleMeaning: '(Ikan di laut)',
    pronunciation: 'ee-kan',
  },
  {
    id: 10,
    word: 'Jambu',
    level: 'Kasar',
    meaning: 'Jambu',
    example: 'Jambu ring pohon',
    exampleMeaning: '(Jambu di pohon)',
    pronunciation: 'jam-boo',
  },
  {
    id: 11,
    word: 'Kayu',
    level: 'Halus',
    meaning: 'Kayu',
    example: 'Kayu ring nggon',
    exampleMeaning: '(Kayu di tempat)',
    pronunciation: 'kah-yoo',
  },
  {
    id: 12,
    word: 'Laut',
    level: 'Halus',
    meaning: 'Laut',
    example: 'Laut ring ngisor',
    exampleMeaning: '(Laut di bawah)',
    pronunciation: 'lah-oot',
  },
]

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Halus': return '#10B981'
    case 'Sedang': return '#3B82F6'
    case 'Kasar': return '#EF4444'
    default: return '#10B981'
  }
}

// 3. COMPONENT: Vocabulary Card
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
    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
  >
    <div className="flex items-start justify-between mb-2">
      <h3 className="text-lg font-bold text-gray-900">{word}</h3>
      <Volume2 className="w-5 h-5 text-gray-500 hover:text-[#00664B] transition-colors" />
    </div>
    <div className="flex items-center gap-2 mb-3">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getLevelColor(level) }}></div>
      <span className="text-xs font-semibold text-gray-600">{level}</span>
    </div>
    <p className="text-sm text-gray-700">{meaning}</p>
  </div>
)

// 4. COMPONENT: Detail Modal
const Modal = ({
  isOpen,
  onClose,
  item,
}: {
  isOpen: boolean
  onClose: () => void
  item: VocabularyItem | null
}) => {
  if (!isOpen || !item) return null

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose}></div>

      {/* Modal Box */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-11/12 max-w-xl p-8">
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors">
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col gap-6">
          {/* Header Data */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-3xl font-extrabold text-gray-900">{item.word}</h3>
              <button className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
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

          {/* Contoh Penggunaan */}
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

// 5. COMPONENT: Footer (Sinkronisasi Navigasi Link)
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
  const [selectedLetter, setSelectedLetter] = useState('A')
  const [selectedWordItem, setSelectedWordItem] = useState<VocabularyItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  // Filter kata berdasarkan alfabet ATAU query pencarian global
  const filteredVocabulary = useMemo(() => {
    return vocabularyData.filter((item) => {
      const matchesSearch =
        item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Jika user sedang mengetik pencarian, abaikan filter per huruf agar pencarian global berfungsi
      if (searchQuery.trim() !== '') return matchesSearch

      const matchesLetter = item.word.charAt(0).toUpperCase() === selectedLetter.toUpperCase()
      return matchesLetter
    })
  }, [selectedLetter, searchQuery])

  const handleCardClick = (item: VocabularyItem) => {
    setSelectedWordItem(item)
    setIsModalOpen(true)
  }

  return (
    <main className="w-full bg-white min-h-screen flex flex-col justify-between">
      <div>
        <Navbar />

        {/* Header Section */}
        <section className="w-full px-8 py-12 bg-white border-b border-gray-200">
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
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                    onClick={() => setSelectedLetter(letter)}
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
            {filteredVocabulary.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {searchQuery.trim() !== '' ? `Hasil Pencarian: "${searchQuery}"` : selectedLetter}
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
            )}
          </div>
        </section>
      </div>

      {/* Modal & Footer Components */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} item={selectedWordItem} />
      <Footer />
    </main>
  )
}