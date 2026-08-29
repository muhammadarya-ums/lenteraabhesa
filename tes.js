import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function GET() {
  try {
    const models = await groq.models.list();
    // Looping buat ngambil nama ID modelnya aja biar rapi
    const activeModels = models.data.map((m) => m.id);
    
    return NextResponse.json({ available_models: activeModels });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}