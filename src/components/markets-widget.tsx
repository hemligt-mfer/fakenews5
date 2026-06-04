"use client";

import { useEffect, useState } from "react";

type MarketItem = { label: string; value: string; change?: string; up?: boolean; live: boolean };
type MarketsData = { items: MarketItem[]; updatedAt: string };

const REFRESH_MS = 10 * 60 * 1000;

export default function MarketsWidget() {
    const [data,    setData]    = useState<MarketsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function fetchMarkets() {
            try {
                const res = await fetch("/api/markets");
                if (!res.ok) throw new Error();
                const json = await res.json();
                if (!cancelled) setData(json);
            } catch {
                // keep showing previous data
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchMarkets();
        const id = setInterval(fetchMarkets, REFRESH_MS);
        return () => { cancelled = true; clearInterval(id); };
    }, []);

    if (loading) {
        return (
            <ul className="divide-y divide-border animate-pulse">
                {[1, 2, 3, 4].map((i) => (
                    <li key={i} className="flex items-center justify-between py-2">
                        <div className="h-3 bg-muted rounded w-1/2" />
                        <div className="h-3 bg-muted rounded w-1/4" />
                    </li>
                ))}
            </ul>
        );
    }

    if (!data) {
        return <p className="font-sans text-[11px] text-muted-foreground">Markets unavailable</p>;
    }

    const updated = new Date(data.updatedAt).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });

    return (
        <>
            <ul className="divide-y divide-border">
                {data.items.map((m) => (
                    <li key={m.label} className="flex items-center justify-between py-2 font-sans text-[12px]">
                        <span className="text-foreground">{m.label}</span>
                        <span className="flex gap-2 items-center">
                            {m.change && m.change !== "–" && (
                                <span className={m.up ? "font-bold text-green-700" : "font-bold text-destructive"}>
                                    {m.change}
                                </span>
                            )}
                            <span className={m.live ? "text-foreground" : "text-muted-foreground"}>
                                {m.value}
                            </span>
                        </span>
                    </li>
                ))}
            </ul>
            <p className="font-sans text-[9px] uppercase tracking-wider text-muted-foreground/60 mt-2">
                Updated {updated} · Refreshes every 10 min
            </p>
        </>
    );
}
