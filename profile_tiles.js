document.addEventListener('DOMContentLoaded', () => {
    window.getGrimoireUserId = function() {
        const tgId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id;
        if (tgId) return tgId;
        let guestId = localStorage.getItem('grimoire_guest_id');
        if (!guestId) {
            guestId = -Math.floor(100000000 + Math.random() * 899999999);
            localStorage.setItem('grimoire_guest_id', String(guestId));
        }
        return parseInt(guestId, 10);
    };

    const sealBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Запечатать Свиток'));
    if (!sealBtn) return;

    const profileScreen = sealBtn.closest('.screen-content') || sealBtn.closest('section');
    if (!profileScreen) return;

    const personalBox = document.createElement('div');
    const familyBox = document.createElement('div');
    const innerWrapper = profileScreen.children.length === 1 ? profileScreen.firstElementChild : profileScreen;

    const gridNav = document.createElement('div');
    gridNav.style.display = 'grid';
    gridNav.style.gridTemplateColumns = 'repeat(2, 1fr)';
    gridNav.style.gap = '10px';
    gridNav.style.marginBottom = '16px';

    const tiles = [
        { id: 'prof-personal', icon: '👤', title: 'Личные данные', desc: 'Для вкладки «Мой День» и уведомлений', span: false },
        { id: 'prof-family', icon: '💞', title: 'Близкие люди', desc: 'Круг звёзд в памяти телефона', span: false },
        { id: 'prof-shop', icon: '💎', title: 'Магазин Энергии', desc: 'Кристаллы и отключение рекламы за Stars ⭐', span: true }
    ];

    tiles.forEach(t => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.dataset.profTab = t.id;
        if (t.span) btn.style.gridColumn = 'span 2';

        btn.style.width = '100%';
        btn.style.minHeight = '76px';
        btn.style.padding = '12px';
        btn.style.borderRadius = '14px';
        btn.style.background = t.span
            ? 'linear-gradient(135deg, rgba(108, 92, 231, 0.25), rgba(22, 18, 36, 0.95))'
            : 'linear-gradient(145deg, rgba(22, 18, 36, 0.92), rgba(13, 10, 20, 0.96))';
        btn.style.border = t.span
            ? '1px solid rgba(226, 194, 117, 0.5)'
            : '1px solid rgba(226, 194, 117, 0.25)';
        btn.style.display = 'flex';
        btn.style.flexDirection = 'column';
        btn.style.alignItems = 'flex-start';
        btn.style.justifyContent = 'center';
        btn.style.textAlign = 'left';
        btn.style.gap = '4px';
        btn.style.cursor = 'pointer';
        btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.35)';

        btn.innerHTML = `
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="font-size: 16px;">${t.icon}</span>
                <span style="color: #e2c275; font-family: 'Philosopher', serif; font-size: 13.5px; font-weight: bold;">${t.title}</span>
            </div>
            <span style="color: #94a3b8; font-size: 11px; line-height: 1.25;">${t.desc}</span>
        `;
        gridNav.appendChild(btn);
    });

    const backBar = document.createElement('div');
    backBar.style.display = 'none';
    backBar.style.marginBottom = '12px';
    backBar.innerHTML = `
        <button type="button" style="width: 100%; padding: 10px 14px; background: rgba(226, 194, 117, 0.08); border: 1px solid rgba(226, 194, 117, 0.35); border-radius: 12px; color: #e2c275; font-family: 'Philosopher', serif; font-size: 13.5px; font-weight: bold; cursor: pointer;">
            ← Все разделы Профиля
        </button>
    `;
    const shopBlock = document.createElement('div');
    shopBlock.style.display = 'none';
    shopBlock.innerHTML = `
        <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(22, 18, 36, 0.92)); border: 1px solid rgba(16, 185, 129, 0.45); border-radius: 14px; padding: 14px; margin: 10px 0 14px 0; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
            <div>
                <div style="color: #10b981; font-weight: bold; font-size: 13.5px;">🎬 Ритуал Энергии (Бесплатно)</div>
                <div id="ad-ritual-status" style="color: #cbd5e1; font-size: 11.5px; margin-top: 2px;">3 просмотра эфира = +1 💎 (до 2 💎 в день)</div>
            </div>
            <button type="button" id="watch-ad-ritual-btn" style="background: linear-gradient(180deg, #10b981, #059669); color: #090710; font-weight: bold; font-size: 12px; padding: 8px 12px; border: none; border-radius: 10px; white-space: nowrap; cursor: pointer;">▶ Смотреть (0/3)</button>
        </div>
        <div style="background: linear-gradient(135deg, rgba(244, 114, 182, 0.14), rgba(22, 18, 36, 0.94)); border: 1px solid rgba(244, 114, 182, 0.45); border-radius: 14px; padding: 12px 14px; margin: 10px 0 14px 0; display: flex; align-items: center; justify-content: space-between; gap: 10px;">
            <label for="gift-mode-checkbox" style="display: flex; align-items: center; gap: 10px; cursor: pointer; margin: 0; width: 100%;">
                <input type="checkbox" id="gift-mode-checkbox" style="width: 18px; height: 18px; accent-color: #f472b6; cursor: pointer; flex-shrink: 0;">
                <div>
                    <div style="color: #f9a8d4; font-weight: bold; font-size: 13.5px;">🎁 Купить в подарок другу</div>
                    <div style="color: #cbd5e1; font-size: 11px; margin-top: 2px;">После оплаты бот пришлёт ссылку-подарок для любого человека</div>
                </div>
            </label>
        </div>

        <div style="color: #e2c275; font-family: 'Philosopher', serif; font-size: 14px; font-weight: bold; margin: 12px 0 8px 2px;">💎 Пакеты Кристаллов</div>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px;">
            <div class="star-invoice-btn" data-item="crystals_30" data-stars="100" style="background: rgba(22, 18, 36, 0.85); border: 1px solid rgba(167, 139, 250, 0.3); border-radius: 14px; padding: 14px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <div>
                    <div style="color: #e2c275; font-weight: bold; font-size: 14px;">🔹 Горсть Кристаллов (30 шт.)</div>
                    <div style="color: #94a3b8; font-size: 11.5px; margin-top: 2px;">Хватит на Матрицу Судьбы или книгу по Акции Дня</div>
                </div>
                <span style="background: linear-gradient(135deg, #6c5ce7, #a8a2ff); color: #fff; font-weight: bold; font-size: 13px; padding: 8px 12px; border-radius: 10px; white-space: nowrap;">100 ⭐</span>
            </div>

            <div class="star-invoice-btn" data-item="crystals_70" data-stars="200" style="background: linear-gradient(135deg, rgba(226, 194, 117, 0.12), rgba(22, 18, 36, 0.92)); border: 1px solid #e2c275; border-radius: 14px; padding: 14px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <div>
                    <div style="color: #ffe066; font-weight: bold; font-size: 14px;">🔮 Мешочек Кристаллов (70 шт.)</div>
                    <div style="color: #cbd5e1; font-size: 11.5px; margin-top: 2px;">На любую полную PDF-книгу + запас кристаллов</div>
                </div>
                <span style="background: linear-gradient(180deg, #e2c275, #b3934b); color: #121019; font-weight: bold; font-size: 13px; padding: 8px 12px; border-radius: 10px; white-space: nowrap;">200 ⭐</span>
            </div>

            <div class="star-invoice-btn" data-item="crystals_180" data-stars="450" style="background: rgba(22, 18, 36, 0.85); border: 1px solid rgba(16, 185, 129, 0.4); border-radius: 14px; padding: 14px; display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                <div>
                    <div style="color: #10b981; font-weight: bold; font-size: 14px;">👑 Большой запас (180 шт.)</div>
                    <div style="color: #94a3b8; font-size: 11.5px; margin-top: 2px;">Выгода 25% — полный комплект книг для всей семьи</div>
                </div>
                <span style="background: rgba(16, 185, 129, 0.2); border: 1px solid #10b981; color: #10b981; font-weight: bold; font-size: 13px; padding: 8px 12px; border-radius: 10px; white-space: nowrap;">450 ⭐</span>
            </div>
        </div>

        <div style="color: #e2c275; font-family: 'Philosopher', serif; font-size: 14px; font-weight: bold; margin: 10px 0 8px 2px;">🛡️ Отключение рекламы</div>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            <div class="star-invoice-btn" data-item="noads_1m" data-stars="100" style="background: rgba(22, 18, 36, 0.85); border: 1px solid rgba(226, 194, 117, 0.25); border-radius: 14px; padding: 12px; text-align: center; cursor: pointer;">
                <div style="color: #f3e8ff; font-weight: bold; font-size: 13px;">На 1 месяц</div>
                <div style="color: #94a3b8; font-size: 11px; margin: 4px 0 8px 0;">Все главы без ожидания</div>
                <span style="display: inline-block; background: rgba(108, 92, 231, 0.25); border: 1px solid #a8a2ff; color: #fff; font-weight: bold; font-size: 12.5px; padding: 6px 12px; border-radius: 8px;">100 ⭐</span>
            </div>

            <div class="star-invoice-btn" data-item="noads_1y" data-stars="300" style="background: linear-gradient(145deg, rgba(226, 194, 117, 0.12), rgba(22, 18, 36, 0.95)); border: 1px solid #e2c275; border-radius: 14px; padding: 12px; text-align: center; cursor: pointer;">
                <div style="color: #ffe066; font-weight: bold; font-size: 13px;">На 1 год</div>
                <div style="color: #cbd5e1; font-size: 11px; margin: 4px 0 8px 0;">Выгода 75% на весь год</div>
                <span style="display: inline-block; background: linear-gradient(180deg, #e2c275, #b3934b); color: #121019; font-weight: bold; font-size: 12.5px; padding: 6px 12px; border-radius: 8px;">300 ⭐</span>
            </div>
        </div>
    `;

    const sweepNodes = () => {
        const familyTitle = Array.from(profileScreen.querySelectorAll('*')).find(el =>
            el.children.length === 0 && el.textContent.includes('Твой Круг Звёзд')
        );
        if (familyTitle) {
            let famBlock = familyTitle.parentElement;
            while (famBlock && famBlock.parentElement !== innerWrapper && famBlock.parentElement !== profileScreen) {
                famBlock = famBlock.parentElement;
            }
            if (famBlock && famBlock !== familyBox && !familyBox.contains(famBlock)) {
                familyBox.appendChild(famBlock);
            }
        }
        Array.from(innerWrapper.children).forEach(el => {
            if (![gridNav, backBar, personalBox, familyBox, shopBlock, altarBox, sanctumScreen].includes(el)) {
                personalBox.appendChild(el);
            }
        });
    };
    const SANCTUM_TOOLS = [
        { icon: '🔯', title: 'Генератор Сигилы Дня', desc: 'Личный защитный SVG-оберег и заставка 1080×1920', action: 'sigil' },
        { icon: '🧭', title: 'Астральный Компас Суток', desc: 'Удачные и опасные часы дня по твоим домам' },
        { icon: '🌑', title: 'Зеркало Тени на Сегодня', desc: 'Радар скрытых уязвимостей (Лилит, Хирон, Сатурн)' },
        { icon: '🍀', title: 'Золотое Окно Фортуны', desc: 'Точный 2-часовой портал месяца по Парсу Фортуны' },
        { icon: '👥', title: 'Теневой Двойник', desc: 'Глубинный психоанализ Лилит, Плутона и тайной силы' },
        { icon: '📆', title: 'Окно Силы на 30 дней', desc: 'Сканер лучших и опасных дней месяца по транзитам' },
        { icon: '⭐', title: 'Звезда Магов', desc: 'Соединения карты с Сириусом, Регулом и Спикой' },
        { icon: '🌒', title: 'Врата Затмений и Порталов', desc: 'Точный дом карты, где произойдёт переворот' },
        { icon: '🏛️', title: 'Астро-Архетип: Древний Бог', desc: 'Твой мифологический покровитель по силе планет' },
        { icon: '🌀', title: 'Колесо Сароса (18 лет)', desc: 'Кармическая спираль Узлов каждые 9 и 18 лет', action: 'saros' }
    ];


    const altarBox = document.createElement('div');
    altarBox.id = 'order-altar-widget';
    altarBox.style.cssText = 'width:100%;box-sizing:border-box;background:linear-gradient(155deg,rgba(22,18,36,0.96),rgba(11,8,20,0.98));border:1px solid rgba(226,194,117,0.35);border-radius:16px;padding:16px;margin-top:4px;box-shadow:0 6px 24px rgba(0,0,0,0.45);';

    const sanctumScreen = document.createElement('div');
    sanctumScreen.id = 'sanctum-locked-view';
    sanctumScreen.style.display = 'none';

    let serverOrderState = { streak: 0, last_date: '', ads_today: 0, today: new Date().toISOString().split('T').at(0) };

    async function fetchServerOrderState() {
        try {
            const res = await fetch('/api/v1/user/order-status', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: window.getGrimoireUserId() })
            });
            const data = await res.json();
            if (data.status === 'ok') {
                serverOrderState = data;
                renderAltarWidget();
            }
        } catch (e) {}
    }

    function getRankName(streak) {
        if (streak >= 30) return '👑 Смотритель Тайной Комнаты';
        if (streak >= 28) return '✨ Мастер Судеб';
        if (streak >= 21) return '🔮 Хранитель Тайн';
        if (streak >= 14) return '📜 Читающий Знамения';
        if (streak >= 7) return '🧭 Искатель Знаков';
        return '🕯 Новичок Круга (Путь 30 дней)';
    }

    function renderAltarWidget() {
        const st = serverOrderState; const today = st.today;
        const checkedToday = st.last_date === today;
        const displayStreak = Math.min(30, st.streak);
        const isUnlocked = Number(window.getGrimoireUserId()) === 7578047295 || (st.streak >= 30 && checkedToday);

        altarBox.textContent = '';

        const head = document.createElement('div');
        head.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;gap:8px;';
        const hTitle = document.createElement('span');
        hTitle.style.cssText = 'color:#ffe066;font-family:Philosopher,serif;font-size:14.5px;font-weight:bold;';
        hTitle.textContent = '🕯 Алтарь Посвящения';
        const hBadge = document.createElement('span');
        hBadge.style.cssText = 'background:rgba(226,194,117,0.12);border:1px solid rgba(226,194,117,0.35);color:#e2c275;font-size:11px;font-weight:bold;padding:3px 9px;border-radius:20px;';
        hBadge.textContent = st.streak + ' / 30 дн.';
        head.append(hTitle, hBadge);

        const rankRow = document.createElement('div');
        rankRow.style.cssText = 'color:#a78bfa;font-size:12px;margin-bottom:10px;';
        rankRow.textContent = 'Титул: ' + getRankName(st.streak);

        const milestonesInfo = document.createElement('div');
        milestonesInfo.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px;font-size:10.5px;color:#cbd5e1;';
        ['7д: 🎫 без рекл.', '14д: +15💎', '21д: +25💎', '28д: +40💎', '30д: 👑 Комната'].forEach(lbl => {
            const tag = document.createElement('span');
            tag.style.cssText = 'background:rgba(255,255,255,0.04);border:1px solid rgba(226,194,117,0.2);padding:2px 7px;border-radius:8px;';
            tag.textContent = lbl;
            milestonesInfo.appendChild(tag);
        });

        const isVip = Boolean(window.USER_AD_FREE);
        const progressAds = st.ads_today % 3;
        const checkinBtn = document.createElement('button');
        checkinBtn.type = 'button';
        checkinBtn.style.cssText = 'width:100%;padding:11px 12px;border-radius:12px;font-weight:bold;font-size:12.5px;cursor:pointer;margin-bottom:10px;' +
            (checkedToday
                ? 'border:1px solid rgba(16,185,129,0.45);background:rgba(16,185,129,0.12);color:#10b981;'
                : 'border:none;background:linear-gradient(135deg,#e2c275 0%,#b89343 100%);color:#090710;');

        if (checkedToday) {
            checkinBtn.textContent = isVip
                ? '✅ День засчитан • Серия: ' + st.streak + ' дн.'
                : '✅ День засчитан (' + st.ads_today + '/6 эфиров) • Серия: ' + st.streak + ' дн.';
        } else if (isVip) {
            checkinBtn.textContent = '🛡️ Засчитать день в календаре (Без рекламы)';
        } else {
            checkinBtn.textContent = '🎬 Зажечь огонь дня (' + progressAds + '/3 эфира = +1 💎 и зачёт)';
        }

        const triggerCheckin = async () => {
            if (checkinBtn.disabled) return;
            checkinBtn.disabled = true;
            checkinBtn.textContent = '⏳ Сверяем со звёздами...';
            try {
                const res = await fetch('/api/v1/user/order-checkin', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: window.getGrimoireUserId() })
                });
                const data = await res.json();
                if (data.status === 'ok') {
                    if (data.limit_reached) {
                        alert('На сегодня лимит эфиров исчерпан (6/6). Возвращайтесь завтра!');
                    } else {
                        serverOrderState = data;
                        if (window.syncUserWallet) window.syncUserWallet();
                        if (data.milestone_msg) {
                            if (window.Telegram?.WebApp?.showAlert) window.Telegram.WebApp.showAlert(data.milestone_msg);
                            else alert(data.milestone_msg);
                        }
                    }
                }
            } catch (e) {}
            renderAltarWidget();
        };
        checkinBtn.onclick = triggerCheckin;

        const MILESTONE_ICONS = { 7: '🎫', 14: '15💎', 21: '25💎', 28: '40💎', 30: '👑' };
        const MILESTONE_HINTS = {
            7: '7-й день: Титул «Искатель Знаков» и 7 дней без рекламы 🎫',
            14: '14-й день: Титул «Читающий Знамения» и +15 кристаллов 💎',
            21: '21-й день: Титул «Хранитель Тайн» и +25 кристаллов 💎',
            28: '28-й день: Титул «Мастер Судеб» и +40 кристаллов 💎',
            30: '30-й день: Высший титул «Смотритель Тайной Комнаты», 7 дней без рекламы и доступ в Тайную Комнату 👑'
        };

        const calGrid = document.createElement('div');
        calGrid.style.cssText = 'display:grid;grid-template-columns:repeat(6,1fr);gap:6px;margin-bottom:14px;';
        for (let d = 1; d <= 30; d++) {
            const isDone = d <= displayStreak;
            const isNext = !checkedToday && d === displayStreak + 1;
            const canTapToday = isNext || (checkedToday && !isVip && st.ads_today < 6 && d === displayStreak);
            const isMilestone = Boolean(MILESTONE_ICONS[d]);

            const cell = document.createElement('div');
            cell.style.cssText = 'aspect-ratio:1/1;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:' + (isMilestone && !isDone ? '10px' : '11.5px') + ';' +
                'background:' + (isDone ? 'linear-gradient(135deg,rgba(226,194,117,0.32),rgba(167,139,250,0.22))' : (isMilestone ? 'rgba(167,139,250,0.12)' : (isNext ? 'rgba(226,194,117,0.14)' : 'rgba(13,10,20,0.75)'))) + ';' +
                'border:' + (isDone ? '1px solid #e2c275' : (isNext ? '1.5px dashed #ffe066' : (isMilestone ? '1px solid rgba(226,194,117,0.45)' : '1px solid rgba(255,255,255,0.07)'))) + ';' +
                'color:' + (isDone ? '#ffe066' : (isMilestone ? '#ffe066' : (isNext ? '#e2c275' : '#64748b'))) + ';' +
                'font-weight:' + (isDone || isNext || isMilestone ? 'bold' : 'normal') + ';' +
                'cursor:' + (canTapToday || isMilestone ? 'pointer' : 'default') + ';';
            cell.textContent = isDone ? '🔥' : (MILESTONE_ICONS[d] || String(d));

            if (canTapToday) {
                cell.onclick = triggerCheckin;
            } else if (isMilestone) {
                cell.onclick = () => {
                    const msg = MILESTONE_HINTS[d];
                    if (window.Telegram?.WebApp?.showAlert) window.Telegram.WebApp.showAlert(msg);
                    else alert(msg);
                };
            }
            calGrid.appendChild(cell);
        }

        const doorBtn = document.createElement('div');
        doorBtn.style.cssText = 'background:linear-gradient(135deg,rgba(108,92,231,0.18),rgba(15,11,28,0.95));border:1px solid ' + (isUnlocked ? '#ffe066' : 'rgba(167,139,250,0.35)') + ';border-radius:12px;padding:12px 14px;display:flex;justify-content:space-between;align-items:center;cursor:pointer;';
        const doorLeft = document.createElement('div');
        const doorT = document.createElement('div');
        doorT.style.cssText = 'color:#ffe066;font-family:Philosopher,serif;font-size:13.5px;font-weight:bold;';
        doorT.textContent = '🔮 Тайная Комната';
        const doorSub = document.createElement('div');
        doorSub.style.cssText = 'color:#94a3b8;font-size:11px;margin-top:2px;';
        doorSub.textContent = '10 закрытых ритуалов + бонус +1 💎 в день (с 30-го дня)';
        const doorIcon = document.createElement('span');
        doorIcon.style.fontSize = '16px';
        doorIcon.textContent = isUnlocked ? '🗝️' : '🔒';
        doorLeft.append(doorT, doorSub);
        doorBtn.append(doorLeft, doorIcon);
        doorBtn.onclick = openSanctumView;

        altarBox.append(head, rankRow, milestonesInfo, calGrid, checkinBtn, doorBtn);
    }


    function openSanctumView() {
        const st = serverOrderState; const today = st.today;
        const isAdmin = Number(window.getGrimoireUserId()) === 7578047295;
        const isUnlocked = isAdmin || (st.streak >= 30 && st.last_date === today);

        const leftDays = Math.max(0, 30 - st.streak);

        gridNav.style.setProperty('display', 'none', 'important');
        altarBox.style.setProperty('display', 'none', 'important');
        backBar.style.setProperty('display', 'block', 'important');
        sanctumScreen.style.setProperty('display', 'block', 'important');
        sanctumScreen.textContent = '';

        const banner = document.createElement('div');
        banner.style.cssText = 'background:linear-gradient(145deg,rgba(108,92,231,0.16),rgba(13,10,20,0.96));border:1px solid rgba(226,194,117,0.35);border-radius:14px;padding:14px;margin-bottom:12px;text-align:center;';
        const bTitle = document.createElement('div');
        bTitle.style.cssText = 'color:#ffe066;font-family:Philosopher,serif;font-size:15px;font-weight:bold;margin-bottom:4px;';
        bTitle.textContent = '🔮 Святилище Посвящённых';
        const bDesc = document.createElement('div');
        bDesc.style.cssText = 'color:#cbd5e1;font-size:12px;line-height:1.4;';
        bDesc.textContent = isUnlocked
            ? 'Врата открыты! Поддерживайте ежедневный огонь в Алтаре, чтобы сохранить доступ.'
            : 'До открытия врат осталось ' + leftDays + ' дн. непрерывного пути. Отмечайтесь каждый день в Алтаре Посвящения!';
        banner.append(bTitle, bDesc);

        const cardsGrid = document.createElement('div');
        cardsGrid.style.cssText = 'display:grid;grid-template-columns:repeat(2,1fr);gap:10px;';

        SANCTUM_TOOLS.forEach(item => {
            const card = document.createElement('div');
            card.style.cssText = 'background:rgba(15,11,28,0.85);border:1px solid rgba(167,139,250,0.22);border-radius:14px;padding:12px 10px;display:flex;flex-direction:column;gap:5px;cursor:pointer;';

            const top = document.createElement('div');
            top.style.cssText = 'display:flex;justify-content:space-between;align-items:center;';
            const ic = document.createElement('span');
            ic.style.fontSize = '17px';
            ic.textContent = item.icon;
            const lk = document.createElement('span');
            lk.style.cssText = 'font-size:12px;color:#a78bfa;';
            lk.textContent = isUnlocked ? '✨' : '🔒';
            top.append(ic, lk);

            const t = document.createElement('div');
            t.style.cssText = 'color:#e2c275;font-family:Philosopher,serif;font-size:12.5px;font-weight:bold;line-height:1.2;';
            t.textContent = item.title;

            const d = document.createElement('div');
            d.style.cssText = 'color:#94a3b8;font-size:10.5px;line-height:1.25;';
            d.textContent = item.desc;

            card.append(top, t, d);
            card.onclick = () => {
                if (!isUnlocked) {
                    const msg = '🔒 Этот тайный свиток откроется после 30 дней непрерывного посещения (осталось ' + leftDays + ' дн.).';
                    if (window.Telegram?.WebApp?.showAlert) window.Telegram.WebApp.showAlert(msg);
                    else alert(msg);
                    return;
                }
                if (item.action === 'sigil' && window.openSigilGeneratorTool) {
                    window.openSigilGeneratorTool();
                } else if (item.action === 'saros' && window.openSarosWheelTool) {
                    window.openSarosWheelTool();
                } else {
                    const msg = '✨ Этот ритуал готовится к открытию в следующем обновлении Тайной Комнаты!';
                    if (window.Telegram?.WebApp?.showAlert) window.Telegram.WebApp.showAlert(msg);
                    else alert(msg);
                }
            };
            cardsGrid.appendChild(card);
        });

        sanctumScreen.append(banner, cardsGrid);
    }



    innerWrapper.appendChild(gridNav);
    innerWrapper.appendChild(backBar);
    innerWrapper.appendChild(personalBox);
    innerWrapper.appendChild(familyBox);
    innerWrapper.appendChild(shopBlock);
    innerWrapper.appendChild(altarBox);
    innerWrapper.appendChild(sanctumScreen);


    sweepNodes();
    new MutationObserver(sweepNodes).observe(profileScreen, { childList: true, subtree: true });

    function showProfileGrid() {
        sweepNodes();
        gridNav.style.setProperty('display', 'grid', 'important');
        backBar.style.setProperty('display', 'none', 'important');
        personalBox.style.setProperty('display', 'none', 'important');
        familyBox.style.setProperty('display', 'none', 'important');
        shopBlock.style.setProperty('display', 'none', 'important');
        altarBox.style.setProperty('display', 'block', 'important');
        sanctumScreen.style.setProperty('display', 'none', 'important');
        renderAltarWidget();
        fetchServerOrderState();

    }

    function openProfileTab(tabId) {
        sweepNodes();
        gridNav.style.setProperty('display', 'none', 'important');
        backBar.style.setProperty('display', 'block', 'important');
        personalBox.style.setProperty('display', tabId === 'prof-personal' ? 'block' : 'none', 'important');
        familyBox.style.setProperty('display', tabId === 'prof-family' ? 'block' : 'none', 'important');
        shopBlock.style.setProperty('display', tabId === 'prof-shop' ? 'block' : 'none', 'important');
        altarBox.style.setProperty('display', 'none', 'important');
        sanctumScreen.style.setProperty('display', 'none', 'important');

    }

    gridNav.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => openProfileTab(btn.dataset.profTab));
    });
    backBar.querySelector('button').addEventListener('click', showProfileGrid);

    if (!document.getElementById('global-status-bar')) {
        const statusBar = document.createElement('div');
        statusBar.id = 'global-status-bar';
        statusBar.style.cssText = 'position: sticky; top: 0; z-index: 9999; display: none; justify-content: flex-end; gap: 8px; padding: 8px 14px; background: rgba(13, 10, 20, 0.9); backdrop-filter: blur(8px); border-bottom: 1px solid rgba(226, 194, 117, 0.15); cursor: pointer;';
        statusBar.innerHTML = `
            <span id="top-crystals-badge" style="background: rgba(226, 194, 117, 0.15); border: 1px solid rgba(226, 194, 117, 0.45); color: #ffe066; font-size: 12px; font-weight: bold; padding: 4px 10px; border-radius: 20px;">
                💎 0
            </span>
            <span id="top-sub-badge" style="background: rgba(148, 163, 184, 0.12); border: 1px solid rgba(148, 163, 184, 0.3); color: #94a3b8; font-size: 11.5px; padding: 4px 10px; border-radius: 20px;">
                📢 Реклама вкл.
            </span>
        `;
        document.body.insertBefore(statusBar, document.body.firstChild);

        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-btn, [data-screen], .bottom-nav, nav') || e.target.closest('[class*="cover"], [id*="cover"], [id*="splash"]')) {
                statusBar.style.display = 'flex';
            }
        });

        statusBar.addEventListener('click', () => {
            const profNavBtn = Array.from(document.querySelectorAll('.nav-btn, [data-screen]')).find(b => b.textContent.includes('Профиль'));
            if (profNavBtn) profNavBtn.click();
            setTimeout(() => openProfileTab('prof-shop'), 80);
        });
    }

    document.querySelectorAll('.nav-btn, [data-screen]').forEach(navBtn => {
        navBtn.addEventListener('click', () => setTimeout(showProfileGrid, 60));
    });

        // Синхронизация реального баланса кристаллов и статуса подписки с сервером
        window.syncUserWallet = async function() {
        const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
        const userId = window.getGrimoireUserId();
        try {
            const res = await fetch('/api/v1/user/get-balance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: userId,
                    username: tgUser?.username || "",
                    first_name: tgUser?.first_name || ""
                })
            });
            const data = await res.json();
            if (data.status === 'ok') {
                window.USER_CRYSTALS = data.crystals;
                window.USER_AD_FREE = data.ad_free;
                window.USER_CIRCLE_SLOTS = data.circle_slots || 2;

                if (window.Telegram?.WebApp?.CloudStorage) {
                    window.Telegram.WebApp.CloudStorage.getItem('g_circle', (err, cloudVal) => {
                        if (!err && cloudVal && cloudVal !== '[]') {
                            localStorage.setItem('g_circle', cloudVal);
                            if (window.refreshGrimoireSelectors) window.refreshGrimoireSelectors();
                        }
                    });
                }


                const topBal = document.getElementById('top-crystals-badge');
                const profBal = document.getElementById('user-crystals-balance');
                const topSub = document.getElementById('top-sub-badge');

                if (topBal) topBal.innerText = `💎 ${data.crystals}`;
                if (profBal) profBal.innerText = `${data.crystals} 💎`;
                if (topSub) {
                    if (data.ad_free) {
                        topSub.innerText = `🛡️ Без рекламы (${data.ad_free_days} дн.)`;
                        topSub.style.color = '#ffe066';
                        topSub.style.borderColor = '#e2c275';
                    } else {
                        topSub.innerText = '📢 Реклама вкл.';
                    }
                }

                // Заполняем вкладку «Личные данные» из базы сервера
                if (data.profile && data.profile.birth_date && personalBox) {
                    const inputs = Array.from(personalBox.querySelectorAll('input'));
                    const selectEl = personalBox.querySelector('select');
                    const nameInp = inputs.find(i => i.placeholder?.toLowerCase().includes('имя') || i.id?.includes('name'));
                    const dateInp = inputs.find(i => i.type === 'date' || i.id?.includes('date'));
                    const timeInp = inputs.find(i => (i.type === 'time' || i.id?.includes('time')) && i.id !== 'profile-notify-time');
                    const cityInp = inputs.find(i => i.placeholder?.toLowerCase().includes('город') || i.id?.includes('city'));
                    if (nameInp && data.profile.first_name) nameInp.value = data.profile.first_name;
                    if (selectEl && data.profile.gender) selectEl.value = data.profile.gender;
                    if (dateInp) dateInp.value = data.profile.birth_date;
                    if (timeInp && data.profile.birth_time) timeInp.value = data.profile.birth_time;
                    if (cityInp && data.profile.birth_city) cityInp.value = data.profile.birth_city;
                    const notifyInp = document.getElementById('profile-notify-time');
                    const notifyChk = document.getElementById('profile-notify-enabled');
                   if (notifyInp && notifyChk && data.profile.notify_time) {
                      if (data.profile.notify_time === 'off') {
                         notifyChk.checked = false;
                         notifyInp.disabled = true;
                         notifyInp.style.opacity = '0.4';
                      } else {
                         notifyChk.checked = true;
                         notifyInp.disabled = false;
                         notifyInp.style.opacity = '1';
                         notifyInp.value = data.profile.notify_time;
                      }
                   }

                    

                    if (sealBtn) sealBtn.innerText = '🔄 Обновить личные данные';
                }
            }
        } catch (e) {}
    };


        // Оплата пакетов (для себя или в подарок другу) через Telegram Stars
    shopBlock.querySelectorAll('.star-invoice-btn').forEach(card => {
        card.addEventListener('click', async () => {
            const item = card.dataset.item;
            const isGift = document.getElementById('gift-mode-checkbox')?.checked || false;
            const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
            if (!tgUser?.id) {
                if (window.Telegram?.WebApp?.showAlert) {
                    window.Telegram.WebApp.showAlert("Откройте приложение внутри Telegram для оплаты звёздами.");
                }
                return;
            }
            try {
                const res = await fetch('/api/v1/stars/create-invoice', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: tgUser.id, item_id: item, is_gift: isGift })
                });
                const data = await res.json();
                if (data.invoice_url && window.Telegram?.WebApp?.openInvoice) {
                    window.Telegram.WebApp.openInvoice(data.invoice_url, (status) => {
                        if (status === 'paid') {
                            setTimeout(window.syncUserWallet, 800);
                        }
                    });
                }
            } catch (e) {}
        });
    });

    // Обработчик кнопки «▶ Смотреть (0/3)» Ежедневного Ритуала
    const ritualBtn = shopBlock.querySelector('#watch-ad-ritual-btn');
    if (ritualBtn) {
        ritualBtn.addEventListener('click', () => {
            window.GrimoireAds.showRewarded(async () => {
                const userId = window.getGrimoireUserId();
                ritualBtn.disabled = true;
                ritualBtn.innerText = '⏳ Эфир...';
                try {
                    const res = await fetch('/api/v1/user/ad-reward', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user_id: userId })
                    });
                    const data = await res.json();
                    const statusEl = shopBlock.querySelector('#ad-ritual-status');
                    if (data.status === 'limit') {
                        if (statusEl) statusEl.innerText = data.message;
                        ritualBtn.innerText = '✅ Лимит (2/2 💎)';
                        return;
                    }
                    if (data.rewarded) {
                        if (statusEl) statusEl.innerHTML = '✨ <b>Ритуал завершён! Начислено +1 💎</b>';
                        ritualBtn.innerText = '▶ Смотреть (0/3)';
                        if (window.syncUserWallet) window.syncUserWallet();
                    } else {
                        if (statusEl) statusEl.innerText = `Прогресс: ${data.progress} из 3 роликов до +1 💎`;
                        ritualBtn.innerText = `▶ Смотреть (${data.progress}/3)`;
                    }
                } catch (e) {}
                ritualBtn.disabled = false;
            });
        });
    }




    // Кнопка полной очистки Личных данных (телефон + сервер)
    if (personalBox && !document.getElementById('clear-personal-btn')) {
        const clearPersBtn = document.createElement('button');
        clearPersBtn.id = 'clear-personal-btn';
        clearPersBtn.type = 'button';
        clearPersBtn.style.cssText = 'width: 100%; margin-top: 10px; padding: 10px; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 12px; color: #fca5a5; font-size: 13px; cursor: pointer;';
        clearPersBtn.innerText = '🗑️ Удалить личные данные';
        personalBox.appendChild(clearPersBtn);

        clearPersBtn.addEventListener('click', async () => {
            if (!confirm('Удалить ваши сохранённые личные данные с сервера и телефона?')) return;
            personalBox.querySelectorAll('input').forEach(inp => inp.value = '');
            localStorage.removeItem('user_natal_profile');
            localStorage.removeItem('astro_user_profile');

            const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
            if (tgUser?.id) {
                try {
                    await fetch('/api/v1/user/delete-profile', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user_id: tgUser.id })
                    });
                } catch (e) {}
            }
            alert('Личные данные успешно очищены.');
        });
    }

        // Управление списком «Круг Близких» (редактирование, удаление, город и лимит слотов)
        // Управление списком «Круг Близких» (редактирование, удаление, город + координаты)
    
    const injectFamilyCity = () => {
            if (familyBox && !document.getElementById('clean-circle-card')) {
        familyBox.innerHTML = '';

        const clearFamBtn = document.createElement('button');
        clearFamBtn.id = 'clear-family-btn';
        clearFamBtn.type = 'button';
        clearFamBtn.style.cssText = 'width: 100%; margin-bottom: 12px; padding: 10px; background: rgba(239, 68, 68, 0.12); border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 12px; color: #fca5a5; font-size: 13px; cursor: pointer;';
        clearFamBtn.innerText = '🗑️ Очистить весь Круг Близких';
        familyBox.appendChild(clearFamBtn);

        const card = document.createElement('div');
        card.id = 'clean-circle-card';
        card.style.cssText = 'background: rgba(15, 11, 28, 0.55); border: 1px solid rgba(226, 194, 117, 0.25); border-radius: 16px; padding: 16px;';
        card.innerHTML = `
            <h4 style="color:#e2c275; margin:0 0 12px 0; font-size:15px; text-align:center; font-family:'Philosopher',serif;">✦ Твой Круг Звёзд (Близкие) ✦</h4>
            <div style="margin-bottom:10px;">
                <label style="color:#a0a5c0; font-size:12px; display:block; margin-bottom:4px;">Выбрать для редактирования или просмотра:</label>
                <select id="circle-selector" style="width:100%; height:40px; padding:0 10px; border-radius:12px; background:#0d0a14; color:#fff; border:1px solid rgba(226,194,117,0.3);">
                    <option value="">➕ Добавить нового близкого</option>
                </select>
            </div>
            <div id="fam-person-actions" style="display:none; gap:8px; margin-bottom:12px;">
                <button type="button" id="fam-save-edit-btn" style="flex:1; padding:9px; background:rgba(226,194,117,0.15); border:1px solid #e2c275; color:#e2c275; border-radius:10px; font-size:12.5px; font-weight:bold; cursor:pointer;">💾 Сохранить изменения</button>
                <button type="button" id="fam-del-one-btn" style="padding:9px 12px; background:rgba(239,68,68,0.15); border:1px solid rgba(239,68,68,0.45); color:#fca5a5; border-radius:10px; font-size:12.5px; cursor:pointer;">❌ Удалить</button>
            </div>
            <div style="display:flex; flex-direction:column; gap:10px;">
                <div style="display:flex; gap:8px;">
                    <input type="text" id="fam-name-inp" placeholder="Имя (Мама, Анна)" style="flex:1.5; height:40px; padding:0 12px; border-radius:12px; background:#0d0a14; color:#fff; border:1px solid rgba(226,194,117,0.3); font-size:13px;">
                    <select id="fam-gender-inp" style="flex:1; height:40px; padding:0 8px; border-radius:12px; background:#0d0a14; color:#fff; border:1px solid rgba(226,194,117,0.3); font-size:13px;">
                        <option value="woman">Женщина ♀️</option>
                        <option value="man">Мужчина ♂️</option>
                    </select>
                </div>
                <div style="display:flex; gap:8px;">
                    <input type="date" id="fam-date-inp" style="flex:1.2; height:40px; padding:0 10px; border-radius:12px; background:#0d0a14; color:#fff; border:1px solid rgba(226,194,117,0.3); font-size:13px;">
                    <input type="time" id="fam-time-inp" value="12:00" style="flex:0.8; height:40px; padding:0 10px; border-radius:12px; background:#0d0a14; color:#fff; border:1px solid rgba(226,194,117,0.3); font-size:13px;">
                </div>
                <div style="position:relative;">
                    <label style="color:#94a3b8; font-size:12px; display:block; margin-bottom:4px;">Город рождения:</label>
                    <input type="text" id="fam-city-input" placeholder="Начните вводить город..." autocomplete="off" style="height:40px; width:100%; box-sizing:border-box; padding:0 12px; border-radius:12px; background:#0d0a14; color:#fff; border:1px solid rgba(226,194,117,0.3); font-size:13px;">
                    <div id="fam-city-dropdown" style="display:none; position:absolute; width:100%; background:#161224; border:1px solid #e2c275; border-radius:12px; max-height:150px; overflow-y:auto; z-index:10002; top:100%;"></div>
                </div>
                <div style="color:#94a3b8; font-size:11px;">✨ Первые 2 человека — бесплатно. Расширение круга (3+ слот) — <b>5 💎</b></div>
                <button type="button" id="fam-add-btn" class="main-gold-btn" style="width:100%; padding:11px; font-size:13.5px; border-radius:12px;">➕ Добавить в Круг Близких</button>
            </div>
        `;
        familyBox.appendChild(card);

    
        const famSelect = document.getElementById('circle-selector');
        const actionRow = document.getElementById('fam-person-actions');
        const nameInp = document.getElementById('fam-name-inp');
        const genderSel = document.getElementById('fam-gender-inp');
        const dateInp = document.getElementById('fam-date-inp');
        const timeInp = document.getElementById('fam-time-inp');
        const cityInp = document.getElementById('fam-city-input');
        const dropBox = document.getElementById('fam-city-dropdown');

        const showToast = (msg) => {
            const t = document.createElement('div');
            t.style.cssText = 'position:fixed; bottom:85px; left:50%; transform:translateX(-50%); background:#161224; border:1px solid #e2c275; color:#ffe066; padding:10px 16px; border-radius:12px; font-size:13px; z-index:99999; box-shadow:0 4px 16px rgba(0,0,0,0.7); white-space:nowrap;';
            t.innerText = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2500);
        };

        const resolveCityCoords = async (cityName) => {
            if (cityInp.dataset.lat && cityInp.dataset.lon) return { lat: parseFloat(cityInp.dataset.lat), lon: parseFloat(cityInp.dataset.lon) };
            if (!cityName) return { lat: 55.7558, lon: 37.6173 };
            try {
                const res = await fetch(`/api/v1/cities/search?q=${encodeURIComponent(cityName)}`);
                const list = await res.json();
                if (Array.isArray(list) && list.length > 0) {
    const first = list.shift();
    return { lat: parseFloat(first.lat) || 55.7558, lon: parseFloat(first.lon) || 37.6173 };
}

            } catch (e) {}
            return { lat: 55.7558, lon: 37.6173 };
        };


        const saveCircleEverywhere = (arr) => {
            const raw = JSON.stringify(arr);
            localStorage.setItem('g_circle', raw);
            if (window.Telegram?.WebApp?.CloudStorage) {
                window.Telegram.WebApp.CloudStorage.setItem('g_circle', raw);
            }
        };

        const renderFamList = () => {
            const list = JSON.parse(localStorage.getItem('g_circle') || '[]');
            famSelect.innerHTML = '<option value="">➕ Добавить нового близкого</option>';
            list.forEach((p, i) => {
                const opt = document.createElement('option');
                opt.value = String(i); opt.textContent = `💞 ${p.name} (${p.city || 'Город не указан'})`;
                famSelect.appendChild(opt);
            });
        };
        renderFamList();

        let timer = null;
        cityInp.addEventListener('input', () => {
            delete cityInp.dataset.lat; delete cityInp.dataset.lon; clearTimeout(timer);
            const q = cityInp.value.trim();
            if (q.length < 2) { dropBox.style.display = 'none'; return; }
            timer = setTimeout(async () => {
                const res = await fetch(`/api/v1/cities/search?q=${encodeURIComponent(q)}`);
                const cities = await res.json();
                if (!Array.isArray(cities) || cities.length === 0) { dropBox.style.display = 'none'; return; }
                dropBox.innerHTML = cities.slice(0, 6).map(c => {
                    const cn = c.name || c.city || c.title || c.label || String(c);
                    return `<div class="fam-city-opt" data-name="${cn}" data-lat="${c.lat || ''}" data-lon="${c.lon || ''}" style="padding:8px 12px; color:#f3e8ff; font-size:13px; border-bottom:1px solid rgba(255,255,255,0.06); cursor:pointer;">${cn}</div>`;
                }).join('');
                dropBox.style.display = 'block';
                dropBox.querySelectorAll('.fam-city-opt').forEach(opt => opt.addEventListener('click', () => {
                    cityInp.value = opt.dataset.name; cityInp.dataset.lat = opt.dataset.lat; cityInp.dataset.lon = opt.dataset.lon; dropBox.style.display = 'none';
                }));
            }, 300);
        });

        famSelect.addEventListener('change', () => {
            if (famSelect.value === '') {
                actionRow.style.display = 'none'; nameInp.value = ''; dateInp.value = ''; timeInp.value = '12:00'; cityInp.value = '';
                delete cityInp.dataset.lat; delete cityInp.dataset.lon; return;
            }
            const idx = parseInt(famSelect.value, 10);
            const p = JSON.parse(localStorage.getItem('g_circle') || '[]').slice(idx, idx + 1).pop();
            if (!p) return;
            actionRow.style.display = 'flex';
            nameInp.value = p.name || ''; genderSel.value = p.gender || 'woman'; dateInp.value = p.date || ''; timeInp.value = p.time || '12:00';
            cityInp.value = (p.city && p.city !== 'Не указан') ? p.city : '';
            if (p.lat) cityInp.dataset.lat = p.lat; if (p.lon) cityInp.dataset.lon = p.lon;
        });

        document.getElementById('fam-add-btn').addEventListener('click', async () => {
            const pName = nameInp.value.trim(); const pDate = dateInp.value; const pCity = cityInp.value.trim();
            if (!pName || !pDate) { showToast('⚠️ Укажите имя и дату рождения'); return; }
            const list = JSON.parse(localStorage.getItem('g_circle') || '[]');
            const maxSlots = window.USER_CIRCLE_SLOTS || 2;
            if (list.length >= maxSlots) {

                const bal = window.USER_CRYSTALS || 0;
                if (bal < 5) { alert(`🔒 Бесплатно доступны 2 слота. Для 3-го нужно 5 💎 (у вас: ${bal} 💎).`); return; }
                if (!confirm('✨ Разблокировать 3-й слот в Круге Близких за 5 💎?')) return;
                const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
                const sp = await fetch('/api/v1/user/spend', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ user_id: window.getGrimoireUserId(), amount: 5, title: `Слот Круга (${pName})`, kind: 'oracle_buy' }) });
                if ((await sp.json()).status !== 'ok') { alert('Недостаточно кристаллов.'); return; }
                if (window.syncUserWallet) window.syncUserWallet();
            }
            const coords = await resolveCityCoords(pCity);
            list.push({ name: pName, gender: genderSel.value, date: pDate, time: timeInp.value || '12:00', city: pCity || 'Не указан', lat: coords.lat, lon: coords.lon });
            saveCircleEverywhere(list);

            nameInp.value = ''; dateInp.value = ''; timeInp.value = '12:00'; cityInp.value = ''; delete cityInp.dataset.lat; delete cityInp.dataset.lon;
            renderFamList(); if (window.refreshGrimoireSelectors) window.refreshGrimoireSelectors();
            showToast(`✨ ${pName} добавлен(а) в Круг Звёзд!`);
        });

        document.getElementById('fam-save-edit-btn').addEventListener('click', async () => {
            if (famSelect.value === '') return;
            const idx = parseInt(famSelect.value, 10);
            const list = JSON.parse(localStorage.getItem('g_circle') || '[]');
            const p = list.slice(idx, idx + 1).pop(); if (!p) return;
            const coords = await resolveCityCoords(cityInp.value.trim());
            p.name = nameInp.value.trim() || p.name; p.gender = genderSel.value; p.date = dateInp.value || p.date;
            p.time = timeInp.value || p.time; p.city = cityInp.value.trim() || 'Не указан'; p.lat = coords.lat; p.lon = coords.lon;
            saveCircleEverywhere(list);

            renderFamList(); famSelect.value = String(idx);
            if (window.refreshGrimoireSelectors) window.refreshGrimoireSelectors();
            showToast(`💾 Изменения для «${p.name}» сохранены!`);
        });

        document.getElementById('fam-del-one-btn').addEventListener('click', () => {
            if (famSelect.value === '') return;
            const idx = parseInt(famSelect.value, 10);
            const list = JSON.parse(localStorage.getItem('g_circle') || '[]');
            const removed = list.splice(idx, 1).pop();
            saveCircleEverywhere(list);

            actionRow.style.display = 'none'; nameInp.value = ''; dateInp.value = ''; cityInp.value = '';
            renderFamList(); if (window.refreshGrimoireSelectors) window.refreshGrimoireSelectors();
            showToast(`🗑️ «${removed?.name || 'Запись'}» удалена`);
        });

        clearFamBtn.addEventListener('click', () => {
            if (!confirm('Удалить всех людей из Круга Близких?')) return;
            saveCircleEverywhere([]);
localStorage.removeItem('family_cities_map');
            actionRow.style.display = 'none'; nameInp.value = ''; dateInp.value = ''; cityInp.value = '';
            renderFamList(); if (window.refreshGrimoireSelectors) window.refreshGrimoireSelectors();
            showToast('🗑️ Круг Близких полностью очищен');
        });
    }
};
injectFamilyCity();
new MutationObserver(injectFamilyCity).observe(document.body, { childList: true, subtree: true });


    // Авто-подстановка координат города и сохранение Личного профиля на сервер
        if (sealBtn && !sealBtn.dataset.serverBound) {
        sealBtn.dataset.serverBound = '1';
if (!document.getElementById('profile-notify-wrap')) {
    const notifyWrap = document.createElement('div');
    notifyWrap.id = 'profile-notify-wrap';
    notifyWrap.style.cssText = 'margin: 10px 0 12px 0; padding: 10px 12px; background: rgba(167, 139, 250, 0.06); border: 1px solid rgba(167, 139, 250, 0.25); border-radius: 12px; display: flex; justify-content: space-between; align-items: center; gap: 10px;';
    notifyWrap.innerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
            <input type="checkbox" id="profile-notify-enabled" checked style="width:16px; height:16px; accent-color:#e2c275; cursor:pointer;">
            <div>
                <div style="color: #e2c275; font-size: 12.5px; font-weight: bold;">🔔 Утренний Астро-компас</div>
                <div style="color: #94a3b8; font-size: 11px;">Во сколько присылать свиток дня</div>
            </div>
        </div>
        <input type="time" id="profile-notify-time" value="09:00" style="height: 36px; padding: 0 8px; background: #0d0a14; color: #ffe066; border: 1px solid rgba(226, 194, 117, 0.4); border-radius: 10px; font-size: 13px; font-weight: bold; outline: none;">
    `;
    sealBtn.parentNode.insertBefore(notifyWrap, sealBtn);

    const chk = document.getElementById('profile-notify-enabled');
    const inp = document.getElementById('profile-notify-time');
    chk.addEventListener('change', () => {
        inp.disabled = !chk.checked;
        inp.style.opacity = chk.checked ? '1' : '0.4';
    });

    const savedProf = JSON.parse(localStorage.getItem('astro_user_profile') || 'null');
    if (savedProf?.notify_time) {
        if (savedProf.notify_time === 'off') {
            chk.checked = false;
            inp.disabled = true;
            inp.style.opacity = '0.4';
        } else {
            inp.value = savedProf.notify_time;
        }
    }
}
        sealBtn.addEventListener('click', async (e) => {
            e.stopImmediatePropagation();
            e.preventDefault();

            const inputs = Array.from(personalBox.querySelectorAll('input'));
            const selectEl = personalBox.querySelector('select');
            const nameVal = inputs.find(i => i.placeholder?.toLowerCase().includes('имя') || i.id?.includes('name'))?.value?.trim() || '';
            const dateVal = inputs.find(i => i.type === 'date' || i.id?.includes('date'))?.value?.trim() || '';
            const timeVal = inputs.find(i => (i.type === 'time' || i.id?.includes('time')) && i.id !== 'profile-notify-time')?.value?.trim() || '12:00';
            const cityInp = inputs.find(i => i.placeholder?.toLowerCase().includes('город') || i.id?.includes('city'));
            const cityVal = cityInp?.value?.trim() || '';
            const genderVal = selectEl?.value || 'woman';

            const showMsg = (txt) => {
                const t = document.createElement('div');
                t.style.cssText = 'position:fixed; bottom:85px; left:50%; transform:translateX(-50%); background:#161224; border:1px solid #e2c275; color:#ffe066; padding:10px 16px; border-radius:12px; font-size:13px; z-index:99999; box-shadow:0 4px 16px rgba(0,0,0,0.7); white-space:nowrap;';
                t.innerText = txt;
                document.body.appendChild(t);
                setTimeout(() => t.remove(), 2500);
            };

            if (!dateVal || !cityVal) {
                showMsg('⚠️ Укажите дату и город рождения');
                return;
            }

            sealBtn.disabled = true;
            sealBtn.innerText = '⏳ Сохраняем в Гримуар...';

                        try {
                const prevProf = JSON.parse(localStorage.getItem('astro_user_profile') || 'null');
                let latVal = (prevProf && prevProf.city === cityVal && prevProf.lat) ? prevProf.lat : 55.75;
                let lonVal = (prevProf && prevProf.city === cityVal && prevProf.lon) ? prevProf.lon : 37.61;

                try {
                    const geoRes = await fetch(`/api/v1/cities/search?q=${encodeURIComponent(cityVal)}`);
                    if (geoRes.ok) {
                        const cities = await geoRes.json();
                        if (Array.isArray(cities) && cities.length > 0) {
                            latVal = cities.at(0)?.lat || latVal;
                            lonVal = cities.at(0)?.lon || lonVal;

                        }
                    }
                } catch (geoErr) {}

                const isNotifyOn = document.getElementById('profile-notify-enabled')?.checked ?? true;
                const notifyTime = isNotifyOn ? (document.getElementById('profile-notify-time')?.value || '09:00') : 'off';
                const tzOffset = -new Date().getTimezoneOffset() / 60;

                // Дублируем в память телефона для автоподстановки во вкладки
                localStorage.setItem('astro_user_profile', JSON.stringify({
                    name: nameVal, gender: genderVal, date: dateVal, time: timeVal, city: cityVal, lat: latVal, lon: lonVal,
                    notify_time: notifyTime, tz_offset: tzOffset
                }));

                const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
                const userId = window.getGrimoireUserId();
                const saveRes = await fetch('/api/v1/user/save-profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        user_id: userId,
                        first_name: nameVal || tgUser?.first_name || '',
                        gender: genderVal,
                        birth_date: dateVal,
                        birth_time: timeVal,
                        birth_city: cityVal,
                        notify_time: notifyTime,
                        tz_offset: tzOffset
                    })
                });
                if (!saveRes.ok) throw new Error('Save failed');

                sealBtn.innerText = '🔄 Обновить личные данные';
                showMsg('✨ Личные данные сохранены на сервере!');
            } catch (err) {
                sealBtn.innerText = '💾 Запечатать Свиток Данных';
                showMsg('❌ Ошибка связи с сервером');
            } finally {
                sealBtn.disabled = false;
            }

        }, true);
    }


    window.syncUserWallet();
    showProfileGrid();
    // Отключаем старую проверку координат из main.js, так как profile_tiles.js сам сохраняет профиль и координаты
    window.saveGrimoireProfile = function() {
      return true;
};

});
