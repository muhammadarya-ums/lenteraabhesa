const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error("❌ Error: URL atau Service Role Key Supabase tidak ditemukan di .env.local");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Setup interface untuk tanya jawab di terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log("==================================================");
  console.log("🚀 FORM PENDAFTARAN STAFF INTERNAL LENTERA ABHESA");
  console.log("==================================================\n");

  try {
    // 1. Ambil input dari terminal
    const nama = await askQuestion("📌 Masukkan Nama Lengkap Staff : ");
    const email = await askQuestion("📌 Masukkan Email Staff       : ");
    const password = await askQuestion("📌 Masukkan Password (min 6)  : ");
    
    let role = '';
    while (role !== 'admin' && role !== 'teknisi') {
      role = await askQuestion("📌 Masukkan Role (admin/teknisi): ");
      role = role.toLowerCase().trim();
      if (role !== 'admin' && role !== 'teknisi') {
        console.log("⚠️ Role harus diisi 'admin' atau 'teknisi' (huruf kecil)!");
      }
    }

    console.log("\n⏳ Sedang memproses ke Supabase...");

    // 2. Buat akun di Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: email.trim(),
      password: password.trim(),
      email_confirm: true
    });

    if (authError) {
      throw new Error(`Gagal membuat akun auth: ${authError.message}`);
    }

    const uuidBaru = authData.user.id;
    console.log(`✅ Akun Auth berhasil dibuat. UUID: ${uuidBaru}`);

    // 3. Masukkan ke tabel profil_admin
    const { error: profileError } = await supabase
      .from('profil_admin')
      .insert({
        id: uuidBaru,
        nama: nama.trim(),
        role: role
      });

    if (profileError) {
      throw new Error(`Gagal memasukkan ke tabel profil_admin: ${profileError.message}`);
    }

    console.log(`\n🎉 SUKSES! ${nama} resmi terdaftar sebagai ${role}.`);

  } catch (error) {
    console.error(`\n❌ Error: ${error.message}`);
  } finally {
    rl.close();
    console.log("\n🏁 Proses selesai.");
  }
}

main();