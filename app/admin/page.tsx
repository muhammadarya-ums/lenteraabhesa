'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { 
  LogOut, Activity, BookOpen, FileText, ShoppingBag, Users, Gamepad2,
  Loader2, UserCircle, Plus, Trash2, Volume2, Edit3, Search, X, Menu,
  Save
} from 'lucide-react'
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'

// ==========================================
// INTERFACES
// ==========================================
interface KamusItem {
  id: string
  kata_alos: string | null
  kata_sedang: string | null 
  kata_kasar: string | null
  arti_indonesia: string
  
  contoh_kalimat_alos: string | null
  arti_contoh_alos: string | null
  pelafalan_kalimat_alos: string | null
  
  contoh_kalimat_sedang: string | null
  arti_contoh_sedang: string | null
  pelafalan_kalimat_sedang: string | null
  
  contoh_kalimat_kasar: string | null
  arti_contoh_kasar: string | null
  pelafalan_kalimat_kasar: string | null
  
  pelafalan_alos: string | null
  pelafalan_sedang: string | null
  pelafalan_kasar: string | null
}

interface SejarahItem {
  id: string; judul: string; slug: string; konten: string;
  gambar_url: string | null; penulis: string; kategori: string 
}

interface TebakKataItem {
  id: string; kata_soal: string; jawaban_benar: string;
  pengecoh_1: string; pengecoh_2: string; pengecoh_3: string;
  clue_kalimat: string; arti_clue: string;
}

interface SusunKataItem {
  id: string; clue_indonesia: string; kalimat_benar: string;
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function AdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [adminEmail, setAdminEmail] = useState('')
  const [activeMenu, setActiveMenu] = useState('dashboard')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // DATA STATES
  const [kamusList, setKamusList] = useState<KamusItem[]>([])
  const [sejarahList, setSejarahList] = useState<SejarahItem[]>([])
  const [tkList, setTkList] = useState<TebakKataItem[]>([])
  const [skList, setSkList] = useState<SusunKataItem[]>([])
  
  // ANALYTICS STATES
  const [analyticsPeriod, setAnalyticsPeriod] = useState<'jam' | 'hari' | 'minggu' | 'bulan'>('hari')
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [totalPengunjung, setTotalPengunjung] = useState<number>(0)
  const [totalGame, setTotalGame] = useState<number>(0)
  const [chartData, setChartData] = useState<any[]>([])
  const [analyticsGame, setAnalyticsGame] = useState({
    tebakGambarCount: 0, tebakKataCount: 0, susunKataCount: 0, totalSesi: 0
  })

  // EDITING IDs
  const [editingKamusId, setEditingKamusId] = useState<string | null>(null)
  const [editingSejarahId, setEditingSejarahId] = useState<string | null>(null)
  const [editingTkId, setEditingTkId] = useState<string | null>(null)
  const [editingSkId, setEditingSkId] = useState<string | null>(null)

  // KAMUS FORM STATES
  const [artiIndo, setArtiIndo] = useState('')
  // Halus
  const [kataAlos, setKataAlos] = useState(''); const [contohAlos, setContohAlos] = useState(''); const [artiContohAlos, setArtiContohAlos] = useState('');
  const [audioAlos, setAudioAlos] = useState<File | null>(null); const [audioContohAlos, setAudioContohAlos] = useState<File | null>(null);
  // Sedang
  const [kataSedang, setKataSedang] = useState(''); const [contohSedang, setContohSedang] = useState(''); const [artiContohSedang, setArtiContohSedang] = useState('');
  const [audioSedang, setAudioSedang] = useState<File | null>(null); const [audioContohSedang, setAudioContohSedang] = useState<File | null>(null);
  // Kasar
  const [kataKasar, setKataKasar] = useState(''); const [contohKasar, setContohKasar] = useState(''); const [artiContohKasar, setArtiContohKasar] = useState('');
  const [audioKasar, setAudioKasar] = useState<File | null>(null); const [audioContohKasar, setAudioContohKasar] = useState<File | null>(null);

  // SEJARAH FORM STATES
  const [kategoriArtikel, setKategoriArtikel] = useState('')
  const [judulArtikel, setJudulArtikel] = useState(''); const [kontenArtikel, setKontenArtikel] = useState('');
  const [penulisArtikel, setPenulisArtikel] = useState(''); const [coverFile, setCoverFile] = useState<File | null>(null);

  // GAME FORM STATES
  const [activeGameTab, setActiveGameTab] = useState<'tebak_kata' | 'susun_kata'>('tebak_kata')
  const [tkForm, setTkForm] = useState({ kata_soal: '', jawaban_benar: '', pengecoh_1: '', pengecoh_2: '', pengecoh_3: '', clue_kalimat: '', arti_clue: '' })
  const [skForm, setSkForm] = useState({ clue_indonesia: '', kalimat_benar: '' })

  // ==========================================
  // FETCHERS
  // ==========================================
  const fetchKamus = async () => {
    const { data } = await supabase.from('kamus').select('*').order('created_at', { ascending: false })
    if (data) setKamusList(data as KamusItem[])
  }
  const fetchSejarah = async () => {
    const { data } = await supabase.from('sejarah').select('*').order('created_at', { ascending: false })
    if (data) setSejarahList(data as SejarahItem[])
  }
  const fetchGames = async () => {
    const { data: tk } = await supabase.from('soal_tebak_kata').select('*').order('created_at', { ascending: false })
    const { data: sk } = await supabase.from('soal_susun_kata').select('*').order('created_at', { ascending: false })
    if (tk) setTkList(tk as TebakKataItem[]); if (sk) setSkList(sk as SusunKataItem[]);
  }

  useEffect(() => {
    const init = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) return router.push('/admin/login')
        setAdminEmail(session.user.email || 'Admin Utama')

        await Promise.all([fetchKamus(), fetchSejarah(), fetchGames()])
        
        const { count: countPengunjung } = await supabase.from('pengunjung').select('*', { count: 'exact', head: true })
        setTotalPengunjung(countPengunjung || 0)

        const { data: gameStats } = await supabase.from('permainan').select('jenis_game')
        if (gameStats) {
          setAnalyticsGame({
            tebakGambarCount: gameStats.filter(g => g.jenis_game?.toLowerCase().includes('gambar')).length,
            tebakKataCount: gameStats.filter(g => g.jenis_game?.toLowerCase().includes('tebak_kata') || g.jenis_game?.toLowerCase().includes('tebak kata')).length,
            susunKataCount: gameStats.filter(g => g.jenis_game?.toLowerCase().includes('susun')).length,
            totalSesi: gameStats.length
          })
          setTotalGame(gameStats.length)
        }
      } catch (err) { console.error(err) } finally { setLoading(false) }
    }
    init()
  }, [router])

  useEffect(() => {
    // Generate Dashboard Chart logic (unchanged)
    const generateChartData = async () => {
      try {
        let startIso: string; let endIso: string;
        if (analyticsPeriod === 'bulan') {
          startIso = new Date(selectedYear, 0, 1).toISOString()
          endIso = new Date(selectedYear, 11, 31, 23, 59, 59).toISOString()
        } else {
          startIso = new Date(selectedYear, selectedMonth, 1).toISOString()
          endIso = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59).toISOString()
        }

        const [resPengunjung, resGame, resKamus] = await Promise.all([
          supabase.from('pengunjung').select('created_at').gte('created_at', startIso).lte('created_at', endIso),
          supabase.from('permainan').select('created_at').gte('created_at', startIso).lte('created_at', endIso),
          supabase.from('kamus').select('created_at').gte('created_at', startIso).lte('created_at', endIso)
        ])

        let labels: string[] = []
        if (analyticsPeriod === 'hari') labels = Array.from({length: new Date(selectedYear, selectedMonth + 1, 0).getDate()}, (_, i) => `${i + 1}`)
        else if (analyticsPeriod === 'bulan') labels = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des']
        else if (analyticsPeriod === 'minggu') labels = ['M1', 'M2', 'M3', 'M4', 'M5']
        else if (analyticsPeriod === 'jam') labels = Array.from({length: 24}, (_, i) => `${i}:00`)

        let template = labels.map(label => ({ name: label, Pengunjung: 0, Kamus: 0, Game: 0 }))
        const distributeData = (items: any[], keyName: 'Pengunjung' | 'Kamus' | 'Game') => {
          items.forEach(item => {
            if(!item.created_at) return;
            const d = new Date(item.created_at)
            let matchIndex = 0
            if (analyticsPeriod === 'jam') matchIndex = d.getHours()
            else if (analyticsPeriod === 'hari') matchIndex = d.getDate() - 1 
            else if (analyticsPeriod === 'minggu') matchIndex = Math.min(Math.floor((d.getDate() - 1) / 7), 4)
            else if (analyticsPeriod === 'bulan') matchIndex = d.getMonth()
            if (template[matchIndex]) template[matchIndex][keyName] += 1
          })
        }

        distributeData(resPengunjung.data || [], 'Pengunjung')
        distributeData(resGame.data || [], 'Game')
        distributeData(resKamus.data || [], 'Kamus')
        setChartData(template)
      } catch (error) {}
    }
    generateChartData()
  }, [analyticsPeriod, selectedMonth, selectedYear])

  // ==========================================
  // HELPERS
  // ==========================================
  const uploadFile = async (file: File | null, bucket: string) => {
    if (!file) return null;
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${file.name.split('.').pop()}`
    const { error } = await supabase.storage.from(bucket).upload(fileName, file)
    if (error) throw error
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName)
    return publicUrl
  }
  const clearFileInputs = () => {
    document.querySelectorAll('input[type="file"]').forEach((el: any) => el.value = '')
  }

  // ==========================================
  // HANDLERS: KAMUS
  // ==========================================
  const resetFormKamus = () => {
    setEditingKamusId(null); setArtiIndo('');
    setKataAlos(''); setContohAlos(''); setArtiContohAlos(''); setAudioAlos(null); setAudioContohAlos(null);
    setKataSedang(''); setContohSedang(''); setArtiContohSedang(''); setAudioSedang(null); setAudioContohSedang(null);
    setKataKasar(''); setContohKasar(''); setArtiContohKasar(''); setAudioKasar(null); setAudioContohKasar(null);
    clearFileInputs();
  }

  const handleEditClickKamus = (item: KamusItem) => {
    setEditingKamusId(item.id); setArtiIndo(item.arti_indonesia || '');
    setKataAlos(item.kata_alos || ''); setContohAlos(item.contoh_kalimat_alos || ''); setArtiContohAlos(item.arti_contoh_alos || '');
    setKataSedang(item.kata_sedang || ''); setContohSedang(item.contoh_kalimat_sedang || ''); setArtiContohSedang(item.arti_contoh_sedang || '');
    setKataKasar(item.kata_kasar || ''); setContohKasar(item.contoh_kalimat_kasar || ''); setArtiContohKasar(item.arti_contoh_kasar || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleSubmitKamus = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!artiIndo || (!kataAlos && !kataSedang && !kataKasar)) return alert('Minimal isi 1 jenis kata Bawean dan Arti Indonesia!')
    setSubmitLoading(true)
    try {
      // Uploading all possible 6 audio files concurrently
      const [uAlos, uSedang, uKasar, uCAlos, uCSedang, uCKasar] = await Promise.all([
        uploadFile(audioAlos, 'audio-pelafalan'), uploadFile(audioSedang, 'audio-pelafalan'), uploadFile(audioKasar, 'audio-pelafalan'),
        uploadFile(audioContohAlos, 'audio-pelafalan'), uploadFile(audioContohSedang, 'audio-pelafalan'), uploadFile(audioContohKasar, 'audio-pelafalan')
      ])
      
      const payload: any = { 
        arti_indonesia: artiIndo,
        kata_alos: kataAlos || null, contoh_kalimat_alos: contohAlos || null, arti_contoh_alos: artiContohAlos || null,
        kata_sedang: kataSedang || null, contoh_kalimat_sedang: contohSedang || null, arti_contoh_sedang: artiContohSedang || null,
        kata_kasar: kataKasar || null, contoh_kalimat_kasar: contohKasar || null, arti_contoh_kasar: artiContohKasar || null,
      }
      if (uAlos) payload.pelafalan_alos = uAlos; if (uSedang) payload.pelafalan_sedang = uSedang; if (uKasar) payload.pelafalan_kasar = uKasar;
      if (uCAlos) payload.pelafalan_kalimat_alos = uCAlos; if (uCSedang) payload.pelafalan_kalimat_sedang = uCSedang; if (uCKasar) payload.pelafalan_kalimat_kasar = uCKasar;

      if (editingKamusId) { await supabase.from('kamus').update(payload).eq('id', editingKamusId); alert('Kosakata diperbarui!'); } 
      else { await supabase.from('kamus').insert([payload]); alert('Kosakata ditambahkan!'); }
      resetFormKamus(); fetchKamus();
    } catch (err: any) { alert(`Error: ${err.message}`) } finally { setSubmitLoading(false) }
  }

  // ==========================================
  // HANDLERS: SEJARAH
  // ==========================================
  const resetFormSejarah = () => {
    setEditingSejarahId(null); setKategoriArtikel(''); setJudulArtikel('');
    setPenulisArtikel(''); setKontenArtikel(''); setCoverFile(null); clearFileInputs();
  }
  const handleEditClickSejarah = (item: SejarahItem) => {
    setEditingSejarahId(item.id); setKategoriArtikel(item.kategori || ''); setJudulArtikel(item.judul);
    setPenulisArtikel(item.penulis || ''); setKontenArtikel(item.konten); window.scrollTo({ top: 0, behavior: 'smooth' });
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
      if (editingSejarahId) { await supabase.from('sejarah').update(payload).eq('id', editingSejarahId); alert('Artikel diperbarui!'); } 
      else { await supabase.from('sejarah').insert([payload]); alert('Artikel diterbitkan!'); }
      resetFormSejarah(); fetchSejarah();
    } catch (err: any) { alert(`Error: ${err.message}`) } finally { setSubmitLoading(false) }
  }

  // ==========================================
  // HANDLERS: GAME SOAL
  // ==========================================
  const resetFormTk = () => { setEditingTkId(null); setTkForm({ kata_soal: '', jawaban_benar: '', pengecoh_1: '', pengecoh_2: '', pengecoh_3: '', clue_kalimat: '', arti_clue: '' }) }
  const resetFormSk = () => { setEditingSkId(null); setSkForm({ clue_indonesia: '', kalimat_benar: '' }) }
  
  const handleEditTk = (item: TebakKataItem) => { setEditingTkId(item.id); setTkForm(item); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  const handleEditSk = (item: SusunKataItem) => { setEditingSkId(item.id); setSkForm(item); window.scrollTo({ top: 0, behavior: 'smooth' }); }

  const handleSubmitTk = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitLoading(true);
    try {
      if (editingTkId) await supabase.from('soal_tebak_kata').update(tkForm).eq('id', editingTkId)
      else await supabase.from('soal_tebak_kata').insert([tkForm])
      resetFormTk(); fetchGames(); alert('Soal Tebak Kata Berhasil Disimpan!');
    } catch (err: any) { alert(err.message) } finally { setSubmitLoading(false) }
  }

  const handleSubmitSk = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitLoading(true);
    try {
      if (editingSkId) await supabase.from('soal_susun_kata').update(skForm).eq('id', editingSkId)
      else await supabase.from('soal_susun_kata').insert([skForm])
      resetFormSk(); fetchGames(); alert('Soal Susun Kata Berhasil Disimpan!');
    } catch (err: any) { alert(err.message) } finally { setSubmitLoading(false) }
  }

  const handleDelete = async (table: string, id: string) => {
    if (confirm('Yakin ingin menghapus permanen?')) {
      await supabase.from(table).delete().eq('id', id)
      if (table === 'kamus') fetchKamus()
      else if (table === 'sejarah') fetchSejarah()
      else fetchGames()
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
      
      {/* SIDEBAR & MOBILE NAV */}
      <div className="md:hidden w-full bg-white border-b border-gray-100 p-4 flex justify-between items-center sticky top-0 z-50">
        <h2 className="text-[18px] font-black text-[#005C43]">LENTERA ADMIN</h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-[#005C43] hover:bg-gray-50 rounded-lg">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <aside className={`fixed md:sticky top-0 left-0 h-screen w-[280px] bg-white border-r border-gray-100 p-6 shadow-xl md:shadow-none z-40 transition-transform duration-300 ease-in-out flex flex-col justify-between overflow-y-auto custom-scrollbar ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col gap-8 md:gap-10">
          <h2 className="hidden md:block text-[20px] font-black text-[#005C43] mb-2">LENTERA ADMIN</h2>
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
              { id: 'games', icon: Gamepad2, label: 'Kelola Soal Game' },
              { id: 'pesanan', icon: ShoppingBag, label: 'Pesanan Store' },
            ].map(menu => (
              <button key={menu.id} onClick={() => { setActiveMenu(menu.id); setIsMobileMenuOpen(false) }} 
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
      {isMobileMenuOpen && <div className="fixed inset-0 bg-black/20 z-30 md:hidden" onClick={() => setIsMobileMenuOpen(false)}/>}

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-[calc(100vh-64px)] md:h-screen overflow-y-auto w-full">
        <header className="bg-white border-b border-gray-100 px-6 md:px-10 py-5 md:py-6 sticky top-0 z-10 hidden md:block">
          <h1 className="text-2xl font-bold text-gray-900 capitalize">
            {activeMenu === 'dashboard' ? 'Telemetry & Analytics' : activeMenu === 'kamus' ? 'Database Kosakata & Konteks' : activeMenu === 'games' ? 'Manajemen Soal Permainan' : activeMenu === 'sejarah' ? 'Manajemen Konten Sejarah' : 'Modul E-Commerce'}
          </h1>
        </header>

        <div className="p-4 md:p-10 pb-20 w-full overflow-x-hidden">
          
          {/* TAB 1: DASHBOARD (Kode Analitik Tetap Sama Seperti Sebelumnya) */}
          {activeMenu === 'dashboard' && (
             <div className="space-y-6">
             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
               {[
                 { label: 'Total Kosakata', value: kamusList.length, icon: BookOpen, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                 { label: 'Artikel Terbit', value: sejarahList.length, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
                 { label: 'Total Pengunjung', value: totalPengunjung, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
                 { label: 'Total Game Dimainkan', value: totalGame, icon: Gamepad2, color: 'text-orange-600', bg: 'bg-orange-50' },
               ].map((stat, i) => (
                 <div key={i} className="bg-white p-5 md:p-6 border border-gray-100 rounded-[20px] shadow-sm flex items-center gap-4">
                   <div className={`w-12 h-12 md:w-14 md:h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shrink-0`}><stat.icon className="w-6 h-6 md:w-7 md:h-7" /></div>
                   <div><p className="text-[11px] md:text-[13px] font-bold text-gray-400 uppercase tracking-wide">{stat.label}</p><p className="text-[24px] md:text-[28px] font-black text-gray-900 leading-none mt-1">{stat.value}</p></div>
                 </div>
               ))}
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                 <div className="bg-white p-5 border border-gray-100 rounded-[20px] shadow-sm flex items-center gap-4"><div className="w-12 h-12 bg-[#005C43]/10 text-[#005C43] rounded-xl flex items-center justify-center text-xl shrink-0">🎮</div><div><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Total Sesi Game</p><h3 className="text-[20px] font-black mt-1">{analyticsGame.totalSesi} Sesi</h3></div></div>
                 <div className="bg-white p-5 border border-gray-100 rounded-[20px] shadow-sm flex items-center gap-4"><div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center text-xl shrink-0">🖼️</div><div><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Tebak Gambar</p><h3 className="text-[20px] font-black mt-1">{analyticsGame.tebakGambarCount} Kali</h3></div></div>
                 <div className="bg-white p-5 border border-gray-100 rounded-[20px] shadow-sm flex items-center gap-4"><div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl shrink-0">🧩</div><div><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Tebak Kata</p><h3 className="text-[20px] font-black mt-1">{analyticsGame.tebakKataCount} Kali</h3></div></div>
                 <div className="bg-white p-5 border border-gray-100 rounded-[20px] shadow-sm flex items-center gap-4"><div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center text-xl shrink-0">✨</div><div><p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Susun Kata</p><h3 className="text-[20px] font-black mt-1">{analyticsGame.susunKataCount} Kali</h3></div></div>
             </div>
             <div className="bg-white border border-gray-100 rounded-[20px] shadow-sm p-4 md:p-8">
               <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
                 <div><h2 className="text-lg md:text-xl font-bold text-gray-900">Traffic Trend</h2></div>
                 <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                   <div className="flex bg-white p-1 rounded-lg border shadow-sm justify-between">
                     <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="px-3 py-1.5 text-sm font-bold text-[#005C43] bg-transparent focus:outline-none w-full">{['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'].map((m, i) => <option key={m} value={i}>{m}</option>)}</select>
                     <div className="w-px bg-gray-200 mx-1"></div>
                     <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="px-3 py-1.5 text-sm font-bold text-[#005C43] bg-transparent focus:outline-none">{[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}</select>
                   </div>
                   <div className="flex bg-gray-50 p-1 rounded-lg border overflow-x-auto custom-scrollbar">
                     {['jam', 'hari', 'minggu', 'bulan'].map(period => <button key={period} onClick={() => setAnalyticsPeriod(period as any)} className={`px-4 py-2 text-sm font-bold rounded-md capitalize ${analyticsPeriod === period ? 'bg-white text-[#005C43] shadow-sm' : 'text-gray-500'}`}>{period}</button>)}
                   </div>
                 </div>
               </div>
               <div className="h-[300px] w-full"><ResponsiveContainer width="100%" height="100%"><LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}><CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} dy={10} /><YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10}} dx={10} allowDecimals={false} /><Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} /><Legend iconType="circle" wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} /><Line type="monotone" dataKey="Pengunjung" stroke="#8B5CF6" strokeWidth={3} dot={false} /><Line type="monotone" dataKey="Kamus" stroke="#10B981" strokeWidth={3} dot={false} /><Line type="monotone" dataKey="Game" stroke="#F97316" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></div>
             </div>
           </div>
          )}

          {/* TAB 2: KELOLA KAMUS ADVANCED */}
          {activeMenu === 'kamus' && (
            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_1fr] gap-6 items-start">
              <form onSubmit={handleSubmitKamus} className="bg-white border border-gray-100 p-6 rounded-[24px] shadow-sm">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                    {editingKamusId ? <><Edit3 className="w-5 h-5 text-blue-600" /> Edit Kosakata</> : <><Plus className="w-5 h-5 text-emerald-600" /> Tambah Baru</>}
                  </h2>
                  {editingKamusId && <button type="button" onClick={resetFormKamus} className="text-xs font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full"><X className="w-3 h-3" /> Batal</button>}
                </div>
                
                <div className="space-y-6 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
                  
                  {/* GLOBAL ARTI */}
                  <div>
                    <label className="block text-xs font-black text-gray-900 uppercase mb-2">Arti Bahasa Indonesia *</label>
                    <input type="text" required value={artiIndo} onChange={e => setArtiIndo(e.target.value)} placeholder="Contoh: Makan" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#005C43] focus:bg-white font-bold" />
                  </div>

                  {/* HALUS TIER */}
                  <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50 space-y-4">
                    <h3 className="text-xs font-black text-emerald-700 uppercase flex items-center gap-2"><span className="w-2 h-2 bg-emerald-500 rounded-full"></span> Tingkatan Halus (Alos)</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-[10px] font-bold text-emerald-700 uppercase mb-1 block">Kata</label><input type="text" value={kataAlos} onChange={e => setKataAlos(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm focus:border-emerald-500 focus:outline-none" /></div>
                      <div><label className="text-[10px] font-bold text-emerald-700 uppercase mb-1 block">Audio Kata</label><input type="file" accept="audio/*" onChange={e => setAudioAlos(e.target.files?.[0] || null)} className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-emerald-100 file:text-emerald-700" /></div>
                    </div>
                    <div><label className="text-[10px] font-bold text-emerald-700 uppercase mb-1 block">Contoh Kalimat Penggunaan</label><textarea value={contohAlos} onChange={e => setContohAlos(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm h-12 focus:border-emerald-500 focus:outline-none resize-none" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-[10px] font-bold text-emerald-700 uppercase mb-1 block">Arti Kalimat</label><input type="text" value={artiContohAlos} onChange={e => setArtiContohAlos(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm focus:border-emerald-500 focus:outline-none" /></div>
                      <div><label className="text-[10px] font-bold text-emerald-700 uppercase mb-1 block">Audio Kalimat</label><input type="file" accept="audio/*" onChange={e => setAudioContohAlos(e.target.files?.[0] || null)} className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-emerald-100 file:text-emerald-700" /></div>
                    </div>
                  </div>

                  {/* SEDANG TIER */}
                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 space-y-4">
                    <h3 className="text-xs font-black text-blue-700 uppercase flex items-center gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full"></span> Tingkatan Sedang</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-[10px] font-bold text-blue-700 uppercase mb-1 block">Kata</label><input type="text" value={kataSedang} onChange={e => setKataSedang(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm focus:border-blue-500 focus:outline-none" /></div>
                      <div><label className="text-[10px] font-bold text-blue-700 uppercase mb-1 block">Audio Kata</label><input type="file" accept="audio/*" onChange={e => setAudioSedang(e.target.files?.[0] || null)} className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700" /></div>
                    </div>
                    <div><label className="text-[10px] font-bold text-blue-700 uppercase mb-1 block">Contoh Kalimat Penggunaan</label><textarea value={contohSedang} onChange={e => setContohSedang(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm h-12 focus:border-blue-500 focus:outline-none resize-none" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-[10px] font-bold text-blue-700 uppercase mb-1 block">Arti Kalimat</label><input type="text" value={artiContohSedang} onChange={e => setArtiContohSedang(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm focus:border-blue-500 focus:outline-none" /></div>
                      <div><label className="text-[10px] font-bold text-blue-700 uppercase mb-1 block">Audio Kalimat</label><input type="file" accept="audio/*" onChange={e => setAudioContohSedang(e.target.files?.[0] || null)} className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-700" /></div>
                    </div>
                  </div>

                  {/* KASAR TIER */}
                  <div className="bg-red-50/50 p-4 rounded-xl border border-red-100/50 space-y-4">
                    <h3 className="text-xs font-black text-red-700 uppercase flex items-center gap-2"><span className="w-2 h-2 bg-red-500 rounded-full"></span> Tingkatan Kasar</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-[10px] font-bold text-red-700 uppercase mb-1 block">Kata</label><input type="text" value={kataKasar} onChange={e => setKataKasar(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm focus:border-red-500 focus:outline-none" /></div>
                      <div><label className="text-[10px] font-bold text-red-700 uppercase mb-1 block">Audio Kata</label><input type="file" accept="audio/*" onChange={e => setAudioKasar(e.target.files?.[0] || null)} className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-red-100 file:text-red-700" /></div>
                    </div>
                    <div><label className="text-[10px] font-bold text-red-700 uppercase mb-1 block">Contoh Kalimat Penggunaan</label><textarea value={contohKasar} onChange={e => setContohKasar(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm h-12 focus:border-red-500 focus:outline-none resize-none" /></div>
                    <div className="grid grid-cols-2 gap-3">
                      <div><label className="text-[10px] font-bold text-red-700 uppercase mb-1 block">Arti Kalimat</label><input type="text" value={artiContohKasar} onChange={e => setArtiContohKasar(e.target.value)} className="w-full bg-white border border-gray-200 rounded-lg p-2 text-sm focus:border-red-500 focus:outline-none" /></div>
                      <div><label className="text-[10px] font-bold text-red-700 uppercase mb-1 block">Audio Kalimat</label><input type="file" accept="audio/*" onChange={e => setAudioContohKasar(e.target.files?.[0] || null)} className="w-full text-[10px] file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-red-100 file:text-red-700" /></div>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={submitLoading} className={`w-full mt-6 text-white py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:-translate-y-1 transition-all ${editingKamusId ? 'bg-blue-600 shadow-[0_4px_0_#1d4ed8]' : 'bg-[#005C43] shadow-[0_4px_0_#004733]'}`}>
                  {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4" /> {editingKamusId ? 'Simpan Perubahan' : 'Terbitkan Database Kosakata'}</>}
                </button>
              </form>

              <div className="bg-white border border-gray-100 rounded-[24px] shadow-sm p-6 flex flex-col w-full h-full max-h-[80vh]">
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                  <h2 className="text-lg font-black text-gray-900">Arsip Kosakata</h2>
                  <div className="relative w-1/2">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" placeholder="Cari..." className="pl-9 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:border-[#005C43]" />
                  </div>
                </div>
                
                <div className="overflow-y-auto w-full custom-scrollbar flex-1">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold bg-gray-50/50 text-xs uppercase">
                        <th className="p-4 w-[60%] rounded-tl-xl">Lema (Indonesia & Bawean)</th>
                        <th className="p-4 text-right rounded-tr-xl">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kamusList.map((item) => (
                        <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 group">
                          <td className="p-4">
                            <p className="font-black text-gray-900 text-base mb-1.5">{item.arti_indonesia}</p>
                            <div className="flex flex-col gap-1">
                              {item.kata_alos && <span className="font-bold text-emerald-700 text-xs"><span className="text-[9px] bg-emerald-100 text-emerald-800 px-1 rounded mr-2 uppercase">Alus</span>{item.kata_alos}</span>}
                              {item.kata_sedang && <span className="font-bold text-blue-700 text-xs"><span className="text-[9px] bg-blue-100 text-blue-800 px-1 rounded mr-2 uppercase">Sdg</span>{item.kata_sedang}</span>}
                              {item.kata_kasar && <span className="font-bold text-red-700 text-xs"><span className="text-[9px] bg-red-100 text-red-800 px-1 rounded mr-2 uppercase">Ksr</span>{item.kata_kasar}</span>}
                            </div>
                          </td>
                          <td className="p-4 text-right align-top pt-5">
                            <div className="flex justify-end gap-2 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEditClickKamus(item)} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                              <button onClick={() => handleDelete('kamus', item.id)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 className="w-4 h-4" /></button>
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

          {/* TAB 3: KELOLA SOAL GAME */}
          {activeMenu === 'games' && (
            <div className="space-y-6">
              {/* Tab Selector */}
              <div className="flex gap-4 border-b border-gray-200">
                <button onClick={() => setActiveGameTab('tebak_kata')} className={`py-3 px-6 font-bold text-sm border-b-2 transition-colors ${activeGameTab === 'tebak_kata' ? 'border-[#005C43] text-[#005C43]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>Soal Tebak Kata</button>
                <button onClick={() => setActiveGameTab('susun_kata')} className={`py-3 px-6 font-bold text-sm border-b-2 transition-colors ${activeGameTab === 'susun_kata' ? 'border-[#005C43] text-[#005C43]' : 'border-transparent text-gray-500 hover:text-gray-900'}`}>Soal Susun Kata</button>
              </div>

              {activeGameTab === 'tebak_kata' && (
                <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-6 items-start">
                  <form onSubmit={handleSubmitTk} className="bg-white border border-gray-100 p-6 rounded-[24px] shadow-sm space-y-4">
                    <h2 className="text-lg font-black text-gray-900 mb-4">{editingTkId ? 'Edit Soal Tebak Kata' : 'Tambah Soal Tebak Kata'}</h2>
                    <div><label className="text-xs font-bold text-gray-500 uppercase">Kata Bawean (Soal) *</label><input type="text" required value={tkForm.kata_soal} onChange={e => setTkForm({...tkForm, kata_soal: e.target.value})} className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-[#005C43] focus:outline-none" /></div>
                    <div><label className="text-xs font-bold text-emerald-600 uppercase">Jawaban Benar (Arti) *</label><input type="text" required value={tkForm.jawaban_benar} onChange={e => setTkForm({...tkForm, jawaban_benar: e.target.value})} className="w-full mt-1 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm focus:border-emerald-500 focus:outline-none" /></div>
                    <div className="grid grid-cols-3 gap-3">
                      <div><label className="text-xs font-bold text-red-500 uppercase">Pengecoh 1 *</label><input type="text" required value={tkForm.pengecoh_1} onChange={e => setTkForm({...tkForm, pengecoh_1: e.target.value})} className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-red-500 focus:outline-none" /></div>
                      <div><label className="text-xs font-bold text-red-500 uppercase">Pengecoh 2 *</label><input type="text" required value={tkForm.pengecoh_2} onChange={e => setTkForm({...tkForm, pengecoh_2: e.target.value})} className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-red-500 focus:outline-none" /></div>
                      <div><label className="text-xs font-bold text-red-500 uppercase">Pengecoh 3 *</label><input type="text" required value={tkForm.pengecoh_3} onChange={e => setTkForm({...tkForm, pengecoh_3: e.target.value})} className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-red-500 focus:outline-none" /></div>
                    </div>
                    <div><label className="text-xs font-bold text-amber-600 uppercase">Clue Kalimat (Opsional)</label><input type="text" value={tkForm.clue_kalimat} onChange={e => setTkForm({...tkForm, clue_kalimat: e.target.value})} className="w-full mt-1 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm focus:border-amber-500 focus:outline-none" /></div>
                    <div><label className="text-xs font-bold text-amber-600 uppercase">Arti Clue (Opsional)</label><input type="text" value={tkForm.arti_clue} onChange={e => setTkForm({...tkForm, arti_clue: e.target.value})} className="w-full mt-1 bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm focus:border-amber-500 focus:outline-none" /></div>
                    <div className="flex gap-3 mt-6">
                      {editingTkId && <button type="button" onClick={resetFormTk} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200">Batal</button>}
                      <button type="submit" disabled={submitLoading} className="flex-[2] bg-[#005C43] text-white py-3 rounded-xl font-bold shadow-[0_4px_0_#004733] hover:-translate-y-1 transition-transform">{submitLoading ? 'Menyimpan...' : 'Simpan Soal'}</button>
                    </div>
                  </form>

                  <div className="bg-white border border-gray-100 rounded-[24px] shadow-sm p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <h2 className="text-lg font-black text-gray-900 mb-4">Bank Soal Tebak Kata</h2>
                    <div className="space-y-3">
                      {tkList.map(item => (
                        <div key={item.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex justify-between items-center group">
                          <div><p className="font-bold text-gray-900">"{item.kata_soal}"</p><p className="text-xs text-emerald-600 font-bold mt-1">Jawaban: {item.jawaban_benar}</p></div>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEditTk(item)} className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                            <button onClick={() => handleDelete('soal_tebak_kata', item.id)} className="p-2 bg-red-100 text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeGameTab === 'susun_kata' && (
                 <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-6 items-start">
                 <form onSubmit={handleSubmitSk} className="bg-white border border-gray-100 p-6 rounded-[24px] shadow-sm space-y-4">
                   <h2 className="text-lg font-black text-gray-900 mb-4">{editingSkId ? 'Edit Soal Susun Kata' : 'Tambah Soal Susun Kata'}</h2>
                   <div><label className="text-xs font-bold text-gray-500 uppercase">Clue Bahasa Indonesia (Soal) *</label><textarea required value={skForm.clue_indonesia} onChange={e => setSkForm({...skForm, clue_indonesia: e.target.value})} className="w-full mt-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:border-[#005C43] focus:outline-none h-20" /></div>
                   <div><label className="text-xs font-bold text-emerald-600 uppercase">Target Kalimat Bawean (Benar) *</label><textarea required value={skForm.kalimat_benar} onChange={e => setSkForm({...skForm, kalimat_benar: e.target.value})} className="w-full mt-1 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-sm font-bold focus:border-emerald-500 focus:outline-none h-20" placeholder="Contoh: Eson terro ka Bawean" /></div>
                   <div className="flex gap-3 mt-6">
                     {editingSkId && <button type="button" onClick={resetFormSk} className="flex-1 py-3 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200">Batal</button>}
                     <button type="submit" disabled={submitLoading} className="flex-[2] bg-[#005C43] text-white py-3 rounded-xl font-bold shadow-[0_4px_0_#004733] hover:-translate-y-1 transition-transform">{submitLoading ? 'Menyimpan...' : 'Simpan Soal'}</button>
                   </div>
                 </form>

                 <div className="bg-white border border-gray-100 rounded-[24px] shadow-sm p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                   <h2 className="text-lg font-black text-gray-900 mb-4">Bank Soal Susun Kata</h2>
                   <div className="space-y-3">
                     {skList.map(item => (
                       <div key={item.id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 flex justify-between items-start group">
                         <div><p className="font-bold text-gray-500 text-xs mb-1">Clue: {item.clue_indonesia}</p><p className="text-sm font-black text-gray-900">{item.kalimat_benar}</p></div>
                         <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => handleEditSk(item)} className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                           <button onClick={() => handleDelete('soal_susun_kata', item.id)} className="p-2 bg-red-100 text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
              )}
            </div>
          )}

          {/* TAB 4 & 5 (Sejarah & Pesanan Tetap Seperti Sebelumnya) */}
          {activeMenu === 'sejarah' && (
             <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6 md:gap-8 items-start">
             <form onSubmit={handleSubmitSejarah} className="bg-white border border-gray-100 p-5 md:p-6 rounded-[20px] shadow-sm sticky top-0 md:top-[100px] z-10 space-y-4">
                <div className="flex justify-between items-center mb-2 border-b pb-3"><h2 className="text-base md:text-lg font-bold text-gray-900 flex items-center gap-2">{editingSejarahId ? <><Edit3 className="w-4 h-4 md:w-5 md:h-5 text-blue-600" /> Edit Artikel</> : <><Plus className="w-4 h-4 md:w-5 md:h-5 text-[#005C43]" /> Tulis Baru</>}</h2>{editingSejarahId && (<button type="button" onClick={resetFormSejarah} className="text-[10px] md:text-xs font-bold text-gray-400 hover:text-gray-900 flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-full"><X className="w-3 h-3" /> Batal</button>)}</div>
               <div><label className="block text-[10px] md:text-[11px] font-bold text-gray-500 uppercase mb-1">Kategori Artikel *</label><input type="text" required value={kategoriArtikel} onChange={e => setKategoriArtikel(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 md:p-3 text-xs md:text-sm focus:outline-none focus:border-[#005C43] focus:bg-white" /></div>
               <div><label className="block text-[10px] md:text-[11px] font-bold text-gray-500 uppercase mb-1">Judul Artikel *</label><input type="text" required value={judulArtikel} onChange={e => setJudulArtikel(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 md:p-3 text-xs md:text-sm focus:outline-none focus:border-[#005C43] focus:bg-white" /></div>
               <div><label className="block text-[10px] md:text-[11px] font-bold text-gray-500 uppercase mb-1">Penulis *</label><input type="text" required value={penulisArtikel} onChange={e => setPenulisArtikel(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 md:p-3 text-xs md:text-sm focus:outline-none focus:border-[#005C43] focus:bg-white" /></div>
               <div><label className="block text-[10px] md:text-[11px] font-bold text-gray-500 uppercase mb-1">Konten Lengkap *</label><textarea required value={kontenArtikel} onChange={e => setKontenArtikel(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 md:p-3 text-xs md:text-sm h-32 md:h-48 focus:outline-none focus:border-[#005C43] focus:bg-white custom-scrollbar resize-none" /></div>
               <div><label className="block text-[10px] md:text-[11px] font-bold text-gray-500 uppercase mb-1">Upload Cover</label><input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="w-full text-[10px] md:text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-[#EBF2EF] file:text-[#005C43]" /></div>
               <button type="submit" disabled={submitLoading} className={`w-full mt-4 text-white py-3 md:py-3.5 rounded-xl font-bold text-[13px] md:text-[14px] flex items-center justify-center gap-2 hover:opacity-90 transition-all ${editingSejarahId ? 'bg-blue-600' : 'bg-[#005C43]'}`}>{submitLoading ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : editingSejarahId ? 'Simpan Perubahan' : 'Terbitkan Artikel'}</button>
             </form>
             <div className="bg-white border border-gray-100 rounded-[20px] shadow-sm p-4 md:p-6 space-y-4">
               <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 border-b pb-4">Arsip Konten Sejarah</h2>
               <div className="grid grid-cols-1 gap-4">
                 {sejarahList.map((artikel) => (
                   <div key={artikel.id} className="p-3 md:p-4 border border-gray-100 rounded-[16px] bg-[#FAFBFB] flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-gray-200 hover:shadow-sm transition-all group">
                     <div className="flex items-center gap-4 overflow-hidden w-full">
                       {artikel.gambar_url ? (<img src={artikel.gambar_url} alt={artikel.judul} className="w-16 h-16 rounded-xl object-cover shadow-sm shrink-0" />) : (<div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0"><FileText className="w-6 h-6 text-gray-300" /></div>)}
                       <div className="overflow-hidden">
                         <div className="flex items-center gap-2 mb-1"><span className="text-[9px] bg-[#EBF2EF] text-[#005C43] px-2 py-0.5 rounded font-bold uppercase">{artikel.kategori || 'Umum'}</span><span className="text-[10px] text-gray-400 font-medium">Oleh: {artikel.penulis}</span></div>
                         <h4 className="font-bold text-[14px] md:text-[16px] text-gray-900 truncate leading-snug">{artikel.judul}</h4>
                       </div>
                     </div>
                     <div className="flex sm:flex-col gap-2 shrink-0"><button onClick={() => handleEditClickSejarah(artikel)} className="p-2 bg-white border border-gray-200 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit3 className="w-3.5 h-3.5" /></button><button onClick={() => handleDelete('sejarah', artikel.id)} className="p-2 bg-white border border-gray-200 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button></div>
                   </div>
                 ))}
               </div>
             </div>
           </div>
          )}

          {activeMenu === 'pesanan' && (
            <div className="bg-white border border-gray-100 rounded-[20px] shadow-sm p-6 md:p-10 text-center flex flex-col items-center justify-center min-h-[300px]"><div className="w-16 h-16 bg-[#EBF2EF] rounded-full flex items-center justify-center mb-4"><ShoppingBag className="w-8 h-8 text-[#005C43]" /></div><h3 className="text-lg font-bold text-gray-900">Modul Pesanan / Commerce</h3><p className="text-gray-500 mt-2 max-w-md text-sm">Menunggu integrasi API Gateway dengan payment processor untuk mengelola pesanan *merchandise* secara real-time.</p></div>
          )}
        </div>
      </main>
    </div>
  )
}