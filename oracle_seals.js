document.addEventListener('DOMContentLoaded', () => {
    const fmtTime = (sec) => {
        const h = String(Math.floor(sec / 3600)).padStart(2, '0');
        const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
        const s = String(sec % 60).padStart(2, '0');
        return `${h}:${m}:${s}`;
    };

    const origFetch = window.fetch;
    window.fetch = async function(resource, options) {
        const url = typeof resource === 'string' ? resource : (resource?.url || '');
        const match = url.match(/\/api\/v1\/(taro|runes|iching|ramli)\/draw/);
        if (!match || !options?.body) return origFetch.call(this, resource, options);

        const oracle = match[1];
        let bodyObj = {};
        try { bodyObj = JSON.parse(options.body); } catch (e) {}
        const spreadName = bodyObj.mode || bodyObj.spread_type || 'default';
        const spreadKey = `${oracle}_${spreadName}`;
        const userId = window.getGrimoireUserId ? window.getGrimoireUserId() : 0;

        if (userId) {
            try {
                const chkRes = await origFetch.call(this, '/api/v1/oracle/seal-check', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId, spread_key: spreadKey })
                });
                const seal = await chkRes.json();
                if (seal.locked) {
                    const msg = seal.can_unlock
                        ? `⏳ Печать Оракула активна ещё ${fmtTime(seal.left_sec)}.\n\nСнять печать досрочно за 2 💎? (Баланс: ${window.USER_CRYSTALS ?? 0} 💎)`
                        : `🔒 Карты не любят суеты.\n\nПечать Оракула держится ещё ${fmtTime(seal.left_sec)}.\nДосрочное снятие за 2 💎 откроется через ${fmtTime(seal.unlock_in_sec)}.`;

                    if (seal.can_unlock && confirm(msg)) {
                        const unlRes = await origFetch.call(this, '/api/v1/oracle/seal-unlock', {
                            method: 'POST', headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ user_id: userId, spread_key: spreadKey })
                        });
                        const unlData = await unlRes.json();
                        if (unlData.status === 'ok') {
                            if (window.syncUserWallet) window.syncUserWallet();
                        } else {
                            alert(unlData.message || 'Не удалось снять печать.');
                            return new Response(JSON.stringify(seal.saved), { status: 200, headers: { 'Content-Type': 'application/json' } });
                        }
                    } else {
                        if (!seal.can_unlock) alert(msg);
                        return new Response(JSON.stringify(seal.saved), { status: 200, headers: { 'Content-Type': 'application/json' } });
                    }
                }
            } catch (e) {}
        }

        const realRes = await origFetch.call(this, resource, options);
        if (realRes.ok && userId) {
            try {
                const cloneData = await realRes.clone().json();
                origFetch.call(this, '/api/v1/oracle/seal-save', {
                    method: 'POST', headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ user_id: userId, spread_key: spreadKey, result_json: JSON.stringify(cloneData) })
                }).catch(() => {});
            } catch (e) {}
        }
        return realRes;
    };
});
