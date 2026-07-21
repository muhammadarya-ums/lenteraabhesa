import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    if (!apiKey) {
      throw new Error("GOOGLE_GENERATIVE_AI_API_KEY tidak ditemukan.");
    }

    const { data: sejarahList, error: fetchError } = await supabase
      .from("sejarah")
      .select("*")
      .is("embedding", null)
      .limit(50);

    if (fetchError) throw fetchError;

    if (!sejarahList || sejarahList.length === 0) {
      return NextResponse.json({
        message: "Mantap! Semua data sejarah sudah punya vektor.",
      });
    }

    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent";

    for (const item of sejarahList) {
      const textToEmbed = `Judul Sejarah: ${item.judul || ""}. Kategori: ${item.kategori || ""}. Isi Konten: ${item.konten || ""}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          content: {
            parts: [{ text: textToEmbed }],
          },
          outputDimensionality: 768
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        throw new Error(data.error?.message || response.statusText);
      }

      console.log(`Embedding Sejarah ID ${item.id}: Sukses`);

      const embedding = data.embedding?.values;

      if (!embedding) {
        throw new Error(`Embedding tidak ditemukan pada response untuk Sejarah ID ${item.id}`);
      }

      const { error: updateError } = await supabase
        .from("sejarah")
        .update({ embedding })
        .eq("id", item.id);

      if (updateError) {
        console.error(`Gagal update Sejarah ID ${item.id}:`, updateError);
      }
    }

    return NextResponse.json({
      message: `Sukses! ${sejarahList.length} data sejarah berhasil di-generate vektornya.`,
    });

  } catch (error: any) {
    console.error("Error detail:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}