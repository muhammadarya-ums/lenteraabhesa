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
  
  contoh_kalimat_alos: string
  arti_contoh_alos: string
  pelafalan_kalimat_alos: string
  
  contoh_kalimat_sedang: string
  arti_contoh_sedang: string
  pelafalan_kalimat_sedang: string
  
  contoh_kalimat_kasar: string
  arti_contoh_kasar: string
  pelafalan_kalimat_kasar: string
  
  pelafalan_alos: string
  pelafalan_sedang: string
  pelafalan_kasar: string
}

const getPrimaryWord = (item: VocabularyItem) => {
  return item.arti_indonesia || ''
}

// ==========================================
// 1. COMPONENT: Navbar
// ==========================================
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
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : '☰'}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-6 flex flex-col gap-4 animate-in slide-in-from-top-4 shadow-lg">
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
            className="w-full bg-[#005C43] text-white rounded-full py-3 font-bold text-center mt-2"
          >
            Dukung Kami
          </Link>
        </div>
      )}
    </nav>
  )
}

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
        <p className="text-sm text-gray-700">© {new Date().getFullYear()} Lentera Abhesa. All rights reserved.</p>
      </div>
    </div>
  </footer>
)

const VocabularyCard = ({ item, onClick }: { item: VocabularyItem; onClick: () => void }) => {
  const baweanWordsPreview = [item.kata_kasar, item.kata_sedang, item.kata_alos]
    .filter(Boolean)
    .join(' / ');

  return (
    <div onClick={onClick} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer hover:-translate-y-0.5 flex flex-col justify-center h-full gap-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200">ID</span>
        <h3 className="font-bold text-gray-900 text-lg leading-tight capitalize">{getPrimaryWord(item)}</h3>
      </div>
      <p className="text-sm text-gray-500 italic line-clamp-1 truncate">
        Bawean: <span className="font-medium text-gray-600">{baweanWordsPreview || '-'}</span>
      </p>
    </div>
  )
}

const VocabularyModal = ({ item, onClose }: { item: VocabularyItem; onClose: () => void }) => {

  const handleSpeak = (text: string, audioUrl?: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.error("Gagal memutar audio:", e));
    } else if ('speechSynthesis' in window && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID'; 
      window.speechSynthesis.speak(utterance);
    }
  };

  const tiers = [
    { 
      type: 'Bahasa Halus', 
      word: item.kata_alos, 
      audioWord: item.pelafalan_alos,
      dotColor: 'bg-emerald-500', 
      textColor: 'text-[#005C43]',
      contoh: item.contoh_kalimat_alos,
      artiContoh: item.arti_contoh_alos,
      audioContoh: item.pelafalan_kalimat_alos
    },
    { 
      type: 'Bahasa Sedang', 
      word: item.kata_sedang, 
      audioWord: item.pelafalan_sedang,
      dotColor: 'bg-blue-500', 
      textColor: 'text-blue-500',
      contoh: item.contoh_kalimat_sedang,
      artiContoh: item.arti_contoh_sedang,
      audioContoh: item.pelafalan_kalimat_sedang
    },
    { 
      type: 'Bahasa Kasar', 
      word: item.kata_kasar, 
      audioWord: item.pelafalan_kasar,
      dotColor: 'bg-red-500', 
      textColor: 'text-red-500',
      contoh: item.contoh_kalimat_kasar,
      artiContoh: item.arti_contoh_kasar,
      audioContoh: item.pelafalan_kalimat_kasar
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] max-w-4xl w-full p-6 md:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
        
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100 z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-4 mt-8 md:mt-2 relative">
          {tiers.map((tier, index) => {
            if (!tier.word) return null;

            return (
              <div 
                key={index} 
                className="bg-[#F8FAFC] rounded-[24px] p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center border border-gray-100"
              >
                {/* Sisi Kiri: Kata */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">{tier.word}</h2>
                    <button 
                      onClick={() => handleSpeak(tier.word, tier.audioWord)}
                      className="text-[#005C43] hover:text-[#004D39] p-2 rounded-full hover:bg-emerald-50 transition-all shrink-0 shadow-sm border border-emerald-100 bg-white"
                      title="Dengarkan Kata"
                    >
                      <Volume2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm font-bold">
                      <span className={`w-2 h-2 rounded-full ${tier.dotColor}`}></span>
                      <span className={tier.textColor}>{tier.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 font-medium text-sm mt-1">
                      <span className="text-[10px] font-bold border border-gray-300 rounded px-1.5 py-0.5 text-gray-400 bg-white">ID</span>
                      <span>{item.arti_indonesia}</span>
                    </div>
                  </div>
                </div>

                {/* Sisi Kanan: Kalimat */}
                <div className="border-t md:border-t-0 md:border-l border-gray-200/80 pt-5 md:pt-0 md:pl-8 flex flex-col justify-center min-h-[90px]">
                  <span className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Contoh Penggunaan</span>
                  
                  {tier.contoh ? (
                    <div className="flex flex-col gap-1">
                      <div className="flex items-start gap-3">
                        <p className="text-base font-bold text-gray-800 leading-snug flex-1 pt-1">
                          {tier.contoh}
                        </p>
                        <button 
                          onClick={() => handleSpeak(tier.contoh, tier.audioContoh)}
                          className="text-[#005C43] hover:text-[#004D39] p-1.5 rounded-full hover:bg-emerald-50 transition-all shrink-0 bg-white border border-emerald-100 shadow-sm"
                          title="Dengarkan Kalimat"
                        >
                          <Volume2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 italic mt-0.5">({tier.artiContoh || 'Tidak ada terjemahan'})</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 italic">Belum ada contoh penggunaan.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

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
      const { data } = await supabase.from('kamus').select('*').order('arti_indonesia', { ascending: true })
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
    <main className="w-full bg-[#F9FAFB] min-h-screen relative flex flex-col">
      <Navbar />
      
      <section className="px-6 md:px-8 py-12 max-w-7xl mx-auto w-full flex-1">
        <h1 className="text-4xl font-extrabold text-[#005C43] mb-2">Kamus Bawean</h1>
        <p className="text-gray-500 mb-8 font-medium">Cari kata dalam Bahasa Indonesia untuk melihat terjemahan dan tingkatan Bahasa Bawean.</p>
        
        <div className="relative mb-6">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari kata Indonesia atau Bawean..."
            className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#005C43]/20 focus:border-[#005C43] text-gray-800 transition-all"
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if(e.target.value) setSelectedLetter('')
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2 custom-scrollbar">
            {alphabet.map(letter => (
                <button 
                    key={letter} 
                    onClick={() => { setSelectedLetter(prev => prev === letter ? '' : letter); setSearchQuery(''); }}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border ${selectedLetter === letter ? 'bg-[#005C43] text-white border-[#005C43] shadow-md shadow-[#005C43]/20' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-800'}`}
                >{letter}</button>
            ))}
        </div>

        {loading ? (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin w-10 h-10 text-[#005C43]" />
              <p className="text-gray-500 font-medium">Memuat kamus...</p>
            </div>
        ) : isDefaultView ? (
            <div className="space-y-12">
                {groupedVocabulary.map(group => (
                    <div key={group.letter}>
                        <div className="flex items-center gap-4 mb-6">
                          <h2 className="text-3xl font-black text-gray-900">{group.letter}</h2>
                          <div className="h-px bg-gray-200 flex-1 mt-2"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
            <div>
              <p className="text-gray-500 mb-6 font-medium text-sm">Menampilkan hasil pencarian...</p>
              {filteredVocabulary.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-gray-500 font-medium">Kata tidak ditemukan. Coba kata kunci lain.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {filteredVocabulary.map(item => (
                      <VocabularyCard 
                        key={item.id} 
                        item={item} 
                        onClick={() => setSelectedItem(item)} 
                      />
                    ))}
                </div>
              )}
            </div>
        )}
      </section>

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