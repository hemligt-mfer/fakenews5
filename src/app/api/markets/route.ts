export const revalidate = 600;

function pctChange(current: number, previous: number): { change: string; up: boolean } {
    if (!previous || previous === 0) return { change: "–", up: true };
    const pct = ((current - previous) / previous) * 100;
    return {
        change: `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`,
        up: pct >= 0,
    };
}

function dateStr(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysAgo(n: number) {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return d;
}

export async function GET() {
    const now      = new Date();
    const today    = dateStr(now);
    const weekAgo  = dateStr(daysAgo(7));
    const yesterday = dateStr(daysAgo(1));

    const [omxRes, eurRes, usdRes, elTodayRes, elYesterdayRes] = await Promise.allSettled([
        fetch("https://api.nasdaq.com/api/quote/OMXS30/info?assetclass=index", {
            headers: { "User-Agent": "Mozilla/5.0" },
            next: { revalidate: 600 },
        }),
        // 7-day range gives us the last two trading days for % change
        fetch(`https://api.frankfurter.app/${weekAgo}..${today}?from=EUR&to=SEK`,
            { next: { revalidate: 600 } }),
        fetch(`https://api.frankfurter.app/${weekAgo}..${today}?from=USD&to=SEK`,
            { next: { revalidate: 600 } }),
        fetch(`https://www.elprisetjustnu.se/api/v1/prices/${today.slice(0, 4)}/${today.slice(5, 7)}-${today.slice(8, 10)}_SE3.json`,
            { next: { revalidate: 600 } }),
        fetch(`https://www.elprisetjustnu.se/api/v1/prices/${yesterday.slice(0, 4)}/${yesterday.slice(5, 7)}-${yesterday.slice(8, 10)}_SE3.json`,
            { next: { revalidate: 600 } }),
    ]);

    // ── OMX Stockholm 30 ──────────────────────────────────────────────────────
    let omxValue = "–", omxChange = "–", omxUp = true;
    if (omxRes.status === "fulfilled" && omxRes.value.ok) {
        const j = await omxRes.value.json();
        const p = j?.data?.primaryData;
        if (p?.lastSalePrice) {
            omxValue  = p.lastSalePrice;
            omxChange = p.percentageChange ?? "–";
            omxUp     = p.deltaIndicator === "up";
        }
    }

    // ── EUR/SEK ───────────────────────────────────────────────────────────────
    let eurValue = "–", eurChange = "–", eurUp = true;
    if (eurRes.status === "fulfilled" && eurRes.value.ok) {
        const j = await eurRes.value.json();
        const dates = Object.keys(j.rates ?? {}).sort();
        if (dates.length >= 2) {
            const current  = j.rates[dates[dates.length - 1]]?.SEK;
            const previous = j.rates[dates[dates.length - 2]]?.SEK;
            if (current) {
                eurValue = current.toFixed(2);
                if (previous) ({ change: eurChange, up: eurUp } = pctChange(current, previous));
            }
        } else if (dates.length === 1) {
            eurValue = j.rates[dates[0]]?.SEK?.toFixed(2) ?? "–";
        }
    }

    // ── USD/SEK ───────────────────────────────────────────────────────────────
    let usdValue = "–", usdChange = "–", usdUp = true;
    if (usdRes.status === "fulfilled" && usdRes.value.ok) {
        const j = await usdRes.value.json();
        const dates = Object.keys(j.rates ?? {}).sort();
        if (dates.length >= 2) {
            const current  = j.rates[dates[dates.length - 1]]?.SEK;
            const previous = j.rates[dates[dates.length - 2]]?.SEK;
            if (current) {
                usdValue = current.toFixed(2);
                if (previous) ({ change: usdChange, up: usdUp } = pctChange(current, previous));
            }
        } else if (dates.length === 1) {
            usdValue = j.rates[dates[0]]?.SEK?.toFixed(2) ?? "–";
        }
    }

    // ── Electricity SE3 ───────────────────────────────────────────────────────
    let elValue = "–", elChange = "–", elUp = true;

    async function avgKwh(res: PromiseSettledResult<Response>): Promise<number | null> {
        if (res.status !== "fulfilled" || !res.value.ok) return null;
        const hours: { SEK_per_kWh: number }[] = await res.value.json();
        if (!Array.isArray(hours) || hours.length === 0) return null;
        return hours.reduce((s, h) => s + h.SEK_per_kWh, 0) / hours.length;
    }

    const [elToday, elYesterday] = await Promise.all([
        avgKwh(elTodayRes),
        avgKwh(elYesterdayRes),
    ]);

    if (elToday !== null) {
        elValue = `${elToday.toFixed(2)} kr/kWh`;
        if (elYesterday !== null) {
            ({ change: elChange, up: elUp } = pctChange(elToday, elYesterday));
        }
    }

    return Response.json({
        items: [
            { label: "OMX Stockholm 30",  value: omxValue, change: omxChange, up: omxUp,  live: omxValue !== "–" },
            { label: "EUR/SEK",           value: eurValue, change: eurChange, up: eurUp,  live: eurValue !== "–" },
            { label: "USD/SEK",           value: usdValue, change: usdChange, up: usdUp,  live: usdValue !== "–" },
            { label: "Electricity (SE3)", value: elValue,  change: elChange,  up: elUp,   live: elValue  !== "–" },
        ],
        updatedAt: now.toISOString(),
    });
}
