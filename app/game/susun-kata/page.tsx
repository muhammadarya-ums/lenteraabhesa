'use client'

import React, { useState, useEffect } from 'react'
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

  const fallbackDataset: ScrambleGameFormat[] = [
    {
      id: 1,
      indonesianClue: 'Saya mau makan nasi goreng mas',
      correctSentence: 'Eson terro ngakan nase goreng kak',
      shuffledWords: ['ngakan', 'kak', 'Eson', 'nase', 'terro', 'goreng']
    }
  ]

  useEffect(() => {
    fetchScrambleData()
  }, [])

  const fetchScrambleData = async () => {
    try {
      setLoading(true)
      const { data: kamusData, error } = await supabase
        .from('kamus')
        .select('*')
        .not('contoh_kalimat', 'is', null)
        .not('arti_contoh', 'is', null)
        .limit(10)

      if (error || !kamusData || kamusData.length === 0) {
        loadRound(fallbackDataset, 0)
        return
      }

      const formatted: ScrambleGameFormat[] = kamusData.map((item, idx) => {
        const sentence = item.contoh_kalimat!.trim()
        const words = sentence.split(/\s+/).filter((w: string) => w.length > 0)
        const shuffled = [...words].sort(() => 0.5 - Math.random())

        return {
          id: idx + 1,
          indonesianClue: item.arti_contoh!,
          correctSentence: sentence,
          shuffledWords: shuffled
        }
      })

      setDataset(formatted)
      loadRound(formatted, 0)
    } catch (err) {
      console.error(err)
      loadRound(fallbackDataset, 0)
    } finally {
      setLoading(false)
    }
  }

  const loadRound = (data: ScrambleGameFormat[], index: number) => {
    if (data.length > 0 && index < data.length) {
      setDataset(data)
      setCurrentIndex(index)
      setAvailableWords([...data[index].shuffledWords])
      setSelectedWords([])
      setHasChecked(false)
      setIsCorrect(false)
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

  const checkAnswer = () => {
    const userString = selectedWords.join(' ').toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
    const targetString = dataset[currentIndex].correctSentence.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")

    const correct = userString === targetString
    setIsCorrect(correct)
    setHasChecked(true)

    if (correct) {
      setScore(score + 20)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#005C43]"></div>
        <p className="text-gray-500 mt-4 font-medium">Menyusun balok-balok kata...</p>
      </div>
    )
  }

  const currentRound = dataset[currentIndex]

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        {/* Navigation Head */}
        <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
          <Link href="/game" className="flex items-center text-gray-600 hover:text-[#005C43] font-semibold transition-colors">
            <ArrowLeft className="w-5 h-5 mr-2" /> Kembali
          </Link>
          <div className="bg-green-50 px-5 py-1.5 rounded-full text-[#005C43] font-black">
            Skor Kuis: {score}
          </div>
        </div>

        {!gameFinished ? (
          <div className="flex flex-col gap-6">
            {/* Clue/Indonesian Mean Panel */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-xs">
              <span className="text-xs font-bold text-[#005C43] bg-emerald-50 px-3 py-1 rounded-full tracking-wider uppercase">
                Tantangan Susun Kalimat {currentIndex + 1} / {dataset.length}
              </span>
              <h3 className="text-sm font-semibold text-gray-400 mt-6 uppercase tracking-wider">Arti Kalimat (Petunjuk):</h3>
              <p className="text-xl md:text-2xl font-extrabold text-gray-800 mt-1">
                "{currentRound?.indonesianClue}"
              </p>
            </div>

            {/* Workplace: Where clicked words go */}
            <div className="rounded-3xl border-2 border-dashed border-gray-200 p-6 min-h-30 flex flex-wrap gap-3 items-center justify-center bg-gray-50/50">
              {selectedWords.length === 0 ? (
                <p className="text-gray-400 text-sm font-medium italic">Klik kata-kata di bawah untuk mulai menyusun susunan kalimat padu</p>
              ) : (
                selectedWords.map((word, idx) => (
                  <button
                    key={idx}
                    disabled={hasChecked}
                    onClick={() => handleWordClick(word, true)}
                    className="bg-[#005C43] text-white font-bold px-4 py-2.5 rounded-xl shadow-xs hover:bg-red-600 hover:scale-95 transition-all text-base"
                  >
                    {word}
                  </button>
                ))
              )}
            </div>

            {/* Word Bank Area */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-xs">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 text-center">Pilihan Blok Kata:</h4>
              <div className="flex flex-wrap gap-3 justify-center">
                {availableWords.map((word, idx) => (
                  <button
                    key={idx}
                    disabled={hasChecked}
                    onClick={() => handleWordClick(word, false)}
                    className="bg-white border-2 border-gray-200 text-gray-800 font-bold px-4 py-2.5 rounded-xl hover:border-[#005C43] hover:text-[#005C43] transition-all text-base shadow-2xs"
                  >
                    {word}
                  </button>
                ))}
              </div>

              {/* Action buttons inside block */}
              <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
                <button
                  onClick={() => loadRound(dataset, currentIndex)}
                  disabled={hasChecked || selectedWords.length === 0}
                  className="px-6 py-3.5 border-2 border-gray-200 text-gray-600 font-bold rounded-full hover:bg-gray-50 transition-colors disabled:opacity-40"
                >
                  Ulangi
                </button>
                
                {!hasChecked ? (
                  <button
                    onClick={checkAnswer}
                    disabled={selectedWords.length === 0}
                    className="flex-1 bg-[#005C43] text-white font-extrabold py-3.5 rounded-full hover:opacity-90 transition-opacity shadow-xs disabled:opacity-50"
                  >
                    Periksa Jawaban
                  </button>
                ) : (
                  <button
                    onClick={handleNextRound}
                    className="flex-1 bg-[#005C43] text-white font-extrabold py-3.5 rounded-full hover:opacity-90 transition-opacity shadow-xs"
                  >
                    {currentIndex < dataset.length - 1 ? 'Lanjutkan Kalimat Selanjutnya →' : 'Selesaikan Permainan'}
                  </button>
                )}
              </div>
            </div>

            {/* Status Answer Feedback Banner */}
            {hasChecked && (
              <div className={`p-6 rounded-3xl flex items-start gap-4 border animate-in slide-in-from-top-4 ${isCorrect ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                {isCorrect ? <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" /> : <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />}
                <div>
                  <h4 className="font-extrabold text-lg">{isCorrect ? 'Luar Biasa, Kalimat Sempurna!' : 'Yah, Masih Kurang Tepat'}</h4>
                  <p className="text-sm mt-1 opacity-90 font-medium">
                    <span className="font-bold">Kalimat yang Benar:</span> "{currentRound.correctSentence}"
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Scoring End Phase Screen */
          <div className="bg-white rounded-3xl border border-gray-100 p-8 md:p-12 shadow-sm text-center max-w-xl mx-auto animate-in scale-in">
            <h1 className="text-4xl font-black text-[#005C43] mb-2">Sesi Selesai!</h1>
            <p className="text-gray-500 text-sm mb-6">Kamu telah berhasil menyusun seluruh rangkaian tata bahasa halus Bawean dengan baik.</p>
            
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Skor Akumulatif</p>
              <p className="text-5xl font-black text-[#005C43] mt-2">{score} Pts</p>
            </div>

            <button
              onClick={resetGame}
              className="w-full bg-[#005C43] hover:opacity-90 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-opacity shadow-xs"
            >
              <RefreshCw className="w-5 h-5" /> Mainkan Sekali Lagi
            </button>
          </div>
        )}
      </div>
    </div>
  )
}