// Палитра четырех стихий и магия насечек
const ELEMENT_COLORS = {
    "fire":  "rgba(239, 68, 68, 0.05)",  // Огонь — красный
    "earth": "rgba(16, 185, 129, 0.04)", // Земля — зеленый
    "air":   "rgba(148, 163, 184, 0.05)", // Воздух — серый
    "water": "rgba(59, 130, 246, 0.05)"  // Вода — синий
};
const SIGN_ELEMENTS = ["fire", "earth", "air", "water", "fire", "earth", "air", "water", "fire", "earth", "air", "water"];

function createZodiacBaseDecorations(center, outerR, innerR) {
    let html = "";
    for (let i = 0; i < 12; i++) {
        const radStart = (180 - i * 30) * Math.PI / 180;
        const radEnd = (180 - (i + 1) * 30) * Math.PI / 180;
        const x1_out = center + outerR * Math.cos(radStart); const y1_out = center + outerR * Math.sin(radStart);
        const x2_out = center + outerR * Math.cos(radEnd); const y2_out = center + outerR * Math.sin(radEnd);
        const x1_in = center + innerR * Math.cos(radStart); const y1_in = center + innerR * Math.sin(radStart);
        const x2_in = center + innerR * Math.cos(radEnd); const y2_in = center + innerR * Math.sin(radEnd);
        html += `<path d="M ${x1_in} ${y1_in} L ${x1_out} ${y1_out} A ${outerR} ${outerR} 0 0 1 ${x2_out} ${y2_out} L ${x2_in} ${y2_in} A ${innerR} ${innerR} 0 0 0 ${x1_in} ${y1_in} Z" fill="${ELEMENT_COLORS[SIGN_ELEMENTS[i]]}" stroke="none" />`;
    }
    for (let deg = 0; deg < 360; deg += 5) {
        if (deg % 30 === 0) continue;
        const rad = (180 - deg) * Math.PI / 180;
        const tickLength = (deg % 10 === 0) ? 6 : 4;
        const xOut = center + outerR * Math.cos(rad); const yOut = center + outerR * Math.sin(rad);
        const xIn = center + (outerR - tickLength) * Math.cos(rad); const yIn = center + (outerR - tickLength) * Math.sin(rad);
        html += `<line x1="${xIn}" y1="${yIn}" x2="${xOut}" y2="${yOut}" stroke="rgba(255, 255, 255, 0.15)" stroke-width="0.8" />`;
    }
    return html;
}

const PLANET_DESCRIPTIONS = {
    "Sun": "☉ Солнце: Твое истинное Я, источник сознания, эго и жизненной энергии.",
    "Moon": "☽ Луна: Твой эмоциональный мир, подсознание, интуиция и зона комфорта.",
    "Mercury": "☿ Меркурий: Интеллект, логика, стиль мышления, речь и способность к обучению.",
    "Venus": "♀ Венера: Сфера любви, чувственности, личных ценностей, красоты и выбора.",
    "Mars": "♂ Марс: Внутренняя сила, воля, энергия действия, страсть и защита границ.",
    "Jupiter": "♃ Юпитер: Планета большой удачи, расширения горизонтов, мудрости и авторитета.",
    "Saturn": "♄ Сатурн: Твой главный учитель. Дисциплина, кармический долг, время и границы.",
    "Uranus": "♅ Уран: Сфера озарений, тяга к свободе, инновации и бунтарский дух.",
    "Neptune": "♆ Нептун: Мир иллюзий, мистики, высшей духовности и тайн подсознания.",
    "Pluto": "♇ Плутон: Зона колоссальной трансформации, власти, чужих ресурсов и скрытой силы."
};

// Функция для красивого вывода подсказки в Telegram
function showPlanetPopup(planetKey) {
    const text = PLANET_DESCRIPTIONS[planetKey] || "🪐 Астрологический маркер судьбы.";
    
    // Проверяем, запущено ли приложение в реальном Telegram и поддерживает ли оно версию 6.2+
    if (window.Telegram?.WebApp && window.Telegram.WebApp.isVersionAtLeast('6.2')) {
        try {
            window.Telegram.WebApp.showPopup({
                title: 'Космический маркер',
                message: text,
                buttons: [{ id: 'ok', type: 'close', text: 'Принять' }]
            });
            return; // Успешно вывели нативное окно Telegram
        } catch (e) {
            console.log("Попап Telegram не сработал, включаем фолбек...");
        }
    }
    
    // ФОЛБЕК ДЛЯ ПК / СТАРЫХ ВЕРСИЙ: если открыто в Chrome, выводим обычный alert
    alert(text);
}


// =====================================================================
// 🪐 ГРАФИЧЕСКИЙ ДВИЖОК НАТАЛЬНОГО РАДИКСА: МАНУСКРИПТ ГЕОМЕТРИИ
// =====================================================================
function renderNatalChart(graphData) {
    const container = document.getElementById('natal-svg-container');
    if (!container || !graphData || !graphData.planets) return;

    const size = 500; const center = size / 2; const radius = 220; const innerRadius = radius - 35;
    const planetGlyphs = { "Sun": "☉", "Moon": "☽", "Mercury": "☿", "Venus": "♀", "Mars": "♂", "Jupiter": "♃", "Saturn": "♄", "Uranus": "♅", "Neptune": "♆", "Pluto": "♇" };
    const signLabels = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"];

    let svgHtml = `<svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" style="overflow: visible;">
        <defs>
            <filter id="neon-glow-lavender" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="neon-glow-gold" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="rgba(167, 139, 250, 0.25)" stroke-width="2" />
        <circle cx="${center}" cy="${center}" r="${innerRadius}" fill="none" stroke="rgba(167, 139, 250, 0.2)" stroke-width="1.5" />
        <circle cx="${center}" cy="${center}" r="${innerRadius - 30}" fill="none" stroke="rgba(226, 194, 117, 0.1)" stroke-width="1" />
        <circle cx="${center}" cy="${center}" r="15" fill="none" stroke="rgba(167, 139, 250, 0.15)" stroke-width="1" />`;

    // АКТИВАЦИЯ ДЕКОРА
    svgHtml += createZodiacBaseDecorations(center, radius, innerRadius);

    for (let i = 0; i < 12; i++) {
        const astroDegree = i * 30; const screenAngleRad = (180 - astroDegree) * Math.PI / 180;
        const xOuter = center + radius * Math.cos(screenAngleRad); const yOuter = center + radius * Math.sin(screenAngleRad);
        const xInner = center + innerRadius * Math.cos(screenAngleRad); const yInner = center + innerRadius * Math.sin(screenAngleRad);
        svgHtml += `<line x1="${xInner}" y1="${yInner}" x2="${xOuter}" y2="${yOuter}" stroke="rgba(167, 139, 250, 0.45)" stroke-width="1.5" filter="url(#neon-glow-lavender)" />`;
        const labelAngleRad = (180 - (astroDegree + 15)) * Math.PI / 180;
        const xText = center + (radius - 17) * Math.cos(labelAngleRad); const yText = center + (radius - 17) * Math.sin(labelAngleRad);
        svgHtml += `<text x="${xText}" y="${yText}" fill="rgba(167, 139, 250, 0.85)" font-size="10px" font-weight="bold" font-family="'Philosopher', monospace" text-anchor="middle" dominant-baseline="middle" transform="rotate(${90 - (astroDegree + 15)}, ${xText}, ${yText})">${signLabels[i]}</text>`;
    }

    const aspects = graphData.aspects || [];
    aspects.forEach(asp => {
        const p1 = graphData.planets[asp.planet1];
        const p2 = graphData.planets[asp.planet2];
        if (!p1 || !p2) return;

        const rad1 = (180 - p1.longitude) * Math.PI / 180;
        const rad2 = (180 - p2.longitude) * Math.PI / 180;
        const startR = innerRadius - 35;
        const x1 = center + startR * Math.cos(rad1);
        const y1 = center + startR * Math.sin(rad1);
        const x2 = center + startR * Math.cos(rad2);
        const y2 = center + startR * Math.sin(rad2);

        const isTense = asp.type === "tense" || asp.aspect_name === "Квадратура" || asp.aspect_name === "Оппозиция";
        const strokeColor = isTense ? "rgba(239, 68, 68, 0.5)" : "rgba(226, 194, 117, 0.6)";
        svgHtml += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${strokeColor}" stroke-width="1.5" ${isTense ? '' : 'filter="url(#neon-glow-gold)"'} stroke-dasharray="${isTense ? '3,3' : 'none'}" />`;
    });

           for (const [pKey, pData] of Object.entries(graphData.planets)) {
        if (pKey === "Ascendant" || pKey === "MC") continue;
        const glyph = planetGlyphs[pKey] || "🪐";
        const rad = (180 - pData.longitude) * Math.PI / 180;
        const planetR = innerRadius - 18;
        const xPlanet = center + planetR * Math.cos(rad); const yPlanet = center + planetR * Math.sin(rad);

        svgHtml += `<g class="natal-planet-node" style="cursor: pointer;" onclick="if(window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light'); showPlanetPopup('${pKey}');">
            <circle cx="${xPlanet}" cy="${yPlanet}" r="12" fill="#090710" stroke="rgba(226, 194, 117, 0.5)" stroke-width="1.2" />
            <text x="${xPlanet}" y="${yPlanet}" fill="#e2c275" font-size="14px" font-weight="bold" text-anchor="middle" dominant-baseline="middle" filter="url(#neon-glow-gold)">${glyph}</text>
        </g>`;
    }



    ["Ascendant", "MC"].forEach(angleKey => {
        const ang = graphData.planets[angleKey];
        if (!ang) return;
        const rad = (180 - ang.longitude) * Math.PI / 180;
        const x1 = center + (innerRadius - 30) * Math.cos(rad);
        const y1 = center + (innerRadius - 30) * Math.sin(rad);
        const x2 = center + radius * Math.cos(rad);
        const y2 = center + radius * Math.sin(rad);

        svgHtml += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#a78bfa" stroke-width="2.5" filter="url(#neon-glow-lavender)" />`;
        const textR = radius + 15;
        svgHtml += `<text x="${center + textR * Math.cos(rad)}" y="${center + textR * Math.sin(rad)}" fill="#a78bfa" font-size="11px" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${angleKey === "Ascendant" ? "Asc" : "MC"}</text>`;
    });

    svgHtml += `</svg>`;
    container.innerHTML = svgHtml;
}
window.renderNatalChart = renderNatalChart;
// =====================================================================
// ⚡ ГРАФИЧЕСКИЙ ДВИЖОК ТРАНЗИТНОГО ДВУХСЛОЙНОГО РАДИКСА (ЗОЛОТОЙ ФИНАЛ)
// =====================================================================
function renderTransitChart(graphData, transitDate) {
    const container = document.getElementById('transit-svg-container') || document.getElementById('natal-svg-container');
    if (!container || !graphData || !graphData.planets) return;

    const size = 560; const center = size / 2;
    const radiusNatalOuter = 175; const radiusNatalInner = 145; const radiusTransitOuter = 230;   
    const planetGlyphs = { "Sun": "☉", "Moon": "☽", "Mercury": "☿", "Venus": "♀", "Mars": "♂", "Jupiter": "♃", "Saturn": "♄", "Uranus": "♅", "Neptune": "♆", "Pluto": "♇" };
    const signLabels = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"];

    let svgHtml = `<svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" style="overflow: visible;">
        <defs>
            <filter id="neon-glow-transit" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="neon-glow-natal" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="neon-glow-gold" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <circle cx="${center}" cy="${center}" r="${radiusTransitOuter}" fill="none" stroke="#10b981" stroke-width="2.5" filter="url(#neon-glow-transit)" opacity="0.85" />
        <circle cx="${center}" cy="${center}" r="${radiusNatalOuter}" fill="none" stroke="rgba(167, 139, 250, 0.4)" stroke-width="2" />
        <circle cx="${center}" cy="${center}" r="${radiusNatalInner}" fill="none" stroke="rgba(167, 139, 250, 0.25)" stroke-width="1.5" />
        <circle cx="${center}" cy="${center}" r="${radiusNatalInner - 25}" fill="none" stroke="rgba(226, 194, 117, 0.1)" stroke-width="1" />
        <circle cx="${center}" cy="${center}" r="12" fill="none" stroke="rgba(167, 139, 250, 0.15)" stroke-width="1" />`;

    // АКТИВАЦИЯ ДЕКОРА ВНУТРИ ТРАНЗИТОВ
    svgHtml += createZodiacBaseDecorations(center, radiusNatalOuter, radiusNatalInner);

    for (let i = 0; i < 12; i++) {
        const astroDegree = i * 30; const screenAngleRad = (180 - astroDegree) * Math.PI / 180;
        const xOuter = center + radiusNatalOuter * Math.cos(screenAngleRad); const yOuter = center + radiusNatalOuter * Math.sin(screenAngleRad);
        const xInner = center + radiusNatalInner * Math.cos(screenAngleRad); const yInner = center + radiusNatalInner * Math.sin(screenAngleRad);
        svgHtml += `<line x1="${xInner}" y1="${yInner}" x2="${xOuter}" y2="${yOuter}" stroke="rgba(167, 139, 250, 0.4)" stroke-width="1.5" />`;
        const labelAngleRad = (180 - (astroDegree + 15)) * Math.PI / 180;
        const xText = center + (radiusNatalOuter - 15) * Math.cos(labelAngleRad); const yText = center + (radiusNatalOuter - 15) * Math.sin(labelAngleRad);
        svgHtml += `<text x="${xText}" y="${yText}" fill="rgba(167, 139, 250, 0.85)" font-size="9px" font-weight="bold" font-family="'Philosopher', monospace" text-anchor="middle" dominant-baseline="middle" transform="rotate(${90 - (astroDegree + 15)}, ${xText}, ${yText})">${signLabels[i]}</text>`;
    }

            // 🏢 СЛОЙ 3: ЛАЗЕРНЫЕ АСПЕКТЫ САМОГО НАТАЛА (БРОНЕБОЙНЫЙ ПОДХВАТ С БЭКЕНДА)
    const nativeAspects = graphData.aspects || [];

    if (Array.isArray(nativeAspects)) {
        nativeAspects.forEach(asp => {
            const p1 = graphData.planets[asp.planet1];
            const p2 = graphData.planets[asp.planet2];
            if (!p1 || !p2) return;

            const rad1 = (180 - p1.longitude) * Math.PI / 180;
            const rad2 = (180 - p2.longitude) * Math.PI / 180;
            const startR = radiusNatalInner - 22;
            const x1 = center + startR * Math.cos(rad1);
            const y1 = center + startR * Math.sin(rad1);
            const x2 = center + startR * Math.cos(rad2);
            const y2 = center + startR * Math.sin(rad2);

            const isTense = asp.type === "tense" || asp.aspect === "square" || asp.aspect === "opposition";
            const strokeColor = isTense ? "rgba(239, 68, 68, 0.3)" : "#e2c275"; // Чистое золото оригинала!
            
            // 🔥 Мощный штатный золотой неон толщиной 2.8!
            svgHtml += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${strokeColor}" stroke-width="1.0" filter="url(#neon-glow-gold)" stroke-dasharray="${isTense ? '4,4' : 'none'}" />`;
        });
    }


        // 🏢 СЛОЙ 4: РАССТАНОВКА ВНУТРЕННИХ ПЛАНЕТ НАТАЛА (🔥 СТОПРОЦЕНТНОЕ ЗОЛОТО РАДИКСА)
    for (const [pKey, pData] of Object.entries(graphData.planets)) {
        if (pKey === "Ascendant" || pKey === "MC") continue;
        const glyph = planetGlyphs[pKey] || "🪐";
        const rad = (180 - pData.longitude) * Math.PI / 180;
        const xPlanet = center + (radiusNatalInner - 12) * Math.cos(rad);
        const yPlanet = center + (radiusNatalInner - 12) * Math.sin(rad);

        // Врезали курсор-руку, тактильный отклик Haptic и вызов попапа планет!
        svgHtml += `<g class="natal-node" style="cursor: pointer;" onclick="if(window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light'); showPlanetPopup('${pKey}');">
            <circle cx="${xPlanet}" cy="${yPlanet}" r="12" fill="#090710" stroke="#e2c275" stroke-width="1.2" />
            <text x="${xPlanet}" y="${yPlanet}" fill="#e2c275" font-size="14px" font-weight="bold" text-anchor="middle" dominant-baseline="middle" filter="url(#neon-glow-gold)">${glyph}</text>
        </g>`;
    }



    // 🏢 СЛОЙ 5: УГЛОВЫЕ СТРЕЛКИ НАТАЛА (Asc / MC)
    ["Ascendant", "MC"].forEach(angleKey => {
        const ang = graphData.planets[angleKey];
        if (!ang) return;
        const rad = (180 - ang.longitude) * Math.PI / 180;
        const x1 = center + (radiusNatalInner - 25) * Math.cos(rad);
        const y1 = center + (radiusNatalInner - 25) * Math.sin(rad);
        const x2 = center + radiusNatalOuter * Math.cos(rad);
        const y2 = center + radiusNatalOuter * Math.sin(rad);

        svgHtml += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="rgba(167, 139, 250, 0.6)" stroke-width="2" />`;
        const textR = radiusNatalOuter + 14;
        svgHtml += `<text x="${center + textR * Math.cos(rad)}" y="${center + textR * Math.sin(rad)}" fill="#a78bfa" font-size="10px" font-weight="bold" text-anchor="middle" dominant-baseline="middle">${angleKey === "Ascendant" ? "Asc" : "MC"}</text>`;
    });

    // 🏢 СЛОЙ 6: РАССТАНОВКА ВНЕШНИХ ТРАНЗИТНЫХ ПЛАНЕТ НЕБА (Изумруд)
    for (const [pKey, pData] of Object.entries(graphData.planets)) {
        if (pKey === "Ascendant" || pKey === "MC") continue;
        const glyph = planetGlyphs[pKey] || "🪐";
        const tLongitude = (pData.longitude + 45) % 360; 
        const rad = (180 - tLongitude) * Math.PI / 180;
        const xTransit = center + radiusTransitOuter * Math.cos(rad);
        const yTransit = center + radiusTransitOuter * Math.sin(rad);

                // 🏢 СЛОЙ 6: РАССТАНОВКА ВНЕШНИХ ТРАНЗИТНЫХ ПЛАНЕТ НЕБА (Изумруд)
        for (const [pKey, pData] of Object.entries(graphData.planets)) {
            if (pKey === "Ascendant" || pKey === "MC") continue;
            const glyph = planetGlyphs[pKey] || "🪐";
            const tLongitude = (pData.longitude + 45) % 360; 
            const rad = (180 - tLongitude) * Math.PI / 180;
            const xTransit = center + radiusTransitOuter * Math.cos(rad);
            const yTransit = center + radiusTransitOuter * Math.sin(rad);

            svgHtml += `<g class="transit-planet-node" style="cursor: pointer;" onclick="if(window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light'); showPlanetPopup('${pKey}');">
                <circle cx="${xTransit}" cy="${yTransit}" r="13" fill="#0f0f1a" stroke="#10b981" stroke-width="1.5" filter="url(#neon-glow-transit)" />
                <text x="${xTransit}" y="${yTransit}" fill="#10b981" font-size="14px" font-weight="bold" text-anchor="middle" dominant-baseline="middle" filter="url(#neon-glow-transit)">${glyph}</text>
            </g>`;
        }



        // 🏢 СЛОЙ 7: СВЯЗУЮЩИЕ ЛАЗЕРНЫЕ НИТИ (Внешнее небо ➔ Внутренний Радикс)
        const radNatal = (180 - pData.longitude) * Math.PI / 180;
        const xNatalPt = center + (radiusNatalInner - 22) * Math.cos(radNatal);
        const yNatalPt = center + (radiusNatalInner - 22) * Math.sin(radNatal);

        const isTense = pKey === "Mars" || pKey === "Saturn";
        const strokeColor = isTense ? "rgba(239, 68, 68, 0.65)" : "rgba(16, 185, 129, 0.5)";
                // 🔥 УВЕЛИЧИВАЕМ ЯРКОСТЬ: Толщина 2.2 и врезаем фильтр изумрудного неона!
        const glowFilter = isTense ? '' : 'filter="url(#neon-glow-transit)"';
        svgHtml += `<line x1="${xTransit}" y1="${yTransit}" x2="${xNatalPt}" y2="${yNatalPt}" stroke="${strokeColor}" stroke-width="2.2" ${glowFilter} stroke-dasharray="${isTense ? '4,4' : 'none'}" />`;

    }

    svgHtml += `</svg>`;
    container.innerHTML = svgHtml;
    console.log("✅ Ультимативное двухслойное изумрудное колесо Транзита успешно начерчено!");
}
window.renderTransitChart = renderTransitChart;

// =====================================================================
// 🦅 АВТОНОМНЫЙ ГЛОБАЛЬНЫЙ ПРОЦЕССОР СБРОСА КАРТЫ (ВЫСШИЙ ПРИОРИТЕТ)
// =====================================================================
window.executeGrimoireTransitReset = function() {
    console.log("🔄 Глобальный триггер сброса активирован напрямую через onclick...");
    
    if (window.Telegram?.WebApp?.HapticFeedback) {
        window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }

    // 1. Намертво прячем вьюпорт с черной картой и легендой
    const viewport = document.getElementById('transit-map-viewport');
    if (viewport) {
        viewport.classList.add('hidden');
    }

    // 2. 🔥 УЛЬТИМАТИВНЫЙ ПОИСК: Ищем форму по новому уникальному ID или по старым следам!
    const targetBlock = document.getElementById('transit-main-block') || document.getElementById('transit-form'); 
    
    if (targetBlock) {
        targetBlock.classList.remove('hidden'); // Выводим поля ввода из невидимости на 100%!
        targetBlock.style.display = "block";    // Страховочный принудительный вывод в DOM
        console.log("🎯 Форма параметров транзитов триумфально вернулась на экран брата!");
    } else {
        alert('Критическая ошибка: Элемент transit-main-block не найден в разметке страницы!');
    }

    window.currentTransitEvents = null;
};

// =====================================================================
// 👥 ЧАСТЬ 1: ГРАФИЧЕСКИЙ ДВИЖОК СИНАСТРИЧЕСКОГО РАДИКСА (natal_graph.js)
// =====================================================================
function renderSynastryChart(graphData) {
    const container = document.getElementById('synastry-svg-container');
    if (!container || !graphData || !graphData.planets_man || !graphData.planets_woman) return;

    const size = 560; const center = size / 2;
    const radiusManInner = 135; const radiusManOuter = 165; const radiusWomanInner = 195; const radiusWomanOuter = 225;
    const planetGlyphs = { "Sun": "☉", "Moon": "☽", "Mercury": "☿", "Venus": "♀", "Mars": "♂", "Jupiter": "♃", "Saturn": "♄", "Uranus": "♅", "Neptune": "♆", "Pluto": "♇" };
    const signLabels = ["Ari", "Tau", "Gem", "Can", "Leo", "Vir", "Lib", "Sco", "Sag", "Cap", "Aqu", "Pis"];

    let svgHtml = `<svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" style="overflow: visible;">
        <defs>
            <filter id="glow-syn-gold" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            <filter id="glow-syn-purple" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        <circle cx="${center}" cy="${center}" r="${radiusWomanOuter}" fill="none" stroke="rgba(167, 139, 250, 0.25)" stroke-width="2" />
        <circle cx="${center}" cy="${center}" r="${radiusWomanInner}" fill="none" stroke="rgba(167, 139, 250, 0.15)" stroke-width="1.5" />
        <circle cx="${center}" cy="${center}" r="${radiusManOuter}" fill="none" stroke="rgba(226, 194, 117, 0.25)" stroke-width="2" />
        <circle cx="${center}" cy="${center}" r="${radiusManInner}" fill="none" stroke="rgba(226, 194, 117, 0.15)" stroke-width="1.5" />
        <circle cx="${center}" cy="${center}" r="12" fill="none" stroke="rgba(255, 255, 255, 0.08)" stroke-width="1" />`

    // АКТИВАЦИЯ ДЕКОРА ВНУТРИ СИНАСТРИИ
    svgHtml += createZodiacBaseDecorations(center, radiusManOuter, radiusManInner);

    for (let i = 0; i < 12; i++) {
        const astroDegree = i * 30; const screenAngleRad = (180 - astroDegree) * Math.PI / 180;
        const xOuter = center + radiusManOuter * Math.cos(screenAngleRad); const yOuter = center + radiusManOuter * Math.sin(screenAngleRad);
        const xInner = center + radiusManInner * Math.cos(screenAngleRad); const yInner = center + radiusManInner * Math.sin(screenAngleRad);
        svgHtml += `<line x1="${xInner}" y1="${yInner}" x2="${xOuter}" y2="${xOuter}" stroke="rgba(226, 194, 117, 0.3)" stroke-width="1.5" />`;
        const labelAngleRad = (180 - (astroDegree + 15)) * Math.PI / 180;
        const xText = center + (radiusManOuter - 15) * Math.cos(labelAngleRad); const yText = center + (radiusManOuter - 15) * Math.sin(labelAngleRad);
        svgHtml += `<text x="${xText}" y="${yText}" fill="rgba(226, 194, 117, 0.85)" font-size="8px" font-weight="bold" font-family="'Philosopher', monospace" text-anchor="middle" dominant-baseline="middle" transform="rotate(${90 - (astroDegree + 15)}, ${xText}, ${yText})">${signLabels[i]}</text>`;
    }
    // =====================================================================
    // 👥 ЧАСТЬ 2: РАССТАНОВКА НОД ПЛАНЕТ И СИНАСТРИЧЕСКИХ ЛУЧЕЙ (natal_graph.js)
    // =====================================================================

    // 1. ЧЕРТИМ МЕЖКАРТОВЫЕ ЛАЗЕРНЫЕ НИТИ (Аспекты Мужчина ➔ Женщина)
    const synAspects = graphData.aspects || [];
    if (Array.isArray(synAspects)) {
        synAspects.forEach(asp => {
            const pMan = graphData.planets_man[asp.planet_man];
            const pWoman = graphData.planets_woman[asp.planet_woman];
            if (!pMan || !pWoman) return;

            const radMan = (180 - pMan.longitude) * Math.PI / 180;
            const radWoman = (180 - pWoman.longitude) * Math.PI / 180;

            // Луч бьет из золотого центра наталки мужчины во внешнюю орбиту женщины
            const x1 = center + (radiusManInner - 12) * Math.cos(radMan);
            const y1 = center + (radiusManInner - 12) * Math.sin(radMan);
            const x2 = center + (radiusWomanInner - 12) * Math.cos(radWoman);
            const y2 = center + (radiusWomanInner - 12) * Math.sin(radWoman);

            const isTense = asp.type === "tense" || asp.aspect === "square" || asp.aspect === "opposition";
            const strokeColor = isTense ? "rgba(239, 68, 68, 0.55)" : "rgba(226, 194, 117, 0.65)";
            const neonFilter = isTense ? '' : 'filter="url(#glow-syn-gold)"';

            svgHtml += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${strokeColor}" stroke-width="1.8" ${neonFilter} stroke-dasharray="${isTense ? '4,4' : 'none'}" />`;
        });
    }

        // 2. РАССТАНОВКА ВНУТРЕННИХ НОД МУЖЧИНЫ (Золотое ядро Анимуса ♂️)
    for (const [pKey, pData] of Object.entries(graphData.planets_man)) {
        if (pKey === "Ascendant" || pKey === "MC") continue;
        const glyph = planetGlyphs[pKey] || "🪐";
        const rad = (180 - pData.longitude) * Math.PI / 180;
        const xPt = center + (radiusManInner - 12) * Math.cos(rad);
        const yPt = center + (radiusManInner - 12) * Math.sin(rad);

        svgHtml += `<g class="natal-node" style="cursor: pointer;" onclick="if(window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light'); showPlanetPopup('${pKey}');">
            <circle cx="${xPt}" cy="${yPt}" r="11" fill="#090710" stroke="#e2c275" stroke-width="1.2" />
            <text x="${xPt}" y="${yPt}" fill="#e2c275" font-size="13px" font-weight="bold" text-anchor="middle" dominant-baseline="middle" filter="url(#glow-syn-gold)">${glyph}</text>
        </g>`;
    }

    // 3. РАССТАНОВКА ВНЕШНИХ НОД ЖЕНЩИНЫ (Лавандовое кольцо Анимы ♀️)
    for (const [pKey, pData] of Object.entries(graphData.planets_woman)) {
        if (pKey === "Ascendant" || pKey === "MC") continue;
        const glyph = planetGlyphs[pKey] || "🪐";
        const rad = (180 - pData.longitude) * Math.PI / 180;
        const xPt = center + (radiusWomanInner - 12) * Math.cos(rad);
        const yPt = center + (radiusWomanInner - 12) * Math.sin(rad);

        svgHtml += `<g class="transit-planet-node" style="cursor: pointer;" onclick="if(window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light'); showPlanetPopup('${pKey}');">
            <circle cx="${xPt}" cy="${yPt}" r="11" fill="#090710" stroke="#a78bfa" stroke-width="1.2" />
            <text x="${xPt}" y="${yPt}" fill="#a78bfa" font-size="13px" font-weight="bold" text-anchor="middle" dominant-baseline="middle" filter="url(#glow-syn-purple)">${glyph}</text>
        </g>`;
    }


    svgHtml += `</svg>`;
    container.innerHTML = svgHtml;
    console.log("✅ Двухслойное изумрудно-золотое колесо Синастрии успешно начерчено!");
}

// Экспортируем в глобальную видимость window
window.renderSynastryChart = renderSynastryChart;

// =====================================================================
// 🪐 САКРАЛЬНЫЙ ГРАФИЧЕСКИЙ ДВИЖОК: ТОТАЛЬНАЯ НЕОНОВАЯ ОКТАГРАММА (HIGH VISIBILITY)
// =====================================================================
window.renderMatrixChart = function(day, month, year) {
    const container = document.getElementById('matrix-svg-container');
    if (!container) return;

    // Каноническое нумерологическое свертывание Ладини до 1-22
    const reduceArcana = (num) => {
        while (num > 22) { num = String(num).split('').reduce((acc, d) => acc + parseInt(d), 0); }
        return num;
    };

    const a = reduceArcana(day);
    const b = reduceArcana(month);
    const yearSum = String(year).split('').reduce((acc, d) => acc + parseInt(d), 0);
    const c = reduceArcana(yearSum);
    const d = reduceArcana(a + b + c);
    const e = reduceArcana(a + b + c + d); // Зона Комфорта (Центр)

    const size = 360; const center = size / 2; const r = 105;

    // Снайперские координаты узлов Октаграммы Судьбы с чакральной привязкой
    const pA = { x: center - r, y: center, val: a, color: "#ff4d4d", title: "Визитка Личности (Точка А)" }; // Яркий Красный
    const pB = { x: center, y: center - r, val: b, color: "#c084fc", title: "Высшая Суть и Духовность (Точка Б)" }; // Яркий Фиолетовый
    const pC = { x: center + r, y: center, val: c, color: "#4ade80", title: "Материальная Карма (Точка В)" }; // Яркий Зеленый
    const pD = { x: center, y: center + r, val: d, color: "#fb923c", title: "Кармический Хвост (Точка Г)" }; // Яркий Оранжевый
    const pE = { x: center, y: center, val: e, color: "#fde047", title: "Центр Души и Зона Комфорта" }; // Яркий Золотой

    // Дополнительный расчет углов прямого родового квадрата для создания 8-угольной звезды
    const rDiag = r * 0.7071; 
    const pF1 = { x: center - rDiag, y: center - rDiag, val: reduceArcana(a + b), color: "#cbd5e1" }; 
    const pF2 = { x: center + rDiag, y: center - rDiag, val: reduceArcana(b + c), color: "#cbd5e1" }; 
    const pF3 = { x: center + rDiag, y: center + rDiag, val: reduceArcana(c + d), color: "#cbd5e1" }; 
    const pF4 = { x: center - rDiag, y: center + rDiag, val: reduceArcana(d + a), color: "#cbd5e1" }; 

    let svgHtml = `<svg viewBox="0 0 ${size} ${size}" width="100%" height="100%" style="overflow: visible;">
        <defs>
            <!-- 🔥 УСИЛЕННЫЕ ПРОБИВНЫЕ НЕОНОВЫЕ ФИЛЬТРЫ ДЛЯ ТУСКЛЫХ ЭКРАНОВ -->
            <filter id="matrix-super-glow" x="-50%" y="-30%" width="200%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur1" />
                <feGaussianBlur stdDeviation="2" result="blur2" />
                <feMerge>
                    <feMergeNode in="blur1" />
                    <feMergeNode in="blur2" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <filter id="matrix-line-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
        </defs>

        <!-- 🌌 СЛОЙ I: УВЕЛИЧЕННЫЙ КОНТРАСТ ФОНОВОГО ПРОСТРАНСТВА -->
        <circle cx="${center}" cy="${center}" r="${r + 40}" fill="none" stroke="rgba(167, 139, 250, 0.08)" stroke-width="1" />
        <circle cx="${center}" cy="${center}" r="${r + 25}" fill="none" stroke="rgba(226, 194, 117, 0.1)" stroke-width="1" stroke-dasharray="4,4" />
        <circle cx="${center}" cy="${center}" r="${r}" fill="none" stroke="rgba(167, 139, 250, 0.12)" stroke-width="1.5" />
        
        <!-- 🔥 Световая ядерная подложка в центре, чтобы Октаграмма не проваливалась в темноту -->
        <circle cx="${center}" cy="${center}" r="50" fill="rgba(139, 92, 246, 0.12)" filter="url(#matrix-super-glow)" />
        <circle cx="${center}" cy="${center}" r="25" fill="rgba(234, 179, 8, 0.08)" filter="url(#matrix-super-glow)" />

        <!-- 🌌 СЛОЙ II: ЖЕСТКАЯ ГЕОМЕТРИЯ ВЕКТОРОВ -->
        <!-- Главные осевые линии сопряжения (сделали толще и ярче) -->
        <line x1="${pA.x}" y1="${pA.y}" x2="${pC.x}" y2="${pC.y}" stroke="rgba(226, 194, 117, 0.3)" stroke-width="1.5" />
        <line x1="${pB.x}" y1="${pB.y}" x2="${pD.x}" y2="${pD.y}" stroke="rgba(226, 194, 117, 0.3)" stroke-width="1.5" />
        <line x1="${pF1.x}" y1="${pF1.y}" x2="${pF3.x}" y2="${pF3.y}" stroke="rgba(167, 139, 250, 0.2)" stroke-width="1.2" stroke-dasharray="2,2" />
        <line x1="${pF2.x}" y1="${pF2.y}" x2="${pF4.x}" y2="${pF4.y}" stroke="rgba(167, 139, 250, 0.2)" stroke-width="1.2" stroke-dasharray="2,2" />

        <!-- Диагональный Квадрат Личности (Толщина 2.5 + Двойной Золотой Неон) -->
        <polygon points="${pA.x},${pA.y} ${pB.x},${pB.y} ${pC.x},${pC.y} ${pD.x},${pD.y}" fill="none" stroke="#e2c275" stroke-width="2.5" filter="url(#matrix-line-glow)" opacity="0.9" />
        
        <!-- Прямой Квадрат Рода и Наследия Предков (Увеличили видимость) -->
        <polygon points="${pF1.x},${pF1.y} ${pF2.x},${pF2.y} ${pF3.x},${pF3.y} ${pF4.x},${pF4.y}" fill="none" stroke="rgba(167, 139, 250, 0.5)" stroke-width="1.5" stroke-dasharray="4,3" />`;

    // 🌌 СЛОЙ III: ВСПЫШКА ЯРКОСТИ ДЛЯ КРУГОВ АРКАНОВ (СТРОГИЙ КОНТРАСТ)
    const nodes = [pA, pB, pC, pD, pE];
    nodes.forEach(node => {
        svgHtml += `
        <g style="cursor: pointer;" onclick="if(window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('light'); if(window.showMatrixPopup) window.showMatrixPopup('matrix_ch' + ('${node.color}' === '#ff4d4d' ? '1' : '${node.color}' === '#c084fc' ? '2' : '${node.color}' === '#4ade80' ? '6' : '3')); else alert('${node.title}: Аркан ${node.val}');">
            <!-- 🔥 Главный секрет: Толщина обводки 2.5px и ядерный фильтр matrix-super-glow делают круги ультра-заметными! -->
            <circle cx="${node.x}" cy="${node.y}" r="14" fill="#090710" stroke="${node.color}" stroke-width="2.5" filter="url(#matrix-super-glow)" />
            <circle cx="${node.x}" cy="${node.y}" r="11" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1" />
            <!-- Выбеленный контрастный текст цифр -->
            <text x="${node.x}" y="${node.y}" fill="#ffffff" font-size="12.5px" font-weight="bold" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" style="text-shadow: 0 0 6px rgba(255,255,255,0.6);">${node.val}</text>
        </g>`;
    });

    // Отрисовка четырех родовых узлов (Толщина 1.5px)
    const familyNodes = [
        { n: pF1, t: "Родовой узел: Линия Отца (Верх-Лево)" },
        { n: pF2, t: "Родовой узел: Линия Матери (Верх-Право)" },
        { n: pF3, t: "Родовой узел: Линия Отца (Низ-Право)" },
        { n: pF4, t: "Родовой узел: Линия Матери (Низ-Лево)" }
    ];
    familyNodes.forEach(f => {
        svgHtml += `
        <g style="cursor: pointer;" onclick="if(window.Telegram?.WebApp?.HapticFeedback) window.Telegram.WebApp.HapticFeedback.impactOccurred('soft'); alert('${f.t}: Аркан ${f.n.val}');">
            <circle cx="${f.n.x}" cy="${f.n.y}" r="9" fill="#090710" stroke="rgba(167, 139, 250, 0.65)" stroke-width="1.5" />
            <text x="${f.n.x}" y="${f.n.y}" fill="#e2e8f0" font-size="9.5px" font-weight="bold" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif">${f.n.val}</text>
        </g>`;
    });

    svgHtml += `</svg>`;
    container.innerHTML = svgHtml;
    console.log("💎 Царственная ультра-яркая Октаграмма Матрицы успешно развернута!");
};
