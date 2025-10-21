// Tunggu DOM siap sebelum menjalankan script
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing RiseBalance...');  // Debugging

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
            console.log('Data loaded from localStorage:', userData);  // Debugging
        } else {
            // Prompt nama dan umur jika belum ada data
            userData.name = prompt('Masukkan Nama Anda:') || 'Pengguna';
            userData.age = parseInt(prompt('Masukkan Umur Anda:') || 25);
            updateProfile();
            saveUserData();
            console.log('New user data prompted and saved');  // Debugging
        }
    }

    // Fungsi untuk menyimpan data ke localStorage
    function saveUserData() {
        localStorage.setItem('riseBalanceData', JSON.stringify(userData));
        console.log('Data saved to localStorage:', userData);  // Debugging
    }

    // Fungsi untuk update profil
    function updateProfile() {
        const profileEl = document.getElementById('profile');
        if (profileEl) {
            profileEl.innerHTML = `<p><strong>Nama:</strong> ${userData.name}</p><p><strong>Umur:</strong> ${userData.age} tahun</p>`;
            console.log('Profile updated');  // Debugging
        }
    }

    // Event Listener untuk Navigasi Tabs
    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
            console.log('Tab clicked:', tab.dataset.tab);  // Debugging
            // Hapus active dari semua tab dan konten
            document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            // Tambah active ke tab yang diklik
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // Event Listener untuk Form Cek Kualitas Tidur
    const sleepForm = document.getElementById('sleepForm');
    if (sleepForm) {
        sleepForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Sleep form submitted');  // Debugging
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
            document.getElementById('sleepResult').innerHTML = `<p><strong>Skor Kualitas Tidur:</strong> ${userData.sleepScore}/10</p><p>Durasi: ${duration.toFixed(1)} jam</p>`;
            document.getElementById('sleepResult').style.display = 'block';
            saveUserData();
            updateTips();
            console.log('Sleep score calculated:', userData.sleepScore);  // Debugging
        });
    }

    // Event Listener untuk Form Cek Pola Makan
    const dietForm = document.getElementById('dietForm');
    if (dietForm) {
        dietForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Diet form submitted');  // Debugging
            const amount = parseFloat(document.getElementById('foodAmount').value);
            const types = document.getElementById('foodTypes
