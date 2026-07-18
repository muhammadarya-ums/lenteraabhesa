'use client'

import { useState, useEffect } from 'react'
import { CheckCircle2, X } from 'lucide-react'
import { supabase } from '@/lib/supabase' // Pastikan import supabase

interface Feedback {
  id: number
  name: string
  topic: string
  rating: number
}

interface FloatingKomentarProps {
  feedbacks: Feedback[] // Ini data awal (initial data) pas web pertama di-load
}

export default function FloatingKomentar({ feedbacks }: FloatingKomentarProps) {
  const [liveFeedbacks, setLiveFeedbacks] = useState<Feedback[]>(feedbacks)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  // 1. Efek untuk ganti komentar tiap 5 detik
  useEffect(() => {
    if (!liveFeedbacks || liveFeedbacks.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % liveFeedbacks.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [liveFeedbacks])

  // 2. Efek untuk nangkep komentar BARU secara Realtime dari Supabase
  useEffect(() => {
    const channel = supabase
      .channel('realtime-feedback')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'feedback' },
        (payload) => {
          const newFeedback = payload.new as Feedback
          
          // Masukin komentar baru ke array paling depan, dan potong max 5 data aja
          setLiveFeedbacks((prev) => [newFeedback, ...prev].slice(0, 5))
          
          // Reset index biar langsung nampilin komentar yang paling baru
          setCurrentIndex(0)
          
          // Kalau pop-up sempet di-close sama user, munculin lagi!
          setIsVisible(true) 
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  if (!liveFeedbacks || liveFeedbacks.length === 0 || !isVisible) return null

  const currentData = liveFeedbacks[currentIndex]

  return (
    <div className="fixed bottom-6 left-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="relative bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 flex items-center gap-4 px-6 py-3 min-w-[320px] max-w-[400px]">
        
        <div className="absolute top-0 left-6 right-16 h-[2px] bg-teal-600 rounded-t-full"></div>

        <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
        
        <p className="text-sm text-gray-700 flex-1 leading-snug">
          <span className="font-bold text-gray-900">{currentData.name}</span> baru saja memberi {currentData.rating} bintang untuk topik <span className="font-semibold text-teal-700">{currentData.topic}</span>
        </p>

        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full shadow-sm border border-gray-100">
          {liveFeedbacks.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-3 bg-teal-600' : 'w-1.5 bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}