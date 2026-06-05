'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Lightbulb, Check } from 'lucide-react'
import Image from "next/image"

interface Question {
  id: number
  image: string
  question: string
  options: { label: string; text: string }[]
  correctAnswer: string
  explanation: string
  culturalFact: string
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
            // Memastikan sub-rute /game/tebak-gambar tetap mengaktifkan menu induk Game
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

// 2. DATA: Questions
const QUESTIONS: Question[] = [
  {
    id: 1,
    image: 'deer',
    question: 'Apa Bahasa Bawean dari binatang tersebut?',
    options: [
      { label: 'A', text: 'Kerbau' },
      { label: 'B', text: 'Menjhangan' },
      { label: 'C', text: 'Jaran' },
      { label: 'D', text: 'Gajah' },
    ],
    correctAnswer: 'B',
    explanation: 'Manjhangan = Rusa Bawean',
    culturalFact: 'Rusa Bawean merupakan satwa endemik Pulau Bawean yang dilindungi.',
  },
  {
    id: 2,
    image: 'house',
    question: 'Apa bahasa Bawean untuk rumah tradisional?',
    options: [
      { label: 'A', text: 'Omah' },
      { label: 'B', text: 'Dhukuh' },
      { label: 'C', text: 'Griya' },
      { label: 'D', text: 'Pendopo' },
    ],
    correctAnswer: 'A',
    explanation: 'Omah = Rumah Tradisional Bawean',
    culturalFact: 'Rumah tradisional Bawean memiliki arsitektur unik yang mencerminkan budaya lokal.',
  },
  {
    id: 3,
    image: 'food',
    question: 'Makanan tradisional Bawean dalam bahasa lokal disebut?',
    options: [
      { label: 'A', text: 'Lumpia' },
      { label: 'B', text: 'Dhahhar' },
      { label: 'C', text: 'Pecel' },
      { label: 'D', text: 'Rujak' },
    ],
    correctAnswer: 'B',
    explanation: 'Dhahhar = Makanan Bawean',
    culturalFact: 'Kuliner Bawean memiliki cita rasa unik yang dipengaruhi budaya maritim dan pertanian lokal.',
  },
]

// 3. COMPONENT: Footer (Sinkronisasi Navigasi)
const Footer = () => (
  <footer className="w-full bg-[#EAF2ED] py-12 px-8 mt-16">
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
          <h4 className="font-bold text-[#005C43] text-base mb-3">Contact</h4>
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

// 4. MAIN DEFAULT EXPORT
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

  const handleCheckAnswer = () => {
    if (!selectedAnswer) return
    setIsAnswered(true)
    if (!isCorrect && lives > 1) {
      setLives(lives - 1)
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

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-extrabold text-[#00664B] mb-1">Game 🎮</h1>
              <p className="text-gray-700 text-sm">Bermain sambil belajar, selesaikan semua tantangan seru</p>
            </div>
            {/* Tombol X kembali ke Halaman Utama Game */}
            <Link href="/game" className="text-2xl p-2 hover:opacity-70 transition-opacity cursor-pointer text-decoration-none">
              ❌
            </Link>
          </div>

          {/* Quiz Title */}
          <h2 className="text-3xl font-bold text-[#00664B] mb-6">Tebak Gambar</h2>

          {/* Lives & Hint */}
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
              className="flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold text-sm hover:bg-yellow-200 transition-colors"
            >
              <Lightbulb className="w-4 h-4" />
              Petunjuk
            </button>
          </div>

          {/* Main Content */}
          {!isAnswered ? (
            // Question State
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Image Section */}
              <div className="flex items-center justify-center">
                <div className="w-full h-64 md:h-80 bg-linear-to-br from-blue-300 to-green-200 rounded-3xl flex items-center justify-center text-4xl shadow-xs">
                  {currentQuestion.image === 'deer' && '🦌'}
                  {currentQuestion.image === 'house' && '🏠'}
                  {currentQuestion.image === 'food' && '🍲'}
                </div>
              </div>

              {/* Question Section */}
              <div className="flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-8">{currentQuestion.question}</h3>

                {/* Hint Box */}
                {showHint && (
                  <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                    <p className="text-sm text-yellow-800">
                      <strong>Petunjuk:</strong> Coba perhatikan huruf {currentQuestion.correctAnswer}
                    </p>
                  </div>
                )}

                {/* Options */}
                <div className="space-y-3 mb-8">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option.label}
                      onClick={() => handleAnswerSelect(option.label)}
                      className={`w-full text-left p-4 rounded-full border-2 font-semibold transition-all duration-200 ${
                        selectedAnswer === option.label
                          ? 'border-[#00664B] bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <span className="text-[#00664B] font-bold">{option.label}.</span> {option.text}
                    </button>
                  ))}
                </div>

                {/* Check Answer Button */}
                <button
                  onClick={handleCheckAnswer}
                  disabled={!selectedAnswer}
                  className={`px-8 py-3 rounded-full font-bold text-white text-base transition-opacity ${
                    selectedAnswer
                      ? 'bg-[#00664B] hover:opacity-90 cursor-pointer'
                      : 'bg-gray-400 cursor-not-allowed opacity-50'
                  }`}
                >
                  Cek Jawaban
                </button>
              </div>
            </div>
          ) : (
            // Answer Result State
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Result Icon */}
              <div className="flex flex-col items-center justify-center">
                {isCorrect ? (
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto rounded-full bg-[#00664B] flex items-center justify-center mb-4">
                      <Check className="w-14 h-14 text-white" />
                    </div>
                    <h3 className="text-3xl font-extrabold text-[#00664B]">BENAR</h3>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto rounded-full bg-red-500 flex items-center justify-center mb-4">
                      <span className="text-4xl text-white">✕</span>
                    </div>
                    <h3 className="text-3xl font-extrabold text-red-600">SALAH</h3>
                  </div>
                )}
              </div>

              {/* Explanation Section */}
              <div className="flex flex-col justify-center">
                <h4 className="text-xl font-bold text-gray-800 mb-4">{currentQuestion.explanation}</h4>

                {/* Cultural Fact Box */}
                <div className="bg-green-50 border-l-4 border-[#00664B] rounded-lg p-6 mb-8">
                  <h5 className="font-bold text-[#00664B] mb-2">Fakta Budaya:</h5>
                  <p className="text-gray-700 text-sm leading-relaxed">{currentQuestion.culturalFact}</p>
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextQuestion}
                  className={`px-8 py-3 rounded-full font-bold text-white text-base transition-opacity ${
                    currentQuestionIndex < QUESTIONS.length - 1
                      ? 'bg-[#00664B] hover:opacity-90'
                      : 'bg-gray-400'
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