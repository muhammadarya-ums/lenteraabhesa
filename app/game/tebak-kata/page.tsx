'use client'

import React, { useState, useEffect } from 'react'
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

  // Fallback data jika database kosong saat testing awal
  const fallbackData: QuestionFormat[] = [
    {
      id: 1,
      wordAlos: 'Eson',
      correctAnswer: 'Saya',
      options: ['Saya', 'Kamu', 'Dia', 'Mereka'],
      sentenceClue: 'Eson terro ka Bawean.',
      indonesianMeaning: 'Saya ingin ke Bawean.'
    },
    {
      id: 2,
      wordAlos: 'Kaula',
      correctAnswer: 'Saya (Halus)',
      options: ['Kamu', 'Dia', 'Saya (Halus)', 'Kita'],
      sentenceClue: 'Kaula badhi rabhu dhemma.',
      indonesianMeaning: 'Saya akan datang besok.'
    }
  ]

  useEffect(() => {
    fetchGameData()
  }, [])

  const fetchGameData = async () => {
    try {
      setLoading(true)
      // Ambil 10 data acak dari tabel kamus yang memiliki data valid
      const { data: kamusData, error } = await supabase
        .from('kamus')
        .select('*')
        .not('kata_alos', 'is', null)
        .not('arti_indonesia', 'is', null)
        .limit(15)

      if (error || !kamusData || kamusData.length < 4) {
        setQuestions(fallbackData)
        setLoading(false)
        return
      }

      // Generate susunan soal pilihan ganda dinamis
      const formatted: QuestionFormat[] = kamusData.map((item, idx) => {
        const correct = item.arti_indonesia
        // Ambil pengecoh dari baris data lain
        const distractors = kamusData
          .filter((k) => k.id !== item.id)
          .map((k) => k.arti_indonesia)
          .sort(() => 0.5 - Math.random())
          .slice(0, 3)

        const options = [correct, ...distractors].sort(() => 0.5 - Math.random())

        return {
          id: idx + 1,
          wordAlos: item.kata_alos,
          correctAnswer: correct,
          options: options,
          sentenceClue: item.contoh_kalimat || 'Tidak ada contoh kalimat.',
          indonesianMeaning: item.arti_contoh || 'Tidak ada arti contoh.'
        }
      })

      setQuestions(formatted)
    } catch (err) {
      console.error(err)
      setQuestions(fallbackData)
    } finally {
      setLoading(false)
    }
  }

  const handleAnswer = (answer: string) => {
    if (selectedAnswer) return // Mencegah klik ganda

    setSelectedAnswer(answer)
    const check = answer === questions[currentIndex].correctAnswer
    setIsCorrect(check)

    if (check) {
      setScore(score + 10)
    } else {
      setLives(lives - 1)
      if (lives - 1 <= 0) {
        handleEndGame(score)
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
    // TRACKING ANALITIK: Catat aktivitas ke database secara otomatis
    try {
      await supabase.from('game_analytics').insert([
        {
          game_name: 'tebak_kata',
          session_id: navigator.userAgent, // Identifikasi unik device player
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#005C43]"></div>
        <p className="text-gray-500 mt-4 font-medium">Menyiapkan tantangan kata...</p>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Top Navigation & Stats Container */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <Link href="/game" className="flex items-center text-gray-600 hover:text-[#005C43] font-semibold transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Kembali
          </Link>
          <div className="flex items-center gap-6">
            <div className="flex items-center bg-red-50 px-3 py-1.5 rounded-full">
              {[...Array(3)].map((_, i) => (
                <Heart key={i} className={`w-5 h-5 ${i < lives ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} />
              ))}
            </div>
            <div className="bg-green-50 px-4 py-1.5 rounded-full text-[#005C43] font-bold">
              Skor: {score}
            </div>
          </div>
        </div>

        {!gameFinished ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel: The Question block */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-xs flex flex-col justify-between min-h-[420px]">
              <div>
                <span className="text-xs font-bold text-[#005C43] bg-emerald-50 px-3 py-1 rounded-full tracking-wider uppercase">
                  Soal {currentIndex + 1} dari {questions.length}
                </span>
                <h2 className="text-xl md:text-2xl font-medium text-gray-500 mt-6">Apa arti dari kata halus berikut?</h2>
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#005C43] mt-2 tracking-tight">
                  "{currentQuestion?.wordAlos}"
                </h1>
              </div>

              {/* Grid Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {currentQuestion?.options.map((option, index) => {
                  const chr = String.fromCharCode(65 + index)
                  let btnStyle = 'border-gray-200 hover:border-[#005C43] hover:bg-emerald-50/30'
                  
                  if (selectedAnswer) {
                    if (option === currentQuestion.correctAnswer) {
                      btnStyle = 'border-green-500 bg-green-50 text-green-700 shadow-xs'
                    } else if (selectedAnswer === option && !isCorrect) {
                      btnStyle = 'border-red-500 bg-red-50 text-red-700 shadow-xs'
                    } else {
                      btnStyle = 'opacity-50 border-gray-200 bg-gray-50'
                    }
                  }

                  return (
                    <button
                      key={index}
                      disabled={!!selectedAnswer}
                      onClick={() => handleAnswer(option)}
                      className={`w-full p-4 text-left border-2 rounded-2xl font-bold text-base transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-700">
                          {chr}
                        </span>
                        <span>{option}</span>
                      </div>
                      {selectedAnswer && option === currentQuestion.correctAnswer && <Check className="w-5 h-5 text-green-600" />}
                      {selectedAnswer === option && !isCorrect && <X className="w-5 h-5 text-red-600" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right Panel: Hints and Actions */}
            <div className="flex flex-col gap-6">
              <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-xs flex-1">
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="w-full flex items-center justify-between p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 font-bold hover:bg-amber-100/70 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 fill-amber-500 text-amber-600" />
                    <span>Butuh Petunjuk Kalimat?</span>
                  </div>
                </button>

                {showHint && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 animate-in fade-in duration-300">
                    <p className="text-sm font-semibold text-gray-500">Contoh Penggunaan:</p>
                    <p className="text-base font-bold text-gray-800 mt-1 italic">"{currentQuestion?.sentenceClue}"</p>
                  </div>
                )}

                {selectedAnswer && (
                  <div className="mt-6 border-t border-gray-100 pt-6 animate-in slide-in-from-bottom-4">
                    <div className={`p-4 rounded-2xl text-center font-extrabold text-xl tracking-wide mb-6 ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {isCorrect ? '🎉 JAWABAN BENAR!' : '❌ JAWABAN SALAH'}
                    </div>
                    <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 text-sm text-gray-700 mb-6 leading-relaxed">
                      <span className="font-bold text-[#005C43]">Arti Konteks Kalimat: </span>
                      {currentQuestion?.indonesianMeaning}
                    </div>
                    <button
                      onClick={handleNext}
                      className="w-full bg-[#005C43] hover:opacity-90 text-white font-extrabold py-4 rounded-full transition-opacity shadow-sm"
                    >
                      {currentIndex < questions.length - 1 ? 'Lanjutkan Pertanyaan →' : 'Selesaikan Permainan'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Scoring/Game End Component screen */
          <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm text-center max-w-xl mx-auto animate-in scale-in">
            <h1 className="text-4xl font-black text-[#005C43] mb-2">Permainan Selesai!</h1>
            <p className="text-gray-500 text-base mb-8">Kerja bagus, kamu telah berusaha melestarikan bahasa Abhesa Halus Bawean.</p>
            
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 font-medium">Skor Akhir</p>
                <p className="text-4xl font-black text-[#005C43] mt-1">{score}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">Status Nyawa</p>
                <p className="text-4xl font-black text-red-500 mt-1">{lives > 0 ? `${lives} ❤️` : '0 💀'}</p>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full bg-[#005C43] hover:opacity-90 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-opacity"
            >
              <RefreshCw className="w-5 h-5" /> Main Lagi Yuk
            </button>
          </div>
        )}
      </div>
    </div>
  )
}