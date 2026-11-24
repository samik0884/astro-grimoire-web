document.addEventListener('DOMContentLoaded', () => {
    const BOT_USER = 'yznaigoroskop_bot';
    const BOT_LINK = ['https:/', 't.me', BOT_USER].join('/');
    const BOT_APP_LINK = BOT_LINK + '/app';


        async function saveSharePayload(kind, obj, svgId) {
        let img_b64 = '';
        try {
            const svgEl = svgId ? document.getElementById(svgId)?.querySelector('svg') : null;
            if (svgEl) {
                const clone = svgEl.cloneNode(true);
                clone.setAttribute('xmlns', ['http:/', 'www.w3.org', '2000', 'svg'].join('/'));
                clone.querySelector('defs')?.remove();
                clone.setAttribute('width', '550'); clone.setAttribute('height', '550');
                const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));

                img_b64 = await new Promise((resolve) => {
                    const im = new Image();
                    im.onload = () => {
                        const c = document.createElement('canvas'); c.width = 550; c.height = 550;
                        c.getContext('2d').drawImage(im, 0, 0, 550, 550);
                        resolve(c.toDataURL('image/png'));
                    };
                    im.onerror = () => resolve('');
                    im.src = svgUrl;
                });
            }
        } catch (e) {}
        try {
            const r = await fetch('/api/v1/share/save', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ kind, data: obj, img_b64 })
            });
            const res = await r.json();
            return res.code || '';
        } catch (e) { return ''; }
    }


    const startParam = window.Telegram?.WebApp?.initDataUnsafe?.start_param || new URLSearchParams(window.location.search).get('tgWebAppStartParam') || new URLSearchParams(window.location.search).get('startapp');
    if (startParam && startParam.includes('_')) {
        fetch('/api/v1/share/get?code=' + encodeURIComponent(startParam)).then(r => r.json()).then(res => {
            const { kind, data } = res;
            if (!kind || !data || Object.keys(data).length === 0) return;
            setTimeout(() => {
                document.getElementById('book-cover')?.classList.add('opened');

                document.querySelector('.nav-btn[data-screen="screen-astroprocessor"]')?.click();
                setTimeout(() => {
                    const setVal = (id, v) => { const el = document.getElementById(id); if (el && v !== undefined) el.value = v; };
                    if (kind === 'syn' && data.ad && data.bd) {
                        document.querySelector('#screen-astroprocessor .sub-tab-btn[data-subtab="synastry"]')?.click();
                        setVal('syna-a-date', data.ad); setVal('syna-a-time', data.at || '12:00');
                        setVal('syna-a-lat', data.alat || 55.7558); setVal('syna-a-lon', data.alon || 37.6173);
                        setVal('syna-b-date', data.bd); setVal('syna-b-time', data.bt || '12:00');
                        setVal('syna-b-lat', data.blat || 55.7558); setVal('syna-b-lon', data.blon || 37.6173);
                        setTimeout(() => window.executeGrimoireSynastryScan?.(), 300);
                    } else if (kind === 'sol' && data.d) {
                        document.querySelector('#screen-astroprocessor .sub-tab-btn[data-subtab="solar"]')?.click();
                        setVal('solar-date', data.d); setVal('solar-time', data.t || '12:00');
                        setVal('solar-year', data.y || new Date().getFullYear()); setVal('solar-gender', data.g || 'woman');
                        setTimeout(() => document.querySelector('#solar-form button[type="submit"]')?.click(), 300);
                    } else if (kind === 'nat' && data.d) {
                        document.querySelector('#screen-astroprocessor .sub-tab-btn[data-subtab="natal"]')?.click();
                        setVal('natal-date', data.d); setVal('natal-time', data.t || '12:00');
                        setVal('natal-lat', data.lat || 55.7558); setVal('natal-lon', data.lon || 37.6173);
                        setTimeout(() => document.querySelector('#natal-form button[type="submit"]')?.click(), 300);
                    } else if (kind === 'mat' && data.d) {
                        document.querySelector('#screen-astroprocessor .sub-tab-btn[data-subtab="matrix"]')?.click();
                        setVal('matrix-date', data.d);
                        setTimeout(() => document.getElementById('btn-calc-matrix')?.click(), 300);
                    } else if (kind === 'trn' && data.nd) {
                        document.querySelector('#screen-astroprocessor .sub-tab-btn[data-subtab="transit"]')?.click();
                        setVal('transit-birth-date', data.nd); setVal('transit-birth-time', data.nt || '12:00');
                        setVal('transit-date', data.td || new Date().toISOString().split('T').at(0));
                        setVal('transit-lat', data.lat || 55.7558); setVal('transit-lon', data.lon || 37.6173);
                        setTimeout(() => window.executeGrimoireTransitScan?.(), 300);
                    }
                }, 250);
            }, 600);
        }).catch(() => {});
    }

        
    

    function shareSvgAsCard(svgContainerId, cardTitle, cardSub, shareText, deepLink) {
        const svgEl = document.getElementById(svgContainerId)?.querySelector('svg');
        if (!svgEl) { alert('Сначала выполните расчёт, чтобы сформировать схему!'); return; }

        const tgShareUrl = ['https:/', 't.me', 'share', 'url?url='].join('/') +
            encodeURIComponent(deepLink || BOT_APP_LINK) +
            '&text=' + encodeURIComponent(shareText);

        if (window.Telegram?.WebApp?.openTelegramLink) {
            window.Telegram.WebApp.openTelegramLink(tgShareUrl);
            return;
        }



        const clone = svgEl.cloneNode(true);
        clone.setAttribute('width', '540');
        clone.setAttribute('height', '540');
        const svgUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = 720; canvas.height = 920;
            const ctx = canvas.getContext('2d');

            const grad = ctx.createLinearGradient(0, 0, 720, 920);
            grad.addColorStop(0, '#161224'); grad.addColorStop(1, '#090710');
            ctx.fillStyle = grad; ctx.fillRect(0, 0, 720, 920);

            ctx.strokeStyle = '#e2c275'; ctx.lineWidth = 4;
            ctx.strokeRect(26, 26, 668, 868);

            ctx.fillStyle = '#ffe066'; ctx.font = 'bold 32px Georgia, serif'; ctx.textAlign = 'center';
            ctx.fillText(cardTitle, 360, 95);
            ctx.fillStyle = '#a78bfa'; ctx.font = '21px sans-serif';
            ctx.fillText(cardSub, 360, 138);

            ctx.drawImage(img, 90, 175, 540, 540);

            ctx.fillStyle = '#cbd5e1'; ctx.font = '20px sans-serif';
            ctx.fillText('Нажми на ссылку в сообщении, чтобы открыть расчёт:', 360, 785);
            ctx.fillStyle = '#ffe066'; ctx.font = 'bold 23px sans-serif';
            ctx.fillText('Книга Теней и Звёзд • @' + BOT_USER, 360, 845);

            canvas.toBlob(async (blob) => {
                const fullMsg = shareText + '\n\n🔮 Открыть расчёт в боте: ' + deepLink;
                try {
                    const file = new File([blob], 'grimoire_chart.png', { type: 'image/png' });
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share({ files: [file], title: cardTitle, text: fullMsg });
                        return;
                    }
                } catch (e) {}

                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'grimoire_chart.png';
                a.click();
                window.open(tgShareUrl, '_blank');
            });


        };
        img.src = svgUrl;
    }

    function makeShareBtn(id, label, onClick) {
        const btn = document.createElement('button');
        btn.id = id; btn.type = 'button';
        btn.style.cssText = 'width: 100%; margin-top: 10px; padding: 11px; border-radius: 12px; background: rgba(226, 194, 117, 0.1); border: 1px solid rgba(226, 194, 117, 0.38); color: #ffe066; font-weight: bold; font-size: 13px; cursor: pointer;';
        btn.innerText = label;
        btn.onclick = onClick;
        return btn;
    }

    const synPdfBtn = document.getElementById('synastry-pdf-download-btn');
    if (synPdfBtn && !document.getElementById('share-synastry-btn')) {
        synPdfBtn.parentNode.appendChild(makeShareBtn('share-synastry-btn', '📸 Поделиться картой совместимости', async () => {
            const code = await saveSharePayload('syn', {
                ad: document.getElementById('syna-a-date')?.value, at: document.getElementById('syna-a-time')?.value,
                alat: document.getElementById('syna-a-lat')?.value, alon: document.getElementById('syna-a-lon')?.value,
                bd: document.getElementById('syna-b-date')?.value, bt: document.getElementById('syna-b-time')?.value,
                blat: document.getElementById('syna-b-lat')?.value, blon: document.getElementById('syna-b-lon')?.value
}, 'synastry-svg-container');

            
            const link = code ? (BOT_APP_LINK + '?startapp=' + code) : BOT_LINK;
            const d1 = document.getElementById('syna-a-date')?.value || '';
            const d2 = document.getElementById('syna-b-date')?.value || '';
            shareSvgAsCard('synastry-svg-container', '💖 КАРТА СОВМЕСТИМОСТИ', d1 + '  ✦  ' + d2, '💖 Смотри нашу карту совместимости в Книге Теней и Звёзд!', link);
        }));
    }

    const natPdfBtn = document.getElementById('full-natal-pdf-btn');
    if (natPdfBtn && !document.getElementById('share-natal-btn')) {
        natPdfBtn.parentNode.appendChild(makeShareBtn('share-natal-btn', '📸 Поделиться натальной картой', async () => {
            const code = await saveSharePayload('nat', {
                d: document.getElementById('natal-date')?.value, t: document.getElementById('natal-time')?.value,
                lat: document.getElementById('natal-lat')?.value, lon: document.getElementById('natal-lon')?.value
}, 'natal-svg-container');

            
            const link = code ? (BOT_APP_LINK + '?startapp=' + code) : BOT_LINK;
            const dStr = document.getElementById('natal-date')?.value || '';
            shareSvgAsCard('natal-svg-container', '🪐 НАТАЛЬНАЯ КАРТА РОЖДЕНИЯ', 'Космический радикс • ' + dStr, '🪐 Моя натальная карта в Книге Теней и Звёзд!', link);
        }));
    }

    const matContainer = document.getElementById('matrix-svg-container');
    if (matContainer && !document.getElementById('share-matrix-btn')) {
        matContainer.parentNode.appendChild(makeShareBtn('share-matrix-btn', '📸 Поделиться Матрицей Судьбы', async () => {
            const dStr = document.getElementById('matrix-date')?.value || '';
            const code = await saveSharePayload('mat', { d: dStr }, 'matrix-svg-container');

            const link = code ? (BOT_APP_LINK + '?startapp=' + code) : BOT_LINK;
            shareSvgAsCard('matrix-svg-container', '⚜️ МАТРИЦА СУДЬБЫ', 'Код Души • ' + dStr, '⚜️ Моя Матрица Судьбы в Книге Теней и Звёзд!', link);
        }));
    }

        // Транзиты: динамический выбор года для Годового PDF-Планера (текущий или следующий) + кнопка репоста
    const trnPdfBtn = document.getElementById('transits-pdf-btn');
    if (trnPdfBtn && !document.getElementById('transit-pdf-year-sel')) {
        const curY = new Date().getFullYear();
        const nextY = curY + 1;

        const yearWrap = document.createElement('div');
        yearWrap.style.cssText = 'display: flex; align-items: center; justify-content: space-between; gap: 10px; background: rgba(16, 185, 129, 0.06); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 12px; padding: 8px 12px; margin-top: 10px;';
        yearWrap.innerHTML = [
            '<span style="color: #cbd5e1; font-size: 12.5px;">📅 Год для PDF-Планера:</span>',
            '<select id="transit-pdf-year-sel" style="background: #0d0a14; color: #ffe066; border: 1px solid rgba(226,194,117,0.35); border-radius: 8px; padding: 5px 10px; font-weight: bold; font-size: 13px;">',
            '<option value="' + nextY + '" selected>' + nextY + ' год (следующий)</option>',
            '<option value="' + curY + '">' + curY + ' год (текущий)</option>',
            '</select>'
        ].join('');

        trnPdfBtn.parentNode.insertBefore(yearWrap, trnPdfBtn);
        trnPdfBtn.style.marginTop = '8px';
        trnPdfBtn.innerText = '📅 Скачать Годовой Астро-Планер (PDF)';

        if (!document.getElementById('share-transit-btn')) {
            trnPdfBtn.parentNode.appendChild(makeShareBtn('share-transit-btn', '📸 Поделиться картой транзитов', async () => {
                const code = await saveSharePayload('trn', {
                    nd: document.getElementById('transit-birth-date')?.value,
                    nt: document.getElementById('transit-birth-time')?.value,
                    td: document.getElementById('transit-date')?.value,
                    lat: document.getElementById('transit-lat')?.value,
                    lon: document.getElementById('transit-lon')?.value
}, 'transit-svg-container');

                
                const link = code ? (BOT_APP_LINK + '?startapp=' + code) : BOT_LINK;
                const tDate = document.getElementById('transit-date')?.value || '';
                shareSvgAsCard('transit-svg-container', '⚡ КОСМИЧЕСКИЕ ТРАНЗИТЫ', 'Погода неба • ' + tDate, '⚡ Мои космические транзиты на ' + tDate + ' в Книге Теней и Звёзд!', link);
            }));
        }

    }


    setInterval(() => {
        const core = document.getElementById('my-day-core');
        const adSlot = document.getElementById('myday-bottom-ad-slot');
        if (!core || core.children.length === 0 || document.getElementById('share-myday-btn')) return;

        const btn = makeShareBtn('share-myday-btn', '📸 Поделиться прогнозом дня', () => {
            const shareTxt = '✨ Мой космический прогноз на сегодня! Проверь свой в Книге Теней и Звёзд:';
            const tgShareUrl = ['https:/', 't.me', 'share', 'url?url='].join('/') + encodeURIComponent(BOT_LINK) + '&text=' + encodeURIComponent(shareTxt);

            if (window.Telegram?.WebApp?.openTelegramLink) {
                window.Telegram.WebApp.openTelegramLink(tgShareUrl);
                return;
            }

            const canvas = document.createElement('canvas');
            canvas.width = 720; canvas.height = 860;
            const ctx = canvas.getContext('2d');
            const grad = ctx.createLinearGradient(0, 0, 720, 860);
            grad.addColorStop(0, '#161224'); grad.addColorStop(1, '#090710');
            ctx.fillStyle = grad; ctx.fillRect(0, 0, 720, 860);
            ctx.strokeStyle = '#e2c275'; ctx.lineWidth = 4; ctx.strokeRect(26, 26, 668, 808);

            ctx.fillStyle = '#ffe066'; ctx.font = 'bold 34px Georgia, serif'; ctx.textAlign = 'center';
            ctx.fillText('✨ МОЙ КОСМИЧЕСКИЙ ДЕНЬ ✨', 360, 105);
            ctx.fillStyle = '#a78bfa'; ctx.font = '23px sans-serif';
            ctx.fillText(new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }), 360, 150);

            const duo = document.getElementById('myday-totem-duo');
            ctx.fillStyle = '#f3e8ff'; ctx.font = 'bold 22px sans-serif';
            const duoTxt = duo ? duo.innerText.split('\n').filter(Boolean).join('  •  ') : 'Личный гороскоп и биоритмы';
            ctx.fillText(duoTxt.slice(0, 48), 360, 240);

            const ind = document.getElementById('myday-mini-indicators');
            ctx.fillStyle = '#10b981'; ctx.font = '21px sans-serif';
            const indTxt = ind ? ind.innerText.split('\n').filter(Boolean).join('  |  ') : '';
            ctx.fillText(indTxt.slice(0, 52), 360, 310);

            ctx.fillStyle = '#cbd5e1'; ctx.font = '22px sans-serif';
            ctx.fillText('Узнай свой личный прогноз, биоритмы', 360, 460);
            ctx.fillText('и совместимость в Книге Теней и Звёзд:', 360, 495);
            ctx.fillStyle = '#ffe066'; ctx.font = 'bold 26px sans-serif';
            ctx.fillText('t.me/' + BOT_USER, 360, 560);
            ctx.fillStyle = '#94a3b8'; ctx.font = '20px sans-serif';
            ctx.fillText('Книга Теней и Звёзд • @' + BOT_USER, 360, 790);

            canvas.toBlob(async (blob) => {
                
                try {
                    const file = new File([blob], 'my_day_grimoire.png', { type: 'image/png' });
                    if (navigator.canShare && navigator.canShare({ files: [file] })) {
                        await navigator.share({ files: [file], title: 'Мой Космический День', text: shareTxt + ' ' + BOT_LINK });
                        return;
                    }
                } catch (e) {}

                const a = document.createElement('a');
                a.href = URL.createObjectURL(blob);
                a.download = 'my_day_grimoire.png';
                a.click();
                window.open(tgShareUrl, '_blank');
            });

        });
        if (adSlot) core.insertBefore(btn, adSlot);
        else core.appendChild(btn);
    }, 1200);

    // 1. Красивый стиль кнопки PDF в Синастрии (как в Натальной карте)
    const synDlBtn = document.getElementById('synastry-pdf-download-btn');
    if (synDlBtn) {
        synDlBtn.style.cssText = 'width:100%; margin-top:12px; padding:13px 16px; border-radius:14px; background:linear-gradient(145deg, rgba(22,18,36,0.95), rgba(13,10,20,0.98)); border:1px solid rgba(226,194,117,0.55); color:#ffe066; font-weight:bold; font-size:13.5px; letter-spacing:0.3px; cursor:pointer; box-shadow:0 4px 16px rgba(226,194,117,0.12);';
        synDlBtn.innerHTML = '💖 Скачать Полный Манускрипт Синастрии (PDF)';
    }

    // 2. Фикс выбора тарифа PDF в Матрице Судьбы (сбрасываем старый выбор при открытии раздела)
    const matrixScreenBtn = document.querySelector('#screen-astroprocessor .sub-tab-btn[data-subtab="matrix"]');
    if (matrixScreenBtn) {
        matrixScreenBtn.addEventListener('click', () => {
            window.currentMatrixPdfTier = 'full';
            localStorage.removeItem('selected_matrix_tier');
        });
    }

    // 3. Делаем Соляр наглядным и полноценным
    const solarForm = document.querySelector('#solar-tool form') || document.getElementById('solar-tool');
    if (solarForm) {
        const solarBtn = Array.from(solarForm.querySelectorAll('button')).find(b => b.textContent.includes('Рассчитать'));
        if (solarBtn) {
            solarBtn.addEventListener('click', () => {
                setTimeout(() => {
                    const sheet = document.getElementById('magic-bottom-sheet');
                    const sheetBody = document.getElementById('sheet-text');
                    if (sheet && !sheet.classList.contains('hidden') && sheetBody) {
                        const yVal = document.getElementById('solar-year')?.value || new Date().getFullYear();
                        sheetBody.innerHTML += [
                            '<div style="margin-top:12px; padding-top:10px; border-top:1px solid rgba(226,194,117,0.2); color:#cbd5e1; font-size:13px; line-height:1.5;">',
                            '<p style="margin:0 0 8px 0;">☀️ <b>Главный фокус ' + yVal + ' года:</b> Перезагрузка личных целей (1-й дом Соляра) и укрепление социального статуса (МС).</p>',
                            '<p style="margin:0; color:#ffe066;">✨ <b>Ключ успеха:</b> В первые 12 дней после дня рождения закладывайте фундамент главных проектов года — каждый день символизирует один из 12 месяцев.</p>',
                            '</div>'
                        ].join('');
                    }
                }, 400);
            });
        }
    }


});
