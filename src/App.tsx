import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Search,
  Plus,
  Settings as SettingsIcon,
  Server,
  Star,
  Boxes,
  Command,
  X,
  Hash
} from 'lucide-react';
import type { Service, ServiceCategory, AppSettings, AppTab, NetworkBookmark, WolDevice } from './types/service';
import { DEFAULT_SERVICES } from './data/defaultServices';
import { DEFAULT_BOOKMARKS } from './data/defaultBookmarks';
import { ServiceCard } from './components/ServiceCard';
import { EmbeddedViewer } from './components/EmbeddedViewer';
import { SettingsModal } from './components/SettingsModal';
import { ServiceModal } from './components/ServiceModal';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { CommandPalette } from './components/CommandPalette';
import { TabBar } from './components/TabBar';
import { WidgetsBar } from './components/WidgetsBar';
import { WeatherGreeting } from './components/WeatherGreeting';
import { HomelabBookmarks } from './components/HomelabBookmarks';
import { ServerScratchpad } from './components/ServerScratchpad';
import { QrCodeModal } from './components/QrCodeModal';
import { PortCheckerModal } from './components/PortCheckerModal';
import { WolHub } from './components/WolHub';
import { getServiceUrl } from './utils/url';

const STORAGE_KEY_SERVICES = 'homeserver_services_v1';
const STORAGE_KEY_SETTINGS = 'homeserver_settings_v1';
const STORAGE_KEY_BOOKMARKS = 'homeserver_bookmarks_v1';
const STORAGE_KEY_WOL = 'homeserver_wol_v1';

const DEFAULT_SETTINGS: AppSettings = {
  serverHost: window.location.hostname || '192.168.1.100',
  defaultProtocol: 'http',
  openMode: 'iframe',
  theme: 'dark',
  showBackendServices: true,
  viewMode: 'grid',
  enableWidgets: true,
  userName: 'Alex',
  weatherCity: 'Milano',
  showWeather: true,
  showBookmarks: true,
  showScratchpad: true,
  serverNotes: '',
};

const HOME_TAB: AppTab = {
  id: 'home',
  serviceId: 'home',
  title: 'Dashboard',
  icon: 'Boxes',
  url: '',
  color: '#38bdf8'
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

  // Bookmarks State
  const [bookmarks, setBookmarks] = useState<NetworkBookmark[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading bookmarks from localStorage:', e);
    }
    return DEFAULT_BOOKMARKS;
  });

  // Wol Devices State
  const [wolDevices, setWolDevices] = useState<WolDevice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_WOL);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading WoL devices from localStorage:', e);
    }
    return [];
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

  // Multi-Tab State
  const [tabs, setTabs] = useState<AppTab[]>([HOME_TAB]);
  const [activeTabId, setActiveTabId] = useState<string>('home');
  const [closedTabsHistory, setClosedTabsHistory] = useState<AppTab[]>([]);

  // Tab Navigation History (supports Mouse Back / Forward buttons & Browser History)
  const [navHistory, setNavHistory] = useState<string[]>(['home']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const navHistoryRef = useRef<string[]>(['home']);
  const historyIndexRef = useRef<number>(0);

  useEffect(() => {
    navHistoryRef.current = navHistory;
  }, [navHistory]);

  useEffect(() => {
    historyIndexRef.current = historyIndex;
  }, [historyIndex]);

  // Navigate back in tab history
  const handleNavigateBack = useCallback(() => {
    let targetIdx = historyIndexRef.current - 1;
    while (targetIdx >= 0) {
      const id = navHistoryRef.current[targetIdx];
      if (id === 'home' || tabs.some((t) => t.id === id)) {
        historyIndexRef.current = targetIdx;
        setHistoryIndex(targetIdx);
        setActiveTabId(id);
        try {
          window.history.replaceState({ tabId: id }, '', window.location.pathname);
        } catch {
          // safe
        }
        return;
      }
      targetIdx--;
    }
    setActiveTabId('home');
  }, [tabs]);

  // Navigate forward in tab history
  const handleNavigateForward = useCallback(() => {
    let targetIdx = historyIndexRef.current + 1;
    while (targetIdx < navHistoryRef.current.length) {
      const id = navHistoryRef.current[targetIdx];
      if (id === 'home' || tabs.some((t) => t.id === id)) {
        historyIndexRef.current = targetIdx;
        setHistoryIndex(targetIdx);
        setActiveTabId(id);
        try {
          window.history.replaceState({ tabId: id }, '', window.location.pathname);
        } catch {
          // safe
        }
        return;
      }
      targetIdx++;
    }
  }, [tabs]);

  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < navHistory.length - 1;

  // Function to switch tab and push to history
  const switchTab = useCallback((targetTabId: string, addToHistory = true) => {
    setActiveTabId(targetTabId);
    if (addToHistory) {
      const currentInHistory = navHistoryRef.current[historyIndexRef.current];
      if (targetTabId !== currentInHistory) {
        const nextHist = [...navHistoryRef.current.slice(0, historyIndexRef.current + 1), targetTabId];
        const nextIdx = nextHist.length - 1;
        setNavHistory(nextHist);
        setHistoryIndex(nextIdx);
        navHistoryRef.current = nextHist;
        historyIndexRef.current = nextIdx;

        try {
          window.history.pushState({ tabId: targetTabId }, '', window.location.pathname);
        } catch {
          // safe
        }
      }
    }
  }, []);

  // Modals UI state
  const [selectedCategory, setSelectedCategory] = useState<string>('Tutti');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isPortCheckerOpen, setIsPortCheckerOpen] = useState<boolean>(false);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');

  // QR Code Modal State
  const [qrModalData, setQrModalData] = useState<{
    isOpen: boolean;
    title: string;
    url: string;
    icon: string;
    color?: string;
  }>({
    isOpen: false,
    title: '',
    url: '',
    icon: 'Server',
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_WOL, JSON.stringify(wolDevices));
  }, [wolDevices]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  }, [settings]);

  // Clock
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

  // Jump List query param support (?open=portainer, etc.)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const openParam = params.get('open');
    if (openParam) {
      const targetService = services.find((s) => s.id === openParam);
      if (targetService) {
        handleOpenService(targetService);
      }
    }
  }, [services]);

  // Global Keyboard Shortcuts (Ctrl+K, Esc, Ctrl+W, Ctrl+Shift+T, Alt+1..9, Alt+Left/Right, /)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + LeftArrow: Navigate back in tab history
      if (e.altKey && !e.ctrlKey && !e.shiftKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        handleNavigateBack();
        return;
      }

      // Alt + RightArrow: Navigate forward in tab history
      if (e.altKey && !e.ctrlKey && !e.shiftKey && e.key === 'ArrowRight') {
        e.preventDefault();
        handleNavigateForward();
        return;
      }

      // Alt + 1..9: Switch tab by index
      if (e.altKey && !e.ctrlKey && !e.metaKey && e.key >= '1' && e.key <= '9') {
        const index = parseInt(e.key, 10) - 1;
        if (index < tabs.length) {
          e.preventDefault();
          switchTab(tabs[index].id);
          return;
        }
      }

      // Ctrl + Shift + T: Re-open last closed tab
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        if (closedTabsHistory.length > 0) {
          const lastClosed = closedTabsHistory[closedTabsHistory.length - 1];
          setClosedTabsHistory((prev) => prev.slice(0, -1));
          setTabs((prev) => {
            if (prev.some((t) => t.serviceId === lastClosed.serviceId)) {
              return prev;
            }
            return [...prev, lastClosed];
          });
          switchTab(lastClosed.id);
        }
        return;
      }

      // Ctrl + K or Cmd + K: Open Command Palette
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
      // Ctrl + W: Close active tab if not home
      else if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === 'w') {
        if (activeTabId !== 'home') {
          e.preventDefault();
          handleCloseTab(activeTabId);
        }
      }
      // Slash: Focus search bar
      else if (e.key === '/' && document.activeElement !== searchInputRef.current && !isCommandPaletteOpen) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTabId, isCommandPaletteOpen, tabs, closedTabsHistory, handleNavigateBack, handleNavigateForward, switchTab]);

  // Support Mouse Back (button 3 / X1) and Mouse Forward (button 4 / X2)
  useEffect(() => {
    const handleMouseNav = (e: MouseEvent) => {
      // 3 = Back button, 4 = Forward button on standard mice
      if (e.button === 3) {
        e.preventDefault();
        e.stopPropagation();
        handleNavigateBack();
      } else if (e.button === 4) {
        e.preventDefault();
        e.stopPropagation();
        handleNavigateForward();
      }
    };

    window.addEventListener('mouseup', handleMouseNav);
    window.addEventListener('auxclick', handleMouseNav);
    return () => {
      window.removeEventListener('mouseup', handleMouseNav);
      window.removeEventListener('auxclick', handleMouseNav);
    };
  }, [handleNavigateBack, handleNavigateForward]);

  // Support Browser History PopState (browser back/forward buttons)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.tabId) {
        const targetId = e.state.tabId;
        if (targetId === 'home' || tabs.some((t) => t.id === targetId)) {
          setActiveTabId(targetId);
        } else {
          setActiveTabId('home');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [tabs]);

  // Open a microservice in Multi-Tab or External
  const handleOpenService = (service: Service) => {
    if (!service.hasWebUi) return;
    const url = getServiceUrl(service, settings);
    if (!url) return;

    if (settings.openMode === 'new_tab') {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }

    const existingTab = tabs.find((t) => t.serviceId === service.id);
    if (existingTab) {
      switchTab(existingTab.id);
    } else {
      const newTab: AppTab = {
        id: `tab-${service.id}-${Date.now()}`,
        serviceId: service.id,
        title: service.name,
        icon: service.icon,
        url: url,
        color: service.color
      };
      setTabs((prev) => [...prev, newTab]);
      switchTab(newTab.id);
    }
  };

  // Close a tab
  const handleCloseTab = (tabId: string) => {
    if (tabId === 'home') return;

    setTabs((prev) => {
      const tabToClose = prev.find((t) => t.id === tabId);
      if (tabToClose) {
        setClosedTabsHistory((h) => [...h, tabToClose]);
      }

      const newTabs = prev.filter((t) => t.id !== tabId);
      if (activeTabId === tabId) {
        const closingIndex = prev.findIndex((t) => t.id === tabId);
        const nextActive = newTabs[closingIndex - 1] || newTabs[0] || HOME_TAB;
        switchTab(nextActive.id, false);
      }
      return newTabs;
    });
  };

  // Filtered services for the home view
  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      if (!settings.showBackendServices && !srv.hasWebUi) {
        return false;
      }
      if (selectedCategory !== 'Tutti' && srv.category !== selectedCategory) {
        return false;
      }
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

  const categoriesList: ServiceCategory[] = ['Domotica', 'Media', 'Automazione', 'Infrastruttura', 'Altro'];

  const pinnedServices = useMemo(() => {
    return filteredServices.filter((s) => s.isPinned);
  }, [filteredServices]);

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
    setBookmarks(DEFAULT_BOOKMARKS);
    setWolDevices([]);
    localStorage.removeItem(STORAGE_KEY_SERVICES);
    localStorage.removeItem(STORAGE_KEY_BOOKMARKS);
    localStorage.removeItem(STORAGE_KEY_WOL);
  };

  // Bookmark handlers
  const handleAddBookmark = (newBm: NetworkBookmark) => {
    setBookmarks((prev) => [...prev, newBm]);
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  // WoL handlers
  const handleAddWolDevice = (dev: WolDevice) => {
    setWolDevices((prev) => [...prev, dev]);
  };

  const handleDeleteWolDevice = (id: string) => {
    setWolDevices((prev) => prev.filter((d) => d.id !== id));
  };

  const handleUpdateWolDeviceLastWake = (id: string) => {
    const timeStr = new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setWolDevices((prev) =>
      prev.map((d) => (d.id === id ? { ...d, lastWake: timeStr } : d))
    );
  };

  const iframeTabs = useMemo(() => {
    return tabs.filter((t) => t.id !== 'home');
  }, [tabs]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-300">
      {/* Background glowing effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-cyan-600/10 blur-[130px]" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[50%] h-[40%] rounded-full bg-purple-600/10 blur-[150px]" />
      </div>

      {/* Multi-Tab Bar with Back / Forward history - Native Window Controls Overlay Top Bar */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={(tabId) => switchTab(tabId)}
        onCloseTab={handleCloseTab}
        onNewTabClick={() => setIsCommandPaletteOpen(true)}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        onNavigateBack={handleNavigateBack}
        onNavigateForward={handleNavigateForward}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* Main View Area: Dashboard Tab (DOM kept alive and scrolls independently) */}
      <div
        style={{ display: activeTabId === 'home' ? 'flex' : 'none' }}
        className="flex-1 flex-col overflow-y-auto min-h-0"
      >
        {/* Top Application Bar for Dashboard with Logo, Server IP, Search & Quick Actions */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80 px-4 sm:px-6 py-2.5 transition-all">
          <div className="flex flex-col md:flex-row items-center justify-between gap-2.5">
            {/* Logo, Server IP & Status */}
            <div className="flex items-center justify-between w-full md:w-auto gap-3">
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => switchTab('home')}
                  className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-950/50 hover:scale-105 transition-transform"
                  title="Torna alla Home"
                >
                  <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center">
                    <Boxes className="w-4 h-4 text-cyan-400" />
                  </div>
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                      HomeServer Hub
                    </h1>
                    <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>
                  </div>
                  <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="text-[11px] text-slate-400 hover:text-cyan-300 font-mono transition-colors flex items-center gap-1 leading-none"
                    title="Modifica IP o hostname server"
                  >
                    <Server className="w-2.5 h-2.5 text-cyan-500" />
                    <span>{settings.serverHost}</span>
                  </button>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center gap-1.5 md:hidden">
                <button
                  onClick={() => setIsCommandPaletteOpen(true)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                  title="Command Palette (Ctrl+K)"
                >
                  <Command className="w-3.5 h-3.5" />
                </button>
                <PwaInstallBanner />
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
                >
                  <SettingsIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Center: Command Palette Trigger button */}
            <div className="w-full md:max-w-md flex items-center gap-2">
              <button
                onClick={() => setIsCommandPaletteOpen(true)}
                className="w-full flex items-center justify-between bg-slate-900/90 hover:bg-slate-850 border border-slate-800/90 rounded-xl px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 transition-all shadow-inner group"
              >
                <div className="flex items-center gap-2 truncate">
                  <Search className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="truncate">Cerca microservizio, segnalibro o comando...</span>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700/80 text-[10px] font-mono text-slate-400 group-hover:text-cyan-300">
                    Ctrl K
                  </kbd>
                </div>
              </button>
            </div>

            {/* Actions & Utilities (Desktop) */}
            <div className="hidden md:flex items-center gap-2">
              <div className="font-mono text-[11px] text-slate-400 px-2.5 py-1 rounded-lg bg-slate-900/60 border border-slate-800">
                {currentTime}
              </div>

              {/* Port Checker Tool Button */}
              <button
                onClick={() => setIsPortCheckerOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-cyan-300 text-xs transition-colors"
                title="Port Conflict Checker & Docker Helper"
              >
                <Hash className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden lg:inline">Porte</span>
              </button>

              <PwaInstallBanner />

              <button
                onClick={() => {
                  setServiceToEdit(null);
                  setIsServiceModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/60 text-xs font-medium transition-all"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-400" />
                <span>Nuovo</span>
              </button>

              <button
                onClick={() => setIsSettingsOpen(true)}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Impostazioni"
              >
                <SettingsIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 space-y-6">
          {/* Weather & Dynamic Greeting Banner */}
          <WeatherGreeting
            settings={settings}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />

          {/* Interactive Mini-Widgets (MeTube downloader, Portainer hub, Audio) */}
          {settings.enableWidgets !== false && (
            <WidgetsBar
              services={services}
              settings={settings}
              onOpenServiceTab={handleOpenService}
            />
          )}

          {/* Wake-on-LAN Hub (Feature 6) */}
          <WolHub
            devices={wolDevices}
            onAddDevice={handleAddWolDevice}
            onDeleteDevice={handleDeleteWolDevice}
            onUpdateDeviceLastWake={handleUpdateWolDeviceLastWake}
          />

          {/* Server Scratchpad & Notes (Feature 3) */}
          <ServerScratchpad
            notes={settings.serverNotes || ''}
            onSaveNotes={(n) => setSettings((s) => ({ ...s, serverNotes: n }))}
          />

          {/* Homelab Network Bookmarks (Feature 3) */}
          <HomelabBookmarks
            bookmarks={bookmarks}
            onAddBookmark={handleAddBookmark}
            onDeleteBookmark={handleDeleteBookmark}
          />

          {/* Category Pills & Instant Filter Input */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1 border-b border-slate-800/80">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
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
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all whitespace-nowrap ${
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

            {/* In-page Fast Filter */}
            <div className="relative flex items-center min-w-[220px]">
              <Search className="w-3.5 h-3.5 absolute left-3 text-slate-500" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtra servizi... (premi '/')"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 text-slate-500 hover:text-slate-300"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Pinned / Favorites Section */}
          {pinnedServices.length > 0 && selectedCategory === 'Tutti' && !searchQuery && (
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400/90">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>Preferiti Rapidi</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pinnedServices.map((service) => (
                  <ServiceCard
                    key={`pinned-${service.id}`}
                    service={service}
                    settings={settings}
                    onSelect={handleOpenService}
                    onEdit={(s) => {
                      setServiceToEdit(s);
                      setIsServiceModalOpen(true);
                    }}
                    onTogglePin={handleTogglePin}
                    onMiddleClick={handleOpenService}
                    onOpenQrCode={(s) => {
                      const sUrl = getServiceUrl(s, settings);
                      if (sUrl) {
                        setQrModalData({
                          isOpen: true,
                          title: s.name,
                          url: sUrl,
                          icon: s.icon,
                          color: s.color,
                        });
                      }
                    }}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Categories Grid or Filtered List */}
          {selectedCategory === 'Tutti' && !searchQuery ? (
            categoriesList.map((cat) => {
              const catServices = filteredServices.filter((s) => s.category === cat);
              if (catServices.length === 0) return null;

              return (
                <section key={cat} className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                    <h2 className="font-semibold text-sm text-slate-200 flex items-center gap-2">
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
                        onSelect={handleOpenService}
                        onEdit={(s) => {
                          setServiceToEdit(s);
                          setIsServiceModalOpen(true);
                        }}
                        onTogglePin={handleTogglePin}
                        onMiddleClick={handleOpenService}
                        onOpenQrCode={(s) => {
                          const sUrl = getServiceUrl(s, settings);
                          if (sUrl) {
                            setQrModalData({
                              isOpen: true,
                              title: s.name,
                              url: sUrl,
                              icon: s.icon,
                              color: s.color,
                            });
                          }
                        }}
                      />
                    ))}
                  </div>
                </section>
              );
            })
          ) : (
            <section className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <h2 className="font-semibold text-sm text-slate-200">
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
                      onSelect={handleOpenService}
                      onEdit={(s) => {
                        setServiceToEdit(s);
                        setIsServiceModalOpen(true);
                      }}
                      onTogglePin={handleTogglePin}
                      onMiddleClick={handleOpenService}
                      onOpenQrCode={(s) => {
                        const sUrl = getServiceUrl(s, settings);
                        if (sUrl) {
                          setQrModalData({
                            isOpen: true,
                            title: s.name,
                            url: sUrl,
                            icon: s.icon,
                            color: s.color,
                          });
                        }
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 flex flex-col items-center justify-center text-center p-6 bg-slate-900/30 rounded-3xl border border-slate-800/60">
                  <Search className="w-10 h-10 text-slate-600 mb-3" />
                  <h3 className="text-base font-semibold text-slate-300">Nessun microservizio trovato</h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1">
                    Nessun servizio corrisponde ai criteri di ricerca.
                  </p>
                </div>
              )}
            </section>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/70 py-3 px-4 sm:px-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <span><strong>{services.length}</strong> container</span>
              <span>•</span>
              <span><strong>{bookmarks.length}</strong> dispositivi</span>
              <span>•</span>
              <span>Host: <code className="text-slate-400 font-mono">{settings.serverHost}</code></span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <kbd className="px-1 rounded bg-slate-900 border border-slate-800 text-[10px]">Alt+1..9</kbd> Schede
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <kbd className="px-1 rounded bg-slate-900 border border-slate-800 text-[10px]">Ctrl+K</kbd> Command Palette
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Embedded Iframe Tabs: Kept in DOM so switching never reloads! */}
      {iframeTabs.map((tab) => (
        <EmbeddedViewer
          key={tab.id}
          tab={tab}
          isActive={tab.id === activeTabId}
          onCloseTab={() => handleCloseTab(tab.id)}
        />
      ))}

      {/* Command Palette Modal (Ctrl + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        services={services}
        bookmarks={bookmarks}
        settings={settings}
        onSelectService={handleOpenService}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onNewService={() => {
          setServiceToEdit(null);
          setIsServiceModalOpen(true);
        }}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Port Conflict Checker & Docker Helper Modal */}
      <PortCheckerModal
        isOpen={isPortCheckerOpen}
        onClose={() => setIsPortCheckerOpen(false)}
        services={services}
      />

      {/* QR Code Modal for Mobile Quick Launch */}
      <QrCodeModal
        isOpen={qrModalData.isOpen}
        onClose={() => setQrModalData((prev) => ({ ...prev, isOpen: false }))}
        title={qrModalData.title}
        url={qrModalData.url}
        icon={qrModalData.icon}
        color={qrModalData.color}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
        services={services}
        onImportServices={setServices}
        onResetServices={handleResetServices}
      />

      {/* Add / Edit Service Modal */}
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
