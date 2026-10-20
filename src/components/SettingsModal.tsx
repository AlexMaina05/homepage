import React, { useRef } from 'react';
import { X, Server, Globe, Download, Upload, RotateCcw, Shield, LayoutGrid, Sun, User } from 'lucide-react';
import type { AppSettings, Service } from '../types/service';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  services: Service[];
  onImportServices: (services: Service[]) => void;
  onResetServices: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  services,
  onImportServices,
  onResetServices,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(services, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "services.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed)) {
            onImportServices(parsed);
            alert("Microservizi importati con successo!");
          } else {
            alert("Il file JSON non contiene un array valido di servizi.");
          }
        } catch {
          alert("Errore durante la lettura del file JSON.");
        }
      };
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Impostazioni Server & Dashboard</h2>
              <p className="text-xs text-slate-400">Configura indirizzi, modalità di apertura, meteo e backup</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Server Host */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
              <span>Indirizzo IP / Hostname del Server</span>
              <span className="text-[11px] text-slate-500">Es. 192.168.1.100 o server.lan</span>
            </label>
            <div className="relative flex items-center">
              <Globe className="w-4 h-4 absolute left-3 text-slate-500" />
              <input
                type="text"
                value={settings.serverHost}
                onChange={(e) => onUpdateSettings({ ...settings, serverHost: e.target.value })}
                placeholder="192.168.1.100 oppure localhost"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/60 font-mono"
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Tutti i microservizi con porta definita useranno questo indirizzo per generare i link.
            </p>
          </div>

          {/* User Name & Weather City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1 mb-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>Tuo Nome (per il saluto)</span>
              </label>
              <input
                type="text"
                value={settings.userName ?? 'Alex'}
                onChange={(e) => onUpdateSettings({ ...settings, userName: e.target.value })}
                placeholder="es. Alex"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1 mb-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Città per il Meteo</span>
              </label>
              <input
                type="text"
                value={settings.weatherCity ?? 'Milano'}
                onChange={(e) => onUpdateSettings({ ...settings, weatherCity: e.target.value })}
                placeholder="es. Milano, Roma, Torino..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/60"
              />
            </div>
          </div>

          {/* Default Protocol & Open mode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Protocollo predefinito
              </label>
              <select
                value={settings.defaultProtocol}
                onChange={(e) => onUpdateSettings({ ...settings, defaultProtocol: e.target.value as 'http' | 'https' })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/60"
              >
                <option value="http">HTTP (es. LAN locale)</option>
                <option value="https">HTTPS (SSL / Domini)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1.5">
                Apertura servizi
              </label>
              <select
                value={settings.openMode}
                onChange={(e) => onUpdateSettings({ ...settings, openMode: e.target.value as 'iframe' | 'new_tab' })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/60"
              >
                <option value="iframe">In schede interne (Multi-Tab PWA)</option>
                <option value="new_tab">In nuova scheda del browser</option>
              </select>
            </div>
          </div>

          {/* Toggle Weather & Greeting */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <Sun className="w-5 h-5 text-amber-400" />
              <div>
                <p className="text-sm font-medium">Mostra Banner Saluto & Meteo</p>
                <p className="text-xs text-slate-400">Previsioni locali automatiche da Open-Meteo e data estesa</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showWeather !== false}
                onChange={(e) => onUpdateSettings({ ...settings, showWeather: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          {/* Toggle Interactive Widgets */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <LayoutGrid className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-sm font-medium">Mostra Mini-Widget Interattivi</p>
                <p className="text-xs text-slate-400">Pannelli rapidi MeTube downloader, Portainer hub e musica</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.enableWidgets !== false}
                onChange={(e) => onUpdateSettings({ ...settings, enableWidgets: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          {/* Toggle Backend Services */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-indigo-400" />
              <div>
                <p className="text-sm font-medium">Mostra microservizi di background</p>
                <p className="text-xs text-slate-400">Includi container come Mosquitto, AirConnect, Cloudflare Tunnel</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showBackendServices}
                onChange={(e) => onUpdateSettings({ ...settings, showBackendServices: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          {/* Backup & Restore */}
          <div className="pt-2 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Gestione Dati & Backup (services.json)
            </h3>
            
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleExportJson}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors"
              >
                <Download className="w-4 h-4 text-cyan-400" />
                <span>Esporta services.json</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-xs font-medium text-slate-200 transition-colors"
              >
                <Upload className="w-4 h-4 text-emerald-400" />
                <span>Importa services.json</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            <button
              type="button"
              onClick={() => {
                if (confirm("Vuoi davvero ripristinare la lista predefinita dei tuoi microservizi?")) {
                  onResetServices();
                  onClose();
                }
              }}
              className="mt-2.5 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 text-xs font-medium text-red-300 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ripristina microservizi predefiniti</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-medium text-sm text-white transition-colors"
          >
            Fatto
          </button>
        </div>
      </div>
    </div>
  );
};
