export const revalidate = 600; // cache for 10 minutes

const LAT = 58.4108;
const LON = 15.6214;
const CITY = "Linköping, SE";

const WMO_DESC: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Foggy",
  48: "Icy fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Rain showers",
  81: "Rain showers",
  82: "Heavy showers",
  85: "Snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm",
  99: "Thunderstorm",
};

export async function GET() {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${LAT}&longitude=${LON}` +
      `&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m` +
      `&daily=temperature_2m_max,temperature_2m_min` +
      `&wind_speed_unit=kmh&temperature_unit=celsius` +
      `&timezone=Europe%2FStockholm&forecast_days=1`;

    const res = await fetch(url, { next: { revalidate: 600 } });
    if (!res.ok) throw new Error(`Open-Meteo ${res.status}`);
    const raw = await res.json();

    const c = raw.current;
    const d = raw.daily;
    const code = c.weather_code as number;

    return Response.json({
      city: CITY,
      temp: `${Math.round(c.temperature_2m)}°C`,
      feelsLike: `${Math.round(c.apparent_temperature)}°C`,
      desc: WMO_DESC[code] ?? "Unknown",
      code,
      wind: `${Math.round(c.wind_speed_10m)} km/h`,
      humidity: `${c.relative_humidity_2m}%`,
      low: `${Math.round(d.temperature_2m_min[0])}°C`,
      high: `${Math.round(d.temperature_2m_max[0])}°C`,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return Response.json({ error: true }, { status: 502 });
  }
}
