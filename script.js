// Fungsi untuk menyimpan dan memuat profil
function loadProfile() {
    const name = localStorage.getItem('name');
    const age = localStorage.getItem('age');
    const gender = localStorage.getItem('gender');
    const height = localStorage.getItem('height');
    const weight = localStorage.getItem('weight');
    if (name && age) {
        document.getElementById('profile-section').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        document.getElementById('user-name').textContent = name;
    }
}

// Simpan profil
document.getElementById('profile-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    localStorage.setItem('name', name);
    localStorage.setItem('age', age);
    localStorage.setItem('gender', gender);
    localStorage.setItem('height', height);
    localStorage.setItem('weight', weight);
    loadProfile();
});

// Logout
function logout() {
    localStorage.clear();
    location.reload();
}

// Tampilkan checker
function showChecker(type) {
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('checker-section').classList.remove('hidden');
    const form = document.getElementById('checker-form');
    form.innerHTML = ''; // Reset form
    if (type === 'bmi') {
        document.getElementById('checker-title').textContent = 'Cek BMI';
        form.innerHTML = `
            <input type="number" id="bmi-height" placeholder="Tinggi Badan (cm)" required>
            <input type="number" id="bmi-weight" placeholder="Berat Badan (kg)" required>
        `;
    } else if (type === 'diet') {
        document.getElementById('checker-title').textContent = 'Cek Pola Makan';
        form.innerHTML = `
            <p>Apakah Anda makan sayur dan buah setiap hari? <select id="diet-q1"><option value="ya">Ya</option><option value="tidak">Tidak</option></select></p>
            <p>Apakah Anda minum air putih minimal 8 gelas sehari? <select id="diet-q2"><option value="ya">Ya</option><option value="tidak">Tidak</option></select></p>
            <p>Apakah Anda menghindari makanan cepat saji? <select id="diet-q3"><option value="ya">Ya</option><option value="tidak">Tidak</option></select></p>
        `;
    } else if (type === 'sleep') {
        document.getElementById('checker-title').textContent = 'Cek Pola Tidur';
        form.innerHTML = `
            <input type="number" id="sleep-hours" placeholder="Berapa jam tidur per malam?" required>
            <p>Apakah Anda tidur di waktu yang sama setiap hari? <select id="sleep-q1"><option value="ya">Ya</option><option value="tidak">Tidak</option></select></p>
        `;
    }
    form.innerHTML += '<button type="submit">Cek Sekarang</button>';
    form.dataset.type = type;
}

// Proses hasil
document.getElementById('checker-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const type = e.target.dataset.type;
    let result = '';
    let isGood = false;
    if (type === 'bmi') {
        const height = document.getElementById('bmi-height').value / 100;
        const weight = document.getElementById('bmi-weight').value;
        const bmi = weight / (height * height);
        if (bmi < 18.5) result = `BMI Anda: ${bmi.toFixed(2)} (Kurus). Tips: Tingkatkan asupan kalori dengan makanan bergizi.`;
        else if (bmi < 25) { result = `BMI Anda: ${bmi.toFixed(2)} (Normal). Selamat! Terus jaga pola hidup sehat dan semangat selalu!`; isGood = true; }
        else result = `BMI Anda: ${bmi.toFixed(2)} (Berlebih). Tips: Kurangi makanan manis dan olahraga rutin.`;
    } else if (type === 'diet') {
        const q1 = document.getElementById('diet-q1').value;
        const q2 = document.getElementById('diet-q2').value;
        const q3 = document.getElementById('diet-q3').value;
        const score = (q1 === 'ya' ? 1 : 0) + (q2 === 'ya' ? 1 : 0) + (q3 === 'ya' ? 1 : 0);
        if (score >= 2) { result = 'Pola makan Anda baik! Selamat! Terus jaga pola hidup sehat dan semangat selalu!'; isGood = true; }
        else result = 'Pola makan Anda perlu diperbaiki. Tips: Tambahkan sayur, buah, dan air putih ke dalam menu harian.';
    } else if (type === 'sleep') {
        const hours = document.getElementById('sleep-hours').value;
        const q1 = document.getElementById('sleep-q1').value;
        if (hours >= 7 && q1 === 'ya') { result = 'Pola tidur Anda baik! Selamat! Terus jaga pola hidup sehat dan semangat selalu!'; isGood = true; }
        else result = 'Pola tidur Anda perlu diperbaiki. Tips: Tidur 7-9 jam per malam dan jaga jadwal tidur yang konsisten.';
    }
    document.getElementById('checker-section').classList.add('hidden');
    document.getElementById('result-section').classList.remove('hidden');
    const resultDiv = document.getElementById('result-content');
    resultDiv.className = isGood ? 'result good' : 'result bad';
    resultDiv.textContent = result;
    // Setup share
    const shareText = encodeURIComponent(`Hasil cek kesehatan: ${result}`);
    document.getElementById('share-twitter').href = `https://twitter.com/intent/tweet?text=${shareText}`;
    document.getElementById('share-facebook').href = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${shareText}`;
});

// Unduh hasil
function downloadResult() {
    const result = document.getElementById('result-content').textContent;
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hasil-kesehatan.txt';
    a.click();
}

// Kembali ke dashboard
function backToDashboard() {
    document.getElementById('result-section').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
}

// Load profil saat halaman dimuat
loadProfile();
