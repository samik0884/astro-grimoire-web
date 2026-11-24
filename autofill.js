document.addEventListener('DOMContentLoaded', () => {
    function getZodiacSign(dateStr) {
        if (!dateStr || !dateStr.includes('-')) return 'aries';
        const [, m, d] = dateStr.split('-').map(Number);
        if ((m === 3 && d >= 21) || (m === 4 && d <= 19)) return 'aries';
        if ((m === 4 && d >= 20) || (m === 5 && d <= 20)) return 'taurus';
        if ((m === 5 && d >= 21) || (m === 6 && d <= 20)) return 'gemini';
        if ((m === 6 && d >= 21) || (m === 7 && d <= 22)) return 'cancer';
        if ((m === 7 && d >= 23) || (m === 8 && d <= 22)) return 'leo';
        if ((m === 8 && d >= 23) || (m === 9 && d <= 22)) return 'virgo';
        if ((m === 9 && d >= 23) || (m === 10 && d <= 22)) return 'libra';
        if ((m === 10 && d >= 23) || (m === 11 && d <= 21)) return 'scorpio';
        if ((m === 11 && d >= 22) || (m === 12 && d <= 21)) return 'sagittarius';
        if ((m === 12 && d >= 22) || (m === 1 && d <= 19)) return 'capricorn';
        if ((m === 1 && d >= 20) || (m === 2 && d <= 18)) return 'aquarius';
        return 'pisces';
    }

    function getSavedPeople() {
        let me = null;
        try {
            const pNew = JSON.parse(localStorage.getItem('astro_user_profile') || 'null');
            const pOld = JSON.parse(localStorage.getItem('grimoire_user_profile') || 'null');
            me = (pNew && pNew.date) ? pNew : ((pOld && pOld.date) ? pOld : null);
        } catch (e) {}

        let family = [];
        try {
            const rawCircle = JSON.parse(localStorage.getItem('g_circle') || '[]');
            const citiesMap = JSON.parse(localStorage.getItem('family_cities_map') || '{}');
            if (Array.isArray(rawCircle)) {
                family = rawCircle.map(p => ({
                    name: p.name || 'Близкий',
                    gender: p.gender || 'woman',
                    date: p.date || p.birth_date || '',
                    time: p.time || p.birth_time || '12:00',
                    city: (p.city && p.city !== 'Не указан') ? p.city : (citiesMap[p.name] || ''),
                    lat: p.lat || 55.7558,
                    lon: p.lon || 37.6173
                }));
            }
        } catch (e) {}

        return { me, family };
    }
        const TOOL_TARGETS = [
        { id: 'natal', container: '#natal-form', after: '#natal-form .tool-description-card', fields: { date: 'natal-date', time: 'natal-time', gender: 'natal-gender', city: 'natal-city', lat: 'natal-lat', lon: 'natal-lon' } },
        { id: 'transit', container: '#transit-main-block', after: '#transit-main-block .tool-description-card', fields: { date: 'transit-birth-date', time: 'transit-birth-time', gender: 'transit-embedded-gender', city: 'transit-city', lat: 'transit-lat', lon: 'transit-lon' } },
        { id: 'syna-a', container: '#synastry-form', before: 'syna-a-date', label: 'Подставить для Партнёра А:', fields: { date: 'syna-a-date', time: 'syna-a-time', city: 'syna-a-city', lat: 'syna-a-lat', lon: 'syna-a-lon' } },
        { id: 'syna-b', container: '#synastry-form', before: 'syna-b-date', label: 'Подставить для Партнёра Б:', fields: { date: 'syna-b-date', time: 'syna-b-time', city: 'syna-b-city', lat: 'syna-b-lat', lon: 'syna-b-lon' } },
        { id: 'bazi', container: '#bazi-main-form-wrapper', after: '#bazi-main-form-wrapper .tool-description-card', fields: { date: 'bazi-date', time: 'bazi-time', gender: 'bazi-gender', city: 'bazi-city-input', lat: 'bazi-lat', lon: 'bazi-lon' } },
        { id: 'solar', container: '#solar-form', after: '#solar-form .tool-description-card', fields: { date: 'solar-date', time: 'solar-time', gender: 'solar-gender', city: 'solar-city', lat: 'solar-lat', lon: 'solar-lon' } },

        { id: 'matrix', container: '#matrix-main-form-wrapper', after: '#matrix-main-form-wrapper .tool-description-card', fields: { date: 'matrix-date', gender: 'matrix-gender' } },
        { id: 'finance', container: '#finance-tool', after: '#finance-tool .tool-description-card', fields: { date: 'fin-birth-date', time: 'fin-birth-time', gender: 'fin-gender', city: 'fin-city', lat: 'fin-lat', lon: 'fin-lon' } },
        { id: 'karma', container: '#karma-tool', after: '#karma-tool .tool-description-card', fields: { date: 'karma-birth-date', time: 'karma-birth-time', gender: 'karma-gender', city: 'karma-city', lat: 'karma-lat', lon: 'karma-lon' } },
        { id: 'kids', container: '#kids-tool', after: '#kids-tool .tool-description-card', fields: { date: 'kids-birth-date', time: 'kids-birth-time', gender: 'kids-gender', city: 'kids-city', lat: 'kids-lat', lon: 'kids-lon' } },
        { id: 'bio', container: '#bio-main-form-wrapper', after: '#bio-main-form-wrapper .tool-description-card', fields: { date: 'bio-birthdate', gender: 'bio-gender' } },
        { id: 'advice', container: '#advice-main-form-wrapper', after: '#advice-main-form-wrapper .advice-mode-tabs', fields: { date: 'adv-birthdate', time: 'adv-birthtime', gender: 'adv-gender', zodiac: 'adv-zodiac', city: 'adv-city', lat: 'adv-lat', lon: 'adv-lon' } },
        { id: 'stones', container: '#stones', after: '#stones .stone-levels-nav', fields: { date: 'stone-birth-date', time: 'stone-birth-time', gender: 'stone-gender', city: 'stone-city-input', lat: 'stone-lat', lon: 'stone-lon' } },
        { id: 'moon', container: '#moon', after: '#moon .tool-description-card', fields: { gender: 'moon-forecast-gender', city: 'moon-city-input', lat: 'moon-lat', lon: 'moon-lon' } },
        { id: 'astro-hours', container: '#daily-hours', after: '#daily-hours .tool-description-card', fields: { city: 'astro-hours-city', lat: 'astro-hours-lat', lon: 'astro-hours-lon' } },

        { id: 'eastern', container: '#eastern-transformer-box', after: '#eastern-transformer-title', fields: { year: 'eastern-birth-year', gender: 'eastern-gender-select' } }
    ];


    function fillFormFields(fields, person) {
        if (!person) {
            if (fields.date && document.getElementById(fields.date)) document.getElementById(fields.date).value = '';
            if (fields.time && document.getElementById(fields.time)) document.getElementById(fields.time).value = '12:00';
            if (fields.city && document.getElementById(fields.city)) document.getElementById(fields.city).value = '';
            if (fields.year && document.getElementById(fields.year)) document.getElementById(fields.year).value = '';
            return;
        }
        const sign = getZodiacSign(person.date);
        const year = person.date ? person.date.split('-')[0] : '';

        if (fields.date && document.getElementById(fields.date)) document.getElementById(fields.date).value = person.date || '';
        if (fields.time && document.getElementById(fields.time)) document.getElementById(fields.time).value = person.time || '12:00';
        if (fields.gender && document.getElementById(fields.gender)) document.getElementById(fields.gender).value = person.gender || 'woman';
        if (fields.city && document.getElementById(fields.city)) document.getElementById(fields.city).value = person.city || '';
        if (fields.lat && document.getElementById(fields.lat)) document.getElementById(fields.lat).value = person.lat || 55.7558;
        if (fields.lon && document.getElementById(fields.lon)) document.getElementById(fields.lon).value = person.lon || 37.6173;
        if (fields.zodiac && document.getElementById(fields.zodiac)) document.getElementById(fields.zodiac).value = sign;
        if (fields.year && document.getElementById(fields.year) && year) document.getElementById(fields.year).value = year;
    }

 const syncDynamicToolSelectors = () => {
     const advWrap = document.getElementById('grimoire-person-select-advice-wrap');
     const activeAdvBtn = document.querySelector('.advice-mode-tabs .advice-scr-btn.active');
     if (advWrap && activeAdvBtn) {
         const mode = activeAdvBtn.getAttribute('data-adv-mode');
         advWrap.style.display = (mode === 'numeric' || mode === 'sun') ? 'block' : 'none';
     }

     const stoneWrap = document.getElementById('grimoire-person-select-stones-wrap');
     if (stoneWrap) {
         const isLevel3 = Boolean(document.getElementById('stone-birth-date'));
         stoneWrap.style.display = isLevel3 ? 'block' : 'none';
     }
 };

 const advTabsContainer = document.querySelector('.advice-mode-tabs');
 if (advTabsContainer) {
     new MutationObserver(syncDynamicToolSelectors).observe(advTabsContainer, {
         attributes: true,
         attributeFilter: ['class'],
         subtree: true
     });
 }

 const stoneDynBox = document.getElementById('stone-dynamic-field');
 if (stoneDynBox) {
     new MutationObserver(syncDynamicToolSelectors).observe(stoneDynBox, {
         childList: true
     });
 }

    window.refreshGrimoireSelectors = function() {
        const { me, family } = getSavedPeople();

        TOOL_TARGETS.forEach(cfg => {
            if (!document.querySelector(cfg.container)) return;
            const selectId = `grimoire-person-select-${cfg.id}`;
            let wrapper = document.getElementById(`${selectId}-wrap`);

            if (!wrapper) {
                wrapper = document.createElement('div');
                wrapper.id = `${selectId}-wrap`;
                wrapper.style.cssText = 'margin: 10px 0 12px 0; background: rgba(226, 194, 117, 0.06); border: 1px solid rgba(226, 194, 117, 0.28); border-radius: 12px; padding: 8px 12px;';
                wrapper.innerHTML = `
                    <label for="${selectId}" style="color: #e2c275; font-size: 11.5px; display: block; margin-bottom: 4px; font-weight: bold;">✨ ${cfg.label || 'Выбрать из сохранённых:'}</label>
                    <select id="${selectId}" style="width: 100%; height: 38px; padding: 0 10px; background: #0d0a14; color: #f3e8ff; border: 1px solid rgba(226, 194, 117, 0.35); border-radius: 10px; font-size: 13px; outline: none; cursor: pointer;"></select>
                `;

                if (cfg.after) {
                    const anchor = document.querySelector(cfg.after);
                    if (anchor?.parentNode) anchor.parentNode.insertBefore(wrapper, anchor.nextSibling);
                } else if (cfg.before) {
                    const rowBlock = document.getElementById(cfg.before)?.closest('div[style*="display: flex"]');
                    if (rowBlock?.parentNode) rowBlock.parentNode.insertBefore(wrapper, rowBlock);
                }

                const sel = wrapper.querySelector('select');
                sel.addEventListener('change', () => {
                    const current = getSavedPeople();
                    if (sel.value === 'manual') fillFormFields(cfg.fields, null);
                    else if (sel.value === 'me') fillFormFields(cfg.fields, current.me);
                    else if (sel.value.startsWith('fam_')) fillFormFields(cfg.fields, current.family[parseInt(sel.value.slice(4), 10)]);
                    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred('light');
                });
            }

            const sel = wrapper.querySelector('select');
            const prevVal = sel.value;
            let html = `<option value="manual">✍️ Ввести данные вручную</option>`;
            if (me?.date) html += `<option value="me">👤 Мой профиль (${me.name || 'Я'})</option>`;
            family.forEach((p, idx) => { if (p.date) html += `<option value="fam_${idx}">💞 ${p.name}</option>`; });
            sel.innerHTML = html;
            sel.value = (prevVal && sel.querySelector(`option[value="${prevVal}"]`)) ? prevVal : 'manual';
        });
           syncDynamicToolSelectors();


    };

        window.autoStartMyDay = async function() {
        const { me } = getSavedPeople();
        const core = document.getElementById('my-day-core');
        if (!core) return;

        // Если профиль пустой — показываем красивую карточку с кнопкой перехода
        if (!me?.date) {
            if (typeof window.syncUserWallet === 'function') {
                await window.syncUserWallet();
                if (getSavedPeople().me?.date) {
                    window.refreshGrimoireSelectors();
                    return window.autoStartMyDay();
                }
            }
            core.innerHTML = `
                <div style="background: linear-gradient(145deg, rgba(22, 18, 36, 0.95), rgba(13, 10, 20, 0.98)); border: 1px solid rgba(226, 194, 117, 0.35); border-radius: 16px; padding: 22px 16px; text-align: center; margin-top: 10px;">
                    <div style="font-size: 32px; margin-bottom: 8px;">🔮</div>
                    <h4 style="color: #ffe066; font-family: 'Philosopher', serif; font-size: 16px; margin: 0 0 8px 0;">Персональный компас не настроен</h4>
                    <p style="color: #cbd5e1; font-size: 13px; line-height: 1.5; margin: 0 0 16px 0;">Укажи дату, время и город своего рождения, чтобы Гримуар рассчитал твои биоритмы и прогноз на сегодня.</p>
                    <button type="button" id="my-day-go-profile-btn" class="main-gold-btn" style="width: 100%; padding: 12px; border-radius: 12px; font-size: 13.5px;">✨ Заполнить личные данные →</button>
                </div>`;
            document.getElementById('my-day-go-profile-btn')?.addEventListener('click', () => {
                const profNav = Array.from(document.querySelectorAll('.nav-btn, [data-screen]')).find(b => b.textContent.includes('Профиль'));
                if (profNav) profNav.click();
                setTimeout(() => document.querySelector('[data-prof-tab="prof-personal"]')?.click(), 80);
            });
            return;
        }

        const sign = getZodiacSign(me.date);
        const now = new Date();
        const tzOffset = -now.getTimezoneOffset() / 60;
        const localDateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const clientTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        core.innerHTML = `<div style="text-align:center; color:#e2c275; padding:30px; font-style:italic;">Считываю твои натальные нити... ✨</div>`;

        try {
            const [res, bioRes] = await Promise.all([
                fetch('/api/v1/horoscope', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sign, period: 'daily', gender: me.gender || 'woman',
                        date: localDateStr, client_time: clientTime,
                        tz_offset: tzOffset,
                        lat: parseFloat(me.lat || 55.7558), lon: parseFloat(me.lon || 37.6173)
                    })
                }),
                fetch('/api/v1/astrology/biorhythms', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        birthdate: me.date,
                        gender: me.gender || 'woman',
                        target_date: localDateStr,
                        tz_offset: tzOffset
                    })
                })
            ]);

            const data = await res.json();
            const bio = await bioRes.json();




                        let bioWidgetHtml = '';
            if (bio?.status === 'success') {
                const bar = (icon, title, val, color) => `
                    <div style="margin-bottom: 8px;">
                        <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:3px;">
                            <span style="color:#e2e8f0;">${icon} ${title}</span>
                            <span style="color:${color}; font-weight:bold;">${val}%</span>
                        </div>
                        <div style="width:100%; height:6px; background:rgba(255,255,255,0.08); border-radius:4px; overflow:hidden;">
                            <div style="width:${val}%; height:100%; background:${color}; border-radius:4px;"></div>
                        </div>
                    </div>`;
                bioWidgetHtml = `
                    <div style="background: rgba(15, 11, 28, 0.75); border: 1px solid rgba(226, 194, 117, 0.25); border-radius: 14px; padding: 12px 14px; margin-bottom: 14px;">
                        <div style="color:#ffe066; font-size:13px; font-weight:bold; text-align:center; margin-bottom:10px;">📊 Кривые Биологической Активности</div>
                        ${bar('🏃', 'Физическая энергия', bio.physical, '#ef4444')}
                        ${bar('💙', 'Эмоциональный баланс', bio.emotional, '#3b82f6')}
                        ${bar('🧠', 'Интеллектуальный тонус', bio.intellectual, '#10b981')}
                        <button type="button" id="my-day-open-bio-btn" style="width:100%; margin-top:6px; padding:6px 10px; background:rgba(226,194,117,0.1); border:1px solid rgba(226,194,117,0.35); border-radius:8px; color:#e2c275; font-size:11.5px; cursor:pointer;">Посмотреть подробнее →</button>
                    </div>`;
            }

            if (data?.status === 'success') {
                const cleanForecast = data.data.forecast.replace(/<div style='display: grid; grid-template-columns: 1fr 1fr;[\s\S]*?<\/div>\s*<\/div>/i, '');
                const signNamesRu = { aries: 'Овен', taurus: 'Телец', gemini: 'Близнецы', cancer: 'Рак', leo: 'Лев', virgo: 'Дева', libra: 'Весы', scorpio: 'Скорпион', sagittarius: 'Стрелец', capricorn: 'Козерог', aquarius: 'Водолей', pisces: 'Рыбы' };
                const animalsEn = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
                const animalsRu = ['Крыса', 'Бык', 'Тигр', 'Кролик', 'Дракон', 'Змея', 'Лошадь', 'Коза', 'Обезьяна', 'Петух', 'Собака', 'Свинья'];

                const birthYear = parseInt(me.date.split('-').shift(), 10) || 1990;
                const animalIdx = ((birthYear - 4) % 12 + 12) % 12;
                const animalSlug = animalsEn.slice(animalIdx, animalIdx + 1).pop();
                const animalRu = animalsRu.slice(animalIdx, animalIdx + 1).pop();
                const signRu = signNamesRu[sign] || 'Зодиак';

                core.innerHTML = `
                    <div style="background: rgba(226, 194, 117, 0.04); border: 1px dashed rgba(226, 194, 117, 0.3); border-radius: 14px; padding: 12px 14px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
                        <img src="/static/images/zodiac/${sign}.webp" alt="${signRu}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid #e2c275; flex-shrink: 0;">
                        <div style="text-align: center; flex: 1;">
                            <div style="color: #e2c275; font-size: 15px; font-weight: bold;">Приветствую, ${me.name || 'Путник'}! 🔮</div>
                            <div style="color: #ffe066; font-size: 12px; margin-top: 2px;">${signRu} • ${animalRu} (${birthYear})</div>
                            <div style="color: #64748b; font-size: 11px; margin-top: 1px;">📍 ${me.city || 'Координаты неба'}</div>
                        </div>
                        <img src="/static/images/zodiac/${animalSlug}.webp" alt="${animalRu}" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 1px solid #a78bfa; flex-shrink: 0;">
                    </div>
                    ${bioWidgetHtml}
                    <div class="scroll-inner-text" style="font-family: 'Philosopher', serif !important;">${cleanForecast}</div>`;

                document.getElementById('my-day-open-bio-btn')?.addEventListener('click', () => {
                    document.querySelector('[data-screen="screen-daily"]')?.click();
                    setTimeout(() => {
                        document.querySelector('[data-subtab="biorhythms"], [data-tile="biorhythms"]')?.click();
                        if (document.getElementById('bio-birthdate')) document.getElementById('bio-birthdate').value = me.date;
                        if (document.getElementById('bio-gender')) document.getElementById('bio-gender').value = me.gender || 'woman';
                        document.querySelector('#bio-main-form-wrapper button.main-gold-btn')?.click();
                    }, 120);
                });
            }
        } catch (e) {}
    };


    setTimeout(() => { window.refreshGrimoireSelectors(); window.autoStartMyDay(); }, 600);

    document.addEventListener('click', (e) => {
        if (e.target.closest('.bottom-nav .nav-btn, [data-subtab], button')) setTimeout(() => window.refreshGrimoireSelectors(), 100);
        if (e.target.closest('.advice-scr-btn, .stone-lvl-btn')) setTimeout(() => window.refreshGrimoireSelectors(), 300);

        if (e.target.closest('[data-screen="screen-my-day"]')) window.autoStartMyDay();
        const txt = e.target.textContent || '';
        if (txt.includes('Запечатать') || txt.includes('Обновить') || txt.includes('Добавить в Круг')) {
            setTimeout(() => { window.refreshGrimoireSelectors(); window.autoStartMyDay(); }, 900);
        }
    });
        // Делаем поля широты и долготы видимыми для солидности в натальных PDF-инструментах
    const showCoordsPairs = [
        { latId: 'fin-lat', lonId: 'fin-lon' },
        { latId: 'karma-lat', lonId: 'karma-lon' },
        { latId: 'kids-lat', lonId: 'kids-lon' }
    ];

    showCoordsPairs.forEach(({ latId, lonId }) => {
        const latEl = document.getElementById(latId);
        const lonEl = document.getElementById(lonId);
        if (!latEl || !lonEl || latEl.type !== 'hidden') return;

        latEl.type = 'text';
        lonEl.type = 'text';
        latEl.readOnly = true;
        lonEl.readOnly = true;

        const inpStyle = 'width: 100%; height: 40px; padding: 0 12px; background: #0d0a14; color: #cbd5e1; border: 1px solid rgba(226, 194, 117, 0.25); border-radius: 12px; font-size: 13px; box-sizing: border-box;';
        latEl.style.cssText = inpStyle;
        lonEl.style.cssText = inpStyle;

        const row = document.createElement('div');
        row.style.cssText = 'display: flex; gap: 10px; margin-top: 10px;';
        row.innerHTML = `
            <div style="flex: 1;"><label style="color: #94a3b8; font-size: 12px; display: block; margin-bottom: 4px;">Широта:</label></div>
            <div style="flex: 1;"><label style="color: #94a3b8; font-size: 12px; display: block; margin-bottom: 4px;">Долгота:</label></div>
        `;

        latEl.parentNode.insertBefore(row, latEl);
        row.children.item(0).appendChild(latEl);
        row.children.item(1).appendChild(lonEl);
    });
  
});
