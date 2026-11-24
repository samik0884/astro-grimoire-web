document.addEventListener('DOMContentLoaded', () => {
    const configs = [
        {
            type: 'finance',
            btnId: 'finance-pdf-btn',
            calcLabel: '💼 Рассчитать Финансовый Код',
            dateId: 'fin-birth-date',
            timeId: 'fin-birth-time',
            genderId: 'fin-gender',
            cityId: 'fin-city',
            latId: 'fin-lat',
            lonId: 'fin-lon',
            accent: '#10b981',
            ch1Title: 'Алхимия Денежного Потока',
            ch1Desc: 'Природа личного капитала и бизнес-вектор (Солнце и Луна)',
            ch2Title: 'Кармический Аудит Сатурна',
            ch2Desc: 'Финансовые экзамены, масштаб и точки слива энергии',
            pdfLabel: '💼 Скачать Полный Финансовый Код (PDF)'
        },
        {
            type: 'karma',
            btnId: 'karma-pdf-btn',
            calcLabel: '🌀 Рассчитать Кармический Паспорт',
            dateId: 'karma-birth-date',
            timeId: 'karma-birth-time',
            genderId: 'karma-gender',
            cityId: 'karma-city',
            latId: 'karma-lat',
            lonId: 'karma-lon',
            accent: '#a78bfa',
            ch1Title: 'Ось Лунных Узлов (Раху и Кету)',
            ch1Desc: 'Багаж прошлых воплощений и главный вектор эволюции души',
            ch2Title: 'Зеркало Черной Луны (Лилит)',
            ch2Desc: 'Архетип Тени, кармические искушения и ключи исцеления',
            pdfLabel: '🌀 Скачать Кармический Паспорт (PDF)'
        },
        {
            type: 'kids',
            btnId: 'kids-pdf-btn',
            calcLabel: '🧸 Рассчитать Звездную Карту Ребенка',
            dateId: 'kids-birth-date',
            timeId: 'kids-birth-time',
            genderId: 'kids-gender',
            cityId: 'kids-city',
            latId: 'kids-lat',
            lonId: 'kids-lon',
            accent: '#38bdf8',
            ch1Title: 'Главный Код Души и Темперамента',
            ch1Desc: 'Сочетание воли, эмоций и врожденного таланта ребенка',
            ch2Title: 'Ключи Воспитания и Скрытые Дары',
            ch2Desc: 'Ошибки родителей, обучение, спорт и раскрытие потенциала',
            pdfLabel: '🧸 Скачать Детский Путеводитель (PDF)'
        }
    ];
        window.showSacredNodeInfo = function(text) {
        if (window.Telegram?.WebApp?.showAlert) {
            window.Telegram.WebApp.showAlert(text);
        } else {
            alert(text);
        }
    };

    function buildSvg(type, signs) {
        if (type === 'finance') {
            return `
            <svg viewBox="0 0 320 260" style="width:100%; max-width:320px; margin:0 auto; display:block;">
                <circle cx="160" cy="135" r="105" fill="none" stroke="rgba(16,185,129,0.2)" stroke-width="1.5" stroke-dasharray="4 4"/>
                <polygon points="160,38 65,205 255,205" fill="rgba(16,185,129,0.06)" stroke="#e2c275" stroke-width="1.8"/>
                
                <g style="cursor:pointer;" onclick="window.showSacredNodeInfo('💰 Ядро Капитала: Точка синтеза ваших талантов, эмоциональной опоры и финансовой дисциплины.')">
                    <circle cx="160" cy="142" r="24" fill="#0d0a14" stroke="#10b981" stroke-width="2"/>
                    <text x="160" y="147" fill="#e2c275" font-size="14" font-weight="bold" text-anchor="middle">💰</text>
                </g>

                <g style="cursor:pointer;" onclick="window.showSacredNodeInfo('☉ Солнце (${signs.sun}): Источник вашей личной энергии, амбиций, масштаба и главного таланта, за который мир готов платить.')">
                    <circle cx="160" cy="38" r="18" fill="#161224" stroke="#e2c275" stroke-width="1.5"/>
                    <text x="160" y="43" fill="#ffe066" font-size="12" text-anchor="middle">☉</text>
                    <text x="160" y="14" fill="#e2c275" font-size="11" font-weight="bold" text-anchor="middle">Солнце: ${signs.sun}</text>
                </g>

                <g style="cursor:pointer;" onclick="window.showSacredNodeInfo('☽ Луна (${signs.moon}): Ваша внутренняя опора, интуиция в делах, эмоциональный комфорт и умение удерживать ресурс.')">
                    <circle cx="65" cy="205" r="18" fill="#161224" stroke="#10b981" stroke-width="1.5"/>
                    <text x="65" y="210" fill="#10b981" font-size="12" text-anchor="middle">☽</text>
                    <text x="65" y="238" fill="#cbd5e1" font-size="11" text-anchor="middle">Луна: ${signs.moon}</text>
                </g>

                <g style="cursor:pointer;" onclick="window.showSacredNodeInfo('♄ Сатурн (${signs.saturn}): Кармический контролёр капитала. Показывает ваши главные финансовые экзамены, страхи и правила роста.')">
                    <circle cx="255" cy="205" r="18" fill="#161224" stroke="#10b981" stroke-width="1.5"/>
                    <text x="255" y="210" fill="#10b981" font-size="12" text-anchor="middle">♄</text>
                    <text x="255" y="238" fill="#cbd5e1" font-size="11" text-anchor="middle">Сатурн: ${signs.saturn}</text>
                </g>
            </svg>`;
        }
        if (type === 'karma') {
            return `
            <svg viewBox="0 0 320 260" style="width:100%; max-width:320px; margin:0 auto; display:block;">
                <circle cx="160" cy="130" r="95" fill="rgba(167,139,250,0.04)" stroke="#a78bfa" stroke-width="1.5"/>
                <circle cx="160" cy="130" r="62" fill="none" stroke="rgba(226,194,117,0.25)" stroke-width="1" stroke-dasharray="5 5"/>
                <line x1="75" y1="175" x2="245" y2="85" stroke="#e2c275" stroke-width="2"/>

                <g style="cursor:pointer;" onclick="window.showSacredNodeInfo('☊ Северный Узел Раху — ${signs.rahu}: Главный вектор эволюции вашей души в этой жизни. Сфера, где вас ждёт рост, удача и новый опыт.')">
                    <circle cx="245" cy="85" r="18" fill="#161224" stroke="#e2c275" stroke-width="2"/>
                    <text x="245" y="90" fill="#e2c275" font-size="13" text-anchor="middle">☊</text>
                    <text x="245" y="60" fill="#e2c275" font-size="10.5" font-weight="bold" text-anchor="middle">Раху: ${signs.rahu}</text>
                </g>

                <g style="cursor:pointer;" onclick="window.showSacredNodeInfo('☋ Южный Узел Кету: Багаж прошлых воплощений, врождённые таланты и привычная зона комфорта, на которую можно опираться, но нельзя в ней застревать.')">
                    <circle cx="75" cy="175" r="18" fill="#161224" stroke="#a78bfa" stroke-width="1.5"/>
                    <text x="75" y="180" fill="#a78bfa" font-size="13" text-anchor="middle">☋</text>
                    <text x="54" y="212" fill="#94a3b8" font-size="10" text-anchor="middle">Вектор Кету (Прошлое)</text>
                </g>


                <g style="cursor:pointer;" onclick="window.showSacredNodeInfo('⚸ Чёрная Луна (Лилит) — ${signs.lilith}: Точка кармических искушений, слепое пятно психики и глубинных страхов, требующих осознания.')">
                    <circle cx="160" cy="215" r="16" fill="#161224" stroke="#ef4444" stroke-width="1.5"/>
                    <text x="160" y="220" fill="#ef4444" font-size="12" text-anchor="middle">⚸</text>
                    <text x="160" y="246" fill="#fca5a5" font-size="10.5" text-anchor="middle">Лилит: ${signs.lilith}</text>
                </g>
            </svg>`;
        }
        return `
        <svg viewBox="0 0 320 265" style="width:100%; max-width:320px; margin:0 auto; display:block;">
            <circle cx="160" cy="132" r="96" fill="rgba(56,189,248,0.04)" stroke="rgba(56,189,248,0.3)" stroke-width="1.5"/>
            <polygon points="160,36 251,102 216,209 104,209 69,102" fill="rgba(226,194,117,0.05)" stroke="#e2c275" stroke-width="1.5"/>
            
            <g style="cursor:pointer;" onclick="window.showSacredNodeInfo('✨ Звёздный Кристалл Ребёнка: Синтез пяти главных планет, формирующих характер, таланты и эмоциональный мир малыша.')">
                <circle cx="160" cy="132" r="22" fill="#0d0a14" stroke="#38bdf8" stroke-width="2"/>
                <text x="160" y="138" fill="#ffe066" font-size="14" text-anchor="middle">✨</text>
            </g>

            <text style="cursor:pointer;" onclick="window.showSacredNodeInfo('☉ Солнце (${signs.sun}): Природное Я ребёнка, его главный талант, источник радости и самооценки.')" x="160" y="22" fill="#ffe066" font-size="11" font-weight="bold" text-anchor="middle">☉ Солнце: ${signs.sun}</text>
            <text style="cursor:pointer;" onclick="window.showSacredNodeInfo('☽ Луна (${signs.moon}): Эмоциональный мир ребёнка, чувство безопасности, связь с мамой и способ успокоения.')" x="284" y="96" fill="#38bdf8" font-size="10.5" text-anchor="middle">☽ ${signs.moon}</text>
            <text style="cursor:pointer;" onclick="window.showSacredNodeInfo('☿ Меркурий (${signs.mercury}): Тип мышления, речь, любознательность и лучший ключ к обучению ребёнка.')" x="236" y="228" fill="#cbd5e1" font-size="10.5" text-anchor="middle">☿ ${signs.mercury}</text>
            <text style="cursor:pointer;" onclick="window.showSacredNodeInfo('♀ Венера (${signs.venus}): Творческие склонности, чувство прекрасного и язык любви ребёнка.')" x="84" y="228" fill="#cbd5e1" font-size="10.5" text-anchor="middle">♀ ${signs.venus}</text>
            <text style="cursor:pointer;" onclick="window.showSacredNodeInfo('♂ Марс (${signs.mars}): Физическая энергия, выбор спортивных секций, смелость и умение отстаивать границы.')" x="36" y="96" fill="#38bdf8" font-size="10.5" text-anchor="middle">♂ ${signs.mars}</text>
        </svg>`;
    }


    function openTeaserScroll(title, htmlContent) {
        const modal = document.getElementById('magic-bottom-sheet');
        if (modal) {
            const titleEl = document.getElementById('sheet-title');
            if (titleEl) titleEl.innerText = title;
            const bodyEl = document.getElementById('sheet-text');
            if (bodyEl) bodyEl.innerHTML = htmlContent;
            modal.classList.remove('hidden');
            modal.classList.add('active');
            modal.style.display = 'flex';
        } else {
            alert(title + "\n\n" + htmlContent.replace(/<[^>]+>/g, ''));
        }
    }

    configs.forEach(cfg => {
        const oldPdfBtn = document.getElementById(cfg.btnId);
        if (!oldPdfBtn) return;
        oldPdfBtn.classList.add('hidden');
        oldPdfBtn.style.setProperty('display', 'none', 'important');


        // Прячем кнопку PDF до тех пор, пока не выполнен расчёт!
        

        const calcBtn = document.createElement('button');
        calcBtn.type = 'button';
        calcBtn.className = 'main-gold-btn';
        calcBtn.style.marginTop = '16px';
        calcBtn.innerText = cfg.calcLabel;

        const resultBox = document.createElement('div');
        resultBox.style.display = 'none';
        resultBox.style.marginTop = '16px';

        oldPdfBtn.innerText = cfg.pdfLabel;
        oldPdfBtn.style.marginTop = '14px';

        oldPdfBtn.parentNode.insertBefore(calcBtn, oldPdfBtn);
        oldPdfBtn.parentNode.insertBefore(resultBox, oldPdfBtn);


        calcBtn.addEventListener('click', async () => {
            const birthDate = document.getElementById(cfg.dateId)?.value;
            if (!birthDate) {
                alert("Пожалуйста, укажите дату рождения!");
                return;
            }

            calcBtn.disabled = true;
            calcBtn.innerText = "⏳ Сонастройка со сферами...";

            try {
                let latVal = parseFloat(document.getElementById(cfg.latId)?.value) || 55.7558;
                let lonVal = parseFloat(document.getElementById(cfg.lonId)?.value) || 37.6173;
                const cityInput = document.getElementById(cfg.cityId)?.value?.trim();

                if (cityInput) {
                    try {
                        const geoRes = await fetch(`/api/v1/cities/search?q=${encodeURIComponent(cityInput)}`);
                        const cities = await geoRes.json();
                        if (Array.isArray(cities) && cities.length > 0) {
                            latVal = cities.at(0).lat;
                            lonVal = cities.at(0).lon;
                        }
                    } catch (e) {}
                }

                const res = await fetch('/api/v1/sacred-preview', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        date: birthDate,
                        time: document.getElementById(cfg.timeId)?.value || "12:00",
                        gender: document.getElementById(cfg.genderId)?.value === "man" ? "man" : "woman",
                        lat: latVal,
                        lon: lonVal,
                        tz_offset: 3.0
                    })
                });

                const data = await res.json();
                const svgHtml = buildSvg(cfg.type, data.signs);
                const teaserHtml = data.teasers[cfg.type];

                resultBox.innerHTML = `
                    <div style="background: radial-gradient(circle, rgba(22,18,36,0.9) 0%, #090710 100%); border: 1px solid ${cfg.accent}44; border-radius: 16px; padding: 14px; margin-bottom: 12px;">
                        ${svgHtml}
                    </div>
                    <div class="sacred-open-card" style="background: rgba(22, 18, 36, 0.85); border: 1px solid #e2c275; border-radius: 12px; padding: 12px 14px; margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                        <div>
                            <div style="color: #e2c275; font-weight: bold; font-size: 13.5px;">📜 ${cfg.ch1Title}</div>
                            <div style="color: #94a3b8; font-size: 11.5px; margin-top: 2px;">${cfg.ch1Desc}</div>
                        </div>
                        <span style="border: 1px solid #e2c275; color: #e2c275; font-size: 10.5px; padding: 3px 8px; border-radius: 6px; font-weight: bold;">ОТКРЫТО</span>
                    </div>
                    <div class="sacred-locked-card" style="background: rgba(15, 11, 28, 0.6); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px 14px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                        <div>
                            <div style="color: #cbd5e1; font-weight: bold; font-size: 13.5px;">🔮 ${cfg.ch2Title}</div>
                            <div style="color: #64748b; font-size: 11.5px; margin-top: 2px;">${cfg.ch2Desc}</div>
                        </div>
                        <span style="font-size: 14px;">🔒</span>
                    </div>
                `;
                
                oldPdfBtn.classList.remove('hidden');
                oldPdfBtn.style.setProperty('display', 'flex', 'important');
 
                resultBox.appendChild(oldPdfBtn);
                resultBox.style.display = 'block';

                resultBox.querySelector('.sacred-open-card').addEventListener('click', () => {
                    openTeaserScroll(cfg.ch1Title, teaserHtml);
                });
                resultBox.querySelector('.sacred-locked-card').addEventListener('click', () => {
                    oldPdfBtn.click();
                });

            } catch (e) {
                alert("Не удалось выполнить расчет. Проверьте соединение.");
            } finally {
                calcBtn.disabled = false;
                calcBtn.innerText = cfg.calcLabel;
            }
        });
    });

       let lastNatalChapters = null;
    const unlockedNatal = { ch2: false, ch3: false };

    const origNatalFetch = window.fetch;
    window.fetch = async function(resource, options) {
        const res = await origNatalFetch.apply(this, arguments);
        const urlStr = typeof resource === 'string' ? resource : (resource?.url || '');
        if (urlStr.includes('/api/v1/natal') && !urlStr.includes('download-pdf')) {
            res.clone().json().then(data => {
                if (data?.manuscript) {
                    lastNatalChapters = data.manuscript;
                    unlockedNatal.ch2 = false;
                    unlockedNatal.ch3 = false;
                    renderNatalThreeCards();
                }
            }).catch(() => {});
        }
        return res;
    };

    function playAdOrUnlock(chKey, badgeEl, onDone) {
        if (window.USER_AD_FREE || unlockedNatal[chKey]) {
            unlockedNatal.chKey = true;
            onDone();
            return;
        }
        const overlay = document.createElement('div');
        overlay.style.cssText = 'position:fixed;inset:0;background:rgba(9,7,16,0.95);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;';
        overlay.innerHTML = '<div style="color:#ffe066;font-size:18px;font-weight:bold;margin-bottom:10px;">🎬 Сакральный Эфир Спонсора</div><p style="color:#cbd5e1;font-size:13.5px;">Свиток откроется через <b id="nat-ad-sec" style="color:#10b981;">3</b> сек...</p>';
        document.body.appendChild(overlay);
        let s = 3;
        const t = setInterval(() => {
            s -= 1;
            const el = document.getElementById('nat-ad-sec');
            if (el) el.innerText = String(Math.max(0, s));
            if (s <= 0) {
                clearInterval(t);
                overlay.remove();
                unlockedNatal[chKey] = true;
                badgeEl.innerText = 'ОТКРЫТО';
                badgeEl.style.color = '#10b981';
                badgeEl.style.borderColor = '#10b981';
                onDone();
            }
        }, 1000);
    }
    function renderNatalThreeCards() {
        const decodeBtn = document.getElementById('natal-decode-btn');
        if (!decodeBtn || !lastNatalChapters) return;

        let deck = document.getElementById('natal-chapters-deck');
        if (!deck) {
            deck = document.createElement('div');
            deck.id = 'natal-chapters-deck';
            deck.style.cssText = 'display:flex;flex-direction:column;gap:10px;margin:10px 0;';
            decodeBtn.parentNode.insertBefore(deck, decodeBtn);
        }
        decodeBtn.style.setProperty('display', 'none', 'important');
        deck.innerHTML = '';

        const items = [
            { k: 'ch1', icon: '☀️', title: 'Глава I. Ядро Личности и Знаки', sub: 'Солнце, Луна, Асцендент и планеты в знаках', free: true, html: lastNatalChapters.chapter1 },
            { k: 'ch2', icon: '🏛️', title: 'Глава II. Космический Паспорт Домов', sub: '12 сфер жизни, финансы, семья и карьера', free: false, html: lastNatalChapters.chapter2 },
            { k: 'ch3', icon: '🔮', title: 'Глава III. Астральное Противоядие', sub: 'Глубинный синтез стихий и ключи силы', free: false, html: lastNatalChapters.chapter3 }
        ];

        items.forEach(it => {
            const isOpen = it.free || window.USER_AD_FREE || Boolean(unlockedNatal[it.k]);
            const card = document.createElement('div');
            card.style.cssText = 'background:rgba(22,18,36,0.9);border:1px solid ' + (isOpen ? 'rgba(16,185,129,0.45)' : 'rgba(167,139,250,0.35)') + ';border-radius:14px;padding:13px 15px;display:flex;justify-content:space-between;align-items:center;gap:10px;cursor:pointer;';
            card.innerHTML = '<div><div style="color:#ffe066;font-weight:bold;font-size:13.5px;">' + it.icon + ' ' + it.title + '</div><div style="color:#94a3b8;font-size:11px;margin-top:2px;">' + it.sub + '</div></div><span class="nbadge" style="color:' + (isOpen ? '#10b981' : '#c4b5fd') + ';border:1px solid ' + (isOpen ? '#10b981' : 'rgba(167,139,250,0.4)') + ';padding:4px 9px;border-radius:20px;font-size:10.5px;font-weight:bold;white-space:nowrap;">' + (isOpen ? 'ОТКРЫТО' : '🎬 За рекламу') + '</span>';
            card.onclick = () => {
                const b = card.querySelector('.nbadge');
                if (it.free || window.USER_AD_FREE || unlockedNatal[it.k]) {
                    openTeaserScroll(it.icon + ' ' + it.title, it.html);
                } else {
                    playAdOrUnlock(it.k, b, () => {
                        card.style.borderColor = 'rgba(16,185,129,0.45)';
                        openTeaserScroll(it.icon + ' ' + it.title, it.html);
                    });
                }
            };
            deck.appendChild(card);
        });
    }
    // Транзиты: «Раскрыть Свиток Прогноза» открывается за 1 просмотр рекламы (или сразу при NoAds)
    let transitAdUnlocked = false;
    const transitScanBtn = document.querySelector('#transit-main-block button.main-gold-btn');
    if (transitScanBtn) {
        transitScanBtn.addEventListener('click', () => { transitAdUnlocked = false; });
    }
          // 1. Сворачивание формы ввода после расчёта в Финансах, Карме и Детском гороскопе
    ['finance-pdf-btn', 'karma-pdf-btn', 'kids-pdf-btn'].forEach(btnId => {
        const pdfBtn = document.getElementById(btnId);
        const calcBtn = pdfBtn?.parentElement?.querySelector('button.main-gold-btn');
        if (!calcBtn) return;

        calcBtn.addEventListener('click', () => {
            const container = calcBtn.closest('form') || calcBtn.parentElement;
            if (!container || container.dataset.collapsed === '1') return;
            container.dataset.collapsed = '1';

            const hiddenNodes = [];
            Array.from(container.children).forEach(el => {
                if (el !== calcBtn && el !== pdfBtn && !el.querySelector('svg') && !el.querySelector('#' + btnId)) {
                    el.style.display = 'none';
                    hiddenNodes.push(el);
                }
            });
            calcBtn.style.setProperty('display', 'none', 'important');

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.style.cssText = 'width:100%; margin-bottom:12px; padding:9px; border-radius:10px; background:rgba(255,255,255,0.05); border:1px solid rgba(226,194,117,0.25); color:#94a3b8; font-size:12px; cursor:pointer;';
            editBtn.innerText = '🔄 Изменить данные расчёта';
            editBtn.onclick = () => {
                hiddenNodes.forEach(n => { n.style.display = ''; });
                calcBtn.style.setProperty('display', 'flex', 'important');
                container.dataset.collapsed = '0';
                editBtn.remove();
            };
            container.insertBefore(editBtn, container.firstChild);
        });
    });

    // 2. Реклама перед раскрытием свитка в Транзитах и Синастрии (или мгновенно при NoAds)
    const adUnlocked = { transit: false, synastry: false };
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        const txt = btn.textContent || '';

        if (txt.includes('Сканировать') || txt.includes('Рассчитать Транзит')) adUnlocked.transit = false;
        if (txt.includes('Анализировать Совместимость') || txt.includes('Рассчитать Совместимость')) adUnlocked.synastry = false;

        if ((btn.id === 'transit-decode-btn' || txt.includes('Раскрыть Свиток Прогноза')) && !window.USER_AD_FREE && !adUnlocked.transit) {
            e.stopImmediatePropagation();
            e.preventDefault();
            playAdOrUnlock('transit', btn, () => {
                adUnlocked.transit = true;
                btn.click();
            });
        }

        if ((btn.id === 'synastry-decode-btn' || txt.includes('Расшифровать Манускрипт Любви')) && !window.USER_AD_FREE && !adUnlocked.synastry) {
            e.stopImmediatePropagation();
            e.preventDefault();
            playAdOrUnlock('synastry', btn, () => {
                adUnlocked.synastry = true;
                btn.click();
            });
        }
    }, true);

    // 3. Рекламный замок на углублённые расклады в Оракуле (бесплатно при подписке NoAds)
    const ORACLE_AD_KEYWORDS = [
        'на пару', 'триплет', 'крест', 'любовь', 'бизнес и дела', 'высшая алхимия'
    ];
    const oracleAdUnlocked = {};

    document.addEventListener('click', (e) => {
        if (window.USER_AD_FREE) return;
        const btn = e.target.closest('#screen-oracle button, #screen-oracle [data-spread], #screen-oracle [data-mode]');
        if (!btn) return;

        // Не блокируем кнопку «Все инструменты раздела» и сами плитки меню
        if (btn.classList.contains('sub-tab-btn') || btn.textContent.includes('Все инструменты')) return;

        const txt = (btn.textContent || '').trim().toLowerCase();
        const matchedKey = ORACLE_AD_KEYWORDS.find(k => txt.includes(k));
        if (!matchedKey || oracleAdUnlocked[matchedKey]) return;

        e.stopImmediatePropagation();
        e.preventDefault();

        playAdOrUnlock('oracle_' + matchedKey, btn, () => {
            oracleAdUnlocked[matchedKey] = true;
            btn.click();
        });
    }, true);

    // Автоматическая пометка кнопок с рекламой: 🎬 для обычных, перечёркнутый 🎬 для подписчиков NoAds
    const AD_BADGE_KEYS = [
        'перс. число', 'транзит солнца',
        'на пару', 'триплет', 'крест', 'любовь', 'бизнес и дела', 'высшая алхимия'
    ];

    function markAdButtons() {
        const isVip = Boolean(window.USER_AD_FREE);
        document.querySelectorAll('button').forEach(btn => {
            if (btn.classList.contains('sub-tab-btn')) return;
            const txt = (btn.textContent || '').trim().toLowerCase();
            if (!AD_BADGE_KEYS.some(k => txt === k || txt.includes(k))) return;

            let tag = btn.querySelector('.ad-film-tag');
            if (!tag && !btn.textContent.includes('🎬')) {
                tag = document.createElement('span');
                tag.className = 'ad-film-tag';
                tag.innerText = '🎬';
                btn.appendChild(document.createTextNode(' '));
                btn.appendChild(tag);
            }
            if (tag) {
                tag.style.cssText = isVip
                    ? 'display:inline-block; font-size:11px; text-decoration:line-through; text-decoration-thickness:2px; text-decoration-color:#ffe066; opacity:0.55;'
                    : 'display:inline-block; font-size:11px; opacity:0.95;';
            }
        });
    }

    markAdButtons();
    setInterval(markAdButtons, 1000);


});

