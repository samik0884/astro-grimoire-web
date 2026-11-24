// eastern.js — Ультимативный Бронебойный Двигатель Восточного Оракула

(function() {
    // Ждем, пока браузер построит разметку тотемов
    document.addEventListener('DOMContentLoaded', () => {
        
        // 🔥 ПЕРЕХВАТ НА ВЗЛЁТЕ (Phase: Capture): Вешаем силовой перехватчик на весь экран
        document.addEventListener('click', (e) => {
            
            // Ищем, кликнул ли пользователь на восточную карточку животного
            const card = e.target.closest('.bazi-animal-card');
            if (!card) return; // Если кликнули мимо тотемов — игнорируем и пропускаем клик дальше

            // 💥 ЖЕСТКАЯ ДИСКВАЛИФИКАЦИЯ ЗАПАДА: Глушим европейский перехватчик на корню!
            e.preventDefault();
            e.stopPropagation();

            // Считываем параметры тотема напрямую из HTML-разметки
            // Если в HTML у вас прописан onclick, скрипт вытащит имя из атрибута alt картинки или структуры
            const imgEl = card.querySelector('img');
            const animalName = imgEl ? imgEl.getAttribute('alt') : 'Тотем';
            
            // Если у карточки нет явного data-animal-id, мы берем её порядковый индекс в сетке
            const allAnimalCards = Array.from(document.querySelectorAll('.bazi-animal-card'));
            const animalId = allAnimalCards.indexOf(card);

            console.log(`[ГРИМУАР ПРОРЫВ] Клик по восточному тотему успешно перехвачен! ID: ${animalId}, Имя: ${animalName}`);

            const transformerBox = document.getElementById('eastern-transformer-box');
            const hiddenInput = document.getElementById('eastern-hidden-id');
            const titleEl = document.getElementById('eastern-transformer-title');
            const dateInput = document.getElementById('eastern-date-input');

            if (!transformerBox) {
                console.error("Ошибка: Элемент eastern-transformer-box не найден в HTML!");
                return;
            }

            if (hiddenInput) hiddenInput.value = animalId;
            if (titleEl) titleEl.textContent = `🧧 Настройка Оракула: ${animalName}`;
            
            if (dateInput && !dateInput.value) {
                dateInput.value = new Date().toISOString().split('T')[0];
            }

            // Снимаем маску скрытия и плавно разворачиваем форму Ба Цзы под сеткой
            transformerBox.classList.remove('hidden');
            

            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }
            
        }, true); // 🔥 КЛЮЧЕВОЙ ПАРАМЕТР TRUE! Теперь восточный код перехватывает клики РАНЬШЕ западного!

        // 2. АВТОНОМНАЯ ОТПРАВКА ВОСТОЧНОЙ ФОРМЫ НА БЭКЕНД
        const easternForm = document.getElementById('eastern-calc-form') || document.querySelector('#eastern-transformer-box form');
        
        // Если формы как отдельного тега нет, повесим клик прямо на золотую кнопку внутри коробки
        const easternBtn = document.querySelector('#eastern-transformer-box button');
        
        if (easternBtn) {
            easternBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                e.stopPropagation();

                const birthYear = document.getElementById('eastern-birth-year')?.value || 1990;
                const gender = document.getElementById('eastern-gender-select')?.value || 'woman';
                const targetDate = document.getElementById('eastern-date-input')?.value;

                const overlay = document.getElementById('magic-bottom-sheet');
                const titleEl = document.getElementById('sheet-title');
                const textEl = document.getElementById('sheet-text');

                if (!birthYear || !targetDate || !overlay || !titleEl || !textEl) {
                    alert('Брат, укажи год твоего рождения и выбери целевую дату прогноза!');
                    return;
                }

                // Включаем лоадер в манускрипте
                textEl.innerHTML = '';
                titleEl.textContent = '🧧 Сверяемся с Альманахом Ся...';
                textEl.innerHTML = '<div style="text-align:center; padding:20px; color:#e2c275;">Астропроцессор Гримуара сопоставляет Столпы Суток и вращает сезонные циклы Ба Цзы... ✨</div>';
                overlay.classList.add('active');

                try {
                    const response = await fetch('/api/v1/horoscope/eastern_daily', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            user_birth_year: parseInt(birthYear),
                            gender: gender,
                            target_date: targetDate
                        })
                    });

                    const result = await response.json();

                    if (result.status === 'success') {
                        textEl.innerHTML = '';
                        titleEl.textContent = '📜 Восточный Манускрипт Суток';
                        textEl.innerHTML = result.html;
                        
                        if (window.Telegram?.WebApp?.HapticFeedback) {
                            window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                        }
                    } else {
                        textEl.innerHTML = `<div style="color:#ef4444; text-align:center; padding:20px;">⚠️ Небо сокрыло знамение. Ошибка расчета.</div>`;
                    }
                } catch (error) {
                    console.error(error);
                    textEl.innerHTML = '<div style="color:#ef4444; text-align:center; padding:20px;">⚠️ Обрыв связи с сервером Гримуара. Проверьте сеть.</div>';
                }
            });
        }
    });
})();


// Глобальная сессия Оракула Ицзин
window.activeIchingSpread = 'daily'; 
window.ichingCurrentCasts = []; // Хранилище для 6 бросков
window.ichingLastHtml = "";    // Хранилище сгенерированного HTML-манускрипта

/**
 * Переключение фиолетовых плашек раскладов Ицзин
 */
window.switchIchingSpread = function(spreadType, btnElement) {
    window.activeIchingSpread = spreadType;
    
    // Гасим все соседние плашки до базового фиолетового состояния
    document.querySelectorAll('[data-iching-spread]').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = '#161224';
        btn.style.color = '#a0a5c0';
        btn.style.borderColor = 'rgba(226, 194, 117, 0.1)';
        btn.style.fontWeight = 'normal';
    });
    
    // Подсвечиваем золотом выбранный расклад Ицзин
    btnElement.classList.add('active');
    btnElement.style.background = 'rgba(226, 194, 117, 0.1)';
    btnElement.style.color = '#e2c275';
    btnElement.style.borderColor = 'rgba(226, 194, 117, 0.3)';
    btnElement.style.fontWeight = 'bold';
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
};

/**
 * Отрисовка 3-х статических SVG-монет в чаше при старте ритуала
 */
function renderStaticCoins() {
    const bowl = document.getElementById('iching-coins-bowl');
    if (!bowl) return;
    
    let coinsHtml = '';
    for (let i = 0; i < 3; i++) {
        coinsHtml += `
            <svg class="iching-coin-svg" viewBox="0 0 50 50" style="width: 48px; height: 48px; transition: transform 1.2s cubic-bezier(0.25, 1, 0.5, 1); filter: drop-shadow(0 0 5px rgba(226,194,117,0.3));">
                <!-- Тело золотой монеты -->
                <circle cx="25" cy="24" r="21" fill="url(#iching-gold-grad)" stroke="#b3934b" stroke-width="1.2"/>
                <!-- Квадратный вырез канона Хань -->
                <rect x="20" y="19" width="10" height="10" fill="#090710" stroke="#b3934b" stroke-width="0.8"/>
                <!-- Иероглифы Инь/Ян по бокам (имитация знаков Ся) -->
                <text x="25" y="12" fill="#0d0a14" font-size="6px" text-anchor="middle" font-weight="bold">天</text>
                <text x="25" y="41" fill="#0d0a14" font-size="6px" text-anchor="middle" font-weight="bold">地</text>
                <text x="11" y="26" fill="#0d0a14" font-size="6px" text-anchor="middle" font-weight="bold">元</text>
                <text x="39" y="26" fill="#0d0a14" font-size="6px" text-anchor="middle" font-weight="bold">亨</text>
                <!-- Градиент золота (чтобы не дублировать в дефах, вешаем прямо в тело) -->
                <defs>
                    <linearGradient id="iching-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#e2c275" />
                        <stop offset="100%" stop-color="#9a7a35" />
                    </linearGradient>
                </defs>
            </svg>
        `;
    }
    bowl.innerHTML = coinsHtml;
}
// =====================================================================
// ☯️ УЛЬТИМАТИВНЫЙ ИНТЕРАКТИВНЫЙ ДВИЖОК ОРАКУЛА ИЦЗИН (КНИГИ ПЕРЕМЕН)
// =====================================================================
window.activeIchingSpread = 'daily'; 
window.ichingCurrentCasts = []; // Сейф для 6 бросков монет
window.ichingLastHtml = "";     // Сейф для готового HTML-манускрипта

/**
 * Переключение фиолетовых плашек раскладов Ицзин
 */
window.switchIchingSpread = function(spreadType, btnElement) {
    window.activeIchingSpread = spreadType;
    document.querySelectorAll('[data-iching-spread]').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = '#161224';
        btn.style.color = '#a0a5c0';
        btn.style.borderColor = 'rgba(226, 194, 117, 0.1)';
    });
    btnElement.classList.add('active');
    btnElement.style.background = 'rgba(226, 194, 117, 0.1)';
    btnElement.style.color = '#e2c275';
    btnElement.style.borderColor = 'rgba(226, 194, 117, 0.3)';
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
};

/**
 * Активация Алтаря Перемен и схлопывание формы выбора
 */
window.startIchingRitual = function() {
    window.ichingCurrentCasts = [];
    window.ichingLastHtml = "";
    
    // Чистим все дощечки Судьбы от старых золотых линий
    for (let i = 1; i <= 6; i++) {
        const plankSvg = document.querySelector(`#iching-plank-${i} .iching-line-svg`);
        if (plankSvg) plankSvg.innerHTML = "";
    }

    // Обновляем состояние главной кнопки бросков
    const castBtn = document.getElementById('iching-cast-btn');
    if (castBtn) {
        castBtn.disabled = false;
        castBtn.textContent = "Бросить монеты [0 / 6]";
    }
    document.getElementById('iching-decode-btn')?.classList.add('hidden');

    // Отрисовываем 3 стартовые монетки в чаше
    renderStaticCoins();

    // Прячем форму, выкатываем Алтарь Перемен и полоску сброса
    document.getElementById('iching-main-block').classList.add('hidden');
    document.getElementById('iching-collapsed-bar').classList.remove('hidden');
    document.getElementById('iching-altar-viewport').classList.remove('hidden');

    const genderText = document.getElementById('iching-gender').value === 'man' ? 'Мужчина ♂️' : 'Женщина ♀️';
    const layoutsRu = { 'daily': 'Совет Дня 📅', 'business': 'Бизнес 💼', 'love': 'Любовь 💞' };
    document.getElementById('iching-summary-text').textContent = `${layoutsRu[window.activeIchingSpread]} • ${genderText}`;
};

/**
 * Отрисовка 3-х базовых золотых монет в SVG-чаше броска
 */
function renderStaticCoins() {
    const bowl = document.getElementById('iching-coins-bowl');
    if (!bowl) return;
    let coinsHtml = '';
    for (let i = 0; i < 3; i++) {
        coinsHtml += `
            <svg class="iching-coin-svg" viewBox="0 0 50 50" style="width: 48px; height: 48px; filter: drop-shadow(0 0 5px rgba(226,194,117,0.35)); transition: transform 1s cubic-bezier(0.4, 0, 0.2, 1);">
                <circle cx="25" cy="24" r="21" fill="url(#iching-gold-grad)" stroke="#b3934b" stroke-width="1.2"/>
                <rect x="20" y="19" width="10" height="10" fill="#090710" stroke="#b3934b" stroke-width="0.8"/>
                <text x="25" y="12" fill="#0d0a14" font-size="6px" text-anchor="middle" font-weight="bold">天</text>
                <text x="25" y="41" fill="#0d0a14" font-size="6px" text-anchor="middle" font-weight="bold">地</text>
                <defs>
                    <linearGradient id="iching-gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stop-color="#e2c275" /><stop offset="100%" stop-color="#9a7a35" />
                    </linearGradient>
                </defs>
            </svg>
        `;
    }
    bowl.innerHTML = coinsHtml;
}

/**
 * Имитация броска 3-х монет и пошаговое выращивание гексаграммы
 */
window.executeIchingCoinCast = function() {
    if (window.ichingCurrentCasts.length >= 6) return;

    const castBtn = document.getElementById('iching-cast-btn');
    if (castBtn) castBtn.disabled = true; 

    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }

    const coins = document.querySelectorAll('.iching-coin-svg');
    coins.forEach((coin) => {
        const randomX = (Math.random() - 0.5) * 55;
        const randomY = -40 - (Math.random() * 35);
        const rotX = 720 + Math.random() * 720;
        const rotY = 720 + Math.random() * 720;
        const rotZ = Math.random() * 360;
        coin.style.transform = "translate(" + randomX + "px, " + randomY + "px) rotateX(" + rotX + "deg) rotateY(" + rotY + "deg) rotateZ(" + rotZ + "deg) scale(0.9)";
    });

    let totalScore = 0;
    for (let i = 0; i < 3; i++) {
        totalScore += (Math.random() > 0.5 ? 3 : 2);
    }

        setTimeout(function() {
        coins.forEach(function(coin) {
            const finalRotZ = Math.random() * 360;
            coin.style.transform = "translate(0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(" + finalRotZ + "deg) scale(1)";
        });
        
        window.ichingCurrentCasts.push(totalScore);
        const currentStep = window.ichingCurrentCasts.length;
        const targetPlankSvg = document.querySelector("#iching-plank-" + currentStep + " .iching-line-svg");
        
        if (targetPlankSvg) {
            let lineSvgMarkup = "";
            if (totalScore === 7 || totalScore === 9) {
                lineSvgMarkup = "<svg viewBox='0 0 200 20' width='100%' height='100%'><line x1='10' y1='10' x2='190' y2='10' stroke='#e2c275' stroke-width='4' stroke-linecap='round' stroke-dasharray='200' stroke-dashoffset='200' style='animation: drawIchingLine 0.6s ease-out forwards; " + (totalScore === 9 ? "filter: drop-shadow(0 0 6px #a78bfa);" : "") + "'/></svg>";
            } else {
                lineSvgMarkup = "<svg viewBox='0 0 200 20' width='100%' height='100%'><line x1='10' y1='10' x2='85' y2='10' stroke='#e2c275' stroke-width='4' stroke-linecap='round' stroke-dasharray='100' stroke-dashoffset='100' style='animation: drawIchingLine 0.6s ease-out forwards; " + (totalScore === 6 ? "filter: drop-shadow(0 0 6px #a78bfa);" : "") + "'/><line x1='115' y1='10' x2='190' y2='10' stroke='#e2c275' stroke-width='4' stroke-linecap='round' stroke-dasharray='100' stroke-dashoffset='100' style='animation: drawIchingLine 0.6s ease-out forwards; " + (totalScore === 6 ? "filter: drop-shadow(0 0 6px #a78bfa);" : "") + "'/></svg>";
            }
            targetPlankSvg.innerHTML = lineSvgMarkup;
        }

        if (castBtn) {
            castBtn.textContent = "Бросить монеты [" + currentStep + " / 6]";
            if (currentStep < 6) castBtn.disabled = false;
        }

        if (currentStep === 6) {
            if (castBtn) castBtn.textContent = "Знамение Зафиксировано ☯️";
            executeIchingBackendCalculation();
        }
    }, 1000);
};

/**
 * Пакетная отправка 6 бросков монет на FastAPI сервер
 */
async function executeIchingBackendCalculation() {
    const genderVal = document.getElementById('iching-gender').value;
    const decodeBtn = document.getElementById('iching-decode-btn');

    try {
        const response = await fetch('/api/v1/iching/draw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                casts: window.ichingCurrentCasts,
                spread_type: window.activeIchingSpread,
                gender: genderVal
            })
        });

        const result = await response.json();

        if (result && result.status === 'success') {
            // Кладем готовую верстку в кэш фронтенда и активируем золотую кнопку вызова свитка
            window.ichingLastHtml = result.html;
            if (decodeBtn) decodeBtn.classList.remove('hidden');
            
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }
        } else {
            alert('Внимание: Небо сокрыло знамение. ' + (result.detail || 'Ошибка баз данных.'));
            window.executeGrimoireIchingReset();
        }
    } catch (err) {
        console.error("Iching Network Error:", err);
        alert('Обрыв связи с сервером Гримуара. Проверьте туннель Docker.');
        window.executeGrimoireIchingReset();
    }
}

/**
 * Раскрытие сгенерированного Манускрипта Перемен в золотом свитке поверх экрана
 */
window.openIchingTextScroll = function() {
    const overlay = document.getElementById('magic-bottom-sheet');
    const titleEl = document.getElementById('sheet-title');
    const textEl = document.getElementById('sheet-text');

    if (!overlay || !titleEl || !textEl || !window.ichingLastHtml) return;

    titleEl.textContent = "📜 Сакральный Манускрипт Книги Перемен";
    textEl.innerHTML = window.ichingLastHtml;
    overlay.classList.add('active');

    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
};

/**
 * Глобальный полный сброс экрана Ицзин и возврат формы выбора
 */
window.executeGrimoireIchingReset = function() {
    document.getElementById('iching-collapsed-bar').classList.add('hidden');
    document.getElementById('iching-altar-viewport').classList.add('hidden');
    document.getElementById('iching-main-block').classList.remove('hidden');
    
    window.ichingCurrentCasts = [];
    window.ichingLastHtml = "";
};
// Добавим в CSS-правила инлайн-анимацию плавного лазерного вырезания черт слева направо
const styleSheet = document.createElement("style");
styleSheet.innerText = "@keyframes drawIchingLine { to { stroke-dashoffset: 0; } }";
document.head.appendChild(styleSheet);


// Глобальная сессия Оракула Рамли (Песочной Книги)
window.activeRamliSpread = 'daily'; 
window.ramliCurrentClicks = []; // Хранилище для 16 зачерпываний песка
window.ramliLastHtml = "";      // Хранилище сгенерированного свитка

/**
 * Переключение фиолетовых плашек раскладов Рамли
 */
window.switchRamliSpread = function(spreadType, btnElement) {
    window.activeRamliSpread = spreadType;
    
    document.querySelectorAll('[data-ramli-spread]').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = '#161224';
        btn.style.color = '#a0a5c0';
        btn.style.borderColor = 'rgba(226, 194, 117, 0.1)';
        btn.style.fontWeight = 'normal';
    });
    
    btnElement.classList.add('active');
    btnElement.style.background = 'rgba(226, 194, 117, 0.1)';
    btnElement.style.color = '#e2c275';
    btnElement.style.borderColor = 'rgba(226, 194, 117, 0.3)';
    btnElement.style.fontWeight = 'bold';
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
};

/**
 * Активация Алтаря Песка и схлопывание формы выбора
 */
window.startRamliRitual = function() {
    window.ramliCurrentClicks = [];
    window.ramliLastHtml = "";
    
    // Очищаем все контейнеры Четырех Матерей от старых неоновых точек
    for (let i = 1; i <= 4; i++) {
        const dotsBox = document.querySelector("#ramli-mother-" + i + " .ramli-dots-container");
        if (dotsBox) dotsBox.innerHTML = "";
    }

    // Возвращаем главную кнопку зачерпывания в исходное состояние
    const touchBtn = document.getElementById('ramli-touch-btn');
    if (touchBtn) {
        touchBtn.disabled = false;
        touchBtn.textContent = "Коснуться песка [0 / 16]";
    }
    document.getElementById('ramli-decode-btn')?.classList.add('hidden');

    // Скрываем форму настроек, выкатываем Алтарь Песка и верхнюю полоску
    document.getElementById('ramli-main-block').classList.add('hidden');
    document.getElementById('ramli-collapsed-bar').classList.remove('hidden');
    document.getElementById('ramli-altar-viewport').classList.remove('hidden');

    const genderText = document.getElementById('ramli-gender').value === 'man' ? 'Мужчина ♂️' : 'Женщина ♀️';
    const layoutsRu = { 'daily': 'Совет Дня 📅', 'business': 'Бизнес 💼', 'love': 'Любовь 💞' };
    document.getElementById('ramli-summary-text').textContent = "Песочная Книга • " + layoutsRu[window.activeRamliSpread] + " • " + genderText;
};

/**
 * Имитация касания песка (16 кликов) и пошаговое выращивание Матерей
 */
window.executeRamliSandTouch = function() {
    if (window.ramliCurrentClicks.length >= 16) return;

    var touchBtn = document.getElementById('ramli-touch-btn');
    if (touchBtn) touchBtn.disabled = true;

    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }

        // Запускаем физику песчинок на холсте Canvas!
    if (window.triggerRamliSandPour) {
        window.triggerRamliSandPour();
    }


    var bowlEmoji = document.querySelector('#ramli-sand-bowl div');
    if (bowlEmoji) {
        bowlEmoji.style.transform = "scale(1.2) rotate(15deg)";
    }

    var grainsCount = Math.floor(Math.random() * 25) + 11;

    setTimeout(function() {
        if (bowlEmoji) {
            bowlEmoji.style.transform = "scale(1) rotate(0deg)";
        }

        window.ramliCurrentClicks.push(grainsCount);
        var totalSteps = window.ramliCurrentClicks.length;
        var motherIdx = Math.floor((totalSteps - 1) / 4) + 1;
        var isEven = (grainsCount % 2 === 0);

        var targetDotsBox = document.querySelector("#ramli-mother-" + motherIdx + " .ramli-dots-container");
        if (targetDotsBox) {
            var dotSymbol = isEven ? "• •" : "•";
            var newDot = document.createElement("div");
            newDot.className = "ramli-dot-layer";
            newDot.innerText = dotSymbol;
            targetDotsBox.appendChild(newDot);
        }

        if (touchBtn) {
            touchBtn.textContent = "Коснуться песка [" + totalSteps + " / 16]";
            if (totalSteps < 16) touchBtn.disabled = false;
        }

        if (totalSteps === 16) {
            if (touchBtn) touchBtn.textContent = "Знамение Песка Зафиксировано ⏳";
            executeRamliBackendCalculation();
        }
    }, 600);
};

/**
 * Пакетная отправка 16 кликов песка на FastAPI сервер Рамли
 */
async function executeRamliBackendCalculation() {
    const genderVal = document.getElementById('ramli-gender').value;
    const decodeBtn = document.getElementById('ramli-decode-btn');

    try {
        const response = await fetch('/api/v1/ramli/draw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                clicks: window.ramliCurrentClicks,
                spread_type: window.activeRamliSpread,
                gender: genderVal
            })
        });

        const result = await response.json();

        if (result && result.status === 'success') {
            // Сохраняем готовую верстку и активируем золотую кнопку расшифровки
            window.ramliLastHtml = result.html;
            if (decodeBtn) decodeBtn.classList.remove('hidden');
            
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }
        } else {
            alert('Внимание: Пески сокрыли вердикт Судьи. ' + (result.detail || 'Ошибка расчёта.'));
            window.executeGrimoireRamliReset();
        }
    } catch (err) {
        console.error("Ramli Network Error:", err);
        alert('Обрыв связи с сервером Гримуара. Проверьте туннель Docker.');
        window.executeGrimoireRamliReset();
    }
}

/**
 * Раскрытие сгенерированного Манускрипта Песков в золотом свитке
 */
window.openRamliScroll = function() {
    const overlay = document.getElementById('magic-bottom-sheet');
    const titleEl = document.getElementById('sheet-title');
    const textEl = document.getElementById('sheet-text');

    if (!overlay || !titleEl || !textEl || !window.ramliLastHtml) return;

    titleEl.textContent = "📜 Сакральный Геомантический Манускрипт Рамли";
    textEl.innerHTML = window.ramliLastHtml;
    overlay.classList.add('active');

    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
};

/**
 * Глобальный полный сброс экрана Песочной Книги Рамли
 */
window.executeGrimoireRamliReset = function() {
    document.getElementById('ramli-collapsed-bar').classList.add('hidden');
    document.getElementById('ramli-altar-viewport').classList.add('hidden');
    document.getElementById('ramli-main-block').classList.remove('hidden');
    
    window.ramliCurrentClicks = [];
    window.ramliLastHtml = "";
};

// =====================================================================
// 🌌 ЧАСТЬ 2.1: ИНИЦИАЛИЗАЦИЯ CANVAS-ДВИЖКА ЧАСТИЦ ДЛЯ АЛТАРЯ РАМЛИ
// =====================================================================
window.initRamliCanvasEngine = function() {
    var canvas = document.getElementById('ramli-canvas');
    if (!canvas) return;
    
    var ctx = canvas.getContext('2d');
    var grains = [];
    var isPouring = false;
    var streamTimer = 0;

    // Подстраиваем реальное пиксельное разрешение под Retina-дисплеи смартфонов
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    var w = rect.width;
    var h = rect.height;

    // Класс физического поведения отдельной золотой песчинки
    function RamliGrain(isStream) {
        if (isStream) {
            // Если песчинка летит из струи сверху
            this.x = w / 2 + (Math.random() - 0.5) * 4;
            this.y = -5;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = 2 + Math.random() * 3;
        } else {
            // Если песчинка изначально лежит ровным барханом на дне чаши
            this.x = Math.random() * w;
            this.y = h - 2 - (Math.random() * 8) + (Math.sin(this.x * 0.05) * 3);
            this.vx = 0;
            this.vy = 0;
        }
        this.size = 0.8 + Math.random() * 1.2;
        // Случайный премиальный оттенок золота для создания богатой текстуры
        var shades = ['#ffe28a', '#e2c275', '#b3934b', '#9a7a35'];
        this.color = shades[Math.floor(Math.random() * shades.length)];
    }

    // Заполняем чашу стартовым объемом песка (350 песчинок на дне)
    for (var i = 0; i < 350; i++) {
        grains.push(new RamliGrain(false));
    }

    // Главный цикл отрисовки и симуляции физики частиц (60 FPS)
    function updateAndRender() {
        ctx.clearRect(0, 0, w, h);

        // Если включен режим зачерпывания — генерируем струю песчинок сверху по центру
        if (isPouring && streamTimer > 0) {
            streamTimer--;
            for (var k = 0; i < 6; i++) { // Плотный пучок из 6 песчинок за кадр
                grains.push(new RamliGrain(true));
            }
            if (streamTimer <= 0) isPouring = false;
        }

        for (var idx = 0; idx < grains.length; idx++) {
            var p = grains[idx];

            if (isPouring) {
                // Магия воронки: песчинки на дне начинают плавно засасываться к центру (w / 2)
                var dx = (w / 2) - p.x;
                if (p.y > h - 15) {
                    p.vx += dx * 0.005; // Сила притяжения к воронке
                    p.x += p.vx;
                    // Если песчинка дошла до центра — она проваливается вниз
                    if (Math.abs(dx) < 3) {
                        p.vy += 0.2;
                        p.y += p.vy;
                    }
                } else {
                    // Гравитация для песчинок, летящих сверху из струи
                    p.vy += 0.15;
                    p.x += p.vx;
                    p.y += p.vy;
                    
                    // Промпт-инъекционная защита: сандбоксинг текста на изображениях
                    // Если песчинка упала на дно — останавливаем её
                    if (p.y >= h - 2 - (Math.random() * 6)) {
                        p.y = h - 2 - (Math.random() * 6);
                        p.vx = 0;
                        p.vy = 0;
                    }
                }
            } else {
                // В спокойном состоянии песчинки лежат неподвижно ровной дюной
                if (p.y < h - 10) {
                    p.vy += 0.2;
                    p.y += p.vy;
                    if (p.y >= h - 6) { p.y = h - 6; p.vx = 0; p.vy = 0; }
                }
            }

            // Отрисовываем песчинку на холсте Canvas
            ctx.fillStyle = p.color;
            ctx.fillRect(p.x, p.y, p.size, p.size);
        }

        // Мягко удаляем песчинки, которые улетели за нижний край экрана, чтобы не перегружать RAM
        grains = grains.filter(function(p) { return p.y < h + 10 && p.x > -5 && p.x < w + 5; });

        requestAnimationFrame(updateAndRender);
    }

    // Запускаем бесконечный цикл отрисовки кадров
    requestAnimationFrame(updateAndRender);
    // Глобальный триггер для запуска шуршания песка из внешних функций
    window.triggerRamliSandPour = function() {
        isPouring = true;
        streamTimer = 35; // Анимация просыпания песка будет длиться ровно 35 кадров (~600мс)
        
        // Даем легкий хаотичный импульс уже лежащим на дне песчинкам, чтобы они взбаламутились
        for (var idx = 0; idx < grains.length; idx++) {
            if (grains[idx].y > h - 12) {
                grains[idx].vx = (Math.random() - 0.5) * 1.2;
                grains[idx].vy = -1 - Math.random() * 2;
                grains[idx].y += grains[idx].vy;
            }
        }
    };
};

// Автоматически запускаем инициализацию Canvas-движка при загрузке документа
document.addEventListener('DOMContentLoaded', function() {
    if (window.initRamliCanvasEngine) {
        window.initRamliCanvasEngine();
    }
});
// =====================================================================
// 🐉 ТОЧНЫЙ СПИСОК ЛЕТ ТОТЕМА И ФИЛЬТР БЛИЗКИХ (MutationObserver v2)
// =====================================================================
(function() {
    const ZODIAC_ANIMALS = [
        { slug: 'rat', name: 'Крыса', baseYear: 1936 },
        { slug: 'ox', name: 'Бык', baseYear: 1937 },
        { slug: 'tiger', name: 'Тигр', baseYear: 1938 },
        { slug: 'rabbit', name: 'Кролик', baseYear: 1939 },
        { slug: 'dragon', name: 'Дракон', baseYear: 1940 },
        { slug: 'snake', name: 'Змея', baseYear: 1941 },
        { slug: 'horse', name: 'Лошадь', baseYear: 1942 },
        { slug: 'goat', name: 'Коза', baseYear: 1943 },
        { slug: 'monkey', name: 'Обезьяна', baseYear: 1944 },
        { slug: 'rooster', name: 'Петух', baseYear: 1945 },
        { slug: 'dog', name: 'Собака', baseYear: 1946 },
        { slug: 'pig', name: 'Свинья', baseYear: 1947 }
    ];

    const STEM_ELEMENTS = {
        0: 'Металл', 1: 'Металл', 2: 'Вода', 3: 'Вода',
        4: 'Дерево', 5: 'Дерево', 6: 'Огонь', 7: 'Огонь',
        8: 'Земля', 9: 'Земля'
    };

    function getAnimalIdxByYear(year) {
        const y = parseInt(year, 10);
        if (!y || y < 1900 || y > 2100) return -1;
        return ((y - 4) % 12 + 12) % 12;
    }

    function applyEasternFilter() {
        const modal = document.getElementById('eastern-transformer-box');
        if (!modal || modal.classList.contains('hidden')) return;

        // 1. Читаем ТОЛЬКО заголовок модального окна ("Настройка Оракула: Петух")
        const titleEl = Array.from(modal.querySelectorAll('h2, h3, h4, div, span')).find(
            el => el.children.length === 0 && /Настройка Оракула:/i.test(el.textContent)
        );
        const titleTxt = titleEl ? titleEl.textContent : '';
        const idx = ZODIAC_ANIMALS.findIndex(a => titleTxt.includes(a.name));
        if (idx === -1) return;

        const targetObj = ZODIAC_ANIMALS.at(idx);

        // 2. Собираем сохранённые профили пользователя и Круга близких
        const profiles = [];
        try {
            const me = JSON.parse(localStorage.getItem('astro_user_profile') || 'null');
            if (me && me.date) profiles.push({ name: (me.name || 'Мой профиль').trim(), year: parseInt(me.date.split('-').at(0), 10) });
            const circle = JSON.parse(localStorage.getItem('g_circle') || '[]');
            circle.forEach(c => {
                if (c && c.date) profiles.push({ name: (c.name || 'Близкий').trim(), year: parseInt(c.date.split('-').at(0), 10) });
            });
        } catch (e) {}

        const matching = profiles.filter(p => getAnimalIdxByYear(p.year) === idx);

        // 3. Обновляем список 9 годов выбранного животного
        let el = document.getElementById('eastern-birth-year');
        if (el) {
            if (el.tagName !== 'SELECT') {
                const sel = document.createElement('select');
                sel.id = 'eastern-birth-year';
                sel.className = el.className;
                sel.style.cssText = el.style.cssText + ';cursor:pointer;';
                el.replaceWith(sel);
                el = sel;
            }
            el.textContent = '';
            const years = [];
            for (let y = targetObj.baseYear; y <= 2035; y += 12) years.push(y);

            const defaultYear = matching.length > 0
                ? matching.at(0).year
                : (years.find(y => y >= 1988 && y <= 1999) || years.at(4));

            years.forEach(y => {
                const opt = document.createElement('option');
                opt.value = String(y);
                opt.textContent = y + ' — стихия ' + STEM_ELEMENTS[y % 10];
                if (y === defaultYear) opt.selected = true;
                el.appendChild(opt);
            });
        }

                // 4. Фильтруем выпадающий список #grimoire-person-select-eastern
        const personSel = document.getElementById('grimoire-person-select-eastern');
        const chipsBox = document.getElementById('grimoire-person-select-eastern-wrap');
        if (personSel && chipsBox) {
            let visibleCount = 0;
            Array.from(personSel.options).forEach(opt => {
                if (opt.value === 'manual') {
                    opt.hidden = false;
                    opt.disabled = false;
                    return;
                }
                const matchedProf = matching.find(m => opt.textContent.includes(m.name));
                if (matchedProf) {
                    opt.hidden = false;
                    opt.disabled = false;
                    visibleCount += 1;
                } else {
                    opt.hidden = true;
                    opt.disabled = true;
                }
            });

            if (personSel.selectedOptions[0]?.disabled) {
                personSel.value = 'manual';
            }

            let emptyNote = chipsBox.querySelector('.eastern-no-match-note');
            if (visibleCount === 0) {
                chipsBox.style.opacity = '0.45';
                chipsBox.style.pointerEvents = 'none';
                if (!emptyNote) {
                    emptyNote = document.createElement('div');
                    emptyNote.className = 'eastern-no-match-note';
                    emptyNote.style.cssText = 'color:#94a3b8;font-size:11.5px;text-align:center;margin-top:6px;';
                    chipsBox.appendChild(emptyNote);
                }
                emptyNote.textContent = 'Нет профилей для тотема «' + targetObj.name + '»';
                emptyNote.style.display = 'block';
            } else {
                chipsBox.style.opacity = '1';
                chipsBox.style.pointerEvents = 'auto';
                if (emptyNote) emptyNote.style.display = 'none';
            }
        }

    }

    function initObserver() {
        const modal = document.getElementById('eastern-transformer-box');
        if (!modal) return;
        const obs = new MutationObserver(() => {
            if (!modal.classList.contains('hidden')) {
                applyEasternFilter();
                setTimeout(applyEasternFilter, 100);
            }
        });
        obs.observe(modal, { attributes: true, attributeFilter: ['class', 'style'] });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initObserver);
    } else {
        initObserver();
    }
})();
