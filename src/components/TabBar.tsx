import React from 'react';
import { X, Plus, LayoutDashboard, ChevronLeft, ChevronRight, Settings as SettingsIcon } from 'lucide-react';
import type { AppTab } from '../types/service';
import { ServiceIcon } from './ServiceIcon';

interface TabBarProps {
  tabs: AppTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onNewTabClick: () => void;
  canGoBack?: boolean;
  canGoForward?: boolean;
  onNavigateBack?: () => void;
  onNavigateForward?: () => void;
  onOpenSettings?: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onNewTabClick,
  canGoBack = false,
  canGoForward = false,
  onNavigateBack,
  onNavigateForward,
  onOpenSettings,
}) => {
  return (
    <div className="flex items-center bg-slate-950 border-b border-slate-800/80 px-2 pt-1 gap-1 overflow-x-auto no-scrollbar titlebar-drag shrink-0 select-none">
      {/* Navigation history buttons (Mouse Back / Forward support) */}
      <div className="flex items-center gap-0.5 mr-1 titlebar-no-drag shrink-0">
        <button
          type="button"
          onClick={onNavigateBack}
          disabled={!canGoBack}
          className={`p-1.5 rounded-lg transition-colors ${
            canGoBack
              ? 'text-slate-300 hover:text-white hover:bg-slate-850 cursor-pointer active:scale-95'
              : 'text-slate-700 cursor-not-allowed opacity-50'
          }`}
          title="Indietro (Tasto Mouse 4 / Alt+←)"
          aria-label="Scheda precedente"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={onNavigateForward}
          disabled={!canGoForward}
          className={`p-1.5 rounded-lg transition-colors ${
            canGoForward
              ? 'text-slate-300 hover:text-white hover:bg-slate-850 cursor-pointer active:scale-95'
              : 'text-slate-700 cursor-not-allowed opacity-50'
          }`}
          title="Avanti (Tasto Mouse 5 / Alt+→)"
          aria-label="Scheda successiva"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
      {tabs.map((tab, idx) => {
        const isActive = tab.id === activeTabId;
        const isHome = tab.id === 'home';
        const shortcutNumber = idx + 1 <= 9 ? idx + 1 : null;

        return (
          <div
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            onAuxClick={(e) => {
              // Mouse middle-click closes tab (except home)
              if (e.button === 1 && !isHome) {
                e.preventDefault();
                onCloseTab(tab.id);
              }
            }}
            title={
              shortcutNumber
                ? `${tab.title} (Alt+${shortcutNumber} - Tasto centrale per chiudere)`
                : tab.title
            }
            className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-t-xl text-xs font-medium cursor-pointer transition-all titlebar-no-drag max-w-[200px] border-t border-x ${
              isActive
                ? 'bg-slate-900 text-white border-slate-700/80 shadow-md shadow-slate-950/40 z-10'
                : 'bg-slate-950/60 hover:bg-slate-900/40 text-slate-400 hover:text-slate-200 border-transparent hover:border-slate-800'
            }`}
          >
            {/* Active top color line */}
            {isActive && (
              <div
                className="absolute top-0 left-2 right-2 h-[2px] rounded-full"
                style={{ backgroundColor: tab.color || '#38bdf8' }}
              />
            )}

            {/* Icon */}
            <div
              className="w-4 h-4 rounded flex items-center justify-center shrink-0"
              style={{ color: tab.color || '#38bdf8' }}
            >
              {isHome ? <LayoutDashboard className="w-3.5 h-3.5" /> : <ServiceIcon name={tab.icon} className="w-3.5 h-3.5" />}
            </div>

            {/* Title */}
            <span className="truncate select-none">{tab.title}</span>

            {/* Shortcut number indicator */}
            {shortcutNumber && (
              <span className="text-[9px] font-mono opacity-0 group-hover:opacity-60 transition-opacity text-slate-400">
                Alt+{shortcutNumber}
              </span>
            )}

            {/* Close button (except for home tab) */}
            {!isHome && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className="p-0.5 rounded-md hover:bg-slate-800 text-slate-500 hover:text-slate-200 transition-colors shrink-0 ml-auto"
                title="Chiudi scheda (Tasto centrale o Ctrl+W)"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      })}

      {/* New Tab (+) Button */}
      <button
        onClick={onNewTabClick}
        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-850 transition-colors titlebar-no-drag ml-1 shrink-0 cursor-pointer"
        title="Apri un microservizio in nuova scheda (Ctrl+K)"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>

      {/* Right side spacer & settings trigger */}
      {onOpenSettings && (
        <div className="ml-auto flex items-center titlebar-no-drag pl-2 pr-1 shrink-0">
          <button
            onClick={onOpenSettings}
            className="p-1 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-850 transition-colors cursor-pointer"
            title="Impostazioni Dashboard"
          >
            <SettingsIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
