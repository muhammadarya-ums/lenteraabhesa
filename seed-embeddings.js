const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function generateEmbedding(text) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: { parts: [{ text }] },
        outputDimensionality: 768
      })
    });

    if (!response.ok) {
      const err = await response.json();
      console.error("API Google Error:", JSON.stringify(err, null, 2));
      return null;
    }

    const data = await response.json();
    return data.embedding.values;
  } catch (e) {
    console.error("Fetch error:", e);
    return null;
  }
}

async function processKamus() {
  console.log("\n=== Mengecek data di tabel 'kamus' ===");
  const { data: kamus, error } = await supabase.from('kamus').select('*').is('embedding', null);
  
  if (error) {
    console.error("Gagal ambil data Kamus:", error);
    return;
  }

  if (!kamus || kamus.length === 0) {
    console.log("Mantap! Semua data Kamus sudah di-embed.");
    return;
  }

  console.log(`Ditemukan ${kamus.length} baris Kamus untuk diproses.`);

  for (const row of kamus) {
    console.log(`Memproses Kamus ID: ${row.id} | Kata: ${row.arti_indonesia}`);

// Filter tanda strip agar tidak ikut terbaca
const alos = (row.kata_alos && row.kata_alos !== '-') ? `Alos: ${row.kata_alos}` : '';
const sedang = (row.kata_sedang && row.kata_sedang !== '-') ? `Sedang: ${row.kata_sedang}` : '';
const kasar = (row.kata_kasar && row.kata_kasar !== '-') ? `Kasar: ${row.kata_kasar}` : '';

// Gabungkan tingkatan bahasa yang ada isinya
const kumpulanKata = [alos, sedang, kasar].filter(Boolean).join(', ');

const textToEmbed = `Kosakata Bawean - ${kumpulanKata}. Arti dalam bahasa Indonesia: ${row.arti_indonesia || 'Tidak ada arti'}`;
const embedding = await generateEmbedding(textToEmbed);
    
    if (embedding) {
      const { error: updateError } = await supabase.from('kamus').update({ embedding }).eq('id', row.id);
      if (updateError) {
        console.error(`Gagal update Kamus ID ${row.id}:`, updateError);
      } else {
        console.log(`Berhasil update Kamus ID ${row.id}`);
      }
    }

    await delay(500); 
  }
}

async function processSejarah() {
  console.log("\n=== Mengecek data di tabel 'sejarah' ===");
  const { data: sejarah, error } = await supabase.from('sejarah').select('*').is('embedding', null);
  
  if (error) {
    console.error("Gagal ambil data Sejarah:", error);
    return;
  }

  if (!sejarah || sejarah.length === 0) {
    console.log("Mantap! Semua data Sejarah sudah di-embed.");
    return;
  }

  console.log(`Ditemukan ${sejarah.length} baris Sejarah untuk diproses.`);

  for (const row of sejarah) {
    console.log(`Memproses Sejarah ID: ${row.id} | Judul: ${row.judul}`);

    const textToEmbed = `Judul Sejarah: ${row.judul || ""}. Kategori: ${row.kategori || ""}. Isi Konten: ${row.konten || ""}`;
    const embedding = await generateEmbedding(textToEmbed);

    if (embedding) {
      const { error: updateError } = await supabase.from('sejarah').update({ embedding }).eq('id', row.id);
      if (updateError) {
        console.error(`Gagal update Sejarah ID ${row.id}:`, updateError);
      } else {
        console.log(`Berhasil update Sejarah ID ${row.id}`);
      }
    }

    await delay(500);
  }
}

async function run() {
  console.log("Memulai proses Seeding Embedding untuk Lentera Abhesa...");
  
  await processKamus();
  await processSejarah();
  
  console.log("\nSemua proses selesai! AI siap jadi Pemandu Jejak.");
}

run();