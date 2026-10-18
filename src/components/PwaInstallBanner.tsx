import React, { useState, useEffect } from 'react';
import { Download, Monitor, CheckCircle, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showInstructions, setShowInstructions] = useState<boolean>(false);

  useEffect(() => {
    // Check if already running in standalone mode (installed app on Windows)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      setShowInstructions(true);
    }
  };

  if (isInstalled) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
        <CheckCircle className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">App installata su Windows</span>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-xs shadow-md shadow-cyan-900/30 border border-cyan-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        title="Installa questa pagina come applicazione desktop su Windows"
      >
        <Monitor className="w-3.5 h-3.5" />
        <span>Installa App</span>
      </button>

      {/* Manual installation guide modal if prompt isn't directly triggered */}
      {showInstructions && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-cyan-400" />
                <h3 className="font-semibold text-base">Come installare su Windows</h3>
              </div>
              <button
                onClick={() => setShowInstructions(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>Per aggiungere questa dashboard alla barra delle applicazioni e al menu Start di Windows:</p>
              
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="font-semibold text-cyan-300 flex items-center gap-1.5">
                  <Monitor className="w-4 h-4" /> Su Microsoft Edge o Google Chrome:
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-400 pl-1">
                  <li>
                    Guarda in alto a destra nella <strong>barra degli indirizzi</strong> del browser.
                  </li>
                  <li>
                    Fai clic sull'icona con il monitor / freccia (<strong>"App disponibile. Installa HomeServer"</strong>).
                  </li>
                  <li>
                    In alternativa: clicca sul menu a tre puntini <kbd className="px-1 py-0.5 bg-slate-800 rounded">⋮</kbd> del browser → <strong>App</strong> → <strong>Installa questo sito come app</strong>.
                  </li>
                  <li>
                    Seleziona <strong>Aggiungi alla barra delle applicazioni</strong> o <strong>Crea collegamento sul desktop</strong>!
                  </li>
                </ol>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowInstructions(false)}
                className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors"
              >
                Ho capito
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
