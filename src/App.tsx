import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  Plus,
  Settings as SettingsIcon,
  Server,
  Star,
  Boxes
} from 'lucide-react';
import type { Service, ServiceCategory, AppSettings } from './types/service';
import { DEFAULT_SERVICES } from './data/defaultServices';
import { ServiceCard } from './components/ServiceCard';
import { EmbeddedViewer } from './components/EmbeddedViewer';
import { SettingsModal } from './components/SettingsModal';
import { ServiceModal } from './components/ServiceModal';
import { PwaInstallBanner } from './components/PwaInstallBanner';

const STORAGE_KEY_SERVICES = 'homeserver_services_v1';
const STORAGE_KEY_SETTINGS = 'homeserver_settings_v1';

const DEFAULT_SETTINGS: AppSettings = {
  serverHost: window.location.hostname || '192.168.1.100',
  defaultProtocol: 'http',
  openMode: 'iframe',
  theme: 'dark',
  showBackendServices: true,
  viewMode: 'grid',
};

export const App: React.FC = () => {
  // Services State
  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SERVICES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading services from localStorage:', e);
    }
    return DEFAULT_SERVICES;
  });

  // Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error loading settings from localStorage:', e);
    }
    return DEFAULT_SETTINGS;
  });

  // UI state
  const [activeService, setActiveService] = useState<Service | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutti');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync services to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(services));
  }, [services]);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Update clock every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard shortcut listener: `/` to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      // Backend services toggle
      if (!settings.showBackendServices && !srv.hasWebUi) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'Tutti' && srv.category !== selectedCategory) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchName = srv.name.toLowerCase().includes(q);
        const matchDesc = srv.description?.toLowerCase().includes(q);
        const matchCat = srv.category.toLowerCase().includes(q);
        const matchStack = srv.stack?.toLowerCase().includes(q);
        const matchPort = srv.port?.toString().includes(q);
        return matchName || matchDesc || matchCat || matchStack || matchPort;
      }
      return true;
    });
  }, [services, selectedCategory, searchQuery, settings.showBackendServices]);

  // Group services by category
  const categoriesList: ServiceCategory[] = ['Domotica', 'Media', 'Automazione', 'Infrastruttura', 'Altro'];

  // Pinned services
  const pinnedServices = useMemo(() => {
    return filteredServices.filter((s) => s.isPinned);
  }, [filteredServices]);

  // Handlers
  const handleTogglePin = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isPinned: !s.isPinned } : s))
    );
  };

  const handleSaveService = (service: Service) => {
    setServices((prev) => {
      const index = prev.findIndex((s) => s.id === service.id);
      if (index >= 0) {
        const copy = [...prev];
        copy[index] = service;
        return copy;
      }
      return [...prev, service];
    });
  };

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
  };

  const handleResetServices = () => {
    setServices(DEFAULT_SERVICES);
    localStorage.removeItem(STORAGE_KEY_SERVICES);
  };

  // If a service is currently opened in embedded view
  if (activeService) {
    return (
      <EmbeddedViewer
        service={activeService}
        settings={settings}
        onBack={() => setActiveService(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Background glowing effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[50%] h-[40%] rounded-full bg-purple-600/10 blur-[150px]" />
      </div>

      {/* Top Header / App Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo & Server Status */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-950/50">
                <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                  <Boxes className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                    HomeServer Hub
                  </h1>
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="text-xs text-slate-400 hover:text-cyan-300 font-mono transition-colors flex items-center gap-1"
                  title="Fai clic per modificare l'IP o il dominio del server"
                >
                  <Server className="w-3 h-3 text-cyan-500" />
                  <span>{settings.serverHost}</span>
                </button>
              </div>
            </div>

            {/* Mobile PWA install & Settings */}
            <div className="flex items-center gap-2 md:hidden">
              <PwaInstallBanner />
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
              >
                <SettingsIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="w-full md:max-w-md relative flex items-center">
            <Search className="w-4 h-4 absolute left-3.5 text-slate-500" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cerca microservizio, porta, stack... (premi '/')"
              className="w-full bg-slate-900/90 border border-slate-800/90 rounded-2xl pl-10 pr-10 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            )}
            {!searchQuery && (
              <kbd className="hidden sm:inline-flex absolute right-3 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-[10px] text-slate-400 font-mono">
                /
              </kbd>
            )}
          </div>

          {/* Actions & Utilities (Desktop) */}
          <div className="hidden md:flex items-center gap-3">
            <div className="font-mono text-xs text-slate-400 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800">
              {currentTime}
            </div>

            <PwaInstallBanner />

            <button
              onClick={() => {
                setServiceToEdit(null);
                setIsServiceModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 text-xs font-medium transition-all"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
              <span>Nuovo Servizio</span>
            </button>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Impostazioni"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-8">
        {/* Category Pills & Quick Filter */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 no-scrollbar">
          <div className="flex items-center gap-2">
            {['Tutti', ...categoriesList].map((category) => {
              const count =
                category === 'Tutti'
                  ? services.filter((s) => settings.showBackendServices || s.hasWebUi).length
                  : services.filter(
                      (s) =>
                        s.category === category &&
                        (settings.showBackendServices || s.hasWebUi)
                    ).length;

              const isSelected = selectedCategory === category;

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-950'
                      : 'bg-slate-900/60 hover:bg-slate-850 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected
                        ? 'bg-cyan-500/30 text-cyan-200'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pinned / Favorites Section */}
        {pinnedServices.length > 0 && selectedCategory === 'Tutti' && !searchQuery && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400/90">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>Preferiti Rapidi</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {pinnedServices.map((service) => (
                <ServiceCard
                  key={`pinned-${service.id}`}
                  service={service}
                  settings={settings}
                  onSelect={(s) => setActiveService(s)}
                  onEdit={(s) => {
                    setServiceToEdit(s);
                    setIsServiceModalOpen(true);
                  }}
                  onTogglePin={handleTogglePin}
                />
              ))}
            </div>
          </section>
        )}

        {/* Category Sections or Flat List */}
        {selectedCategory === 'Tutti' && !searchQuery ? (
          categoriesList.map((cat) => {
            const catServices = filteredServices.filter((s) => s.category === cat);
            if (catServices.length === 0) return null;

            return (
              <section key={cat} className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                  <h2 className="font-semibold text-base text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    {cat}
                    <span className="text-xs font-normal text-slate-500">
                      ({catServices.length})
                    </span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {catServices.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      settings={settings}
                      onSelect={(s) => setActiveService(s)}
                      onEdit={(s) => {
                        setServiceToEdit(s);
                        setIsServiceModalOpen(true);
                      }}
                      onTogglePin={handleTogglePin}
                    />
                  ))}
                </div>
              </section>
            );
          })
        ) : (
          <section className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <h2 className="font-semibold text-base text-slate-200">
                {searchQuery ? `Risultati per "${searchQuery}"` : selectedCategory}
                <span className="text-xs font-normal text-slate-500 ml-2">
                  ({filteredServices.length})
                </span>
              </h2>
            </div>
            {filteredServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredServices.map((service) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    settings={settings}
                    onSelect={(s) => setActiveService(s)}
                    onEdit={(s) => {
                      setServiceToEdit(s);
                      setIsServiceModalOpen(true);
                    }}
                    onTogglePin={handleTogglePin}
                  />
                ))}
              </div>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center p-6 bg-slate-900/30 rounded-3xl border border-slate-800/60">
                <Search className="w-10 h-10 text-slate-600 mb-3" />
                <h3 className="text-base font-semibold text-slate-300">Nessun microservizio trovato</h3>
                <p className="text-xs text-slate-500 max-w-sm mt-1">
                  Nessun servizio corrisponde ai criteri di ricerca. Prova con un altro termine o aggiungi un nuovo servizio.
                </p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                >
                  Cancella filtro ricerca
                </button>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/70 py-4 px-4 sm:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span>
              <strong>{services.length}</strong> container totali
            </span>
            <span>•</span>
            <span>
              <strong>{services.filter((s) => s.hasWebUi).length}</strong> con Web UI
            </span>
            <span>•</span>
            <span>
              Host: <code className="text-slate-400">{settings.serverHost}</code>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span>Installabile come Web App su Windows (PWA)</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        services={services}
        onImportServices={setServices}
        onResetServices={handleResetServices}
      />

      <ServiceModal
        isOpen={isServiceModalOpen}
        onClose={() => {
          setIsServiceModalOpen(false);
          setServiceToEdit(null);
        }}
        serviceToEdit={serviceToEdit}
        onSave={handleSaveService}
        onDelete={handleDeleteService}
      />
    </div>
  );
};

export default App;
