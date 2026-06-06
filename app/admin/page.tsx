'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  LogOut, LayoutDashboard, BookOpen, ShoppingBag, 
  Loader2, UserCircle, Plus, Trash2, Volume2, FileText, 
  Upload, Edit3, Activity, Users, Gamepad2, Search, X
} from 'lucide-react'
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'

// --- TYPE DECLARATIONS ---
interface KamusItem {
  id: string
  kata_alos: string | null
  kata_sedang: string | null 
  kata_kasar: string | null
  arti_indonesia: string
  contoh_kalimat: string | null
  arti_contoh: string | null
  pelafalan_alos: string | null
  pelafalan_sedang: string | null
  pelafalan_kasar: string | null
}

interface SejarahItem {
  id: string
  judul: string
  slug: string
  konten: string
  gambar_url: string | null
  penulis: string
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [activeMenu, setActiveMenu] = useState('dashboard')

  // --- STATE DATA ---
  const [kamusList, setKamusList] = useState<KamusItem[]>([])
  const [sejarahList, setSejarahList] = useState<SejarahItem[]>([])
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'jam' | 'hari' | 'minggu' | 'bulan'>('hari')

  // --- STATE EDIT MODE ---
  const [editingKamusId, setEditingKamusId] = useState<string | null>(null)
  const [editingSejarahId, setEditingSejarahId] = useState<string | null>(null)

  // --- STATE FORM KAMUS ---
  const [kataAlos, setKataAlos] = useState('')
  const [audioAlos, setAudioAlos] = useState<File | null>(null)
  const [kataSedang, setKataSedang] = useState('') 
  const [audioSedang, setAudioSedang] = useState<File | null>(null)
  const [kataKasar, setKataKasar] = useState('')
  const [audioKasar, setAudioKasar] = useState<File | null>(null)
  const [artiIndo, setArtiIndo] = useState('')
  const [contohKalimat, setContohKalimat] = useState('')
  const [artiContoh, setArtiContoh] = useState('')

  // --- STATE FORM SEJARAH ---
  const [judulArtikel, setJudulArtikel] = useState('')
  const [kontenArtikel, setKontenArtikel] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)

  // --- INIT & AUTH ---
  useEffect(() => {
    const fetchSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error || !session) return router.replace('/admin/login')
      
      setAdminEmail(session.user.email || 'Administrator')
      setLoading(false)
      fetchKamus()
      fetchSejarah()
    }
    fetchSession()
  }, [router])

  // --- DATA FETCHING ---
  const fetchKamus = async () => {
    const { data } = await supabase.from('kamus').select('*').order('created_at', { ascending: false })
    if (data) setKamusList(data as KamusItem[])
  }

  const fetchSejarah = async () => {
    const { data } = await supabase.from('sejarah').select('*').order('created_at', { ascending: false })
    if (data) setSejarahList(data as SejarahItem[])
  }

  // --- HELPER AUDIO UPLOAD ---
  const uploadFile = async (file: File | null, bucket: string) => {
    if (!file) return null;
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from(bucket).upload(fileName, file)
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return publicUrl
  }

  // --- KAMUS HANDLERS ---
  const resetFormKamus = () => {
    setEditingKamusId(null); setKataAlos(''); setAudioAlos(null); setKataSedang('');
    setAudioSedang(null); setKataKasar(''); setAudioKasar(null); setArtiIndo('');
    setContohKalimat(''); setArtiContoh('');
    ['audio-alos', 'audio-sedang', 'audio-kasar'].forEach(id => {
      const input = document.getElementById(id) as HTMLInputElement;
      if (input) input.value = '';
    });
  }

  const handleEditClickKamus = (item: KamusItem) => {
    setEditingKamusId(item.id)
    setKataAlos(item.kata_alos || '')
    setKataSedang(item.kata_sedang || '')
    setKataKasar(item.kata_kasar || '')
    setArtiIndo(item.arti_indonesia || '')
    setContohKalimat(item.contoh_kalimat || '')
    setArtiContoh(item.arti_contoh || '')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmitKamus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!artiIndo || (!kataAlos && !kataSedang && !kataKasar)) return alert('Minimal isi 1 jenis kata dan Arti Indonesia!')
    setSubmitLoading(true)

    try {
      const urlAlos = await uploadFile(audioAlos, 'audio-pelafalan')
      const urlSedang = await uploadFile(audioSedang, 'audio-pelafalan')
      const urlKasar = await uploadFile(audioKasar, 'audio-pelafalan')

      const payload: any = {
        kata_alos: kataAlos || null, kata_sedang: kataSedang || null, kata_kasar: kataKasar || null,
        arti_indonesia: artiIndo, contoh_kalimat: contohKalimat || null, arti_contoh: artiContoh || null
      }

      if (urlAlos) payload.pelafalan_alos = urlAlos
      if (urlSedang) payload.pelafalan_sedang = urlSedang
      if (urlKasar) payload.pelafalan_kasar = urlKasar

      if (editingKamusId) {
        await supabase.from('kamus').update(payload).eq('id', editingKamusId)
        alert('Kosakata berhasil diperbarui!')
      } else {
        await supabase.from('kamus').insert([payload])
        alert('Kosakata berhasil ditambahkan!')
      }
      resetFormKamus()
      fetchKamus()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  // --- SEJARAH HANDLERS ---
  const resetFormSejarah = () => {
    setEditingSejarahId(null); setJudulArtikel(''); setKontenArtikel(''); setCoverFile(null);
    const input = document.getElementById('cover-input') as HTMLInputElement;
    if (input) input.value = '';
  }

  const handleEditClickSejarah = (item: SejarahItem) => {
    setEditingSejarahId(item.id)
    setJudulArtikel(item.judul)
    setKontenArtikel(item.konten)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmitSejarah = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!judulArtikel || !kontenArtikel) return alert('Judul dan Konten wajib diisi!')
    setSubmitLoading(true)

    try {
      const coverUrl = await uploadFile(coverFile, 'artikel-covers')
      const slug = judulArtikel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      
      const payload: any = { judul: judulArtikel, slug, konten: kontenArtikel, penulis: 'Admin Lentera' }
      if (coverUrl) payload.gambar_url = coverUrl

      if (editingSejarahId) {
        await supabase.from('sejarah').update(payload).eq('id', editingSejarahId)
        alert('Artikel berhasil diperbarui!')
      } else {
        await supabase.from('sejarah').insert([payload])
        alert('Artikel diterbitkan!')
      }
      resetFormSejarah()
      fetchSejarah()
    } catch (err: any) {
      alert(`Error: ${err.message}`)
    } finally {
      setSubmitLoading(false)
    }
  }

  const handleDelete = async (table: 'kamus' | 'sejarah', id: string) => {
    if (confirm('Yakin ingin menghapus data ini secara permanen?')) {
      await supabase.from(table).delete().eq('id', id)
      table === 'kamus' ? fetchKamus() : fetchSejarah()
    }
  }

  // --- MOCK ANALYTICS DATA GENERATOR ---
  // Catatan Developer: Data ini di-mock untuk UI. Untuk data asli, query ke tabel 'analytics_events'.
  const analyticsData = useMemo(() => {
    const data = []
    const points = analyticsPeriod === 'jam' ? 24 : analyticsPeriod === 'hari' ? 7 : analyticsPeriod === 'minggu' ? 4 : 12
    const labels = 
      analyticsPeriod === 'jam' ? Array.from({length: 24}, (_, i) => `${i}:00`) :
      analyticsPeriod === 'hari' ? ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'] :
      analyticsPeriod === 'minggu' ? ['M1', 'M2', 'M3', 'M4'] :
      ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']

    for (let i = 0; i < points; i++) {
      data.push({
        name: labels[i],
        Pengunjung: Math.floor(Math.random() * 500) + 100,
        Kamus: Math.floor(Math.random() * 300) + 50,
        Game: Math.floor(Math.random() * 200) + 20,
      })
    }
    return data
  }, [analyticsPeriod])

  if (loading) return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <Loader2 className="w-10 h-10 text-[#005C43] animate-spin" />
      <p className="text-[15px] font-medium text-gray-500">Inisialisasi Command Center...</p>
    </div>
  )

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] flex font-sans text-gray-900">
      
      {/* SIDEBAR */}
      <aside className="w-[280px] bg-white border-r border-gray-100 flex flex-col justify-between p-6 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.01)] hidden md:flex z-20 relative">
        <div className="flex flex-col gap-10">
          <div>
            <h2 className="text-[20px] font-black text-[#005C43] tracking-tight mb-6">LENTERA ADMIN</h2>
            <div className="flex items-center gap-3 p-3 bg-[#FAFBFB] border border-gray-100 rounded-xl">
              <UserCircle className="w-10 h-10 text-gray-400" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-[13px] font-bold text-gray-900">Admin Utama</span>
                <span className="text-[12px] text-gray-500 truncate">{adminEmail}</span>
              </div>
            </div>
          </div>
          <nav className="flex flex-col gap-2">
            <p className="px-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Manajemen Inti</p>
            {[
              { id: 'dashboard', icon: Activity, label: 'Trend & Analitik' },
              { id: 'kamus', icon: BookOpen, label: 'Kelola Kosakata' },
              { id: 'sejarah', icon: FileText, label: 'Artikel Sejarah' },
              { id: 'pesanan', icon: ShoppingBag, label: 'Pesanan Store' },
            ].map(menu => (
              <button key={menu.id} onClick={() => setActiveMenu(menu.id)} className={`flex items-center gap-3 w-full px-4 py-3.5 font-semibold text-[14px] rounded-xl text-left transition-all ${activeMenu === menu.id ? 'bg-[#005C43] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                <menu.icon className="w-5 h-5" /> {menu.label}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-[14px] rounded-xl mt-6">
          <LogOut className="w-4 h-4" /> Keluar Sistem
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto">
        <header className="bg-white border-b border-gray-100 px-10 py-6 sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">
            {activeMenu === 'dashboard' ? 'Telemetry & Analytics' : activeMenu === 'kamus' ? 'Database Kamus Bawean' : activeMenu === 'sejarah' ? 'Manajemen Konten Sejarah' : 'Modul E-Commerce'}
          </h1>
        </header>

        <div className="p-10 pb-20">
          
          {/* TAB 1: ADVANCED DASHBOARD / ANALYTICS */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              {/* Top Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[
                  { label: 'Total Kosakata', value: kamusList.length, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Artikel Terbit', value: sejarahList.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Total Pengunjung', value: '24.5K', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
                  { label: 'Game Dimainkan', value: '8.2K', icon: Gamepad2, color: 'text-orange-600', bg: 'bg-orange-50' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 border border-gray-100 rounded-[20px] shadow-sm flex items-center gap-4">
                    <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shrink-0`}>
                      <stat.icon className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wide">{stat.label}</p>
                      <p className="text-[28px] font-black text-gray-900 leading-none mt-1">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chart Section */}
              <div className="bg-white border border-gray-100 rounded-[20px] shadow-sm p-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Traffic & Engagement Trend</h2>
                    <p className="text-sm text-gray-500 mt-1">Memantau lalu lintas pengunjung dan penggunaan fitur interaktif platform.</p>
                  </div>
                  <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200">
                    {['jam', 'hari', 'minggu', 'bulan'].map((period) => (
                      <button key={period} onClick={() => setAnalyticsPeriod(period as any)} className={`px-4 py-2 text-sm font-bold rounded-md capitalize transition-all ${analyticsPeriod === period ? 'bg-white text-[#005C43] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={analyticsData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dx={-10} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                      <Line type="monotone" dataKey="Pengunjung" stroke="#8B5CF6" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                      <Line type="monotone" dataKey="Kamus" stroke="#10B981" strokeWidth={3} dot={false} />
                      <Line type="monotone" dataKey="Game" stroke="#F97316" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KELOLA KAMUS DENGAN FULL CRUD */}
          {activeMenu === 'kamus' && (
            <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_2fr] gap-8 items-start">
              
              <form onSubmit={handleSubmitKamus} className="bg-white border border-gray-100 p-6 rounded-[20px] shadow-sm sticky top-[100px]">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    {editingKamusId ? <><Edit3 className="w-5 h-5 text-blue-600" /> Edit Kosakata</> : <><Plus className="w-5 h-5 text-emerald-600" /> Tambah Kosakata Baru</>}
                  </h2>
                  {editingKamusId && (
                    <button type="button" onClick={resetFormKamus} className="text-xs font-bold text-gray-400 hover:text-gray-900 flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full"><X className="w-3 h-3" /> Batal Edit</button>
                  )}
                </div>
                
                <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {/* GROUP HALUS */}
                  <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-100/50 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-700 uppercase mb-1">Kata Halus (Alos)</label>
                      <input type="text" value={kataAlos} onChange={e => setKataAlos(e.target.value)} placeholder="Dhahar" className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-emerald-700 uppercase mb-1">Update Audio Halus</label>
                      <input id="audio-alos" type="file" accept="audio/*" onChange={e => setAudioAlos(e.target.files?.[0] || null)} className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-700 hover:file:bg-emerald-200" />
                    </div>
                  </div>

                  {/* GROUP SEDANG */}
                  <div className="bg-blue-50/40 p-4 rounded-xl border border-blue-100/50 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-blue-700 uppercase mb-1">Kata Sedang</label>
                      <input type="text" value={kataSedang} onChange={e => setKataSedang(e.target.value)} placeholder="Madheng" className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-blue-700 uppercase mb-1">Update Audio Sedang</label>
                      <input id="audio-sedang" type="file" accept="audio/*" onChange={e => setAudioSedang(e.target.files?.[0] || null)} className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" />
                    </div>
                  </div>

                  {/* GROUP KASAR */}
                  <div className="bg-red-50/40 p-4 rounded-xl border border-red-100/50 space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-red-700 uppercase mb-1">Kata Kasar</label>
                      <input type="text" value={kataKasar} onChange={e => setKataKasar(e.target.value)} placeholder="Ngakan" className="w-full bg-white border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-red-500" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-red-700 uppercase mb-1">Update Audio Kasar</label>
                      <input id="audio-kasar" type="file" accept="audio/*" onChange={e => setAudioKasar(e.target.files?.[0] || null)} className="w-full text-xs text-gray-500 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-red-100 file:text-red-700 hover:file:bg-red-200" />
                    </div>
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Arti Indonesia *</label>
                      <input type="text" required value={artiIndo} onChange={e => setArtiIndo(e.target.value)} placeholder="Makan" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-[#005C43] focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Contoh Kalimat</label>
                      <textarea value={contohKalimat} onChange={e => setContohKalimat(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm h-16 focus:outline-none focus:border-[#005C43] focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Arti Kalimat</label>
                      <textarea value={artiContoh} onChange={e => setArtiContoh(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 text-sm h-16 focus:outline-none focus:border-[#005C43] focus:bg-white" />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={submitLoading} className={`w-full mt-6 text-white py-3.5 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 hover:opacity-90 transition-all ${editingKamusId ? 'bg-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.2)]' : 'bg-[#005C43] shadow-[0_4px_12px_rgba(0,92,67,0.2)]'}`}>
                  {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingKamusId ? 'Simpan Perubahan' : 'Terbitkan Kosakata'}
                </button>
              </form>

              {/* TABLE KAMUS */}
              <div className="bg-white border border-gray-100 rounded-[20px] shadow-sm p-6 overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <h2 className="text-lg font-bold text-gray-900">Database Master Kamus</h2>
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Cari kata..." className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:bg-white focus:border-[#005C43] w-[250px]" />
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold bg-gray-50/50">
                        <th className="p-4 w-[40%] rounded-tl-xl">Lema (Kosakata)</th>
                        <th className="p-4 w-[30%]">Terjemahan</th>
                        <th className="p-4 text-center w-[15%]">Aset Audio</th>
                        <th className="p-4 text-right w-[15%] rounded-tr-xl">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kamusList.map((item) => (
                        <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                          <td className="p-4">
                            <div className="flex flex-col gap-1">
                              {item.kata_alos && <span className="font-bold text-emerald-700 text-[15px]"><span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded-md mr-2 font-black uppercase tracking-wider">Alus</span>{item.kata_alos}</span>}
                              {item.kata_sedang && <span className="font-bold text-blue-700 text-[15px]"><span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-md mr-2 font-black uppercase tracking-wider">Sedang</span>{item.kata_sedang}</span>}
                              {item.kata_kasar && <span className="font-bold text-red-700 text-[15px]"><span className="text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded-md mr-2 font-black uppercase tracking-wider">Kasar</span>{item.kata_kasar}</span>}
                            </div>
                          </td>
                          <td className="p-4 text-gray-600 font-medium">{item.arti_indonesia}</td>
                          <td className="p-4">
                            <div className="flex justify-center gap-1.5">
                              {item.pelafalan_alos && <button onClick={() => new Audio(item.pelafalan_alos!).play()} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 transition-colors"><Volume2 className="w-3.5 h-3.5" /></button>}
                              {item.pelafalan_sedang && <button onClick={() => new Audio(item.pelafalan_sedang!).play()} className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"><Volume2 className="w-3.5 h-3.5" /></button>}
                              {item.pelafalan_kasar && <button onClick={() => new Audio(item.pelafalan_kasar!).play()} className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"><Volume2 className="w-3.5 h-3.5" /></button>}
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditClickKamus(item)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete('kamus', item.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: KELOLA SEJARAH (SAMA, DITAMBAH EDIT MODE) */}
          {activeMenu === 'sejarah' && (
             <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_2fr] gap-8 items-start">
             <form onSubmit={handleSubmitSejarah} className="bg-white border border-gray-100 p-6 rounded-[20px] shadow-sm sticky top-[100px] space-y-4">
                <div className="flex justify-between items-center mb-2 border-b pb-3">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    {editingSejarahId ? <><Edit3 className="w-5 h-5 text-blue-600" /> Edit Artikel</> : <><Plus className="w-5 h-5 text-[#005C43]" /> Tulis Artikel Baru</>}
                  </h2>
                  {editingSejarahId && (
                    <button type="button" onClick={resetFormSejarah} className="text-xs font-bold text-gray-400 hover:text-gray-900 flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full"><X className="w-3 h-3" /> Batal</button>
                  )}
                </div>
               <div>
                 <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Judul Artikel *</label>
                 <input type="text" required value={judulArtikel} onChange={e => setJudulArtikel(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#005C43] focus:bg-white" />
               </div>
               <div>
                 <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Konten Lengkap *</label>
                 <textarea required value={kontenArtikel} onChange={e => setKontenArtikel(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm h-64 focus:outline-none focus:border-[#005C43] focus:bg-white custom-scrollbar" />
               </div>
               <div>
                 <label className="block text-[11px] font-bold text-gray-500 uppercase mb-1">Ganti Cover (Opsional saat Edit)</label>
                 <input id="cover-input" type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-[#EBF2EF] file:text-[#005C43] hover:file:bg-[#d1e5dd]" />
               </div>
               <button type="submit" disabled={submitLoading} className={`w-full mt-4 text-white py-3.5 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 hover:opacity-90 transition-all ${editingSejarahId ? 'bg-blue-600' : 'bg-[#005C43]'}`}>
                 {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : editingSejarahId ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
               </button>
             </form>

             <div className="bg-white border border-gray-100 rounded-[20px] shadow-sm p-6 space-y-4">
               <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-4">Arsip Konten Sejarah</h2>
               <div className="grid grid-cols-1 gap-4">
                 {sejarahList.map((artikel) => (
                   <div key={artikel.id} className="p-4 border border-gray-100 rounded-[16px] bg-[#FAFBFB] flex justify-between items-center gap-4 hover:border-gray-200 hover:shadow-sm transition-all group">
                     <div className="flex items-center gap-5 overflow-hidden">
                       {artikel.gambar_url ? (
                         <img src={artikel.gambar_url} alt={artikel.judul} className="w-20 h-20 rounded-xl object-cover shadow-sm" />
                       ) : (
                         <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center"><FileText className="w-8 h-8 text-gray-300" /></div>
                       )}
                       <div className="overflow-hidden">
                         <h4 className="font-bold text-[16px] text-gray-900 truncate">{artikel.judul}</h4>
                         <p className="text-[13px] text-gray-500 mt-1 line-clamp-2">{artikel.konten}</p>
                       </div>
                     </div>
                     <div className="flex flex-col gap-2 shrink-0">
                        <button onClick={() => handleEditClickSejarah(artikel)} className="p-2.5 bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 rounded-xl transition-all shadow-sm"><Edit3 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete('sejarah', artikel.id)} className="p-2.5 bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200 rounded-xl transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           </div>
          )}

          {/* TAB 4: PESANAN */}
          {activeMenu === 'pesanan' && (
            <div className="bg-white border border-gray-100 rounded-[20px] shadow-sm p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-20 h-20 bg-[#EBF2EF] rounded-full flex items-center justify-center mb-6">
                 <ShoppingBag className="w-10 h-10 text-[#005C43]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Modul Pesanan / Commerce</h3>
              <p className="text-gray-500 mt-2 max-w-md text-[15px]">Menunggu integrasi API Gateway dengan payment processor untuk mengelola pesanan *merchandise* secara real-time.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}