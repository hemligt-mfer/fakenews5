"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Forecast } from "@/lib/types";
import { getForecastByCity, getForecastByCoordinates } from "@/lib/weather";
import { format } from "date-fns";
import {
  ChevronDownIcon,
  Search,
  Sun,
  CloudSun,
  Cloud,
  Cloudy,
  CloudRain,
  CloudDrizzle,
  CloudSnow,
  CloudLightning,
  CloudHail,
  Snowflake,
  LucideIcon,
} from "lucide-react";
import { createElement, useEffect, useState } from "react";
import { Spinner } from "./ui/spinner";

const weatherIcons: Record<number, LucideIcon> = {
  1: Sun, // Clear sky
  2: CloudSun, // Nearly clear sky
  3: CloudSun, // Variable cloudiness
  4: CloudSun, // Halfclear sky
  5: Cloud, // Cloudy sky
  6: Cloudy, // Overcast
  7: CloudRain, // Fog
  8: CloudDrizzle, // Light rain showers
  9: CloudRain, // Moderate rain showers
  10: CloudRain, // Heavy rain showers
  11: CloudLightning, // Thunderstorm
  12: CloudSnow, // Light sleet showers
  13: CloudSnow, // Moderate sleet showers
  14: CloudSnow, // Heavy sleet showers
  15: CloudSnow, // Light snow showers
  16: CloudSnow, // Moderate snow showers
  17: CloudSnow, // Heavy snow showers
  18: CloudDrizzle, // Light rain
  19: CloudRain, // Moderate rain
  20: CloudRain, // Heavy rain
  21: CloudLightning, // Thunder
  22: CloudHail, // Light sleet
  23: CloudHail, // Moderate sleet
  24: CloudHail, // Heavy sleet
  25: Snowflake, // Light snowfall
  26: Snowflake, // Moderate snowfall
  27: Snowflake, // Heavy snowfall
};

function getWeatherIcon(symbol: number): LucideIcon {
  return weatherIcons[symbol] ?? Cloud;
}

function WeatherIcon(symbol: number) {
  return createElement(getWeatherIcon(symbol));
}

function WeatherIconSM(symbol: number) {
  return createElement(getWeatherIcon(symbol), { className: "w-4 h-4" });
}

export default function WeatherApp() {
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!navigator.geolocation) {
      getForecastByCity("Stockholm").then(setForecast);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        getForecastByCoordinates(
          pos.coords.longitude,
          pos.coords.latitude,
        ).then(setForecast),
      () => getForecastByCity("Stockholm").then(setForecast),
    );
  }, []);

  function onSearch(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (query.trim()) {
      getForecastByCity(query.trim()).then(setForecast);
    }
  }
  if (!forecast) {
    return (
      <div className="flex items-center border bg-muted min-w-60 px-4 pb-4">
        {" "}
        <div className="flex gap-1 justify-center">
          <Spinner className="mt-1" />
          <p> Loading...</p>
        </div>{" "}
      </div>
    );
  }

  const now = forecast.timeseries[0];

  return (
    <div className="border bg-muted min-w-60 px-4 pb-4">
      <form
        onSubmit={onSearch}
        className="flex justify-center border rounded-2xl bg-card mt-4 focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent"
      >
        <input
          className="bg-card rounded-l-2xl text-center outline-none"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a city..."
        />
        <button className="cursor-pointer bg-card">
          <Search />
        </button>
      </form>

      <div className="m-4 pb-5 border-b border-black">
        <h1 className="text-2xl text-center mb-2">
          {forecast.location?.name ?? "Your location"}
        </h1>
        <div>
          <span className="flex justify-center gap-2 mb-1.5">
            {Math.round(now.temp)} °C {WeatherIcon(now.symbol)}
          </span>
          <p className="text-center">{now.summary}</p>
          <p className="text-center">
            Wind {now.windSpeed} m/s. Humidity {now.humidity}%
          </p>
        </div>
      </div>

      <Collapsible className="rounded-md data-[state=open]:bg-card">
        <CollapsibleTrigger asChild>
          <Button className="group w-full bg-card text-muted-foreground">
            Next hours
            <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col items-start p-2.5 pt-0 text-sm">
          <ul>
            {forecast.timeseries.slice(0, 12).map((t) => {
              return (
                <li key={t.validTime} className="flex items-center gap-2">
                  <span>{format(t.validTime, "HH:mm")}</span>
                  <span>{WeatherIconSM(t.symbol)}</span>
                  <span>{Math.round(t.temp)}°C</span>
                  <span className="truncate max-w-30">{t.summary}</span>
                </li>
              );
            })}
          </ul>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
