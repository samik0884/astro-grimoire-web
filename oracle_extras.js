document.addEventListener('DOMContentLoaded', () => {
    const oracleSection = document.getElementById('screen-oracle');
    if (!oracleSection) return;

    const nav = oracleSection.querySelector('.sub-tab-nav');
    if (!nav || document.getElementById('candle-magic')) return;

    const btnCandles = document.createElement('button');
    btnCandles.className = 'sub-tab-btn';
    btnCandles.setAttribute('data-subtab', 'candle-magic');
    btnCandles.innerText = 'Магия свечей';

    const btnNumerology = document.createElement('button');
    btnNumerology.className = 'sub-tab-btn';
    btnNumerology.setAttribute('data-subtab', 'numerology-code');
    btnNumerology.innerText = 'Нумерология';

    nav.appendChild(btnCandles);
    nav.appendChild(btnNumerology);

    const CANDLE_RECIPES = {
        love: {
            color: 'Розовая или алая свеча', hex: '#f43f5e',
            aroma: 'Роза, иланг-иланг, жасмин или сандал',
            herb: 'Лепестки розы, гибискус, корица',
            time: 'Вечер пятницы (день Венеры) на растущей Луне',
            mantra: '«Моё сердце открыто для искренней взаимности, тепла и гармонии. Я притягиваю любовь легко и естественно».'
        },
        money: {
            color: 'Зелёная или золотая свеча', hex: '#10b981',
            aroma: 'Пачули(замена: кедр или сосна), бергамот, сладкий апельсин, кедр',
            herb: 'Базилик, мята, лавровый лист, мускатный орех',
            time: 'Четверг (день Юпитера) или воскресенье на растущей Луне',
            mantra: '«Денежные потоки свободно находят путь ко мне. Мои идеи и труд приносят достойное изобилие».'
        },
        protect: {
            color: 'Белая или чёрная свеча', hex: '#a78bfa',
            aroma: 'Ладан, можжевельник, розмарин, шалфей',
            herb: 'Полынь, чертополох, зверобой, морская соль',
            time: 'Суббота (день Сатурна) или вторник на убывающей Луне',
            mantra: '«Всё чужое и тяжёлое растворяется в пламени. Моё пространство и энергия под надёжной защитой».'
        },
        calm: {
            color: 'Голубая или сиреневая свеча', hex: '#38bdf8',
            aroma: 'Лаванда, ромашка, мелисса, ладан',
            herb: 'Лаванда, чабрец, липовый цвет, мята',
            time: 'Понедельник (день Луны) перед сном',
            mantra: '«Тревоги уходят с дымом, ум проясняется, а внутри воцаряется глубокий покой и уверенность».'
        },
        energy: {
            color: 'Оранжевая или красная свеча', hex: '#f59e0b',
            aroma: 'Имбирь, грейпфрут, корица, розмарин',
            herb: 'Гвоздика, цедра апельсина, крапива, женьшень',
            time: 'Воскресенье (день Солнца) или утро вторника',
            mantra: '«Я наполняюсь живой силой огня. Моя воля ясна, а каждый шаг ведёт к победе».'
        },
        study: {
            color: 'Жёлтая свеча (Свеча Ясности)', hex: '#eab308',
            aroma: 'Лимон, мята перечная, розмарин или сосна',
            herb: 'Лист мяты, розмарин, цедра лимона, чабрец',
            time: 'Утро среды (день Меркурия) перед важной работой или учёбой',
            mantra: '«Мой разум ясен, память крепка, а нужные слова и решения приходят легко и вовремя».'
        },
        intuition: {
            color: 'Фиолетовая свеча (Свеча Озарения)', hex: '#c084fc',
            aroma: 'Лаванда, шалфей, можжевельник или пихта',
            herb: 'Шалфей, лаванда, душица, ягоды можжевельника',
            time: 'Вечер понедельника или полнолуние в тишине',
            mantra: '«Я слышу тихий голос своей интуиции. Скрытое становится ясным, а знаки судьбы — понятными».'
        },
        health: {
            color: 'Бирюзовая или зелёная свеча (Свеча Восстановления)', hex: '#2dd4bf',
            aroma: 'Эвкалипт, пихта, ромашка или чайное дерево',
            herb: 'Ромашка аптечная, зверобой, лист смородины, календула',
            time: 'Утро воскресенья или период убывающей Луны для очищения от усталости',
            mantra: '«Каждая клетка моего тела наполняется покоем, свежей силой и природным здоровьем».'
        },
        career: {
            color: 'Синяя свеча (Свеча Статуса и Решений)', hex: '#3b82f6',
            aroma: 'Кедр, бергамот, можжевельник или шалфей',
            herb: 'Лавровый лист (целый), зверобой, дубовая кора, чабрец',
            time: 'Четверг (день Юпитера) перед переговорами, собеседованием или сделкой',
            mantra: '«Моё слово имеет вес, мои границы крепки, а двери успеха открываются передо мной по праву».'
        }

        
    };

    const candleDiv = document.createElement('div');
    candleDiv.id = 'candle-magic';
    candleDiv.className = 'sub-tab-content hidden';
    candleDiv.innerHTML = [
        '<div class="tool-description-card"><div class="tool-desc-content"><b>🕯️ Магия Свечей и Ароматов</b> — подбор цвета свечи, эфирных масел, трав и аффирмации под ваш запрос.</div></div>',
        '<div style="background: rgba(15, 11, 28, 0.55); border: 1px solid rgba(226, 194, 117, 0.25); border-radius: 14px; padding: 14px; margin-top: 12px;">',
        '<label style="color: #94a3b8; font-size: 12.5px; display: block; margin-bottom: 6px;">Выберите намерение ритуала:</label>',
        '<select id="candle-intent-sel" style="width: 100%; height: 42px; padding: 0 12px; background: #0d0a14; color: #ffe066; border: 1px solid rgba(226,194,117,0.35); border-radius: 12px; font-size: 13.5px;">',
        '<option value="money">💰 Привлечение достатка и успеха</option>',
        '<option value="love">💞 Любовь, нежность и гармония в паре</option>',
        '<option value="protect">🛡️ Очищение дома и энергетическая защита</option>',
        '<option value="calm">🌙 Спокойствие, снятие стресса и крепкий сон</option>',
        '<option value="energy">🔥 Прилив сил, смелость и вдохновение</option>',
        '<option value="study">🧠 Ясность ума, учёба и переговоры</option>',
        '<option value="intuition">🔮 Интуиция, вещие сны и медитация</option>',
        '<option value="health">🌿 Восстановление сил и обновление</option>',
        '<option value="career">⚖️ Карьера, статус и удача в документах</option>',

        '</select></div><div id="candle-result-box" style="margin-top: 14px;"></div>'
    ].join('');
    oracleSection.appendChild(candleDiv);

    let candleInterval = null;
    const renderCandle = () => {
        if (candleInterval) { clearInterval(candleInterval); candleInterval = null; }
        const key = document.getElementById('candle-intent-sel')?.value || 'money';
        const r = CANDLE_RECIPES[key];
        const box = document.getElementById('candle-result-box');
        box.textContent = '';

        const card = document.createElement('div');
        card.style.cssText = 'background:rgba(22,18,36,0.88);border:1px solid ' + r.hex + ';border-radius:16px;padding:16px;';

        const head = document.createElement('div');
        head.style.cssText = 'color:' + r.hex + ';font-weight:bold;font-size:16px;margin-bottom:10px;';
        head.textContent = '🕯️ ' + r.color;

        const p1 = document.createElement('p');
        p1.style.cssText = 'color:#f3e8ff;font-size:13px;margin:0 0 8px 0;';
        p1.innerHTML = '💧 <b>Эфирные масла:</b> ' + r.aroma;

        const p2 = document.createElement('p');
        p2.style.cssText = 'color:#cbd5e1;font-size:13px;margin:0 0 8px 0;';
        p2.innerHTML = '🌿 <b>Травы и специи:</b> ' + r.herb;

        const p3 = document.createElement('p');
        p3.style.cssText = 'color:#cbd5e1;font-size:13px;margin:0 0 12px 0;';
        p3.innerHTML = '⏳ <b>Лучшее время:</b> ' + r.time;

        const mantraBox = document.createElement('div');
        mantraBox.style.cssText = 'background:rgba(13,10,20,0.75);border-left:3px solid ' + r.hex + ';padding:10px 12px;border-radius:8px;color:#ffe066;font-style:italic;font-size:13px;margin-bottom:12px;';
        mantraBox.textContent = r.mantra;

        const flameWrap = document.createElement('div');
        flameWrap.style.cssText = 'text-align:center;padding-top:6px;';

        const flameIcon = document.createElement('div');
        flameIcon.style.cssText = 'font-size:28px;margin-bottom:6px;opacity:0.35;transition:all 0.4s ease;';
        flameIcon.textContent = '🕯️';

        const lightBtn = document.createElement('button');
        lightBtn.type = 'button';
        lightBtn.style.cssText = 'width:100%;padding:10px;border-radius:12px;background:' + r.hex + '22;border:1px solid ' + r.hex + ';color:#fff;font-weight:bold;font-size:12.5px;cursor:pointer;';
        lightBtn.textContent = '🔥 Зажечь свечу намерения (60 сек.)';

        lightBtn.onclick = () => {
            if (candleInterval) {
                clearInterval(candleInterval);
                candleInterval = null;
                flameIcon.style.opacity = '0.35';
                flameIcon.style.filter = 'none';
                lightBtn.textContent = '🔥 Зажечь свечу намерения (60 сек.)';
                return;
            }
            let sec = 60;
            flameIcon.style.opacity = '1';
            flameIcon.style.filter = 'drop-shadow(0 0 14px ' + r.hex + ')';
            lightBtn.textContent = '🔥 Свеча горит... Фокусируйтесь (' + sec + ' сек.)';
            candleInterval = setInterval(() => {
                sec -= 1;
                if (sec <= 0) {
                    clearInterval(candleInterval);
                    candleInterval = null;
                    flameIcon.style.opacity = '0.4';
                    lightBtn.textContent = '✨ Ритуал завершён • Намерение отправлено';
                } else {
                    lightBtn.textContent = '🔥 Свеча горит... Фокусируйтесь (' + sec + ' сек.)';
                }
            }, 1000);
        };

        flameWrap.append(flameIcon, lightBtn);
        card.append(head, p1, p2, p3, mantraBox, flameWrap);
        box.appendChild(card);
    };

    document.getElementById('candle-intent-sel').addEventListener('change', renderCandle);
    renderCandle();
    const prof = JSON.parse(localStorage.getItem('astro_user_profile') || 'null');
    const defName = prof?.name || '';
    const defDate = prof?.date || '1993-05-15';

    const numDiv = document.createElement('div');
    numDiv.id = 'numerology-code';
    numDiv.className = 'sub-tab-content hidden';
    numDiv.innerHTML = [
        '<div class="tool-description-card"><div class="tool-desc-content"><b>🔢 Нумерология Имени и Даты</b> — расчёт Числа Жизненного Пути, вибрации Имени и Персонального Числа сегодняшнего дня.</div></div>',
        '<div style="background: rgba(15, 11, 28, 0.55); border: 1px solid rgba(167, 139, 250, 0.25); border-radius: 14px; padding: 14px; margin-top: 12px; display: flex; flex-direction: column; gap: 10px;">',
        '<input type="text" id="num-name-inp" value="' + defName + '" placeholder="Введите своё имя или имя близкого" style="height: 40px; padding: 0 12px; background: #0d0a14; color: #fff; border: 1px solid rgba(167,139,250,0.3); border-radius: 12px;">',
        '<input type="date" id="num-date-inp" value="' + defDate + '" style="height: 40px; padding: 0 12px; background: #0d0a14; color: #fff; border: 1px solid rgba(167,139,250,0.3); border-radius: 12px;">',
        '<button type="button" id="num-calc-btn" class="main-gold-btn" style="padding: 11px; border-radius: 12px;">🔢 Рассчитать Код Личности</button>',
        '</div><div id="num-result-box" style="margin-top: 14px;"></div>'
    ].join('');
    oracleSection.appendChild(numDiv);

    const reduceNum = (n) => {
        while (n > 9 && n !== 11 && n !== 22) {
            n = String(n).split('').reduce((a, b) => a + Number(b), 0);
        }
        return n;
    };

    const RU_MAP = {
        'а':1,'и':1,'с':1,'ъ':1,'б':2,'й':2,'т':2,'ы':2,'в':3,'к':3,'у':3,'ь':3,
        'г':4,'л':4,'ф':4,'э':4,'д':5,'м':5,'х':5,'ю':5,'е':6,'н':6,'ц':6,'я':6,
        'ё':7,'о':7,'ч':7,'ж':8,'п':8,'ш':8,'з':9,'р':9,'щ':9
    };

    const PATH_DESC = {
        1: 'Лидер и первопроходец: ваша сила в самостоятельности, смелых идеях и умении вести за собой.',
        2: 'Дипломат и миротворец: тонкая интуиция, талант партнёрства и умение объединять людей.',
        3: 'Творец и вдохновитель: харизма, дар слова, лёгкость и способность зажигать окружающих.',
        4: 'Созидатель и стратег: надёжность, системное мышление и умение строить прочный фундамент.',
        5: 'Исследователь и новатор: жажда свободы, перемен, путешествий и быстрой адаптации.',
        6: 'Хранитель гармонии: забота, эстетический вкус, ответственность и талант создавать уют.',
        7: 'Мудрец и аналитик: глубокий ум, тяга к тайным знаниям, философии и поиску истины.',
        8: 'Мастер материи и власти: амбиции, финансовое чутьё, масштаб и умение управлять ресурсами.',
        9: 'Гуманист и наставник: широта души, мудрость, служение высоким идеям и завершение циклов.',
        11: 'Мастер-число Интуиции: высокий духовный проводник, озарения и сильное влияние на людей.',
        22: 'Мастер-число Архитектора: способность воплощать грандиозные замыслы в реальном мире.'
    };

    const UNION_DESC = {
        1: 'Союз двух лидеров: мощный драйв и общие победы, если научитесь уступать друг другу руль.',
        2: 'Гармоничный и чуткий союз: глубокое взаимопонимание, тепло и поддержка с полуслова.',
        3: 'Яркая творческая пара: много общения, лёгкости, вдохновения и совместных идей.',
        4: 'Крепкий земной фундамент: надёжность, верность, общие цели и материальный рост.',
        5: 'Союз свободы и приключений: скучно не будет никогда, вас объединяют перемены и развитие.',
        6: 'Классический семейный магнит: забота, уют, преданность и красивая гармония в доме.',
        7: 'Кармический и интеллектуальный союз: глубокая духовная связь и общие поиски истины.',
        8: 'Тандем силы и масштаба: огромный потенциал для совместного бизнеса, статуса и капитала.',
        9: 'Мудрый союз родственных душ: высокая эмпатия, прощение и общие благородные цели.',
        11: 'Мастер-союз интуиции: редкая телепатическая связь и сильное взаимное пробуждение.',
        22: 'Мастер-союз созидателей: вместе вы способны построить проект или семью мечты.'
    };

    const numFormBox = numDiv.querySelector('div[style*="flex-direction: column"]');
    const partnerInp = document.createElement('input');
    partnerInp.type = 'date';
    partnerInp.id = 'num-partner-date';
    partnerInp.title = 'Дата близкого для расчёта совместимости (необязательно)';
    partnerInp.style.cssText = 'height:40px;padding:0 12px;background:#0d0a14;color:#a78bfa;border:1px dashed rgba(167,139,250,0.35);border-radius:12px;';

    const partnerLbl = document.createElement('label');
    partnerLbl.style.cssText = 'color:#94a3b8;font-size:11.5px;margin-bottom:-4px;';
    partnerLbl.textContent = '💞 Дата близкого (для Числа Союза — необязательно):';

    const circleChips = document.createElement('div');
    circleChips.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;';
    const circleList = JSON.parse(localStorage.getItem('astro_user_circle') || '[]');
    circleList.forEach(slot => {
        if (!slot?.date) return;
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.style.cssText = 'padding:4px 10px;border-radius:20px;background:rgba(167,139,250,0.14);border:1px solid rgba(167,139,250,0.35);color:#c4b5fd;font-size:11px;cursor:pointer;';
        chip.textContent = '💞 ' + (slot.name || 'Близкий');
        chip.onclick = () => {
            partnerInp.value = slot.date;
            calcNumerology();
        };
        circleChips.appendChild(chip);
    });

    if (numFormBox) {
        const calcBtnEl = document.getElementById('num-calc-btn');
        numFormBox.insertBefore(partnerLbl, calcBtnEl);
        numFormBox.insertBefore(partnerInp, calcBtnEl);
        if (circleChips.children.length > 0) numFormBox.insertBefore(circleChips, calcBtnEl);
    }

    const calcNumerology = () => {
        const dStr = document.getElementById('num-date-inp')?.value || '1993-05-15';
        const pStr = document.getElementById('num-partner-date')?.value || '';
        const nStr = (document.getElementById('num-name-inp')?.value || '').toLowerCase().trim();
        const digits = dStr.replace(/\D/g, '').split('').map(Number);
        const lifePath = reduceNum(digits.reduce((a, b) => a + b, 0) || 1);

        let nameSum = 0;
        for (const ch of nStr) {
            if (RU_MAP[ch]) nameSum += RU_MAP[ch];
            else if (ch >= 'a' && ch <= 'z') nameSum += ((ch.charCodeAt(0) - 97) % 9) + 1;
        }
        const nameCode = nameSum > 0 ? reduceNum(nameSum) : null;

        const now = new Date();
        const dayCode = reduceNum(now.getDate() + (now.getMonth() + 1) + now.getFullYear() + lifePath);

        let unionHtml = '';
        if (pStr) {
            const pDigits = pStr.replace(/\D/g, '').split('').map(Number);
            const pPath = reduceNum(pDigits.reduce((a, b) => a + b, 0) || 1);
            const unionCode = reduceNum(lifePath + pPath);
            unionHtml = '<div style="margin-top:12px;padding-top:12px;border-top:1px dashed rgba(167,139,250,0.3);">' +
                '<div style="color:#f472b6;font-weight:bold;font-size:14px;margin-bottom:4px;">💞 Число Вашего Союза: ' + unionCode + ' (Путь ' + lifePath + ' + ' + pPath + ')</div>' +
                '<p style="color:#f3e8ff;font-size:13px;margin:0;line-height:1.45;">' + (UNION_DESC[unionCode] || UNION_DESC[6]) + '</p></div>';
        }

        document.getElementById('num-result-box').innerHTML = [
            '<div style="background: rgba(22, 18, 36, 0.88); border: 1px solid rgba(226, 194, 117, 0.35); border-radius: 16px; padding: 16px;">',
            '<div style="display: grid; grid-template-columns: repeat(' + (nameCode ? 3 : 2) + ', 1fr); gap: 8px; text-align: center; margin-bottom: 12px;">',
            '<div style="background: rgba(13,10,20,0.8); padding: 10px; border-radius: 12px; border: 1px solid rgba(226,194,117,0.3);"><div style="color:#94a3b8; font-size:10.5px;">Путь Судьбы</div><div style="color:#ffe066; font-size:22px; font-weight:bold;">' + lifePath + '</div></div>',
            nameCode ? '<div style="background: rgba(13,10,20,0.8); padding: 10px; border-radius: 12px; border: 1px solid rgba(167,139,250,0.3);"><div style="color:#94a3b8; font-size:10.5px;">Код Имени</div><div style="color:#a78bfa; font-size:22px; font-weight:bold;">' + nameCode + '</div></div>' : '',
            '<div style="background: rgba(13,10,20,0.8); padding: 10px; border-radius: 12px; border: 1px solid rgba(16,185,129,0.3);"><div style="color:#94a3b8; font-size:10.5px;">Число Дня</div><div style="color:#10b981; font-size:22px; font-weight:bold;">' + dayCode + '</div></div>',
            '</div>',
            '<p style="color: #f3e8ff; font-size: 13.5px; margin: 0 0 8px 0; line-height: 1.45;">✨ <b>Ваше Число Пути (' + lifePath + '):</b> ' + (PATH_DESC[lifePath] || PATH_DESC[1]) + '</p>',
            nameCode ? '<p style="color: #e9d5ff; font-size: 13.5px; margin: 0 0 8px 0; line-height: 1.45;">🔮 <b>Вибрация вашего Имени (' + nameCode + '):</b> ' + (PATH_DESC[nameCode] || PATH_DESC[1]) + '</p>' : '',
            '<p style="color: #cbd5e1; font-size: 13px; margin: 0; line-height: 1.45;">📅 <b>Вибрация сегодняшнего дня (' + dayCode + '):</b> ' + (PATH_DESC[dayCode] || PATH_DESC[1]) + '</p>',
            unionHtml,
            '</div>'
        ].join('');
    };

    document.getElementById('num-calc-btn').addEventListener('click', calcNumerology);
    partnerInp.addEventListener('change', calcNumerology);
    calcNumerology();



    const btnBall = document.createElement('button');
    btnBall.className = 'sub-tab-btn';
    btnBall.setAttribute('data-subtab', 'magic-ball');
    btnBall.innerText = 'Магический шар';

    const btnTea = document.createElement('button');
    btnTea.className = 'sub-tab-btn';
    btnTea.setAttribute('data-subtab', 'tea-alchemist');
    btnTea.innerText = 'Чайный алхимик';

    nav.appendChild(btnBall);
    nav.appendChild(btnTea);

    const BALL_ANSWERS = [
        'Бесспорно — звёзды уже выстроились в твою пользу.',
        'Да, но действуй мягко и без лишней спешки.',
        'Весьма вероятно — знаки подтвердят это в ближайшие дни.',
        'Определённо да, доверься первому импульсу.',
        'Пока туманно — переспроси после заката или завтра утром.',
        'Сейчас лучше взять паузу и понаблюдать со стороны.',
        'Спроси снова, когда сформулируешь желание точнее.',
        'Звёзды советуют не торопиться: время ещё не созрело.',
        'Скорее нет — этот путь потребует слишком много сил.',
        'Вселенная бережёт тебя от этого шага — поищи другой вариант.',
        'Нет, но скоро откроется гораздо более щедрая дверь.',
        'Да, если ты готов взять ответственность на себя.'
    ];

    const ballDiv = document.createElement('div');
    ballDiv.id = 'magic-ball';
    ballDiv.className = 'sub-tab-content hidden';

    const ballDesc = document.createElement('div');
    ballDesc.className = 'tool-description-card';
    ballDesc.innerHTML = '<div class="tool-desc-content"><b>🔮 Магический Шар Судьбы</b> — сформулируйте вопрос «Да» или «Нет» и коснитесь сферы.</div>';

    const qInput = document.createElement('input');
    qInput.type = 'text';
    qInput.id = 'sphere-question-inp';
    qInput.placeholder = 'Напишите ваш вопрос (необязательно)...';
    qInput.style.cssText = 'width:100%;height:40px;padding:0 12px;margin-top:12px;background:#0d0a14;color:#fff;border:1px solid rgba(167,139,250,0.35);border-radius:12px;box-sizing:border-box;font-size:13px;';

    const sphereWrap = document.createElement('div');
    sphereWrap.style.cssText = 'display:flex;flex-direction:column;align-items:center;margin-top:16px;';

    const sphereEl = document.createElement('div');
    sphereEl.id = 'crystal-sphere';
    sphereEl.style.cssText = 'width:174px;height:174px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#4c1d95,#1e1b4b 60%,#090712 100%);border:2px solid rgba(226,194,117,0.5);box-shadow:0 0 30px rgba(139,92,246,0.45),inset 0 0 25px rgba(226,194,117,0.2);display:flex;align-items:center;justify-content:center;text-align:center;padding:18px;cursor:pointer;transition:transform 0.3s ease,box-shadow 0.3s ease;';

    const sphereTxt = document.createElement('span');
    sphereTxt.id = 'sphere-answer-text';
    sphereTxt.style.cssText = 'color:#ffe066;font-size:13.5px;font-weight:bold;line-height:1.35;';
    sphereTxt.textContent = 'Коснись шара, чтобы узнать ответ...';
    sphereEl.appendChild(sphereTxt);

    const shakeBtn = document.createElement('button');
    shakeBtn.type = 'button';
    shakeBtn.className = 'main-gold-btn';
    shakeBtn.style.cssText = 'margin-top:16px;padding:11px 22px;border-radius:12px;';
    shakeBtn.textContent = '🔮 Задать вопрос Сфере';

    sphereWrap.append(sphereEl, shakeBtn);
    ballDiv.append(ballDesc, qInput, sphereWrap);
    oracleSection.appendChild(ballDiv);

    const askSphere = () => {
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }
        sphereEl.style.transform = 'scale(0.92)';
        sphereEl.style.boxShadow = '0 0 42px rgba(226,194,117,0.65),inset 0 0 30px rgba(167,139,250,0.4)';
        sphereTxt.style.opacity = '0.3';
        sphereTxt.textContent = 'Сфера считывает нити судьбы...';

        const qVal = (qInput.value || '').trim().toLowerCase();
        setTimeout(() => {
            sphereEl.style.transform = 'scale(1)';
            sphereEl.style.boxShadow = '0 0 30px rgba(139,92,246,0.45),inset 0 0 25px rgba(226,194,117,0.2)';
            sphereTxt.style.opacity = '1';
            let idx = Math.floor(Math.random() * BALL_ANSWERS.length);
            if (qVal.length > 2) {
                const seedStr = qVal + '_' + new Date().toISOString().split('T').at(0);
                let h = 0;
                for (let i = 0; i < seedStr.length; i++) h = (h * 31 + seedStr.charCodeAt(i)) % 100000;
                idx = Math.abs(h) % BALL_ANSWERS.length;
            }
            sphereTxt.textContent = BALL_ANSWERS.at(idx);
        }, 480);
    };
    sphereEl.onclick = askSphere;
    shakeBtn.onclick = askSphere;





    let teaTimer = null;
    const EL_KEY_MAP = { 'Огонь': 'fire', 'Земля': 'earth', 'Воздух': 'air', 'Вода': 'water' };
    const SIGN_EL_MAP = {
        aries: 'fire', leo: 'fire', sagittarius: 'fire',
        taurus: 'earth', virgo: 'earth', capricorn: 'earth',
        gemini: 'air', libra: 'air', aquarius: 'air',
        cancer: 'water', scorpio: 'water', pisces: 'water'
    };

    const teaDiv = document.createElement('div');
    teaDiv.id = 'tea-alchemist';
    teaDiv.className = 'sub-tab-content hidden';

    const teaDesc = document.createElement('div');
    teaDesc.className = 'tool-description-card';
    teaDesc.innerHTML = '<div class="tool-desc-content"><b>🌿 Чайный Алхимик Дня</b> — персональный рецепт напитка, специй и трав под ваше состояние и стихию.</div>';

    const teaCtrl = document.createElement('div');
    teaCtrl.style.cssText = 'background:rgba(15,11,28,0.55);border:1px solid rgba(16,185,129,0.25);border-radius:14px;padding:14px;margin-top:12px;';

    const teaLbl = document.createElement('label');
    teaLbl.style.cssText = 'color:#94a3b8;font-size:12.5px;display:block;margin-bottom:6px;';
    teaLbl.textContent = 'Какой эффект нужен прямо сейчас?';

    const teaSel = document.createElement('select');
    teaSel.id = 'tea-mood-sel';
    teaSel.style.cssText = 'width:100%;height:42px;padding:0 12px;background:#0d0a14;color:#10b981;border:1px solid rgba(16,185,129,0.35);border-radius:12px;font-size:13.5px;';

    [
        ['luck', '✨ Удача, достаток и успех в делах'],
        ['focus', '🧠 Ясность ума, фокус и концентрация'],
        ['calm', '🌙 Спокойствие, антистресс и уют'],
        ['love', '💞 Нежность, романтика и гармония'],
        ['intuition', '🔮 Глубокая интуиция и вещие сны'],
        ['vitality', '🔥 Тонус, драйв и прилив сил'],
        ['shield', '🛡️ Защита границ и очищение после людей'],
        ['inspire', '☀️ Творческое вдохновение и радость'],
        ['insight', '⚡ Свежая идея и выход из тупика'],
        ['ground', '🌿 Заземление, опора и уверенность'],
        ['magnet', '🧲 Личный магнетизм и харизма'],
        ['detox', '💧 Утреннее обновление и лёгкость']
    ].forEach(([val, txt]) => {
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = txt;
        teaSel.appendChild(opt);
    });

    const teaResult = document.createElement('div');
    teaResult.id = 'tea-result-box';
    teaResult.style.marginTop = '14px';

    teaCtrl.append(teaLbl, teaSel);
    teaDiv.append(teaDesc, teaCtrl, teaResult);
    oracleSection.appendChild(teaDiv);

    let lastTeaTitle = '';
    const renderTea = async (isReroll = false) => {
        if (teaTimer) { clearInterval(teaTimer); teaTimer = null; }
        teaResult.textContent = '⏳ Подбираем травы и специи...';

        const p = JSON.parse(localStorage.getItem('astro_user_profile') || 'null');
        const elKey = SIGN_EL_MAP[p?.sign] || EL_KEY_MAP[p?.element] || 'all';
        let t = {
            title: 'Золотой Нектар Изобилия (Юпитер)',
            base: 'Чёрный чай или ферментированный иван-чай (95°C)',
            spice: 'Палочка корицы, 2 коробочки кардамона и цедра апельсина',
            ritual: 'Размешивайте напиток по часовой стрелке, представляя успешное завершение дела.'
        };

        try {
            const res = await fetch('/api/v1/oracle/tea', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mood: teaSel.value || 'luck',
                    element: elKey,
                    reroll: isReroll === true,
                    exclude_title: lastTeaTitle
                })
            });
            const data = await res.json();
            if (data.status === 'ok' && data.recipe?.title) t = data.recipe;
        } catch (e) {}
        lastTeaTitle = t.title;

        teaResult.textContent = '';
        const card = document.createElement('div');
        card.style.cssText = 'background:rgba(22,18,36,0.88);border:1px solid rgba(16,185,129,0.45);border-radius:16px;padding:16px;';

        const title = document.createElement('div');
        title.style.cssText = 'color:#10b981;font-weight:bold;font-size:15.5px;margin-bottom:10px;';
        title.textContent = '🍵 ' + t.title;

        const bLine = document.createElement('p');
        bLine.style.cssText = 'color:#f3e8ff;font-size:13px;margin:0 0 8px 0;';
        bLine.innerHTML = '🍂 <b>Основа:</b> ' + t.base;

        const sLine = document.createElement('p');
        sLine.style.cssText = 'color:#cbd5e1;font-size:13px;margin:0 0 10px 0;';
        sLine.innerHTML = '🌿 <b>Травы и специи:</b> ' + t.spice;

        const rBox = document.createElement('div');
        rBox.style.cssText = 'background:rgba(13,10,20,0.75);border-left:3px solid #10b981;padding:10px;border-radius:8px;color:#cbd5e1;font-size:12.5px;margin-bottom:12px;';
        rBox.textContent = t.ritual;

        const btnRow = document.createElement('div');
        btnRow.style.cssText = 'display:flex;gap:8px;';

        const brewBtn = document.createElement('button');
        brewBtn.type = 'button';
        brewBtn.style.cssText = 'flex:2;padding:10px;border-radius:12px;background:rgba(16,185,129,0.14);border:1px solid rgba(16,185,129,0.45);color:#34d399;font-weight:bold;font-size:12px;cursor:pointer;';
        brewBtn.textContent = '⏳ Таймер (3 мин.)';

        const rerollBtn = document.createElement('button');
        rerollBtn.type = 'button';
        rerollBtn.style.cssText = 'flex:1;padding:10px;border-radius:12px;background:rgba(167,139,250,0.12);border:1px solid rgba(167,139,250,0.35);color:#c4b5fd;font-weight:bold;font-size:12px;cursor:pointer;';
        rerollBtn.textContent = '🎲 Ещё сбор';
        rerollBtn.onclick = () => renderTea(true);

        brewBtn.onclick = () => {
            if (teaTimer) {
                clearInterval(teaTimer);
                teaTimer = null;
                brewBtn.textContent = '⏳ Таймер (3 мин.)';
                return;
            }
            let sec = 180;
            const fmt = (s) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
            brewBtn.textContent = '♨️ ' + fmt(sec);
            teaTimer = setInterval(() => {
                sec -= 1;
                if (sec <= 0) {
                    clearInterval(teaTimer);
                    teaTimer = null;
                    brewBtn.textContent = '🍵 Готово!';
                } else {
                    brewBtn.textContent = '♨️ ' + fmt(sec);
                }
            }, 1000);
        };

        btnRow.append(brewBtn, rerollBtn);
        card.append(title, bLine, sLine, rBox, btnRow);
        teaResult.appendChild(card);
    };

    teaSel.addEventListener('change', () => renderTea(false));
    renderTea(false);
});


