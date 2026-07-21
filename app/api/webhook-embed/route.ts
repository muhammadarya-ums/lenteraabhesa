import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Pakai Service Role Key biar bisa update data (bypass RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Payload dari webhook Supabase biasanya berisi 'table', 'type' (INSERT), dan 'record' (isi data barunya)
    const { table, record } = body;

    // Kalau nggak ada ID, berhenti
    if (!record || !record.id) {
      return NextResponse.json({ error: 'Data tidak valid' }, { status: 400 });
    }

    let textToEmbed = '';

    // 1. Siapkan teks sesuai tabel yang lagi di-insert
    if (table === 'kamus') {
      const alos = (record.kata_alos && record.kata_alos !== '-') ? `Alos: ${record.kata_alos}` : '';
      const sedang = (record.kata_sedang && record.kata_sedang !== '-') ? `Sedang: ${record.kata_sedang}` : '';
      const kasar = (record.kata_kasar && record.kata_kasar !== '-') ? `Kasar: ${record.kata_kasar}` : '';
      const kumpulanKata = [alos, sedang, kasar].filter(Boolean).join(', ');
      
      textToEmbed = `Kosakata Bawean - ${kumpulanKata}. Arti dalam bahasa Indonesia: ${record.arti_indonesia || 'Tidak ada arti'}`;
    
    } else if (table === 'sejarah') {
      textToEmbed = `Judul Sejarah: ${record.judul || ""}. Kategori: ${record.kategori || ""}. Isi Konten: ${record.konten || ""}`;
    
    } else {
      return NextResponse.json({ message: 'Tabel tidak di-support' }, { status: 200 });
    }

    // 2. Tembak ke Google Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        content: { parts: [{ text: textToEmbed }] },
        outputDimensionality: 768
      })
    });

    if (!response.ok) {
      throw new Error('Gagal nge-hit Gemini API');
    }

    const data = await response.json();
    const embedding = data.embedding?.values;

    // 3. Update kembali baris data di Supabase dengan hasil embedding-nya
    if (embedding) {
      const { error } = await supabase
        .from(table)
        .update({ embedding })
        .eq('id', record.id);
        
      if (error) throw error;
    }

    return NextResponse.json({ success: true, message: `Berhasil embed tabel ${table}` });
    
  } catch (error: any) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}