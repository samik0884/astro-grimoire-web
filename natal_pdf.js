document.addEventListener('DOMContentLoaded', () => {
    const pdfBtn = document.getElementById('full-natal-pdf-btn');
    if (!pdfBtn) return;

    pdfBtn.addEventListener('click', async () => {
        const birthDate = document.getElementById('natal-date')?.value;
        if (!birthDate) {
            alert("Укажите дату рождения в разделе «Натальная карта»!");
            return;
        }

        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }

        pdfBtn.disabled = true;
        const originalText = pdfBtn.innerText;
        pdfBtn.innerText = "🪐 Сборка Натального Манускрипта...";

        let statusDiv = document.getElementById('natal-pdf-status');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'natal-pdf-status';
            statusDiv.style.color = '#e2c275';
            statusDiv.style.fontFamily = 'Philosopher, serif';
            statusDiv.style.marginTop = '8px';
            statusDiv.style.textAlign = 'center';
            statusDiv.style.fontStyle = 'italic';
            pdfBtn.parentNode.insertBefore(statusDiv, pdfBtn.nextSibling);
        }

        const statuses = [
            "🔮 Синтез ядра личности (Солнце и Луна)...",
            "🪐 Анализ 10 планет и Асцендента по знакам...",
            "🏛️ Расчёт событийных домов карты...",
            "📜 Переплёт монументального фолианта..."
        ];

        let idx = 0;
        statusDiv.innerText = statuses[idx];
        const timer = setInterval(() => {
            idx = (idx + 1) % statuses.length;
            statusDiv.innerText = statuses[idx];
        }, 3000);

        try {
            let latVal = parseFloat(document.getElementById('natal-lat')?.value) || 55.7558;
            let lonVal = parseFloat(document.getElementById('natal-lon')?.value) || 37.6173;
            const cityInput = document.getElementById('natal-city')?.value?.trim();

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

            const payload = {
                date: birthDate,
                time: document.getElementById('natal-time')?.value || "12:00",
                gender: document.getElementById('natal-gender')?.value === "man" ? "man" : "woman",
                lat: latVal,
                lon: lonVal,
                tz_offset: 3.0
            };

            const response = await fetch('/api/v1/natal/download-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("База натальной карты еще наполняется");

            const data = await response.json();
            const absoluteUrl = window.location.origin + data.url;

            if (window.Telegram?.WebApp?.initData) {
                window.Telegram.WebApp.openLink(absoluteUrl);
            } else {
                window.location.href = absoluteUrl;
            }
        } catch (err) {
            alert("Манускрипт в процессе наполнения или не указана дата рождения.");
        } finally {
            clearInterval(timer);
            statusDiv.innerText = "";
            pdfBtn.disabled = false;
            pdfBtn.innerText = originalText;
        }
    });
});
