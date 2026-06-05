'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  LogOut, LayoutDashboard, BookOpen, ShoppingBag, 
  Loader2, UserCircle, Plus, Trash2, Volume2, FileText, Upload 
} from 'lucide-react'

// --- DEKLARASI TIPE DATA (TYPESCRIPT) ---
interface KamusItem {
  id: string
  kata_alos: string
  kata_kasar: string
  arti_indonesia: string
  contoh_kalimat: string
  arti_contoh: string
  audio_url: string
}

interface SejarahItem {
  id: string
  judul: string
  slug: string
  konten: string
  gambar_url: string
  penulis: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [activeMenu, setActiveMenu] = useState('dashboard')

  // --- STATE DATA DARI SUPABASE ---
  const [kamusList, setKamusList] = useState<KamusItem[]>([])
  const [sejarahList, setSejarahList] = useState<SejarahItem[]>([])

  // --- STATE FORM INPUT KAMUS ---
  const [kataAlos, setKataAlos] = useState('')
  const [kataKasar, setKataKasar] = useState('')
  const [artiIndo, setArtiIndo] = useState('')
  const [contohKalimat, setContohKalimat] = useState('')
  const [artiContoh, setArtiContoh] = useState('')
  const [audioFile, setAudioFile] = useState<File | null>(null)

  // --- STATE FORM INPUT ARTIKEL SEJARAH ---
  const [judulArtikel, setJudulArtikel] = useState('')
  const [kontenArtikel, setKontenArtikel] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)

  // 1. Proteksi Sesi Login & Realtime Auth
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error || !session) {
        router.replace('/admin/login')
        return
      }
      
      setAdminEmail(session.user.email || 'Administrator')
      setLoading(false)
      
      // Load data awal setelah dipastikan aman
      fetchKamus()
      fetchSejarah()
    }

    fetchSession()

    // Listener jika token kedaluwarsa atau dilogout paksa
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.replace('/admin/login')
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  // --- FUNGSI AMBIL DATA (READ) ---
  const fetchKamus = async () => {
    const { data, error } = await supabase.from('kamus').select('*').order('created_at', { ascending: false })
    if (data && !error) setKamusList(data as KamusItem[])
  }

  const fetchSejarah = async () => {
    const { data, error } = await supabase.from('sejarah').select('*').order('created_at', { ascending: false })
    if (data && !error) setSejarahList(data as SejarahItem[])
  }

  // --- FUNGSI TAMBAH KOSAKATA + AUDIO (CREATE) ---
  const handleAddKamus = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!kataAlos || !artiIndo) {
      alert('Kata Halus dan Arti Indonesia wajib diisi!')
      return
    }

    setSubmitLoading(true)
    let uploadedAudioUrl = ''

    try {
      // 1. Proses Upload Audio (Jika Ada)
      if (audioFile) {
        const fileExt = audioFile.name.split('.').pop()
        // Penamaan file unik: timestamp + string acak agar tidak bentrok
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('audio-pelafalan')
          .upload(fileName, audioFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        // Ambil URL Publik
        const { data: { publicUrl } } = supabase.storage
          .from('audio-pelafalan')
          .getPublicUrl(fileName)
          
        uploadedAudioUrl = publicUrl
      }

      // 2. Simpan Data ke Database
      const { error } = await supabase.from('kamus').insert([
        {
          kata_alos: kataAlos,
          kata_kasar: kataKasar || null,
          arti_indonesia: artiIndo,
          contoh_kalimat: contohKalimat || null,
          arti_contoh: artiContoh || null,
          audio_url: uploadedAudioUrl || null
        }
      ])

      if (error) throw error

      // 3. Reset Form & Refresh
      setKataAlos('')
      setKataKasar('')
      setArtiIndo('')
      setContohKalimat('')
      setArtiContoh('')
      setAudioFile(null)
      
      // Reset input file via DOM trick agar tampilan kembali bersih
      const fileInput = document.getElementById('audio-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''

      alert('Kosakata berhasil ditambahkan!')
      fetchKamus()
    } catch (err: any) {
      alert(`Gagal menyimpan kosakata: ${err.message}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  // --- FUNGSI TAMBAH ARTIKEL SEJARAH + COVER (CREATE) ---
  const handleAddSejarah = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!judulArtikel || !kontenArtikel) {
      alert('Judul dan Konten Artikel wajib diisi!')
      return
    }

    setSubmitLoading(true)
    let uploadedCoverUrl = ''

    try {
      // 1. Proses Upload Gambar Cover (Jika Ada)
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
          .from('artikel-covers')
          .upload(fileName, coverFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('artikel-covers')
          .getPublicUrl(fileName)

        uploadedCoverUrl = publicUrl
      }

      // Buat slug otomatis yang aman untuk URL
      const slug = judulArtikel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

      // 2. Simpan Data ke Database
      const { error } = await supabase.from('sejarah').insert([
        {
          judul: judulArtikel,
          slug: slug,
          konten: kontenArtikel,
          gambar_url: uploadedCoverUrl || null,
          penulis: 'Admin Lentera'
        }
      ])

      if (error) throw error

      // 3. Reset Form & Refresh
      setJudulArtikel('')
      setKontenArtikel('')
      setCoverFile(null)

      const fileInput = document.getElementById('cover-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''

      alert('Artikel sejarah berhasil diterbitkan!')
      fetchSejarah()
    } catch (err: any) {
      alert(`Gagal menerbitkan artikel: ${err.message}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  // --- FUNGSI HAPUS DATA (DELETE) ---
  const handleDelete = async (table: 'kamus' | 'sejarah', id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini? Aksi ini tidak dapat dibatalkan.')) {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) {
        alert(`Gagal menghapus data: ${error.message}`)
      } else {
        if (table === 'kamus') fetchKamus()
        if (table === 'sejarah') fetchSejarah()
      }
    }
  }

  // --- FUNGSI LOGOUT ---
  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    // Redirect akan ditangani oleh onAuthStateChange di useEffect
  }

  // --- RENDER LOADING SCREEN ---
  if (loading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <Loader2 className="w-10 h-10 text-[#005C43] animate-spin" />
        <p className="text-[15px] text-gray-500 font-medium">Memuat sistem kendali...</p>
      </div>
    )
  }

  // --- RENDER UI UTAMA ---
  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] flex font-sans text-gray-900">
      
      {/* ================= SIDEBAR NAVIGATION ================= */}
      <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col justify-between p-6 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.01)] z-10 hidden md:flex">
        <div className="flex flex-col gap-10">
          <div className="px-2">
            <h2 className="text-[20px] font-black text-[#005C43] tracking-tight mb-6">LENTERA ADMIN</h2>
            <div className="flex items-center gap-3 p-3 bg-[#FAFBFB] border border-gray-100 rounded-xl">
              <UserCircle className="w-10 h-10 text-gray-400" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-[13px] font-bold text-gray-900 truncate">Admin Sesi</span>
                <span className="text-[12px] text-gray-500 font-medium truncate">{adminEmail}</span>
              </div>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            <p className="px-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Menu Utama</p>
            
            <button 
              onClick={() => setActiveMenu('dashboard')}
              className={`flex items-center gap-3 w-full px-4 py-3.5 font-semibold text-[14px] rounded-xl text-left transition-all ${activeMenu === 'dashboard' ? 'bg-[#005C43] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <LayoutDashboard className="w-5 h-5" /> Ikhtisar Dashboard
            </button>
            
            <button 
              onClick={() => setActiveMenu('kamus')}
              className={`flex items-center gap-3 w-full px-4 py-3.5 font-semibold text-[14px] rounded-xl text-left transition-all ${activeMenu === 'kamus' ? 'bg-[#005C43] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <BookOpen className="w-5 h-5" /> Kelola Kosakata
            </button>

            <button 
              onClick={() => setActiveMenu('sejarah')}
              className={`flex items-center gap-3 w-full px-4 py-3.5 font-semibold text-[14px] rounded-xl text-left transition-all ${activeMenu === 'sejarah' ? 'bg-[#005C43] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <FileText className="w-5 h-5" /> Artikel Sejarah
            </button>

            <button 
              onClick={() => setActiveMenu('pesanan')}
              className={`flex items-center gap-3 w-full px-4 py-3.5 font-semibold text-[14px] rounded-xl text-left transition-all ${activeMenu === 'pesanan' ? 'bg-[#005C43] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
            >
              <ShoppingBag className="w-5 h-5" /> Pesanan Merchandise
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-gray-100 mt-6">
          <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-[14px] rounded-xl transition-colors">
            <LogOut className="w-4 h-4" /> Keluar Sistem
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT AREA ================= */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto w-full">
        <header className="bg-white border-b border-gray-100 px-6 md:px-10 py-6 sticky top-0 z-10 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 capitalize">
            {activeMenu === 'dashboard' ? 'Ikhtisar Sistem' : activeMenu === 'kamus' ? 'Kamus Abhesa Halus' : activeMenu === 'sejarah' ? 'Artikel Sejarah Bawean' : 'Daftar Pesanan'}
          </h1>
        </header>

        <div className="p-6 md:p-10 pb-20">
          
          {/* ---------------- TAB 1: DASHBOARD ---------------- */}
          {activeMenu === 'dashboard' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="bg-white p-6 border border-gray-100 rounded-[20px] shadow-sm">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-[14px] font-bold text-gray-400 uppercase">Total Kata (Kamus)</h3>
                <p className="text-[36px] font-black text-gray-900 mt-1">{kamusList.length}</p>
              </div>
              <div className="bg-white p-6 border border-gray-100 rounded-[20px] shadow-sm">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-[14px] font-bold text-gray-400 uppercase">Artikel Sejarah</h3>
                <p className="text-[36px] font-black text-gray-900 mt-1">{sejarahList.length}</p>
              </div>
            </div>
          )}

          {/* ---------------- TAB 2: KELOLA KAMUS ---------------- */}
          {activeMenu === 'kamus' && (
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-8 items-start">
              {/* Form Input Kamus */}
              <form onSubmit={handleAddKamus} className="bg-white border border-gray-100 p-6 rounded-[20px] shadow-sm space-y-4">
                <h2 className="text-base font-bold text-gray-900 mb-2">Tambah Kosakata</h2>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kata Halus (Abhesa Alos) *</label>
                  <input type="text" required value={kataAlos} onChange={e => setKataAlos(e.target.value)} placeholder="Contoh: Kabhun" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#005C43] focus:bg-white" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kata Biasa/Kasar</label>
                  <input type="text" value={kataKasar} onChange={e => setKataKasar(e.target.value)} placeholder="Contoh: Kebun" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#005C43] focus:bg-white" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Arti Bahasa Indonesia *</label>
                  <input type="text" required value={artiIndo} onChange={e => setArtiIndo(e.target.value)} placeholder="Contoh: Kebun / Pekarangan" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#005C43] focus:bg-white" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Contoh Kalimat (Bawean)</label>
                  <textarea value={contohKalimat} onChange={e => setContohKalimat(e.target.value)} placeholder="Masukkan contoh kalimat..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm h-20 focus:outline-none focus:border-[#005C43] focus:bg-white" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Arti Contoh Kalimat</label>
                  <input type="text" value={artiContoh} onChange={e => setArtiContoh(e.target.value)} placeholder="Arti dari contoh kalimat..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#005C43] focus:bg-white" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">File Audio Pelafalan (.mp3)</label>
                  <div className="relative w-full bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer group">
                    <Upload className="w-6 h-6 text-gray-400 mb-1 group-hover:text-[#005C43] transition-colors" />
                    <span className="text-xs text-gray-500 font-medium text-center truncate max-w-[200px]">
                      {audioFile ? audioFile.name : 'Pilih file audio pelafalan'}
                    </span>
                    <input id="audio-input" type="file" accept="audio/*" onChange={e => setAudioFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>

                <button type="submit" disabled={submitLoading} className="w-full mt-2 bg-[#005C43] text-white py-3.5 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />} Simpan Kosakata
                </button>
              </form>

              {/* List Data Tabel Kamus */}
              <div className="bg-white border border-gray-100 rounded-[20px] shadow-sm p-6 overflow-x-auto">
                <h2 className="text-base font-bold text-gray-900 mb-4">Daftar Kamus Aktual</h2>
                <div className="min-w-[500px]">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold">
                        <th className="pb-3 w-[30%]">Kata Halus</th>
                        <th className="pb-3 w-[40%]">Arti Indonesia</th>
                        <th className="pb-3 text-center w-[15%]">Audio</th>
                        <th className="pb-3 text-right w-[15%]">Hapus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kamusList.map((item) => (
                        <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                          <td className="py-3.5 font-bold text-[#005C43] truncate">{item.kata_alos}</td>
                          <td className="py-3.5 text-gray-600 truncate">{item.arti_indonesia}</td>
                          <td className="py-3.5 text-center">
                            {item.audio_url ? (
                              <button onClick={() => new Audio(item.audio_url).play()} className="p-2 bg-[#EBF2EF] text-[#005C43] rounded-full inline-flex hover:scale-110 transition-transform" title="Putar Audio">
                                <Volume2 className="w-4 h-4" />
                              </button>
                            ) : <span className="text-xs text-gray-300">-</span>}
                          </td>
                          <td className="py-3.5 text-right">
                            <button onClick={() => handleDelete('kamus', item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl inline-flex transition-colors" title="Hapus Data">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {kamusList.length === 0 && (
                        <tr><td colSpan={4} className="text-center py-10 text-gray-400 font-medium bg-gray-50/30 rounded-xl mt-2">Belum ada data kosakata.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ---------------- TAB 3: KELOLA SEJARAH ---------------- */}
          {activeMenu === 'sejarah' && (
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-8 items-start">
              {/* Form Input Artikel */}
              <form onSubmit={handleAddSejarah} className="bg-white border border-gray-100 p-6 rounded-[20px] shadow-sm space-y-4">
                <h2 className="text-base font-bold text-gray-900 mb-2">Buat Artikel Baru</h2>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Judul Artikel Sejarah *</label>
                  <input type="text" required value={judulArtikel} onChange={e => setJudulArtikel(e.target.value)} placeholder="Contoh: Asal Usul Suku Bawean" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#005C43] focus:bg-white" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Konten / Isi Artikel *</label>
                  <textarea required value={kontenArtikel} onChange={e => setKontenArtikel(e.target.value)} placeholder="Tuliskan cerita sejarah lengkap di sini..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm h-44 focus:outline-none focus:border-[#005C43] focus:bg-white" />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Gambar Cover Banner (Opsional)</label>
                  <div className="relative w-full bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer group">
                    <Upload className="w-6 h-6 text-gray-400 mb-1 group-hover:text-[#005C43] transition-colors" />
                    <span className="text-xs text-gray-500 font-medium text-center truncate max-w-[200px]">
                      {coverFile ? coverFile.name : 'Pilih gambar cover artikel'}
                    </span>
                    <input id="cover-input" type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>

                <button type="submit" disabled={submitLoading} className="w-full mt-2 bg-[#005C43] text-white py-3.5 rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />} Terbitkan Artikel
                </button>
              </form>

              {/* List Artikel Sejarah */}
              <div className="bg-white border border-gray-100 rounded-[20px] shadow-sm p-6 space-y-4">
                <h2 className="text-base font-bold text-gray-900">Artikel Terbit</h2>
                <div className="grid grid-cols-1 gap-4">
                  {sejarahList.map((artikel) => (
                    <div key={artikel.id} className="p-4 border border-gray-100 rounded-[16px] bg-[#FAFBFB] flex justify-between items-center gap-4 hover:border-gray-200 transition-colors">
                      <div className="flex items-center gap-4 overflow-hidden">
                        {artikel.gambar_url ? (
                          <img src={artikel.gambar_url} alt={artikel.judul} className="w-16 h-16 rounded-xl object-cover bg-gray-200 shrink-0 shadow-sm" />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                            <FileText className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-[15px] text-gray-900 truncate">{artikel.judul}</h4>
                          <p className="text-[13px] text-gray-400 mt-0.5 truncate">Path: /sejarah/{artikel.slug}</p>
                        </div>
                      </div>
                      <button onClick={() => handleDelete('sejarah', artikel.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-xl shrink-0 transition-colors" title="Hapus Artikel">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {sejarahList.length === 0 && (
                    <p className="text-center py-10 text-gray-400 text-[14px] font-medium bg-gray-50/30 rounded-xl">Belum ada artikel sejarah yang diterbitkan.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ---------------- TAB 4: PESANAN MERCHANDISE ---------------- */}
          {activeMenu === 'pesanan' && (
            <div className="bg-white border border-gray-100 rounded-[20px] shadow-sm p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-20 h-20 bg-[#EBF2EF] rounded-full flex items-center justify-center mb-6">
                <ShoppingBag className="w-10 h-10 text-[#005C43]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Modul Pesanan (Segera Hadir)</h3>
              <p className="text-gray-500 mt-2 max-w-md text-[15px]">
                Fitur ini akan diaktifkan setelah sistem e-commerce *Merchandise* Lentera Abhesa dihubungkan penuh dengan *database* pesanan.
              </p>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}