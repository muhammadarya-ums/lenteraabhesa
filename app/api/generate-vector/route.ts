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

    const { data: kamus, error: fetchError } = await supabase
      .from("kamus")
      .select("*")
      .is("embedding", null)
      .limit(50);

    if (fetchError) throw fetchError;

    if (!kamus || kamus.length === 0) {
      return NextResponse.json({
        message: "Semua kosakata udah punya vektor! Mantap.",
      });
    }

    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-2:embedContent";

    for (const item of kamus) {
      const textToEmbed = `Kata Bawean: ${
        item.kata_alos ||
        item.kata_sedang ||
        item.kata_kasar ||
        ""
      }. Artinya: ${item.arti_indonesia || "Tidak ada arti"}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          content: {
            parts: [
              {
                text: textToEmbed,
              },
            ],
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data);
        throw new Error(data.error?.message || response.statusText);
      }

      console.log(`Embedding ID ${item.id}:`, data);

      const embedding = data.embedding?.values;

      if (!embedding) {
        throw new Error(
          `Embedding tidak ditemukan pada response untuk ID ${item.id}`
        );
      }

      const { error: updateError } = await supabase
        .from("kamus")
        .update({ embedding })
        .eq("id", item.id);

      if (updateError) {
        console.error(`Gagal update ID ${item.id}:`, updateError);
      }
    }

    return NextResponse.json({
      message: `Sukses! ${kamus.length} kosakata berhasil di-generate.`,
    });
  } catch (error: any) {
    console.error("Error detail:", error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}