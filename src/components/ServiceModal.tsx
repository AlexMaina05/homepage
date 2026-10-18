import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Check } from 'lucide-react';
import type { Service, ServiceCategory } from '../types/service';
import { ServiceIcon, AVAILABLE_ICONS } from './ServiceIcon';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceToEdit: Service | null;
  onSave: (service: Service) => void;
  onDelete?: (serviceId: string) => void;
}

const COLOR_PRESETS = [
  '#03a9f4', // Sky blue
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#14b8a6', // Teal
  '#64748b', // Slate
];

const CATEGORIES: ServiceCategory[] = ['Domotica', 'Media', 'Automazione', 'Infrastruttura', 'Altro'];

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  serviceToEdit,
  onSave,
  onDelete,
}) => {
  const [formData, setFormData] = useState<Partial<Service>>({
    name: '',
    description: '',
    category: 'Domotica',
    hasWebUi: true,
    port: 8080,
    customUrl: '',
    icon: 'Server',
    color: '#03a9f4',
    stack: ''
  });

  useEffect(() => {
    if (serviceToEdit) {
      setFormData(serviceToEdit);
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'Domotica',
        hasWebUi: true,
        port: undefined,
        customUrl: '',
        icon: 'Server',
        color: '#03a9f4',
        stack: ''
      });
    }
  }, [serviceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const newService: Service = {
      id: serviceToEdit ? serviceToEdit.id : `service-${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description?.trim() || '',
      category: formData.category || 'Altro',
      hasWebUi: !!formData.hasWebUi,
      port: formData.port ? Number(formData.port) : undefined,
      customUrl: formData.customUrl?.trim() || undefined,
      icon: formData.icon || 'Server',
      color: formData.color || '#03a9f4',
      stack: formData.stack?.trim() || undefined,
      isPinned: serviceToEdit ? serviceToEdit.isPinned : false
    };

    onSave(newService);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow"
              style={{
                backgroundColor: `${formData.color}22`,
                color: formData.color,
                border: `1px solid ${formData.color}44`
              }}
            >
              <ServiceIcon name={formData.icon || 'Server'} className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">
                {serviceToEdit ? 'Modifica Microservizio' : 'Aggiungi Microservizio'}
              </h2>
              <p className="text-xs text-slate-400">Personalizza nome, porta, icona e categoria</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="py-4 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Name & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Nome Servizio *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="es. Portainer"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/60"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Categoria</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ServiceCategory })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/60"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Descrizione breve</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="es. Gestione container Docker e stack"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/60"
            />
          </div>

          {/* Has Web UI Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="text-xs font-medium text-slate-200">Ha interfaccia Web raggiungibile da browser?</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.hasWebUi}
                onChange={(e) => setFormData({ ...formData, hasWebUi: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          {/* Port or Custom URL */}
          {formData.hasWebUi && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Porta Host</label>
                <input
                  type="number"
                  value={formData.port ?? ''}
                  onChange={(e) => setFormData({ ...formData, port: e.target.value ? Number(e.target.value) : undefined })}
                  placeholder="es. 9000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/60 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">URL Completo (Opzionale)</label>
                <input
                  type="text"
                  value={formData.customUrl}
                  onChange={(e) => setFormData({ ...formData, customUrl: e.target.value })}
                  placeholder="https://app.tuodominio.it"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/60 font-mono"
                />
              </div>
            </div>
          )}

          {/* Stack name */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">Stack Docker (Opzionale)</label>
            <input
              type="text"
              value={formData.stack}
              onChange={(e) => setFormData({ ...formData, stack: e.target.value })}
              placeholder="es. home-assistant, media, traefik"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-cyan-500/60 font-mono"
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-2">Seleziona Icona</label>
            <div className="grid grid-cols-8 gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 max-h-32 overflow-y-auto">
              {AVAILABLE_ICONS.map((iconKey) => {
                const isSelected = formData.icon === iconKey;
                return (
                  <button
                    key={iconKey}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: iconKey })}
                    className={`p-2 rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 ring-2 ring-cyan-400'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                    title={iconKey}
                  >
                    <ServiceIcon name={iconKey} className="w-4 h-4" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color Presets */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-2">Colore Badge & Tema</label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: c })}
                  style={{ backgroundColor: c }}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                    formData.color === c ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {formData.color === c && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {serviceToEdit && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Sei sicuro di voler rimuovere ${serviceToEdit.name}?`)) {
                    onDelete(serviceToEdit.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/30 text-red-400 hover:bg-red-900/50 hover:text-red-300 text-xs font-medium border border-red-900/40 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Elimina</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs transition-colors"
              >
                Annulla
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-medium text-xs text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Salva</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
