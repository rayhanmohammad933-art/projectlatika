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
        }
    }

    // Fungsi untuk menyimpan data ke localStorage
    function saveUserData() {
        localStorage.setItem('riseBalanceData', JSON.stringify(userData));
        console.log('Data saved to localStorage:', userData);  // Debugging
    }

    // Event Listener untuk Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Login form submitted');  // Debugging
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value.trim();
            console.log('Username:', username, 'Password:', password);  // Debugging
            if (username && password) {
                console.log('Login successful, switching to app');  // Debugging
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
                alert('Username dan password diperlukan! Pastikan keduanya diisi.');
                console.log('Login failed: Username or password empty');  // Debugging
            }
        });
    } else {
        console.error('Login form not found!');  // Debugging
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
            const types = document.getElementById('foodTypes').value.toLowerCase().split(',');
            let calories = 0;
            types.forEach(type => {
                type = type.trim();
                if (type.includes('nasi')) calories += amount * 1.3;
                else if (type.includes('daging')) calories += amount * 2.5;
                else if (type.includes('sayur')) calories += amount * 0.3;
                else calories += amount * 1;  // Default
            });
            userData.dietCalories = calories;
            document.getElementById('dietResult').innerHTML = `<p><strong>Estimasi Kalori Harian:</strong> ${calories.toFixed(0)} kcal (Ideal: ~2000 kcal)</p>`;
            document.getElementById('dietResult').style.display = 'block';
            saveUserData();
            updateTips();
            console.log('Diet calories calculated:', userData.dietCalories);  // Debugging
        });
    }

    // Event Listener untuk Form Cek BMI
    const bmiForm = document.getElementById('bmiForm');
    if (bmiForm) {
        bmiForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('BMI form submitted');  // Debugging
            const weight = parseFloat(document.getElementById('weight').value);
            const height = parseFloat(document.getElementById('height').value) / 100;
            const bmi = weight / (height * height);
            let category = '';
            if (bmi < 18.5) category = 'Underweight';
            else if (bmi < 25) category = 'Normal';
            else if (bmi < 30) category = 'Overweight';
            else category = 'Obese';
            userData.bmi = bmi.toFixed(1);
            document.getElementById('bmiResult').innerHTML = `<p><strong>BMI:</strong> ${bmi.toFixed(1)} (${category})</p>`;
            document.getElementById('bmiResult').style.display = 'block';
            saveUserData();
            updateTips();
            console.log('BMI calculated:', userData.bmi);  // Debugging
        });
    }

    // Fungsi untuk update tips berdasarkan hasil cek
    function updateTips() {
        if (userData.sleepScore !== null || userData.dietCalories !== null || userData.bmi !== null) {
            let tips = '<h4>Tips Berdasarkan Hasil Anda:</h4><ul>';
            if (userData.sleepScore < 7) tips += '<li>Tingkatkan durasi tidur menjadi 7-9 jam per malam.</li>';
            if (userData.dietCalories > 2500) tips += '<li>Kurangi asupan kalori dengan makan lebih banyak sayur.</li>';
            if (userData.bmi > 25) tips += '<li>Lakukan olahraga rutin dan kontrol porsi makan.</li>';
            tips += '<li>Minum air cukup dan hindari stres.</li></ul>';
            document.getElementById('tipsContent').innerHTML = tips;
            document.getElementById('tipsContent').style.display = 'block';
            console.log('Tips updated');  // Debugging
        }
    }

    // Event Listener untuk Share
    const shareBtn = document.getElementById('shareBtn');
    if (shareBtn) {
        shareBtn.addEventListener('click', () => {
            const text = `Hasil Cek Kesehatan RiseBalance:\nNama: ${userData.name}\nUmur: ${userData.age}\nTidur: ${userData.sleepScore || 'Belum dicek'}\nMakan: ${userData.dietCalories || 'Belum dicek'} kcal\nBMI: ${userData.bmi || 'Belum dicek'}`;
            if (navigator.share) {
                navigator.share({ title: 'Hasil RiseBalance', text: text });
            } else {
                alert('Fitur share tidak didukung. Salin teks berikut:\n' + text);
            }
            console.log('Share attempted');  // Debugging
        });
    }

    // Event Listener untuk Download
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const text = `Hasil Cek Kesehatan RiseBalance:\nNama: ${userData.name}\nUmur: ${userData.age}\nTidur: ${userData.sleepScore || 'Belum dicek'}\nMakan: ${userData.dietCalories || 'Belum dicek'} kcal\nBMI: ${userData.bmi || 'Belum dicek'}`;
            const blob = new Blob([text], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'hasil-risebalance.txt';
            a.click();
            URL.revokeObjectURL(url);
            console.log('Download attempted');  // Debugging
        });
    }

    console.log('RiseBalance initialized successfully');  // Debugging
});
