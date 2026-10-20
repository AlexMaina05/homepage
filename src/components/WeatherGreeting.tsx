import React, { useState, useEffect } from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  Wind,
  Droplets,
  MapPin,
  RefreshCw,
  Sparkles
} from 'lucide-react';
import type { AppSettings } from '../types/service';

interface WeatherGreetingProps {
  settings: AppSettings;
  onOpenSettings: () => void;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  city: string;
}

export const WeatherGreeting: React.FC<WeatherGreetingProps> = ({
  settings,
  onOpenSettings,
}) => {
  const [greeting, setGreeting] = useState('');
  const [dateString, setDateString] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Compute greeting and date
  useEffect(() => {
    const updateGreetingAndDate = () => {
      const now = new Date();
      const hour = now.getHours();
      const userName = settings.userName?.trim() || 'Alex';

      if (hour >= 5 && hour < 13) {
        setGreeting(`Buongiorno, ${userName}`);
      } else if (hour >= 13 && hour < 18) {
        setGreeting(`Buon pomeriggio, ${userName}`);
      } else if (hour >= 18 && hour < 23) {
        setGreeting(`Buonasera, ${userName}`);
      } else {
        setGreeting(`Buonanotte, ${userName}`);
      }

      setDateString(
        now.toLocaleDateString('it-IT', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        })
      );
    };

    updateGreetingAndDate();
    const interval = setInterval(updateGreetingAndDate, 60000);
    return () => clearInterval(interval);
  }, [settings.userName]);

  // Fetch weather data from Open-Meteo
  const fetchWeather = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const city = settings.weatherCity?.trim() || 'Milano';
      let lat = settings.weatherLatitude ?? 45.4642;
      let lon = settings.weatherLongitude ?? 9.1900;

      // If coordinates not set, lookup city coordinates
      if (!settings.weatherLatitude || !settings.weatherLongitude) {
        try {
          const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
              city
            )}&count=1&language=it&format=json`
          );
          const geoData = await geoRes.json();
          if (geoData.results && geoData.results[0]) {
            lat = geoData.results[0].latitude;
            lon = geoData.results[0].longitude;
          }
        } catch {
          // Keep default lat/lon
        }
      }

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
      );
      const data = await res.json();

      if (data.current) {
        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          humidity: Math.round(data.current.relative_humidity_2m),
          windSpeed: Math.round(data.current.wind_speed_10m),
          weatherCode: data.current.weather_code,
          city: city
        });
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Meteo non disponibile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (settings.showWeather !== false) {
      fetchWeather();
    }
  }, [settings.weatherCity, settings.showWeather]);

  // Map WMO Weather code to Icon and Description
  const getWeatherInfo = (code: number) => {
    if (code === 0) return { icon: Sun, label: 'Sereno', color: 'text-amber-400' };
    if (code === 1 || code === 2) return { icon: CloudSun, label: 'Poco nuvoloso', color: 'text-amber-300' };
    if (code === 3) return { icon: Cloud, label: 'Coperto', color: 'text-slate-400' };
    if (code === 45 || code === 48) return { icon: CloudFog, label: 'Nebbia', color: 'text-slate-400' };
    if (code >= 51 && code <= 67) return { icon: CloudRain, label: 'Pioggia', color: 'text-cyan-400' };
    if (code >= 71 && code <= 77) return { icon: CloudSnow, label: 'Neve', color: 'text-blue-200' };
    if (code >= 95) return { icon: CloudLightning, label: 'Temporale', color: 'text-yellow-400' };
    return { icon: CloudSun, label: 'Variabile', color: 'text-cyan-300' };
  };

  const weatherInfo = weather ? getWeatherInfo(weather.weatherCode) : null;
  const WeatherIconComp = weatherInfo ? weatherInfo.icon : CloudSun;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/80 to-slate-950/90 border border-slate-800/80 p-5 shadow-xl shadow-black/20 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Subtle background glow */}
      <div className="absolute -left-12 -top-12 w-48 h-48 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />
      <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      {/* Left: Saluto e Data */}
      <div className="space-y-1 relative z-10">
        <div className="flex items-center gap-2">
          <span className="p-1 rounded-lg bg-cyan-500/10 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white capitalize">
            {greeting}
          </h2>
        </div>
        <p className="text-xs text-slate-400 capitalize pl-7">
          {dateString} • Homelab operativo
        </p>
      </div>

      {/* Right: Meteo Locale */}
      {settings.showWeather !== false && (
        <div className="relative z-10 flex items-center gap-4 bg-slate-950/60 border border-slate-800/80 rounded-xl px-4 py-2.5 shrink-0">
          {weather ? (
            <div className="flex items-center gap-3.5">
              <div className={`p-2 rounded-xl bg-slate-900 border border-slate-800/80 ${weatherInfo?.color}`}>
                <WeatherIconComp className="w-6 h-6 animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold font-mono text-white">
                    {weather.temperature}°C
                  </span>
                  <span className="text-xs text-slate-300 font-medium">
                    {weatherInfo?.label}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5">
                  <button
                    onClick={onOpenSettings}
                    className="flex items-center gap-1 hover:text-cyan-300 transition-colors"
                    title="Modifica città nelle impostazioni"
                  >
                    <MapPin className="w-3 h-3 text-cyan-500" />
                    <span>{weather.city}</span>
                  </button>
                  <span className="flex items-center gap-1">
                    <Droplets className="w-3 h-3 text-cyan-400" />
                    <span>{weather.humidity}%</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Wind className="w-3 h-3 text-slate-400" />
                    <span>{weather.windSpeed} km/h</span>
                  </span>
                </div>
              </div>

              <button
                onClick={fetchWeather}
                disabled={isLoading}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-colors ml-1"
                title="Aggiorna meteo"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
              </button>
            </div>
          ) : error ? (
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>{error}</span>
              <button
                onClick={fetchWeather}
                className="text-cyan-400 hover:underline text-[11px]"
              >
                Riprova
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Caricamento meteo...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
