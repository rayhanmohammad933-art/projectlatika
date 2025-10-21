// Objek untuk menyimpan data user (simulasi dengan localStorage)
let userData = {
    name: '',
    age: 0,
    sleepScore: null,  // Skor 0-10
    dietCalories: null,  // Estimasi kalori
    bmi: null  // Nilai BMI
};

// Fungsi untuk memuat data dari localStorage (jika ada)
function loadUserData() {
    const saved = localStorage.getItem('riseBalanceData');
    if (saved) {
        userData = JSON.parse(saved);
        updateProfile();
        updateTips();  // Update tips jika data sudah ada
    }
}

// Fungsi untuk menyimpan data ke localStorage
function saveUserData() {
    localStorage.setItem('riseBalanceData', JSON.stringify(userData));
}

// Event Listener untuk Login
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if (username && password) {
        // Simulasi login berhasil (dalam produksi, validasi dengan backend)
        document.getElementById('login').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        loadUserData();  // Muat data jika ada
        // Prompt untuk input nama dan umur (sesuai alur)
        if (!userData.name) {
            userData.name = prompt('Masukkan Nama Anda:') || 'Pengguna';
            userData.age = parseInt(prompt('Masukkan Umur Anda:') || 25);
            updateProfile();
            saveUserData();
        }
    } else {
        alert('Username dan password diperlukan!');
    }
});

// Fungsi untuk update profil
function updateProfile() {
    document.getElementById('profile').innerHTML = `<p><strong>Nama:</strong> ${userData.name}</p><p><strong>Umur:</strong> ${userData.age} tahun</p>`;
}

// Event Listener untuk Navigasi Tabs
document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
        // Hapus active dari semua tab dan konten
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        // Tambah active ke tab yang diklik
        tab.classList.add('active');
        document.getElementById(tab.dataset.tab).classList.add('active');
    });
});

// Event Listener untuk Form Cek Kualitas Tidur
document.getElementById('sleepForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const sleepTime = parseFloat(document.getElementById('sleepTime').value);
    const wakeTime = parseFloat(document.getElementById('wakeTime').value);
    const duration = wakeTime - sleepTime;  // Durasi tidur
    const feeling = document.getElementById('feeling').value;
    const habit = document.getElementById('habit').value;
    // Hitung skor berdasarkan rumus: Durasi (7-9 jam = 10), perasaan (+2/-2), kebiasaan (+1/-1)
    let score = 0;
    if (duration >= 7 && duration <= 9) score += 10;
    else if (duration >= 5) score += 5;
    if (feeling === 'baik') score += 2;
    else score -= 2;
    if (habit === 'baik') score += 1;
    else score -= 1;
    userData.sleepScore = Math.max(0, Math.min(score, 10));  // Clamp 0-10
    document.getElementById('sleepResult').innerHTML = `<p><strong>Skor Kualitas Tidur:</strong> ${userData.sleepScore}/10</p><p>Dur
