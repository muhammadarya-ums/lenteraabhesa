import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase'; // Sesuaikan path import dengan lokasi file konfigurasi lo

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status_pesanan, kurir, nomor_resi } = body;

    if (!id || !status_pesanan) {
      return NextResponse.json(
        { error: 'ID Pesanan dan Status wajib diisi' },
        { status: 400 }
      );
    }

    // Update data di tabel pesanan Supabase
    const { data, error } = await supabase
      .from('pesanan')
      .update({
        status_pesanan: status_pesanan,
        kurir: kurir || null,
        nomor_resi: nomor_resi || null,
      })
      .eq('id', id)
      .select();

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Pesanan berhasil diupdate', data });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}