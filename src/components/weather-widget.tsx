"use client";

import { useEffect, useState } from "react";

type WeatherData = {
    city: string;
    temp: string;
    feelsLike: string;
    desc: string;
    code: number;
    wind: string;
    humidity: string;
    low: string;
    high: string;
    updatedAt: string;
};

function iconGroup(code: number): "clear" | "mostly-clear" | "partly-cloudy" | "cloudy" | "fog" | "drizzle" | "rain" | "snow" | "thunder" {
    if (code === 0) return "clear";
    if (code === 1) return "mostly-clear";
    if (code === 2) return "partly-cloudy";
    if (code === 3) return "cloudy";
    if (code === 45 || code === 48) return "fog";
    if (code >= 51 && code <= 57) return "drizzle";
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return "rain";
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return "snow";
    if (code >= 95) return "thunder";
    return "cloudy";
}

const SZ = 48;
const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

function SunIcon() {
    return (
        <svg width={SZ} height={SZ} viewBox="0 0 48 48" {...S}>
            <circle cx="24" cy="24" r="8" />
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
                const r = (Math.PI * deg) / 180;
                return <line key={deg} x1={24 + 12 * Math.cos(r)} y1={24 + 12 * Math.sin(r)} x2={24 + 17 * Math.cos(r)} y2={24 + 17 * Math.sin(r)} />;
            })}
        </svg>
    );
}
function CloudIcon() {
    return (
        <svg width={SZ} height={SZ} viewBox="0 0 48 48" {...S}>
            <path d="M12 34 a9 9 0 0 1 9-9h10a6 6 0 0 1 0 12H18a9 9 0 0 1-6-3" />
            <path d="M30 25 a7 7 0 0 0-5-12 7 7 0 0 0-6.5 4.5" />
        </svg>
    );
}
function PartlyCloudyIcon() {
    return (
        <svg width={SZ} height={SZ} viewBox="0 0 48 48" {...S}>
            <circle cx="16" cy="17" r="6" />
            {[300, 0, 60].map((deg) => {
                const r = (Math.PI * deg) / 180;
                return <line key={deg} x1={16 + 9 * Math.cos(r)} y1={17 + 9 * Math.sin(r)} x2={16 + 12 * Math.cos(r)} y2={17 + 12 * Math.sin(r)} />;
            })}
            <path d="M10 34 a8 8 0 0 1 8-8h10a6 6 0 0 1 0 12H16a8 8 0 0 1-6-4" />
        </svg>
    );
}
function RainIcon() {
    return (
        <svg width={SZ} height={SZ} viewBox="0 0 48 48" {...S}>
            <path d="M10 24 a9 9 0 0 1 9-9h10a6 6 0 0 1 0 12H15a9 9 0 0 1-5-3" />
            <path d="M29 21 a7 7 0 0 0-5.5-11 7 7 0 0 0-6 3.5" />
            <line x1="15" y1="34" x2="12" y2="43" />
            <line x1="24" y1="34" x2="21" y2="43" />
            <line x1="33" y1="34" x2="30" y2="43" />
        </svg>
    );
}
function SnowIcon() {
    return (
        <svg width={SZ} height={SZ} viewBox="0 0 48 48" {...S}>
            <path d="M10 24 a9 9 0 0 1 9-9h10a6 6 0 0 1 0 12H15a9 9 0 0 1-5-3" />
            <path d="M29 21 a7 7 0 0 0-5.5-11 7 7 0 0 0-6 3.5" />
            {[15, 24, 33].map((x) => (
                <g key={x}>
                    <circle cx={x} cy={38} r="1.5" fill="currentColor" />
                    <circle cx={x - 3} cy={42} r="1.5" fill="currentColor" />
                    <circle cx={x + 3} cy={42} r="1.5" fill="currentColor" />
                </g>
            ))}
        </svg>
    );
}
function ThunderIcon() {
    return (
        <svg width={SZ} height={SZ} viewBox="0 0 48 48" {...S}>
            <path d="M10 24 a9 9 0 0 1 9-9h10a6 6 0 0 1 0 12H15a9 9 0 0 1-5-3" />
            <path d="M29 21 a7 7 0 0 0-5.5-11 7 7 0 0 0-6 3.5" />
            <polyline points="26,32 21,40 25,40 20,48" strokeWidth="2" />
        </svg>
    );
}

function WeatherIcon({ code }: { code: number }) {
    const group = iconGroup(code);
    const icons: Record<string, React.ReactNode> = {
        "clear": <SunIcon />,
        "mostly-clear": <SunIcon />,
        "partly-cloudy": <PartlyCloudyIcon />,
        "cloudy": <CloudIcon />,
        "fog": <CloudIcon />,
        "drizzle": <RainIcon />,
        "rain": <RainIcon />,
        "snow": <SnowIcon />,
        "thunder": <ThunderIcon />,
    };
    return <span className="text-foreground">{icons[group]}</span>;
}

const REFRESH_MS = 10 * 60 * 1000;

export default function WeatherWidget() {
    const [data, setData] = useState<WeatherData | null>(null);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function fetchWeather() {
            try {
                const res = await fetch("/api/weather");
                if (!res.ok) throw new Error();
                const json = await res.json();
                if (json.error) throw new Error();
                if (!cancelled) { setData(json); setError(false); }
            } catch {
                if (!cancelled) setError(true);
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchWeather();
        const id = setInterval(fetchWeather, REFRESH_MS);
        return () => { cancelled = true; clearInterval(id); };
    }, []);

    if (loading) {
        return (
            <div className="bg-muted border border-border p-3.5 animate-pulse">
                <div className="h-3 bg-border rounded w-2/3 mb-3" />
                <div className="h-9 bg-border rounded w-1/2 mb-2" />
                <div className="h-3 bg-border rounded w-1/2" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="bg-muted border border-border p-3.5">
                <p className="font-sans text-[11px] text-muted-foreground">Weather unavailable</p>
            </div>
        );
    }

    const updated = new Date(data.updatedAt).toLocaleTimeString("sv-SE", { hour: "2-digit", minute: "2-digit" });

    return (
        <div className="bg-muted border border-border p-3.5">
            <p className="font-sans text-[11px] font-bold uppercase tracking-[0.06em] text-muted-foreground mb-2">
                {data.city}
            </p>
            <div className="flex items-center justify-between gap-2">
                <p className="font-serif text-[40px] font-bold leading-none text-foreground">{data.temp}</p>
                <WeatherIcon code={data.code} />
            </div>
            <p className="font-sans text-[13px] font-semibold text-foreground mt-1">{data.desc}</p>
            <p className="font-sans text-[11px] text-muted-foreground">Feels like {data.feelsLike}</p>
            <div className="mt-3 grid grid-cols-2 gap-y-1 font-sans text-[11px] text-muted-foreground">
                <span>Wind: {data.wind}</span>
                <span>Humidity: {data.humidity}</span>
                <span>Low: {data.low}</span>
                <span>High: {data.high}</span>
            </div>
            <p className="font-sans text-[9px] uppercase tracking-wider text-muted-foreground/60 mt-2.5">
                Updated {updated} · Refreshes every 10 min
            </p>
        </div>
    );
}
