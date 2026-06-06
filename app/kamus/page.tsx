'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Volume2, X, Search, Loader2 } from 'lucide-react'
import Image from "next/image"
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface VocabularyItem {
  id: number
  kata_alos: string
  kata_sedang: string
  kata_kasar: string
  arti_indonesia: string
  contoh_kalimat: string
  arti_contoh: string
  pelafalan_alos: string
  pelafalan_sedang: string
  pelafalan_kasar: string
}

// Helper: Menentukan huruf awal kata
const getPrimaryWord = (item: VocabularyItem) => {
  return item.kata_alos || item.kata_sedang || item.kata_kasar || ''
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

// 2. COMPONENT: Footer
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
      </div>
      <div className="border-t border-gray-300 pt-6 text-center">
        <p className="text-sm text-gray-700">© 2026 Lentera Abhesa. All rights reserved.</p>
      </div>
    </div>
  </footer>
)

// 3. COMPONENT: VocabularyCard
const VocabularyCard = ({ item, onClick }: { item: VocabularyItem; onClick: () => void }) => (
  <div onClick={onClick} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5">
    <h3 className="font-bold text-gray-900 text-xl mb-1">{getPrimaryWord(item)}</h3>
    <p className="text-sm text-gray-500">{item.arti_indonesia}</p>
  </div>
)

// 4. COMPONENT: Detail Pop-up Modal (Berdasarkan gambar image_0f60c9.png)
const VocabularyModal = ({ item, onClose }: { item: VocabularyItem; onClose: () => void }) => {
  
  // Fungsi simulasi suara pelafalan kata
  const handleSpeak = (word: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'id-ID'; 
      window.speechSynthesis.speak(utterance);
    }
  };

  const tiers = [
    { type: 'Bahasa Halus', word: item.kata_alos, dotColor: 'bg-emerald-600', textColor: 'text-emerald-700' },
    { type: 'Bahasa Sedang', word: item.kata_sedang, dotColor: 'bg-blue-500', textColor: 'text-blue-500' },
    { type: 'Bahasa Kasar', word: item.kata_kasar, dotColor: 'bg-red-500', textColor: 'text-red-500' },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] max-w-4xl w-full p-6 md:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Tombol Close */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Konten Tingkatan Bahasa */}
        <div className="space-y-4 mt-4">
          {tiers.map((tier, index) => {
            // Jika data kata pada tier ini kosong, jangan tampilkan barisnya
            if (!tier.word) return null;

            return (
              <div 
                key={index} 
                className="bg-[#F8FAFC] rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-center border border-gray-50"
              >
                {/* Sisi Kiri: Detail Kata */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">{tier.word}</h2>
                    <button 
                      onClick={() => handleSpeak(tier.word)}
                      className="text-[#00664B] hover:text-[#004D39] p-1.5 rounded-full hover:bg-emerald-50 transition-colors"
                      title="Dengarkan Pelafalan"
                    >
                      <Volume2 className="w-6 h-6" />
                    </button>
                  </div>
                  
                  {/* Label Kategori Tingkatan */}
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className={`w-2 h-2 rounded-full ${tier.dotColor}`}></span>
                    <span className={tier.textColor}>{tier.type}</span>
                  </div>

                  {/* Arti Bahasa Indonesia */}
                  <div className="flex items-center gap-2 text-gray-600 font-medium mt-1">
                    <span className="inline-flex items-center justify-center rounded-full overflow-hidden shadow-sm">🇮🇩</span>
                    <span>{item.arti_indonesia}</span>
                  </div>
                </div>

                {/* Sisi Kanan: Contoh Penggunaan */}
                <div className="border-t md:border-t-0 md:border-l border-gray-200/80 pt-4 md:pt-0 md:pl-8 flex flex-col justify-center min-h-[80px]">
                  <span className="text-sm font-semibold text-gray-400 mb-1 block">Contoh Penggunaan</span>
                  <p className="text-base font-bold text-gray-800">{item.contoh_kalimat || '-'}</p>
                  <p className="text-sm text-gray-500 italic mt-0.5">({item.arti_contoh || '-'})</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

// Main Page Component
export default function KamusPage() {
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedLetter, setSelectedLetter] = useState('')
  const [selectedItem, setSelectedItem] = useState<VocabularyItem | null>(null)

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  useEffect(() => {
    const fetchVocabulary = async () => {
      setLoading(true)
      const { data } = await supabase.from('kamus').select('*').order('kata_alos')
      if (data) setVocabulary(data)
      setLoading(false)
    }
    fetchVocabulary()
  }, [])

  const groupedVocabulary = useMemo(() => {
    return alphabet.map((letter) => ({
      letter,
      items: vocabulary.filter(i => getPrimaryWord(i).charAt(0).toUpperCase() === letter)
    })).filter(group => group.items.length > 0)
  }, [vocabulary])

  const filteredVocabulary = useMemo(() => {
    return vocabulary.filter((item) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        item.kata_alos?.toLowerCase().includes(q) ||
        item.kata_sedang?.toLowerCase().includes(q) ||
        item.kata_kasar?.toLowerCase().includes(q) ||
        item.arti_indonesia?.toLowerCase().includes(q)
      
      if (searchQuery.trim() !== '') return matchesSearch
      if (selectedLetter !== '') {
        return getPrimaryWord(item).charAt(0).toUpperCase() === selectedLetter
      }
      return true
    })
  }, [vocabulary, searchQuery, selectedLetter])

  const isDefaultView = searchQuery.trim() === '' && selectedLetter === ''

  return (
    <main className="w-full bg-white min-h-screen relative">
      <Navbar />
      
      <section className="px-8 py-12 max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-[#00664B] mb-6">Kamus Bawean</h1>
        
        <input
          type="text"
          placeholder="Cari kata..."
          className="w-full px-6 py-3 mb-6 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#00664B]/20 focus:border-[#00664B]"
          onChange={(e) => {
            setSearchQuery(e.target.value)
            if(e.target.value) setSelectedLetter('')
          }}
        />

        <div className="flex flex-wrap gap-2 mb-8">
            {alphabet.map(letter => (
                <button 
                    key={letter} 
                    onClick={() => { setSelectedLetter(prev => prev === letter ? '' : letter); setSearchQuery(''); }}
                    className={`px-3 py-1 rounded-lg font-bold transition-all ${selectedLetter === letter ? 'bg-[#00664B] text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >{letter}</button>
            ))}
        </div>

        {loading ? (
            <div className="text-center py-12"><Loader2 className="animate-spin w-10 h-10 mx-auto text-[#00664B]" /></div>
        ) : isDefaultView ? (
            <div className="space-y-10">
                {groupedVocabulary.map(group => (
                    <div key={group.letter}>
                        <h2 className="text-2xl font-bold mb-4 border-b pb-2 text-gray-800">{group.letter}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                            {group.items.map(item => (
                              <VocabularyCard 
                                key={item.id} 
                                item={item} 
                                onClick={() => setSelectedItem(item)} 
                              />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {filteredVocabulary.map(item => (
                  <VocabularyCard 
                    key={item.id} 
                    item={item} 
                    onClick={() => setSelectedItem(item)} 
                  />
                ))}
            </div>
        )}
      </section>

      {/* Pop-up Modal Detail Kosa Kata */}
      {selectedItem && (
        <VocabularyModal 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
        />
      )}

      <Footer />
    </main>
  )
}