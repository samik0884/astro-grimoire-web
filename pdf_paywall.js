document.addEventListener('DOMContentLoaded', () => {
    const pdfCatalog = [
        { match: 'natal', subtab: 'natal', baseCost: 85, saleCost: 60, title: 'Полный Натальный Манускрипт' },
        { match: 'finance', subtab: 'finance-tool', baseCost: 85, saleCost: 60, title: 'Финансовый Код Капитала' },
        { match: 'synastry', subtab: 'synastry', baseCost: 75, saleCost: 50, title: 'Книга Совместимости (Синастрия)' },
        { match: 'solar', subtab: 'solar', baseCost: 70, saleCost: 45, title: 'Персональный Соляр на год' },
        { match: 'transit', subtab: 'transit', baseCost: 70, saleCost: 45, title: 'Годовой Астро-Планер (Транзиты)' },
        { match: 'karma', subtab: 'karma-tool', baseCost: 70, saleCost: 45, title: 'Кармический Паспорт Души' },
        { match: 'matrix', subtab: 'matrix', baseCost: 55, saleCost: 30, title: 'Матрица Судьбы (PDF)' },
        { match: 'kids', subtab: 'kids-tool', baseCost: 55, saleCost: 30, title: 'Детский Астро-Путеводитель' }
    ];

    window.getDailyPromoItem = function() {
        const uid = window.getGrimoireUserId ? window.getGrimoireUserId() : 0;
        const now = new Date();
        const dateKey = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
        const seedStr = String(uid) + '_' + dateKey;
        let h = 0;
        for (let i = 0; i < seedStr.length; i++) {
            h = (Math.imul(31, h) + seedStr.charCodeAt(i)) | 0;
        }
        const idx = Math.abs(h) % pdfCatalog.length;
        return pdfCatalog.at(idx);
    };

    function getTimeLeftToMidnight() {
        const now = new Date();
        const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
        const diff = Math.max(0, Math.floor((end - now) / 1000));
        const hh = String(Math.floor(diff / 3600)).padStart(2, '0');
        const mm = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
        const ss = String(diff % 60).padStart(2, '0');
        return hh + ':' + mm + ':' + ss;
    }

    // Плашка «Акция Дня» с живым таймером на экране «Мой День» и подсветка акционной кнопки PDF
    function renderDailyPromoBanner() {
        const promo = window.getDailyPromoItem();
        const discount = promo.baseCost - promo.saleCost;

        // 1. Вставляем карточку акции в «Мой День»
        const core = document.getElementById('my-day-core');
        if (core && core.children.length > 0 && !document.getElementById('myday-daily-promo-card')) {
            const card = document.createElement('div');
            card.id = 'myday-daily-promo-card';
            card.style.cssText = 'margin: 12px 0; padding: 13px 14px; border-radius: 14px; background: linear-gradient(135deg, rgba(226,194,117,0.16), rgba(108,92,231,0.18)); border: 1px solid rgba(226,194,117,0.55); box-shadow: 0 4px 18px rgba(226,194,117,0.12);';
            card.innerHTML = [
                '<div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:6px;">',
                '<span style="color:#ffe066; font-weight:bold; font-size:12.5px; letter-spacing:0.3px;">🎁 БЛАГОСЛОВЕНИЕ ЗВЁЗД ДНЯ</span>',
                '<span id="daily-promo-timer" style="background:rgba(13,10,20,0.75); border:1px solid rgba(226,194,117,0.35); color:#10b981; font-family:monospace; font-size:11.5px; font-weight:bold; padding:2px 8px; border-radius:8px;">⏳ ' + getTimeLeftToMidnight() + '</span>',
                '</div>',
                '<div style="color:#f3e8ff; font-size:13px; line-height:1.4; margin-bottom:10px;">Только сегодня скидка <b style="color:#10b981;">-' + discount + ' 💎</b> на <b>«' + promo.title + '»</b>: <span style="text-decoration:line-through; color:#94a3b8;">' + promo.baseCost + ' 💎</span> <b style="color:#ffe066;">' + promo.saleCost + ' 💎</b></div>',
                '<button type="button" id="go-daily-promo-btn" style="width:100%; padding:9px; border-radius:10px; background:linear-gradient(180deg, #e2c275, #b3934b); color:#121019; border:none; font-weight:bold; font-size:12.5px; cursor:pointer;">✨ Перейти к свитку со скидкой →</button>'
            ].join('');

            const adSlot = document.getElementById('myday-bottom-ad-slot');
            if (adSlot) core.insertBefore(card, adSlot);
            else core.appendChild(card);

            document.getElementById('go-daily-promo-btn').onclick = () => {
                document.querySelector('.nav-btn[data-screen="screen-astroprocessor"]')?.click();
                setTimeout(() => {
                    document.querySelector('#screen-astroprocessor .sub-tab-btn[data-subtab="' + promo.subtab + '"]')?.click();
                }, 80);
            };
        }

        const timerEl = document.getElementById('daily-promo-timer');
        if (timerEl) timerEl.innerText = '⏳ ' + getTimeLeftToMidnight();

        // 2. Помечаем саму кнопку скачивания акционного PDF
        document.querySelectorAll('button').forEach(btn => {
            const bid = (btn.id || '').toLowerCase();
            const btxt = (btn.textContent || '').toLowerCase();
            if ((bid.includes('pdf') || btxt.includes('pdf')) && (bid.includes(promo.match) || btxt.includes(promo.match))) {
                if (!btn.dataset.promoMarked) {
                    btn.dataset.promoMarked = '1';
                    btn.innerHTML += ' <span style="display:inline-block; white-space:nowrap; margin-left:6px; background:#10b981; color:#090710; padding:2px 8px; border-radius:8px; font-size:11px; font-weight:bold;">🔥 -' + discount + ' 💎</span>';

                }
            }
        });
    }

    setInterval(renderDailyPromoBanner, 1000);

    window.PENDING_PDF_PAYMENT = null;
    let authorizedBtn = null;

    const origFetch = window.fetch;
    window.fetch = async function(resource, options) {
        const urlStr = typeof resource === 'string' ? resource : (resource?.url || '');
        if (urlStr.includes('/download-pdf') && window.PENDING_PDF_PAYMENT && options?.body) {
            try {
                const bodyObj = JSON.parse(options.body);
                Object.assign(bodyObj, window.PENDING_PDF_PAYMENT);
                options = { ...options, body: JSON.stringify(bodyObj) };
            } catch (e) {}

            const response = await origFetch.call(this, resource, options);
            window.PENDING_PDF_PAYMENT = null;

            if (response.ok) {
                setTimeout(() => {
                    if (window.syncUserWallet) window.syncUserWallet();
                }, 400);
            }
            return response;
        }
        return origFetch.call(this, resource, options);
    };

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        if (authorizedBtn === btn) {
            authorizedBtn = null;
            return;
        }

        const btnId = (btn.id || '').toLowerCase();
        const btnText = (btn.textContent || '').toLowerCase();
        if (!btnId.includes('pdf') && !btnText.includes('pdf')) return;
        if (btnText.includes('рассчитать') || btnText.includes('сонастройка')) return;

        const item = pdfCatalog.find(p => btnId.includes(p.match) || btnText.includes(p.match))
            || { match: 'other', baseCost: 60, saleCost: 40, title: 'Астрологический PDF-Манускрипт' };

        const promoToday = window.getDailyPromoItem();
        const isPromo = (promoToday.match === item.match);
        const finalCost = isPromo ? item.saleCost : item.baseCost;

        e.stopImmediatePropagation();
        e.preventDefault();

        const userId = window.getGrimoireUserId();
        const currentBal = window.USER_CRYSTALS ?? 0;

        if (currentBal < finalCost) {
            const promoHint = isPromo ? ` (Акция дня: ${item.saleCost} 💎 вместо ${item.baseCost} 💎!)` : '';
            const goShop = confirm(
                `🔒 Для открытия «${item.title}» нужно ${finalCost} 💎${promoHint} (у вас: ${currentBal} 💎).\n\nПерейти в Магазин Энергии для пополнения?`
            );
            if (goShop) {
                const profNav = Array.from(document.querySelectorAll('.nav-btn, [data-screen]')).find(b => b.textContent.includes('Профиль'));
                if (profNav) profNav.click();
            }
            return;
        }

        const priceLabel = isPromo
            ? `${finalCost} 💎 (🔥 Акция дня вместо ${item.baseCost} 💎!)`
            : `${finalCost} 💎`;

        const ok = confirm(`📜 Открыть и скачать «${item.title}» за ${priceLabel}?\n(Списание произойдёт после готовности книги. Баланс: ${currentBal} 💎)`);
        if (!ok) return;

        window.PENDING_PDF_PAYMENT = {
            user_id: userId,
            cost: finalCost,
            title: item.title
        };

        authorizedBtn = btn;
        btn.click();
    }, true);
});
