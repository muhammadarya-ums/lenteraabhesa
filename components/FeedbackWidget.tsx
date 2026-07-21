'use client'

import React, { useState } from 'react'
import { usePathname } from 'next/navigation' // <-- TAMBAHAN 1: Import usePathname
import { MessageSquarePlus, X, Send, CheckCircle2, Loader2, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function FeedbackWidget() {
  const pathname = usePathname() // <-- TAMBAHAN 2: Inisialisasi pathname
  
  const [isOpen, setIsOpen] = useState(false)
  const [topic, setTopic] = useState('')
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // <-- TAMBAHAN 3: Logika untuk menyembunyikan widget
  // PENTING: Pastikan '/tanya-lentera' sesuai dengan nama folder halaman AI lo.
  // Kalau URL halamannya '/ai', ganti jadi pathname === '/ai'
  if (pathname === '/tanya-lentera') {
    return null
  }

  const topics = [
    { id: 'saran', label: '💡 Ide/Saran' },
    { id: 'kosakata', label: '📚 Tambah Kata' },
    { id: 'bug', label: '🐛 Lapor Bug' },
    { id: 'pujian', label: '✨ Lainnya' },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Kirim data lengkap ke Supabase
      const { error } = await supabase
        .from('feedback')
        .insert([{ 
          topic, 
          message, 
          name: name || 'Anonim', 
          rating 
        }])

      if (error) throw error

      setIsSubmitted(true)
      setTimeout(() => {
        setIsOpen(false)
        setIsSubmitted(false)
        setMessage('')
        setTopic('')
        setName('')
        setRating(0)
      }, 3000)

    } catch (error) {
      console.error("Gagal mengirim feedback:", error)
      alert("Waduh, gagal ngirim pesan nih. Coba lagi ya!")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#005C43] text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:scale-95 group"
        title="Kirim Saran"
      >
        <MessageSquarePlus className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4 sm:p-0 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:w-[400px] max-h-[90vh] overflow-y-auto rounded-3xl p-6 relative shadow-2xl animate-in slide-in-from-bottom-8 sm:slide-in-from-bottom-4 hide-scrollbar">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 p-2 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {isSubmitted ? (
              <div className="text-center py-10 flex flex-col items-center gap-4 animate-in zoom-in duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Mantap, Terima Kasih! 🎉</h3>
                <p className="text-gray-500 text-sm">Saran kamu udah kita tampung buat ngembangin Lentera Abhesa jadi lebih baik.</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Ada Masukan? 🤔</h3>
                  <p className="text-sm text-gray-500">Bantu kita jadi lebih baik dengan saran dan penilaianmu.</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  
                  {/* Rating Bintang */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Gimana pengalamanmu?</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="p-1 transition-all focus:outline-none hover:scale-110"
                        >
                          <Star 
                            className={`w-7 h-7 ${
                              (hoveredRating || rating) >= star 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300'
                            } transition-colors`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pilihan Topik */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Topik apa nih?</label>
                    <div className="flex flex-wrap gap-2">
                      {topics.map(t => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => setTopic(t.label)}
                          className={`px-3 py-1.5 text-sm font-medium rounded-full border transition-all ${
                            topic === t.label 
                            ? 'bg-[#005C43] text-white border-[#005C43] shadow-md shadow-[#005C43]/20' 
                            : 'bg-white text-gray-600 border-gray-200 hover:border-[#005C43] hover:text-[#005C43]'
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Input Nama */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Nama (Opsional)</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Boleh diisi, boleh nggak..."
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#005C43]/20 focus:border-[#005C43] transition-all placeholder:text-gray-400"
                    />
                  </div>

                  {/* Textarea Pesan */}
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-gray-700">Pesan</label>
                    <textarea
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder={topic === '📚 Tambah Kata' ? "Misal: Kata 'Songot' bahasa kasarnya belum ada min..." : "Tulis pesan atau saran kamu di sini..."}
                      className="w-full h-24 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#005C43]/20 focus:border-[#005C43] resize-none transition-all placeholder:text-gray-400"
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    disabled={!topic || !message.trim() || rating === 0 || isLoading}
                    className="w-full mt-2 bg-[#005C43] text-white py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Kirim Pesan <Send className="w-4 h-4" /></>}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </>
  )
}