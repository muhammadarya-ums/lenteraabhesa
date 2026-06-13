'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ScrambleGameFormat {
  id: number
  indonesianClue: string
  correctSentence: string
  shuffledWords: string[]
}

export default function SusunKataPage() {
  const [dataset, setDataset] = useState<ScrambleGameFormat[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [availableWords, setAvailableWords] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [hasChecked, setHasChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [gameFinished, setGameFinished] = useState(false)
  const [loading, setLoading] = useState(true)
  const [shake, setShake] = useState(false)

  // Audio ref untuk jawaban salah
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Inisialisasi audio (pastikan path file sesuai dengan folder public lo)
    wrongAudioRef.current = new Audio('/sounds/salah.mp3')
    fetchScrambleData()
  }, [])

  const fetchScrambleData = async () => {
    try {
      setLoading(true)
      // Mengambil dari tabel khusus yang dikelola admin
      const { data: soalData, error } = await supabase
        .from('soal_susun_kata')
        .select('*')

      if (error || !soalData || soalData.length === 0) {
        throw new Error('Tidak ada data soal')
      }

      const formatted: ScrambleGameFormat[] = soalData.map((item, idx) => {
        const sentence = item.kalimat_benar!.trim()
        const words = sentence.split(/\s+/).filter((w: string) => w.length > 0)
        const shuffled = [...words].sort(() => 0.5 - Math.random())

        return {
          id: item.id || idx + 1,
          indonesianClue: item.clue_indonesia!,
          correctSentence: sentence,
          shuffledWords: shuffled
        }
      })

      // Acak urutan soal
      const shuffledQuestions = formatted.sort(() => 0.5 - Math.random())
      
      setDataset(shuffledQuestions)
      loadRound(shuffledQuestions, 0)
    } catch (err) {
      console.error('Error fetching data:', err)
      // Fallback
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
      setHasChecked(false)
      setIsCorrect(false)
      setShake(false)
    }
  }

  const handleWordClick = (word: string, fromSelected: boolean) => {
    if (hasChecked) return

    if (fromSelected) {
      setSelectedWords(selectedWords.filter((w) => w !== word))
      setAvailableWords([...availableWords, word])
    } else {
      setAvailableWords(availableWords.filter((w) => w !== word))
      setSelectedWords([...selectedWords, word])
    }
  }

  const playWrongSound = () => {
    if (wrongAudioRef.current) {
      wrongAudioRef.current.currentTime = 0
      wrongAudioRef.current.play().catch(e => console.log('Audio play failed:', e))
    }
  }

  const checkAnswer = () => {
    const userString = selectedWords.join(' ').toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    const targetString = dataset[currentIndex].correctSentence.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")

    const correct = userString === targetString
    setIsCorrect(correct)
    setHasChecked(true)

    if (correct) {
      setScore(score + 20)
    } else {
      playWrongSound()
      setShake(true)
      setTimeout(() => setShake(false), 500) // Hentikan animasi shake
    }
  }

  const handleNextRound = () => {
    if (currentIndex < dataset.length - 1) {
      loadRound(dataset, currentIndex + 1)
    } else {
      handleFinishGame()
    }
  }

  const handleFinishGame = async () => {
    setGameFinished(true)
    try {
      await supabase.from('game_analytics').insert([
        {
          game_name: 'susun_kata',
          session_id: navigator.userAgent,
          score: score
        }
      ])
    } catch (err) {
      console.error(err)
    }
  }

  const resetGame = () => {
    setScore(0)
    setGameFinished(false)
    fetchScrambleData()
  }

  if (loading || dataset.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#005C43]"></div>
        <p className="text-gray-500 mt-4 font-medium">{loading ? 'Menyusun balok kata...' : 'Soal belum tersedia di database.'}</p>
      </div>
    )
  }

  const currentRound = dataset[currentIndex]

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          50% { transform: translateX(8px); }
          75% { transform: translateX(-8px); }
        }
        .animate-shake { animation: shake 0.4s ease-in-out; }
      `}} />

      <div className="max-w-3xl mx-auto">
        {/* Navigation Head */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-[20px] border-b-4 border-gray-200 shadow-sm">
          <Link href="/game" className="flex items-center text-gray-500 hover:text-[#005C43] font-bold transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Keluar
          </Link>
          <div className="bg-[#005C43] px-6 py-2 rounded-xl text-white font-black shadow-inner shadow-black/20">
            Skor: {score}
          </div>
        </div>

        {!gameFinished ? (
          <div className={`flex flex-col gap-6 transition-transform ${shake ? 'animate-shake' : ''}`}>
            {/* Clue Panel */}
            <div className="bg-white rounded-[24px] border-b-4 border-gray-200 p-6 md:p-8 shadow-sm">
              <span className="text-xs font-black text-[#005C43] bg-emerald-50 px-4 py-1.5 rounded-lg tracking-wider uppercase border border-emerald-100">
                Susun Kalimat {currentIndex + 1} / {dataset.length}
              </span>
              <p className="text-xl md:text-2xl font-black text-gray-800 mt-6 leading-snug">
                "{currentRound?.indonesianClue}"
              </p>
            </div>

            {/* Workplace Panel */}
            <div className="rounded-[24px] border-4 border-dashed border-gray-200 p-8 min-h-[140px] flex flex-wrap gap-3 items-center justify-center bg-gray-50">
              {selectedWords.length === 0 ? (
                <p className="text-gray-400 text-sm font-bold">Susun blok kata di area ini</p>
              ) : (
                selectedWords.map((word, idx) => (
                  <button
                    key={idx}
                    disabled={hasChecked}
                    onClick={() => handleWordClick(word, true)}
                    className="bg-[#005C43] text-white font-black px-5 py-3 rounded-xl shadow-[0_4px_0_#004733] hover:translate-y-1 hover:shadow-none transition-all text-base"
                  >
                    {word}
                  </button>
                ))
              )}
            </div>

            {/* Word Bank Panel */}
            <div className="bg-white rounded-[24px] border-b-4 border-gray-200 p-6 md:p-8 shadow-sm">
              <div className="flex flex-wrap gap-3 justify-center">
                {availableWords.map((word, idx) => (
                  <button
                    key={idx}
                    disabled={hasChecked}
                    onClick={() => handleWordClick(word, false)}
                    className="bg-white border-2 border-gray-200 text-gray-700 font-bold px-5 py-3 rounded-xl shadow-[0_4px_0_#e5e7eb] hover:translate-y-1 hover:shadow-none hover:border-[#005C43] hover:text-[#005C43] transition-all text-base"
                  >
                    {word}
                  </button>
                ))}
              </div>

              {/* Action buttons */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => loadRound(dataset, currentIndex)}
                  disabled={hasChecked || selectedWords.length === 0}
                  className="px-6 py-4 border-2 border-gray-200 text-gray-500 font-black rounded-2xl hover:bg-gray-50 transition-colors disabled:opacity-40"
                >
                  <RefreshCw className="w-5 h-5 mx-auto" />
                </button>
                
                {!hasChecked ? (
                  <button
                    onClick={checkAnswer}
                    disabled={selectedWords.length === 0}
                    className="flex-1 bg-[#005C43] text-white font-black text-lg py-4 rounded-2xl shadow-[0_4px_0_#004733] hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cek Jawaban
                  </button>
                ) : (
                  <button
                    onClick={handleNextRound}
                    className="flex-1 bg-[#005C43] text-white font-black text-lg py-4 rounded-2xl shadow-[0_4px_0_#004733] hover:translate-y-1 hover:shadow-none transition-all"
                  >
                    {currentIndex < dataset.length - 1 ? 'Lanjut ke Soal Berikutnya →' : 'Selesai'}
                  </button>
                )}
              </div>
            </div>

            {/* Answer Feedback Banner */}
            {hasChecked && (
              <div className={`p-6 rounded-[24px] border-b-4 flex items-start gap-4 animate-in slide-in-from-bottom-4 ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                {isCorrect ? <CheckCircle2 className="w-8 h-8 text-green-500 shrink-0" /> : <AlertCircle className="w-8 h-8 text-red-500 shrink-0" />}
                <div>
                  <h4 className="font-black text-xl">{isCorrect ? 'Sempurna!' : 'Salah, jangan menyerah!'}</h4>
                  {!isCorrect && (
                    <p className="text-sm mt-2 opacity-90 font-medium bg-white/50 p-3 rounded-xl border border-red-100">
                      <span className="font-bold">Jawaban Benar:</span> "{currentRound.correctSentence}"
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Scoring End Phase Screen */
          <div className="bg-white rounded-[32px] border-b-8 border-gray-200 p-8 md:p-12 shadow-lg text-center max-w-xl mx-auto animate-in zoom-in">
            <h1 className="text-4xl font-black text-[#005C43] mb-4">Sesi Selesai!</h1>
            <p className="text-gray-500 font-medium mb-8">Kamu telah berhasil menyusun seluruh tata bahasa dengan baik.</p>
            
            <div className="bg-emerald-50 rounded-[24px] p-8 border-4 border-emerald-100 mb-8">
              <p className="text-sm font-black text-[#005C43] uppercase tracking-wider">Total Poin Kamu</p>
              <p className="text-6xl font-black text-[#005C43] mt-2 drop-shadow-sm">{score}</p>
            </div>

            <button
              onClick={resetGame}
              className="w-full bg-[#005C43] text-white font-black text-lg py-5 rounded-2xl shadow-[0_6px_0_#004733] hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-3"
            >
              <RefreshCw className="w-6 h-6" /> Mainkan Ulang Game
            </button>
          </div>
        )}
      </div>
    </div>
  )
}