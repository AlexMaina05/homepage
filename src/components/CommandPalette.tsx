import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Settings, Download, Globe, Star, ArrowRight } from 'lucide-react';
import type { Service, AppSettings } from '../types/service';
import { ServiceIcon } from './ServiceIcon';
import { getDisplayUrl } from '../utils/url';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  settings: AppSettings;
  onSelectService: (service: Service) => void;
  onOpenSettings: () => void;
  onNewService: () => void;
  onSelectCategory: (cat: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  services,
  onSelectService,
  onOpenSettings,
  onNewService,
  onSelectCategory,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Combine services and actions
  const matchedServices = services.filter((s) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.description?.toLowerCase().includes(q) ||
      s.port?.toString().includes(q) ||
      s.stack?.toLowerCase().includes(q)
    );
  });

  const actions = [
    {
      id: 'action-new-service',
      title: 'Aggiungi Nuovo Microservizio',
      subtitle: 'Configura un nuovo container o link web',
      icon: Plus,
      category: 'Azioni',
      action: () => {
        onNewService();
        onClose();
      }
    },
    {
      id: 'action-settings',
      title: 'Apri Impostazioni Dashboard',
      subtitle: 'Modifica host IP, protocollo, backup',
      icon: Settings,
      category: 'Azioni',
      action: () => {
        onOpenSettings();
        onClose();
      }
    },
    {
      id: 'action-export',
      title: 'Esporta Backup services.json',
      subtitle: 'Salva la configurazione attuale su file locale',
      icon: Download,
      category: 'Azioni',
      action: () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(services, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "services.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        onClose();
      }
    }
  ].filter(a => !query || a.title.toLowerCase().includes(query.toLowerCase()));

  const allItems = [
    ...matchedServices.map(s => ({
      type: 'service' as const,
      id: s.id,
      title: s.name,
      subtitle: s.description || s.category,
      service: s,
    })),
    ...actions.map(a => ({
      type: 'action' as const,
      id: a.id,
      title: a.title,
      subtitle: a.subtitle,
      action: a.action,
      icon: a.icon
    }))
  ];

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, allItems.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % Math.max(1, allItems.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const current = allItems[selectedIndex];
      if (current) {
        if (current.type === 'service') {
          onSelectService(current.service);
          onClose();
        } else {
          current.action();
        }
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl shadow-cyan-950/60 overflow-hidden flex flex-col max-h-[65vh] border-cyan-500/20"
      >
        {/* Search header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Cerca microservizio, porta o azione... (↑↓ per navigare, Invio per aprire)"
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 border border-slate-700 text-slate-400">
            ESC
          </kbd>
        </div>

        {/* Categories quick filter pills */}
        <div className="px-3 py-2 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto text-xs no-scrollbar">
          <span className="text-[11px] text-slate-500 px-1">Filtri:</span>
          {['Tutti', 'Domotica', 'Media', 'Automazione', 'Infrastruttura'].map((cat) => (
            <button
              key={cat}
              onClick={() => {
                onSelectCategory(cat);
                onClose();
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {allItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Nessun risultato corrispondente a "{query}"
            </div>
          ) : (
            allItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;

              if (item.type === 'service') {
                const s = item.service;
                const displayUrl = getDisplayUrl(s);

                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectService(s);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border border-cyan-500/40 text-white'
                        : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${s.color || '#38bdf8'}22`,
                          color: s.color || '#38bdf8'
                        }}
                      >
                        <ServiceIcon name={s.icon} className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm leading-tight group-hover:text-cyan-300 transition-colors">
                            {s.name}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-400 font-mono">
                            {s.category}
                          </span>
                          {s.isPinned && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                        </div>
                        <span className="text-[11px] text-slate-400 line-clamp-1">
                          {s.description || displayUrl}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                      {s.hasWebUi ? (
                        <span className="text-cyan-400/80 flex items-center gap-1 text-[11px]">
                          <Globe className="w-3 h-3" />
                          {displayUrl}
                        </span>
                      ) : (
                        <span className="text-amber-400/80 text-[11px]">Backend</span>
                      )}

                      {isSelected && (
                        <ArrowRight className="w-4 h-4 text-cyan-400 animate-pulse ml-2" />
                      )}
                    </div>
                  </div>
                );
              }

              // Action Item
              const IconComp = item.icon || Plus;
              return (
                <div
                  key={item.id}
                  onClick={() => item.action()}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-indigo-950/40 border border-indigo-500/40 text-white'
                      : 'hover:bg-slate-800/60 text-slate-300 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-medium text-sm leading-tight block">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-slate-400 block">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <ArrowRight className="w-4 h-4 text-indigo-400 animate-pulse" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">↑↓</kbd> Naviga
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Invio</kbd> Apri Scheda
            </span>
            <span>
              <kbd className="px-1 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">Esc</kbd> Chiudi
            </span>
          </div>
          <span>HomeServer Command Palette</span>
        </div>
      </div>
    </div>
  );
};
