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
            <input type="number" id="diet-meals" placeholder="Berapa kali makan dalam sehari?" required>
            <select id="diet-veggies">
                <option value="">Apakah sudah makan sayur dan buah setiap hari?</option>
                <option value="ya">Ya</option>
                <option value="tidak">Tidak</option>
            </select>
            <textarea id="diet-foods" placeholder="Apa saja makanan yang dimakan? (Deskripsikan singkat)" rows="3" required></textarea>
        `;
    } else if (type === 'sleep') {
        document.getElementById('checker-title').textContent = 'Cek Pola Tidur';
        form.innerHTML = `
            <input type="time" id="sleep-bedtime" placeholder="Jam berapa kamu tidur?" required>
            <input type="time" id="sleep-waketime" placeholder="Jam berapa kamu bangun tidur?" required>
            <input type="number" id="sleep-hours" placeholder="Berapa jam kamu tidur?" readonly>
            <select id="sleep-feeling">
                <option value="">Apa perasaan kamu setelah bangun?</option>
                <option value="segar">Segar</option>
                <option value="lelah">Lelah</option>
                <option value="lainnya">Lainnya</option>
            </select>
            <textarea id="sleep-habit" placeholder="Kebiasaan sebelum tidur? (Deskripsikan singkat)" rows="3" required></textarea>
        `;
        // Hitung jam tidur otomatis
        document.getElementById('sleep-bedtime').addEventListener('change', calculateSleepHours);
        document.getElementById('sleep-waketime').addEventListener('change', calculateSleepHours);
    }
    form.innerHTML += '<button type="submit">Cek Sekarang</button>';
    form.dataset.type = type;
}

// Fungsi untuk menghitung jam tidur
function calculateSleepHours() {
    const bedtime = document.getElementById('sleep-bedtime').value;
    const waketime = document.getElementById('sleep-waketime').value;
    if (bedtime && waketime) {
        const bed = new Date(`1970-01-01T${bedtime}:00`);
        const wake = new Date(`1970-01-01T${waketime}:00`);
        let diff = (wake - bed) / (1000 * 60 * 60);
        if (diff < 0) diff += 24; // Jika bangun keesokan hari
        document.getElementById('sleep-hours').value = diff.toFixed(1);
    }
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
        const meals = parseInt(document.getElementById('diet-meals').value);
        const veggies = document.getElementById('diet-veggies').value;
        const foods = document.getElementById('diet-foods').value.toLowerCase();
        let score = 0;
        if (meals >= 3) score += 1;
        if (veggies === 'ya') score += 1;
        if (foods.includes('sayur') || foods.includes('buah') || foods.includes('sehat')) score += 1;
        if (score >= 2) { result = 'Pola makan Anda baik! Selamat! Terus jaga pola hidup sehat dan semangat selalu!'; isGood = true; }
        else result = 'Pola makan Anda perlu diperbaiki. Tips: Makan 3 kali sehari, tambahkan sayur dan buah, hindari junk food.';
    } else if (type === 'sleep') {
        const hours = parseFloat(document.getElementById('sleep-hours').value);
        const feeling = document.getElementById('sleep-feeling').value;
        const habit = document.getElementById('sleep-habit').value.toLowerCase();
        let score = 0;
        if (hours >= 7 && hours <= 9) score += 1;
        if (feeling === 'segar') score += 1;
        if (!habit.includes('gadget') && !habit.includes('kafein')) score += 1;
        if (score >= 2) { result = 'Pola tidur Anda baik! Selamat! Terus jaga pola hidup sehat dan semangat selalu!'; isGood = true; }
        else result = 'Pola tidur Anda perlu diperbaiki. Tips: Tidur 7-9 jam, hindari gadget sebelum tidur, dan jaga jadwal konsisten.';
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
