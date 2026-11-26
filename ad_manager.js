window.GrimoireAds = (function() {
    const ADSGRAM_BLOCK_ID = "61920";
    let controller = null;

    const s = document.createElement('script');
    s.src = ['https://sad.', 'adsgram', '.ai/js/sad.min.js'].join('');
    document.head.appendChild(s);

    function getController() {
        if (!controller && window.Adsgram) {
            controller = window.Adsgram.init({ blockId: ADSGRAM_BLOCK_ID, debug: false });
        }
        return controller;
    }

    function playFallbackOverlay(onDone) {
        const overlay = document.getElementById('grimoire-ad-overlay');
        const countdown = document.getElementById('grimoire-ad-countdown');
        if (!overlay || !countdown) { onDone(); return; }

        overlay.classList.remove('hidden');
        let sec = 4;
        countdown.textContent = `Трансляция эфира завершится через: ${sec} сек`;

        const timer = setInterval(() => {
            sec -= 1;
            if (sec > 0) {
                countdown.textContent = `Трансляция эфира завершится через: ${sec} сек`;
            } else {
                clearInterval(timer);
                overlay.classList.add('hidden');
                onDone();
            }
        }, 1000);
    }

    async function showRewarded(onSuccess) {
        if (window.USER_AD_FREE) { onSuccess(); return; }
        const ctrl = getController();
        try {
            if (!ctrl) throw new Error("Adsgram SDK not ready");
            const uid = window.getGrimoireUserId ? String(window.getGrimoireUserId()) : "0";
            await ctrl.show({ userId: uid });
            onSuccess();
        } catch (err) {
            console.warn("Adsgram fallback:", err);
            playFallbackOverlay(onSuccess);
        }
    }

    return { showRewarded };
})();

document.addEventListener('DOMContentLoaded', () => {
    const origConfirm = window.confirm;
    let skipConfirmOnce = false;
    window.confirm = function(msg) {
        if (skipConfirmOnce) { skipConfirmOnce = false; return true; }
        return origConfirm.call(window, msg);
    };

    const wrapWithAd = (fnName, freeArg) => {
        const orig = window[fnName];
        if (typeof orig !== 'function') return;
        window[fnName] = function(arg, el) {
            if (arg === freeArg || window.USER_AD_FREE) return orig(arg, el);
            window.GrimoireAds.showRewarded(() => {
                skipConfirmOnce = true;
                const ov = document.getElementById('grimoire-ad-overlay');
                if (ov) ov.id = 'grimoire-ad-overlay-muted';
                orig(arg, el);
                setTimeout(() => {
                    const muted = document.getElementById('grimoire-ad-overlay-muted');
                    if (muted) muted.id = 'grimoire-ad-overlay';
                }, 50);
            });
        };
    };

    wrapWithAd('switchAdviceMode', 'luna');
    wrapWithAd('triggerMatrixPacket', 'base');
    wrapWithAd('triggerBaziPacket', 'base');
});
// Инициализация нижнего баннера Adsgram (task-61930) на вкладке «Мой День»
document.addEventListener('DOMContentLoaded', () => {
    const mountMyDayBanner = () => {
        const slot = document.getElementById('myday-bottom-ad-slot');
        if (!slot || slot.dataset.adsMounted === '1') return;

        if (window.USER_AD_FREE) {
            slot.style.display = 'none';
            return;
        }

        slot.dataset.adsMounted = '1';
        slot.style.display = 'block';
        slot.innerHTML = '<adsgram-task data-block-id="task-61930" style="display:block;width:100%;"></adsgram-task>';

        const taskEl = slot.querySelector('adsgram-task');
        if (taskEl) {
            taskEl.addEventListener('onError', (e) => {
                console.warn('Adsgram task-61930 error/moderation:', e);
                slot.style.display = 'none';
            });
        }
    };

    mountMyDayBanner();
    const observer = new MutationObserver(() => mountMyDayBanner());
    observer.observe(document.body, { childList: true, subtree: true });
});
