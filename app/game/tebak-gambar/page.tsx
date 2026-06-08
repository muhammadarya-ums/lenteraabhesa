'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Lightbulb, Check } from 'lucide-react'
import Image from "next/image"
import { supabase } from '@/lib/supabase'

// ==========================================
// 1. INTERFACE: Sesuai Struktur Data Input Game
// ==========================================
interface Question {
  id: number
  image: string        // 1. Image (Path URL gambar seperti '/deer.png')
  question: string     // 2. Soal
  options: { label: string; text: string }[] // 3. Pilihan Jawaban
  correctAnswer: string // 4. Jawaban Benar ('A', 'B', 'C', atau 'D')
  hint: string         // 5. Petunjuk (Clue yang muncul saat diklik)
  explanation: string  // Penjelasan tambahan setelah dijawab
  culturalFact: string // Fakta budaya terkait soal
}

// ==========================================
// 2. COMPONENT: Navbar (Sinkronisasi Navigasi)
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

        <button className="hidden md:block bg-[#005C43] text-white rounded-full px-6 py-2 font-bold text-sm hover:opacity-90 transition-opacity">
          Dukung Kami
        </button>

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
          <Link href="/dukungkami" className="w-full bg-[#005C43] text-white rounded-full py-3 font-bold text-center">
            Dukung Kami
          </Link>
        </div>
      )}
    </nav>
  )
}

// ==========================================
// 3. DATA SOURCE: Bank Soal Tebak Gambar
// ==========================================
const QUESTIONS: Question[] = [
  {
    id: 1,
    image: '/tebakgambar.png', // Pastikan file gambar ditaruh di folder public/
    question: 'Apa Bahasa Bawean dari binatang tersebut?',
    options: [
      { label: 'A', text: 'Kerbau' },
      { label: 'B', text: 'Menjhangan' },
      { label: 'C', text: 'Jaran' },
      { label: 'D', text: 'Gajah' },
    ],
    correctAnswer: 'B',
    hint: 'Hewan endemik berkaki empat yang lincah dan bertanduk indah.',
    explanation: 'Manjhangan = Rusa Bawean',
    culturalFact: 'Rusa Bawean merupakan satwa endemik Pulau Bawean yang dilindungi.',
  },
  {
    id: 2,
    image: '/rumah.png',
    question: 'Apa bahasa Bawean untuk rumah tradisional?',
    options: [
      { label: 'A', text: 'Omah' },
      { label: 'B', text: 'Dhukuh' },
      { label: 'C', text: 'Griya' },
      { label: 'D', text: 'Pendopo' },
    ],
    correctAnswer: 'A',
    hint: 'Kata ini juga umum digunakan dalam bahasa Jawa halus maupun ngoko untuk bangunan tempat tinggal.',
    explanation: 'Omah = Rumah Tradisional Bawean',
    culturalFact: 'Rumah tradisional Bawean memiliki arsitektur unik yang mencerminkan budaya lokal.',
  },
  {
    id: 3,
    image: '/kuliner.jpg',
    question: 'Makanan tradisional Bawean dalam bahasa lokal disebut?',
    options: [
      { label: 'A', text: 'Lumpia' },
      { label: 'B', text: 'Dhahhar' },
      { label: 'C', text: 'Pecel' },
      { label: 'D', text: 'Rujak' },
    ],
    correctAnswer: 'B',
    hint: 'Istilah sopan/halus yang merujuk pada hidangan makanan atau aktivitas makan.',
    explanation: 'Dhahhar = Makanan Bawean',
    culturalFact: 'Kuliner Bawean memiliki cita rasa unik yang dipengaruhi budaya maritim dan pertanian lokal.',
  },
]

// ==========================================
// 4. COMPONENT: Footer
// ==========================================
const Footer = () => (
  <footer className="w-full bg-[#EAF2ED] py-12 px-8 mt-16">
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

// ==========================================
// 5. MAIN DEFAULT EXPORT: Tebak Gambar Page
// ==========================================
export default function TebakGambarPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [lives, setLives] = useState(3)
  const [showHint, setShowHint] = useState(false)

  const currentQuestion = QUESTIONS[currentQuestionIndex]
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer

  const handleAnswerSelect = (label: string) => {
    if (!isAnswered) {
      setSelectedAnswer(label)
    }
  }

  // FUNGSI BARU: Nembak database saat jawaban benar
  const handleCheckAnswer = async () => {
    if (!selectedAnswer) return
    setIsAnswered(true)

    if (selectedAnswer === currentQuestion.correctAnswer) {
      // INJEKSI TRACKER GAME: Kirim riwayat saat sukses jawab ke Supabase
      try {
        await supabase.from('permainan').insert([{ jenis_game: 'tebak_gambar' }])
      } catch (error) {
        console.error("Gagal tracking game:", error)
      }
    } else {
      if (lives > 1) {
        setLives(lives - 1)
      }
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedAnswer(null)
      setIsAnswered(false)
      setShowHint(false)
    }
  }

  return (
    <main className="w-full min-h-screen bg-white flex flex-col justify-between">
      <div>
        {/* Render Navbar */}
        <Navbar />

        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Main Top Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-[#005C43] mb-1">Game 🎮</h1>
              <p className="text-gray-700 text-sm">Bermain sambil belajar, selesaikan semua tantangan seru</p>
            </div>
            {/* Tombol X Kembali ke Menu Game */}
            <Link href="/game" className="text-2xl p-2 hover:opacity-70 transition-opacity cursor-pointer">
              ❌
            </Link>
          </div>

          {/* Quiz Title */}
          <h2 className="text-3xl font-bold text-[#005C43] mb-6">Tebak Gambar</h2>

          {/* Lives & Clue Action Bar */}
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-gray-200">
            <div className="flex gap-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Heart
                  key={i}
                  className={`w-6 h-6 ${i < lives ? 'fill-red-500 text-red-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-5 py-2.5 rounded-full font-bold text-sm hover:bg-yellow-200 transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              Petunjuk
            </button>
          </div>

          {/* Interactive Workspace Area */}
          {!isAnswered ? (
            /* ==========================================================
               A. QUESTION STATE (Sebelum Cek Jawaban)
               ========================================================== */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* IMAGE HOUSING BLOCK */}
              <div className="flex items-center justify-center">
                <div className="w-full h-64 md:h-80 bg-[#EBF2EE] rounded-[32px] relative overflow-hidden border border-gray-100 shadow-sm flex items-center justify-center">
                  <Image 
                    src={currentQuestion.image} 
                    alt="Soal Tebak Gambar" 
                    fill
                    className="object-contain p-6"
                    sizes="(max-w-lg) 100vw, 500px"
                    priority
                  />
                </div>
              </div>

              {/* DETAILS & OPTIONS PANEL */}
              <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-8">{currentQuestion.question}</h3>

                {/* Clue Prompt Box */}
                {showHint && (
                  <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-xl animate-in fade-in duration-300">
                    <p className="text-sm text-yellow-800 leading-relaxed">
                      <strong>💡 Clue Petunjuk:</strong> {currentQuestion.hint}
                    </p>
                  </div>
                )}

                {/* Multiple Choices Option Grid */}
                <div className="space-y-3 mb-8">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => handleAnswerSelect(option.label)}
                      className={`w-full text-left p-4 rounded-full border-2 font-semibold transition-all duration-200 ${
                        selectedAnswer === option.label
                          ? 'border-[#005C43] bg-green-50 text-[#005C43]'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                      }`}
                    >
                      <span className="text-[#005C43] font-bold mr-1">{option.label}.</span> {option.text}
                    </button>
                  ))}
                </div>

                {/* Form Action Submit Button */}
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswer}
                  className={`w-full md:w-auto px-10 py-3.5 rounded-full font-bold text-white text-base transition-all ${
                    selectedAnswer
                      ? 'bg-[#005C43] hover:opacity-95 cursor-pointer shadow-sm'
                      : 'bg-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  Cek Jawaban
                </button>
              </div>
            </div>
          ) : (
            /* ==========================================================
               B. ANSWER RESULT STATE (Setelah Cek Jawaban Klik)
               ========================================================== */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Feedback State Graphic */}
              <div className="flex flex-col items-center justify-center">
                {isCorrect ? (
                  <div className="text-center animate-in zoom-in-95 duration-300">
                    <div className="w-24 h-24 mx-auto rounded-full bg-[#005C43] flex items-center justify-center mb-4 shadow-sm">
                      <Check className="w-14 h-14 text-white" />
                    </div>
                    <h3 className="text-4xl font-extrabold text-[#005C43] tracking-wide">BENAR</h3>
                  </div>
                ) : (
                  <div className="text-center animate-in zoom-in-95 duration-300">
                    <div className="w-24 h-24 mx-auto rounded-full bg-red-500 flex items-center justify-center mb-4 shadow-sm">
                      <span className="text-4xl text-white font-bold">✕</span>
                    </div>
                    <h3 className="text-4xl font-extrabold text-red-600 tracking-wide">SALAH</h3>
                  </div>
                )}
              </div>

              {/* Cultural Context Details Panel */}
              <div className="flex flex-col justify-center">
                <h4 className="text-2xl font-bold text-gray-900 mb-4">{currentQuestion.explanation}</h4>

                {/* Info Card Block */}
                <div className="bg-green-50 border-l-4 border-[#005C43] rounded-2xl p-6 mb-8 shadow-xs">
                  <h5 className="font-bold text-[#005C43] text-base mb-2">Fakta Budaya:</h5>
                  <p className="text-gray-700 text-sm leading-relaxed">{currentQuestion.culturalFact}</p>
                </div>

                {/* Pagination Sequence Control */}
                <button
                  onClick={handleNextQuestion}
                  className={`w-full md:w-auto px-10 py-3.5 rounded-full font-bold text-white text-base transition-opacity ${
                    currentQuestionIndex < QUESTIONS.length - 1
                      ? 'bg-[#005C43] hover:opacity-95'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {currentQuestionIndex < QUESTIONS.length - 1 ? 'Lanjutkan →' : 'Selesai'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Render Footer */}
      <Footer />
    </main>
  )
}