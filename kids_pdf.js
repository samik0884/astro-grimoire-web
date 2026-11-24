document.addEventListener('DOMContentLoaded', () => {
    const pdfBtn = document.getElementById('kids-pdf-btn');
    if (!pdfBtn) return;

    pdfBtn.addEventListener('click', async () => {
        const birthDate = document.getElementById('kids-birth-date')?.value;
        if (!birthDate) {
            alert("Укажите дату рождения ребенка!");
            return;
        }

        if (window.Telegram?.WebApp?.HapticFeedback) {
            window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
        }

        pdfBtn.disabled = true;
        const originalText = pdfBtn.innerText;
        pdfBtn.innerText = "🧸 Создание Детского Путеводителя...";

        let statusDiv = document.getElementById('kids-pdf-status');
        if (!statusDiv) {
            statusDiv = document.createElement('div');
            statusDiv.id = 'kids-pdf-status';
            statusDiv.style.color = '#38bdf8';
            statusDiv.style.fontFamily = 'Philosopher, serif';
            statusDiv.style.marginTop = '8px';
            statusDiv.style.textAlign = 'center';
            statusDiv.style.fontStyle = 'italic';
            pdfBtn.parentNode.insertBefore(statusDiv, pdfBtn.nextSibling);
        }

        const statuses = [
            "☀️ Анализ природного таланта и темперамента...",
            "🌙 Изучение эмоционального мира ребенка...",
            "📚 Поиск ключей к обучению и развитию...",
            "✨ Верстка энциклопедии для родителей..."
        ];

        let idx = 0;
        statusDiv.innerText = statuses[idx];
        const timer = setInterval(() => {
            idx = (idx + 1) % statuses.length;
            statusDiv.innerText = statuses[idx];
        }, 3000);

        try {
            let latVal = parseFloat(document.getElementById('kids-lat')?.value) || 55.7558;
            let lonVal = parseFloat(document.getElementById('kids-lon')?.value) || 37.6173;
            const cityInput = document.getElementById('kids-city')?.value?.trim();

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
                time: document.getElementById('kids-birth-time')?.value || "12:00",
                gender: document.getElementById('kids-gender')?.value === "man" ? "man" : "woman",
                lat: latVal,
                lon: lonVal,
                tz_offset: 3.0
            };

            const response = await fetch('/api/v1/kids/download-pdf', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error("База детского гороскопа еще наполняется");

            const data = await response.json();
            const absoluteUrl = window.location.origin + data.url;

            if (window.Telegram?.WebApp?.initData) {
                window.Telegram.WebApp.openLink(absoluteUrl);
            } else {
                window.location.href = absoluteUrl;
            }
        } catch (err) {
            alert("Детский путеводитель в процессе наполнения или не указана дата.");
        } finally {
            clearInterval(timer);
            statusDiv.innerText = "";
            pdfBtn.disabled = false;
            pdfBtn.innerText = originalText;
        }
    });
});
