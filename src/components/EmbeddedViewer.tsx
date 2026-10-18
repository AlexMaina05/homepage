import React, { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, RotateCw, Globe, AlertTriangle, Maximize2, ShieldAlert } from 'lucide-react';
import type { Service, AppSettings } from '../types/service';
import { ServiceIcon } from './ServiceIcon';
import { getServiceUrl } from '../utils/url';

interface EmbeddedViewerProps {
  service: Service;
  settings: AppSettings;
  onBack: () => void;
}

export const EmbeddedViewer: React.FC<EmbeddedViewerProps> = ({
  service,
  settings,
  onBack,
}) => {
  const url = getServiceUrl(service, settings);
  const [iframeKey, setIframeKey] = useState<number>(0);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<boolean>(true);

  const handleRefresh = () => {
    setHasLoaded(false);
    setIframeKey((prev) => prev + 1);
  };

  const handleOpenExternal = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleOpenPopout = () => {
    if (url) {
      window.open(url, service.name, 'width=1280,height=800,menubar=no,toolbar=no,location=yes');
    }
  };

  // Keyboard shortcut: Esc to return to Home
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onBack]);

  if (!url) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-slate-200 p-6">
        <ShieldAlert className="w-16 h-16 text-amber-400 mb-4" />
        <h2 className="text-2xl font-bold mb-2">{service.name} non ha interfaccia web</h2>
        <p className="text-slate-400 max-w-md text-center mb-6">
          Questo container opera come microservizio di background (senza porta web assegnata).
        </p>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-medium text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna alla Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-slate-100 select-none">
      {/* Top Application Bar */}
      <header className="h-14 px-4 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between gap-4">
        {/* Left: Back button + Service info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors border border-slate-700/60 font-medium text-sm"
            title="Torna alla Dashboard (Esc)"
          >
            <ArrowLeft className="w-4 h-4 text-cyan-400" />
            <span>Dashboard</span>
            <kbd className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">ESC</kbd>
          </button>

          <div className="h-5 w-[1px] bg-slate-800 hidden sm:block" />

          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: `${service.color || '#38bdf8'}22`,
                color: service.color || '#38bdf8'
              }}
            >
              <ServiceIcon name={service.icon} className="w-4 h-4" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm leading-tight text-white flex items-center gap-2">
                {service.name}
                <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-400 font-normal">
                  {service.category}
                </span>
              </span>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-mono text-cyan-400/90 hover:underline flex items-center gap-1 leading-none"
              >
                <Globe className="w-3 h-3" />
                {url}
              </a>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
            title="Ricarica pagina"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleOpenPopout}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-xs"
            title="Apri in finestra autonoma"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Finestra dedicata</span>
          </button>

          <button
            onClick={handleOpenExternal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 hover:text-cyan-200 border border-cyan-500/30 transition-colors text-xs font-medium"
            title="Apri in una nuova scheda del browser"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Nuova scheda</span>
          </button>
        </div>
      </header>

      {/* Frame info banner (collapsible) */}
      {showWarning && (
        <div className="bg-slate-900/95 border-b border-cyan-900/30 px-4 py-1.5 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              Se il microservizio rifiuta l'incorporamento (X-Frame-Options o CSP), usa il pulsante <strong>"Nuova scheda"</strong> o <strong>"Finestra dedicata"</strong> in alto a destra.
            </span>
          </div>
          <button
            onClick={() => setShowWarning(false)}
            className="text-slate-400 hover:text-white text-[11px] ml-4 underline shrink-0"
          >
            Nascondi
          </button>
        </div>
      )}

      {/* Main iframe */}
      <div className="relative flex-1 w-full bg-slate-950">
        {!hasLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 z-10 text-slate-400">
            <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs">Caricamento di {service.name}...</p>
          </div>
        )}

        <iframe
          key={iframeKey}
          src={url}
          title={service.name}
          onLoad={() => setHasLoaded(true)}
          className="w-full h-full border-0 bg-white"
          allow="camera; microphone; geolocation; fullscreen; clipboard-read; clipboard-write; autoplay"
        />
      </div>
    </div>
  );
};
