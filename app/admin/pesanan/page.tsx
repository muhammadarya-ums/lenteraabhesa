'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // Sesuaikan path

interface Pesanan {
  id: string;
  nama_pembeli: string;
  whatsapp: string;
  total_harga: number;
  status_pesanan: string;
  kurir: string | null;
  nomor_resi: string | null;
  bukti_transfer_url: string | null;
}

export default function AdminPesananPage() {
  const [pesananList, setPesananList] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal Update
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPesanan, setSelectedPesanan] = useState<Pesanan | null>(null);
  
  // State form dalam Modal
  const [formStatus, setFormStatus] = useState('');
  const [formKurir, setFormKurir] = useState('');
  const [formResi, setFormResi] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Ambil data dari Supabase
  const fetchPesanan = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pesanan')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setPesananList(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPesanan();
  }, []);

  // Buka Modal Update
  const openModal = (pesanan: Pesanan) => {
    setSelectedPesanan(pesanan);
    setFormStatus(pesanan.status_pesanan);
    setFormKurir(pesanan.kurir || '');
    setFormResi(pesanan.nomor_resi || '');
    setIsModalOpen(true);
  };

  // Fungsi simpan update ke Database
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPesanan) return;

    setIsUpdating(true);
    try {
      const res = await fetch('/api/admin/update-pesanan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedPesanan.id,
          status_pesanan: formStatus,
          kurir: formStatus === 'dikirim' ? formKurir : null,
          nomor_resi: formStatus === 'dikirim' ? formResi : null,
        }),
      });

      if (res.ok) {
        alert('Status pesanan berhasil diperbarui!');
        setIsModalOpen(false);
        fetchPesanan(); // Refresh tabel
      } else {
        const err = await res.json();
        alert(err.error);
      }
    } catch (error) {
      alert('Gagal mengupdate pesanan.');
    } finally {
      setIsUpdating(false);
    }
  };

  // Render Label Status
  const renderStatus = (status: string) => {
    switch (status) {
      case 'menunggu_pembayaran':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">Belum Bayar</span>;
      case 'menunggu_verifikasi':
        return <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs font-semibold">Cek Bukti TF</span>;
      case 'diproses':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">Diproses</span>;
      case 'dikirim':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">Dikirim</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Admin - Kelola Pesanan</h1>

        <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Pembeli</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Harga</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resi</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center">Loading data...</td></tr>
              ) : pesananList.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-4 text-center">Belum ada pesanan.</td></tr>
              ) : (
                pesananList.map((p) => (
                  <tr key={p.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{p.nama_pembeli}</div>
                      <div className="text-sm text-gray-500">{p.whatsapp}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Rp {p.total_harga.toLocaleString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {renderStatus(p.status_pesanan)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {p.nomor_resi ? (
                        <div>
                          <span className="font-bold uppercase">{p.kurir}</span> <br/>
                          {p.nomor_resi}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <button
                        onClick={() => openModal(p)}
                        className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal Update Status & Resi */}
        {isModalOpen && selectedPesanan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Update Pesanan</h2>
              
              {/* Tampilkan Bukti Transfer Jika Ada */}
              {selectedPesanan.bukti_transfer_url && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-1">Bukti Transfer:</p>
                  <a href={selectedPesanan.bukti_transfer_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline text-sm">
                    Lihat Bukti Struk Transfer
                  </a>
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ubah Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="menunggu_pembayaran">Menunggu Pembayaran</option>
                    <option value="menunggu_verifikasi">Cek Bukti Transfer</option>
                    <option value="diproses">Diproses (Packing)</option>
                    <option value="dikirim">Dikirim (Input Resi)</option>
                    <option value="selesai">Selesai (Diterima)</option>
                  </select>
                </div>

                {/* Kolom Input Resi hanya muncul jika statusnya "dikirim" */}
                {formStatus === 'dikirim' && (
                  <div className="space-y-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Kurir</label>
                      <select
                        required
                        value={formKurir}
                        onChange={(e) => setFormKurir(e.target.value)}
                        className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">-- Pilih Kurir --</option>
                        <option value="jne">JNE</option>
                        <option value="jnt">J&T</option>
                        <option value="sicepat">SiCepat</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Resi</label>
                      <input
                        type="text"
                        required
                        value={formResi}
                        onChange={(e) => setFormResi(e.target.value)}
                        placeholder="Masukkan nomor resi..."
                        className="w-full border-gray-300 rounded-lg p-2.5 border focus:ring-blue-500 focus:border-blue-500 uppercase"
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
                  >
                    {isUpdating ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}