import React, { useState, useEffect } from 'react';
import { ExternalLink, RotateCw, Globe, AlertTriangle, Maximize2, X } from 'lucide-react';
import type { AppTab } from '../types/service';
import { ServiceIcon } from './ServiceIcon';

interface EmbeddedViewerProps {
  tab: AppTab;
  isActive: boolean;
  onCloseTab: () => void;
}

export const EmbeddedViewer: React.FC<EmbeddedViewerProps> = ({
  tab,
  isActive,
  onCloseTab,
}) => {
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<boolean>(true);

  const handleRefresh = () => {
    setHasLoaded(false);
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenExternal = () => {
    if (tab.url) {
      window.open(tab.url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenPopout = () => {
    if (tab.url) {
      window.open(tab.url, tab.title, 'width=1280,height=800,menubar=no,toolbar=no,location=yes');
    }
  };

  // Keyboard shortcut: Esc or Ctrl+W to close active tab
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseTab();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onCloseTab]);

  return (
    <div
      style={{ display: isActive ? 'flex' : 'none' }}
      className="flex-1 min-h-0 w-full flex flex-col bg-slate-950 text-slate-100 select-none overflow-hidden"
    >
      {/* Sub-header Controls Bar for this tab */}
      <div className="h-10 px-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs shrink-0">
        {/* Left: Icon, Name and URL */}
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
            style={{
              backgroundColor: `${tab.color || '#38bdf8'}22`,
              color: tab.color || '#38bdf8'
            }}
          >
            <ServiceIcon name={tab.icon} className="w-3.5 h-3.5" />
          </div>

          <span className="font-semibold text-slate-200 truncate">
            {tab.title}
          </span>

          <span className="text-slate-600 hidden sm:inline">•</span>

          <a
            href={tab.url}
            target="_blank"
            rel="noreferrer"
            className="text-[11px] font-mono text-cyan-400/80 hover:underline truncate hidden sm:flex items-center gap-1"
          >
            <Globe className="w-3 h-3 shrink-0" />
            <span className="truncate">{tab.url}</span>
          </a>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleRefresh}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Ricarica pagina"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleOpenPopout}
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-[11px]"
            title="Apri in finestra dedicata"
          >
            <Maximize2 className="w-3 h-3" />
            <span>Finestra</span>
          </button>

          <button
            onClick={handleOpenExternal}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 transition-colors text-[11px] font-medium"
            title="Apri nel browser esterno"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Esterno</span>
          </button>

          <div className="h-4 w-[1px] bg-slate-800 mx-0.5" />

          <button
            onClick={onCloseTab}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
            title="Chiudi questa scheda (Esc)"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frame info banner (collapsible) */}
      {showWarning && (
        <div className="bg-slate-900/95 border-b border-cyan-900/30 px-4 py-1.5 flex items-center justify-between text-xs text-slate-300 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              Se il servizio blocca la visualizzazione (X-Frame-Options), usa il pulsante <strong>"Esterno"</strong> o <strong>"Finestra"</strong> in alto a destra.
            </span>
          </div>
          <button
            onClick={() => setShowWarning(false)}
            className="text-slate-400 hover:text-white text-[11px] ml-4 underline shrink-0 cursor-pointer"
          >
            Nascondi
          </button>
        </div>
      )}

      {/* Main iframe container (fills 100% of remaining vertical height) */}
      <div className="relative flex-1 min-h-0 w-full bg-slate-950">
        {!hasLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 z-10 text-slate-400">
            <div className="w-7 h-7 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-xs">Caricamento di {tab.title}...</p>
          </div>
        )}

        <iframe
          key={iframeKey}
          src={tab.url}
          title={tab.title}
          onLoad={() => setHasLoaded(true)}
          className="absolute inset-0 w-full h-full border-0 bg-white"
          allow="camera; microphone; geolocation; fullscreen; clipboard-read; clipboard-write; autoplay"
        />
      </div>
    </div>
  );
};
