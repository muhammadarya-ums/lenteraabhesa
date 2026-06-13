'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Heart, Lightbulb, Check, X, ArrowLeft, RefreshCw } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface QuestionFormat {
  id: number
  wordAlos: string
  correctAnswer: string
  options: string[]
  sentenceClue: string
  indonesianMeaning: string
}

export default function TebakKataPage() {
  const [questions, setQuestions] = useState<QuestionFormat[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [lives, setLives] = useState(3)
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [shake, setShake] = useState(false)

  // Audio ref
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Inisialisasi audio dari folder public
    wrongAudioRef.current = new Audio('/sounds/salah.mp3')
    fetchGameData()
  }, [])

  const fetchGameData = async () => {
    try {
      setLoading(true)
      // Ambil data dari tabel khusus admin: soal_tebak_kata
      const { data: soalData, error } = await supabase
        .from('soal_tebak_kata')
        .select('*')

      if (error || !soalData || soalData.length === 0) {
        throw new Error('Tidak ada data soal dari admin')
      }

      const formatted: QuestionFormat[] = soalData.map((item, idx) => {
        // Ambil opsi dari kolom-kolom tabel database (Pastikan admin mengisi pengecoh)
        const allOptions = [
          item.jawaban_benar,
          item.pengecoh_1,
          item.pengecoh_2,
          item.pengecoh_3
        ].filter(Boolean) // Filter jika ada yang kosong

        const shuffledOptions = allOptions.sort(() => 0.5 - Math.random())

        return {
          id: item.id || idx + 1,
          wordAlos: item.kata_soal,
          correctAnswer: item.jawaban_benar,
          options: shuffledOptions,
          sentenceClue: item.clue_kalimat || 'Tidak ada petunjuk.',
          indonesianMeaning: item.arti_clue || 'Tidak ada petunjuk terjemahan.'
        }
      })

      // Acak urutan pertanyaan
      const shuffledQuestions = formatted.sort(() => 0.5 - Math.random())
      setQuestions(shuffledQuestions)
    } catch (err) {
      console.error(err)
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  const playWrongSound = () => {
    if (wrongAudioRef.current) {
      wrongAudioRef.current.currentTime = 0
      wrongAudioRef.current.play().catch(e => console.log('Audio play failed:', e))
    }
  }

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return 

    setSelectedAnswer(answer)
    const check = answer === questions[currentIndex].correctAnswer
    setIsCorrect(check)

    if (check) {
      setScore(score + 10)
    } else {
      playWrongSound()
      setShake(true)
      setTimeout(() => setShake(false), 500)
      
      setLives(lives - 1)
      if (lives - 1 <= 0) {
        // Timer delay sedikit agar user bisa melihat feedback merah sebelum End Game
        setTimeout(() => handleEndGame(score), 1500)
        return
      }
    }
  }

  const handleNext = () => {
    setSelectedAnswer(null)
    setIsCorrect(null)
    setShowHint(false)

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      handleEndGame(score + (isCorrect ? 10 : 0))
    }
  }

  const handleEndGame = async (finalScore: number) => {
    setGameFinished(true)
    try {
      await supabase.from('game_analytics').insert([
        {
          game_name: 'tebak_kata',
          session_id: navigator.userAgent,
          score: finalScore
        }
      ])
    } catch (err) {
      console.error('Gagal mencatat analitik game:', err)
    }
  }

  const handleReset = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setLives(3)
    setScore(0)
    setShowHint(false)
    setGameFinished(false)
    fetchGameData()
  }

  if (loading || questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#005C43]"></div>
        <p className="text-gray-500 mt-4 font-medium">{loading ? 'Memuat kuis...' : 'Soal Tebak Kata belum tersedia.'}</p>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px); }
          50% { transform: translateX(6px); }
          75% { transform: translateX(-6px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}} />

      <div className="max-w-4xl mx-auto">
        {/* Top Navigation & Stats Container */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-[20px] border-b-4 border-gray-200 shadow-sm">
          <Link href="/game" className="flex items-center text-gray-500 hover:text-[#005C43] font-bold transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Keluar
          </Link>
          <div className="flex items-center gap-4 md:gap-6">
            <div className="flex items-center gap-1 bg-red-50 px-3 py-2 rounded-xl border border-red-100">
              {[...Array(3)].map((_, i) => (
                <Heart key={i} className={`w-5 h-5 ${i < lives ? 'text-red-500 fill-red-500' : 'text-red-200 fill-red-100'}`} />
              ))}
            </div>
            <div className="bg-[#005C43] px-5 py-2 rounded-xl text-white font-black shadow-inner shadow-black/20">
              Skor: {score}
            </div>
          </div>
        </div>

        {!gameFinished ? (
          <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-transform ${shake ? 'animate-shake' : ''}`}>
            {/* Left Panel: Question */}
            <div className="lg:col-span-2 bg-white rounded-[24px] border-b-4 border-gray-200 p-6 md:p-8 shadow-sm flex flex-col justify-between min-h-[420px]">
              <div>
                <span className="text-xs font-black text-[#005C43] bg-emerald-50 px-4 py-1.5 rounded-lg border border-emerald-100 uppercase tracking-wider">
                  Soal {currentIndex + 1} / {questions.length}
                </span>
                <h2 className="text-lg md:text-xl font-bold text-gray-400 mt-8">Pilih arti dari kata Bawean berikut:</h2>
                <h1 className="text-5xl md:text-6xl font-black text-gray-900 mt-2 tracking-tight">
                  "{currentQuestion?.wordAlos}"
                </h1>
              </div>

              {/* Grid Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
                {currentQuestion?.options.map((option, index) => {
                  const chr = String.fromCharCode(65 + index)
                  let btnStyle = 'border-gray-200 bg-white text-gray-700 shadow-[0_4px_0_#e5e7eb] hover:translate-y-1 hover:shadow-none hover:border-[#005C43]'
                  
                  if (selectedAnswer) {
                    if (option === currentQuestion.correctAnswer) {
                      btnStyle = 'border-green-500 bg-green-50 text-green-700 shadow-none translate-y-1'
                    } else if (selectedAnswer === option && !isCorrect) {
                      btnStyle = 'border-red-500 bg-red-50 text-red-700 shadow-none translate-y-1'
                    } else {
                      btnStyle = 'opacity-40 border-gray-200 bg-gray-50 shadow-none'
                    }
                  }

                  return (
                    <button
                      key={index}
                      disabled={!!selectedAnswer}
                      onClick={() => handleAnswer(option)}
                      className={`w-full p-4 text-left border-2 rounded-2xl font-black text-base md:text-lg transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black ${selectedAnswer ? 'bg-transparent' : 'bg-gray-100'}`}>
                          {chr}
                        </span>
                        <span>{option}</span>
                      </div>
                      {selectedAnswer && option === currentQuestion.correctAnswer && <Check className="w-6 h-6 text-green-600" />}
                      {selectedAnswer === option && !isCorrect && <X className="w-6 h-6 text-red-600" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right Panel: Hints and Next Action */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-[24px] border-b-4 border-gray-200 p-6 shadow-sm flex flex-col">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="w-full flex items-center justify-center gap-2 p-4 bg-amber-50 rounded-2xl border-2 border-amber-200 text-amber-600 font-black shadow-[0_4px_0_#fde68a] hover:translate-y-1 hover:shadow-none transition-all"
                >
                  <Lightbulb className="w-5 h-5 fill-amber-500 text-amber-500" />
                  Lihat Clue Kalimat
                </button>

                {showHint && (
                  <div className="mt-6 p-5 bg-gray-50 rounded-2xl border border-gray-200 animate-in fade-in">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Petunjuk Konteks:</p>
                    <p className="text-base font-black text-gray-800 leading-snug">"{currentQuestion?.sentenceClue}"</p>
                  </div>
                )}

                {selectedAnswer && lives > 0 && (
                  <div className="mt-auto pt-6 border-t border-gray-100 animate-in slide-in-from-bottom-4">
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 text-sm text-gray-600 mb-6 font-medium">
                      <span className="font-bold text-[#005C43] block mb-1">Arti Clue:</span>
                      {currentQuestion?.indonesianMeaning}
                    </div>
                    <button
                      onClick={handleNext}
                      className="w-full bg-[#005C43] text-white font-black text-lg py-4 rounded-2xl shadow-[0_4px_0_#004733] hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      {currentIndex < questions.length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil Akhir'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Game Over / Final Score Screen */
          <div className="bg-white rounded-[32px] border-b-8 border-gray-200 p-8 md:p-12 shadow-lg text-center max-w-xl mx-auto animate-in zoom-in">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              {lives > 0 ? <Check className="w-10 h-10" /> : <X className="w-10 h-10 text-red-500" />}
            </div>
            
            <h1 className="text-4xl font-black text-gray-900 mb-2">
              {lives > 0 ? 'Luar Biasa!' : 'Game Over'}
            </h1>
            <p className="text-gray-500 font-medium mb-8">
              {lives > 0 ? 'Kamu menguasai banyak kosakata baru hari ini.' : 'Nyawa habis, tapi jangan menyerah!'}
            </p>
            
            <div className="bg-gray-50 rounded-[24px] p-6 border-2 border-gray-100 mb-8 grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                <p className="text-xs text-gray-400 font-bold uppercase">Skor Akhir</p>
                <p className="text-4xl font-black text-[#005C43] mt-1">{score}</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-50">
                <p className="text-xs text-gray-400 font-bold uppercase">Sisa Nyawa</p>
                <p className="text-4xl font-black text-red-500 mt-1">{lives > 0 ? `${lives} ❤️` : 'Habis'}</p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full bg-[#005C43] text-white font-black text-lg py-5 rounded-2xl shadow-[0_6px_0_#004733] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3"
            >
              <RefreshCw className="w-6 h-6" /> Main Lagi Yuk
            </button>
          </div>
        )}
      </div>
    </div>
  )
}