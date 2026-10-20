import React, { useState } from 'react';
import { Download, Boxes, Music, Play, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import type { Service, AppSettings } from '../types/service';
import { getServiceUrl } from '../utils/url';

interface WidgetsBarProps {
  services: Service[];
  settings: AppSettings;
  onOpenServiceTab: (service: Service) => void;
}

export const WidgetsBar: React.FC<WidgetsBarProps> = ({
  services,
  settings,
  onOpenServiceTab,
}) => {
  const [downloadUrl, setDownloadUrl] = useState('');
  const [downloadStatus, setDownloadStatus] = useState<string | null>(null);

  const metubeService = services.find((s) => s.id === 'metube');
  const portainerService = services.find((s) => s.id === 'portainer');
  const navidromeService = services.find((s) => s.id === 'navidrome');
  const musicAssistantService = services.find((s) => s.id === 'music-assistant');

  // Quick download with MeTube
  const handleQuickDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!downloadUrl.trim() || !metubeService) return;

    const metubeUrl = getServiceUrl(metubeService, settings);
    if (!metubeUrl) return;

    setDownloadStatus('Invio a MeTube...');

    try {
      // MeTube API endpoint: POST /add { url: "..." }
      await fetch(`${metubeUrl}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: downloadUrl.trim(), quality: 'best', format: 'any' }),
        mode: 'no-cors' // Allows sending even with CORS restrictions
      });

      setDownloadStatus('Download avviato!');
      setDownloadUrl('');
      setTimeout(() => setDownloadStatus(null), 3000);
    } catch {
      // If direct API blocked by browser, open MeTube directly
      window.open(metubeUrl, '_blank');
      setDownloadStatus('Aperto MeTube');
      setTimeout(() => setDownloadStatus(null), 3000);
    }
  };

  const runningContainersCount = services.length;
  const webUiContainersCount = services.filter((s) => s.hasWebUi).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* Widget 1: MeTube Quick Downloader */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-red-950/20 border border-red-500/20 shadow-lg shadow-black/20 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-100">MeTube Quick Downloader</h3>
              <p className="text-[10px] text-slate-400">Incolla un URL per scaricarlo sul server</p>
            </div>
          </div>
          {metubeService && (
            <button
              onClick={() => onOpenServiceTab(metubeService)}
              className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-0.5"
            >
              Apri <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <form onSubmit={handleQuickDownload} className="flex items-center gap-1.5 mt-1">
          <input
            type="text"
            value={downloadUrl}
            onChange={(e) => setDownloadUrl(e.target.value)}
            placeholder="URL YouTube, Vimeo, TikTok..."
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-red-500/50 font-mono"
          />
          <button
            type="submit"
            disabled={!downloadUrl.trim()}
            className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white font-medium text-xs transition-colors shrink-0 shadow-md shadow-red-950/30"
          >
            Scarica
          </button>
        </form>
        {downloadStatus && (
          <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
            <CheckCircle2 className="w-3 h-3" /> {downloadStatus}
          </span>
        )}
      </div>

      {/* Widget 2: Portainer & Docker Overview */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-cyan-950/20 border border-cyan-500/20 shadow-lg shadow-black/20 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Boxes className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-100">Docker & Portainer Hub</h3>
              <p className="text-[10px] text-slate-400">Stato container del server</p>
            </div>
          </div>
          {portainerService && (
            <button
              onClick={() => onOpenServiceTab(portainerService)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5"
            >
              Portainer <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block leading-none">Container Totali</span>
              <span className="font-bold text-sm text-slate-100 font-mono">{runningContainersCount}</span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 block leading-none">Con Web UI</span>
              <span className="font-bold text-sm text-slate-100 font-mono">{webUiContainersCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Widget 3: Media & Audio Streaming */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-purple-950/20 border border-purple-500/20 shadow-lg shadow-black/20 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Music className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-100">Media & Musica Personale</h3>
              <p className="text-[10px] text-slate-400">Navidrome & Music Assistant</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1">
          {navidromeService && (
            <button
              onClick={() => onOpenServiceTab(navidromeService)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-medium transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Navidrome</span>
            </button>
          )}

          {musicAssistantService && (
            <button
              onClick={() => onOpenServiceTab(musicAssistantService)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-medium transition-colors"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Music Assistant</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
