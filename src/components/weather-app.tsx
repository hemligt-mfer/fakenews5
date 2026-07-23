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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

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

const weatherBackgrounds: Record<number, string> = {
  1: "/backgrounds/clear.avif",
  2: "/backgrounds/clear.avif",
  3: "/backgrounds/cloudy.jpg",
  4: "/backgrounds/cloudy.jpg",
  5: "/backgrounds/cloudy.jpg",
  6: "/backgrounds/cloudy.jpg",
  7: "/backgrounds/fog.jpg",
  8: "/backgrounds/rain.jpg",
  9: "/backgrounds/rain.jpg",
  10: "/backgrounds/rain.jpg",
  11: "/backgrounds/thunder.jpg",
  12: "/backgrounds/snow.jpg",
  13: "/backgrounds/snow.jpg",
  14: "/backgrounds/snow.jpg",
  15: "/backgrounds/snow.jpg",
  16: "/backgrounds/snow.jpg",
  17: "/backgrounds/snow.jpg",
  18: "/backgrounds/rain.jpg",
  19: "/backgrounds/rain.jpg",
  20: "/backgrounds/rain.jpg",
  21: "/backgrounds/thunder.jpg",
  22: "/backgrounds/snow.jpg",
  23: "/backgrounds/snow.jpg",
  24: "/backgrounds/snow.jpg",
  25: "/backgrounds/snow.jpg",
  26: "/backgrounds/snow.jpg",
  27: "/backgrounds/snow.jpg",
};

function getWeatherBackground(symbol: number): string {
  return weatherBackgrounds[symbol] ?? "/weather.jpg";
}

function getWeatherIcon(symbol: number): LucideIcon {
  return weatherIcons[symbol] ?? Cloud;
}

function WeatherIcon(symbol: number) {
  return createElement(getWeatherIcon(symbol));
}

function WeatherIconSM(symbol: number) {
  return createElement(getWeatherIcon(symbol), { className: "w-4 h-4" });
}

function WeatherIconMD(symbol: number) {
  return createElement(getWeatherIcon(symbol), {
    className: "w-8 h-8 mx-auto block",
  });
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

  function chunk<T>(arr: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
      result.push(arr.slice(i, i + size));
    }
    return result;
  }

  function groupByDay(entries: Forecast["timeseries"]) {
    const groups: Record<string, Forecast["timeseries"]> = {};
    entries.forEach((t) => {
      const day = format(t.validTime, "yyyy-MM-dd");
      if (!groups[day]) groups[day] = [];
      groups[day].push(t);
    });
    return Object.entries(groups);
  }


  function summarizeDay(entries: Forecast["timeseries"]) {
  const avgTemp =
    entries.reduce((sum, t) => sum + t.temp, 0) / entries.length;

  const midday = entries.reduce((best, t) =>
    Math.abs(new Date(t.validTime).getHours() - 12) < Math.abs(new Date(best.validTime).getHours() - 12)
      ? t
      : best
  );

  return {
    avgTemp,
    symbol: midday.symbol,
    summary: midday.summary,
    date: entries[0].validTime,
  };
}

  const now = forecast.timeseries[0];

  const bg = forecast.timeseries[0];
  const bgImage = getWeatherBackground(bg.symbol);

  return (
    <div className="border bg-[url('/weather.jpg')] bg-cover min-w-60 px-2 pb-4 relative" style={{ backgroundImage: `url(${bgImage})`, transition: "background-image 0.6s ease" }}>
      <div className="bg-white/30">
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

      <Carousel className="relative px-6 pb-4">
        <CarouselContent>
          {chunk(forecast.timeseries.slice(0, 12), 3).map((group, i) => (
            <CarouselItem key={i} className="grid grid-cols-3 gap-2">
              {group.map((t) => (
                <div
                  className=" mx-auto text-[14px] align-middle"
                  key={t.validTime}
                >
                  <div className="text-center">
                    {format(t.validTime, "HH:mm")}
                  </div>
                  <div className="text-center">{WeatherIconMD(t.symbol)}</div>
                  <div className="text-[14px] text-center max-w-20 font-bold">
                    {Math.round(t.temp)}°C
                  </div>
                  <div className="text-[10px] text-center max-w-20">
                    {t.summary}
                  </div>
                </div>
              ))}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 h-7 w-7 cursor-pointer" />
        <CarouselNext className="right-0 h-7 w-7 cursor-pointer" />
      </Carousel>

      <Collapsible className="rounded-md data-[state=open]:bg-card w-full">
        <CollapsibleTrigger asChild>
          <Button className="group w-full bg-card text-muted-foreground cursor-pointer">
            Upcoming days
            <ChevronDownIcon className="ml-auto group-data-[state=open]:rotate-180" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="flex flex-col items-start p-2.5 pt-0 text-sm w-full">
  <ul className="w-full">
    {groupByDay(forecast.timeseries).map(([day, entries]) => {
      const { avgTemp, symbol, summary, date } = summarizeDay(entries);
      return (
        <li key={day} className="flex flex-row gap-3 w-full">
          <span>{format(date, "MMM d")}</span>
          <span className="flex items-center gap-1">
            {WeatherIconSM(symbol)}
            <span>{Math.round(avgTemp)}°C</span>
          </span>
          <span className="truncate">{summary}</span>
        </li>
      );
    })}
  </ul>
</CollapsibleContent>
      </Collapsible>
    </div>
    </div>
  );
}
