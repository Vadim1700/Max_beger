let currentLang = 'RU';
let currentNumber = null;

const translations = {
    RU: {
        instruction: "сколько блоков ставить в ряд",
        okPlace: "Ок - ставь",
        inRow: "блока в ряд",
        btn: "ПОЛУЧИТЬ СИГНАЛ",
        loading: "Генерация..."
    },
    EN: {
        instruction: "how many blocks to put in a row",
        okPlace: "Ok - place",
        inRow: "blocks in a row",
        btn: "GET SIGNAL",
        loading: "Generating..."
    }
};

function changeLanguage(lang) {
    currentLang = lang;
    
    // Обновляем визуальный выбор языка
    document.getElementById('btn-ru').classList.toggle('active', lang === 'RU');
    document.getElementById('btn-en').classList.toggle('active', lang === 'EN');

    updateUI();
}

function handleGenerate() {
    const loader = document.getElementById('loader');
    const numDisplay = document.getElementById('generated-number');
    const resText = document.getElementById('result-text');

    // Сбрасываем старые значения
    numDisplay.innerText = "";
    resText.innerText = translations[currentLang].loading;
    loader.style.display = "block";

    setTimeout(() => {
        // Генерируем число от 1 до 10
        currentNumber = Math.floor(Math.random() * 10) + 1;
        loader.style.display = "none";
        
        updateUI();
    }, 1000); // Задержка 1 секунда для эффекта загрузки
}

function updateUI() {
    const data = translations[currentLang];
    
    // Обновляем кнопку
    document.getElementById('signal-btn').innerText = data.btn;

    // Если число сгенерировано
    if (currentNumber !== null) {
        document.getElementById('generated-number').innerText = currentNumber;
        
        // Логика текста "Ok - ставь..."
        if (currentLang === 'RU') {
            let blockWord = "блоков";
            if (currentNumber === 1) blockWord = "блок";
            else if (currentNumber >= 2 && currentNumber <= 4) blockWord = "блока";
            
            document.getElementById('result-text').innerText = `${data.okPlace} ${currentNumber} ${blockWord} в ряд`;
        } else {
            document.getElementById('result-text').innerText = `${data.okPlace} ${currentNumber} ${data.inRow}`;
        }
        
        // Инструкция опускается ниже числа
        document.getElementById('instruction-text').innerText = data.instruction;
    } else {
        // Начальное состояние
        document.getElementById('instruction-text').innerText = data.instruction;
    }
}

// Запуск при старте
updateUI();
