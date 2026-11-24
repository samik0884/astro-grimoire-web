document.addEventListener('DOMContentLoaded', () => {
    const ZODIAC_LIST = [
        { key: 'capricorn', ru: 'Козерог', el: 'Земля', m1: 12, d1: 22, m2: 1, d2: 19 },
        { key: 'aquarius', ru: 'Водолей', el: 'Воздух', m1: 1, d1: 20, m2: 2, d2: 18 },
        { key: 'pisces', ru: 'Рыбы', el: 'Вода', m1: 2, d1: 19, m2: 3, d2: 20 },
        { key: 'aries', ru: 'Овен', el: 'Огонь', m1: 3, d1: 21, m2: 4, d2: 19 },
        { key: 'taurus', ru: 'Телец', el: 'Земля', m1: 4, d1: 20, m2: 5, d2: 20 },
        { key: 'gemini', ru: 'Близнецы', el: 'Воздух', m1: 5, d1: 21, m2: 6, d2: 20 },
        { key: 'cancer', ru: 'Рак', el: 'Вода', m1: 6, d1: 21, m2: 7, d2: 22 },
        { key: 'leo', ru: 'Лев', el: 'Огонь', m1: 7, d1: 23, m2: 8, d2: 22 },
        { key: 'virgo', ru: 'Дева', el: 'Земля', m1: 8, d1: 23, m2: 9, d2: 22 },
        { key: 'libra', ru: 'Весы', el: 'Воздух', m1: 9, d1: 23, m2: 10, d2: 22 },
        { key: 'scorpio', ru: 'Скорпион', el: 'Вода', m1: 10, d1: 23, m2: 11, d2: 21 },
        { key: 'sagittarius', ru: 'Стрелец', el: 'Огонь', m1: 11, d1: 22, m2: 12, d2: 21 }
    ];

    const EASTERN_LIST = [
        { key: 'rat', ru: 'Крыса' }, { key: 'ox', ru: 'Бык' }, { key: 'tiger', ru: 'Тигр' },
        { key: 'rabbit', ru: 'Кролик' }, { key: 'dragon', ru: 'Дракон' }, { key: 'snake', ru: 'Змея' },
        { key: 'horse', ru: 'Лошадь' }, { key: 'goat', ru: 'Коза' }, { key: 'monkey', ru: 'Обезьяна' },
        { key: 'rooster', ru: 'Петух' }, { key: 'dog', ru: 'Собака' }, { key: 'pig', ru: 'Свинья' }
    ];

    function getWesternSign(dateStr) {
        if (!dateStr || !dateStr.includes('-')) return ZODIAC_LIST.at(3);
        const parts = dateStr.split('-');
        const m = parseInt(parts.at(1), 10);
        const d = parseInt(parts.at(2), 10);
        if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return ZODIAC_LIST.at(0);
        return ZODIAC_LIST.find(z => (m === z.m1 && d >= z.d1) || (m === z.m2 && d <= z.d2)) || ZODIAC_LIST.at(3);
    }

    function getEasternSign(dateStr) {
        if (!dateStr || !dateStr.includes('-')) return EASTERN_LIST.at(4);
        const parts = dateStr.split('-');
        let y = parseInt(parts.at(0), 10);
        const m = parseInt(parts.at(1), 10);
        const d = parseInt(parts.at(2), 10);
        if (m === 1 || (m === 2 && d < 4)) y -= 1;
        const idx = ((y - 1900) % 12 + 12) % 12;
        return EASTERN_LIST.at(idx) || EASTERN_LIST.at(0);
    }

    function calcBeautyForDate(dateObj) {
        const knownNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
        const synodic = 29.53058867;
        const age = (((dateObj.getTime() - knownNewMoon.getTime()) / 86400000) % synodic + synodic) % synodic;
        const lunarDay = Math.floor(age) + 1;
        const isWaxing = age < 14.76;
        const goodDays = "5,6,8,11,13,14,19,21,22,23,26,27,28".split(",").map(Number);
        const badDays = "1,2,4,9,12,15,18,20,25,29".split(",").map(Number);


        let status = 'Нейтрально', color = '#e2c275';
        let hairNote = 'Ровный день для лёгкого освежения кончиков без радикальных перемен.';
        if (goodDays.includes(lunarDay)) {
            status = 'Благоприятно'; color = '#10b981';
            hairNote = isWaxing
                ? 'Идеальный день! Стрижка привлечёт удачу, ускорит рост волос и укрепит корни.'
                : 'Отличный день для формы и густоты: стрижка укрепит структуру волос.';
        } else if (badDays.includes(lunarDay)) {
            status = 'Не рекомендуется'; color = '#ef4444';
            hairNote = 'Энергия Луны нестабильна: отложите ножницы, лучше сделайте питательную маску.';
        }
        const colorNote = isWaxing ? 'Окрашивание и тонирование лягут ровно и надолго сохранят цвет.' : 'Подходит для мягкого тонирования и очищающих процедур.';
        const skinNote = isWaxing ? 'Кожа активно впитывает увлажняющие и питательные сыворотки.' : 'Лучшее время для пилингов, чистки и детокс-масок.';
        return { lunarDay, isWaxing, status, color, hairNote, colorNote, skinNote };
    }

    function calcRetroPlanets(dateObj) {
        const t = dateObj.getTime();
        const fmtDate = (ms) => new Date(ms).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }).replace('.', '');

        const getStatus = (ranges, cycleDays, retroDays, retroLabel, directLabel) => {
            for (let i = 0; i < ranges.length; i++) {
                const pair = ranges.at(i);
                const sMs = new Date(pair.at(0) + 'T00:00:00').getTime();
                const eMs = new Date(pair.at(1) + 'T23:59:59').getTime();
                if (t >= sMs && t <= eMs) {
                    return { retro: true, nextStart: null, short: retroLabel + ' • до ' + fmtDate(eMs) };
                }
                if (sMs > t) {
                    return { retro: false, nextStart: pair.at(0), short: directLabel + ' • до ' + fmtDate(sMs) };
                }
            }
            // Вечный синодический расчёт после конца таблицы
            const lastStartMs = new Date(ranges.at(-1).at(0) + 'T00:00:00').getTime();
            const cycleMs = cycleDays * 86400000;
            const retroMs = retroDays * 86400000;
            const elapsed = ((t - lastStartMs) % cycleMs + cycleMs) % cycleMs;
            if (elapsed <= retroMs) {
                const endMs = t + (retroMs - elapsed);
                return { retro: true, nextStart: null, short: retroLabel + ' • до ' + fmtDate(endMs) };
            }
            const nextMs = t + (cycleMs - elapsed);
            const nextIso = new Date(nextMs).toISOString().split('T').at(0);
            return { retro: false, nextStart: nextIso, short: directLabel + ' • до ' + fmtDate(nextMs) };
        };

        const m = getStatus([
            ['2025-03-15','2025-04-07'],['2025-07-18','2025-08-11'],['2025-11-09','2025-11-29'],
            ['2026-02-26','2026-03-20'],['2026-06-29','2026-07-23'],['2026-10-24','2026-11-13'],
            ['2027-02-09','2027-03-03'],['2027-06-10','2027-07-04'],['2027-10-07','2027-10-28'],
            ['2028-01-24','2028-02-14'],['2028-05-21','2028-06-13'],['2028-09-19','2028-10-11'],
            ['2029-01-07','2029-01-27'],['2029-05-01','2029-05-25'],['2029-09-02','2029-09-24'],['2029-12-21','2030-01-10']
        ], 115.88, 22, 'Ретроградный', 'Директный');

        const v = getStatus([
            ['2025-03-02','2025-04-13'],['2026-10-03','2026-11-14'],['2028-05-10','2028-06-22'],['2029-12-16','2030-01-26']
        ], 583.92, 41, 'Ретроградная', 'Директная');

        const ma = getStatus([
            ['2024-12-06','2025-02-24'],['2027-01-10','2027-04-01'],['2029-02-14','2029-05-05']
        ], 779.94, 72, 'Ретроградный', 'Директный');

        const j = getStatus([
            ['2025-11-11','2026-03-11'],['2026-12-13','2027-04-13'],['2028-01-13','2028-05-14'],['2029-02-13','2029-06-15']
        ], 398.88, 121, 'Ретроградный', 'Директный');

        const s = getStatus([
            ['2025-07-13','2025-11-28'],['2026-07-26','2026-12-10'],['2027-08-09','2027-12-24'],['2028-08-22','2029-01-05']
        ], 378.09, 138, 'Ретроградный', 'Директный');

        return [
            { glyph: '☿', name: 'Меркурий', retro: m.retro, nextStart: m.nextStart, short: m.short, advice: m.retro ? 'Проверяйте договоры и билеты, отложите покупку техники — идеально завершать старые дела.' : 'Путь открыт для переговоров, документов, обучения, поездок и покупки техники.' },
            { glyph: '♀', name: 'Венера', retro: v.retro, nextStart: v.nextStart, short: v.short, advice: v.retro ? 'Не спешите со сменой имиджа и крупными тратами. Возможны встречи с людьми из прошлого.' : 'Благоприятное время для свиданий, творчества и покупок для души.' },
            { glyph: '♂', name: 'Марс', retro: ma.retro, nextStart: ma.nextStart, short: ma.short, advice: ma.retro ? 'Избегайте ссор и резких стартов, берегите силы и дорабатывайте начатые проекты.' : 'Отличный период для активных шагов, спорта и запуска новых задач.' },
            { glyph: '♃', name: 'Юпитер', retro: j.retro, nextStart: j.nextStart, short: j.short, advice: j.retro ? 'Время переосмыслить цели и вернуться к отложенному обучению.' : 'Зелёный свет для масштабирования, путешествий и обучения.' },
            { glyph: '♄', name: 'Сатурн', retro: s.retro, nextStart: s.nextStart, short: s.short, advice: s.retro ? 'Наведите порядок в планах, бюджете и долгосрочных обязательствах.' : 'Хорошее время для выстраивания системы и карьерного роста.' }
        ];
    }



    const dailySection = document.getElementById('screen-daily');
    if (dailySection) {
        const nav = dailySection.querySelector('.sub-tab-nav');
        if (nav && !document.getElementById('beauty-guide')) {
            const btnBeauty = document.createElement('button');
            btnBeauty.className = 'sub-tab-btn';
            btnBeauty.setAttribute('data-subtab', 'beauty-guide');
            btnBeauty.innerText = 'Календарь стрижек';

            const btnRetro = document.createElement('button');
            btnRetro.className = 'sub-tab-btn';
            btnRetro.setAttribute('data-subtab', 'retro-planets');
            btnRetro.innerText = 'Ретро-планеты';

            nav.appendChild(btnBeauty);
            nav.appendChild(btnRetro);

            const todayStr = new Date().toISOString().split('T').at(0);

            const beautyDiv = document.createElement('div');
            beautyDiv.id = 'beauty-guide';
            beautyDiv.className = 'sub-tab-content hidden';
            beautyDiv.innerHTML = [
                '<div class="tool-description-card"><div class="tool-desc-content"><b>💇‍♀️ Лунный Бьюти-Гид</b> — подбор лучших дней для стрижки, окрашивания и ухода по фазам Луны.</div></div>',
                '<div style="background: rgba(15, 11, 28, 0.55); border: 1px solid rgba(226, 194, 117, 0.2); border-radius: 14px; padding: 14px; margin-top: 12px;">',
                '<label style="color: #94a3b8; font-size: 12.5px; display: block; margin-bottom: 6px;">Выберите дату визита:</label>',
                '<input type="date" id="beauty-date-inp" value="' + todayStr + '" style="width: 100%; height: 42px; padding: 0 12px; background: #0d0a14; color: #fff; border: 1px solid rgba(226,194,117,0.3); border-radius: 12px; box-sizing: border-box;">',
                '</div><div id="beauty-result-box" style="margin-top: 14px;"></div>'
            ].join('');
            dailySection.appendChild(beautyDiv);

            const retroDiv = document.createElement('div');
            retroDiv.id = 'retro-planets';
            retroDiv.className = 'sub-tab-content hidden';
            retroDiv.innerHTML = [
                '<div class="tool-description-card"><div class="tool-desc-content"><b>⚡ Ретроградные Планеты</b> — космический светофор для важных покупок, договоров и отношений.</div></div>',
                '<div style="background: rgba(15, 11, 28, 0.55); border: 1px solid rgba(167, 139, 250, 0.2); border-radius: 14px; padding: 14px; margin-top: 12px;">',
                '<label style="color: #94a3b8; font-size: 12.5px; display: block; margin-bottom: 6px;">Проверить статус планет на дату:</label>',
                '<input type="date" id="retro-date-inp" value="' + todayStr + '" style="width: 100%; height: 42px; padding: 0 12px; background: #0d0a14; color: #fff; border: 1px solid rgba(167,139,250,0.3); border-radius: 12px; box-sizing: border-box;">',
                '</div><div id="retro-result-box" style="margin-top: 14px;"></div>'
            ].join('');
            dailySection.appendChild(retroDiv);

            const renderBeauty = () => {
                const val = document.getElementById('beauty-date-inp')?.value || todayStr;
                const baseDate = new Date(val + 'T12:00:00');
                const b = calcBeautyForDate(baseDate);
                let weekRows = '';
                const moneyDays = "5,13,14,21,27".split(",").map(Number);
                for (let i = 1; i <= 7; i++) {
                    const nextD = new Date(baseDate.getTime() + i * 86400000);
                    const nb = calcBeautyForDate(nextD);
                    const dLabel = nextD.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', weekday: 'short' });
                    const moneyTag = moneyDays.includes(nb.lunarDay) ? ' <span style="color:#ffe066;font-size:11px;">• 💰 Денежный</span>' : '';
                    weekRows += '<div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid rgba(255,255,255,0.06); font-size:12.5px;"><span style="color:#cbd5e1;">' + dLabel + ' (' + nb.lunarDay + ' л.д.)' + moneyTag + '</span><span style="color:' + nb.color + '; font-weight:bold;">' + nb.status + '</span></div>';
                }

                document.getElementById('beauty-result-box').innerHTML = [
                    '<div style="background: rgba(22, 18, 36, 0.85); border: 1px solid ' + b.color + '; border-radius: 16px; padding: 16px; margin-bottom: 12px;">',
                    '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;"><span style="color:#e2c275; font-weight:bold; font-size:15px;">🌖 ' + b.lunarDay + '-й Лунный день (' + (b.isWaxing ? 'Растущая' : 'Убывающая') + ')</span>',
                    '<span style="background:' + b.color + '22; color:' + b.color + '; border:1px solid ' + b.color + '; padding:3px 10px; border-radius:20px; font-size:11.5px; font-weight:bold;">' + b.status + '</span></div>',
                    '<p style="color:#f3e8ff; font-size:13.5px; margin:0 0 8px 0;">✂️ <b>Стрижка:</b> ' + b.hairNote + '</p>',
                    '<p style="color:#cbd5e1; font-size:13px; margin:0 0 8px 0;">🎨 <b>Окрашивание:</b> ' + b.colorNote + '</p>',
                    '<p style="color:#cbd5e1; font-size:13px; margin:0;">✨ <b>Уход за кожей:</b> ' + b.skinNote + '</p></div>',
                    '<div style="background: rgba(15, 11, 28, 0.65); border: 1px solid rgba(226,194,117,0.2); border-radius: 14px; padding: 14px;"><div style="color:#e2c275; font-weight:bold; font-size:13.5px; margin-bottom:6px;">📅 Прогноз стрижек на 7 дней вперёд</div>' + weekRows + '</div>'
                ].join('');
            };

            const renderRetro = () => {
                const inp = document.getElementById('retro-date-inp');
                const val = inp?.value || todayStr;
                const planets = calcRetroPlanets(new Date(val + 'T12:00:00'));
                const upcoming = planets.map(p => p.nextStart).filter(Boolean).sort();
                const nearestRetro = upcoming.at(0) || todayStr;

                const navRow = '<div style="display:flex;gap:8px;margin-bottom:12px;">' +
                    '<button type="button" id="retro-jump-today" style="flex:1;padding:8px;border-radius:10px;background:rgba(226,194,117,0.1);border:1px solid rgba(226,194,117,0.3);color:#e2c275;font-size:11.5px;font-weight:bold;cursor:pointer;">📅 Сегодня</button>' +
                    '<button type="button" id="retro-jump-next" style="flex:1;padding:8px;border-radius:10px;background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.35);color:#fbbf24;font-size:11.5px;font-weight:bold;cursor:pointer;">⚡ Ближайший разворот</button>' +
                    '</div>';

                const cardsHtml = planets.map(p => {
                    const col = p.retro ? '#f59e0b' : '#10b981';
                    return '<div style="background: rgba(22, 18, 36, 0.85); border: 1px solid ' + col + '55; border-radius: 14px; padding: 14px; margin-bottom: 10px;">' +
                        '<div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;"><span style="color:#ffe066; font-weight:bold; font-size:15px;">' + p.glyph + ' ' + p.name + '</span>' +
                        '<span style="background:' + col + '22; color:' + col + '; border:1px solid ' + col + '; padding:2px 10px; border-radius:20px; font-size:11px; font-weight:bold;">' + p.short + '</span></div>' +
                        '<p style="color:#cbd5e1; font-size:13px; margin:0; line-height:1.45;">' + p.advice + '</p></div>';
                }).join('');

                document.getElementById('retro-result-box').innerHTML = navRow + cardsHtml;
                document.getElementById('retro-jump-today').onclick = () => { if (inp) { inp.value = todayStr; renderRetro(); } };
                document.getElementById('retro-jump-next').onclick = () => { if (inp) { inp.value = nearestRetro; renderRetro(); } };
            };


            document.getElementById('beauty-date-inp').addEventListener('change', renderBeauty);
            document.getElementById('retro-date-inp').addEventListener('change', renderRetro);
            renderBeauty();
            renderRetro();
            const btnMantra = document.createElement('button');
            btnMantra.className = 'sub-tab-btn';
            btnMantra.setAttribute('data-subtab', 'daily-mantra');
            btnMantra.innerText = 'Мантра дня';

            const btnTalisman = document.createElement('button');
            btnTalisman.className = 'sub-tab-btn';
            btnTalisman.setAttribute('data-subtab', 'daily-talisman');
            btnTalisman.innerText = 'Цвет и Камень дня';

            nav.appendChild(btnMantra);
            nav.appendChild(btnTalisman);

            const MANTRAS_BY_EL = {
                'Огонь': [
                    'Мой внутренний огонь освещает путь к победе. Я действую смело и притягиваю лучшие возможности.',
                    'Я — источник живой энергии и вдохновения. Все мои начинания сегодня наполнены силой успеха.',
                    'Моя воля ясна, а сердце бесстрашно. Сегодня Вселенная поддерживает каждый мой решительный шаг.'
                ],
                'Земля': [
                    'Я твердо стою на земле и легко превращаю свои идеи в ощутимое изобилие и стабильность.',
                    'Спокойствие и уверенность — моя опора. День приносит мне надёжные плоды и гармоничные решения.',
                    'Я в гармонии с материальным миром. Ресурсы приходят ко мне вовремя и приумножаются.'
                ],
                'Воздух': [
                    'Мой разум чист и гибок. Нужные люди, свежие идеи и счастливые вести сами находят меня сегодня.',
                    'Я легко отпускаю лишнее и вдыхаю ветер добрых перемен. Общение сегодня открывает новые двери.',
                    'Моя интуиция и интеллект работают в унисон, подсказывая самые точные и изящные ходы.'
                ],
                'Вода': [
                    'Я доверяю потоку жизни и своей глубинной интуиции. Всё складывается наилучшим для меня образом.',
                    'Моё сердце наполнено тишиной, любовью и мудростью. Я притягиваю тепло и искреннюю поддержку.',
                    'Я мягко растворяю любые преграды и наполняюсь свежей, исцеляющей энергией этого дня.'
                ]
            };

            const DAY_TALISMANS = [
                { day: 'Воскресенье (Солнце ☀️)', color: 'Золотой, янтарный, шафрановый', stone: 'Цитрин или Солнечный камень', tip: 'День яркого проявления себя, лидерства и творческих планов.' },
                { day: 'Понедельник (Луна 🌙)', color: 'Жемчужный, серебристый, молочный', stone: 'Лунный камень или Жемчуг', tip: 'День интуиции, заботы о себе, семьи и мягкой сонастройки.' },
                { day: 'Вторник (Марс 🔴)', color: 'Алый, гранатовый, терракотовый', stone: 'Гранат или Красная яшма', tip: 'День решительных действий, спорта и прорыва в сложных задачах.' },
                { day: 'Среда (Меркурий ☿)', color: 'Изумрудный, бирюзовый, светло-серый', stone: 'Агат или Амазонит', tip: 'День переговоров, обучения, поездок и удачных сделок.' },
                { day: 'Четверг (Юпитер ♃)', color: 'Королевский синий, фиолетовый, индиго', stone: 'Лазурит или Аметист', tip: 'День масштабирования, стратегических решений и поиска наставников.' },
                { day: 'Пятница (Венера ♀)', color: 'Розовый, изумрудный, пастельный', stone: 'Розовый кварц или Малахит', tip: 'День любви, красоты, искусства, подарков и приятных встреч.' },
                { day: 'Суббота (Сатурн ♄)', color: 'Графитовый, тёмно-синий, чёрный', stone: 'Обсидиан или Дымчатый кварц', tip: 'День порядка, подведения итогов, защиты границ и отдыха.' }
            ];

            const profData = JSON.parse(localStorage.getItem('astro_user_profile') || 'null');
            const userEl = getWesternSign(profData?.date || '').el;
            const nowObj = new Date();
            const mList = MANTRAS_BY_EL[userEl] || MANTRAS_BY_EL['Огонь'];
            const todayMantra = mList.at(nowObj.getDate() % mList.length);
            const tal = DAY_TALISMANS.at(nowObj.getDay());

                        let mantraIdx = nowObj.getDate() % mList.length;
            let breathTimer = null;

            const mantraDiv = document.createElement('div');
            mantraDiv.id = 'daily-mantra';
            mantraDiv.className = 'sub-tab-content hidden';

            const mDesc = document.createElement('div');
            mDesc.className = 'tool-description-card';
            mDesc.innerHTML = '<div class="tool-desc-content"><b>✨ Карта Аффирмации Утра</b> — установка дня и дыхательная настройка для стихии <b>' + userEl + '</b>.</div>';

            const mBox = document.createElement('div');
            mBox.id = 'mantra-card-box';
            mBox.style.cssText = 'background:linear-gradient(145deg,rgba(22,18,36,0.95),rgba(13,10,20,0.98));border:1px solid rgba(226,194,117,0.4);border-radius:18px;padding:20px;margin-top:14px;text-align:center;transition:0.3s;';

            const mTag = document.createElement('div');
            mTag.style.cssText = 'color:#a78bfa;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;margin-bottom:10px;';
            mTag.textContent = '✦ Стихия: ' + userEl + ' ✦';

            const mQuote = document.createElement('p');
            mQuote.style.cssText = 'color:#ffe066;font-family:Georgia,serif;font-style:italic;font-size:16px;line-height:1.55;margin:0 0 16px 0;';
            mQuote.textContent = '«' + mList.at(mantraIdx) + '»';

            const btnRow = document.createElement('div');
            btnRow.style.cssText = 'display:flex;gap:8px;margin-bottom:14px;';

            const acceptBtn = document.createElement('button');
            acceptBtn.type = 'button';
            acceptBtn.className = 'main-gold-btn';
            acceptBtn.style.cssText = 'flex:2;padding:10px 12px;border-radius:12px;font-size:13px;';
            acceptBtn.textContent = '✨ Принять установку';

            const nextBtn = document.createElement('button');
            nextBtn.type = 'button';
            nextBtn.style.cssText = 'flex:1;padding:10px;border-radius:12px;background:rgba(167,139,250,0.12);border:1px solid rgba(167,139,250,0.35);color:#c4b5fd;font-size:12px;font-weight:bold;cursor:pointer;';
            nextBtn.textContent = '🔄 Ещё';

            btnRow.append(acceptBtn, nextBtn);

            const breathBox = document.createElement('div');
            breathBox.style.cssText = 'background:rgba(13,10,20,0.7);border:1px dashed rgba(226,194,117,0.25);border-radius:14px;padding:12px;';

            const breathOrb = document.createElement('div');
            breathOrb.style.cssText = 'width:54px;height:54px;margin:0 auto 8px auto;border-radius:50%;background:radial-gradient(circle,rgba(226,194,117,0.45),rgba(108,92,231,0.15));border:1px solid #e2c275;display:flex;align-items:center;justify-content:center;color:#ffe066;font-size:12px;font-weight:bold;transition:transform 3.8s ease-in-out;';
            breathOrb.textContent = '4-4-4-4';

            const breathBtn = document.createElement('button');
            breathBtn.type = 'button';
            breathBtn.style.cssText = 'background:transparent;border:none;color:#94a3b8;font-size:12px;cursor:pointer;text-decoration:underline;';
            breathBtn.textContent = '🕯 Запустить 1-минутный ритм дыхания';

            breathBox.append(breathOrb, breathBtn);
            mBox.append(mTag, mQuote, btnRow, breathBox);
            mantraDiv.append(mDesc, mBox);
            dailySection.appendChild(mantraDiv);

            acceptBtn.onclick = () => {
                mBox.style.boxShadow = '0 0 25px rgba(226, 194, 117, 0.45)';
                mBox.style.borderColor = '#ffe066';
                acceptBtn.textContent = '✅ Установка активирована';
            };

            nextBtn.onclick = () => {
                mantraIdx = (mantraIdx + 1) % mList.length;
                mQuote.textContent = '«' + mList.at(mantraIdx) + '»';
                acceptBtn.textContent = '✨ Принять установку';
                mBox.style.boxShadow = 'none';
            };

            breathBtn.onclick = () => {
                if (breathTimer) {
                    clearInterval(breathTimer);
                    breathTimer = null;
                    breathOrb.style.transform = 'scale(1)';
                    breathOrb.textContent = '4-4-4-4';
                    breathBtn.textContent = '🕯 Запустить 1-минутный ритм дыхания';
                    return;
                }
                const phases = [
                    { label: 'Вдох', scale: 'scale(1.32)' },
                    { label: 'Пауза', scale: 'scale(1.32)' },
                    { label: 'Выдох', scale: 'scale(0.88)' },
                    { label: 'Покой', scale: 'scale(0.88)' }
                ];
                let step = 0;
                const runPhase = () => {
                    const p = phases.at(step % 4);
                    breathOrb.textContent = p.label;
                    breathOrb.style.transform = p.scale;
                    step += 1;
                };
                runPhase();
                breathBtn.textContent = '⏹ Остановить настройку';
                breathTimer = setInterval(runPhase, 4000);
            };

            dailySection.appendChild(mantraDiv);

            const EL_BOOSTERS = {
                'Огонь': { scent: 'Корица, кедр или апельсин', metal: 'Красное золото / медь', focus: 'Усиль природный напор благородным акцентом в деталях одежды.' },
                'Земля': { scent: 'Сандал, пачули или ветивер', metal: 'Жёлтое золото / бронза', focus: 'Сделай ставку на натуральные ткани и тактильный комфорт.' },
                'Воздух': { scent: 'Бергамот, мята или эвкалипт', metal: 'Белое золото / платина', focus: 'Лёгкие многослойные оттенки помогут уловить счастливые знаки.' },
                'Вода': { scent: 'Лаванда, жасмин или лотос', metal: 'Серебро / лунный сплав', focus: 'Мягкие переливы цвета усилят интуицию и защитят поле.' }
            };
            const elBoost = EL_BOOSTERS[userEl] || EL_BOOSTERS['Огонь'];

            const talDiv = document.createElement('div');
            talDiv.id = 'daily-talisman';
            talDiv.className = 'sub-tab-content hidden';

            const tDesc = document.createElement('div');
            tDesc.className = 'tool-description-card';
            tDesc.innerHTML = '<div class="tool-desc-content"><b>🎨 Цвет и Камень Дня</b> — персональный синтез планеты суток и твоей стихии (<b>' + userEl + '</b>).</div>';

            const tBox = document.createElement('div');
            tBox.style.cssText = 'background:rgba(22,18,36,0.88);border:1px solid rgba(167,139,250,0.35);border-radius:16px;padding:16px;margin-top:14px;';

            const tHead = document.createElement('div');
            tHead.style.cssText = 'color:#ffe066;font-weight:bold;font-size:15px;margin-bottom:10px;';
            tHead.textContent = '🪐 ' + tal.day + ' • Стихия ' + userEl;

            const makeRow = (emoji, label, val) => {
                const p = document.createElement('p');
                p.style.cssText = 'color:#e2e8f0;font-size:13px;margin:0 0 8px 0;line-height:1.45;';
                p.innerHTML = emoji + ' <b>' + label + ':</b> ' + val;
                return p;
            };

            const tTip = document.createElement('div');
            tTip.style.cssText = 'background:rgba(13,10,20,0.75);border-left:3px solid #e2c275;padding:10px 12px;border-radius:8px;color:#cbd5e1;font-size:12.5px;line-height:1.45;margin-top:10px;';
            tTip.textContent = tal.tip + ' ' + elBoost.focus;

            tBox.append(
                tHead,
                makeRow('👗', 'Цвета удачи', tal.color),
                makeRow('💎', 'Камень-проводник', tal.stone),
                makeRow('🌿', 'Аромат стихии', elBoost.scent),
                makeRow('⚜️', 'Металл силы', elBoost.metal),
                tTip
            );
            talDiv.append(tDesc, tBox);
            dailySection.appendChild(talDiv);


            
        }

    }
    function enhanceMyDayScreen() {
        const core = document.getElementById('my-day-core');
        if (!core || core.children.length === 0) return;

        const prof = JSON.parse(localStorage.getItem('astro_user_profile') || 'null');
        if (!prof || !prof.date) return;

                // Скрываем длинный текстовый гороскоп в «Мой День» (оставляем только приветствие, биоритмы, лунный день и советы)
                // Скрываем длинный текстовый гороскоп в «Мой День» независимо от регистра букв
        Array.from(core.querySelectorAll('div')).forEach(el => {
            if (el.id === 'myday-totem-duo' || el.id === 'myday-mini-indicators') return;
            const low = (el.textContent || '').toLowerCase();
            if (
                (low.includes('сакральный манифест') || low.includes('астральные акценты') || low.includes('глобальный тренд месяца')) &&
                !low.includes('день благоприятен') &&
                !low.includes('кривые биологической')
            ) {
                el.style.setProperty('display', 'none', 'important');
            }
        });


        const wSign = getWesternSign(prof.date);
        const eSign = getEasternSign(prof.date);

        let duoCard = document.getElementById('myday-totem-duo');
        if (!duoCard) {
            duoCard = document.createElement('div');
            duoCard.id = 'myday-totem-duo';
            duoCard.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin: 10px 0 12px 0;';
        }

        // Ставим дуэт иконок сразу ПОСЛЕ карточки приветствия
        const welcomeCard = Array.from(core.children).find(c => c.textContent.includes('Приветствую'));
        if (welcomeCard && welcomeCard.nextSibling !== duoCard) {
            welcomeCard.parentNode.insertBefore(duoCard, welcomeCard.nextSibling);
        } else if (!welcomeCard && core.firstChild !== duoCard) {
            core.insertBefore(duoCard, core.firstChild);
        }

        duoCard.innerHTML = [
            '<div id="myday-open-western" style="background: linear-gradient(145deg, rgba(22,18,36,0.92), rgba(13,10,20,0.96)); border: 1px solid rgba(226,194,117,0.35); border-radius: 16px; padding: 12px; display: flex; flex-direction: column; align-items: center; text-align: center; cursor: pointer;">',
            '<img src="/static/images/zodiac/' + wSign.key + '.webp" alt="' + wSign.ru + '" style="width: 58px; height: 58px; object-fit: contain; margin-bottom: 6px;">',
            '<div style="color: #ffe066; font-weight: bold; font-size: 14px;">' + wSign.ru + '</div>',
            '<div style="color: #94a3b8; font-size: 11px;">Стихия: ' + wSign.el + ' • Прогноз ➔</div></div>',
            '<div id="myday-open-eastern" style="background: linear-gradient(145deg, rgba(22,18,36,0.92), rgba(13,10,20,0.96)); border: 1px solid rgba(167,139,250,0.35); border-radius: 16px; padding: 12px; display: flex; flex-direction: column; align-items: center; text-align: center; cursor: pointer;">',
            '<img src="/static/images/zodiac/' + eSign.key + '.webp" alt="' + eSign.ru + '" style="width: 58px; height: 58px; object-fit: contain; margin-bottom: 6px;">',
            '<div style="color: #a78bfa; font-weight: bold; font-size: 14px;">Год: ' + eSign.ru + '</div>',
            '<div style="color: #94a3b8; font-size: 11px;">Ба Цзы на сутки ➔</div></div>'
        ].join('');

        document.getElementById('myday-open-western').onclick = () => {
            const dailyNav = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.dataset.screen === 'screen-daily');
            if (dailyNav) dailyNav.click();
            setTimeout(() => document.querySelector('#screen-daily .sub-tab-btn[data-subtab="daily-horoscope"]')?.click(), 80);
        };

        document.getElementById('myday-open-eastern').onclick = () => {
            const dailyNav = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.dataset.screen === 'screen-daily');
            if (dailyNav) dailyNav.click();
            setTimeout(() => document.querySelector('#screen-daily .sub-tab-btn[data-subtab="eastern-grid"]')?.click(), 80);
        };

        const now = new Date();
        const beautyToday = calcBeautyForDate(now);
        const mercToday = calcRetroPlanets(now).at(0);

        let miniBar = document.getElementById('myday-mini-indicators');
        if (!miniBar) {
            miniBar = document.createElement('div');
            miniBar.id = 'myday-mini-indicators';
            miniBar.style.cssText = 'display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 10px;';
            core.appendChild(miniBar);
        }

        miniBar.innerHTML = [
            '<div id="myday-go-beauty" style="background: rgba(22, 18, 36, 0.85); border: 1px solid ' + beautyToday.color + '55; border-radius: 12px; padding: 10px; cursor: pointer;">',
            '<div style="color: #94a3b8; font-size: 10.5px;">💇‍♀️ Стрижка сегодня</div>',
            '<div style="color: ' + beautyToday.color + '; font-weight: bold; font-size: 12.5px; margin-top: 2px;">' + beautyToday.status + ' ➔</div></div>',
            '<div id="myday-go-retro" style="background: rgba(22, 18, 36, 0.85); border: 1px solid ' + (mercToday.retro ? '#f59e0b' : '#10b981') + '55; border-radius: 12px; padding: 10px; cursor: pointer;">',
            '<div style="color: #94a3b8; font-size: 10.5px;">☿ Статус Меркурия</div>',
            '<div style="color: ' + (mercToday.retro ? '#f59e0b' : '#10b981') + '; font-weight: bold; font-size: 12.5px; margin-top: 2px;">' + (mercToday.retro ? 'Ретроградный' : 'Директный') + ' ➔</div></div>'
        ].join('');

        document.getElementById('myday-go-beauty').onclick = () => {
            const dailyNav = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.dataset.screen === 'screen-daily');
            if (dailyNav) dailyNav.click();
            setTimeout(() => document.querySelector('#screen-daily .sub-tab-btn[data-subtab="beauty-guide"]')?.click(), 80);
        };

        document.getElementById('myday-go-retro').onclick = () => {
            const dailyNav = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.dataset.screen === 'screen-daily');
            if (dailyNav) dailyNav.click();
            setTimeout(() => document.querySelector('#screen-daily .sub-tab-btn[data-subtab="retro-planets"]')?.click(), 80);
        };
            // Рекламный блок в самом низу ленты (скрывается автоматически, если активна подписка NoAds)
        let adSlot = document.getElementById('myday-bottom-ad-slot');
        if (window.USER_AD_FREE) {
            if (adSlot) adSlot.remove();
        } else if (!adSlot) {
            adSlot = document.createElement('div');
            adSlot.id = 'myday-bottom-ad-slot';
            adSlot.style.cssText = 'margin-top: 14px; padding: 12px; background: rgba(15, 11, 28, 0.65); border: 1px dashed rgba(226, 194, 117, 0.25); border-radius: 14px; text-align: center; min-height: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; cursor: pointer;';
            adSlot.innerHTML = [
                '<div style="color: #64748b; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Партнёрский эфир • Отключить в Профиле 🛡️</div>',
                '<div id="tg-ad-container-bottom" style="color: #cbd5e1; font-size: 12px; margin-top: 4px;">✨ Место для рекламного блока (AdsGram / Monetag)</div>'
            ].join('');
            adSlot.onclick = () => {
                const profBtn = Array.from(document.querySelectorAll('.nav-btn')).find(b => b.textContent.includes('Профиль'));
                if (profBtn) profBtn.click();
            };
            core.appendChild(adSlot);
        }
    
    }

    let isEnhancing = false;
    const coreEl = document.getElementById('my-day-core');
    if (coreEl) {
        const obs = new MutationObserver(() => {
            if (isEnhancing) return;
            isEnhancing = true;
            try {
                enhanceMyDayScreen();
            } finally {
                setTimeout(() => { isEnhancing = false; }, 300);
            }
        });
        obs.observe(coreEl, { childList: true });
        setTimeout(() => {
            isEnhancing = true;
            try { enhanceMyDayScreen(); } finally { isEnhancing = false; }
        }, 600);
    }

});
