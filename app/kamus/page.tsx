'use client'

import React, { useState, useMemo } from 'react'
import { Volume2, X, Search } from 'lucide-react'

const Navbar = () => {
  const [activeMenu, setActiveMenu] = useState('Kamus')

  return (
    <nav className="w-full flex justify-between items-center py-4 px-8 bg-white border-b border-gray-200">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-[#00664B] rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">LA</span>
        </div>
        <span className="font-extrabold text-[#00664B] text-lg">LENTERA ABHESA</span>
      </div>

      <div className="hidden md:flex gap-6">
        {['Beranda', 'Kamus', 'Sejarah', 'Game', 'Tentang Kami'].map((item) => (
          <button
            key={item}
            onClick={() => setActiveMenu(item)}
            className={`text-sm font-semibold transition-colors ${
              activeMenu === item
                ? 'text-[#00664B]'
                : 'text-gray-700 hover:text-[#00664B]'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <button className="bg-[#00664B] text-white rounded-full px-6 py-2 font-bold text-sm hover:opacity-90 transition-opacity">
        Dukung Kami
      </button>
    </nav>
  )
}

// Vocabulary data structure
const vocabularyData = [
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
    meaning: 'Soya',
    example: 'Bule sare ring tongguan',
    exampleMeaning: '(Soya tertidur di tempat tidur)',
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
    case 'Halus':
      return '#10B981'
    case 'Sedang':
      return '#3B82F6'
    case 'Kasar':
      return '#EF4444'
    default:
      return '#10B981'
  }
}

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
      <Volume2 className="w-5 h-5 text-gray-500" />
    </div>
    <div className="flex items-center gap-2 mb-3">
      <div
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: getLevelColor(level) }}
      ></div>
      <span className="text-xs font-semibold text-gray-600">{level}</span>
    </div>
    <p className="text-sm text-gray-700">{meaning}</p>
  </div>
)

const Modal = ({
  isOpen,
  onClose,
  selectedLetter,
}: {
  isOpen: boolean
  onClose: () => void
  selectedLetter: string
}) => {
  const filteredData = useMemo(
    () => vocabularyData.filter((item) => item.word.charAt(0) === selectedLetter),
    [selectedLetter]
  )

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-50 w-11/12 max-w-2xl max-h-96 overflow-y-auto p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Words List */}
          <div className="space-y-6">
            {filteredData.slice(0, 3).map((item) => (
              <div key={item.id}>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{item.word}</h3>
                  <Volume2 className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getLevelColor(item.level) }}
                  ></div>
                  <span className="text-sm font-semibold text-gray-600">{item.level}</span>
                </div>
                <p className="text-sm text-gray-700">{item.meaning}</p>
              </div>
            ))}
          </div>

          {/* Right: Example Usage */}
          <div className="space-y-6">
            {filteredData.slice(0, 3).map((item) => (
              <div key={item.id}>
                <p className="text-sm font-semibold text-gray-600 mb-1">Contoh Penggunaan</p>
                <p className="text-base font-bold text-red-600 mb-1">{item.example}</p>
                <p className="text-sm text-gray-500">{item.exampleMeaning}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default function KamusPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLetter, setSelectedLetter] = useState('A')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const filteredVocabulary = useMemo(() => {
    return vocabularyData.filter((item) => {
      const matchesLetter = item.word.charAt(0) === selectedLetter
      const matchesSearch =
        item.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesLetter && matchesSearch
    })
  }, [selectedLetter, searchQuery])

  const groupedByLetter = useMemo(() => {
    const grouped: { [key: string]: typeof vocabularyData } = {}
    vocabularyData.forEach((item) => {
      const letter = item.word.charAt(0)
      if (!grouped[letter]) {
        grouped[letter] = []
      }
      grouped[letter].push(item)
    })
    return grouped
  }, [])

  const displayedLetters = Object.keys(groupedByLetter).sort()

  return (
    <main className="w-full bg-white min-h-screen">
      <Navbar />

      {/* Header Section */}
      <section className="w-full px-8 py-12 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-extrabold text-[#00664B] mb-3">Kamus Bawean</h1>
          <p className="text-gray-700 mb-8">
            Telusuri arti kata dalam bahasa bawean dengan mudah
          </p>

          {/* Search & Filter */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Ketik kata disini"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00664B]"
              />
            </div>
            <button className="bg-[#00664B] text-white rounded-full px-8 py-3 font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Search className="w-5 h-5" />
              Cari
            </button>
          </div>

          {/* Alphabet Filter */}
          <div className="flex flex-wrap gap-2">
            {alphabet.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                  selectedLetter === letter
                    ? 'bg-[#00664B] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {letter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Vocabulary Grid */}
      <section className="w-full px-8 py-12 bg-white">
        <div className="max-w-7xl mx-auto">
          {filteredVocabulary.length > 0 ? (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{selectedLetter}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredVocabulary.map((item) => (
                  <VocabularyCard
                    key={item.id}
                    word={item.word}
                    level={item.level}
                    meaning={item.meaning}
                    onClick={() => setIsModalOpen(true)}
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

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedLetter={selectedLetter} />
    </main>
  )
}
const Footer = () => (
  <footer className="w-full bg-[#EAF2ED] py-12 px-8">
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Column 1: Logo & Description */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#00664B] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">LA</span>
            </div>
            <span className="font-extrabold text-[#00664B]">LENTERA ABHESA</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">
            Platform digital untuk melestarikan bahasa lokal dan budaya Indonesia
          </p>
        </div>

        {/* Column 2: Navigasi */}
        <div className="flex flex-col">
          <h4 className="font-bold text-[#00664B] text-base mb-3">Navigasi</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><a href="#" className="hover:text-[#00664B] transition-colors">Beranda</a></li>
            <li><a href="#" className="hover:text-[#00664B] transition-colors">Kamus</a></li>
            <li><a href="#" className="hover:text-[#00664B] transition-colors">Sejarah</a></li>
            <li><a href="#" className="hover:text-[#00664B] transition-colors">Game</a></li>
          </ul>
        </div>

        {/* Column 3: Media Sosial */}
        <div className="flex flex-col">
          <h4 className="font-bold text-[#00664B] text-base mb-3">Media Sosial</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><a href="#" className="hover:text-[#00664B] transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-[#00664B] transition-colors">Facebook</a></li>
            <li><a href="#" className="hover:text-[#00664B] transition-colors">Twitter</a></li>
          </ul>
        </div>

        {/* Column 4: Kontak */}
        <div className="flex flex-col">
          <h4 className="font-bold text-[#00664B] text-base mb-3">Kontak</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><a href="mailto:info@lenteraabhesa.com" className="hover:text-[#00664B] transition-colors">Email</a></li>
            <li><a href="tel:+62000000000" className="hover:text-[#00664B] transition-colors">Phone</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-300 pt-6 text-center">
        <p className="text-sm text-gray-700">© 2024 Lentera Abhesa. All rights reserved.</p>
      </div>
    </div>
  </footer>
)