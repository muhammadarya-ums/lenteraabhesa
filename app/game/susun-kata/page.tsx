'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Check, Loader2, X, Trophy, RotateCcw } from 'lucide-react'
import Image from "next/image"
import { supabase } from '@/lib/supabase'

interface WordObject {
  id: string
  text: string
}

interface ScrambleGameFormat {
  id: number
  indonesianClue: string
  correctSentence: string
  shuffledWords: WordObject[]
}

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
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : '☰'}
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

export default function SusunKataPage() {
  const [dataset, setDataset] = useState<ScrambleGameFormat[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const [selectedWords, setSelectedWords] = useState<WordObject[]>([])
  const [availableWords, setAvailableWords] = useState<WordObject[]>([])
  
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [isGameOver, setIsGameOver] = useState(false)
  const [isGameFinished, setIsGameFinished] = useState(false)

  const wrongAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    wrongAudioRef.current = new Audio('/sounds/salah.mp3')
    fetchScrambleData()
  }, [])

  const fetchScrambleData = async () => {
    try {
      setLoading(true)
      const { data: soalData, error } = await supabase.from('soal_susun_kata').select('*')

      if (error || !soalData || soalData.length === 0) {
        throw new Error('Tidak ada data soal')
      }

      const formatted: ScrambleGameFormat[] = soalData.map((item, idx) => {
        const sentence = item.kalimat_benar!.trim()
        const words = sentence.split(/\s+/).filter((w: string) => w.length > 0)
        
        const wordObjects: WordObject[] = words.map((w: string, wIdx: number) => ({
          id: `${item.id || idx}-${wIdx}`,
          text: w
        }))

        const shuffled = [...wordObjects].sort(() => 0.5 - Math.random())

        return {
          id: item.id || idx + 1,
          indonesianClue: item.clue_indonesia!,
          correctSentence: sentence,
          shuffledWords: shuffled
        }
      })

      const shuffledQuestions = formatted.sort(() => 0.5 - Math.random())
      setDataset(shuffledQuestions)
      loadRound(shuffledQuestions, 0)
    } catch (err) {
      console.error('Error fetching data:', err)
      setDataset([])
    } finally {
      setLoading(false)
    }
  }

  const loadRound = (data: ScrambleGameFormat[], index: number) => {
    if (data.length > 0 && index < data.length) {
      setCurrentIndex(index)
      setAvailableWords([...data[index].shuffledWords])
      setSelectedWords([])
      setIsAnswered(false)
      setIsCorrect(false)
    }
  }

  const playWrongSound = () => {
    if (wrongAudioRef.current) {
      wrongAudioRef.current.currentTime = 0
      wrongAudioRef.current.play().catch(e => console.log('Audio play failed:', e))
    }
  }

  const handleEndGame = async (finalScore: number) => {
    try {
      await supabase.from('game_analytics').insert([
        {
          game_name: 'susun_kata',
          session_id: navigator.userAgent,
          score: finalScore
        }
      ])
    } catch (err) {
      console.error("Gagal mencatat analitik game:", err)
    }
  }

  const restartGame = () => {
    setLives(3)
    setScore(0)
    setCurrentIndex(0)
    setIsGameOver(false)
    setIsGameFinished(false)
    fetchScrambleData()
  }

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#005C43] animate-spin mb-4" />
        <p className="text-gray-500 font-medium">Menyiapkan Balok Kata...</p>
      </div>
    )
  }

  if (dataset.length === 0) {
    return (
      <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="bg-gray-50 border border-gray-200 p-8 rounded-2xl text-center max-w-md">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Soal</h2>
          <p className="text-gray-500 font-medium mb-6">Soal Susun Kata belum tersedia dari Admin.</p>
          <Link href="/game" className="px-8 py-3 bg-[#005C43] text-white rounded-full font-bold hover:opacity-90 inline-block transition-opacity">
            Kembali ke Menu Game
          </Link>
        </div>
      </div>
    )
  }

  const currentRound = dataset[currentIndex]

  const handleWordClick = (wordObj: WordObject, fromSelected: boolean) => {
    if (isAnswered) return

    if (fromSelected) {
      setSelectedWords(selectedWords.filter((w) => w.id !== wordObj.id))
      setAvailableWords([...availableWords, wordObj])
    } else {
      setAvailableWords(availableWords.filter((w) => w.id !== wordObj.id))
      setSelectedWords([...selectedWords, wordObj])
    }
  }

  const handleCheckAnswer = () => {
    if (selectedWords.length === 0) return
    setIsAnswered(true)

    const userString = selectedWords.map(w => w.text).join(' ').toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    const targetString = dataset[currentIndex].correctSentence.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")

    const correct = userString === targetString
    setIsCorrect(correct)

    if (correct) {
      setScore(prev => prev + 100)
    } else {
      playWrongSound()
      const newLives = lives - 1
      setLives(newLives)
      if (newLives <= 0) {
        setTimeout(() => {
          setIsGameOver(true)
          handleEndGame(score)
        }, 1000)
      }
    }
  }

  const handleNextQuestion = () => {
    if (lives <= 0) {
      setIsGameOver(true)
      return
    }

    if (currentIndex < dataset.length - 1) {
      loadRound(dataset, currentIndex + 1)
    } else {
      setIsGameFinished(true)
      handleEndGame(score)
    }
  }

  let nextButtonText = 'Lanjutkan →'
  if (lives <= 0) nextButtonText = 'Akhiri Permainan'
  else if (currentIndex >= dataset.length - 1) nextButtonText = 'Selesai'

  return (
    <main className="w-full min-h-screen bg-white flex flex-col justify-between">
      <div>
        <Navbar />

        {isGameOver && (
          <div className="max-w-3xl mx-auto px-8 py-20 text-center animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-6">
              <X className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-4xl font-extrabold text-red-600 mb-4">Yah, Nyawa Kamu Habis!</h2>
            <p className="text-gray-600 mb-8 text-lg">Jangan menyerah, ayo coba lagi dan pelajari lebih banyak tentang Bawean.</p>
            
            <div className="flex gap-4 justify-center">
              <button onClick={restartGame} className="flex items-center gap-2 bg-[#005C43] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-opacity">
                <RotateCcw className="w-5 h-5" /> Main Ulang
              </button>
              <Link href="/game" className="flex items-center gap-2 bg-gray-200 text-gray-700 px-8 py-3 rounded-full font-bold hover:bg-gray-300 transition-colors">
                Kembali
              </Link>
            </div>
          </div>
        )}

        {isGameFinished && !isGameOver && (
          <div className="max-w-3xl mx-auto px-8 py-20 text-center animate-in zoom-in-95 duration-300">
            <div className="w-28 h-28 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Trophy className="w-14 h-14 text-yellow-600" />
            </div>
            <h2 className="text-4xl font-extrabold text-[#005C43] mb-4">Luar Biasa! 🎉</h2>
            <p className="text-gray-600 mb-6 text-lg">Kamu berhasil menyelesaikan kuis Susun Kata.</p>
            
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 max-w-sm mx-auto shadow-sm">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-1">Skor Akhir</h3>
              <p className="text-5xl font-extrabold text-[#005C43]">{score}</p>
            </div>

            <div className="flex gap-4 justify-center">
              <button onClick={restartGame} className="flex items-center gap-2 bg-white border-2 border-[#005C43] text-[#005C43] px-8 py-3 rounded-full font-bold hover:bg-green-50 transition-colors">
                <RotateCcw className="w-5 h-5" /> Main Lagi
              </button>
              <Link href="/game" className="flex items-center gap-2 bg-[#005C43] text-white px-8 py-3 rounded-full font-bold hover:opacity-90 transition-colors">
                Selesai
              </Link>
            </div>
          </div>
        )}

        {!isGameOver && !isGameFinished && (
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-extrabold text-[#005C43] mb-1">Game 🎮</h1>
                <p className="text-gray-700 text-sm">Bermain sambil belajar, selesaikan semua tantangan seru</p>
              </div>
              <Link href="/game" className="text-2xl p-2 hover:opacity-70 transition-opacity cursor-pointer">
                ❌
              </Link>
            </div>

            <h2 className="text-3xl font-bold text-[#005C43] mb-6">Susun Kata</h2>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-200">
              <div className="flex items-center gap-6">
                <div className="flex gap-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-6 h-6 transition-all ${i < lives ? 'fill-red-500 text-red-500' : 'fill-gray-200 text-gray-200'}`}
                    />
                  ))}
                </div>
                <div className="bg-green-50 px-4 py-1.5 rounded-full border border-green-200 text-[#005C43] font-bold text-sm">
                  Skor: {score}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-400">
                  Soal {currentIndex + 1} / {dataset.length}
                </span>
              </div>
            </div>

            {!isAnswered ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="flex items-center justify-center">
                  <div className="w-full h-64 md:h-80 bg-[#EBF2EE] rounded-[32px] relative overflow-hidden border border-gray-100 shadow-sm flex flex-col items-center justify-center p-8 text-center">
                    <span className="text-sm font-bold text-[#005C43] uppercase tracking-wide mb-4">Susun menjadi kalimat Bawean:</span>
                    <h3 className="text-2xl md:text-3xl font-bold text-gray-800">
                      "{currentRound.indonesianClue}"
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="space-y-4 mb-8">
                    {/* Area Drop / Selected Words */}
                    <div className="w-full min-h-[120px] p-6 rounded-[24px] border-2 border-dashed border-gray-300 bg-gray-50 flex flex-wrap gap-3 items-center justify-center transition-all">
                      {selectedWords.length === 0 ? (
                        <p className="text-gray-400 font-medium">Tarik / Klik kata ke area ini</p>
                      ) : (
                        selectedWords.map((w) => (
                          <button 
                            key={w.id} 
                            onClick={() => handleWordClick(w, true)} 
                            className="bg-[#005C43] text-white px-5 py-2.5 rounded-full font-semibold shadow-sm hover:opacity-90 transition-opacity"
                          >
                            {w.text}
                          </button>
                        ))
                      )}
                    </div>
                    
                    {/* Area Pilihan / Available Words */}
                    <div className="flex flex-wrap gap-3 justify-center p-4">
                      {availableWords.map((w) => (
                        <button 
                          key={w.id} 
                          onClick={() => handleWordClick(w, false)} 
                          className="bg-white border-2 border-gray-200 text-gray-700 px-5 py-2.5 rounded-full font-semibold hover:border-[#005C43] hover:text-[#005C43] transition-colors"
                        >
                          {w.text}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => loadRound(dataset, currentIndex)} 
                      className="p-3.5 border-2 border-gray-300 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
                      title="Ulangi Susunan Kata"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleCheckAnswer}
                      disabled={selectedWords.length === 0}
                      className={`flex-1 w-full md:w-auto px-10 py-3.5 rounded-full font-bold text-white text-base transition-all ${
                        selectedWords.length > 0
                          ? 'bg-[#005C43] hover:opacity-95 cursor-pointer shadow-sm'
                          : 'bg-gray-400 cursor-not-allowed opacity-50'
                      }`}
                    >
                      Cek Jawaban
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="flex flex-col items-center justify-center">
                  {isCorrect ? (
                    <div className="text-center animate-in zoom-in-95 duration-300">
                      <div className="w-24 h-24 mx-auto rounded-full bg-[#005C43] flex items-center justify-center mb-4 shadow-sm">
                        <Check className="w-14 h-14 text-white" />
                      </div>
                      <h3 className="text-4xl font-extrabold text-[#005C43] tracking-wide">BENAR</h3>
                      <p className="text-green-600 font-bold mt-2">+100 Poin</p>
                    </div>
                  ) : (
                    <div className="text-center animate-in zoom-in-95 duration-300">
                      <div className="w-24 h-24 mx-auto rounded-full bg-red-500 flex items-center justify-center mb-4 shadow-sm">
                        <span className="text-4xl text-white font-bold">✕</span>
                      </div>
                      <h3 className="text-4xl font-extrabold text-red-600 tracking-wide">SALAH</h3>
                      <p className="text-red-500 font-bold mt-2">Nyawa Berkurang</p>
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">Jawaban Benar</h4>

                  <div className="bg-green-50 border-l-4 border-[#005C43] rounded-2xl p-6 mb-8 shadow-sm">
                    <p className="text-xl font-bold text-[#005C43] leading-relaxed">
                      {currentRound.correctSentence}
                    </p>
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className={`w-full md:w-auto px-10 py-3.5 rounded-full font-bold text-white text-base transition-opacity ${
                       lives <= 0 ? 'bg-red-500 hover:bg-red-600' : 'bg-[#005C43] hover:opacity-95'
                    }`}
                  >
                    {nextButtonText}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}