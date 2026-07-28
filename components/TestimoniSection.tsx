'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Star, User, Quote } from 'lucide-react'

// Bikin tipe data biar TypeScript nggak protes
type Feedback = {
  id: number
  name: string
  message: string
  topic: string
  rating: number
  created_at: string
}

export default function TestimoniSection() {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        // Hanya ambil data yang is_published-nya true, urutkan dari yang paling baru, maksimal 6 data
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(6) 

        if (error) throw error
        if (data) setFeedbacks(data)
      } catch (error) {
        console.error('Gagal mengambil data testimoni:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFeedbacks()
  }, [])

  // Kalau lagi loading, jangan tampilkan apa-apa dulu
  if (isLoading) return null

  // Kalau belum ada komentar yang di-publish sama sekali, sembunyikan section ini
  if (feedbacks.length === 0) return null 

  return (
    <section className="py-16 bg-[#F9FAFB]">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Kata Mereka Tentang Lentera Abhesa</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Terima kasih atas dukungan dan saran dari teman-teman untuk Lentera Abhesa.
          </p>
        </div>

        {/* List Komentar (Horizontal Scroll / Snap) */}
        <div className="flex overflow-x-auto gap-6 pb-8 snap-x hide-scrollbar">
          {feedbacks.map((fb) => (
            <div 
              key={fb.id} 
              className="min-w-[320px] max-w-[320px] bg-white p-6 rounded-3xl border border-gray-100 shadow-sm snap-center hover:shadow-md transition-shadow relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-gray-100" />
              
              {/* Bintang */}
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < fb.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
                  />
                ))}
              </div>

              {/* Isi Pesan */}
              <p className="text-gray-700 text-sm mb-6 line-clamp-4 relative z-10">
                "{fb.message}"
              </p>

              {/* Footer: Nama & Topik */}
              <div className="flex items-center justify-between mt-auto border-t border-gray-50 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-[#005C43]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{fb.name}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(fb.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Badge Topik */}
              <div className="mt-4">
                <span className="inline-block bg-[#005C43]/10 text-[#005C43] text-[10px] font-bold px-3 py-1.5 rounded-full">
                  {fb.topic}
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </section>
  )
}