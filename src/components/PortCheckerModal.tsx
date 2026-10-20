import React, { useState } from 'react';
import { X, Network, AlertTriangle, CheckCircle2, Copy, Check, Sparkles, Terminal } from 'lucide-react';
import type { Service } from '../types/service';

interface PortCheckerModalProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
}

export const PortCheckerModal: React.FC<PortCheckerModalProps> = ({
  isOpen,
  onClose,
  services,
}) => {
  const [newServiceName, setNewServiceName] = useState('');
  const [selectedPort, setSelectedPort] = useState<number | null>(null);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  if (!isOpen) return null;

  // Extract all services that have a port
  const servicesWithPorts = services.filter((s) => typeof s.port === 'number') as (Service & { port: number })[];

  // Map of port -> services using it
  const portMap = new Map<number, Service[]>();
  servicesWithPorts.forEach((s) => {
    const list = portMap.get(s.port) || [];
    list.push(s);
    portMap.set(s.port, list);
  });

  // Check for conflicts
  const conflicts = Array.from(portMap.entries()).filter(([_, srvs]) => srvs.length > 1);

  // Sorted list of occupied ports
  const occupiedPorts = Array.from(portMap.keys()).sort((a, b) => a - b);

  // Common suggested ports that are free
  const candidatePorts = [8080, 8081, 8088, 3001, 3050, 4000, 5000, 8090, 8888, 9090, 9443];
  const suggestedFreePorts = candidatePorts.filter((p) => !portMap.has(p)).slice(0, 5);

  const activePort = selectedPort || (suggestedFreePorts[0] ?? 8080);
  const safeServiceName = (newServiceName.trim() || 'mio-container').toLowerCase().replace(/[^a-z0-9_-]/g, '-');

  const dockerSnippet = `  ${safeServiceName}:
    image: ${safeServiceName}:latest
    container_name: ${safeServiceName}
    restart: unless-stopped
    ports:
      - "${activePort}:${activePort}"
    environment:
      - TZ=Europe/Rome
    volumes:
      - ./${safeServiceName}-data:/data`;

  const handleCopySnippet = () => {
    navigator.clipboard.writeText(dockerSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 text-slate-100 max-h-[85vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">Port Conflict Checker & Docker Helper</h2>
              <p className="text-xs text-slate-400">Mappa delle porte del server e generatore snippet Docker</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conflict Alert (if any) */}
        {conflicts.length > 0 ? (
          <div className="my-4 p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-semibold mb-1">Attenzione: Conflitto di porte rilevato!</strong>
              {conflicts.map(([port, srvs]) => (
                <div key={port}>
                  La porta <strong>:{port}</strong> è assegnata a più servizi: {srvs.map((s) => s.name).join(', ')}.
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="my-4 p-3 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Nessun conflitto rilevato! Tutte le {occupiedPorts.length} porte sono assegnate in modo univoco.</span>
          </div>
        )}

        {/* Occupied Ports Grid */}
        <div className="space-y-2 mb-5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Porte Attualmente Assegnate ({occupiedPorts.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {occupiedPorts.map((port) => {
              const srvs = portMap.get(port) || [];
              const isConflict = srvs.length > 1;

              return (
                <div
                  key={port}
                  className={`p-2 rounded-xl border flex flex-col justify-between ${
                    isConflict
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-300'
                      : 'bg-slate-950/80 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-sm text-cyan-400">
                      :{port}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {srvs[0]?.category}
                    </span>
                  </div>
                  <span className="text-xs font-medium truncate mt-1">
                    {srvs.map((s) => s.name).join(' / ')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Suggested Free Ports */}
        <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 mb-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Porte Libere Consigliate per Nuovi Container:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedFreePorts.map((p) => {
              const isChosen = activePort === p;
              return (
                <button
                  key={p}
                  onClick={() => setSelectedPort(p)}
                  className={`px-3 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all ${
                    isChosen
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 ring-2 ring-cyan-400'
                      : 'bg-slate-900 hover:bg-slate-850 text-cyan-300 border border-slate-800'
                  }`}
                >
                  :{p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Docker Compose Snippet Generator */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-semibold text-slate-200">
                Generatore Rapido Docker Compose (Porta :{activePort})
              </h4>
            </div>
            <button
              onClick={handleCopySnippet}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors shadow-md shadow-cyan-950"
            >
              {copiedSnippet ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSnippet ? 'Copiato!' : 'Copia Snippet'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="Nome nuovo servizio (es. uptime-kuma, qbittorrent)"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-mono"
            />
          </div>

          <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-cyan-300/90 overflow-x-auto select-all">
            {dockerSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
