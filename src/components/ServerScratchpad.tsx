import React, { useState, useEffect } from 'react';
import { FileText, Copy, Check, Trash2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface ServerScratchpadProps {
  notes: string;
  onSaveNotes: (notes: string) => void;
}

const DEFAULT_NOTES_TEMPLATE = `📌 Homelab Quick Notes & Cheatsheet:
- Subnet locale: 192.168.1.0/24
- Gateway Router: 192.168.1.1
- Porte principali:
  - Home Assistant: :8123
  - Portainer: :9000
  - Navidrome: :4533
  - MeTube: :9080
  - n8n: :5678
  - NPM Admin: :81
- Comandi utili:
  - docker compose ps
  - docker compose logs -f --tail=100 <container>
  - docker system prune -a --volumes
`;

export const ServerScratchpad: React.FC<ServerScratchpadProps> = ({
  notes,
  onSaveNotes,
}) => {
  const [content, setContent] = useState(notes || DEFAULT_NOTES_TEMPLATE);
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveIndicator, setSaveIndicator] = useState(false);

  useEffect(() => {
    if (notes) {
      setContent(notes);
    }
  }, [notes]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);
    onSaveNotes(val);
    setSaveIndicator(true);
    setTimeout(() => setSaveIndicator(false), 1500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    if (confirm("Vuoi cancellare gli appunti dello scratchpad?")) {
      setContent('');
      onSaveNotes('');
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-950/80 border border-slate-800/80 shadow-lg shadow-black/20 overflow-hidden mb-6 transition-all">
      {/* Header Bar */}
      <div
        onClick={() => setIsExpanded((prev) => !prev)}
        className="px-4 py-3 bg-slate-900/80 hover:bg-slate-850 cursor-pointer flex items-center justify-between gap-3 select-none transition-colors border-b border-slate-800/60"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
              <span>Scratchpad & Note Server</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                {content.length} caratteri
              </span>
            </h3>
            <p className="text-[10px] text-slate-400">
              Appunti rapidi, porte, comandi Docker e promemoria salvati in locale
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveIndicator && (
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 animate-pulse">
              <Sparkles className="w-3 h-3" /> Salvato
            </span>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Copia tutto negli appunti"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleClear();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-300 hover:bg-slate-800 transition-colors"
            title="Cancella appunti"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>

          <div className="text-slate-400 p-1">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expandable Textarea */}
      {isExpanded && (
        <div className="p-3 bg-slate-950/70 border-t border-slate-800/40 animate-fade-in">
          <textarea
            value={content}
            onChange={handleChange}
            placeholder="Scrivi qui i tuoi appunti, IP del router, password temporanee, snippet docker-compose..."
            rows={8}
            className="w-full bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 leading-relaxed resize-y"
          />
          <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-slate-500">
            <span>Gli appunti vengono salvati automaticamente nel browser e inclusi nei backup JSON.</span>
            <span>Markdown / testo semplice</span>
          </div>
        </div>
      )}
    </div>
  );
};
