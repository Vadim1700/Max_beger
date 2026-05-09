const signalValueElement = document.getElementById('signal-value');
const signalText = document.getElementById('signal-text');
const loader = document.getElementById('loader');

const statusBoxElement = document.getElementById('status-box');
const getSignalBtn = document.getElementById('get-signal');
const resetSignalBtn = document.getElementById('reset-signal');
const langToggle = document.getElementById('lang-toggle');
const modeToggle = document.getElementById('mode-toggle');
const modeLabel = document.getElementById('mode-label');
const langLabel = document.getElementById('lang-label');

const i18n = {
  ru: { 
    btnGet: 'ПОЛУЧИТЬ СИГНАЛ', 
    btnReset: 'НАЗАД', 
    statusReady: 'СИГНАЛ ГОТОВ', 
    statusWait: 'ОЖИДАНИЕ',
    step1: 'Подключение к серверам...',
    step2: 'Получаю данные...',
    step3: 'Генерация сигнала...',
    step4: 'Сигнал готов!',
    countdown: 'Следующий сигнал через: ',
    easy: 'ЛЕГКИЙ', 
    hard: 'СЛОЖНЫЙ' 
  },
  en: { 
    btnGet: 'GET SIGNAL', 
    btnReset: 'BACK', 
    statusReady: 'SIGNAL READY', 
    statusWait: 'WAITING',
    step1: 'Connecting to servers...',
    step2: 'Fetching data...',
    step3: 'Generating signal...',
    step4: 'Signal ready!',
    countdown: 'Signal delay: ',
    easy: 'EASY', 
    hard: 'HARD' 
  }
};

let currentLang = 'ru';
let isHardMode = false;

let stepsInterval = null;
let countdownInterval = null;
let countdownRemaining = null;

// Показать лоадер
function showLoader() {
  loader.style.display = "block";
  signalText.style.display = "none";
}

// Скрыть лоадер
function hideLoader() {
  loader.style.display = "none";
  signalText.style.display = "block";
}

function updateUI() {
  const t = i18n[currentLang];

  getSignalBtn.innerText = t.btnGet;
  resetSignalBtn.innerText = t.btnReset;
  langLabel.innerText = currentLang.toUpperCase();
  modeLabel.innerText = isHardMode ? t.hard : t.easy;

  if (countdownRemaining !== null) {
    statusBoxElement.innerText = `${t.countdown}${countdownRemaining}s`;
    return;
  }

  if (stepsInterval !== null) return;

  statusBoxElement.innerText = t.statusWait;
  statusBoxElement.style.color = "white";
}

langToggle.addEventListener('change', () => {
  currentLang = langToggle.checked ? 'en' : 'ru';
  updateUI();
});

modeToggle.addEventListener('change', () => {
  isHardMode = modeToggle.checked;
  updateUI();
});

function clearAllTimers() {
  if (stepsInterval) clearInterval(stepsInterval);
  if (countdownInterval) clearInterval(countdownInterval);
  stepsInterval = null;
  countdownInterval = null;
  countdownRemaining = null;
}

// step1–4 (1.5 сек)
function startSteps() {
  const t = i18n[currentLang];
  const steps = [t.step1, t.step2, t.step3, t.step4];
  let index = 0;

  showLoader();
  signalText.innerText = "--";

  stepsInterval = setInterval(() => {
    statusBoxElement.innerText = steps[index];
    index++;

    if (index === steps.length) {
      clearInterval(stepsInterval);
      stepsInterval = null;

      const maxSteps = isHardMode ? 14 : 30;
      const luckyNumber = Math.floor(Math.random() * maxSteps) + 1;

      hideLoader();
      signalText.innerText = `x${luckyNumber}`;
      statusBoxElement.innerText = t.statusReady;

      startCountdown(15);
    }
  }, 1500);
}

// Таймер 15 сек
function startCountdown(seconds) {
  countdownRemaining = seconds;

  getSignalBtn.disabled = true;

  countdownInterval = setInterval(() => {
    const t = i18n[currentLang];

    statusBoxElement.style.color = "red";
    statusBoxElement.innerText = `${t.countdown}${countdownRemaining}s`;

    countdownRemaining--;

    if (countdownRemaining < 0) {
      clearInterval(countdownInterval);
      countdownInterval = null;
      countdownRemaining = null;

      statusBoxElement.style.color = "white";
      statusBoxElement.innerText = i18n[currentLang].statusReady;

      getSignalBtn.disabled = false;
    }
  }, 1000);
}

getSignalBtn.addEventListener('click', () => {
  clearAllTimers();

  showLoader();
  signalText.innerText = "--";

  statusBoxElement.style.color = "white";
  statusBoxElement.innerText = i18n[currentLang].statusWait;

  getSignalBtn.disabled = true;

  startSteps();
});

// Кнопка назад → FunPay
resetSignalBtn.addEventListener('click', () => {
  window.location.href = "https://funpay.com/";
});

// Показываем лоадер при входе на страницу
showLoader();
updateUI();
