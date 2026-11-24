document.addEventListener('DOMContentLoaded', () => {
    const pdfBtn = document.getElementById('finance-pdf-btn');
    if (!pdfBtn) return;

    pdfBtn.addEventListener('click', async () => {
        const birthDate = document.getElementById('fin-birth-date')?.value;
        if (!birthDate) {
            alert("Укажите дату рождения в разделе «Финансовый код»!");
            return;
        }

        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }

        pdfBtn.disabled = true;
        const originalText = pdfBtn.innerText;
        pdfBtn.innerText = "💼 Сканирование домов капитала...";

        let statusDiv = document.getElementById('finance-pdf-status');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'finance-pdf-status';
            statusDiv.style.color = '#10b981';
            statusDiv.style.fontFamily = 'Philosopher, serif';
            statusDiv.style.marginTop = '8px';
            statusDiv.style.textAlign = 'center';
            statusDiv.style.fontStyle = 'italic';
            pdfBtn.parentNode.insertBefore(statusDiv, pdfBtn.nextSibling);
        }

        const statuses = [
            "💰 Анализ знака Солнца и денежных талантов...",
            "🌙 Расчет вектора Луны и внутренней опоры...",
            "🪐 Аудит финансовых правил Сатурна...",
            "📜 Сборка бизнес-стратегии в PDF..."
        ];

        let idx = 0;
        statusDiv.innerText = statuses[idx];
        const timer = setInterval(() => {
            idx = (idx + 1) % statuses.length;
            statusDiv.innerText = statuses[idx];
        }, 3000);

        try {
            let latVal = parseFloat(document.getElementById('fin-lat')?.value) || 55.7558;
            let lonVal = parseFloat(document.getElementById('fin-lon')?.value) || 37.6173;
            const cityInput = document.getElementById('fin-city')?.value?.trim();

            if (cityInput) {
                try {
                    const geoRes = await fetch(`/api/v1/cities/search?q=${encodeURIComponent(cityInput)}`);
                    const cities = await geoRes.json();
                    if (Array.isArray(cities) && cities.length > 0) {
                        const foundCity = cities.at(0);
                        latVal = foundCity.lat;
                        lonVal = foundCity.lon;
                    }
                } catch (e) {}
            }

            const payload = {
                date: birthDate,
                time: document.getElementById('fin-birth-time')?.value || "12:00",
                gender: document.getElementById('fin-gender')?.value === "man" ? "man" : "woman",
                lat: latVal,
                lon: lonVal,
                tz_offset: 3.0
            };

            const response = await fetch('/api/v1/finance/download-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("Ошибка генерации финансового кода");

                        const data = await response.json();
            const absoluteUrl = window.location.origin + data.url;

            if (window.Telegram?.WebApp?.initData) {
                window.Telegram.WebApp.openLink(absoluteUrl);
            } else {
                // В обычном браузере открываем напрямую, чтобы обойти блокировщик всплывающих окон
                window.location.href = absoluteUrl;
            }

        } catch (err) {
            console.error("❌ Сбой PDF финансового кода:", err);
            alert("Не удалось собрать Финансовый Код. Проверьте данные рождения.");
        } finally {
            clearInterval(timer);
            statusDiv.innerText = "";
            pdfBtn.disabled = false;
            pdfBtn.innerText = originalText;
        }
    });
});
