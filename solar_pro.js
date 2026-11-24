document.addEventListener('DOMContentLoaded', () => {
    const solarForm = document.getElementById('solar-form');
    if (!solarForm) return;

    const yearInp = document.getElementById('solar-year');
    if (yearInp && !yearInp.value) {
        yearInp.value = String(new Date().getFullYear());
    }

    const submitBtn = solarForm.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.className = 'main-gold-btn';
        submitBtn.style.marginTop = '12px';
        submitBtn.innerText = '☀️ Рассчитать Солярный Год';
    }

    if (!document.getElementById('solar-gender')) {
        const gDiv = document.createElement('div');
        gDiv.className = 'form-group';
        gDiv.innerHTML = '<label for="solar-gender">Ваш пол:</label><select id="solar-gender"><option value="woman">Женщина ♀️</option><option value="man">Мужчина ♂️</option></select>';
        solarForm.insertBefore(gDiv, submitBtn);
    }

    const viewport = document.createElement('div');
    viewport.id = 'solar-pro-viewport';
    viewport.style.display = 'none';
    solarForm.parentNode.insertBefore(viewport, solarForm.nextSibling);

    function openScroll(title, html) {
        const modal = document.getElementById('magic-bottom-sheet');
        if (modal) {
            document.getElementById('sheet-title').innerText = title;
            document.getElementById('sheet-text').innerHTML = html;
            modal.classList.remove('hidden');
            modal.classList.add('active');
            modal.style.display = 'flex';
        }
    }

    function unlockSolarChapter(key, badgeEl, onReady) {
        if (window.USER_AD_FREE || window['solarUnlocked_' + key]) {
            window['solarUnlocked_' + key] = true;
            onReady();
            return;
        }
        const ov = document.createElement('div');
        ov.style.cssText = 'position:fixed;inset:0;background:rgba(9,7,16,0.95);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;text-align:center;';
        ov.innerHTML = '<div style="color:#ffe066;font-size:18px;font-weight:bold;margin-bottom:10px;">🎬 Сакральный Эфир Спонсора</div><p style="color:#cbd5e1;font-size:13.5px;">Глава Соляра откроется через <b id="sol-ad-sec" style="color:#10b981;">3</b> сек...</p>';
        document.body.appendChild(ov);
        let s = 3;
        const t = setInterval(() => {
            s -= 1;
            const el = document.getElementById('sol-ad-sec');
            if (el) el.innerText = String(Math.max(0, s));
            if (s <= 0) {
                clearInterval(t);
                ov.remove();
                window['solarUnlocked_' + key] = true;
                badgeEl.innerText = 'ОТКРЫТО';
                badgeEl.style.color = '#10b981';
                badgeEl.style.borderColor = '#10b981';
                onReady();
            }
        }, 1000);
    }
    function buildSolarSvg(signs, yr) {
        return [
            '<svg viewBox="0 0 320 270" style="width:100%; max-width:320px; margin:0 auto; display:block;">',
            '<circle cx="160" cy="135" r="102" fill="none" stroke="rgba(226,194,117,0.22)" stroke-width="1.5" stroke-dasharray="4 4"/>',
            '<circle cx="160" cy="135" r="66" fill="rgba(226,194,117,0.04)" stroke="rgba(167,139,250,0.3)" stroke-width="1.2"/>',
            '<line x1="160" y1="33" x2="160" y2="237" stroke="rgba(226,194,117,0.35)" stroke-width="1.2"/>',
            '<line x1="58" y1="135" x2="262" y2="135" stroke="rgba(167,139,250,0.35)" stroke-width="1.2"/>',
            '<g style="cursor:pointer;" onclick="window.showSacredNodeInfo(\'☀️ Солнце Соляра (' + signs.sun + '): Главный фокус энергии на ' + yr + ' год.\')">',
            '<circle cx="160" cy="135" r="32" fill="#0d0a14" stroke="#ffe066" stroke-width="2"/>',
            '<text x="160" y="132" fill="#ffe066" font-size="11.5" font-weight="bold" text-anchor="middle">☀️ ' + yr + '</text>',
            '<text x="160" y="148" fill="#e2c275" font-size="9.5" text-anchor="middle">' + signs.sun + '</text></g>',
            '<g style="cursor:pointer;" onclick="window.showSacredNodeInfo(\'🏔️ МС Соляра (' + signs.mc + '): Главные цели, карьера и достижения года.\')">',
            '<circle cx="160" cy="33" r="17" fill="#161224" stroke="#ffe066" stroke-width="1.5"/>',
            '<text x="160" y="37" fill="#ffe066" font-size="10" font-weight="bold" text-anchor="middle">MC</text>',
            '<text x="160" y="12" fill="#ffe066" font-size="10.5" font-weight="bold" text-anchor="middle">МС: ' + signs.mc + '</text></g>',
            '<g style="cursor:pointer;" onclick="window.showSacredNodeInfo(\'🌅 Асцендент Соляра (' + signs.asc + '): Личный вектор и сценарий года.\')">',
            '<circle cx="58" cy="135" r="17" fill="#161224" stroke="#a78bfa" stroke-width="1.5"/>',
            '<text x="58" y="139" fill="#a78bfa" font-size="10" font-weight="bold" text-anchor="middle">Asc</text>',
            '<text x="58" y="112" fill="#c4b5fd" font-size="10.5" font-weight="bold" text-anchor="middle">Asc: ' + signs.asc + '</text></g>',
            '<g style="cursor:pointer;" onclick="window.showSacredNodeInfo(\'💞 Венера Соляра (' + signs.venus + '): Любовь и денежный магнит года.\')">',
            '<circle cx="262" cy="135" r="17" fill="#161224" stroke="#f472b6" stroke-width="1.5"/>',
            '<text x="262" y="139" fill="#f472b6" font-size="12" text-anchor="middle">♀</text>',
            '<text x="262" y="112" fill="#f9a8d4" font-size="10.5" text-anchor="middle">' + signs.venus + '</text></g>',
            '<g style="cursor:pointer;" onclick="window.showSacredNodeInfo(\'🌙 Луна Соляра (' + signs.moon + '): Семья, дом и эмоциональный баланс года.\')">',
            '<circle cx="160" cy="237" r="17" fill="#161224" stroke="#38bdf8" stroke-width="1.5"/>',
            '<text x="160" y="241" fill="#38bdf8" font-size="12" text-anchor="middle">☽</text>',
            '<text x="160" y="266" fill="#7dd3fc" font-size="10.5" text-anchor="middle">Луна: ' + signs.moon + '</text></g>',
            '</svg>'
        ].join('');
    }

    solarForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        e.stopImmediatePropagation();

        const bDate = document.getElementById('solar-date')?.value;
        const bTime = document.getElementById('solar-time')?.value || '12:00';
        const gender = document.getElementById('solar-gender')?.value || 'woman';
        const yr = parseInt(document.getElementById('solar-year')?.value || new Date().getFullYear(), 10);
        if (!bDate) { alert('Укажите дату рождения!'); return; }

        submitBtn.disabled = true;
        submitBtn.innerText = '⏳ Построение Солярного Колеса...';

        try {
            let lat = parseFloat(document.getElementById('solar-lat')?.value) || 55.7558;
            let lon = parseFloat(document.getElementById('solar-lon')?.value) || 37.6173;
            const cityTxt = document.getElementById('solar-city')?.value?.trim();
            if (cityTxt) {
                try {
                    const gRes = await fetch('/api/v1/cities/search?q=' + encodeURIComponent(cityTxt));
                    const gList = await gRes.json();
                    if (Array.isArray(gList) && gList.length > 0) {
                        lat = gList.at(0).lat; lon = gList.at(0).lon;
                    }
                } catch (err) {}
            }

            const payload = {
                date: bDate, time: bTime, gender, lat, lon, tz_offset: 3.0, year: yr,
                user_id: window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 0
            };

            const res = await fetch('/api/v1/solar/pro-preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();

            window.solarUnlocked_ch2 = false;
            window.solarUnlocked_ch3 = false;

            solarForm.style.display = 'none';
            viewport.style.display = 'block';
            viewport.innerHTML = [
                '<div style="background:rgba(22,18,36,0.75);border:1px solid rgba(226,194,117,0.3);border-radius:12px;padding:10px 14px;margin-bottom:12px;display:flex;justify-content:space-between;align-items:center;">',
                '<div><div style="color:#64748b;font-size:10.5px;text-transform:uppercase;">Солярный Радикс Года</div><div style="color:#ffe066;font-weight:bold;font-size:13.5px;">' + bDate + ' • Прогноз на ' + yr + ' год</div></div>',
                '<span id="solar-reset-btn" style="font-size:24px;color:#94a3b8;cursor:pointer;padding:0 4px;">&times;</span></div>',
                '<div id="solar-svg-container" style="background:radial-gradient(circle, rgba(22,18,36,0.92) 0%, #090710 100%);border:1px solid rgba(226,194,117,0.3);border-radius:16px;padding:14px;margin-bottom:12px;">' + buildSolarSvg(data.signs, yr) + '</div>',
                '<div id="solar-chapters-list" style="display:flex;flex-direction:column;gap:10px;margin-bottom:14px;"></div>',
                '<button id="solar-pdf-buy-btn" type="button" class="main-gold-btn" style="margin-bottom:10px;">☀️ Скачать Полный Солярный Манускрипт на ' + yr + ' г. (PDF)</button>',
                '<button id="solar-share-btn" type="button" style="width:100%;padding:11px;border-radius:12px;background:rgba(226,194,117,0.1);border:1px solid rgba(226,194,117,0.38);color:#ffe066;font-weight:bold;font-size:13px;cursor:pointer;">📸 Поделиться картой Соляра</button>'
            ].join('');

            document.getElementById('solar-reset-btn').onclick = () => {
                viewport.style.display = 'none';
                solarForm.style.display = 'block';
            };
            const listEl = document.getElementById('solar-chapters-list');
            const defs = [
                { k: 'ch1', icon: '☀️', title: 'Глава I. Главный Сценарий и Стратегия Года', sub: 'Асцендент и МС Соляра: личный вектор и цели', free: true, html: data.chapters.ch1 },
                { k: 'ch2', icon: '💎', title: 'Глава II. Любовь, Финансы и Прорывы Года', sub: 'Венера и Марс Соляра: деньги, магнетизм и действия', free: false, html: data.chapters.ch2 },
                { k: 'ch3', icon: '✨', title: 'Глава III. Семья и Календарь 12 Дней Соляра', sub: 'Луна Соляра + персональные даты закладки года', free: false, html: data.chapters.ch3 }
            ];

            defs.forEach(it => {
                const open = it.free || window.USER_AD_FREE;
                const card = document.createElement('div');
                card.style.cssText = 'background:rgba(22,18,36,0.9);border:1px solid ' + (open ? 'rgba(16,185,129,0.45)' : 'rgba(167,139,250,0.35)') + ';border-radius:14px;padding:13px 15px;display:flex;justify-content:space-between;align-items:center;gap:10px;cursor:pointer;';
                card.innerHTML = '<div><div style="color:#ffe066;font-weight:bold;font-size:13.5px;">' + it.icon + ' ' + it.title + '</div><div style="color:#94a3b8;font-size:11px;margin-top:2px;">' + it.sub + '</div></div><span class="sbadge" style="color:' + (open ? '#10b981' : '#c4b5fd') + ';border:1px solid ' + (open ? '#10b981' : 'rgba(167,139,250,0.4)') + ';padding:4px 9px;border-radius:20px;font-size:10.5px;font-weight:bold;white-space:nowrap;">' + (open ? 'ОТКРЫТО' : '🎬 За рекламу') + '</span>';
                card.onclick = () => {
                    const b = card.querySelector('.sbadge');
                    if (it.free || window.USER_AD_FREE || window['solarUnlocked_' + it.k]) {
                        openScroll(it.icon + ' ' + it.title, it.html);
                    } else {
                        unlockSolarChapter(it.k, b, () => {
                            card.style.borderColor = 'rgba(16,185,129,0.45)';
                            openScroll(it.icon + ' ' + it.title, it.html);
                        });
                    }
                };
                listEl.appendChild(card);
            });

            document.getElementById('solar-pdf-buy-btn').onclick = async () => {
                const btn = document.getElementById('solar-pdf-buy-btn');
                btn.disabled = true;
                btn.innerText = '⏳ Формируем Солярный Манускрипт...';
                try {
                    const pdfRes = await fetch('/api/v1/solar/download-pdf', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ ...payload, title: 'Солярный Манускрипт (' + yr + ' г.)' })
                    });
                    const resData = await pdfRes.json();
                    if (!pdfRes.ok) {
                        alert(resData.detail || 'Ошибка генерации PDF');
                        return;
                    }
                    if (resData.url) {
                        window.open(resData.url, '_blank');
                    }
                } catch (err) {
                    alert('Не удалось скачать PDF Соляра.');
                } finally {
                    btn.disabled = false;
                    btn.innerText = '☀️ Скачать Полный Солярный Манускрипт на ' + yr + ' г. (PDF)';
                }
            };

            document.getElementById('solar-share-btn').onclick = () => {
                const botLink = ['https:/', 't.me', 'yznaigoroskop_bot', 'app'].join('/');
                const shareTxt = '☀️ Мой персональный Соляр на ' + yr + ' год в Книге Теней и Звёзд!';
                const tgShareUrl = ['https:/', 't.me', 'share', 'url?url='].join('/') +
                    encodeURIComponent(botLink) + '&text=' + encodeURIComponent(shareTxt);

                if (window.Telegram?.WebApp?.openTelegramLink) {
                    window.Telegram.WebApp.openTelegramLink(tgShareUrl);
                    return;
                }



                const svgEl = document.querySelector('#solar-svg-container svg');
                if (!svgEl) return;
                const clone = svgEl.cloneNode(true);
                clone.setAttribute('width', '540');
                clone.setAttribute('height', '540');
                const img = new Image();
                img.onload = () => {
                    const c = document.createElement('canvas');
                    c.width = 720; c.height = 920;
                    const ctx = c.getContext('2d');
                    const g = ctx.createLinearGradient(0, 0, 720, 920);
                    g.addColorStop(0, '#161224'); g.addColorStop(1, '#090710');
                    ctx.fillStyle = g; ctx.fillRect(0, 0, 720, 920);
                    ctx.strokeStyle = '#e2c275'; ctx.lineWidth = 4; ctx.strokeRect(26, 26, 668, 868);
                    ctx.fillStyle = '#ffe066'; ctx.font = 'bold 32px Georgia, serif'; ctx.textAlign = 'center';
                    ctx.fillText('☀️ СОЛЯРНЫЙ ГОД • ' + yr, 360, 95);
                    ctx.fillStyle = '#a78bfa'; ctx.font = '21px sans-serif';
                    ctx.fillText('Личный прогноз на 12 месяцев • ' + bDate, 360, 138);
                    ctx.drawImage(img, 90, 175, 540, 540);
                    ctx.fillStyle = '#ffe066'; ctx.font = 'bold 23px sans-serif';
                    ctx.fillText('Книга Теней и Звёзд • @yznaigoroskop_bot', 360, 845);
                    c.toBlob(async (blob) => {                        
                        try {
                            const file = new File([blob], 'solar_' + yr + '.png', { type: 'image/png' });
                            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                                await navigator.share({ files: [file], title: 'Мой Соляр на ' + yr + ' год', text: shareTxt + ' ' + link });
                                return;
                            }
                        } catch (e) {}

                        const a = document.createElement('a');
                        a.href = URL.createObjectURL(blob);
                        a.download = 'solar_' + yr + '.png';
                        a.click();
                        window.open(tgShareUrl, '_blank');
                    });

                };
                img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(clone));
            };

        } catch (err) {
            alert('Не удалось построить карту Соляра. Проверьте соединение.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerText = '☀️ Рассчитать Солярный Год';
        }
    }, true);
});
