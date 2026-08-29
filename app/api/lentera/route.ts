import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase Client dengan Service Role Key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_GENERATIVE_AI_API_KEY tidak ditemukan di environment variables.");
    }

    // 1. Tangkap dan validasi pesan dari frontend
    const body = await req.json();
    const userMessage = body.message;

    if (!userMessage || typeof userMessage !== 'string') {
      return NextResponse.json({ error: "Pesan tidak boleh kosong." }, { status: 400 });
    }

    // 2. Vector Embedding menggunakan model gemini-embedding-2 yang terkonfirmasi aktif
    const embedUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent";
    const embedRes = await fetch(embedUrl, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        model: "models/gemini-embedding-2",
        content: { parts: [{ text: userMessage }] },
        outputDimensionality: 768
      })
    });

    if (!embedRes.ok) {
      const errData = await embedRes.json().catch(() => ({}));
      console.error("Error Gemini Embedding:", errData);
      throw new Error(`Gagal membuat embedding: ${errData.error?.message || embedRes.statusText}`);
    }

    const embedData = await embedRes.json();
    const queryEmbedding = embedData.embedding?.values;

    if (!queryEmbedding) {
      throw new Error("Respon embedding dari Google tidak mengandung array vektor.");
    }

    // 3. Pencarian Vektor ke Supabase RPC (Kamus & Sejarah secara paralel)
    const [kamusResult, sejarahResult] = await Promise.all([
      supabase.rpc('match_kamus', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5, 
        match_count: 5 
      }),
      supabase.rpc('match_sejarah', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5, 
        match_count: 3
      })
    ]);

    if (kamusResult.error) throw new Error(`Supabase Kamus Error: ${kamusResult.error.message}`);
    if (sejarahResult.error) throw new Error(`Supabase Sejarah Error: ${sejarahResult.error.message}`);

    const matchedWords = kamusResult.data || [];
    const matchedHistory = sejarahResult.data || [];

    // 4. Susun Konteks RAG
    let contextText = "Berikut adalah data dari database Lentera Abhesa (Kamus & Sejarah) yang relevan:\n\n";
    
    // Inject Data Kamus
    contextText += "--- DATA KAMUS BAHASA ---\n";
    if (matchedWords.length > 0) {
      matchedWords.forEach((word: any) => {
        contextText += `- Bahasa Alus: ${word.kata_alos || '-'}, Sedang: ${word.kata_sedang || '-'}, Kasar: ${word.kata_kasar || '-'} | Arti Indonesia: ${word.arti_indonesia}\n`;
      });
    } else {
      contextText += "Tidak ada kosakata yang cocok.\n";
    }

    // Inject Data Sejarah
    contextText += "\n--- DATA SEJARAH & BUDAYA ---\n";
    if (matchedHistory.length > 0) {
      matchedHistory.forEach((hist: any) => {
        contextText += `- Judul: ${hist.judul}\n  Konten: ${hist.konten}\n\n`;
      });
    } else {
      contextText += "Tidak ada catatan sejarah yang cocok.\n";
    }

    // 5. System Prompt & Call Groq LLM
    const systemPrompt = `Kamu adalah Lentera, asisten AI yang ramah, pintar, dan ahli dalam bahasa SERTA sejarah/kebudayaan pulau Bawean.
Gunakan HANYA data KONTEKS di bawah ini untuk menjawab pertanyaan user secara akurat. 
Jika user bertanya tentang bahasa, gunakan bagian DATA KAMUS. Jika bertanya tentang budaya/sejarah, gunakan DATA SEJARAH.
Jika KONTEKS tidak memiliki jawaban yang tepat terkait Bawean, jawab sebisa kamu sesuai pengetahuan umum atau minta maaf dengan sopan karena datanya belum tersedia di Lentera Abhesa. Jangan mengarang arti kata atau sejarah fiktif.

KONTEKS:
${contextText}`;

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) throw new Error("GROQ_API_KEY tidak ditemukan di environment variables.");

    const chatRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "qwen/qwen3.8-27b", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ],
        temperature: 0.3
      })
    });

    if (!chatRes.ok) {
      const errorData = await chatRes.json().catch(() => ({}));
      console.error("Error dari Groq API:", errorData);
      throw new Error(`Groq Error: ${errorData.error?.message || chatRes.statusText}`);
    }

    const chatData = await chatRes.json();
    const aiResponse = chatData.choices[0]?.message?.content || "Maaf, AI tidak mengembalikan respon.";

    // 6. Return respon JSON ke frontend
    return NextResponse.json({ reply: aiResponse });

  } catch (error: any) {
    console.error("Error di API Lentera Route:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" }, 
      { status: 500 }
    );
  }
}