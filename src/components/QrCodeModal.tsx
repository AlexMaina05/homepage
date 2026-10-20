import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { X, Copy, Check, Smartphone, ExternalLink } from 'lucide-react';
import { ServiceIcon } from './ServiceIcon';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  icon: string;
  color?: string;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  title,
  url,
  icon,
  color,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && canvasRef.current && url) {
      QRCode.toCanvas(
        canvasRef.current,
        url,
        {
          width: 220,
          margin: 2,
          color: {
            dark: '#0f172a',
            light: '#ffffff'
          }
        },
        (error) => {
          if (error) console.error('Error generating QR code:', error);
        }
      );
    }
  }, [isOpen, url]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl p-6 text-slate-100 flex flex-col items-center text-center"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Service Header */}
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 shadow-lg"
          style={{
            backgroundColor: `${color || '#38bdf8'}22`,
            color: color || '#38bdf8',
            border: `1px solid ${color || '#38bdf8'}44`
          }}
        >
          <ServiceIcon name={icon} className="w-6 h-6" />
        </div>

        <h3 className="font-bold text-base text-white">{title}</h3>
        <p className="text-xs text-slate-400 mt-0.5 mb-4 flex items-center justify-center gap-1.5">
          <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
          <span>Apri subito su smartphone / tablet</span>
        </p>

        {/* QR Code Container */}
        <div className="p-3 bg-white rounded-2xl shadow-xl shadow-cyan-950/40 mb-4 flex items-center justify-center">
          <canvas ref={canvasRef} className="rounded-lg" />
        </div>

        {/* URL Box & Copy */}
        <div className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-2 mb-4">
          <span className="font-mono text-xs text-cyan-300 truncate text-left select-all">
            {url}
          </span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors shrink-0"
            title="Copia link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Guidance Note */}
        <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
          Inquadra il codice con la fotocamera del telefono connesso alla stessa rete Wi-Fi locale.
        </p>

        {/* External Link Button */}
        <button
          onClick={() => window.open(url, '_blank')}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 text-xs font-medium border border-cyan-500/30 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Apri nel browser del PC</span>
        </button>
      </div>
    </div>
  );
};
