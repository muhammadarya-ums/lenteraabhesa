import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inisialisasi Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) throw new Error("API Key Google tidak ditemukan.");

    // 1. Tangkap pesan dari frontend
    const body = await req.json();
    const userMessage = body.message; 

    if (!userMessage) {
      return NextResponse.json({ error: "Pesan tidak boleh kosong." }, { status: 400 });
    }

    // 2. Ubah pesan user jadi vektor
    const embedUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent";
    const embedRes = await fetch(embedUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        content: { parts: [{ text: userMessage }] },
        outputDimensionality: 768
      })
    });

    if (!embedRes.ok) throw new Error("Gagal bikin vektor dari pesan user.");
    const embedData = await embedRes.json();
    const queryEmbedding = embedData.embedding.values;

    // 3. Cari di database pakai fungsi SQL (Jalanin Kamus & Sejarah barengan biar cepet)
    const [kamusResult, sejarahResult] = await Promise.all([
      supabase.rpc('match_kamus', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5, 
        match_count: 5 
      }),
      supabase.rpc('match_sejarah', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5, 
        match_count: 3 // Ambil 3 sejarah teratas aja biar context nggak kepanjangan
      })
    ]);

    if (kamusResult.error) throw kamusResult.error;
    if (sejarahResult.error) throw sejarahResult.error;

    const matchedWords = kamusResult.data;
    const matchedHistory = sejarahResult.data;

    console.log("DEBUG - Hasil Kamus:", matchedWords);
    console.log("DEBUG - Hasil Sejarah:", matchedHistory);

    // 4. Susun "Contekan" (Konteks) buat Gemini/Groq
    let contextText = "Berikut adalah data dari database Lentera Abhesa (Kamus & Sejarah) yang mungkin relevan:\n\n";
    
    // Inject Data Kamus
    contextText += "--- DATA KAMUS BAHASA ---\n";
    if (matchedWords && matchedWords.length > 0) {
      matchedWords.forEach((word: any) => {
        contextText += `- Bahasa Alus: ${word.kata_alos || '-'}, Sedang: ${word.kata_sedang || '-'}, Kasar: ${word.kata_kasar || '-'} | Arti Indonesia: ${word.arti_indonesia}\n`;
      });
    } else {
      contextText += "Tidak ada kosakata yang cocok.\n";
    }

    // Inject Data Sejarah
    contextText += "\n--- DATA SEJARAH & BUDAYA ---\n";
    if (matchedHistory && matchedHistory.length > 0) {
      matchedHistory.forEach((hist: any) => {
        contextText += `- Judul: ${hist.judul}\n  Konten: ${hist.konten}\n\n`;
      });
    } else {
      contextText += "Tidak ada catatan sejarah yang cocok.\n";
    }

    // 5. Suruh AI Jawab (Lewat Groq)
    const systemPrompt = `Kamu adalah Lentera, asisten AI yang ramah, pintar, dan ahli dalam bahasa SERTA sejarah/kebudayaan pulau Bawean.
Gunakan HANYA data KONTEKS di bawah ini untuk menjawab pertanyaan user secara akurat. 
Jika user bertanya tentang bahasa, gunakan bagian DATA KAMUS. Jika bertanya tentang budaya/sejarah, gunakan DATA SEJARAH.
Jika KONTEKS tidak memiliki jawaban yang tepat terkait Bawean, jawab sebisa kamu sesuai pengetahuan umum atau minta maaf dengan sopan karena datanya belum tersedia di Lentera Abhesa. Jangan mengarang arti kata atau sejarah fiktif.

KONTEKS:
${contextText}`;

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) throw new Error("API Key Groq tidak ditemukan di environment variables.");

    const chatUrl = "https://api.groq.com/openai/v1/chat/completions";
    const chatRes = await fetch(chatUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", 
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage }
        ]
      })
    });

    if (!chatRes.ok) {
      const errorData = await chatRes.json();
      console.error("Error dari Groq:", errorData);
      throw new Error(`Groq nolak: ${errorData.error?.message || chatRes.statusText}`);
    }

    const chatData = await chatRes.json();
    const aiResponse = chatData.choices[0].message.content;

    // 6. Kirim jawaban AI kembali ke frontend
    return NextResponse.json({ reply: aiResponse });

  } catch (error: any) {
    console.error("Error di API Lentera:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}