// 1. Глобальный перехватчик ошибок для отладки
window.onerror = function(message, source, lineno, colno, error) {
    console.error(`Ошибка JS: ${message} (строка ${lineno})`);
    return false;
};

// 2. Инициализация Telegram WebApp
const tg = window.Telegram?.WebApp;
if (tg) {
    tg.ready();
    tg.expand();
}

const API_BASE = ''; 

// 3. Функция отправки запросов на FastAPI бэкенд
async function sendRequest(endpoint, data) {
    const payload = {
        ...data,
        init_data: tg ? tg.initData : ""
    };
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Ошибка запроса:', error);
        throw error;
    }
}

// 4. ОФИЦИАЛЬНЫЙ РЕНДЕРИНГ РЕЗУЛЬТАТОВ АСТРОПРОЦЕССОРА В МАНУСКРИПТ
async function renderResult(elementId, result) {
    const overlay = document.getElementById('magic-bottom-sheet');
    const titleEl = document.getElementById('sheet-title');
    const textEl = document.getElementById('sheet-text');

    if (!overlay || !titleEl || !textEl) return;

    // Словарь красивых мистических заголовков для каждого типа расчета
    const astroTitles = {
        'natal-result': '🪐 Манускрипт Натальной Карты',
        'transit-result': '⚡ Манускрипт Космических Транзитов',
        'synastry-result': '💖 Манускрипт Совместимости Душ',
        'solar-result': '☀️ Манускрипт Солнечного Соляра'
    };

    // Задаем заголовок в зависимости от того, какая форма сработала
    titleEl.textContent = astroTitles[elementId] || '📜 Астрологическое Откровение';

    // Обработка ошибок соединения или сервера
    if (typeof result === 'string') {
        textEl.innerHTML = `<div style="color: #ef4444; text-align: center; margin-top: 20px;"><b>⚠️ Ошибка расчета:</b><br>${result}</div>`;
        overlay.classList.add('active');
        return;
    }

    if (result && result.status === 'success') {
        const outputData = result.data || result.message || 'Расчет выполнен успешно';
        
        // Форматируем красивый вывод: если пришел объект, превращаем его в аккуратные строки с отступами
        let formattedText = '';
        if (typeof outputData === 'object') {
            formattedText = Object.entries(outputData)
                .map(([key, val]) => `<p style="margin-bottom: 8px;"><strong style="color: #e2c275;">✦ ${key}:</strong> ${val}</p>`)
                .join('');
        } else {
            formattedText = outputData.replace(/\n/g, '<br>');
        }

        // Вливаем готовый текст в свиток!
        textEl.innerHTML = `<div style="padding: 10px; font-size: 15px; line-height: 1.6;">${formattedText}</div>`;
        
        // Эффектно раскрываем свиток поверх экрана!
        overlay.classList.add('active');

        // Мощная тактильная вибрация Telegram для эпохального расчета
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
    } else {
        // Если бэкенд вернул ошибку в JSON
        const errorDetail = result?.detail || 'Не удалось расшифровать траектории планет. Проверьте введенные данные.';
        textEl.innerHTML = `<div style="color: #ef4444; text-align: center; margin-top: 20px;"><b>⚠️ Внимание звезд:</b><br>${errorDetail}</div>`;
        overlay.classList.add('active');
    }
}

// 5. Инициализация интерфейса и логики
document.addEventListener('DOMContentLoaded', () => {
        // =====================================================================
    // 🪐 УЛЬТИМАТИВНЫЙ 3D-РАДАР ОБЛОЖКИ: РАНДОМНЫЕ СВИТКИ + ГИРОСКОП
    // =====================================================================
    const coverSvgContainer = document.getElementById('cover-transit-svg');
    const transitTextEl = document.getElementById('cover-dynamic-advice');
    const wheelContainer = document.querySelector('.cover-transit-wheel-container');
    const adviceLabelEl = document.querySelector('.central-advice-label');
    
    // Бросаем кубик: 1 - Натал, 2 - Транзит, 3 - Синастрия
    const randomMode = Math.floor(Math.random() * 3) + 1;

    // 1. ПОДГРУЖАЕМ СЛУЧАЙНЫЙ СОВЕТ В СЕРДЦЕВИНУ КОЛЕЦ
    if (transitTextEl) {
        fetch('/api/v1/cover-advice')
            .then(response => response.json())
            .then(result => {
                if (result && result.status === 'success' && result.advice) {
                    transitTextEl.textContent = result.advice.replace(/[«»]/g, '');
                }
            })
            .catch(e => { transitTextEl.textContent = "Слушайте шепот ветра, в нем скрыты ответы."; });
    }

    // 2. СТРОИМ САКРАЛЬНУЮ ГЕОМЕТРИЮ В ЗАВИСИМОСТИ ОТ ВЫПАВШЕГО РЕЖИМА
    if (coverSvgContainer && wheelContainer) {
        // Рандомные натальные параметры
        const rYear = Math.floor(Math.random() * (2005 - 1975 + 1)) + 1975;
        const rMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const rDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        const rHour = String(Math.floor(Math.random() * 24)).padStart(2, '0');
        
        const natalDate = `${rYear}-${rMonth}-${rDay}`;
        const natalTime = `${rHour}:00`;
        const todayStr = new Date().toISOString().split('T')[0];

        // Временный перехват GetElementById, чтобы подружить родные движки с обложкой
        const originalContainerGet = document.getElementById;
        document.getElementById = function(id) {
            if (id === 'transit-svg-container' || id === 'natal-svg-container' || id === 'synastry-svg-container') {
                return coverSvgContainer;
            }
            return originalContainerGet.call(document, id);
        };

        if (randomMode === 1) {
            // --- РЕЖИМ РАДИКСА (НАТАЛ) ---
            if (adviceLabelEl) adviceLabelEl.textContent = "Натальная";
            wheelContainer.style.setProperty('background', 'radial-gradient(circle, #130f24 0%, #090710 100%)', 'important');
            wheelContainer.style.setProperty('border-color', 'rgba(167, 139, 250, 0.3)', 'important');
            wheelContainer.style.setProperty('box-shadow', '0 0 25px rgba(108, 92, 231, 0.15), inset 0 0 20px rgba(0,0,0,0.6)', 'important');

            fetch('/api/v1/natal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: natalDate, time: natalTime, gender: "woman", lat: 55.7558, lon: 37.6173 })
            })
            .then(res => res.json())
            .then(result => {
                if (result && result.status === 'success' && typeof window.renderNatalChart === 'function') {
                    coverSvgContainer.innerHTML = '';
                    window.renderNatalChart(result.graph_data);
                }
            }).catch(e => console.error(e));

        } else if (randomMode === 2) {
            // --- РЕЖИМ ТРАНЗИТА (ИЗУМРУД) ---
            if (adviceLabelEl) adviceLabelEl.textContent = "Транзит";
            wheelContainer.style.setProperty('background', 'radial-gradient(circle, #0e1a14 0%, #090710 100%)', 'important');
            wheelContainer.style.setProperty('border-color', 'rgba(16, 185, 129, 0.3)', 'important');
            wheelContainer.style.setProperty('box-shadow', '0 0 25px rgba(16, 185, 129, 0.15), inset 0 0 20px rgba(0, 0, 0, 0.7)', 'important');

            fetch('/api/v1/transit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ natal_date: natalDate, natal_time: natalTime, transit_date: todayStr, gender: "woman", lat: 55.7558, lon: 37.6173 })
            })
            .then(res => res.json())
            .then(result => {
                if (result && result.status === 'success' && typeof window.renderTransitChart === 'function') {
                    coverSvgContainer.innerHTML = '';
                    window.renderTransitChart(result.graph_data, todayStr);
                }
            }).catch(e => console.error(e));

        } else {
            // --- РЕЖИМ СИНАСТРИИ (ЛАВАНДОВЫЙ СПЛАВ) ---
            if (adviceLabelEl) adviceLabelEl.textContent = "Синастрия";
            wheelContainer.style.setProperty('background', 'radial-gradient(circle, #1c0f1e 0%, #090710 100%)', 'important');
            wheelContainer.style.setProperty('border-color', 'rgba(167, 139, 250, 0.3)', 'important');
            wheelContainer.style.setProperty('box-shadow', '0 0 25px rgba(244, 114, 182, 0.15), inset 0 0 20px rgba(0, 0, 0, 0.7)', 'important');

            // Вторая случайная дата для партнера Б
            const rYear2 = Math.floor(Math.random() * (2005 - 1975 + 1)) + 1975;
            const rMonth2 = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
            const rDay2 = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
            const partnerDate = `${rYear2}-${rMonth2}-${rDay2}`;

            fetch('/api/v1/synastry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ a_date: natalDate, a_time: natalTime, a_lat: 55.7558, a_lon: 37.6173, b_date: partnerDate, b_time: "12:00", b_lat: 55.7558, b_lon: 37.6173 })
            })
            .then(res => res.json())
            .then(result => {
                if (result && result.status === 'success' && typeof window.renderSynastryChart === 'function') {
                    coverSvgContainer.innerHTML = '';
                    window.renderSynastryChart(result.graph_data);
                }
            }).catch(e => console.error(e));
        }

        // Возвращаем стандартный метод на место после отработки сетевых потоков
        setTimeout(() => { document.getElementById = originalContainerGet; }, 1500);
    }

    // 3. МАГИЯ 3D ПАРАЛЛАКСА: Считываем наклоны гироскопа смартфона
    const adviceBox = document.querySelector('.cover-central-advice-box');
    if (window.DeviceOrientationEvent && coverSvgContainer && adviceBox) {
        window.addEventListener('deviceorientation', (event) => {
            // Глушим расчет, если телефон лежит плашмя на столе
            if (event.beta === null || event.gamma === null) return;
            
            // Рассчитываем углы смещения (ограничиваем амплитуду до 15 градусов)
            const tiltX = Math.min(Math.max(event.gamma, -15), 15); // Наклон влево-вправо
            const tiltY = Math.min(Math.max(event.beta - 45, -15), 15); // Наклон вперед-назад (с учетом наклона рук в 45 град)

            // Смещаем кольца планет плавно и несильно ( translateZ(10px) )
            coverSvgContainer.style.transform = `translateZ(10px) translateX(${tiltX * 0.4}px) translateY(${tiltY * 0.4}px)`;
            
            // Смещаем текст в центре Гораздо СИЛЬНЕЕ ( translateZ(35px) ), создавая иллюзию глубокого 3D-разрыва слоев!
            adviceBox.style.transform = `translateZ(35px) translateX(${tiltX * 0.9}px) translateY(${tiltY * 0.9}px)`;
        });
    }
    // =====================================================================

    // =====================================================================


  // --- Синергия главных экранов Гримуара ---
const navButtons = Array.from(document.querySelectorAll('.bottom-nav .nav-btn'));
const screenContents = Array.from(document.querySelectorAll('.screen-content'));

navButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        if (btn.classList.contains('active')) return;

        const currentScreen = document.querySelector('.screen-content.active');
        const targetScreenId = btn.getAttribute('data-screen');
        const targetScreen = document.getElementById(targetScreenId);

        if (currentScreen && targetScreen) {
            currentScreen.classList.remove('active');
            currentScreen.classList.add('hidden');
            targetScreen.classList.add('active');
            targetScreen.classList.remove('hidden');
        }

        navButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    });
});





                                                               // --- Б) Универсальное переключение подвкладок внутри любого экрана ---
    document.querySelectorAll('.sub-tab-nav').forEach(tabNav => {
        const subBtns = tabNav.querySelectorAll('.sub-tab-btn');
        
        subBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const parentSection = tabNav.closest('.screen-content');
                const targetSubTabId = btn.getAttribute('data-subtab');

                // 🔥 ГЛАВНЫЙ ИСПРАВЛЕННЫЙ МАНЕВР: Глушим ВСЕ вкладки через класс hidden
                subBtns.forEach(b => b.classList.remove('active'));
                parentSection.querySelectorAll('.sub-tab-content').forEach(c => {
                    c.classList.remove('active');
                    c.classList.add('hidden'); // Надежно прячем вкладку
                });

                // Включаем строго выбранную подвкладку
                btn.classList.add('active');
                const targetContent = parentSection.querySelector(`#${targetSubTabId}`);
                if (targetContent) {
                    targetContent.classList.add('active');
                    targetContent.classList.remove('hidden'); // 🔥 Снимаем маску скрытия!
                }

                // Виброотклик Telegram
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                }
            });
        });
    });


                      // --- В) Автопоиск городов через OpenStreetMap Nominatim API ---
    const cityInputs = document.querySelectorAll('.city-input');

    cityInputs.forEach(input => {
        const wrapper = input.closest('.city-autocomplete-wrapper');
        if (!wrapper) return;

        const dropdown = wrapper.querySelector('.city-dropdown');
        let debounceTimer = null;

        input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            clearTimeout(debounceTimer);

            if (query.length < 2) {
                if (dropdown) {
                    dropdown.classList.add('hidden');
                    dropdown.innerHTML = '';
                }
                return;
            }

            debounceTimer = setTimeout(() => {
                fetchCities(query, dropdown, wrapper);
            }, 400);
        });
    });

    async function fetchCities(query, dropdown, wrapper) {
        if (!dropdown) return;
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&accept-language=ru`;
            const response = await fetch(url);
            const data = await response.json();
            renderCityDropdown(data, dropdown, wrapper);
        } catch (err) {
            console.error('Ошибка получения городов:', err);
        }
    }

    function renderCityDropdown(cities, dropdown, wrapper) {
        dropdown.innerHTML = '';

        if (!cities || cities.length === 0) {
            dropdown.classList.add('hidden');
            return;
        }

        cities.forEach(city => {
            const item = document.createElement('div');
            item.className = 'dropdown-item';

            // 1. Извлекаем название города / поселка
            let cityName = (city.address.city || city.address.town || city.address.village || city.address.hamlet || city.display_name.split(',')[0]).trim();
            
            // Зачищаем префиксы типов населенных пунктов
            cityName = cityName.replace(/^(город|поселок|посёлок|село|пгт|r)\b[\.\s]*/i, '');

            // 1. Извлекаем регион
            let region = (city.address.state || city.address.state_district || city.address.region || city.address.county || '').trim();

            // 2. Нормализуем Крым
            region = region.replace(/Автономная Республика Крым/gi, 'Крым');

            // 3. Формируем чистое имя
            let cleanLabel = cityName;
            if (region && !region.toLowerCase().includes(cityName.toLowerCase()) && !cityName.toLowerCase().includes(region.toLowerCase())) {
                cleanLabel = `${cityName}, ${region}`;
            }

                       // 4. ГАРАНТИРОВАННЫЙ ФИЛЬТР: режем любые упоминания стран и убираем висячие запятые
cleanLabel = cleanLabel
    .replace(/,\s*(Украина|Россия|Belarus|Беларусь|Україна|Russia).*$/i, '')
    .replace(/(Украина|Россия|Belarus|Беларусь|Україна|Russia)/gi, '')
    .replace(/,\s*$/, '')
    .trim();

            item.textContent = cleanLabel;

            item.addEventListener('click', () => {
                const input = wrapper.querySelector('.city-input');
                if (input) input.value = cleanLabel;

                const latVal = parseFloat(city.lat).toFixed(4);
                const lonVal = parseFloat(city.lon).toFixed(4);

                // Подстановка координат в зависимости от текущей формы
                if (wrapper.querySelector('#natal-city')) {
                    document.getElementById('natal-lat').value = latVal;
                    document.getElementById('natal-lon').value = lonVal;
                } else if (wrapper.querySelector('#transit-city')) {
                    document.getElementById('transit-lat').value = latVal;
                    document.getElementById('transit-lon').value = lonVal;
                } else if (wrapper.querySelector('#syna-a-city')) {
                    document.getElementById('syna-a-lat').value = latVal;
                    document.getElementById('syna-a-lon').value = lonVal;
                } else if (wrapper.querySelector('#syna-b-city')) {
                    document.getElementById('syna-b-lat').value = latVal;
                    document.getElementById('syna-b-lon').value = lonVal;
                } else if (wrapper.querySelector('#solar-city')) {
                    document.getElementById('solar-lat').value = latVal;
                    document.getElementById('solar-lon').value = lonVal;
                } else if (wrapper.querySelector('#astro-hours-city')) {
                    document.getElementById('astro-hours-lat').value = latVal;
                    document.getElementById('astro-hours-lon').value = lonVal;
                                } else if (wrapper.querySelector('#astro-hours-city')) {
                    document.getElementById('astro-hours-lat').value = latVal;
                    document.getElementById('astro-hours-lon').value = lonVal;
                } else if (wrapper.querySelector('#adv-city')) {
                    // 🔥 ДОБАВИЛИ ПОДХВАТ ДЛЯ НАШЕГО НОВОГО ТРАНСФОРМЕРА СОВЕТА ДНЯ
                    document.getElementById('adv-lat').value = latVal;
                    document.getElementById('adv-lon').value = lonVal;
                } else if (wrapper.querySelector('#zodiac-city-input')) {
                    document.getElementById('zodiac-lat').value = latVal;
                    document.getElementById('zodiac-lon').value = lonVal;
                } else if (wrapper.querySelector('#moon-city-input')) {
                    document.getElementById('moon-lat').value = latVal;
                    document.getElementById('moon-lon').value = lonVal;
                }






              

               dropdown.classList.add('hidden');
            });

            dropdown.appendChild(item);
        });

        dropdown.classList.remove('hidden');
    }

    // Закрытие выпадушек при клике в пустую область
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.city-autocomplete-wrapper')) {
            document.querySelectorAll('.city-dropdown').forEach(d => d.classList.add('hidden'));
        }
    });

                             // --- Г) Обработка форм Астропроцессора ---

// --- СИНХРОНИЗИРОВАННЫЙ БЛОК НАТАЛЬНОГО ТРАНСФОРМЕРА С СЕТЕВЫМ НАПОЛНЕНИЕМ ---
const natalForm = document.getElementById('natal-form');
if (natalForm) {
    // Временный сейф на фронте для хранения свитков
    window.currentNatalManuscript = null;

    // 1. Перехват отправки формы (Клик по кнопке "Рассчитать")
    natalForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }

        const dateVal = document.getElementById('natal-date').value; // YYYY-MM-DD
        const timeVal = document.getElementById('natal-time').value;
        const genderVal = document.getElementById('natal-gender').value;
        const latVal = parseFloat(document.getElementById('natal-lat').value);
        const lonVal = parseFloat(document.getElementById('natal-lon').value);

        // Пересобираем дату в человеческий формат ДД.ММ.ГГГГ для полоски
        let formattedDate = dateVal;
        if (dateVal && dateVal.includes('-')) {
            const parts = dateVal.split('-');
            if (parts.length === 3) {
                formattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`;
            }
        }
        const genderText = genderVal === 'man' ? 'Мужчина ♂️' : 'Женщина ♀️';

        // Задаем текст лоадера прямо внутрь вьюпорта карты на время запроса
        const svgContainer = document.getElementById('natal-svg-container');
        if (svgContainer) {
            svgContainer.innerHTML = `<div style="text-align:center; color:#a78bfa; font-size:14px; font-style:italic; padding:20px;">
                Астропроцессор Гримуара считывает координаты... ✨<br>
                Идет сонастройка сфер...
            </div>`;
        }

        // Анимируем интерфейс — схлопываем форму, открываем карту
        natalForm.classList.add('hidden');
        document.getElementById('natal-collapsed-bar')?.classList.remove('hidden');
        document.getElementById('natal-map-viewport')?.classList.remove('hidden');
        
        // Кнопку расшифровки пока тушим, пока не прилетит ответ
        const decodeBtn = document.getElementById('natal-decode-btn');
        decodeBtn?.classList.add('hidden');

        try {
            // Шлем точный запрос на бэкенд, включая наш новый врезанный пол!
            const result = await sendRequest('/api/v1/natal', {
                date: dateVal,
                time: timeVal,
                gender: genderVal,
                lat: latVal,
                lon: lonVal
            });

            console.log("Ответ Астропроцессора принят:", result);

            if (result && result.status === 'success') {
                // Прячем лоадер, закидываем данные в сейф памяти телефона
                if (svgContainer) svgContainer.innerHTML = ''; 
                window.currentNatalManuscript = result.manuscript;
                window.currentNatalNakshatra = result.detected_nakshatra;

                // Вливаем отфильтрованные данные в верхнюю полоску
                const summaryEl = document.getElementById('natal-summary-text');
                if (summaryEl) {
                    summaryEl.textContent = `${formattedDate} • ${genderText}`;
                }

                // Включаем золотую кнопку расшифровки строго под колесом!
                decodeBtn?.classList.remove('hidden');

                // Легкий тактильный импульс — расчет готов!
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                }
                
                    // Активируем графический движок и чертим карту по градусам из RAM сервера!
                if (window.renderNatalChart) {
                    window.renderNatalChart(result.graph_data);
                }

            } else {
                if (svgContainer) {
                    svgContainer.innerHTML = `<div style="color:#ef4444; text-align:center; padding:20px;">⚠️ Ошибка звезд: ${result?.detail || 'Не удалось рассчитать карту.'}</div>`;
                }
            }
        } catch (error) {
            console.error("Сбой сети Астропроцессора:", error);
            if (svgContainer) {
                svgContainer.innerHTML = `<div style="color:#ef4444; text-align:center; padding:20px;">⚠️ Обрыв связи с сервером. Проверьте сеть.</div>`;
            }
        }
    });

    // 2. Обработчик клика по золотой кнопке «Расшифровать Манускрипт»
    const decodeBtn = document.getElementById('natal-decode-btn');
    if (decodeBtn) {
        decodeBtn.addEventListener('click', () => {
            const overlay = document.getElementById('magic-bottom-sheet');
            const titleEl = document.getElementById('sheet-title');
            const textEl = document.getElementById('sheet-text');

            if (!overlay || !titleEl || !textEl || !window.currentNatalManuscript) return;

            // Извлекаем 3 главы из памяти фронта
            const m = window.currentNatalManuscript;
            const nakshatra = window.currentNatalNakshatra || "ашвини";

            // Собираем Книгу Личности с золотыми фасками и ведической накшатрой
            const fullManuscriptHTML = `
                <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px dashed rgba(226,194,117,0.2); padding-bottom: 12px;">
                    <span style="font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; display: block;">Ведическая стоянка Луны</span>
                    <span style="font-size: 18px; color: #ffe066; font-weight: bold; text-transform: capitalize; display: block; margin-top: 4px; letter-spacing: 0.5px;">🌕 Накшатра: ${nakshatra}</span>
                </div>
                
                <div style="margin-bottom: 22px;">
                    <h4 style="color: #e2c275; margin-bottom: 10px; font-size: 16px; border-left: 2px solid #e2c275; padding-left: 8px;">Глава I: Манускрипт Личности</h4>
                    <div style="font-size: 14.5px; line-height: 1.6; color: #cbd5e1;">${m.chapter1}</div>
                </div>
                
                <div style="margin-bottom: 22px;">
                    <h4 style="color: #a78bfa; margin-bottom: 10px; font-size: 16px; border-left: 2px solid #a78bfa; padding-left: 8px;">Глава II: Космические Сферы Жизни</h4>
                    <div style="font-size: 14.5px; line-height: 1.6; color: #cbd5e1;">${m.chapter2}</div>
                </div>
                
                <div style="margin-bottom: 10px;">
                    <h4 style="color: #ffe066; margin-bottom: 10px; font-size: 16px; border-left: 2px solid #ffe066; padding-left: 8px;">Глава III: Астральное Противоядие</h4>
                    <div style="font-size: 14.5px; line-height: 1.6; color: #cbd5e1; background: rgba(226,194,117,0.03); border: 1px solid rgba(226,194,117,0.12); padding: 12px; border-radius: 12px;">${m.chapter3}</div>
                </div>
            `;

            // Наливаем Книгу в твой царственный золотой свиток!
            titleEl.textContent = "🪐 Персональный Манускрипт Судьбы";
            textEl.innerHTML = fullManuscriptHTML;

            // Эффектно раскрываем свиток поверх экрана!
            overlay.classList.add('active');

            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
            }
        });
    }

    // 3. Обработчик клика по крестику (Сброс карты и возврат формы)
    const resetCross = document.getElementById('natal-reset-cross');
    if (resetCross) {
        resetCross.addEventListener('click', () => {
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
            }
            document.getElementById('natal-collapsed-bar')?.classList.add('hidden');
            document.getElementById('natal-map-viewport')?.classList.add('hidden');
            natalForm.classList.remove('hidden');
            
            // Зануляем память при сбросе
            window.currentNatalManuscript = null;
        });
    }
}

                                  
    // =====================================================================
    // ⚡ 2. АВТОНОМНЫЙ ГЕО-ПОИСК ДЛЯ ВКЛАДКИ ТРАНЗИТОВ
    // =====================================================================
    const tCityInput = document.getElementById('transit-city');
    const tDropdown = document.getElementById('transit-city-dropdown');

    if (tCityInput && tDropdown) {
        let tDebounceTimer = null;

        tCityInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            clearTimeout(tDebounceTimer);
            if (query.length < 2) {
                tDropdown.classList.add('hidden');
                tDropdown.innerHTML = '';
                return;
            }
            tDebounceTimer = setTimeout(async () => {
                try {
                    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&accept-language=ru`;
                    const response = await fetch(url);
                    const data = await response.json();
                    
                    tDropdown.innerHTML = '';
                    if (!data || data.length === 0) { tDropdown.classList.add('hidden'); return; }
                    data.forEach(city => {
                        const item = document.createElement('div');
                        item.className = 'dropdown-item';
                        
                        let cityName = (city.address.city || city.address.town || city.address.village || city.address.hamlet || city.display_name.split(',')[0]).trim();
                        cityName = cityName.replace(/^(город|поселок|посёлок|село|пгт|r)\b[\.\s]*/i, '');
                        
                        let region = (city.address.state || city.address.state_district || city.address.region || city.address.county || '').trim();
                        region = region.replace(/Автономная Республика Крым/gi, 'Крым');
                        
                        let cleanLabel = cityName;
                        if (region && !region.toLowerCase().includes(cityName.toLowerCase()) && !cityName.toLowerCase().includes(region.toLowerCase())) {
                            cleanLabel = `${cityName}, ${region}`;
                        }
                        cleanLabel = cleanLabel.replace(/,\s*(Украина|Россия|Belarus|Беларусь|Україна|Russia).*/i, '').trim();

                        item.textContent = cleanLabel;
                        
                        // 🔥 ХИРУРГИЧЕСКИЙ КЛИК-ФИКС: Все переменные строго tDropdown!
                        item.addEventListener('click', (evt) => {
                            evt.stopPropagation();
                            evt.preventDefault();
                            
                            tCityInput.value = cleanLabel;
                            
                            // Записываем координаты строго в скрытые поля транзита
                            const latField = document.getElementById('transit-lat');
                            const lonField = document.getElementById('transit-lon');
                            
                            if (latField) latField.value = parseFloat(city.lat).toFixed(4);
                            if (lonField) lonField.value = parseFloat(city.lon).toFixed(4);
                            
                            // Жестко захлопываем шторку списка!
                            tDropdown.innerHTML = '';
                            tDropdown.classList.add('hidden');
                            console.log(`🎯 Город транзита успешно зафиксирован: ${cleanLabel}`);
                        });
                        tDropdown.appendChild(item); // ИСПРАВЛЕНО: Буква t на месте!
                    });
                    tDropdown.classList.remove('hidden'); // ИСПРАВЛЕНО: Буква t на месте!
                } catch (err) { console.error('Ошибка в гео-сетке транзита:', err); }
            }, 400);
        });

        document.addEventListener('click', (e) => {
            if (e.target !== tCityInput && e.target !== tDropdown) {
                tDropdown.classList.add('hidden');
            }
        });
    }

    // Автономный сборщик данных для глобального вызова
window.getTransitData = function() {
    return {
        transitDateVal: document.getElementById('transit-date')?.value,
        natalDateVal: document.getElementById('transit-birth-date')?.value,
        natalTimeVal: document.getElementById('transit-birth-time')?.value || "12:00",
        genderVal: document.getElementById('transit-embedded-gender')?.value || "man",
        // 🔥 УБРАЛИ EMBEDDED — СТРОГО СИНХРОННО С INDEX.HTML!
        latVal: parseFloat(document.getElementById('transit-lat')?.value),
        lonVal: parseFloat(document.getElementById('transit-lon')?.value)
    };
};

        

   });

// =====================================================================
// 👥 ЧАСТЬ 1: ГЕО-ПОИСК ДЛЯ ПАРТНЕРОВ А И Б (main.js)
// =====================================================================
const synastryForm = document.getElementById('synastry-form');
if (synastryForm) {
    window.currentSynastryManuscript = null;

    // 1. АВТОНОМНЫЙ ГЕО-ПОИСК ДЛЯ ПАРТНЕРА А (МУЖЧИНА)
    const sCityA = document.getElementById('syna-a-city');
    const sDropdownA = document.getElementById('syna-a-city-dropdown');
    if (sCityA && sDropdownA) {
        let timerA = null;
        sCityA.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            clearTimeout(timerA);
            if (query.length < 2) { 
                sDropdownA.classList.add('hidden'); 
                sDropdownA.innerHTML = ''; 
                return; 
            }
            timerA = setTimeout(async () => {
                try {
                    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&accept-language=ru`;
                    const response = await fetch(url);
                    const data = await response.json();
                    sDropdownA.innerHTML = '';
                    if (!data || data.length === 0) { sDropdownA.classList.add('hidden'); return; }
                    data.forEach(city => {
                        const item = document.createElement('div');
                        item.className = 'dropdown-item';
                        let cName = (city.address.city || city.address.town || city.address.village || city.address.hamlet || city.display_name.split(',')[0]).trim();
                        cName = cName.replace(/^(город|поселок|посёлок|село|пгт|r)\b[\.\s]*/i, '');
                        let reg = (city.address.state || city.address.state_district || city.address.region || city.address.county || '').trim().replace(/Автономная Республика Крым/gi, 'Крым');
                        let label = reg && !reg.toLowerCase().includes(cName.toLowerCase()) ? `${cName}, ${reg}` : cName;
                        label = label.replace(/,\s*(Украина|Россия|Belarus|Беларусь|Україна|Russia).*/i, '').trim();
                        item.textContent = label;
                        item.addEventListener('click', (evt) => {
                            evt.stopPropagation(); evt.preventDefault();
                            sCityA.value = label;
                            document.getElementById('syna-a-lat').value = parseFloat(city.lat).toFixed(4);
                            document.getElementById('syna-a-lon').value = parseFloat(city.lon).toFixed(4);
                            sDropdownA.innerHTML = ''; sDropdownA.classList.add('hidden');
                        });
                        sDropdownA.appendChild(item);
                    });
                    sDropdownA.classList.remove('hidden');
                } catch (err) { console.error('Ошибка гео А:', err); }
            }, 400);
        });
    }

    // 2. АВТОНОМНЫЙ ГЕО-ПОИСК ДЛЯ ПАРТНЕРА Б (ЖЕНЩИНА)
    const sCityB = document.getElementById('syna-b-city');
    const sDropdownB = document.getElementById('syna-b-city-dropdown');
    if (sCityB && sDropdownB) {
        let timerB = null;
        sCityB.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            clearTimeout(timerB);
            if (query.length < 2) { sDropdownB.classList.add('hidden'); sDropdownB.innerHTML = ''; return; }
            timerB = setTimeout(async () => {
                try {
                    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&accept-language=ru`;
                    const response = await fetch(url);
                    const data = await response.json();
                    sDropdownB.innerHTML = '';
                    if (!data || data.length === 0) { sDropdownB.classList.add('hidden'); return; }
                    data.forEach(city => {
                        const item = document.createElement('div');
                        item.className = 'dropdown-item';
                        let cName = (city.address.city || city.address.town || city.address.village || city.address.hamlet || city.display_name.split(',')[0]).trim();
                        cName = cName.replace(/^(город|поселок|посёлок|село|пгт|r)\b[\.\s]*/i, '');
                        let reg = (city.address.state || city.address.state_district || city.address.region || city.address.county || '').trim().replace(/Автономная Республика Крым/gi, 'Крым');
                        let label = reg && !reg.toLowerCase().includes(cName.toLowerCase()) ? `${cName}, ${reg}` : cName;
                        label = label.replace(/,\s*(Украина|Россия|Belarus|Беларусь|Україна|Russia).*/i, '').trim();
                        item.textContent = label;
                        item.addEventListener('click', (evt) => {
                            evt.stopPropagation(); evt.preventDefault();
                            sCityB.value = label;
                            document.getElementById('syna-b-lat').value = parseFloat(city.lat).toFixed(4);
                            document.getElementById('syna-b-lon').value = parseFloat(city.lon).toFixed(4);
                            sDropdownB.innerHTML = ''; sDropdownB.classList.add('hidden');
                        });
                        sDropdownB.appendChild(item);
                    });
                    sDropdownB.classList.remove('hidden');
                } catch (err) { console.error('Ошибка гео Б:', err); }
            }, 400);
        });
    }
    // =====================================================================
    // 👥 ЧАСТЬ 2: СБОР ДАННЫХ И ТРАНСФОРМАЦИЯ ИНТЕРФЕЙСА (main.js)
    // =====================================================================
    window.executeGrimoireSynastryScan = async function() {
        console.log("🚀 Глобальный штурм Синастрических Сфер запущен...");
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }

        const dateA = document.getElementById('syna-a-date').value;
        const timeA = document.getElementById('syna-a-time').value;
        const latA = parseFloat(document.getElementById('syna-a-lat').value);
        const lonA = parseFloat(document.getElementById('syna-a-lon').value);

        const dateB = document.getElementById('syna-b-date').value;
        const timeB = document.getElementById('syna-b-time').value;
        const latB = parseFloat(document.getElementById('syna-b-lat').value);
        const lonB = parseFloat(document.getElementById('syna-b-lon').value);

        if (!dateA || !dateB || isNaN(latA) || isNaN(latB)) {
            alert('Брат, заполни параметры обеих карт и выбери города!');
            return;
        }

        const fDateA = dateA.split('-').reverse().slice(0,2).join('.');
        const fDateB = dateB.split('-').reverse().slice(0,2).join('.');

        const viewport = document.getElementById('synastry-map-viewport');
        const svgContainer = document.getElementById('synastry-svg-container');
        const decodeBtn = document.getElementById('synastry-decode-btn');

        synastryForm.classList.add('hidden');
        document.getElementById('synastry-collapsed-bar')?.classList.remove('hidden');
        if (viewport) viewport.classList.remove('hidden');
        if (decodeBtn) decodeBtn.classList.add('hidden');
        document.getElementById('synastry-pdf-download-btn')?.classList.remove('hidden');


        document.getElementById('synastry-summary-text').textContent = `${fDateA} ♂️  ➔  ${fDateB} ♀️`;

        if (svgContainer) {
            svgContainer.innerHTML = `<div style="text-align:center; color:#a78bfa; font-size:14px; font-style:italic; padding:20px;">
                Астропроцессор Гримуара скрещивает Радиксы... ✨<br>
                Идет сопряжение Анимы и Анимуса...
            </div>`;
        }

        try {
            const result = await sendRequest('/api/v1/synastry', {
                a_date: dateA, a_time: timeA, a_lat: latA, a_lon: lonA,
                b_date: dateB, b_time: timeB, b_lat: latB, b_lon: lonB
            });

            if (result && result.status === 'success') {
                if (svgContainer) svgContainer.innerHTML = '';
                window.currentSynastryManuscript = result.top_events || [];
                
                if (decodeBtn) decodeBtn.classList.remove('hidden');
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                }
                if (window.renderSynastryChart) {
                    window.renderSynastryChart(result.graph_data);
                }
            } else {
                alert('Ошибка: ' + (result?.detail || 'Не удалось сопоставить карты.'));
                window.executeGrimoireSynastryReset();
            }
        } catch (error) {
            alert('Сбой связи с сервером Гримуара.');
            window.executeGrimoireSynastryReset();
        }
    };

    // 4. ГЛОБАЛЬНЫЙ ПРОЦЕССОР СБРОСА КАРТЫ СОВМЕСТИМОСТИ
    window.executeGrimoireSynastryReset = function() {
        console.log("🔄 Сброс Синастрических сфер...");
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
        document.getElementById('synastry-collapsed-bar')?.classList.add('hidden');
        document.getElementById('synastry-map-viewport')?.classList.add('hidden');
        synastryForm.classList.remove('hidden');
        window.currentSynastryManuscript = null;
        document.getElementById('synastry-pdf-download-btn')?.classList.add('hidden');

    };

    // =====================================================================
    // 👥 ЧАСТЬ 3: РАСШИФРОВКА И ВЫВОД В ЗОЛОТОЙ СВИТОК (main.js)
    // =====================================================================
    document.getElementById('synastry-decode-btn')?.addEventListener('click', () => {
        const overlay = document.getElementById('magic-bottom-sheet');
        const titleEl = document.getElementById('sheet-title');
        const textEl = document.getElementById('sheet-text');
        if (!overlay || !titleEl || !textEl || !window.currentSynastryManuscript) return;

        let scrollHTML = `
            <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px dashed rgba(244, 114, 182, 0.2); padding-bottom: 14px;">
                <span style="font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; display: block;">Синастрический Сплав</span>
                <div style="font-size: 15px; color: #a78bfa; font-weight: bold; margin-top: 6px;">Резонанс Двух Психических Миров</div>
            </div>
            <h4 style="color: #e2c275; margin-bottom: 15px; font-size: 16px; border-left: 2px solid #a78bfa; padding-left: 8px; text-transform: uppercase; letter-spacing: 0.5px;">👥 Межкартовые Лазерные Зацепления:</h4>
        `;

        window.currentSynastryManuscript.forEach((evt, idx) => {
            scrollHTML += `
                <div style="margin-bottom: 20px; background: rgba(167, 139, 250, 0.02); border: 1px solid rgba(167, 139, 250, 0.1); border-radius: 12px; padding: 14px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                    <b style="color: #ffe066; font-size: 13px; display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.3px;">${idx + 1}. ⚡ Лазерный Аспект: ${evt.planet} ➔ ${evt.target}</b>
                    <p style="margin: 0; font-size: 14.5px; line-height: 1.6; color: #cbd5e1;">${evt.text}</p>
                </div>
            `;
        });

        titleEl.textContent = "💖 Манускрипт Совместимости Душ";
        textEl.innerHTML = scrollHTML;
        overlay.classList.add('active');
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
    });
} // 🔥 ФИНАЛЬНОЕ ЗАКРЫТИЕ СИНАСТРИЧЕСКОГО КОНТЕКСТА ФОРМЫ!
                                     




                             // Соляр
    const solarForm = document.getElementById('solar-form');
    if (solarForm) {
        solarForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const date = document.getElementById('solar-date').value;
            const time = document.getElementById('solar-time').value;
            const lat = parseFloat(document.getElementById('solar-lat').value);
            const lon = parseFloat(document.getElementById('solar-lon').value);
            const year = parseInt(document.getElementById('solar-year').value);
            try {
                const result = await sendRequest('/api/v1/solar', { date, time, lat, lon, year });
                renderResult('solar-result', result);
            } catch (error) {
                renderResult('solar-result', error.message);
            }
        });
    }

               // Лунный календарь (ПЕРЕВЕДЕН И ЗАКРЕПЛЕН НА ИСТИННЫЙ ГОРОСКОП)
    const moonForm = document.getElementById('moon-form');
    if (moonForm) {
        moonForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const date = document.getElementById('moon-date').value;
            
            // 🔥 СТЫКОВКА С НАШИМ ЭФЕМЕРИДНЫМ МОНОЛИТОМ:
            const sign = "aries"; 
            const gender = document.getElementById('moon-forecast-gender')?.value || "woman";

            // Координаты местоположения строго из лунных скрытых инпутов гео-поиска
            const latVal = document.getElementById('moon-lat')?.value;
            const lonVal = document.getElementById('moon-lon')?.value;
            const lat = latVal ? parseFloat(latVal) : 55.7558;
            const lon = lonVal ? parseFloat(lonVal) : 37.6173;
            
            // Защита от VPN и расчет времени
            const tzOffset = -new Date().getTimezoneOffset() / 60;
            const now = new Date();
            const clientTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

            // Подхватываем элементы нашего царственного свитка-манускрипта
            const overlay = document.getElementById('magic-bottom-sheet');
            const titleEl = document.getElementById('sheet-title');
            const textEl = document.getElementById('sheet-text');

            if (overlay && titleEl && textEl) {
                titleEl.textContent = '✦ Сверяемся со звездами...';
                textEl.innerHTML = '<div style="text-align:center; margin-top:20px; color:#e2c275;">Астропроцессор Гримуара считывает возраст Луны и разворачивает сакральный манифест суток... ✨</div>';
                overlay.classList.add('active');
            }

            try {
                // Шлем запрос на наше сквозное, откалиброванное ядро бэкенда
                const result = await sendRequest('/api/v1/horoscope', {
                    sign: sign,
                    period: 'lunar_day', 
                    gender: gender,
                    date: date,
                    client_time: clientTime,
                    tz_offset: tzOffset,
                    lat: lat,
                    lon: lon
                });
                
                console.log("Гримуар Луна Ответ:", result);

                // 🔥 АВТОНОМНЫЙ ВСЕЯДНЫЙ РЕНДЕРИНГ ЛУННОГО СВИТКА БЕЗ СБОЕВ ОПРЕДЕЛЕНИЯ ПЕРЕМЕННЫХ
                let htmlForecast = "";
                if (result) {
                    if (result.data && result.data.forecast) {
                        htmlForecast = result.data.forecast;
                    } else if (result.forecast) {
                        htmlForecast = result.forecast;
                    } else if (typeof result === 'string') {
                        htmlForecast = result;
                    }
                }

                if (htmlForecast && textEl && titleEl && overlay) {
                    // Торжественно перекрашиваем шапку Манускрипта в лунный лавандовый цвет
                    titleEl.innerHTML = `<span style="color: #a78bfa; font-size: 14px; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;">✦ Сакральный Манускрипт Луны ✦</span>`;
                    
                    // Разворачиваем Свиток-Лего без лишнего мусора
                    textEl.innerHTML = `<div style="padding: 10px; font-size: 15px; line-height: 1.6;">${htmlForecast}</div>`;
                    
                    if (window.Telegram?.WebApp?.HapticFeedback) {
                        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
                    }
                    return; // УСПЕШНЫЙ ВЫХОД
                }

                // Фолбек при пустом или некорректном контенте от сервера
                if (textEl) {
                    textEl.innerHTML = `<div style="color: #ef4444; text-align: center; margin-top: 20px;"><b>⚠️ Внимание звезд:</b><br>${result?.detail || result?.message || 'Не удалось расшифровать траектории планет. Проверьте конфигурацию баз данных.'}</div>`;
                }

            } catch (error) {
                console.error('Moon error:', error);
                if (textEl) textEl.innerHTML = '<div style="color: #ef4444; text-align: center; margin-top: 20px;"><b>⚠️ Ошибка соединения:</b><br>Манускрипт не смог связаться с сервером. Проверьте сеть.</div>';
            }
        });
    }




                                  // --- Д) ОБРАБОТКА КЛИКА ПО ЗНАКАМ ЗОДИАКА ---
    const zodiacCards = document.querySelectorAll('.zodiac-card, .horoscope-card, .grid-item');
    
    zodiacCards.forEach(card => {
        card.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // Получаем знак из атрибута или текста карточки
            let sign = card.getAttribute('data-sign');
            if (!sign) {
                const textElem = card.querySelector('.zodiac-name, p, span');
                sign = textElem ? textElem.textContent.trim() : card.innerText.trim();
            }

            if (tg?.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('light');
            }

            try {
                const result = await sendRequest('/api/v1/horoscope', {
                    sign: sign.toLowerCase(),
                    period: 'daily'
                });

                if (result.status === 'success') {
                    showHoroscopeModal(result.data);
                } else {
                    alert('Ошибка получения прогноза');
                }
            } catch (err) {
                console.error('Ошибка при запросе гороскопа:', err);
                alert('Не удалось загрузить гороскоп');
            }
        });
    });


                       // =====================================================================
// 🪐 СИСТЕМА УПРАВЛЕНИЯ ЭЛИТНЫМИ ПАКЕТАМИ МАТРИЦЫ СУДЬБЫ
// =====================================================================
let activeMatrixDate = "";
let activeMatrixGender = "woman";
let activePackageId = 0; // Текущий выбранный пакет матрицы (1=Базовый, 2=Материя, 3=Хронос)

/**
 * Инициализация расчёта Октаграммы Судьбы (Вызывается по клику на кнопку в HTML)
 */
/**
 * Инициализация расчёта Октаграммы Судьбы
 */
window.calculateMatrixMaster = function() {
    const dateInput = document.getElementById('matrix-date');
    const genderSelect = document.getElementById('matrix-gender');
    
    if (!dateInput || !dateInput.value) {
        alert("Брат, выбери дату своего земного воплощения!");
        return;
    }
    
    // Запоминаем параметры в глобальную сессию
    activeMatrixDate = dateInput.value;
    activeMatrixGender = genderSelect ? genderSelect.value : "woman";
    
    // Пересобираем дату в русский человеческий формат ДД.ММ.ГГГГ для узкой полоски
    let formattedDate = activeMatrixDate;
    if (activeMatrixDate.includes('-')) {
        const parts = activeMatrixDate.split('-');
        if (parts.length === 3) { formattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`; }
    }
    const genderText = activeMatrixGender === 'man' ? 'Мужчина ♂️' : 'Женщина ♀️';

    // 🌟 ХИРУРГИЧЕСКАЯ ТРАНСФОРМАЦИЯ: Исчезновение формы и вылет полосы!
    document.getElementById('matrix-main-form-wrapper').classList.add('hidden');
    document.getElementById('matrix-collapsed-bar').classList.remove('hidden');
    
    // Показываем карту Октаграммы, блок кнопок монетизации и контейнер результатов (с кнопкой PDF)
    document.getElementById('matrix-visualization-block').classList.remove('hidden');
    document.getElementById('matrix-packets-block').classList.remove('hidden');
    document.getElementById('matrix-result').classList.remove('hidden');
    
    // Заливаем текст в узкую шапку
    document.getElementById('matrix-summary-text').textContent = `${formattedDate} • ${genderText}`;

    // Запускаем яркий графический SVG-движок из файла natal_graph.js
    const [y, m, d] = activeMatrixDate.split('-').map(Number);
    if (typeof window.renderMatrixChart === 'function') {
        window.renderMatrixChart(d, m, y);
    }
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
};

/**
 * Обработчик клика по кнопке скачивания PDF-журнала Матрицы Судьбы
 */
document.addEventListener('DOMContentLoaded', () => {
        // =====================================================================
    // 📄 ОБНОВЛЕННЫЙ ЦЕНТР УПРАВЛЕНИЯ PDF ГРИМУАРА (ХАК ДЛЯ ТЕЛЕГРАМА)
    // =====================================================================
    
    // 🃏 Обработчик для Матрицы Судьбы
    const matrixPdfBtn = document.getElementById('matrix-pdf-download-btn');
    if (matrixPdfBtn) {
        matrixPdfBtn.addEventListener('click', async () => {
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
            }

            const dateInput = document.getElementById('matrix-date');
            const genderSelect = document.getElementById('matrix-gender');

            if (!dateInput || !dateInput.value) {
                alert("Брат, выбери дату твоего земного воплощения!");
                return;
            }

            const payload = {
                date: activeMatrixDate || dateInput.value,
                gender: activeMatrixGender || (genderSelect ? genderSelect.value : "woman"),
                package_id: activePackageId || 1
            };

            try {
                // Шлем запрос на бэк и принимаем безопасный JSON со ссылкой
                const response = await fetch('/api/v1/matrix/download-pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

                const data = await response.json(); 
                const absoluteUrl = window.location.origin + data.url;

                // Пробиваем блокировку встроенного браузера Телеграма
                if (window.Telegram?.WebApp) {
                    window.Telegram.WebApp.openLink(absoluteUrl);
                } else {
                    window.open(absoluteUrl, '_blank');
                }
            } catch (err) {
                console.error('Ошибка Матрицы PDF:', err);
                alert(`Не удалось скачать манускрипт матрицы: ${err.message}`);
            }
        });
    }

    // 💖 Обработчик для Синастрии (Совместимости Душ)
    const synastryPdfBtn = document.getElementById('synastry-pdf-download-btn');
    if (synastryPdfBtn) {
        synastryPdfBtn.addEventListener('click', async () => {
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
            }

            // Автономно вытягиваем рассчитанные знаки планет прямо с экрана Синастрии
            const payload = {
                partner1_name: document.getElementById('syna-a-city')?.value ? document.getElementById('syna-a-city').value.split(',')[0].trim() : "Партнер А",
                partner2_name: document.getElementById('syna-b-city')?.value ? document.getElementById('syna-b-city').value.split(',')[0].trim() : "Партнер Б",
                sun_sign_1: window.synastryData?.partner1?.sun || "aries", 
                sun_sign_2: window.synastryData?.partner2?.sun || "libra",
                moon_sign_1: window.synastryData?.partner1?.moon || "scorpio",
                moon_sign_2: window.synastryData?.partner2?.moon || "pisces",
                mars_sign_1: window.synastryData?.partner1?.mars || "aries",
                venus_sign_1: window.synastryData?.partner1?.venus || "taurus",
                mercury_sign_1: window.synastryData?.partner1?.mercury || "gemini",
                mars_sign_2: window.synastryData?.partner2?.mars || "capricorn",
                venus_sign_2: window.synastryData?.partner2?.venus || "aquarius",
                mercury_sign_2: window.synastryData?.partner2?.mercury || "sagittarius"
            };

            try {
                const response = await fetch('/api/v1/synastry/download-pdf', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);

                const data = await response.json();
                const absoluteUrl = window.location.origin + data.url;

                if (window.Telegram?.WebApp) {
                    window.Telegram.WebApp.openLink(absoluteUrl);
                } else {
                    window.open(absoluteUrl, '_blank');
                }
            } catch (err) {
                console.error('Ошибка Синастрии PDF:', err);
                alert(`Не удалось скачать манускрипт совместимости: ${err.message}`);
            }
        });
    }

});

/**
 * Главный обработчик кликов по кнопкам-пакетам Матрицы Судьбы
 * @param {'base' | 'material' | 'chronos'} packetType
 */
window.triggerMatrixPacket = async function(packetType) {
    if (!activeMatrixDate) {
        alert("Сначала введите дату рождения и создайте священную Октаграмму Судьбы!");
        return;
    }

    // Если выбран базовый пакет — пускаем без лишних условий и рекламы
    activePackageId = packetType === 'base' ? 1 : (packetType === 'material' ? 2 : 3);
    if (packetType === 'base') {
        executeMatrixRequest(packetType);
        return;
    }

    // 🔒 ИНТЕРАКТИВНАЯ ЗАГЛУШКА МОНЕТИЗАЦИИ ДЛЯ ЭЛИТНЫХ СВИТКОВ (2 и 3)
    const confirmMessage = packetType === 'material' 
        ? "🌃 Врата Рода сокрыты.\n\nЖелаешь распечатать Элитный Манускрипт Материи за просмотр Рекламы Знамения?"
        : "🌌 Высшее Откровение Хроноса запечатано.\n\nГотов ли ты посмотреть видеопослание Звезд для активации Прогноза?";

    const userAgreed = confirm(confirmMessage);
    
    if (userAgreed) {
        const overlay = document.getElementById('magic-bottom-sheet');
        const titleEl = document.getElementById('sheet-title');
        const textEl = document.getElementById('sheet-text');
        
        if (!overlay || !titleEl || !textEl) return;
        
        // Включаем красивый 5-секундный лоадер симуляции видеорекламы
        titleEl.textContent = "🎬 Считываем Знамение Звезд...";
        textEl.innerHTML = `
            <div style="text-align: center; padding: 40px 20px; color: #a78bfa;">
                <div style="width: 36px; height: 36px; border: 2px solid rgba(167,139,250,0.15); border-top-color: #a78bfa; border-radius: 50%; margin: 0 auto 20px auto; animation: adSpin 1.2s linear infinite;"></div>
                <p style="font-family: 'Philosopher', sans-serif; font-size: 14px; margin: 0; letter-spacing: 0.5px;">Транслируем эфирные потоки рекламы (Осталось 5 сек)...</p>
            </div>
            <style>@keyframes adSpin { to { transform: rotate(360deg); } }</style>
        `;
        overlay.classList.add('active');
        
        // Ровно через 5 секунд реклама ложно "просмотрена", замок падает, и летит запрос!
        setTimeout(() => {
            activePackageId = packetType === 'material' ? 2 : 3;
            executeMatrixRequest(packetType);
        }, 5000);
    }
};

/**
 * Локальный отправитель HTTPS-запроса на нарезку пакетов бэкенда
 * @param {'base' | 'material' | 'chronos'} packetType
 */
async function executeMatrixRequest(packetType) {
    const overlay = document.getElementById('magic-bottom-sheet');
    const titleEl = document.getElementById('sheet-title');
    const textEl = document.getElementById('sheet-text');

    if (!overlay || !titleEl || !textEl) return;

    titleEl.textContent = "✦ Распечатываем Хроники Судьбы...";
    textEl.innerHTML = `
        <div style="text-align: center; padding: 30px; color: #e2c275;">
            <div style="width: 32px; height: 32px; border: 2px solid rgba(226, 194, 117, 0.15); border-top-color: #e2c275; border-radius: 50%; margin: 0 auto 16px auto; animation: matrixSpin 1s linear infinite;"></div>
            <p style="font-family: 'Philosopher', sans-serif; font-size: 14px; margin: 0;">Свитки Гримуара нарезают Арканы по твоему полу...</p>
        </div>
        <style>@keyframes matrixSpin { to { transform: rotate(360deg); } }</style>
    `;
    overlay.classList.add('active');

    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }

    try {
        const response = await fetch(`/api/v1/matrix/${packetType}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                date: activeMatrixDate,
                gender: activeMatrixGender
            })
        });

        const result = await response.json();

        if (result.status === "success") {
            const packetTitles = {
                'base': '⚜️ Персональный Манускрипт Личности',
                'material': '💎 Элитный Манускрипт Материи и Рода',
                'chronos': '🔮 Высшее Откровение Хроноса и Здоровья'
            };
            
            titleEl.textContent = packetTitles[packetType];
            textEl.innerHTML = result.html; // Вшиваем роскошные 5-6 глав, калиброванных под пол!
            
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }
        } else {
            titleEl.textContent = "Знание сокрыто";
            textEl.innerHTML = `<p style="color: #ef4444; text-align: center; padding: 20px;">${result.detail || 'Не удалось сопрячь числовые коды.'}</p>`;
        }
    } catch (error) {
        console.error("Matrix Packet Network Error:", error);
        titleEl.textContent = "Обрыв связи";
        textEl.innerHTML = '<p style="color: #ef4444; text-align: center; padding: 20px;">Хранилище бэкенда недоступно. Проверьте туннель Docker.</p>';
    }
}


                       // Всплывающее модальное окно для гороскопов
function showHoroscopeModal(data) {
    let modal = document.getElementById('horoscope-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'horoscope-modal';
        modal.style.position = 'fixed';
        modal.style.top = '0';
        modal.style.left = '0';
        modal.style.width = '100%';
        modal.style.height = '100%';
        modal.style.backgroundColor = 'rgba(0,0,0,0.7)';
        modal.style.display = 'flex';
        modal.style.alignItems = 'center';
        modal.style.justifyContent = 'center';
        modal.style.zIndex = '9999';
        modal.style.padding = '20px';
        modal.style.boxSizing = 'border-box';
        document.body.appendChild(modal);
    }

    modal.innerHTML = `
        <div style="background: #1e1e2e; color: #fff; padding: 25px; border-radius: 16px; max-width: 400px; width: 100%; position: relative; box-shadow: 0 10px 25px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1);">
            <span class="modal-close" style="position: absolute; top: 10px; right: 15px; font-size: 24px; cursor: pointer; color: #aaa;">&times;</span>
            <div style="font-size: 36px; text-align: center;">${data.symbol || '✨'}</div>
            <h2 style="text-align: center; margin: 10px 0; color: #e2c275;">${data.sign}</h2>
            <hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.1); margin: 15px 0;">
            <div style="font-size: 14px; line-height: 1.6; color: #cdd6f4;">${data.forecast}</div>
        </div>
    `;

    modal.style.display = 'flex';

    modal.querySelector('.modal-close').onclick = () => modal.style.display = 'none';
    modal.onclick = (e) => {
        if (e.target === modal) modal.style.display = 'none';
    };
}

/**
 * Выполнение гадания Таро через API FastAPI с транзитом в единый Свиток
 * @param {'single' | 'pair' | 'triplet'} mode - Режим расклада
 */
async function drawTaro(mode) {
    const cardsContainer = document.getElementById('taro-cards-container');
    const taroMainForm = document.getElementById('taro-main-block');
    const taroCollapsedBar = document.getElementById('taro-collapsed-bar');

    // 🌟 ИСПРАВЛЕНО: Защитное условие больше не требует старый resultBox!
    if (!cardsContainer) return;

    // Подготовка интерфейса перед запросом (показываем магический лоадер на время ответа ИИ)
    cardsContainer.innerHTML = `
        <div style="text-align:center; padding:35px 16px; width:100%; color:#e2c275;">
            <div style="width:36px; height:36px; border:2px solid rgba(226,194,117,0.18); border-top-color:#e2c275; border-radius:50%; margin:0 auto 14px auto; animation:taroWaitSpin 1s linear infinite;"></div>
            <div style="font-family:'Philosopher',serif; font-size:15px; margin-bottom:4px;">✨ Тасуем Старшие Арканы...</div>
            <div style="color:#94a3b8; font-size:12px;">Сплетаем нити прошлого, настоящего и будущего</div>
            <style>@keyframes taroWaitSpin { to { transform: rotate(360deg); } }</style>
        </div>
    `;


    // Считываем выбранный пол с экрана Таро
    const taroGenderSelect = document.getElementById('taro-gender');
    const taroGender = taroGenderSelect ? taroGenderSelect.value : 'woman';

    // АНИМАЦИЯ UI: Схлопываем форму выбора и выкатываем верхнюю полоску параметров
    if (taroMainForm) {
        taroMainForm.classList.add('hidden');
        taroMainForm.style.display = 'none';
    }
    if (taroCollapsedBar) {
        taroCollapsedBar.classList.remove('hidden');
    }

    // Формируем текст для верхней панели-сводки параметров
    const taroLayoutNames = { 'single': 'Карта дня 🔮', 'pair': 'На пару 💞', 'triplet': 'Триплет ⏳' };
    const currentTaroLayout = taroLayoutNames[mode] || 'Расклад Таро';
    const genderText = taroGender === 'man' ? 'Мужчина ♂️' : 'Женщина ♀️';

    const taroSummaryText = document.getElementById('taro-summary-text');
    if (taroSummaryText) {
        taroSummaryText.textContent = `${currentTaroLayout} • ${genderText}`;
    }

    try {
        const response = await fetch('/api/v1/taro/draw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ mode: mode, gender: taroGender })
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();

        if (data.cards && data.cards.length > 0) {
            // 1. Рендерим карты с 3D-структурой, дымом, неоном и кликом
            cardsContainer.innerHTML = data.cards.map((card, index) => {
                const cardImage = card.image_url || (card.image ? `/static/images/taro/${card.image}.webp` : '/static/images/default_card.webp');
                return `
                    <div class="taro-card-wrapper" onclick="flipCard(this)">
                        <div class="taro-card-glow"></div>
                        <div class="taro-card-smoke"></div>
                        <div class="taro-card-item">
                            <div class="taro-card-inner">
                                <div class="taro-card-face taro-card-back">
                                    <img src="/static/images/taro_back.webp" alt="Рубашка"/>
                                </div>
                                <div class="taro-card-face taro-card-front">
                                    <img src="${cardImage}" alt="${card.name}" onerror="this.onerror=null; this.src='/static/images/default_card.webp'" />
                                </div>
                            </div>
                        </div>
                        <div class="taro-card-label">${card.name}</div>
                    </div>
                `;
            }).join('');

            // 2. Выкладываем карты на стол рубашкой вверх с каскадной задержкой
            setTimeout(() => {
                const wrappers = cardsContainer.querySelectorAll('.taro-card-wrapper');
                wrappers.forEach((wrapper, i) => {
                    setTimeout(() => {
                        wrapper.classList.add('dealt');
                        if (window.Telegram?.WebApp?.HapticFeedback) {
                            window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
                        }
                    }, i * 400);
                });
            }, 150);

            // 3. 🌟 ТРАНЗИТ: Сохраняем чистый HTML-текст предсказания в память для глобального Свитка
            window.taroLastInterpretation = data.interpretation;

        } else {
            // Фолбек при ошибке данных через глобальный Свиток
            openGlobalErrorScroll("Не удалось сформировать расклад. Попробуйте еще раз.");
            window.executeGrimoireTaroReset();
        }
    } catch (error) {
        console.error('Taro API Error:', error);
        openGlobalErrorScroll("Ошибка соединения с сервером. Проверьте подключение.");
        window.executeGrimoireTaroReset();
    }
}

/**
 * Вспомогательный вывод ошибок в глобальный Свиток
 */
function openGlobalErrorScroll(message) {
    const overlay = document.getElementById('magic-bottom-sheet');
    const titleEl = document.getElementById('sheet-title');
    const textEl = document.getElementById('sheet-text');
    if (overlay && titleEl && textEl) {
        titleEl.textContent = "🔮 Чертоги Арканов";
        textEl.innerHTML = `<div class='error-msg' style='text-align:center; padding:20px; color:#ef4444;'>${message}</div>`;
        overlay.classList.add('active');
    }
}

/**
 * Переворот карты, вспышка неона ребром, гашение дыма и проявление названия
 */
function flipCard(cardWrapper) {
    const cardItem = cardWrapper.querySelector('.taro-card-item');
    const labelEl = cardWrapper.querySelector('.taro-card-label');
    const smokeEl = cardWrapper.querySelector('.rune-card-smoke') || cardWrapper.querySelector('.taro-card-smoke');
    
    const overlay = document.getElementById('magic-bottom-sheet');
    const titleEl = document.getElementById('sheet-title');
    const textEl = document.getElementById('sheet-text');

    if (cardItem.classList.contains('flipped')) return;

    cardItem.classList.add('flipped');
    
    if (smokeEl) {
        smokeEl.style.opacity = '0';
    }

    setTimeout(() => {
        cardWrapper.classList.add('edge-flash');
        setTimeout(() => cardWrapper.classList.remove('edge-flash'), 250);
    }, 280);

    setTimeout(() => {
        if (labelEl) {
            labelEl.classList.add('revealed');
        }

        // Проверяем, все ли карты Таро открыты на столе
        const allWrappers = document.querySelectorAll('.taro-card-wrapper');
        const allFlipped = Array.from(allWrappers).every(w => 
            w.querySelector('.taro-card-item').classList.contains('flipped')
        );

        // 🔥 КУЛЬМИНАЦИЯ: Если перевернулась ПОСЛЕДНЯЯ карта — распахиваем чистый Свиток!
        if (allFlipped && overlay && titleEl && textEl) {
            setTimeout(() => {
                // 🪐 СНАЙПЕРСКИЙ МАНЕВР: забираем ЧИСТЫЙ текст из памяти, минуя грязный taro-result
                const cleanInterpretation = window.taroLastInterpretation || "Пророчество сокрыто в тумане времени...";
                
                titleEl.textContent = "📜 Манускрипт Пророчества Арканов Таро";
                textEl.innerHTML = cleanInterpretation;
                
                overlay.classList.add('active');
            }, 600);
        }
    }, 550);
}

/**
 * 🔥 ГЛОБАЛЬНЫЙ ПРОЦЕССОР СБРОСА ЭКРАНА ТАРО (Клик по крестику возврата)
 */
window.executeGrimoireTaroReset = function() {
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }

    const taroMainForm = document.getElementById('taro-main-block');
    const taroCollapsedBar = document.getElementById('taro-collapsed-bar');

    // Схлопываем верхнюю сворачиваемую плашку параметров
    if (taroCollapsedBar) taroCollapsedBar.classList.add('hidden');
    
    // Возвращаем форму выбора раскладов Таро на экран
    if (taroMainForm) {
        taroMainForm.classList.remove('hidden');
        taroMainForm.style.display = 'block';
    }

    // Полностью очищаем стол от старых карт
    const cardsContainer = document.getElementById('taro-cards-container');
    if (cardsContainer) cardsContainer.innerHTML = '';
    
    // Сбрасываем кэш последней интерпретации
    window.taroLastInterpretation = null;
};


/**
 * 🔥 ГЛОБАЛЬНЫЙ ПРОЦЕССОР СБРОСА ЭКРАНА ТАРО (Клик по крестику возврата)
 */
window.executeGrimoireTaroReset = function() {
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }

    const taroMainForm = document.getElementById('taro-main-block');
    const taroCollapsedBar = document.getElementById('taro-collapsed-bar');

    // Схлопываем верхнюю сворачиваемую плашку
    if (taroCollapsedBar) taroCollapsedBar.classList.add('hidden');
    
    // Возвращаем форму выбора раскладов Таро на экран
    if (taroMainForm) {
        taroMainForm.classList.remove('hidden');
        taroMainForm.style.display = 'block';
    }

    // Полностью очищаем стол от старых карт
    const cardsContainer = document.getElementById('taro-cards-container');
    if (cardsContainer) cardsContainer.innerHTML = '';
    
    // Прячем старую текстовую интерпретацию
    const resultBox = document.getElementById('taro-result');
    if (resultBox) resultBox.classList.add('hidden');
};


async function calculateAstroHoursForDateTime() {
    const dateVal = document.getElementById('astro-date').value;
    const timeVal = document.getElementById('astro-time').value;
    const latVal = parseFloat(document.getElementById('astro-hours-lat').value);
    const lonVal = parseFloat(document.getElementById('astro-hours-lon').value);
    const btn = document.getElementById('btn-calc-hours');

    if (!dateVal || !timeVal || isNaN(latVal)) {
        alert('Пожалуйста, укажите параметры и выберите город.');
        return;
    }
    if (btn) { btn.disabled = true; btn.innerText = 'Сверяемся со звездами...'; }

    try {
        // Отправляем запрос с явным указанием tz_offset для Швеции
        const result = await sendRequest('/api/v1/astrology/hours', { 
            date: dateVal, 
            time: timeVal, 
            lat: latVal, 
            lon: lonVal,
            tz_offset: 3.0 
        });

        const overlay = document.getElementById('magic-bottom-sheet');
        const titleEl = document.getElementById('sheet-title');
        const textEl = document.getElementById('sheet-text');

        if (overlay && titleEl && textEl && result && result.status === 'success') {
            textEl.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px;">
                    <span style="font-size: 4rem; display: block; filter: drop-shadow(0 0 10px rgba(226,194,117,0.4));">${result.planet_symbol}</span>
                    <h2 style="margin: 10px 0; color: #ffe066;">Час Владыки: ${result.current_hour_planet}</h2>
                </div>
                <div style="color: #f3e8ff; line-height: 1.6; font-size:16px; margin-bottom:20px;">${result.influence}</div>
                <div style="text-align: center; border-top: 1px dashed rgba(226,194,117,0.2); padding-top: 15px; color: #94a3b8;">
                    Следующий час: <span style="color: #a78bfa;">${result.next_planet_symbol} ${result.next_hour}</span>
                </div>
            `;
            titleEl.textContent = "⏳ Манускрипт Времени Сфер";
            overlay.classList.add('active');

            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
            }
        }
    } catch (error) {
        console.error('Astro Hours Error:', error);
    } finally {
        if (btn) { btn.disabled = false; btn.innerText = '✧ Рассчитать планетарный час ✧'; }
    }

}

// Оперативная память сессии биоритмов
window.currentBioText = "";

async function calculateBiorhythms() {
    const birthdateVal = document.getElementById('bio-birthdate').value;
    const genderSelect = document.getElementById('bio-gender');
    const btn = document.getElementById('btn-calc-bio');
    
    const genderVal = genderSelect ? genderSelect.value : 'woman';
    
    if (!birthdateVal) {
        alert('Пожалуйста, выберите дату рождения.');
        return;
    }
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }

    // Пересобираем дату рождения в русский формат для верхней полосы
    let formattedBirth = birthdateVal;
    if (birthdateVal.includes('-')) {
        const parts = birthdateVal.split('-');
        if (parts.length === 3) { formattedBirth = `${parts[2]}.${parts[1]}.${parts[0]}`; }
    }
    const genderText = genderVal === 'man' ? 'Мужчина ♂️' : 'Женщина ♀️';

    try {
        const response = await fetch('/api/v1/astrology/biorhythms', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                init_data: window.Telegram?.WebApp?.initData || '',
                birthdate: birthdateVal,
                gender: genderVal
            })
        });

        if (!response.ok) throw new Error('Ошибка сервера биоритмов');
        const data = await response.json();

        if (data && data.status === 'success') {
            // 1. Фиксируем текст оракула во фронтенд-сейф
            window.currentBioText = data.advice;

            // 2. Схлопываем форму ввода и выкатываем верхнюю полоску
            document.getElementById('bio-main-form-wrapper').classList.add('hidden');
            document.getElementById('bio-collapsed-bar').classList.remove('hidden');
            document.getElementById('bio-summary-text').textContent = `${formattedBirth} • ${genderText}`;

            // 3. Плавно разворачиваем блок неоновых шкал
            const vizBlock = document.getElementById('bio-visualization-block');
            vizBlock.classList.remove('hidden');

            // 🔥 СИНХРОНИЗАЦИЯ С БЭКЕНДОМ: Профессиональный 7-зонный индикатор статуса
            const getZoneStatus = (pct) => {
                if (pct >= 86) return "👑 Максимальный пик";
                if (pct >= 66) return "📈 Стабильный подъем";
                if (pct >= 51) return "✨ Умеренный подъем";
                if (pct >= 41) return "⚖️ Нейтральный баланс";
                if (pct >= 31) return "📉 Легкий спад";
                if (pct >= 21) return "⚠️ Заметный упадок";
                return "🚨 Критическое дно";
            };

            // 4. Запускаем каскадный таймер для анимации заполнения капсул (эффект Вау!)
            setTimeout(() => {
                // Физический тонус
                document.getElementById('bio-p-percent').textContent = `${data.physical}%`;
                document.getElementById('bio-p-bar').style.width = `${data.physical}%`;
                document.getElementById('bio-p-status').textContent = getZoneStatus(data.physical);
                document.getElementById('bio-p-status').style.color = data.physical < 40 ? "#ef4444" : "#f87171";

                // Эмоциональный баланс
                document.getElementById('bio-e-percent').textContent = `${data.emotional}%`;
                document.getElementById('bio-e-bar').style.width = `${data.emotional}%`;
                document.getElementById('bio-e-status').textContent = getZoneStatus(data.emotional);
                document.getElementById('bio-e-status').style.color = data.emotional < 40 ? "#3b82f6" : "#60a5fa";

                // Интеллектуальный потенциал
                document.getElementById('bio-i-percent').textContent = `${data.intellectual}%`;
                document.getElementById('bio-i-bar').style.width = `${data.intellectual}%`;
                document.getElementById('bio-i-status').textContent = getZoneStatus(data.intellectual);
                document.getElementById('bio-i-status').style.color = data.intellectual < 40 ? "#10b981" : "#34d399";
            }, 100);

            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }
        }
    } catch (error) {
        console.error('Biorhythms Error:', error);
        alert('Не удалось рассчитать траекторию биоритмов.');
    } finally {
        if (btn) { btn.disabled = false; btn.innerText = '✦ Рассчитать биоритмы ✦'; }
    }
}

/**
 * Открытие текстового манускрипта по клику на золотую кнопку под шкалами
 */
window.openBioTextScroll = function() {
    const overlay = document.getElementById('magic-bottom-sheet');
    const titleEl = document.getElementById('sheet-title');
    const textEl = document.getElementById('sheet-text');

    if (!overlay || !titleEl || !textEl || !window.currentBioText) return;

    titleEl.textContent = "📊 Манускрипт Жизненных Биоритмов";
    textEl.innerHTML = `<div style="padding: 10px; font-size:15px; line-height:1.6; color:#f3e8ff;">${window.currentBioText}</div>`;
    
    overlay.classList.add('active');

    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
};

/**
 * ГЛОБАЛЬНЫЙ ПРОЦЕССОР СБРОСА БИОРИТМОВ (Клик по крестику)
 */
window.executeGrimoireBioReset = function() {
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }

    // Схлопываем шкалы и верхнюю полоску
    document.getElementById('bio-collapsed-bar').classList.add('hidden');
    document.getElementById('bio-visualization-block').classList.add('hidden');
    
    // Возвращаем форму ввода и описание
    document.getElementById('bio-main-form-wrapper').classList.remove('hidden');
    
    // Сбрасываем кэш текста
    window.currentBioText = "";
};

// =====================================================================
// 🌌 ОФИЦИАЛЬНЫЙ ИНТЕЛЛЕКТУАЛЬНЫЙ ИИ-ОБРАБОТЧИК СОННИКА (ВЫВОД В СВИТОК)
// =====================================================================
document.addEventListener('DOMContentLoaded', () => {
    const dreamSubmitBtn = document.getElementById('dream-submit');
    
    if (dreamSubmitBtn) {
        dreamSubmitBtn.addEventListener('click', async () => {
            const inputField = document.getElementById('dream-input');
            if (!inputField) return;
            
            const keyword = inputField.value.trim();
            if (!keyword) {
                alert('Опиши образы своего сна, чтобы Гримуар смог заглянуть в бессознательное.');
                return;
            }
            
            // 1. Сразу подхватываем элементы нашего главного золотого свитка-манускрипта
            const overlay = document.getElementById('magic-bottom-sheet');
            const titleEl = document.getElementById('sheet-title');
            const textEl = document.getElementById('sheet-text');
            
            if (overlay && titleEl && textEl) {
                titleEl.textContent = '✦ Читаем знаки сновидения...';
                textEl.innerHTML = `
                    <div style="text-align: center; padding: 25px; color: #a78bfa;">
                        <div style="width: 32px; height: 30px; border: 2px solid rgba(167, 139, 250, 0.2); border-top-color: #a78bfa; border-radius: 50%; margin: 0 auto 12px auto; animation: dreamSpin 1s linear infinite;"></div>
                        <p style="font-family: 'Philosopher', sans-serif; font-size: 14.5px; margin: 0; font-style: normal !important;">Вглядываюсь в туман бессознательного...</p>
                    </div>
                    <style>@keyframes dreamSpin { to { transform: rotate(360deg); } }</style>
                `;
                overlay.classList.add('active'); // Эффектно открываем манускрипт в режиме загрузки
            }
            
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
            }
            
            try {
                // 2. Отправляем асинхронный POST-запрос на наш новый ИИ-эндпоинт
                const response = await fetch('/api/v1/interpret-dream', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text: keyword })
                });
                
                const result = await response.json();
                
                if (overlay && titleEl && textEl) {
                    if (result.status === "success") {
                        // Меняем шапку манускрипта и вшиваем готовый сверстанный HTML от ИИ шлюза!
                        titleEl.textContent = '✦ Читаем знаки сновидения...';
                        textEl.innerHTML = result.html;
                    } else {
                        titleEl.textContent = 'Знание скрыто';
                        textEl.innerHTML = `<p style="color: #ef4444; text-align: center; padding: 15px;">Астральный канал временно заблокирован тенью.</p>`;
                    }
                    
                    if (window.Telegram?.WebApp?.HapticFeedback) {
                        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                    }
                }
            } catch (error) {
                console.error('Dream ИИ Error:', error);
                if (titleEl && textEl) {
                    titleEl.textContent = 'Ошибка соединения';
                    textEl.innerHTML = '<p style="color: #ef4444; text-align: center; padding: 15px;">Не удалось связаться с хранилищем знаний Гримуара. Проверьте туннель связи.</p>';
                }
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('error');
                }
            }
        });
    }
});

// ==========================================
// 1. ГЕНДЕРНЫЙ ПЕРЕКЛЮЧАТЕЛЬ
// ==========================================
let currentGender = 'woman'; // По умолчанию женщина

function setGender(gender, element) {
    currentGender = gender;
    const buttons = element.parentElement.querySelectorAll('.gender-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');
}


// ==========================================
// 2. ВЫПОЛНЕНИЕ РУНИЧЕСКОГО РАСКЛАДА (ИНТЕРФЕЙСНЫЙ МОНОЛИТ)
// ==========================================
/**
 * Выполнение рунического расклада с автоматическим скрытием формы и выводом в Свиток Судьбы
 * @param {'express' | 'single' | 'double' | 'triplet' | 'cross' | 'love'} spreadType - Тип расклада
 */
async function drawRunes(spreadType) {
    const cardsContainer = document.getElementById('runes-cards-container');
    const resultBox = document.getElementById('runes-result');

    // Находим элементы формы рунического экрана по аналогии с Матрицей Судьбы
    const runesMainForm = document.getElementById('runes-main-block') || document.querySelector('.runes-layout-form');
    const runesCollapsedBar = document.getElementById('runes-collapsed-bar');
    const runesViewport = document.getElementById('runes-map-viewport') || document.getElementById('runes-visualization-block');

    if (!cardsContainer || !resultBox) return;

    // 1. Подготовка интерфейса перед запросом
    cardsContainer.innerHTML = '';
    resultBox.classList.add('hidden');
    resultBox.innerHTML = '<div class="loading-spinner">✨ Смешиваем древние руны и считываем знаки Футарка...</div>';

    // 2. АНИМАЦИЯ UI: Сворачиваем форму выбора и выкатываем верхнюю полоску
    if (runesMainForm) {
        runesMainForm.classList.add('hidden');
        runesMainForm.style.display = 'none';
    }
    if (runesCollapsedBar) {
        runesCollapsedBar.classList.remove('hidden');
    }
    if (runesViewport) {
        runesViewport.classList.remove('hidden');
    }

    // Собираем данные о выбранных параметрах для верхней полосы
    const genderText = currentGender === 'man' ? 'Мужчина ♂️' : 'Женщина ♀️';
    const layoutNames = {
        'express': 'Экспресс', 'single': '1 руна', 'double': 'На 2 руны',
        'triplet': 'Триплет', 'cross': 'Крест', 'love': 'Любовь'
    };
    const currentLayoutName = layoutNames[spreadType] || 'Расклад Старшего Футарка';

    // Заливаем текст параметров в шапку-сводку
    const runesSummaryText = document.getElementById('runes-summary-text');
    if (runesSummaryText) {
        runesSummaryText.textContent = `${currentLayoutName} • ${genderText}`;
    }

    try {
        // Автономный сбор: принудительно забираем пол из селекта на экране рун перед отправкой
        const runeGenderSelect = document.getElementById('rune-gender') || document.getElementById('zodiac-forecast-gender') || document.getElementById('stone-gender');
        if (runeGenderSelect) {
             currentGender = runeGenderSelect.value;
        }

        const response = await fetch('/api/v1/runes/draw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                mode: spreadType, 
                gender: currentGender 
            })
        });

        if (!response.ok) {
            throw new Error(`Ошибка сервера: ${response.status}`);
        }

        const data = await response.json();

        if (data.cards && data.cards.length > 0) {
            // 3. Рендерим руны с точной структурой классов и защитными глифами Старшего Футарка
                        cardsContainer.innerHTML = data.cards.map((rune) => {
                const runeImage = rune.image_url || `/static/images/runes/${rune.image}.webp`;
                const runeName = rune.name || 'Руна';
                return `
                    <div class="taro-card-wrapper" onclick="flipRune(this)">
                        <div class="taro-card-glow"></div>
                        <div class="taro-card-smoke"></div>
                        <div class="taro-card-item">
                            <div class="taro-card-inner">
                                <div class="taro-card-face taro-card-back">
                                    <img src="/static/images/taro_back.webp" alt="Рубашка"/>
                                </div>
                                <div class="taro-card-face taro-card-front">
                                    <img src="${runeImage}" alt="${runeName}" style="transform: ${rune.is_reversed ? 'rotate(180deg)' : 'none'};" onerror="this.onerror=null; this.src='/static/images/default_card.webp'" />
                                </div>
                            </div>
                        </div>
                        <div class="taro-card-label">${runeName}</div>
                    </div>
                `;
            }).join('');


            // Выкладываем руны рубашкой вверх с каскадной задержкой
            setTimeout(() => {
                const wrappers = cardsContainer.querySelectorAll('.taro-card-wrapper');
                wrappers.forEach((wrapper, i) => {
                    setTimeout(() => {
                        wrapper.classList.add('dealt');

                        if (window.Telegram?.WebApp?.HapticFeedback) {
                            window.Telegram.WebApp.HapticFeedback.impactOccurred('soft');
                        }
                    }, i * 350);
                });
            }, 150);

            // 4. Сохраняем интерпретацию в скрытый блок для последующего вызова
            resultBox.innerHTML = `
                <div class="taro-interpretation">
                    <h3 style="color: #e2c275; text-align:center; font-family:'Philosopher', sans-serif; margin-bottom:15px;">🔮 Манускрипт Пророчества Старшего Футарка</h3>
                    <div class="interpretation-text" style="font-size:15px; line-height:1.6; color:#cbd5e1;">${data.interpretation}</div>
                </div>
            `;
        } else {
            resultBox.classList.remove('hidden');
            resultBox.innerHTML = `<div class="error-msg">Не удалось сформировать рунический расклад. Попробуйте еще раз.</div>`;
            window.executeGrimoireRunesReset();
        }
    } catch (error) {
        console.error('Runes API Error:', error);
        resultBox.classList.remove('hidden');
        resultBox.innerHTML = `<div class="error-msg">Ошибка соединения с сервером. Проверьте подключение.</div>`;
        window.executeGrimoireRunesReset();
    }
}

/**
 * ГЛОБАЛЬНЫЙ ПРОЦЕССОР СБРОСА РУНИЧЕСКОГО ЭКРАНА (Клик по крестику возврата)
 */
window.executeGrimoireRunesReset = function() {
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }

    const runesMainForm = document.getElementById('runes-main-block') || document.querySelector('.runes-layout-form');
    const runesCollapsedBar = document.getElementById('runes-collapsed-bar');
    const runesViewport = document.getElementById('runes-map-viewport') || document.getElementById('runes-visualization-block');

    // Сворачиваем шкалы результатов и верхнюю полоску
    if (runesCollapsedBar) runesCollapsedBar.classList.add('hidden');
    if (runesViewport) runesViewport.classList.add('hidden');
    
    // Возвращаем форму выбора раскладов
    if (runesMainForm) {
        runesMainForm.classList.remove('hidden');
        runesMainForm.style.display = 'block';
    }

    // Чистим стол с картами
    const cardsContainer = document.getElementById('runes-cards-container');
    if (cardsContainer) cardsContainer.innerHTML = '';
};



// ==========================================
// 3. ПЕРЕВОРОТ РУНЫ
// ==========================================
/**
 * Переворот руны, вспышка неона ребром, гашение дыма и проявление названия
 */
function flipRune(cardWrapper) {
    const cardItem = cardWrapper.querySelector('.taro-card-item, .rune-card-item');
    const labelEl = cardWrapper.querySelector('.taro-card-label, .rune-card-label');
    const smokeEl = cardWrapper.querySelector('.taro-card-smoke, .rune-card-smoke');
    if (!cardItem || cardItem.classList.contains('flipped')) return;

    cardItem.classList.add('flipped');
    if (smokeEl) smokeEl.style.opacity = '0';

    setTimeout(() => {
        cardWrapper.classList.add('edge-flash');
        setTimeout(() => cardWrapper.classList.remove('edge-flash'), 250);
    }, 280);

    setTimeout(() => {
        if (labelEl) labelEl.classList.add('revealed');
        const allWrappers = document.querySelectorAll('#runes-cards-container .taro-card-wrapper');
        const allFlipped = Array.from(allWrappers).every(w => w.querySelector('.taro-card-item')?.classList.contains('flipped'));
        if (allFlipped) {
            setTimeout(() => {
                const overlay = document.getElementById('magic-bottom-sheet');
                const titleEl = document.getElementById('sheet-title');
                const textEl = document.getElementById('sheet-text');
                if (overlay && titleEl && textEl) {
                    titleEl.textContent = "📜 Древнее Пророчество Рун Футарка";
                    textEl.innerHTML = document.getElementById('runes-result')?.innerHTML || "";
                    overlay.classList.add('active');
                }
            }, 500);
        }
    }, 550);
}

// ================= МАГИЯ ОТКРЫТИЯ ОБЛОЖКИ =================

window.openGrimoire = function() {
    const cover = document.getElementById('book-cover');
    const tg = window.Telegram?.WebApp;

    // Если обложка уже открыта, ничего не делаем
    if (cover.classList.contains('opened')) return;

    // 1. Добавляем CSS-класс, который запустит 3D-разворот влево
    cover.classList.add('opened');

    // 2. Вызываем виброотклик Telegram (успешное открытие)
    if (tg?.HapticFeedback) {
        tg.HapticFeedback.notificationOccurred('success');
    }

    // 3. Активируем системную кнопку «Назад» в Telegram
    if (tg?.BackButton) {
        tg.BackButton.show();
    }
}

// Подключаем закрытие книги при нажатии на стрелку «Назад» в самом Telegram
if (window.Telegram?.WebApp?.BackButton) {
    window.Telegram.WebApp.BackButton.onClick(() => {
        const cover = document.getElementById('book-cover');
        const tg = window.Telegram.WebApp;

        if (cover && cover.classList.contains('opened')) {
            cover.classList.remove('opened'); // Закрываем книгу обратно на обложку
            tg.BackButton.hide(); // Прячем системную кнопку «Назад»
            
            // Легкий виброотклик закрытия
            if (tg.HapticFeedback) {
                tg.HapticFeedback.impactOccurred('medium');
            }
        }
    });
}

// ================= ФУНКЦИЯ ДЛЯ ВЫЗОВА МАНУСКРИПТА ПОВЕРХ КНИГИ =================

window.openMagicScroll = function(guideKey) {
    // 1. Ищем саму темную вуаль манускрипта
    const overlay = document.getElementById('magic-bottom-sheet');
    const titleEl = document.getElementById('sheet-title');
    
    // 🔥 ГЛАВНЫЙ ФИКС: Ищем внутренний текстовый блок манускрипта
    const textEl = document.getElementById('sheet-text');
    const tg = window.Telegram?.WebApp;

    // Проверяем, есть ли такой ключ в нашей энциклопедии GRIMOIRE_DEEP_ENCYCLOPEDIA
    const info = GRIMOIRE_DEEP_ENCYCLOPEDIA[guideKey];
    if (!info || !overlay) {
        console.error(`Ошибка Гримуара: Руководство по ключу "${guideKey}" не найдено или сломан HTML-тег.`);
        return;
    }

    // 2. Вливаем заголовок и богатый HTML-текст статьи
    titleEl.textContent = info.title;
    textEl.innerHTML = info.text;

    // 3. Зажигаем класс .active, чтобы свиток плавно увеличился по центру
    overlay.classList.add('active');

    // 4. Подаем сочный виброотклик в Telegram WebApp
    if (tg?.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
}

function closeMagicScroll() {
    const overlay = document.getElementById('magic-bottom-sheet');
    if (overlay) {
        overlay.classList.remove('active');
        
        // Легкий виброотклик при закрытии свитка
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
        }
    }
}


// ================= НАВИГАЦИЯ И ЛОГИКА ДЛЯ МОДУЛЯ КАМНЕЙ =================

// ================= НАВИГАЦИЯ И ЛОГИКА ДЛЯ МОДУЛЯ КАМНЕЙ =================

// ================= НАВИГАЦИЯ И ЛОГИКА ДЛЯ МОДУЛЯ КАМНЕЙ =================
let currentStoneLevel = 1; 

// =====================================================================
// ИСПРАВЛЕННАЯ ЛОГИКА ДЛЯ МОДУЛЯ КАМНЕЙ ВО ФРОНТЕНДЕ (main.js)
// =====================================================================
window.switchStoneLevel = function(level, btnElement) {
    currentStoneLevel = level;
    
    document.querySelectorAll('.stone-lvl-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = '#161224';
        btn.style.color = '#a0a5c0';
        btn.style.borderColor = 'rgba(226, 194, 117, 0.1)';
    });
    
    btnElement.classList.add('active');
    btnElement.style.background = 'rgba(226, 194, 117, 0.1)';
    btnElement.style.color = '#e2c275';
    btnElement.style.borderColor = 'rgba(226, 194, 117, 0.3)';
    
    const dynamicBox = document.getElementById('stone-dynamic-field');
    const zodiacGroup = document.getElementById('stone-zodiac-group'); // Добавили подхват блока знака
    
    if (!dynamicBox) return;

    if (level === 1) {
        if (zodiacGroup) zodiacGroup.classList.remove('hidden'); // Показываем знак зодиака
        dynamicBox.innerHTML = `
            <div style="text-align: center; padding: 5px; color: #a0a5c0; font-size: 13px; font-style: italic;">
                ✧ Кристалл покровителя определится по вашему знаку зодиака.
            </div>
        `;
    } else if (level === 2) {
        if (zodiacGroup) zodiacGroup.classList.remove('hidden'); // Показываем знак зодиака
        dynamicBox.innerHTML = `
            <label style="color:#a0a5c0; font-size:13px; display:block; margin-bottom:6px;">Выберите направление силы:</label>
            <select id="stone-goal" style="width:100%; padding:10px; background:#0d0a14; color:#fff; border:1px solid rgba(226,194,117,0.3); border-radius:8px; outline:none;">
                <option value="love">💖 Любовь и Отношения</option>
                <option value="money">💰 Деньги и Финансовое Изобилие</option>
                <option value="work">💼 Работа, Карьера и Бизнес</option>
            </select>
        `;
    } else {
        if (zodiacGroup) zodiacGroup.classList.add('hidden'); // 🔥 Железно скрываем знак зодиака на 3 уровне!
        dynamicBox.innerHTML = `
            <div style="border-top: 1px dashed rgba(226,194,117,0.2); padding-top:12px; margin-top:5px;">
                <span style="color:#ffe066; font-size:12px; display:block; text-align:center; margin-bottom:10px; font-style:italic;">Для Высшей магии требуются точные координаты рождения:</span>
                
                <div style="display:flex; gap:8px; margin-bottom:10px;">
                    <div style="flex:1;">
                        <label style="color:#a0a5c0; font-size:11px; display:block; margin-bottom:4px;">Дата рождения:</label>
                        <input type="date" id="stone-birth-date" style="width:100%; padding:8px; background:#0d0a14; color:#fff; border:1px solid rgba(226,194,117,0.3); border-radius:8px; font-size:12px; outline:none;">
                    </div>
                    <div style="flex:1;">
                        <label style="color:#a0a5c0; font-size:11px; display:block; margin-bottom:4px;">Время рождения:</label>
                        <input type="time" id="stone-birth-time" value="12:00" style="width:100%; padding:8px; background:#0d0a14; color:#fff; border:1px solid rgba(226,194,117,0.3); border-radius:8px; font-size:12px; outline:none;">
                    </div>
                </div>

                <div class="city-autocomplete-wrapper" style="position:relative;">
                    <label style="color:#a0a5c0; font-size:11px; display:block; margin-bottom:4px;">Город рождения:</label>
                    <input type="text" class="city-input" id="stone-city-input" placeholder="Начните вводить город..." style="width:100%; padding:10px; background:#0d0a14; color:#fff; border:1px solid rgba(226,194,117,0.3); border-radius:8px; font-size:13px; outline:none;" autocomplete="off">
                    <div class="city-dropdown hidden" id="stone-city-dropdown" style="position:absolute; width:100%; background:#161224; border:1px solid #e2c275; border-radius:8px; max-height:150px; overflow-y:auto; z-index:99; margin-top:4px;"></div>
                    
                    <input type="hidden" id="stone-lat">
                    <input type="hidden" id="stone-lon">
                </div>
            </div>
        `;
        
        setTimeout(() => {
            const newInput = document.getElementById('stone-city-input');
            if (newInput) initGrimoireCitySearch(newInput);
        }, 100);
    }
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
};

// =====================================================================
// УЛЬТИМАТИВНЫЙ СБОР ДАТЫ И ГЕО-ДАННЫХ ДЛЯ КАМНЕЙ (main.js)
// =====================================================================
window.requestStoneAlchemy = async function() {
    const gender = document.getElementById('stone-gender')?.value || 'woman';
    const sign = document.getElementById('stone-sign')?.value || 'aries';
    const goal = document.getElementById('stone-goal')?.value || 'love';
    
    // 1. ХИРУРГИЧЕСКИЙ СБОР: Вытаскиваем значения полей интерактива прямо с экрана
    const bDateEl = document.getElementById('stone-birth-date');
    const bTimeEl = document.getElementById('stone-birth-time');
    const latEl = document.getElementById('stone-lat');
    const lonEl = document.getElementById('stone-lon');
    
    const birthDateVal = bDateEl ? bDateEl.value : "";
    const birthTimeVal = bTimeEl ? bTimeEl.value : "12:00";
    const latVal = latEl ? parseFloat(latEl.value) : 55.7558;
    const lonVal = lonEl ? parseFloat(lonEl.value) : 37.6173;
    
    let targetNakshatra = ""; 

    const overlay = document.getElementById('magic-bottom-sheet');
    const titleEl = document.getElementById('sheet-title');
    const textEl = document.getElementById('sheet-text');
    if (!overlay || !titleEl || !textEl) return;

    try {
        titleEl.textContent = "🔮 Алхимический Круг Запущен...";
        textEl.innerHTML = "<div style='text-align:center; margin-top:40px; color:#e2c275;'>Свитки Гримуара разворачиваются...<br>Идет сонастройка кристаллической решетки... ✨</div>";
        overlay.classList.add('active');

        if (currentStoneLevel === 3) {
            if (!birthDateVal || isNaN(latVal)) {
                titleEl.textContent = "⚠️ Форма не завершена";
                textEl.innerHTML = "<p style='color:#ef4444; text-align:center; margin-top:20px;'>Пожалуйста, введите дату и выберите город рождения из выпадающего списка.</p>";
                return;
            }

            // Предварительный расчет натальной карты для вытаскивания накшатры
            const natalRes = await sendRequest('/api/v1/natal', { 
                date: birthDateVal, 
                time: birthTimeVal, 
                lat: latVal, 
                lon: lonVal 
            });
            
            if (natalRes && natalRes.status === "success" && natalRes.detected_nakshatra) {
                targetNakshatra = natalRes.detected_nakshatra;
            } else {
                titleEl.textContent = "⚠️ Ошибка звезд";
                textEl.innerHTML = "<p style='color:#ef4444; text-align:center; margin-top:20px;'>Не удалось рассчитать траекторию Луны.</p>";
                return;
            }
        }

        // 🔥 ЖЕСТКИЙ ФИКС: Упаковываем ВСЕ поля в JSON. Теперь бэкенд гарантированно увидит дату!
        const response = await fetch('/api/v1/astrology/stones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                level: currentStoneLevel,
                sign: currentStoneLevel === 3 ? "aries" : sign, 
                gender: gender,
                goal: goal,
                nakshatra: targetNakshatra,
                date: birthDateVal,
                time: birthTimeVal,
                lat: latVal,
                lon: lonVal
            })
        });
        const result = await response.json();

        if (result.status === "success") {
            titleEl.textContent = "📜 Древний Манускрипт Литотерапии";
            textEl.innerHTML = result.data;
        } else {
            titleEl.textContent = "⚠️ Знание скрыто";
            textEl.innerHTML = `<p style='color:#ef4444; text-align:center; margin-top:20px;'>${result.message || 'Ошибка подбора.'}</p>`;
        }
    } catch (error) {
        titleEl.textContent = "⚠️ Обрыв связи";
        textEl.innerHTML = "<p style='color:#ef4444; text-align:center; margin-top:20px;'>Не удалось достучаться до чертогов бэкенда.</p>";
    }
};

function initGrimoireCitySearch(input) {
    const dropdown = document.getElementById('stone-city-dropdown');
    let debounceTimer = null;

    input.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        clearTimeout(debounceTimer);
        
        if (query.length < 2) {
            if (dropdown) { dropdown.classList.add('hidden'); dropdown.innerHTML = ''; }
            return;
        }
        
        debounceTimer = setTimeout(async () => {
            try {
                const response = await fetch(`/api/v1/cities/search?q=${encodeURIComponent(query)}`);
                const cities = await response.json();
                
                if (!dropdown) return;
                dropdown.innerHTML = '';
                
                if (!cities || cities.length === 0) { dropdown.classList.add('hidden'); return; }

                cities.forEach(city => {
                    const item = document.createElement('div');
                    item.className = 'dropdown-item';
                    item.textContent = city.label;
                    
                    item.addEventListener('click', () => {
                        input.value = city.label;
                        document.getElementById('stone-lat').value = city.lat;
                        document.getElementById('stone-lon').value = city.lon;
                        dropdown.classList.add('hidden');
                    });
                    dropdown.appendChild(item);
                });
                dropdown.classList.remove('hidden');
            } catch (err) { 
                console.error('Ошибка встроенного поиска городов:', err); 
            }
        }, 400);
    });
}

// ================= НАВИГАЦИЯ И УПРАВЛЕНИЕ ОРАКУЛОМ ТАРО =================
let currentTaroSpread = 'single'; 

window.switchTaroSpread = function(spreadType, btnElement) {
    currentTaroSpread = spreadType;
    
    // Гасим старые фиолетовые плашки Таро
    document.querySelectorAll('.taro-spread-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = '#161224';
        btn.style.color = '#a0a5c0';
        btn.style.borderColor = 'rgba(226, 194, 117, 0.1)';
    });
    
    // Подсвечиваем золотом выбранный расклад
    btnElement.classList.add('active');
    btnElement.style.background = 'rgba(226, 194, 117, 0.1)';
    btnElement.style.color = '#e2c275';
    btnElement.style.borderColor = 'rgba(226, 194, 117, 0.3)';
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
};

window.requestTaroSpread = function() {
    // Просто перенаправляем сохраненный режим в твою рабочую функцию раздачи карт!
    if (typeof drawTaro === 'function') {
        drawTaro(currentTaroSpread);
    }
};

// =====================================================================
// ᚠ УЛЬТИМАТИВНЫЙ ГЛОБАЛЬНЫЙ ДВИЖОК ПЕРЕКЛЮЧЕНИЯ РУН (ФРОНТЕНД ФИКС)
// =====================================================================

// Жестко сажаем стейт активного расклада в глобальное окно window
window.activeRuneSpread = 'express'; 

window.switchRuneSpread = function(spreadType, btnElement) {
    // Теперь переменная гарантированно запишется в глобальную память!
    window.activeRuneSpread = spreadType;
    
    // Гасим все соседние плашки в сетке рун до базового состояния
    document.querySelectorAll('[data-rune-spread]').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = '#161224';
        btn.style.color = '#a0a5c0';
        btn.style.borderColor = 'rgba(226, 194, 117, 0.1)';
        btn.style.fontWeight = 'normal';
    });
    
    // Подсвечиваем золотом выбранный тип расклада рун
    btnElement.classList.add('active');
    btnElement.style.background = 'rgba(226, 194, 117, 0.1)';
    btnElement.style.color = '#e2c275';
    btnElement.style.borderColor = 'rgba(226, 194, 117, 0.3)';
    btnElement.style.fontWeight = 'bold';
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
};

window.requestRunesSpread = window.requestRuneSpread = function() {
    if (typeof drawRunes === 'function') {
        // Берем жестко зафиксированный режим из глобального окна window
        const currentSpread = window.activeRuneSpread || 'express';
        console.log(`🔮 Гримуар отправляет на бэк роут рун: ${currentSpread}`);
        drawRunes(currentSpread);
    } else {
        console.error("Ошибка Гримуара: Функция drawRunes не найдена в памяти скрипта.");
    }
};

// =====================================================================
// АКТИВАЦИЯ СВИТКА ДЛЯ СОВЕТА ДНЯ-ТРАНСФОРМЕРА (ДОБАВИТЬ В КОНЕЦ main.js)
// =====================================================================
window.currentAdviceText = "";
window.currentAdviceTitleAddon = "";

async function executeDailyAdviceCalculation() {
    const btn = document.getElementById('advice-submit');
    const activeTabBtn = document.querySelector('.advice-mode-tabs .advice-scr-btn.active');
    const mode = activeTabBtn ? activeTabBtn.getAttribute('data-adv-mode') : 'luna';
    
    const gender = document.getElementById('adv-gender')?.value || 'woman';
    const zodiac = document.getElementById('adv-zodiac')?.value || 'aries';
    const birthdate = document.getElementById('adv-birthdate')?.value || '';
    const birthtime = document.getElementById('adv-birthtime')?.value || '';
    const lat = parseFloat(document.getElementById('adv-lat')?.value);
    const lon = parseFloat(document.getElementById('adv-lon')?.value);

    if (mode === 'numeric' && !birthdate) {
        alert('Пожалуйста, укажите дату рождения для нумерологического расчета.');
        return;
    }
    if (mode === 'sun' && (!birthdate || !birthtime || isNaN(lat))) {
        alert('Пожалуйста, заполните натальные данные и выберите город рождения.');
        return;
    }

    if (btn) { btn.disabled = true; btn.innerText = 'Разворачиваем свиток судеб...'; }

    try {
        const response = await fetch('/api/v1/astrology/daily-advice', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                init_data: window.Telegram?.WebApp?.initData || '',
                mode: mode,
                gender: gender,
                zodiac: zodiac,
                birthdate: birthdate,
                birthtime: birthtime,
                lat: lat,
                lon: lon
            })
        });

        if (!response.ok) throw new Error('Ошибка чертогов трансформера');
        const result = await response.json();

                if (result && result.status === 'success') {
            window.currentAdviceText = result.data;
            window.currentAdviceTitleAddon = result.title_addon;

            const pathsRu = { 'luna': 'Путь Луны 🌙', 'numeric': 'Путь Числа 🔢', 'sun': 'Путь Солнца ☀️' };
            const genderText = gender === 'man' ? 'Мужчина ♂️' : 'Женщина ♀️';

            document.getElementById('advice-main-form-wrapper').classList.add('hidden');
            document.getElementById('advice-collapsed-bar').classList.remove('hidden');
            document.getElementById('advice-visualization-block').classList.remove('hidden');

            document.getElementById('advice-summary-text').textContent = `${pathsRu[mode]} • ${genderText}`;

            // 🔥 ВРУБАЕМ САКРАЛЬНУЮ SVG ГРАФИКУ: Рисуем Живой Алтарь Судьбы!
            if (typeof window.renderAdviceAltar === 'function') {
                window.renderAdviceAltar(mode);
            }

            // Автоматически разворачиваем свиток в первый раз для чтения пророчества
            //window.openAdviceTextScroll();
        }

    } catch (error) {
        console.error('Transformer Advice Error:', error);
        alert('Не удалось связаться с оракулом.');
    } finally {
        if (btn) { btn.disabled = false; btn.innerText = '✦ Активировать совет дня ✦'; }
    }
}

/**
 * Ручное открытие свитка оракула по кнопке на столе
 */
window.openAdviceTextScroll = function() {
    const overlay = document.getElementById('magic-bottom-sheet');
    const titleEl = document.getElementById('sheet-title');
    const textEl = document.getElementById('sheet-text');
    if (!overlay || !titleEl || !textEl || !window.currentAdviceText) return;

    titleEl.textContent = `📜 Манускрипт ${window.currentAdviceTitleAddon}`;
    textEl.innerHTML = `<div style="padding: 10px; font-size:16px; line-height:1.6; color:#f3e8ff;">${window.currentAdviceText}</div>`;
    overlay.classList.add('active');
};

/**
 * ГЛОБАЛЬНЫЙ ПРОЦЕССОР СБРОСА СОВЕТА ДНЯ
 */
window.executeGrimoireAdviceReset = function() {
    document.getElementById('advice-collapsed-bar').classList.add('hidden');
    document.getElementById('advice-visualization-block').classList.add('hidden');
    document.getElementById('advice-main-form-wrapper').classList.remove('hidden');
    
    window.currentAdviceText = "";
};

// =====================================================================
// УПРАВЛЕНИЕ ИНТЕРФЕЙСОМ-ТРАНСФОРМЕРОМ СОВЕТА ДНЯ (main.js)
// =====================================================================
let activeAdviceMode = 'luna'; // Текущий выбранный режим по умолчанию

/**
 * УПРАВЛЕНИЕ ИНТЕРФЕЙСОМ-ТРАНСФОРМЕРОМ СОВЕТА ДНЯ И МОНЕТИЗАЦИЕЙ
 */
window.switchAdviceMode = function(mode, btnElement) {
    // 🌙 Путь Луны полностью бесплатный — пускаем моментально без лишних окон
    if (mode === 'luna') {
        executeModeSwitchLogic(mode, btnElement);
        return;
    }

    // 🔒 СНАЙПЕРСКИЙ ПЕРЕХВАТ МОНЕТИЗАЦИИ ДЛЯ ЧИСЛА И СОЛНЦА
    const pathTitle = mode === 'numeric' ? "Путь Персонального Числа 🔢" : "Высший Путь Солнца ☀️";
    const popupMessage = `🌌 Сакральный ${pathTitle} запечатан.\n\nПрослушайте послание Звезд (видеоролик), чтобы активировать этот свиток пророчества на сегодня?`;

    // Функция запуска анимации рекламы после согласия юзера
    const startAdSimulation = () => {
        const adOverlay = document.getElementById('grimoire-ad-overlay');
        const countdownEl = document.getElementById('grimoire-ad-countdown');
        
        if (!adOverlay || !countdownEl) {
            executeModeSwitchLogic(mode, btnElement);
            return;
        }

        // Показываем полноэкранный темный оверлей поверх всего WebApp
        adOverlay.classList.remove('hidden');
        
        let secondsLeft = 4;
        countdownEl.textContent = `Трансляция эфира завершится через: ${secondsLeft} сек`;

        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }

        // Запускаем тикающий таймер обратного отсчета
        const adInterval = setInterval(() => {
            secondsLeft--;
            if (secondsLeft > 0) {
                countdownEl.textContent = `Трансляция эфира завершится через: ${secondsLeft} сек`;
            } else {
                clearInterval(adInterval);
                adOverlay.classList.add('hidden');
                
                if (window.Telegram?.WebApp?.HapticFeedback) {
                    window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
                }
                
                executeModeSwitchLogic(mode, btnElement);
            }
        }, 1000);
    };

    // 🔥 БРОНЕБОЙНАЯ ПРОВЕРКА СРЕДЫ: Если тест на ПК в Chrome — сразу включаем confirm
    const isPCBrowser = !window.Telegram?.WebApp?.initData || window.Telegram?.WebApp?.platform === 'unknown';

    if (!isPCBrowser && window.Telegram?.WebApp?.showPopup) {
        try {
            window.Telegram.WebApp.showPopup({
                title: "🔮 Чертоги Оракула",
                message: popupMessage,
                buttons: [
                    { id: 'watch', type: 'default', text: '🎥 Смотреть Знамение' },
                    { id: 'cancel', type: 'destructive', text: 'Назад' }
                ]
            }, (buttonId) => {
                if (buttonId === 'watch') startAdSimulation();
            });
        } catch (popupErr) {
            console.log("📝 Перехват исключения WebApp на ПК. Включаем confirm.");
            if (confirm(popupMessage)) startAdSimulation();
        }
    } else {
        console.log("💻 Среда тестирования ПК. Активируем браузерный confirm.");
        if (confirm(popupMessage)) {
            startAdSimulation();
        }
    }
};

function executeModeSwitchLogic(mode, btnElement) {
    activeAdviceMode = mode;
    
    // Сбрасываем стили со всех скрижалей-кнопок
    document.querySelectorAll('.advice-scr-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = '#161224';
        btn.style.color = '#a0a5c0';
        btn.style.borderColor = 'rgba(226, 194, 117, 0.1)';
        btn.style.fontWeight = 'normal';
        btn.style.boxShadow = 'none';
    });
    
    // Активируем выбранную неоновую плитку
    btnElement.classList.add('active');
    btnElement.style.background = 'rgba(167, 139, 250, 0.06)';
    btnElement.style.color = '#e2c275';
    btnElement.style.borderColor = 'rgba(226, 194, 117, 0.4)';
    btnElement.style.fontWeight = 'bold';
    btnElement.style.boxShadow = '0 0 12px rgba(167,139,250,0.1)';

    const wrapZodiac = document.getElementById('wrapper-adv-zodiac');
    const wrapDateTime = document.getElementById('wrapper-adv-datetime');
    const wrapTime = document.getElementById('wrapper-adv-time');
    const wrapCity = document.getElementById('wrapper-adv-city');

    // Настраиваем видимость полей под выбранный сакральный путь
    if (mode === 'luna') {
        if (wrapZodiac) wrapZodiac.classList.remove('hidden');
        if (wrapDateTime) wrapDateTime.classList.add('hidden');
        if (wrapCity) wrapCity.classList.add('hidden');
    } else if (mode === 'numeric') {
        if (wrapZodiac) wrapZodiac.classList.add('hidden');
        if (wrapDateTime) wrapDateTime.classList.remove('hidden');
        if (wrapTime) wrapTime.style.display = 'none'; 
        if (wrapCity) wrapCity.classList.add('hidden');
    } else if (mode === 'sun') {
        if (wrapZodiac) wrapZodiac.classList.add('hidden');
        if (wrapDateTime) wrapDateTime.classList.remove('hidden');
        if (wrapTime) wrapTime.style.display = 'block'; 
        if (wrapCity) wrapCity.classList.remove('hidden'); 
        
        const cityInp = document.getElementById('adv-city');
        if (cityInp) {
            if (typeof initGrimoireCitySearch === 'function') {
                initGrimoireCitySearch(cityInp);
            } else if (typeof initCityAutocomplete === 'function') {
                initCityAutocomplete(cityInp);
            }
        }
    }
    console.log(`🔮 Оракул переключен на Путь: ${mode}`);
}

// =====================================================================
// ᚠ АВТОНОМНЫЙ ПРЕДОХРАНИТЕЛЬ ДЛЯ ОРАКУЛА РУН (Запуск в обход блокировок)
// =====================================================================
(function() {
    // Намертво связываем инлайн-вызов кнопки с родным методом раздачи карт
    window.requestRunesSpread = window.requestRuneSpread = function() {
        if (typeof drawRunes === 'function') {
            // Перед запуском принудительно проверяем активный тип расклада в системе
            const currentSpread = window.activeRuneSpread || 'express';
            drawRunes(currentSpread);
        } else {
            console.error("Ошибка Гримуара: Функция drawRunes не найдена в памяти скрипта.");
        }
    };
})();

window.executeZodiacForecast = async function() {
    const sign = document.getElementById('selected-zodiac-sign')?.value || 'aries';
    const date = document.getElementById('zodiac-forecast-date')?.value || new Date().toISOString().split('T')[0];
    const gender = document.getElementById('zodiac-forecast-gender')?.value || 'woman';
    
    // Сбор координат: берем из инпутов, если пусто — наша дефолтная Москва
    const latVal = document.getElementById('zodiac-lat')?.value;
    const lonVal = document.getElementById('zodiac-lon')?.value;
    const lat = latVal ? parseFloat(latVal) : 55.7558;
    const lon = lonVal ? parseFloat(lonVal) : 37.6173;
    
    // 🔥 Защита от VPN: получаем точный сдвиг часового пояса смартфона в часах
    const tzOffset = -new Date().getTimezoneOffset() / 60;
    
    // Получаем текущее локальное время смартфона в формате HH:MM
    const now = new Date();
    const clientTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    // Перехватываем элементы царственного свитка-манускрипта
    const overlay = document.getElementById('magic-bottom-sheet');
    const titleEl = document.getElementById('sheet-title');
    const textEl = document.getElementById('sheet-text');

    if (overlay && titleEl && textEl) {
        titleEl.textContent = '✦ Сверяемся со звездами...';
        textEl.innerHTML = '<div style="text-align:center; margin-top:20px; color:#e2c275;">Астропроцессор Гримуара вычисляет истинные планетные ингрессии и разворачивает свиток судьбы... ✨</div>';
        overlay.classList.add('active');
    }

    try {
        const response = await fetch('/api/v1/horoscope', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sign: sign,
                period: 'daily',
                gender: gender,
                date: date,
                client_time: clientTime,
                tz_offset: tzOffset,
                lat: lat,
                lon: lon
            })
        });

        const result = await response.json();

        if (result.status === 'success' && overlay && titleEl && textEl) {
            titleEl.innerHTML = `<span style="color: #ffe066; font-size: 14px; font-weight: bold; letter-spacing: 0.5px; text-transform: uppercase;">✦ Звезды раскрывают Вам тайну... ✦</span>`;

            textEl.innerHTML = `<div style="padding: 10px; font-size: 15px; line-height: 1.6;">${result.data.forecast}</div>`;
            
            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
            }
        } else {
            if (textEl) textEl.innerHTML = `<div style="color: #ef4444; text-align: center; margin-top: 20px;"><b>⚠️ Внимание звезд:</b><br>${result.detail || 'Не удалось расшифровать траектории планет.'}</div>`;
        }
    } catch (err) {
        console.error(err);
        if (textEl) textEl.innerHTML = '<div style="color: #ef4444; text-align: center; margin-top: 20px;"><b>⚠️ Ошибка соединения:</b><br>Манускрипт не смог связаться с сервером. Проверьте сеть.</div>';
    }
};


// =====================================================================
// 📜 РАСКРЫТИЕ ЗОЛОТОГО МАНУСКРИПТА КОСМИЧЕСКИХ ПРОГНОЗОВ СУТОК
// =====================================================================
document.getElementById('transit-decode-btn')?.addEventListener('click', () => {
    const overlay = document.getElementById('magic-bottom-sheet');
    const titleEl = document.getElementById('sheet-title');
    const textEl = document.getElementById('sheet-text');

    if (!overlay || !titleEl || !textEl || !window.currentTransitEvents) return;

    let scrollHTML = `
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 1px dashed rgba(16, 185, 129, 0.2); padding-bottom: 14px;">
            <span style="font-size: 11px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; display: block;">Астральный индекс суток</span>
            <div style="font-size: 14px; color: #10b981; font-weight: bold; margin-top: 6px; line-height: 1.5; padding: 0 10px;">${window.currentTransitIndex}</div>
        </div>
        <h4 style="color: #e2c275; margin-bottom: 15px; font-size: 16px; border-left: 2px solid #10b981; padding-left: 8px; text-transform: uppercase; letter-spacing: 0.5px;">🪐 Главные Планетарные Влияния Суток:</h4>
    `;

    window.currentTransitEvents.forEach((evt, idx) => {
        let typeLabel = "🪐 Космический Тренд";
        let labelColor = "#10b981";
        
        if (evt.type === "aspect") {
            typeLabel = `⚡ Лазерный Аспект: ${evt.planet} ➔ ${evt.target}`;
            labelColor = "#ffe066";
        } else if (evt.type === "retro") {
            typeLabel = `⏳ Кармическая петля: Ретроградный ${evt.planet}`;
            labelColor = "#ef4444";
        }

        scrollHTML += `
            <div style="margin-bottom: 20px; background: rgba(16, 185, 129, 0.02); border: 1px solid rgba(16, 185, 129, 0.1); border-radius: 12px; padding: 14px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                <b style="color: ${labelColor}; font-size: 13px; display: block; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.3px;">${idx + 1}. ${typeLabel}</b>
                <p style="margin: 0; font-size: 14.5px; line-height: 1.6; color: #cbd5e1;">${evt.text}</p>
            </div>
        `;
    });

    titleEl.textContent = "⚡ Манускрипт Временных Потоков";
    textEl.innerHTML = scrollHTML;
    overlay.classList.add('active');

    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
});

// =====================================================================
// 🦅 АВТОНОМНЫЙ ГЛОБАЛЬНЫЙ ПРОЦЕССОР ТРАНЗИТОВ (ПРОБИВНОЙ МОНОЛИТ)
// =====================================================================
window.executeGrimoireTransitScan = async function() {
    console.log("🚀 Глобальный штурм Автономных Потоков Времени запущен через onclick...");

    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }

    const transitDateInput = document.getElementById('transit-date');
    const birthDateInput = document.getElementById('transit-birth-date');
    const birthTimeInput = document.getElementById('transit-birth-time');
    const genderSelect = document.getElementById('transit-embedded-gender');
    const latInput = document.getElementById('transit-lat');
    const lonInput = document.getElementById('transit-lon');

    if (!transitDateInput?.value || !birthDateInput?.value || !latInput?.value || latInput.value === "") {
        alert('Брат, заполни дату рождения, обязательно выбери город из выпадающего списка и укажи дату прогноза!');
        return;
    }

    const transitDateVal = transitDateInput.value;
    const natalDateVal = birthDateInput.value;
    const natalTimeVal = birthTimeInput?.value || "12:00";
    const genderVal = genderSelect?.value || "man";
    const latVal = parseFloat(latInput.value);
    const lonVal = parseFloat(lonInput.value);

    const mainBlock = document.getElementById('transit-main-block');
    const viewport = document.getElementById('transit-map-viewport');
    const svgContainer = document.getElementById('transit-svg-container');
    const decodeBtn = document.getElementById('transit-decode-btn');

    if (mainBlock) mainBlock.classList.add('hidden');
    if (viewport) viewport.classList.remove('hidden');
    if (decodeBtn) decodeBtn.classList.add('hidden');

    document.getElementById('transit-summary-text').textContent = `Прогноз неба на: ${transitDateVal}`;

    if (svgContainer) {
        svgContainer.innerHTML = `<div style="text-align:center; color:#10b981; font-size:14px; font-style:italic; padding:20px;">
            Астропроцессор Гримуара сканирует потоки времени... ✨<br>
            Идет наложение небесных сфер...
        </div>`;
    }

    try {
        console.log("📡 Отправка пакета на сервер...");
        const result = await sendRequest('/api/v1/transit', {
            natal_date: natalDateVal,
            natal_time: natalTimeVal,
            transit_date: transitDateVal,
            gender: genderVal,
            lat: latVal,
            lon: lonVal
        });

        console.log("📥 Ответ получен:", result);

        if (result && result.status === 'success') {
            if (svgContainer) svgContainer.innerHTML = ''; 
            
            // 🔥 ЖЕСТКОЕ ОБНУЛЕНИЕ И ПЕРЕЗАПИСЬ: Выжигаем старый кэш дат!
            window.currentTransitEvents = null; 
            window.currentTransitIndex = "";
            
            // Записываем новые, свежие трактовки суток с бэкенда
            window.currentTransitEvents = result.top_events || [];
            window.currentTransitIndex = result.astral_index || "Нейтральный фон суток";

            if (decodeBtn) decodeBtn.classList.remove('hidden');

            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }
            
            if (window.renderTransitChart) {
                window.renderTransitChart(result.graph_data, transitDateVal);
            }
        

        } else {
            alert('Ошибка Астропроцессора: ' + (result?.detail || 'Не удалось рассчитать транзит.'));
            if (mainBlock) mainBlock.classList.remove('hidden');
            if (viewport) viewport.classList.add('hidden');
        }
    } catch (error) {
        console.error("❌ Критический обрыв сети:", error);
        alert('Сбой связи с сервером Гримуара. Проверь туннель Loophole.');
        if (mainBlock) mainBlock.classList.remove('hidden');
        if (viewport) viewport.classList.add('hidden');
    }
};

    /**
 * ГЛОБАЛЬНЫЙ ПРОЦЕССОР СБРОСА МАТРИЦЫ (Клик по крестику)
 */
window.executeGrimoireMatrixReset = function() {
    console.log("🔄 Сброс и возврат параметров Матрицы Судьбы...");
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }

    // Прячем полоску-сводку, карту Октаграммы, кнопки и контейнер результатов (чтобы скрыть кнопку PDF)
    document.getElementById('matrix-collapsed-bar').classList.add('hidden');
    document.getElementById('matrix-visualization-block').classList.add('hidden');
    document.getElementById('matrix-packets-block').classList.add('hidden');
    document.getElementById('matrix-result').classList.add('hidden');
    
    // Торжественно возвращаем на экран описание и форму ввода!
    document.getElementById('matrix-main-form-wrapper').classList.remove('hidden');
    
    // Зануляем оперативную память сессии
    activeMatrixDate = "";
};

/**
 * ГРАФИЧЕСКИЙ ДВИЖОК: Отрисовка Алхимического Алтаря Совета Дня (SVG)
 * @param {'luna' | 'numeric' | 'sun'} mode - Текущий режим оракула
 */
window.renderAdviceAltar = function(mode) {
    const container = document.getElementById('advice-svg-container');
    if (!container) return;

    const size = 260; const center = size / 2; const r = 85;
    
    // Подбираем канонический символ и неоновый цвет под выбранный путь
    const modeAssets = {
        'luna': { symbol: "🌙", color: "#a78bfa", title: "Манускрипт Луны" },
        'numeric': { symbol: "🔢", color: "#10b981", title: "Манускрипт Числа" },
        'sun': { symbol: "☀️", color: "#e2c275", title: "Манускрипт Солнца" }
    };
    const asset = modeAssets[mode] || modeAssets['luna'];

    let svgHtml = `<svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" style="overflow: visible;">
        <defs>
            <!-- Фильтр пробивающего неонового тумана -->
            <filter id="advice-altar-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur1" />
                <feGaussianBlur stdDeviation="2" result="blur2" />
                <feMerge>
                    <feMergeNode in="blur1" />
                    <feMergeNode in="blur2" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
        </defs>

        <!-- Внешние космические кольца-орбиты времени -->
        <circle cx="${center}" cy="${center}" r="${r + 25}" fill="none" stroke="rgba(255, 255, 255, 0.03)" stroke-width="1" />
        <circle cx="${center}" cy="${center}" r="${r + 12}" fill="none" stroke="${asset.color}" stroke-width="0.8" stroke-dasharray="4,4" opacity="0.4" />
        <circle cx="${center}" cy="${center}" r="${r}" fill="none" stroke="rgba(226, 194, 117, 0.12)" stroke-width="1.2" />
        
        <!-- Сакральный неоновый туман под символом -->
        <circle cx="${center}" cy="${center}" r="30" fill="${asset.color}" fill-opacity="0.08" filter="url(#advice-altar-glow)" />

        <!-- 🔮 ИНТЕРАКТИВНОЕ ЯДРО ПЕЧАТИ: тапка вызывает золотой свиток! -->
        <g style="cursor: pointer;" onclick="if(window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('medium'); window.openAdviceTextScroll();">
            <!-- Внешнее неоновое кольцо капсулы -->
            <circle cx="${center}" cy="${center}" r="45" fill="#090710" stroke="${asset.color}" stroke-width="2.5" filter="url(#advice-altar-glow)" />
            <circle cx="${center}" cy="${center}" r="39" fill="none" stroke="rgba(255, 255, 255, 0.05)" stroke-width="0.8" />
            
            <!-- Огромный, парящий символ светила -->
            <text x="${center}" y="${center}" fill="#ffffff" font-size="34px" text-anchor="middle" dominant-baseline="middle" style="filter: drop-shadow(0 0 10px ${asset.color}aa); animation: altarPulse 2.5s infinite alternate;">${asset.symbol}</text>
        </g>

        <!-- Магические рунические штрихи по углам орбиты -->
        <line x1="${center - r}" y1="${center}" x2="${center - r + 8}" y2="${center}" stroke="${asset.color}" stroke-width="1.5" opacity="0.6" />
        <line x1="${center + r}" y1="${center}" x2="${center + r - 8}" y2="${center}" stroke="${asset.color}" stroke-width="1.5" opacity="0.6" />
        <line x1="${center}" y1="${center - r}" x2="${center}" y2="${center - r + 8}" stroke="${asset.color}" stroke-width="1.5" opacity="0.6" />
        <line x1="${center}" y1="${center + r}" x2="${center}" y2="${center + r - 8}" stroke="${asset.color}" stroke-width="1.5" opacity="0.6" />

        <style>
            @keyframes altarPulse { from { transform: scale(0.95); opacity: 0.85; } to { transform: scale(1.05); opacity: 1; } }
        </style>
    </svg>`;

    container.innerHTML = svgHtml;
    console.log(`💎 Алхимическая Печать Оракула (${mode}) успешно материализована на столе!`);
};

// =====================================================================
// 🔮 ИНТЕРФЕЙСНЫЙ КОНТРОЛЛЕР МОДУЛЯ БА ЦЗЫ «ГРИМУАР»
// =====================================================================

// Оперативная сессионная память для Ба Цзы
let activeBaziDate = "";
let activeBaziTime = "12:00";
let activeBaziGender = "woman";

/**
 * Главный калькулятор-обработчик кнопки «Рассчитать Столпы Судьбы»
 */
window.calculateBaziMaster = function() {
    const dateInput = document.getElementById('bazi-date');
    const timeInput = document.getElementById('bazi-time');
    const genderSelect = document.getElementById('bazi-gender');

    if (!dateInput || !dateInput.value) {
        alert("Брат, выбери дату твоего земного воплощения для расчета Ба Цзы!");
        return;
    }

    // Фиксируем параметры в сессию смартфона
    activeBaziDate = dateInput.value;
    activeBaziTime = timeInput ? timeInput.value : "12:00";
    activeBaziGender = genderSelect ? genderSelect.value : "woman";

    // Пересобираем дату в человеческий формат ДД.ММ.ГГГГ для узкой полоски-шапки
    let formattedDate = activeBaziDate;
    if (activeBaziDate.includes('-')) {
        const parts = activeBaziDate.split('-');
        if (parts.length === 3) { formattedDate = `${parts[2]}.${parts[1]}.${parts[0]}`; }
    }
    const genderText = activeBaziGender === 'man' ? 'Мужчина ♂️' : 'Женщина ♀️';

    // 🌟 ХИРУРГИЧЕСКАЯ ТРАНСФОРМАЦИЯ ИНТЕРФЕЙСА (Схлопываем форму, выкатываем блоки)
    document.getElementById('bazi-main-form-wrapper').classList.add('hidden');
    document.getElementById('bazi-collapsed-bar').classList.remove('hidden');
    document.getElementById('bazi-visualization-block').classList.remove('hidden');
    document.getElementById('bazi-packets-block').classList.remove('hidden');

    // Заливаем текст в узкую шапку-сводку
    document.getElementById('bazi-summary-text').textContent = `${formattedDate} • ${activeBaziTime} • ${genderText}`;

    // Рендерим традиционную восточную карту Четырех Столпов в HTML
    window.renderBaziTraditionalTable();

    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }
};

/**
 * Традиционный рендеринг таблицы 4 Столпов (Год, Месяц, День, Час)
 */
window.renderBaziTraditionalTable = function() {
    const container = document.getElementById('bazi-table-container');
    if (!container) return;

    // Демонстрационный макет для отладки фронтенда и вывода "хвостиков"
    const pillarsMock = [
        { role: "Час ⏳", stem: "Дин (Инь Огонь)", branch: "Сы (Змея)" },
        { role: "День ☉", stem: "Синь (Инь Металл)", branch: "Обезьяна (Шэнь)" },
        { role: "Месяц 🌙", stem: "Цзя (Ян Дерево)", branch: "Крыса (Цзы)" },
        { role: "Год 👑", stem: "Бин (Ян Огонь)", branch: "Лошадь (У)" }
    ];

    let tableHtml = `
        <h3 style='text-align: center; color: #e2c275; font-size: 15px; margin: 0 0 14px 0; font-family: "Philosopher", sans-serif;'>📜 Карта Четырёх Столпов Судьбы</h3>
        <div style='display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; width: 100%; box-sizing: border-box;'>
    `;

    pillarsMock.forEach(p => {
        tableHtml += `
            <div style='background: rgba(15, 11, 28, 0.6); border: 1px solid rgba(226,194,117,0.2); border-radius: 10px; padding: 8px 4px; display: flex; flex-direction: column; gap: 6px; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); text-align: center;'>
                <span style='color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.3px;'>${p.role}</span>
                <div style='background: rgba(226,194,117,0.04); border-radius: 6px; padding: 6px 2px; color: #ffe066; font-size: 13.5px; font-weight: bold;'>${p.stem}</div>
                <div style='background: rgba(167,139,250,0.04); border-radius: 6px; padding: 6px 2px; color: #a78bfa; font-size: 13.5px; font-weight: bold;'>${p.branch}</div>
            </div>
        `;
    });

    tableHtml += `</div>`;
    container.innerHTML = tableHtml;
};
/**
 * Менеджер монетизации и вызова элитных манускриптов Ба Цзы
 * @param {'base' | 'assets' | 'chronos'} packetType 
 */
window.triggerBaziPacket = async function(packetType) {
    if (!activeBaziDate) {
        alert("Сначала рассчитайте Четыре Столпа Судьбы!");
        return;
    }

    if (packetType === 'base') {
        executeBaziNetworkRequest(packetType);
        return;
    }

    const popupMessage = packetType === 'assets'
        ? "💼 Манускрипт Дел и Карьерных Врат запечатан.\n\nПрослушайте послание Звезд (видеоролик) для активации Символических Звезд Капитала?"
        : "🔮 Высшее Откровение Свитка Хроноса сокрыто.\n\nГотовы ли вы посмотреть трансляцию эфира для деблокирования Столпов Удачи Да Юнь?";

    const runBaziAdSimulation = () => {
        const adOverlay = document.getElementById('grimoire-ad-overlay');
        const countdownEl = document.getElementById('grimoire-ad-countdown');

        if (!adOverlay || !countdownEl) {
            executeBaziNetworkRequest(packetType);
            return;
        }

        adOverlay.classList.remove('hidden');
        let timer = 4;
        countdownEl.textContent = `Трансляция эфира завершится через: ${timer} сек`;

        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }

        const interval = setInterval(() => {
            timer--;
            if (timer > 0) {
                countdownEl.textContent = `Трансляция эфира завершится через: ${timer} сек`;
            } else {
                clearInterval(interval);
                adOverlay.classList.add('hidden');
                executeBaziNetworkRequest(packetType);
            }
        }, 1000);
    };

    const isPC = !window.Telegram?.WebApp?.initData || window.Telegram?.WebApp?.platform === 'unknown';

    if (!isPC && window.Telegram?.WebApp?.showPopup) {
        window.Telegram.WebApp.showPopup({
            title: "🔮 Чертоги Оракула Ба Цзы",
            message: popupMessage,
            buttons: [
                { id: 'watch', type: 'default', text: '🎥 Смотреть Знамение' },
                { id: 'cancel', type: 'destructive', text: 'Назад' }
            ]
        }, (buttonId) => {
            if (buttonId === 'watch') runBaziAdSimulation();
        });
    } else {
        if (confirm(popupMessage)) runBaziAdSimulation();
    }
};

/**
 * Отправка POST-запроса на нарезку пакетов Ба Цзы бэкенда FastAPI
 */
async function executeBaziNetworkRequest(packetType) {
    const overlay = document.getElementById('magic-bottom-sheet');
    const titleEl = document.getElementById('sheet-title');
    const textEl = document.getElementById('sheet-text');

    if (!overlay || !titleEl || !textEl) return;

    titleEl.textContent = "✦ Распечатываем Свитки Ба Цзы...";
    textEl.innerHTML = `
        <div style="text-align: center; padding: 30px; color: #e2c275;">
            <div style="width: 32px; height: 32px; border: 2px solid rgba(226, 194, 117, 0.15); border-top-color: #e2c275; border-radius: 50%; margin: 0 auto 16px auto; animation: baziSpin 1s linear infinite;"></div>
            <p style="font-family: 'Philosopher', sans-serif; font-size: 14px; margin: 0;">Свитки Гримуара извлекают Дзя Цзы из памяти RAM...</p>
        </div>
        <style>@keyframes baziSpin { to { transform: rotate(360deg); } }</style>
    `;
    overlay.classList.add('active');

    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }

    let endpoint = "/api/v1/bazi/base"; 
    let bodyPayload = { 
        birth_date: activeBaziDate, 
        birth_time: activeBaziTime, 
        gender: activeBaziGender 
    };

    if (packetType === 'assets') {
        endpoint = "/api/v1/bazi/assets";
    } else if (packetType === 'chronos') {
        endpoint = "/api/v1/bazi/chronos";
        
        const birthYear = parseInt(activeBaziDate.split('-')[0]) || 1990;
        const currentYear = new Date().getFullYear();
        const computedAge = currentYear - birthYear;

        bodyPayload = {
            birth_date: activeBaziDate,
            birth_time: activeBaziTime,
            gender: activeBaziGender,
            current_age: computedAge
        };
    }

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyPayload)
        });

        const result = await response.json();

        if (result.status === "success") {
            const baziTitles = {
                'base': '📜 Базовый Манускрипт Сути Ба Цзы',
                'assets': '💼 Манускрипт Дел и Карьерных Врат',
                'chronos': '🔮 Высшее Откровение: Свиток Хроноса'
            };

            titleEl.textContent = baziTitles[packetType];
            textEl.innerHTML = result.html || result.data || "<p style='padding:20px; text-align:center;'>Манускрипт успешно прочитан.</p>";

            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }
        } else {
            titleEl.textContent = "Знание сокрыто";
            textEl.innerHTML = `<p style="color: #ef4444; text-align: center; padding: 20px;">${result.detail || 'Не удалось сопрячь Столпы Времени.'}</p>`;
        }
    } catch (error) {
        console.error("Bazi Network Error:", error);
        titleEl.textContent = "Обрыв связи";
        textEl.innerHTML = '<p style="color: #ef4444; text-align: center; padding: 20px;">Хранилище бэкенда недоступно. Проверьте туннель Docker-контейнеров.</p>';
    }
}

/**
 * ГЛОБАЛЬНЫЙ ПРОЦЕССОР СБРОСА КАРТЫ БА ЦЗЫ (Клик по крестику)
 */
window.executeGrimoireBaziReset = function() {
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }

    document.getElementById('bazi-collapsed-bar').classList.add('hidden');
    document.getElementById('bazi-visualization-block').classList.add('hidden');
    document.getElementById('bazi-packets-block').classList.add('hidden');
    document.getElementById('bazi-main-form-wrapper').classList.remove('hidden');

    activeBaziDate = "";
    activeBaziTime = "12:00";
};
// =====================================================================
// 👤 ЛОГИКА АВТОХАБА И ЛИЧНОГО КАБИНЕТА ПРОФИЛЯ
// =====================================================================
document.addEventListener('DOMContentLoaded', () => {
    const pInput = document.getElementById('profile-city-input');
    if (pInput && typeof initGrimoireCitySearch === 'function') {
        initGrimoireCitySearch(pInput);
    }
    setTimeout(() => { window.loadGrimoireMyDay(); }, 400);
});

window.saveGrimoireProfile = async function() {
    const name = document.getElementById('profile-name')?.value.trim();
    const gender = document.getElementById('profile-gender')?.value;
    const date = document.getElementById('profile-date')?.value;
    const time = document.getElementById('profile-time')?.value;
    const city = document.getElementById('profile-city-input')?.value.trim();
    const lat = document.getElementById('profile-lat')?.value;
    const lon = document.getElementById('profile-lon')?.value;

    if (!date || !time || !lat || lat === "") {
        alert("Брат, заполни дату, время и обязательно выбери город рождения из списка!");
        return;
    }

    const profileData = { name, gender, date, time, city, lat, lon };
    localStorage.setItem('grimoire_user_profile', JSON.stringify(profileData));

    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
    }

    alert("Свиток данных запечатан! Перенаправляю на твой Сакральный День...");
    const myDayBtn = document.querySelector('.bottom-nav button[data-screen="screen-my-day"]');
    if (myDayBtn) myDayBtn.click();
    window.loadGrimoireMyDay();
};

window.loadGrimoireMyDay = async function() {
    const rawData = localStorage.getItem('grimoire_user_profile');
    const coreContainer = document.getElementById('my-day-core');
    if (!rawData || !coreContainer) return;

    try {
        const u = JSON.parse(rawData);
        coreContainer.innerHTML = `<div style="text-align:center; color:#e2c275; padding:30px; font-style:italic;">Разворачиваю твои натальные нити...<br>Сверяюсь с транзитами планет неба... ✨</div>`;
        const tzOffset = -new Date().getTimezoneOffset() / 60;
        const now = new Date();
        const clientTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const todayStr = now.toISOString().split('T')[0];

        const response = await fetch('/api/v1/horoscope', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sign: "aries", period: "daily", gender: u.gender, date: todayStr,
                client_time: clientTime, tz_offset: tzOffset, lat: parseFloat(u.lat), lon: parseFloat(u.lon)
            })
        });

        const result = await response.json();
        if (result && result.status === 'success') {
            coreContainer.innerHTML = `
                <div style="background: rgba(226, 194, 117, 0.03); border: 1px dashed rgba(226, 194, 117, 0.25); border-radius: 12px; padding: 10px 14px; margin-bottom: 15px; text-align: center;">
                    <span style="color: #e2c275; font-size: 15px; font-weight: bold;">Приветствую, ${u.name || 'Путник'}! 🔮</span>
                    <span style="color: #64748b; font-size: 11.5px; display: block; margin-top: 2px;">Твоя карта зафиксирована: ${u.city}</span>
                </div>
                <div class="scroll-inner-text" style="font-family: 'Philosopher', serif !important;">${result.data.forecast}</div>`;
        }
    } catch (err) {
        coreContainer.innerHTML = `<p style="text-align:center; color:#ef4444; padding:20px;">Обрыв эфирного потока бэкенда.</p>`;
    }
};

