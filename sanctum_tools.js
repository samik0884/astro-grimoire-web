(function() {
    const PLANETS_BY_DAY = [
        { name: 'Солнце ☉', color: '#ffe066', mantra: 'Свет, воля и внутреннее сияние' },
        { name: 'Луна ☽', color: '#c4b5fd', mantra: 'Интуиция, покой и глубина' },
        { name: 'Марс ♂', color: '#f87171', mantra: 'Решимость, защита и действие' },
        { name: 'Меркурий ☿', color: '#38bdf8', mantra: 'Ясный разум, слово и удача в делах' },
        { name: 'Юпитер ♃', color: '#fbbf24', mantra: 'Изобилие, рост и покровительство' },
        { name: 'Венера ♀', color: '#f472b6', mantra: 'Гармония, любовь и притяжение' },
        { name: 'Сатурн ♄', color: '#94a3b8', mantra: 'Фундамент, границы и мудрость' }
    ];

    function openModal(titleText, buildFn) {
        const sheet = document.getElementById('magic-bottom-sheet');
        const title = document.getElementById('sheet-title');
        const body = document.getElementById('sheet-text');
        if (!sheet || !title || !body) return;
        title.textContent = titleText;
        body.textContent = '';
        buildFn(body);
        sheet.classList.add('active');
        sheet.style.display = 'flex';
    }

    window.openSigilGeneratorTool = function() {
        openModal('🔯 Генератор Сигилы Дня', (body) => {
            const p = JSON.parse(localStorage.getItem('astro_user_profile') || 'null');
            const defaultName = p?.name || window.Telegram?.WebApp?.initDataUnsafe?.user?.first_name || 'Путник';
            const dayInfo = PLANETS_BY_DAY.at(new Date().getDay());

            const wrap = document.createElement('div');
            wrap.style.cssText = 'display:flex;flex-direction:column;gap:12px;align-items:center;';

            const desc = document.createElement('p');
            desc.style.cssText = 'color:#cbd5e1;font-size:13px;margin:0;width:100%;';
            desc.innerHTML = 'Сакральная геометрия выстраивается по вибрации твоего имени и управителя суток (<b>' + dayInfo.name + '</b>).';

            const row = document.createElement('div');
            row.style.cssText = 'display:flex;gap:8px;width:100%;';

            const nameInp = document.createElement('input');
            nameInp.type = 'text';
            nameInp.value = defaultName;
            nameInp.placeholder = 'Твоё имя или слово силы...';
            nameInp.style.cssText = 'flex:1;height:40px;padding:0 12px;background:#0d0a14;color:#ffe066;border:1px solid rgba(226,194,117,0.4);border-radius:12px;';

            const intentSel = document.createElement('select');
            intentSel.style.cssText = 'flex:1;height:40px;padding:0 10px;background:#0d0a14;color:#fff;border:1px solid rgba(226,194,117,0.4);border-radius:12px;';
            [['protect', '🛡️ Защита'], ['wealth', '💰 Достаток'], ['love', '💞 Любовь'], ['clarity', '🧠 Ясность']].forEach(([v, t]) => {
                const o = document.createElement('option');
                o.value = v; o.textContent = t;
                intentSel.appendChild(o);
            });
            row.append(nameInp, intentSel);
            let customBgImg = null;
            const bgRow = document.createElement('div');
            bgRow.style.cssText = 'display:flex;gap:8px;width:100%;';

            const fileInp = document.createElement('input');
            fileInp.type = 'file';
            fileInp.accept = 'image/*';
            fileInp.style.display = 'none';

            const uploadBtn = document.createElement('button');
            uploadBtn.type = 'button';
            uploadBtn.style.cssText = 'flex:1;padding:8px 10px;border-radius:10px;background:rgba(167,139,250,0.14);border:1px solid rgba(167,139,250,0.4);color:#c4b5fd;font-size:12px;cursor:pointer;';
            uploadBtn.textContent = '🖼️ Свой фон (фото из галереи)';
            uploadBtn.onclick = () => fileInp.click();

            const resetBgBtn = document.createElement('button');
            resetBgBtn.type = 'button';
            resetBgBtn.style.cssText = 'display:none;padding:8px 12px;border-radius:10px;background:rgba(239,68,68,0.14);border:1px solid rgba(239,68,68,0.4);color:#fca5a5;font-size:12px;cursor:pointer;';
            resetBgBtn.textContent = '✖ Космос';
            resetBgBtn.onclick = () => {
                customBgImg = null;
                fileInp.value = '';
                resetBgBtn.style.display = 'none';
                uploadBtn.textContent = '🖼️ Свой фон (фото из галереи)';
                drawSigil();
            };

            fileInp.onchange = (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = (ev) => {
                    const img = new Image();
                    img.onload = () => {
                        customBgImg = img;
                        resetBgBtn.style.display = 'block';
                        uploadBtn.textContent = '✅ Свой фон загружен';
                        drawSigil();
                    };
                    img.src = ev.target.result;
                };
                reader.readAsDataURL(file);
            };
            bgRow.append(fileInp, uploadBtn, resetBgBtn);


            const canvas = document.createElement('canvas');
            canvas.width = 1080;
            canvas.height = 1920;
            canvas.style.cssText = 'width:190px;height:338px;border-radius:16px;border:1.5px solid #e2c275;box-shadow:0 0 25px rgba(226,194,117,0.25);background:#090710;';
            const drawSigil = () => {
                const ctx = canvas.getContext('2d');
                const seedStr = (nameInp.value.trim() || 'ASTRAL') + '_' + intentSel.value + '_' + new Date().toISOString().split('T').at(0);
                let hash = 2166136261;
                for (let i = 0; i < seedStr.length; i++) {
                    hash ^= seedStr.charCodeAt(i);
                    hash = Math.imul(hash, 16777619);
                }
                const nextRand = () => {
                    hash = (Math.imul(hash, 1664525) + 1013904223) >>> 0;
                    return hash / 4294967296;
                };

                if (customBgImg) {
                    const scale = Math.max(1080 / customBgImg.width, 1920 / customBgImg.height);
                    const w = customBgImg.width * scale;
                    const h = customBgImg.height * scale;
                    ctx.drawImage(customBgImg, (1080 - w) / 2, (1920 - h) / 2, w, h);
                    ctx.fillStyle = 'rgba(9, 7, 16, 0.48)';
                    ctx.fillRect(0, 0, 1080, 1920);
                } else {
                    const grad = ctx.createRadialGradient(540, 960, 80, 540, 960, 1100);
                    grad.addColorStop(0, '#1e1636');
                    grad.addColorStop(0.55, '#0e0b1a');
                    grad.addColorStop(1, '#06050c');
                    ctx.fillStyle = grad;
                    ctx.fillRect(0, 0, 1080, 1920);
                }


                for (let i = 0; i < 110; i++) {
                    ctx.fillStyle = i % 3 === 0 ? 'rgba(255,224,102,0.55)' : 'rgba(167,139,250,0.45)';
                    ctx.beginPath();
                    ctx.arc(nextRand() * 1080, nextRand() * 1920, 1 + nextRand() * 2.5, 0, Math.PI * 2);
                    ctx.fill();
                }

                const cx = 540, cy = 960, R = 360;
                ctx.save();
                ctx.shadowColor = dayInfo.color;
                ctx.shadowBlur = 28;
                ctx.strokeStyle = '#e2c275';
                ctx.lineWidth = 4;
                ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
                ctx.lineWidth = 2;
                ctx.beginPath(); ctx.arc(cx, cy, R - 26, 0, Math.PI * 2); ctx.stroke();

                const points = [];
                const count = 9;
                for (let i = 0; i < count; i++) {
                    const ang = (Math.PI * 2 * i) / count - Math.PI / 2;
                    const rad = (i % 2 === 0 ? R - 45 : R * 0.55);
                    points.push({ x: cx + Math.cos(ang) * rad, y: cy + Math.sin(ang) * rad });
                }

                ctx.strokeStyle = dayInfo.color;
                ctx.lineWidth = 5;
                ctx.beginPath();
                let idx = Math.floor(nextRand() * count);
                ctx.moveTo(points.at(idx).x, points.at(idx).y);
                for (let s = 0; s < 10; s++) {
                    idx = (idx + 2 + Math.floor(nextRand() * 4)) % count;
                    ctx.lineTo(points.at(idx).x, points.at(idx).y);
                }
                ctx.stroke();

                ctx.fillStyle = '#ffe066';
                points.forEach(pt => { ctx.beginPath(); ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2); ctx.fill(); });
                ctx.beginPath(); ctx.arc(cx, cy, 22, 0, Math.PI * 2); ctx.stroke();
                ctx.restore();

                ctx.fillStyle = '#e2c275';
                ctx.font = 'bold 34px Georgia, serif';
                ctx.textAlign = 'center';
                ctx.fillText('КНИГА ТЕНЕЙ И ЗВЁЗД', cx, 360);
                ctx.fillStyle = dayInfo.color;
                ctx.font = '24px Georgia, serif';
                ctx.fillText('(@yznaigoroskop_bot)', cx, 405);

                ctx.fillStyle = '#a78bfa';
                ctx.font = '28px Georgia, serif';
                ctx.fillText(dayInfo.name + ' • ' + new Date().toLocaleDateString('ru-RU'), cx, 1460);
                ctx.fillStyle = '#f3e8ff';
                ctx.font = 'italic 26px Georgia, serif';
                ctx.fillText('«' + dayInfo.mantra + '»', cx, 1520);
            };

            drawSigil();
            nameInp.addEventListener('input', drawSigil);
            intentSel.addEventListener('change', drawSigil);

            const dlBtn = document.createElement('button');
            dlBtn.type = 'button';
            dlBtn.className = 'main-gold-btn';
            dlBtn.textContent = '📲 Отправить обои в чат бота (1080×1920)';
            dlBtn.onclick = async () => {
                const userId = (window.getGrimoireUserId ? window.getGrimoireUserId() : 0) || Number(window.Telegram?.WebApp?.initDataUnsafe?.user?.id || 0);

                const dataUrl = canvas.toDataURL('image/jpeg', 0.92);

                if (userId > 0) {
                    dlBtn.disabled = true;
                    dlBtn.textContent = '⏳ Отправляем обои в Telegram...';
                    try {
                        const res = await fetch('/api/v1/oracle/send-sigil', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ user_id: userId, image_data: dataUrl })
                        });
                        const ans = await res.json();
                        if (ans.status === 'ok') {
                            dlBtn.textContent = '✅ Обои отправлены в чат бота!';
                            if (window.Telegram?.WebApp?.showAlert) {
                                window.Telegram.WebApp.showAlert('🔯 Обои 1080×1920 отправлены вам в личный чат с ботом без сжатия!');
                            }
                            setTimeout(() => { dlBtn.disabled = false; dlBtn.textContent = '📲 Отправить обои в чат бота (1080×1920)'; }, 3000);
                            return;
                        }
                    } catch (e) {}
                    dlBtn.disabled = false;
                    dlBtn.textContent = '📲 Отправить обои в чат бота (1080×1920)';
                }
                const link = document.createElement('a');
                link.download = 'sigil_' + new Date().toISOString().split('T').at(0) + '.png';
                link.href = dataUrl;
                link.click();
            };


            wrap.append(desc, row, bgRow, canvas, dlBtn);
            body.appendChild(wrap);
        });
    };
    window.openSarosWheelTool = function() {
        openModal('🌀 Колесо Сароса (Циклы 18.6 лет)', (body) => {
            const p = JSON.parse(localStorage.getItem('astro_user_profile') || 'null');
            const wrap = document.createElement('div');
            wrap.style.cssText = 'display:flex;flex-direction:column;gap:12px;';

            const desc = document.createElement('p');
            desc.style.cssText = 'color:#cbd5e1;font-size:13px;margin:0;';
            desc.textContent = 'Драконический цикл Лунных Узлов (18.61 года) отмечает главные кармические повороты, смены пути и судьбоносные встречи.';

            const dInp = document.createElement('input');
            dInp.type = 'date';
            dInp.value = p?.date || '1993-05-15';
            dInp.style.cssText = 'width:100%;height:40px;padding:0 12px;background:#0d0a14;color:#fff;border:1px solid rgba(226,194,117,0.35);border-radius:12px;';

            const listBox = document.createElement('div');
            listBox.style.cssText = 'display:flex;flex-direction:column;gap:8px;';

            const milestones = [
                { mult: 1, age: '9.3 года', title: 'Первая Противофаза Узлов', note: 'Первое пробуждение характера и выход из детского сценария.' },
                { mult: 2, age: '18.6 лет', title: '1-е Возвращение Узлов (Сарос)', note: 'Первый взрослый выбор пути, проверка самостоятельности.' },
                { mult: 3, age: '27.9 лет', title: 'Вторая Противофаза Узлов', note: 'Переоценка ценностей перед кризисом 30 лет, смена ориентиров.' },
                { mult: 4, age: '37.2 лет', title: '2-е Возвращение Узлов (Сарос)', note: 'Большой кармический экзамен зрелости и выход на истинное призвание.' },
                { mult: 5, age: '46.5 лет', title: 'Третья Противофаза Узлов', note: 'Обновление миссии, передача опыта и глубокая внутренняя свобода.' },
                { mult: 6, age: '55.8 лет', title: '3-е Возвращение Узлов (Сарос)', note: 'Пик мудрости, сбор плодов прожитых циклов и духовное наставничество.' },
                { mult: 7, age: '65.1 лет', title: 'Четвёртая Противофаза Узлов', note: 'Гармонизация прошлого и нового жизненного этапа.' }
            ];

            const renderCycles = () => {
                listBox.textContent = '';
                const bDate = new Date(dInp.value || '1993-05-15');
                if (isNaN(bDate.getTime())) return;
                const HALF_SAROS_DAYS = 3398.9;
                const now = new Date();

                milestones.forEach(m => {
                    const targetDate = new Date(bDate.getTime() + m.mult * HALF_SAROS_DAYS * 86400000);
                    const diffDays = Math.round((targetDate - now) / 86400000);
                    const isNear = Math.abs(diffDays) <= 365;
                    const isPast = diffDays < 0;

                    const card = document.createElement('div');
                    card.style.cssText = 'background:rgba(13,10,20,0.8);border:1px solid ' + (isNear ? '#ffe066' : 'rgba(167,139,250,0.22)') + ';border-radius:12px;padding:10px 12px;';

                    const top = document.createElement('div');
                    top.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;';
                    const t1 = document.createElement('span');
                    t1.style.cssText = 'color:' + (isNear ? '#ffe066' : '#e2c275') + ';font-weight:bold;font-size:13px;';
                    t1.textContent = (isNear ? '🔥 ' : '') + m.age + ' • ' + targetDate.toLocaleDateString('ru-RU');
                    const t2 = document.createElement('span');
                    t2.style.cssText = 'font-size:11px;color:' + (isNear ? '#10b981' : '#94a3b8') + ';font-weight:bold;';
                    t2.textContent = isNear ? 'Активное окно!' : (isPast ? 'Пройдено' : 'Через ' + Math.round(diffDays / 365.25) + ' л.');
                    top.append(t1, t2);

                    const sub = document.createElement('div');
                    sub.style.cssText = 'color:#f3e8ff;font-size:12.5px;font-weight:bold;margin-bottom:2px;';
                    sub.textContent = m.title;

                    const pNote = document.createElement('div');
                    pNote.style.cssText = 'color:#94a3b8;font-size:11.5px;line-height:1.35;';
                    pNote.textContent = m.note;

                    card.append(top, sub, pNote);
                    listBox.appendChild(card);
                });
            };

            dInp.addEventListener('change', renderCycles);
            renderCycles();
            wrap.append(desc, dInp, listBox);
            body.appendChild(wrap);
        });
    };
})();
