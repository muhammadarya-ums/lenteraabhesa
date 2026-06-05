'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Lock, Mail, Loader2, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import Image from 'next/image'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState('')

  // KEAMANAN LAPI 1: Cek apakah sudah ada sesi login yang aktif saat halaman dimuat
  useEffect(() => {
    const checkActiveSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        router.replace('/admin') // Redirect paksa jika sudah login
      } else {
        setPageLoading(false) // Tampilkan form jika memang belum login
      }
    }
    checkActiveSession()
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasi form dasar
    if (!email || !password) {
      setErrorMsg('Email dan password wajib diisi.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw new Error('Kredensial tidak valid. Periksa email dan password Anda.')

      // Login sukses, bersihkan form dan arahkan ke dashboard
      setEmail('')
      setPassword('')
      router.replace('/admin')
      
    } catch (error: any) {
      setErrorMsg(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Jangan tampilkan form jika sedang mengecek sesi aktif
  if (pageLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FAFBFB]">
        <Loader2 className="w-8 h-8 text-[#005C43] animate-spin" />
      </div>
    )
  }

  return (
    <main className="w-full min-h-screen bg-[#FAFBFB] flex items-center justify-center px-6 font-sans">
      <div className="w-full max-w-md bg-white border border-gray-100 rounded-[24px] p-8 md:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.04)]">
        
        {/* Header Identitas Admin */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-[#EBF2EF] rounded-full flex items-center justify-center mb-5 relative">
            <ShieldCheck className="w-8 h-8 text-[#005C43]" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Portal Admin</h1>
          <p className="text-[15px] text-gray-500 mt-2 leading-relaxed">
            Sistem Informasi Lentera Abhesa.<br />Silakan masuk untuk melanjutkan.
          </p>
        </div>

        {/* Notifikasi Error Otomatis */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50/80 border border-red-100 rounded-xl text-sm text-red-600 font-medium flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="mt-0.5 min-w-[16px]">⚠️</div>
            <p>{errorMsg}</p>
          </div>
        )}

        {/* Form Interaktif */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2">Email Administrator</label>
            <div className="relative group">
              <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#005C43] transition-colors" />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@lenteraabhesa.com"
                className="w-full bg-[#FAFBFB] border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-[15px] text-gray-900 focus:outline-none focus:border-[#005C43] focus:ring-1 focus:ring-[#005C43] focus:bg-white transition-all placeholder:text-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-gray-700 mb-2">Kata Sandi</label>
            <div className="relative group">
              <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within:text-[#005C43] transition-colors" />
              <input 
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FAFBFB] border border-gray-200 rounded-xl py-3.5 pl-12 pr-12 text-[15px] text-gray-900 focus:outline-none focus:border-[#005C43] focus:ring-1 focus:ring-[#005C43] focus:bg-white transition-all placeholder:text-gray-400"
              />
              {/* Tombol Intip Password */}
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#005C43] hover:bg-[#004431] active:scale-[0.98] disabled:bg-gray-300 disabled:active:scale-100 text-white font-semibold py-3.5 rounded-xl text-[15px] transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Otentikasi...</span>
              </>
            ) : (
              <span>Masuk Sistem</span>
            )}
          </button>
        </form>
      </div>
    </main>
  )
}