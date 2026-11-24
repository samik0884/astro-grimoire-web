document.addEventListener('DOMContentLoaded', () => {
    const meta = {
        'horoscope': { icon: '♈', desc: 'Прогноз по знаку на сутки' },
        'western': { icon: '♈', desc: 'Прогноз по знаку на сутки' },
        'western-daily': { icon: '♈', desc: 'Прогноз по знаку на сутки' },
        'eastern': { icon: '🧧', desc: 'Тотем года и альманах Тун Шу' },
        'east-horoscope': { icon: '🧧', desc: 'Тотем года и альманах Тун Шу' },
        'eastern-daily': { icon: '🧧', desc: 'Тотем года и альманах Тун Шу' },
        'lunar': { icon: '🌖', desc: 'Фазы, энергетика и ритмы Луны' },
        'lunar-day': { icon: '🌖', desc: 'Фазы, энергетика и ритмы Луны' },
        'hours': { icon: '⏳', desc: 'Планетарные часы по восходу' },
        'astro-hours': { icon: '⏳', desc: 'Планетарные часы по восходу' },
        'bio': { icon: '📊', desc: 'Кривые энергии, эмоций и ума' },
        'biorhythms': { icon: '📊', desc: 'Кривые энергии, эмоций и ума' },
        'advice': { icon: '✨', desc: 'Сакральный знак оракула суток' },
        'daily-advice': { icon: '✨', desc: 'Сакральный знак оракула суток' },
        'natal': { icon: '🪐', desc: 'Паспорт личности и дома карты' },
        'transit': { icon: '⚡', desc: 'Погода неба и годовой планер' },
        'synastry': { icon: '💞', desc: 'Совместимость и сплав судеб' },
        'bazi-processor': { icon: '🏛️', desc: 'Четыре Столпа Судьбы Ба Цзы' },
        'solar': { icon: '☀️', desc: 'Персональный прогноз на год' },
        'matrix': { icon: '💠', desc: 'Октаграмма арканов и карма' },
        'finance-tool': { icon: '💼', desc: 'Код капитала и стратегия роста' },
        'karma-tool': { icon: '🌀', desc: 'Ось Лунных Узлов и Лилит' },
        'kids-tool': { icon: '🧸', desc: 'Таланты и воспитание ребенка' },
        'taro': { icon: '🔮', desc: 'Расклады Старших Арканов' },
        'sonnik': { icon: '🌃', desc: 'Юнгианский толкователь снов' },
        'dreambook': { icon: '🌃', desc: 'Юнгианский толкователь снов' },
        'iching': { icon: '☯️', desc: '6 бросков монет Книги Перемен' },
        'runes': { icon: 'ᚠ', desc: 'Скандинавский Старший Футарк' },
        'ramli': { icon: '⏳', desc: 'Арабская геомантия песка' },
        'stones': { icon: '💎', desc: 'Подбор минералов-талисманов' }
    };

    function resolveTileInfo(key, lowTitle) {
        if (meta[key]) return meta[key];
        if (lowTitle.includes('стриж')) return { icon: '✂️', desc: 'Лунные ритмы красоты и силы' };
        if (lowTitle.includes('ретро')) return { icon: '🪐', desc: 'Кармические петли и торможения' };
        if (lowTitle.includes('мантр') || lowTitle.includes('аффирмац')) return { icon: '🕉️', desc: 'Сакральная вибрация дня' };
        if (lowTitle.includes('совместим')) return { icon: '💫', desc: 'Экспресс-резонанс стихий' };
        if (lowTitle.includes('фаз')) return { icon: '🌒', desc: 'Энергия новолуния и полнолуния' };
        if (lowTitle.includes('свеч')) return { icon: '🕯️', desc: 'Огненный ритуал намерения' };
        if (lowTitle.includes('шар') || lowTitle.includes('да')) return { icon: '🔮', desc: 'Мгновенный ответ на вопрос' };
        if (lowTitle.includes('имен') || lowTitle.includes('числ') || lowTitle.includes('нумерол')) return { icon: '🔢', desc: 'Тайный код вибрации имени' };
        if (lowTitle.includes('талисман') || lowTitle.includes('оберег')) return { icon: '🧿', desc: 'Защитный символ на сегодня' };
        if (lowTitle.includes('рамли')) return { icon: '⏳', desc: 'Арабская геомантия песка' };
        if (lowTitle.includes('детск')) return { icon: '🧸', desc: 'Таланты и воспитание ребенка' };
        if (lowTitle.includes('цвет') || lowTitle.includes('камень дня')) return { icon: '🎨', desc: 'Оттенок силы и минерал-магнит' };
        if (lowTitle.includes('чайн') || lowTitle.includes('алхимик')) return { icon: '🍵', desc: 'Рецепт напитка, трав и специй под твоё состояние' };


        return { icon: '✦', desc: 'Сакральная практика Гримуара' };
    }
    document.querySelectorAll('.sub-tab-wrapper').forEach(wrapper => {
        const section = wrapper.closest('.screen-content') || wrapper.parentElement;
        const nav = wrapper.querySelector('.sub-tab-nav');
        if (!nav || !section) return;

        wrapper.style.height = 'auto';
        wrapper.style.maxHeight = 'none';
        wrapper.style.overflow = 'visible';
        wrapper.style.padding = '0';
        wrapper.style.background = 'transparent';
        wrapper.style.border = 'none';

        nav.style.setProperty('display', 'grid', 'important');
        nav.style.setProperty('grid-template-columns', 'repeat(2, 1fr)', 'important');
        nav.style.setProperty('gap', '10px', 'important');
        nav.style.setProperty('width', '100%', 'important');
        nav.style.setProperty('padding', '6px 0', 'important');
        nav.style.setProperty('overflow', 'visible', 'important');
        nav.style.setProperty('white-space', 'normal', 'important');

        const backBar = document.createElement('div');
        backBar.style.display = 'none';
        backBar.style.marginBottom = '12px';

        const backBtn = document.createElement('button');
        backBtn.type = 'button';
        backBtn.style.cssText = 'width:100%; padding:10px 14px; background:rgba(226,194,117,0.08); border:1px solid rgba(226,194,117,0.35); border-radius:12px; color:#e2c275; font-family:Philosopher,serif; font-size:13.5px; font-weight:bold; cursor:pointer;';
        backBtn.innerText = '← Все инструменты раздела';
        backBar.appendChild(backBtn);
        wrapper.parentNode.insertBefore(backBar, wrapper.nextSibling);

        function showTileGrid() {
            wrapper.style.display = 'block';
            nav.style.setProperty('display', 'grid', 'important');
            backBar.style.display = 'none';
            section.querySelectorAll('.sub-tab-content').forEach(c => {
                c.classList.remove('active');
                c.style.display = 'none';
            });
            nav.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active'));
        }

        function openTool(btn, btnIndex) {
            const targetId = btn.getAttribute('data-subtab');
            wrapper.style.display = 'none';
            backBar.style.display = 'block';

            const allBtns = Array.from(nav.querySelectorAll('.sub-tab-btn'));
            const allContents = Array.from(section.querySelectorAll('.sub-tab-content'));
            allBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetBlock = document.getElementById(targetId) || allContents.at(btnIndex);
            allContents.forEach(c => {
                if (c === targetBlock) {
                    c.classList.add('active');
                    c.style.setProperty('display', 'block', 'important');
                } else {
                    c.classList.remove('active');
                    c.style.setProperty('display', 'none', 'important');
                }
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        function styleAllButtons() {
            const buttons = Array.from(nav.querySelectorAll('.sub-tab-btn'));
            buttons.forEach((btn, index) => {
                btn.style.gridColumn = (buttons.length % 2 === 1 && index === buttons.length - 1) ? 'span 2' : '';
                if (btn.dataset.tiled === '1' && !btn.innerText.includes('Открыть инструмент')) return;

                btn.dataset.tiled = '1';

                const key = btn.getAttribute('data-subtab') || '';
                const cleanTitle = btn.innerText.trim().replace(/^[^\p{L}\d]+/u, '').trim();
                const info = resolveTileInfo(key, cleanTitle.toLowerCase());

                btn.style.cssText += ';width:100%;min-width:0;height:auto;min-height:76px;margin:0;padding:12px 10px;border-radius:14px;background:linear-gradient(145deg,rgba(22,18,36,0.92),rgba(13,10,20,0.96));border:1px solid rgba(226,194,117,0.25);display:flex;flex-direction:column;align-items:flex-start;justify-content:center;text-align:left;gap:4px;box-sizing:border-box;box-shadow:0 4px 12px rgba(0,0,0,0.35);';
                btn.style.setProperty('white-space', 'normal', 'important');
                btn.style.setProperty('overflow', 'hidden', 'important');

                btn.textContent = '';
                const topRow = document.createElement('div');
                topRow.style.cssText = 'display:flex;align-items:center;gap:6px;width:100%;';

                const ico = document.createElement('span');
                ico.style.fontSize = '16px';
                ico.textContent = info.icon;

                const ttl = document.createElement('span');
                ttl.style.cssText = 'color:#e2c275;font-family:Philosopher,serif;font-size:13px;font-weight:bold;line-height:1.2;';
                ttl.textContent = cleanTitle;

                const sub = document.createElement('span');
                sub.style.cssText = 'color:#94a3b8;font-size:10.5px;line-height:1.25;font-weight:normal;';
                sub.textContent = info.desc;

                topRow.appendChild(ico);
                topRow.appendChild(ttl);
                btn.appendChild(topRow);
                btn.appendChild(sub);

                btn.addEventListener('click', (e) => {
                    e.stopImmediatePropagation();
                    const idxNow = Array.from(nav.querySelectorAll('.sub-tab-btn')).indexOf(btn);
                    openTool(btn, idxNow);
                }, true);
            });
        }

        styleAllButtons();
        new MutationObserver(styleAllButtons).observe(nav, { childList: true });
        backBtn.addEventListener('click', showTileGrid);

        document.querySelectorAll('.nav-btn, [data-screen]').forEach(mainBtn => {
            mainBtn.addEventListener('click', () => {
                setTimeout(() => { styleAllButtons(); showTileGrid(); }, 50);
            });
        });

        showTileGrid();
    });
});
