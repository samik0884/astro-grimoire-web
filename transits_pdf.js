document.addEventListener('DOMContentLoaded', () => {
    const pdfBtn = document.getElementById('transits-pdf-btn');
    if (!pdfBtn) return;

    pdfBtn.addEventListener('click', async () => {
        const birthDate = document.getElementById('transit-birth-date')?.value;
        if (!birthDate) {
            alert("Сначала укажите вашу дату рождения в блоке «Данные твоего Радикса»!");
            return;
        }

        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }

        pdfBtn.disabled = true;
        const originalText = pdfBtn.innerText;
        pdfBtn.innerText = "⏳ Сканирование орбит на год...";

        let statusDiv = document.getElementById('transits-pdf-status');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'transits-pdf-status';
            statusDiv.style.color = '#10b981';
            statusDiv.style.fontFamily = 'Philosopher, serif';
            statusDiv.style.marginTop = '10px';
            statusDiv.style.textAlign = 'center';
            statusDiv.style.fontStyle = 'italic';
            pdfBtn.parentNode.insertBefore(statusDiv, pdfBtn.nextSibling);
        }

        const statuses = [
            "🪐 Расчет движения Юпитера и Сатурна по домам...",
            "⚡ Поиск точных транзитных аспектов года...",
            "📅 Формирование календарного планера на 12 месяцев...",
            "📜 Переплет персонального манускрипта..."
        ];

        let idx = 0;
        statusDiv.innerText = statuses[idx];
        const timer = setInterval(() => {
            idx = (idx + 1) % statuses.length;
            statusDiv.innerText = statuses[idx];
        }, 3000);

        try {
            const birthTime = document.getElementById('transit-birth-time')?.value || "12:00";
            const genderVal = document.getElementById('transit-embedded-gender')?.value || "woman";
            const latVal = parseFloat(document.getElementById('transit-lat')?.value) || 55.7558;
            const lonVal = parseFloat(document.getElementById('transit-lon')?.value) || 37.6173;
            
            // Берем целевой год из поля даты прогноза (если не выбрана — берем текущий год)
            const forecastDate = document.getElementById('transit-date')?.value;
            const targetYear = forecastDate ? parseInt(forecastDate.split('-')[0]) : new Date().getFullYear();

            const payload = {
                natal_date: birthDate,
                natal_time: birthTime,
                target_year: parseInt(document.getElementById('transit-pdf-year-sel')?.value || (new Date().getFullYear() + 1), 10),
                gender: genderVal === "man" ? "man" : "woman",
                lat: latVal,
                lon: lonVal,
                tz_offset: 3.0
            };

            const response = await fetch('/api/v1/transits/download-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Ошибка генерации планера");

            const data = await response.json();
            const absoluteUrl = window.location.origin + data.url;

            if (window.Telegram?.WebApp) {
                window.Telegram.WebApp.openLink(absoluteUrl);
            } else {
                window.open(absoluteUrl, '_blank');
            }
        } catch (err) {
            console.error("❌ Сбой PDF транзитов:", err);
            alert("Не удалось собрать Годовой Планер. Проверьте соединение с сервером.");
        } finally {
            clearInterval(timer);
            statusDiv.innerText = "";
            pdfBtn.disabled = false;
            pdfBtn.innerText = originalText;
        }
    });
});
