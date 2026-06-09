'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  LogOut, LayoutDashboard, BookOpen, ShoppingBag, 
  Loader2, UserCircle, Plus, Trash2, Volume2, FileText, 
  Upload, Edit3, Activity, Users, Gamepad2, Search, X, Menu
} from 'lucide-react'
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'

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
  kategori: string 
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [kamusList, setKamusList] = useState<KamusItem[]>([])
  const [sejarahList, setSejarahList] = useState<SejarahItem[]>([])
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'jam' | 'hari' | 'minggu' | 'bulan'>('hari')
  
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())

  const [totalPengunjung, setTotalPengunjung] = useState<number>(0)
  const [totalGame, setTotalGame] = useState<number>(0)
  const [chartData, setChartData] = useState<any[]>([])

  const [editingKamusId, setEditingKamusId] = useState<string | null>(null)
  const [editingSejarahId, setEditingSejarahId] = useState<string | null>(null)

  const [kataAlos, setKataAlos] = useState('')
  const [audioAlos, setAudioAlos] = useState<File | null>(null)
  const [kataSedang, setKataSedang] = useState('') 
  const [audioSedang, setAudioSedang] = useState<File | null>(null)
  const [kataKasar, setKataKasar] = useState('')
  const [audioKasar, setAudioKasar] = useState<File | null>(null)
  const [artiIndo, setArtiIndo] = useState('')
  const [contohKalimat, setContohKalimat] = useState('')
  const [artiContoh, setArtiContoh] = useState('')

  const [kategoriArtikel, setKategoriArtikel] = useState('')
  const [judulArtikel, setJudulArtikel] = useState('')
  const [kontenArtikel, setKontenArtikel] = useState('')
  const [penulisArtikel, setPenulisArtikel] = useState('')
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const [analyticsGame, setAnalyticsGame] = useState({
    tebakGambarCount: 0,
    tebakKataCount: 0,
    susunKataCount: 0,
    totalPlayers: 0
  })

  const fetchKamus = async () => {
    const { data, error } = await supabase.from('kamus').select('*').order('created_at', { ascending: false })
    if (data) setKamusList(data as KamusItem[])
    if (error) console.error('Error fetching kamus:', error)
  }

  const fetchSejarah = async () => {
    const { data, error } = await supabase.from('sejarah').select('*').order('created_at', { ascending: false })
    if (data) setSejarahList(data as SejarahItem[])
    if (error) console.error('Error fetching sejarah:', error)
  }

  useEffect(() => {
    const checkSessionAndInitData = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !session) {
          router.push('/login')
          return
        }
        
        setAdminEmail(session.user.email || 'Admin Utama')

        await fetchKamus()
        await fetchSejarah()
        
        // Fetch pengunjung and total permainan lama
        const { count: countPengunjung } = await supabase.from('pengunjung').select('*', { count: 'exact', head: true })
        const { count: countGame } = await supabase.from('permainan').select('*', { count: 'exact', head: true })
        
        setTotalPengunjung(countPengunjung || 0)
        setTotalGame(countGame || 0)

        // Fetch Game Analytics Baru
        const { data: gameStats, error: statError } = await supabase.from('game_analytics').select('game_name, session_id')
        
        if (gameStats) {
          const tebakGambar = gameStats.filter(g => g.game_name === 'tebak_gambar').length
          const tebakKata = gameStats.filter(g => g.game_name === 'tebak_kata').length
          const susunKata = gameStats.filter(g => g.game_name === 'susun_kata').length
          
          // Hitung player unik berdasarkan device_id / session_id
          const uniquePlayers = new Set(gameStats.map(g => g.session_id)).size

          setAnalyticsGame({
            tebakGambarCount: tebakGambar,
            tebakKataCount: tebakKata,
            susunKataCount: susunKata,
            totalPlayers: uniquePlayers
          })
          
          // Update total game keseluruhan dari metrik baru agar lebih akurat
          setTotalGame(gameStats.length)
        }

      } catch (err) {
        console.error("Gagal inisialisasi Command Center:", err)
      } finally {
        setLoading(false)
      }
    }

    checkSessionAndInitData()
  }, [router])

  useEffect(() => {
    const generateChartData = async () => {
      try {
        let startIso: string;
        let endIso: string;

        if (analyticsPeriod === 'bulan') {
          startIso = new Date(selectedYear, 0, 1).toISOString()
          endIso = new Date(selectedYear, 11, 31, 23, 59, 59).toISOString()
        } else {
          startIso = new Date(selectedYear, selectedMonth, 1).toISOString()
          endIso = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59).toISOString()
        }

        const [resPengunjung, resGame, resKamus] = await Promise.all([
          supabase.from('pengunjung').select('created_at').gte('created_at', startIso).lte('created_at', endIso),
          supabase.from('game_analytics').select('created_at').gte('created_at', startIso).lte('created_at', endIso),
          supabase.from('kamus').select('created_at').gte('created_at', startIso).lte('created_at', endIso)
        ])

        const rawPengunjung = resPengunjung.data || []
        const rawGame = resGame.data || []
        const rawKamus = resKamus.data || []

        let labels: string[] = []
        let template: any[] = []

        if (analyticsPeriod === 'hari') {
          const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
          labels = Array.from({length: daysInMonth}, (_, i) => `${i + 1}`)
        } else if (analyticsPeriod === 'bulan') {
          labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
        } else if (analyticsPeriod === 'minggu') {
          labels = ['M1', 'M2', 'M3', 'M4', 'M5']
        } else if (analyticsPeriod === 'jam') {
          labels = Array.from({length: 24}, (_, i) => `${i}:00`)
        }

        template = labels.map(label => ({ name: label, Pengunjung: 0, Kamus: 0, Game: 0 }))

        const distributeData = (items: any[], keyName: 'Pengunjung' | 'Kamus' | 'Game') => {
          items.forEach(item => {
            const d = new Date(item.created_at)
            let matchIndex = 0

            if (analyticsPeriod === 'jam') matchIndex = d.getHours()
            else if (analyticsPeriod === 'hari') matchIndex = d.getDate() - 1 
            else if (analyticsPeriod === 'minggu') matchIndex = Math.min(Math.floor((d.getDate() - 1) / 7), 4)
            else if (analyticsPeriod === 'bulan') matchIndex = d.getMonth()

            if (template[matchIndex]) template[matchIndex][keyName] += 1
          })
        }

        distributeData(rawPengunjung, 'Pengunjung')
        distributeData(rawGame, 'Game')
        distributeData(rawKamus, 'Kamus')
        
        setChartData(template)

      } catch (error) {
        console.error("Gagal menyusun chart:", error)
      }
    }
    generateChartData()
  }, [analyticsPeriod, selectedMonth, selectedYear])

  const uploadFile = async (file: File | null, bucket: string) => {
    if (!file) return null;
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from(bucket).upload(fileName, file)
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return publicUrl
  }

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
    setEditingKamusId(item.id); setKataAlos(item.kata_alos || ''); setKataSedang(item.kata_sedang || '');
    setKataKasar(item.kata_kasar || ''); setArtiIndo(item.arti_indonesia || '');
    setContohKalimat(item.contoh_kalimat || ''); setArtiContoh(item.arti_contoh || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleSubmitKamus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!artiIndo || (!kataAlos && !kataSedang && !kataKasar)) return alert('Minimal isi 1 jenis kata dan Arti Indonesia!')
    setSubmitLoading(true)
    try {
      const urlAlos = await uploadFile(audioAlos, 'audio-pelafalan')
      const urlSedang = await uploadFile(audioSedang, 'audio-pelafalan')
      const urlKasar = await uploadFile(audioKasar, 'audio-pelafalan')
      const payload: any = { kata_alos: kataAlos || null, kata_sedang: kataSedang || null, kata_kasar: kataKasar || null, arti_indonesia: artiIndo, contoh_kalimat: contohKalimat || null, arti_contoh: artiContoh || null }
      if (urlAlos) payload.pelafalan_alos = urlAlos; if (urlSedang) payload.pelafalan_sedang = urlSedang; if (urlKasar) payload.pelafalan_kasar = urlKasar;
      if (editingKamusId) { await supabase.from('kamus').update(payload).eq('id', editingKamusId); alert('Kosakata berhasil diperbarui!'); } 
      else { await supabase.from('kamus').insert([payload]); alert('Kosakata berhasil ditambahkan!'); }
      resetFormKamus(); fetchKamus();
    } catch (err: any) { alert(`Gagal Menyimpan Kamus: ${err.message || err}`) } 
    finally { setSubmitLoading(false) }
  }

  const resetFormSejarah = () => {
    setEditingSejarahId(null); setKategoriArtikel(''); setJudulArtikel('');
    setPenulisArtikel(''); setKontenArtikel(''); setCoverFile(null);
    const input = document.getElementById('cover-input') as HTMLInputElement;
    if (input) input.value = '';
  }

  const handleEditClickSejarah = (item: SejarahItem) => {
    setEditingSejarahId(item.id); setKategoriArtikel(item.kategori || ''); setJudulArtikel(item.judul);
    setPenulisArtikel(item.penulis || ''); setKontenArtikel(item.konten);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleSubmitSejarah = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!kategoriArtikel || !judulArtikel || !penulisArtikel || !kontenArtikel) return alert('Data wajib diisi!')
    setSubmitLoading(true)
    try {
      const coverUrl = await uploadFile(coverFile, 'artikel-covers')
      const slug = judulArtikel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      const payload: any = { kategori: kategoriArtikel, judul: judulArtikel, slug, konten: kontenArtikel, penulis: penulisArtikel }
      if (coverUrl) payload.gambar_url = coverUrl
      if (editingSejarahId) { await supabase.from('sejarah').update(payload).eq('id', editingSejarahId); alert('Artikel berhasil diperbarui!'); } 
      else { await supabase.from('sejarah').insert([payload]); alert('Artikel diterbitkan!'); }
      resetFormSejarah(); fetchSejarah();
    } catch (err: any) { alert(`Gagal Menerbitkan Artikel: ${err.message || err}`) } 
    finally { setSubmitLoading(false) }
  }

  const handleDelete = async (table: 'kamus' | 'sejarah', id: string) => {
    if (confirm('Yakin ingin menghapus data ini secara permanen?')) {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) alert(`Gagal menghapus data: ${error.message}`)
      else { alert('Data berhasil dihapus!'); table === 'kamus' ? fetchKamus() : fetchSejarah() }
    }
  }

  if (loading) return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-white gap-4">
      <Loader2 className="w-10 h-10 text-[#005C43] animate-spin" />
      <p className="text-[15px] font-medium text-gray-500">Inisialisasi Command Center...</p>
    </div>
  )

  return (
    <div className="w-full min-h-screen bg-[#F8F9FA] flex flex-col md:flex-row font-sans text-gray-900">
      
      {/* MOBILE HEADER */}
      <div className="md:hidden w-full bg-white border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-50">
        <h2 className="text-[18px] font-black text-[#005C43] tracking-tight">LENTERA ADMIN</h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 text-[#005C43] hover:bg-gray-50 rounded-lg transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-[280px] bg-white border-r border-gray-100 p-6 shadow-xl md:shadow-none z-40 transition-transform duration-300 ease-in-out flex flex-col justify-between
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col gap-8 md:gap-10">
          <div className="hidden md:block">
            <h2 className="text-[20px] font-black text-[#005C43] tracking-tight mb-6">LENTERA ADMIN</h2>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-[#FAFBFB] border border-gray-100 rounded-xl">
            <UserCircle className="w-10 h-10 text-gray-400 shrink-0" />
            <div className="flex flex-col overflow-hidden">
              <span className="text-[13px] font-bold text-gray-900">Admin Utama</span>
              <span className="text-[12px] text-gray-500 truncate">{adminEmail}</span>
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
              <button 
                key={menu.id} 
                onClick={() => {
                  setActiveMenu(menu.id)
                  setIsMobileMenuOpen(false) 
                }} 
                className={`flex items-center gap-3 w-full px-4 py-3.5 font-semibold text-[14px] rounded-xl text-left transition-all ${activeMenu === menu.id ? 'bg-[#005C43] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <menu.icon className="w-5 h-5 shrink-0" /> {menu.label}
              </button>
            ))}
          </nav>
        </div>
        <button onClick={() => supabase.auth.signOut()} className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-[14px] rounded-xl mt-6">
          <LogOut className="w-4 h-4" /> Keluar Sistem
        </button>
      </aside>

      {/* Overlay Mobile */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* MAIN CONTENT VIEWPORT */}
      <main className="flex-1 flex flex-col h-[calc(100vh-64px)] md:h-screen overflow-y-auto w-full">
        <header className="bg-white border-b border-gray-100 px-6 md:px-10 py-5 md:py-6 sticky top-0 z-10 hidden md:block">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">
            {activeMenu === 'dashboard' ? 'Telemetry & Analytics' : activeMenu === 'kamus' ? 'Database Kamus Bawean' : activeMenu === 'sejarah' ? 'Manajemen Konten Sejarah' : 'Modul E-Commerce'}
          </h1>
        </header>

        <div className="p-4 md:p-10 pb-20 w-full overflow-x-hidden">
          
          {/* TAB 1: ADVANCED DASHBOARD / ANALYTICS */}
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              {/* RESPONSIVE GRID METRICS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
                {[
                  { label: 'Total Kosakata', value: kamusList.length, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'Artikel Terbit', value: sejarahList.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Total Pengunjung', value: totalPengunjung, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
                  { label: 'Total Game Dimainkan', value: totalGame, icon: Gamepad2, color: 'text-orange-600', bg: 'bg-orange-50' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-5 md:p-6 border border-gray-100 rounded-[20px] shadow-sm flex items-center gap-4">
                    <div className={`w-12 h-12 md:w-14 md:h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shrink-0`}>
                      <stat.icon className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <div>
                      <p className="text-[11px] md:text-[13px] font-bold text-gray-400 uppercase tracking-wide">{stat.label}</p>
                      <p className="text-[24px] md:text-[28px] font-black text-gray-900 leading-none mt-1">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* SPESIFIK GAME ANALYTICS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                  <div className="bg-white p-5 border border-gray-100 rounded-[20px] shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#005C43]/10 text-[#005C43] rounded-xl flex items-center justify-center text-xl shadow-sm shrink-0">👥</div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Pemain Unik</p>
                      <h3 className="text-[20px] font-black text-gray-900 mt-1 leading-none">{analyticsGame.totalPlayers} Orang</h3>
                    </div>
                  </div>

                  <div className="bg-white p-5 border border-gray-100 rounded-[20px] shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl shadow-sm shrink-0">🖼️</div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Tebak Gambar</p>
                      <h3 className="text-[20px] font-black text-gray-900 mt-1 leading-none">{analyticsGame.tebakGambarCount} Sesi</h3>
                    </div>
                  </div>

                  <div className="bg-white p-5 border border-gray-100 rounded-[20px] shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl shadow-sm shrink-0">🧩</div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Tebak Kata</p>
                      <h3 className="text-[20px] font-black text-gray-900 mt-1 leading-none">{analyticsGame.tebakKataCount} Sesi</h3>
                    </div>
                  </div>

                  <div className="bg-white p-5 border border-gray-100 rounded-[20px] shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-xl shadow-sm shrink-0">✨</div>
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Susun Kata</p>
                      <h3 className="text-[20px] font-black text-gray-900 mt-1 leading-none">{analyticsGame.susunKataCount} Sesi</h3>
                    </div>
                  </div>
              </div>

              {/* RESPONSIVE CHART PANEL */}
              <div className="bg-white border border-gray-100 rounded-[20px] shadow-sm p-4 md:p-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-gray-900">Traffic & Engagement Trend</h2>
                    <p className="text-xs md:text-sm text-gray-500 mt-1">Memantau lalu lintas pengunjung dan interaksi platform.</p>
                  </div>
                  
                  {/* RESPONSIVE FILTER KONTROL */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                    <div className="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm justify-between">
                      <select 
                        value={selectedMonth} 
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className="px-2 md:px-3 py-1.5 text-xs md:text-sm font-bold text-[#005C43] bg-transparent focus:outline-none cursor-pointer w-full"
                      >
                        {['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'].map((m, i) => (
                          <option key={m} value={i}>{m}</option>
                        ))}
                      </select>
                      <div className="w-px bg-gray-200 mx-1 my-1"></div>
                      <select 
                        value={selectedYear} 
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="px-2 md:px-3 py-1.5 text-xs md:text-sm font-bold text-[#005C43] bg-transparent focus:outline-none cursor-pointer"
                      >
                        {[2024, 2025, 2026, 2027].map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex bg-gray-50 p-1 rounded-lg border border-gray-200 overflow-x-auto custom-scrollbar">
                      {['jam', 'hari', 'minggu', 'bulan'].map((period) => (
                        <button key={period} onClick={() => setAnalyticsPeriod(period as any)} className={`px-3 md:px-4 py-2 text-xs md:text-sm font-bold rounded-md capitalize transition-all whitespace-nowrap ${analyticsPeriod === period ? 'bg-white text-[#005C43] shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}>
                          {period}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* GRAPHIC CONTAINER RESPONSIVE */}
                <div className="h-[300px] md:h-[400px] w-full -ml-4 md:ml-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} dx={10} allowDecimals={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: '12px' }} />
                      <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} />
                      <Line type="monotone" dataKey="Pengunjung" stroke="#8B5CF6" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                      <Line type="monotone" dataKey="Kamus" stroke="#10B981" strokeWidth={3} dot={false} />
                      <Line type="monotone" dataKey="Game" stroke="#F97316" strokeWidth={3} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KELOLA KAMUS */}
          {activeMenu === 'kamus' && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 md:gap-8 items-start">
              
              <form onSubmit={handleSubmitKamus} className="bg-white border border-gray-100 p-5 md:p-6 rounded-[20px] shadow-sm sticky top-0 md:top-[100px] z-10">
                <div className="flex justify-between items-center mb-4 border-b pb-3">
                  <h2 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                    {editingKamusId ? <><Edit3 className="w-4 h-4 md:w-5 md:h-5 text-blue-600" /> Edit Kosakata</> : <><Plus className="w-4 h-4 md:w-5 md:h-5 text-emerald-600" /> Tambah Kosakata</>}
                  </h2>
                  {editingKamusId && (
                    <button type="button" onClick={resetFormKamus} className="text-[10px] md:text-xs font-bold text-gray-400 hover:text-gray-900 flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-full"><X className="w-3 h-3" /> Batal</button>
                  )}
                </div>
                
                <div className="space-y-4 max-h-[50vh] md:max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="bg-emerald-50/40 p-3 md:p-4 rounded-xl border border-emerald-100/50 space-y-3">
                    <div>
                      <label className="block text-[10px] md:text-[11px] font-bold text-emerald-700 uppercase mb-1">Kata Halus (Alos)</label>
                      <input type="text" value={kataAlos} onChange={e => setKataAlos(e.target.value)} placeholder="Dhahar" className="w-full bg-white border border-gray-200 rounded-xl p-2 md:p-2.5 text-xs md:text-sm focus:outline-none focus:border-emerald-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-[11px] font-bold text-emerald-700 uppercase mb-1">Audio Halus</label>
                      <input id="audio-alos" type="file" accept="audio/*" onChange={e => setAudioAlos(e.target.files?.[0] || null)} className="w-full text-[10px] md:text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] md:file:text-xs file:font-bold file:bg-emerald-100 file:text-emerald-700" />
                    </div>
                  </div>

                  <div className="bg-blue-50/40 p-3 md:p-4 rounded-xl border border-blue-100/50 space-y-3">
                    <div>
                      <label className="block text-[10px] md:text-[11px] font-bold text-blue-700 uppercase mb-1">Kata Sedang</label>
                      <input type="text" value={kataSedang} onChange={e => setKataSedang(e.target.value)} placeholder="Madheng" className="w-full bg-white border border-gray-200 rounded-xl p-2 md:p-2.5 text-xs md:text-sm focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-[11px] font-bold text-blue-700 uppercase mb-1">Audio Sedang</label>
                      <input id="audio-sedang" type="file" accept="audio/*" onChange={e => setAudioSedang(e.target.files?.[0] || null)} className="w-full text-[10px] md:text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] md:file:text-xs file:font-bold file:bg-blue-100 file:text-blue-700" />
                    </div>
                  </div>

                  <div className="bg-red-50/40 p-3 md:p-4 rounded-xl border border-red-100/50 space-y-3">
                    <div>
                      <label className="block text-[10px] md:text-[11px] font-bold text-red-700 uppercase mb-1">Kata Kasar</label>
                      <input type="text" value={kataKasar} onChange={e => setKataKasar(e.target.value)} placeholder="Ngakan" className="w-full bg-white border border-gray-200 rounded-xl p-2 md:p-2.5 text-xs md:text-sm focus:outline-none focus:border-red-500" />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-[11px] font-bold text-red-700 uppercase mb-1">Audio Kasar</label>
                      <input id="audio-kasar" type="file" accept="audio/*" onChange={e => setAudioKasar(e.target.files?.[0] || null)} className="w-full text-[10px] md:text-xs text-gray-500 file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-[10px] md:file:text-xs file:font-bold file:bg-red-100 file:text-red-700" />
                    </div>
                  </div>

                  <div className="space-y-3 border-t pt-4">
                    <div>
                      <label className="block text-[10px] md:text-[11px] font-bold text-gray-500 uppercase mb-1">Arti Indonesia *</label>
                      <input type="text" required value={artiIndo} onChange={e => setArtiIndo(e.target.value)} placeholder="Makan" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 md:p-2.5 text-xs md:text-sm focus:outline-none focus:border-[#005C43] focus:bg-white" />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-[11px] font-bold text-gray-500 uppercase mb-1">Contoh Kalimat</label>
                      <textarea value={contohKalimat} onChange={e => setContohKalimat(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 md:p-2.5 text-xs md:text-sm h-16 focus:outline-none focus:border-[#005C43] focus:bg-white resize-none" />
                    </div>
                    <div>
                      <label className="block text-[10px] md:text-[11px] font-bold text-gray-500 uppercase mb-1">Arti Kalimat</label>
                      <textarea value={artiContoh} onChange={e => setArtiContoh(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 md:p-2.5 text-xs md:text-sm h-16 focus:outline-none focus:border-[#005C43] focus:bg-white resize-none" />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={submitLoading} className={`w-full mt-4 md:mt-6 text-white py-3 md:py-3.5 rounded-xl font-bold text-[13px] md:text-[14px] flex items-center justify-center gap-2 hover:opacity-90 transition-all ${editingKamusId ? 'bg-blue-600 shadow-[0_4px_12px_rgba(37,99,235,0.2)]' : 'bg-[#005C43] shadow-[0_4px_12px_rgba(0,92,67,0.2)]'}`}>
                  {submitLoading ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : editingKamusId ? 'Simpan Perubahan' : 'Terbitkan Kosakata'}
                </button>
              </form>

              <div className="bg-white border border-gray-100 rounded-[20px] shadow-sm p-4 md:p-6 overflow-hidden flex flex-col w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 border-b pb-4 gap-3">
                  <h2 className="text-base md:text-lg font-bold text-gray-900">Database Master Kamus</h2>
                  <div className="relative w-full md:w-auto">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Cari kata..." className="pl-9 pr-4 py-2 w-full md:w-[200px] bg-gray-50 border border-gray-200 rounded-lg text-xs md:text-sm focus:outline-none focus:bg-white focus:border-[#005C43]" />
                  </div>
                </div>
                
                {/* RESPONSIVE TABLE CONTAINER */}
                <div className="overflow-x-auto w-full pb-2">
                  <table className="w-full text-left text-sm border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold bg-gray-50/50 text-[11px] md:text-xs uppercase">
                        <th className="p-3 md:p-4 w-[40%] rounded-tl-xl">Lema (Kosakata)</th>
                        <th className="p-3 md:p-4 w-[30%]">Terjemahan</th>
                        <th className="p-3 md:p-4 text-center w-[15%]">Aset Audio</th>
                        <th className="p-3 md:p-4 text-right w-[15%] rounded-tr-xl">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kamusList.map((item) => (
                        <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                          <td className="p-3 md:p-4">
                            <div className="flex flex-col gap-1.5">
                              {item.kata_alos && <span className="font-bold text-emerald-700 text-[13px] md:text-[15px]"><span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded mr-2 font-black uppercase">Alus</span>{item.kata_alos}</span>}
                              {item.kata_sedang && <span className="font-bold text-blue-700 text-[13px] md:text-[15px]"><span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded mr-2 font-black uppercase">Sedang</span>{item.kata_sedang}</span>}
                              {item.kata_kasar && <span className="font-bold text-red-700 text-[13px] md:text-[15px]"><span className="text-[9px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded mr-2 font-black uppercase">Kasar</span>{item.kata_kasar}</span>}
                            </div>
                          </td>
                          <td className="p-3 md:p-4 text-gray-600 font-medium text-xs md:text-sm">{item.arti_indonesia}</td>
                          <td className="p-3 md:p-4">
                            <div className="flex justify-center gap-1.5 flex-wrap">
                              {item.pelafalan_alos && <button onClick={() => new Audio(item.pelafalan_alos!).play()} className="p-1 md:p-1.5 bg-emerald-50 text-emerald-600 rounded-md hover:bg-emerald-100 transition-colors"><Volume2 className="w-3 h-3 md:w-3.5 md:h-3.5" /></button>}
                              {item.pelafalan_sedang && <button onClick={() => new Audio(item.pelafalan_sedang!).play()} className="p-1 md:p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"><Volume2 className="w-3 h-3 md:w-3.5 md:h-3.5" /></button>}
                              {item.pelafalan_kasar && <button onClick={() => new Audio(item.pelafalan_kasar!).play()} className="p-1 md:p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"><Volume2 className="w-3 h-3 md:w-3.5 md:h-3.5" /></button>}
                            </div>
                          </td>
                          <td className="p-3 md:p-4 text-right">
                            <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditClickKamus(item)} className="p-1.5 md:p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"><Edit3 className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                              <button onClick={() => handleDelete('kamus', item.id)} className="p-1.5 md:p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
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

          {/* TAB 3: KELOLA SEJARAH */}
          {activeMenu === 'sejarah' && (
             <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 md:gap-8 items-start">
             <form onSubmit={handleSubmitSejarah} className="bg-white border border-gray-100 p-5 md:p-6 rounded-[20px] shadow-sm sticky top-0 md:top-[100px] z-10 space-y-4">
                <div className="flex justify-between items-center mb-2 border-b pb-3">
                  <h2 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">
                    {editingSejarahId ? <><Edit3 className="w-4 h-4 md:w-5 md:h-5 text-blue-600" /> Edit Artikel</> : <><Plus className="w-4 h-4 md:w-5 md:h-5 text-[#005C43]" /> Tulis Baru</>}
                  </h2>
                  {editingSejarahId && (
                    <button type="button" onClick={resetFormSejarah} className="text-[10px] md:text-xs font-bold text-gray-400 hover:text-gray-900 flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-full"><X className="w-3 h-3" /> Batal</button>
                  )}
                </div>
               <div>
                 <label className="block text-[10px] md:text-[11px] font-bold text-gray-500 uppercase mb-1">Kategori Artikel *</label>
                 <input type="text" required value={kategoriArtikel} onChange={e => setKategoriArtikel(e.target.value)} placeholder="Budaya / Situs Purba" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 md:p-3 text-xs md:text-sm focus:outline-none focus:border-[#005C43] focus:bg-white" />
               </div>
               <div>
                 <label className="block text-[10px] md:text-[11px] font-bold text-gray-500 uppercase mb-1">Judul Artikel *</label>
                 <input type="text" required value={judulArtikel} onChange={e => setJudulArtikel(e.target.value)} placeholder="Masukkan judul..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 md:p-3 text-xs md:text-sm focus:outline-none focus:border-[#005C43] focus:bg-white" />
               </div>
               <div>
                 <label className="block text-[10px] md:text-[11px] font-bold text-gray-500 uppercase mb-1">Penulis *</label>
                 <input type="text" required value={penulisArtikel} onChange={e => setPenulisArtikel(e.target.value)} placeholder="Nama penulis..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 md:p-3 text-xs md:text-sm focus:outline-none focus:border-[#005C43] focus:bg-white" />
               </div>
               <div>
                 <label className="block text-[10px] md:text-[11px] font-bold text-gray-500 uppercase mb-1">Konten Lengkap *</label>
                 <textarea required value={kontenArtikel} onChange={e => setKontenArtikel(e.target.value)} placeholder="Tulis isi cerita lengkap..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 md:p-3 text-xs md:text-sm h-32 md:h-48 focus:outline-none focus:border-[#005C43] focus:bg-white custom-scrollbar resize-none" />
               </div>
               <div>
                 <label className="block text-[10px] md:text-[11px] font-bold text-gray-500 uppercase mb-1">Upload Cover</label>
                 <input id="cover-input" type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="w-full text-[10px] md:text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] md:file:text-xs file:font-bold file:bg-[#EBF2EF] file:text-[#005C43] hover:file:bg-[#d1e5dd]" />
               </div>
               <button type="submit" disabled={submitLoading} className={`w-full mt-4 text-white py-3 md:py-3.5 rounded-xl font-bold text-[13px] md:text-[14px] flex items-center justify-center gap-2 hover:opacity-90 transition-all ${editingSejarahId ? 'bg-blue-600' : 'bg-[#005C43]'}`}>
                 {submitLoading ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : editingSejarahId ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
               </button>
             </form>

             <div className="bg-white border border-gray-100 rounded-[20px] shadow-sm p-4 md:p-6 space-y-4">
               <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 border-b pb-4">Arsip Konten Sejarah</h2>
               <div className="grid grid-cols-1 gap-4">
                 {sejarahList.map((artikel) => (
                   <div key={artikel.id} className="p-3 md:p-4 border border-gray-100 rounded-[16px] bg-[#FAFBFB] flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-gray-200 hover:shadow-sm transition-all group">
                     <div className="flex items-center gap-4 overflow-hidden w-full">
                       {artikel.gambar_url ? (
                         <img src={artikel.gambar_url} alt={artikel.judul} className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover shadow-sm shrink-0" />
                       ) : (
                         <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gray-100 flex items-center justify-center shrink-0"><FileText className="w-6 h-6 md:w-8 md:h-8 text-gray-300" /></div>
                       )}
                       <div className="overflow-hidden">
                         <div className="flex items-center gap-2 mb-1 flex-wrap">
                           <span className="text-[9px] md:text-[10px] bg-[#EBF2EF] text-[#005C43] px-2 py-0.5 rounded font-bold uppercase tracking-wider">{artikel.kategori || 'Umum'}</span>
                           <span className="text-[10px] md:text-[11px] text-gray-400 font-medium">Oleh: {artikel.penulis}</span>
                         </div>
                         <h4 className="font-bold text-[14px] md:text-[16px] text-gray-900 truncate leading-snug">{artikel.judul}</h4>
                         <p className="text-[11px] md:text-[13px] text-gray-500 mt-1 line-clamp-1 md:line-clamp-2">{artikel.konten}</p>
                       </div>
                     </div>
                     <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-auto">
                        <button onClick={() => handleEditClickSejarah(artikel)} className="p-2 md:p-2.5 bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-200 rounded-lg md:rounded-xl transition-all shadow-sm"><Edit3 className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                        <button onClick={() => handleDelete('sejarah', artikel.id)} className="p-2 md:p-2.5 bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200 rounded-lg md:rounded-xl transition-all shadow-sm"><Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" /></button>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
           </div>
          )}

          {/* TAB 4: PESANAN */}
          {activeMenu === 'pesanan' && (
            <div className="bg-white border border-gray-100 rounded-[20px] shadow-sm p-6 md:p-10 text-center flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px]">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-[#EBF2EF] rounded-full flex items-center justify-center mb-4 md:mb-6">
                 <ShoppingBag className="w-8 h-8 md:w-10 md:h-10 text-[#005C43]" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900">Modul Pesanan / Commerce</h3>
              <p className="text-gray-500 mt-2 max-w-md text-sm md:text-[15px] px-4">Menunggu integrasi API Gateway dengan payment processor untuk mengelola pesanan *merchandise* secara real-time.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}