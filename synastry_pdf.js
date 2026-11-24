document.addEventListener('DOMContentLoaded', () => {
    // Привязываемся строго к ID кнопки из твоей верстки index.html
    const pdfBtn = document.getElementById('synastry-pdf-download-btn') || document.getElementById('synastry-pdf-btn');
    if (!pdfBtn) return;

    pdfBtn.addEventListener('click', async () => {
        // Тактильный виброотклик в Telegram
        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }

        pdfBtn.disabled = true;
        const originalText = pdfBtn.innerText;
        pdfBtn.innerText = "🔮 Запуск реторты союза...";

        let statusDiv = document.getElementById('mystic-pdf-status');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'mystic-pdf-status';
            statusDiv.style.color = '#e2c275';
            statusDiv.style.fontFamily = 'Philosopher, serif';
            statusDiv.style.marginTop = '12px';
            statusDiv.style.textAlign = 'center';
            statusDiv.style.fontStyle = 'italic';
            pdfBtn.parentNode.insertBefore(statusDiv, pdfBtn.nextSibling);
        }

        const statuses = [
            "📜 Наложение алхимических реторт союза...",
            "✨ Сканирование шлюзов подсознания планет...",
            "🔥 Сплавление энергий Марса и Венеры в тигле...",
            "🪐 Материализация премиального журнала Гримуара..."
        ];
        
        let statusIdx = 0;
        statusDiv.innerText = statuses[statusIdx];
        
        const intervalId = setInterval(() => {
            statusIdx = (statusIdx + 1) % statuses.length;
            statusDiv.innerText = statuses[statusIdx];
        }, 3000);

        try {
            // Собираем payload строго в нижнем регистре и без опечаток в ключах!
            const payload = {
                partner1_name: document.getElementById('partner1-name')?.value || "Партнер А",
                partner2_name: document.getElementById('partner2-name')?.value || "Партнер Б",
                sun_sign_1: (window.synastryData?.partner1?.sun || "aries").toLowerCase(),
                sun_sign_2: (window.synastryData?.partner2?.sun || "taurus").toLowerCase(),
                moon_sign_1: (window.synastryData?.partner1?.moon || "gemini").toLowerCase(),
                moon_sign_2: (window.synastryData?.partner2?.moon || "cancer").toLowerCase(),
                mars_sign_1: (window.synastryData?.partner1?.mars || "leo").toLowerCase(),
                venus_sign_1: (window.synastryData?.partner1?.venus || "virgo").toLowerCase(),
                mercury_sign_1: (window.synastryData?.partner1?.mercury || "libra").toLowerCase(),
                mars_sign_2: (window.synastryData?.partner2?.mars || "scorpio").toLowerCase(),
                venus_sign_2: (window.synastryData?.partner2?.venus || "sagittarius").toLowerCase(), // ИСПРАВЛЕНО: Теперь ключ совпадает с Pydantic моделью бэкенда!
                mercury_sign_2: (window.synastryData?.partner2?.mercury || "capricorn").toLowerCase()
            };

            const response = await fetch('/api/v1/synastry/download-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Ошибка при генерации PDF на бэкенде");

            // Принимаем безопасную JSON ссылку вместо blob
            const data = await response.json(); 
            const absoluteUrl = window.location.origin + data.url;

            // ХАК ДЛЯ ОБХОДА БЛОКИРОВОК ВНУТРИ ТЕЛЕГРАМА
            if (window.Telegram?.WebApp) {
                window.Telegram.WebApp.openLink(absoluteUrl);
            } else {
                // Фолбек для обычного браузера на ПК
                window.open(absoluteUrl, '_blank');
            }

            if (window.Telegram?.WebApp?.HapticFeedback) {
                window.Telegram.WebApp.HapticFeedback.notificationOccurred('success');
            }

        } catch (err) {
            console.error("❌ Алхимический сбой фронтенда:", err);
            alert("Не удалось материализовать Книгу Связей. Проверьте расчет карты.");
        } finally {
            clearInterval(intervalId);
            statusDiv.innerText = "";
            pdfBtn.disabled = false;
            pdfBtn.innerText = originalText;
        }
    });
});
