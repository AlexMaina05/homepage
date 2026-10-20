import React from 'react';
import { ExternalLink, Star, Edit3, Globe, AlertCircle, ArrowUpRight, QrCode } from 'lucide-react';
import type { Service, AppSettings } from '../types/service';
import { ServiceIcon } from './ServiceIcon';
import { getServiceUrl, getDisplayUrl } from '../utils/url';

interface ServiceCardProps {
  service: Service;
  settings: AppSettings;
  onSelect: (service: Service) => void;
  onEdit: (service: Service) => void;
  onTogglePin: (serviceId: string) => void;
  onMiddleClick?: (service: Service) => void;
  onOpenQrCode?: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  settings,
  onSelect,
  onEdit,
  onTogglePin,
  onMiddleClick,
  onOpenQrCode,
}) => {
  const url = getServiceUrl(service, settings);
  const displayUrl = getDisplayUrl(service);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!service.hasWebUi || !url) return;
    
    if (settings.openMode === 'new_tab') {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      onSelect(service);
    }
  };

  const handleAuxClick = (e: React.MouseEvent) => {
    // Middle-click (wheel click) opens directly in a tab
    if (e.button === 1 && service.hasWebUi && url) {
      e.preventDefault();
      if (onMiddleClick) {
        onMiddleClick(service);
      } else {
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleQrClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onOpenQrCode) {
      onOpenQrCode(service);
    }
  };

  const handlePinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTogglePin(service.id);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(service);
  };

  return (
    <div
      onClick={service.hasWebUi ? handleClick : undefined}
      onAuxClick={handleAuxClick}
      className={`group relative rounded-2xl p-4 transition-all duration-200 border ${
        service.hasWebUi
          ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-950/40 bg-slate-900/60 hover:bg-slate-850 border-slate-800 hover:border-cyan-500/40'
          : 'bg-slate-900/30 border-slate-800/50 opacity-70 cursor-default'
      }`}
    >
      {/* Background glowing indicator */}
      <div
        className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-[8px]"
        style={{
          background: service.hasWebUi
            ? `radial-gradient(circle at top left, ${service.color || '#38bdf8'}22, transparent 70%)`
            : 'none'
        }}
      />

      {/* Top row: Icon, Category Badge & Action Buttons */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-transform duration-200 group-hover:scale-105"
            style={{
              backgroundColor: `${service.color || '#38bdf8'}18`,
              color: service.color || '#38bdf8',
              border: `1px solid ${service.color || '#38bdf8'}33`
            }}
          >
            <ServiceIcon name={service.icon} className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-100 text-base group-hover:text-cyan-300 transition-colors flex items-center gap-1.5">
              {service.name}
              {service.hasWebUi && (
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all text-cyan-400" />
              )}
            </h3>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              {service.hasWebUi ? (
                <>
                  <Globe className="w-3 h-3 text-cyan-400" />
                  <span className="font-mono text-[11px] text-cyan-300/80">{displayUrl}</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-300/70 text-[11px]">Servizio di background</span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handlePinClick}
            title={service.isPinned ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
            className={`p-1.5 rounded-lg transition-colors ${
              service.isPinned
                ? 'text-amber-400 hover:text-amber-300 bg-amber-400/10'
                : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Star className="w-3.5 h-3.5" fill={service.isPinned ? 'currentColor' : 'none'} />
          </button>

          {service.hasWebUi && url && (
            <>
              <button
                onClick={handleQrClick}
                title="Genera QR Code per aprire su smartphone"
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
              >
                <QrCode className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleExternalClick}
                title="Apri in una nuova scheda del browser"
                className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </>
          )}

          <button
            onClick={handleEditClick}
            title="Modifica impostazioni servizio"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
        {service.description || 'Nessuna descrizione disponibile.'}
      </p>

      {/* Footer tags */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-medium">
          {service.category}
        </span>
        {service.stack && (
          <span className="text-slate-500 font-mono text-[10px]">
            stack: {service.stack}
          </span>
        )}
      </div>
    </div>
  );
};
