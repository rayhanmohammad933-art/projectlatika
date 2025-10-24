// Load data from localStorage
let profile = JSON.parse(localStorage.getItem('profile')) || {};
let history = JSON.parse(localStorage.getItem('history')) || [];

// Initial form
document.getElementById('profile-form').addEventListener('submit', function(e) {
    e.preventDefault();
    profile.name = document.getElementById('name').value;
    profile.gender = document.getElementById('gender').value;
    profile.age = document.getElementById('age').value;
    localStorage.setItem('profile', JSON.stringify(profile));
    loadProfile();
    document.getElementById('initial-form').style.display = 'none';
    document.getElementById('main-app').style.display = 'block';
});

// Load profile
function loadProfile() {
    if (profile.name) {
        document.getElementById('display-name').textContent = profile.name;
        document.getElementById('display-gender').textContent = profile.gender;
        document.getElementById('display-age').textContent = profile.age;
        document.getElementById('initial-form').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
    }
}

// Upload photo
document.getElementById('upload-pic').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function() {
            document.getElementById('profile-pic').src = reader.result;
            profile.photo = reader.result;
            localStorage.setItem('profile', JSON.stringify(profile));
        };
        reader.readAsDataURL(file);
    }
});

// Tab switching
document.querySelectorAll('.tab').forEach(btn => {
    btn.addEventListener('click', function() {
        document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
        document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
        document.getElementById(this.dataset.tab).classList.add('active');
        this.classList.add('active');
    });
});

// Sleep check
document.getElementById('sleep-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const sleepTime = document.getElementById('sleep-time').value;
    const wakeTime = document.getElementById('wake-time').value;
    const feeling = document.getElementById('feeling').value;
    const habit = document.getElementById('habit').value;
    // Calculate hours slept
    const sleep = new Date(`1970-01-01T${sleepTime}:00`);
    const wake = new Date(`1970-01-01T${wakeTime}:00`);
    let hours = (wake - sleep) / (1000 * 60 * 60);
    if (hours < 0) hours += 24;
    let score = 5; // Base score
    if (hours >= 7 && hours <= 9) score += 3;
    if (feeling === 'Segar') score += 2;
    if (habit.toLowerCase().includes('kopi') || habit.toLowerCase().includes('kafein')) score -= 1;
    score = Math.min(10, Math.max(1, score));
    const result = `Jam tidur: ${hours.toFixed(1)} jam. Skor kualitas: ${score}/10.`;
    document.getElementById('sleep-result').innerHTML = result;
    addToHistory('Kualitas Tidur', result);
    profile.sleepScore = score;
    localStorage.setItem('profile', JSON.stringify(profile));
    generateTips();
});

// Diet check
document.getElementById('diet-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const meals = parseInt(document.getElementById('meals').value);
    const foods = document.getElementById('foods').value;
    const veggies = document.getElementById('veggies').value;
    let score = 5;
    if (meals >= 3) score += 2;
    if (foods.toLowerCase().includes('sayur') || foods.toLowerCase().includes('buah')) score += 2;
    if (veggies === 'Ya') score += 1;
    score = Math.min(10, Math.max(1, score));
    const result = `Jumlah makan: ${meals}. Skor pola makan: ${score}/10.`;
    document.getElementById('diet-result').innerHTML = result;
    addToHistory('Pola Makan', result);
    profile.dietScore = score;
    localStorage.setItem('profile', JSON.stringify(profile));
    generateTips();
});

// BMI check
document.getElementById('bmi-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value) / 100;
    const bmi = (weight / (height * height)).toFixed(1);
    let category = 'Underweight';
    if (bmi >= 18.5 && bmi < 25) category = 'Normal';
    else if (bmi >= 25 && bmi < 30) category = 'Overweight';
    else if (bmi >= 30) category = 'Obese';
    const result = `BMI: ${bmi}. Kategori: ${category}.`;
    document.getElementById('bmi-result').innerHTML = result;
    addToHistory('BMI', result);
    profile.bmi = bmi;
    profile.bmiCategory = category;
    localStorage.setItem('profile', JSON.stringify(profile));
    generateTips();
});

// Generate tips
function generateTips() {
    let tips = [];
    if (profile.sleepScore && profile.sleepScore < 7) tips.push('Tingkatkan waktu tidur menjadi 7-9 jam per malam.');
    if (profile.dietScore && profile.dietScore < 7) tips.push('Tambahkan lebih banyak sayur dan buah dalam diet harian.');
    if (profile.bmiCategory && profile.bmiCategory !== 'Normal') {
        if (profile.bmiCategory === 'Overweight' || profile.bmiCategory === 'Obese') tips.push('Kurangi asupan kalori dan olahraga secara teratur.');
        else tips.push('Tingkatkan asupan nutrisi untuk mencapai berat ideal.');
    }
    document.getElementById('tips-content').innerHTML = tips.length ? tips.join('<br>') : 'Semua indikator Anda baik! Pertahankan pola hidup sehat.';
}

// Add to history
function addToHistory(type, result) {
    const entry = { type, result, date: new Date().toLocaleString() };
    history.push(entry);
    localStorage.setItem('history', JSON.stringify(history));
    loadHistory();
}

// Load history
function loadHistory() {
    const list = document.getElementById('history-list');
    list.innerHTML = '';
    history.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.date} - ${item.type}: ${item.result}`;
        list.appendChild(li);
    });
}

// Logout
document.getElementById('logout-btn').addEventListener('click', function() {
    localStorage.clear();
    location.reload();
});

// Initialize
loadProfile();
loadHistory();
if (profile.photo) document.getElementById('profile-pic').src = profile.photo;
