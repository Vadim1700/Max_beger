const translations = {
    ru: { title: "Chicken Subway", get: "Получить сигнал", back: "Назад", wait: "Подождите:", sec: "сек." },
    en: { title: "Chicken Subway", get: "Get Signal", back: "Back", wait: "Please wait:", sec: "sec." }
};

let currentLang = 'ru';
let timeLeft = 0;
let countdownInterval = null;

// 1. Загрузка
window.addEventListener('DOMContentLoaded', () => {
    let progress = 0;
    const bar = document.querySelector('.progress-bar');
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                document.getElementById('loader').classList.add('hidden');
                document.getElementById('app').classList.remove('hidden');
            }, 500);
        }
        bar.style.width = progress + '%';
    }, 120);
});

// 2. Смена языка (исправленная версия)
function changeLang(lang) {
    currentLang = lang;
    
    // Обновляем визуальный выбор
    document.getElementById('ru-btn').classList.toggle('active', lang === 'ru');
    document.getElementById('en-btn').classList.toggle('active', lang === 'en');
    
    // Обновляем тексты
    document.getElementById('game-title').innerText = translations[lang].title;
    document.getElementById('get-signal-btn').innerText = translations[lang].get;
    document.getElementById('back-btn').innerText = translations[lang].back;
    
    // Обновляем подписи в таймере (не трогая само число!)
    document.getElementById('cooldown-label').innerText = translations[lang].wait;
    document.getElementById('sec-label').innerText = translations[lang].sec;
}

// 3. Получение сигнала
function handleSignal() {
    const content = document.getElementById('signal-content');
    const btn = document.getElementById('get-signal-btn');
    
    content.innerHTML = '<div class="spinner"></div>';
    btn.disabled = true;

    setTimeout(() => {
        content.innerHTML = '';
        const arrows = ['⬆️', '➡️', '⬅️'];

        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const box = document.createElement('div');
                box.className = 'arrow-box';
                box.innerText = arrows[Math.floor(Math.random() * arrows.length)];
                content.appendChild(box);
                
                setTimeout(() => box.classList.add('visible'), 50);

                if (i === 7) {
                    startCooldown();
                }
            }, i * 200);
        }
    }, 1000);
}

// 4. Кулдаун (исправленный баг со сменой языка)
function startCooldown() {
    const cooldownBox = document.getElementById('cooldown-box');
    const timerSpan = document.getElementById('timer');
    const btn = document.getElementById('get-signal-btn');

    if (countdownInterval) clearInterval(countdownInterval);

    timeLeft = 15;
    timerSpan.innerText = timeLeft;
    cooldownBox.classList.remove('hidden');

    countdownInterval = setInterval(() => {
        timeLeft--;
        timerSpan.innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            cooldownBox.classList.add('hidden');
            btn.disabled = false;
        }
    }, 1000);
}

// 5. Сброс
function resetSignals() {
    if (timeLeft > 0) return; // Не сбрасывать пока идет кулдаун
    document.getElementById('signal-content').innerHTML = '<div class="spinner"></div>';
}
