import { Forecast } from "./types";

const BASE = "https://weather.lexlink.se";

async function fetchForecast(url: string): Promise<Forecast> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API error ${response.status}`);
  }
  return response.json();
}

export function getForecastByCoordinates(
  longitude: number,
  latitude: number,
): Promise<Forecast> {
  return fetchForecast(`${BASE}/forecast/point/${longitude}/${latitude}`);
}

export function getForecastByCity(
  city: string
): Promise<Forecast> {
  return fetchForecast(`${BASE}/forecast/location/${encodeURIComponent(city)}`);
}
