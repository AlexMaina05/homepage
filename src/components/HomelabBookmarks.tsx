import React, { useState } from 'react';
import { Network, Plus, ExternalLink, Trash2, X, Globe, Radio, Terminal, Cloud, HardDrive, Shield } from 'lucide-react';
import type { NetworkBookmark } from '../types/service';

interface HomelabBookmarksProps {
  bookmarks: NetworkBookmark[];
  onAddBookmark: (bookmark: NetworkBookmark) => void;
  onDeleteBookmark: (id: string) => void;
}

const BOOKMARK_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Radio,
  Terminal,
  Globe,
  Cloud,
  HardDrive,
  Shield,
  Network
};

const COLOR_PRESETS = [
  '#3b82f6', // Blue
  '#10b981', // Emerald
  '#a855f7', // Purple
  '#f97316', // Orange
  '#06b6d4', // Cyan
  '#ec4899', // Pink
];

export const HomelabBookmarks: React.FC<HomelabBookmarksProps> = ({
  bookmarks,
  onAddBookmark,
  onDeleteBookmark,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [icon, setIcon] = useState('Network');
  const [category, setCategory] = useState<'Network' | 'Repository' | 'Hardware' | 'Altro'>('Network');
  const [color, setColor] = useState('#3b82f6');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    let fullUrl = url.trim();
    if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
      fullUrl = `http://${fullUrl}`;
    }

    const newBookmark: NetworkBookmark = {
      id: `bm-${Date.now()}`,
      name: name.trim(),
      url: fullUrl,
      icon,
      category,
      color,
      description: description.trim() || undefined
    };

    onAddBookmark(newBookmark);
    setName('');
    setUrl('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <section className="space-y-3 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-cyan-400" />
          <h2 className="font-semibold text-sm text-slate-200">
            Dispositivi di Rete & Segnalibri Homelab
          </h2>
          <span className="text-xs font-normal text-slate-500 font-mono">
            ({bookmarks.length})
          </span>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-white transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-cyan-400" />
          <span>Aggiungi Segnalibro</span>
        </button>
      </div>

      {/* Grid of Bookmarks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {bookmarks.map((bm) => {
          const IconComp = BOOKMARK_ICONS[bm.icon] || Globe;

          return (
            <div
              key={bm.id}
              onClick={() => window.open(bm.url, '_blank', 'noopener,noreferrer')}
              className="group relative rounded-xl p-3 bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 hover:border-cyan-500/40 cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-lg shadow-black/20 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm"
                    style={{
                      backgroundColor: `${bm.color || '#3b82f6'}22`,
                      color: bm.color || '#3b82f6',
                      border: `1px solid ${bm.color || '#3b82f6'}44`
                    }}
                  >
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-medium text-xs text-slate-200 group-hover:text-cyan-300 transition-colors truncate">
                      {bm.name}
                    </h3>
                    <span className="text-[10px] text-slate-500 font-mono block truncate">
                      {bm.url.replace(/^https?:\/\//, '')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Rimuovere il segnalibro ${bm.name}?`)) {
                        onDeleteBookmark(bm.id);
                      }
                    }}
                    className="p-1 rounded hover:bg-slate-800 text-slate-500 hover:text-red-400 transition-colors"
                    title="Elimina"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>

                  <div className="p-1 text-slate-400">
                    <ExternalLink className="w-3 h-3 text-cyan-400" />
                  </div>
                </div>
              </div>

              {bm.description && (
                <p className="text-[11px] text-slate-400 line-clamp-1">
                  {bm.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Bookmark Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-sm">Nuovo Dispositivo o Segnalibro</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="py-3 space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Nome Dispositivo o Servizio *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="es. Router FritzBox, Switch PoE, Proxmox"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/60"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Indirizzo IP o URL *</label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="es. 192.168.1.1 oppure https://proxmox.lan:8006"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/60 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/60"
                  >
                    <option value="Network">Network</option>
                    <option value="Hardware">Hardware</option>
                    <option value="Repository">Repository</option>
                    <option value="Altro">Altro</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Icona</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/60"
                  >
                    <option value="Radio">Router / Radio</option>
                    <option value="Globe">Internet / Web</option>
                    <option value="Terminal">Terminale / Git</option>
                    <option value="Cloud">Cloud</option>
                    <option value="HardDrive">Storage / NAS</option>
                    <option value="Shield">Sicurezza / Firewall</option>
                  </select>
                </div>
              </div>

              {/* Color Presets */}
              <div>
                <label className="text-slate-300 block mb-1.5">Colore Badge</label>
                <div className="flex gap-2">
                  {COLOR_PRESETS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      style={{ backgroundColor: c }}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        color === c ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-slate-900' : 'opacity-70 hover:opacity-100'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Descrizione (opzionale)</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="es. Access Point salotto"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-cyan-500/60"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-slate-400 hover:text-white"
                >
                  Annulla
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-md shadow-cyan-950"
                >
                  Aggiungi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
