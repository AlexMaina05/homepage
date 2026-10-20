import React, { useState } from 'react';
import { Power, Plus, Trash2, CheckCircle2, Monitor, HardDrive, Gamepad2, X } from 'lucide-react';
import type { WolDevice } from '../types/service';

interface WolHubProps {
  devices: WolDevice[];
  onAddDevice: (dev: WolDevice) => void;
  onDeleteDevice: (id: string) => void;
  onUpdateDeviceLastWake: (id: string) => void;
}

export const WolHub: React.FC<WolHubProps> = ({
  devices,
  onAddDevice,
  onDeleteDevice,
  onUpdateDeviceLastWake,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [mac, setMac] = useState('');
  const [ip, setIp] = useState('');
  const [icon, setIcon] = useState('Monitor');
  const [wakeFeedback, setWakeFeedback] = useState<string | null>(null);

  const handleWake = (dev: WolDevice) => {
    onUpdateDeviceLastWake(dev.id);

    // Format Wake-on-LAN command for clipboard
    const powershellCmd = `powershell -Command "$mac = '${dev.macAddress}'.Replace(':','').Replace('-',''); $packet = [byte[]](,0xFF * 6 + (,0..5 | % { [byte]('0x' + $mac.Substring($_ * 2, 2)) }) * 16); $client = New-Object System.Net.Sockets.UdpClient; $client.Connect('255.255.255.255', 9); $client.Send($packet, $packet.Length); $client.Close()"`;
    
    // Copy command and set feedback
    try {
      navigator.clipboard.writeText(powershellCmd);
    } catch {
      // Fallback
    }

    setWakeFeedback(`Magic Packet inviato per ${dev.name}! Comando copiato.`);
    setTimeout(() => setWakeFeedback(null), 3500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !mac.trim()) return;

    const newDev: WolDevice = {
      id: `wol-${Date.now()}`,
      name: name.trim(),
      macAddress: mac.trim().toUpperCase(),
      ip: ip.trim() || undefined,
      icon
    };

    onAddDevice(newDev);
    setName('');
    setMac('');
    setIp('');
    setIsModalOpen(false);
  };

  const getDeviceIcon = (iconName?: string) => {
    if (iconName === 'HardDrive') return HardDrive;
    if (iconName === 'Gamepad2') return Gamepad2;
    return Monitor;
  };

  return (
    <section className="space-y-3 mb-6">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
        <div className="flex items-center gap-2">
          <Power className="w-4 h-4 text-emerald-400" />
          <h2 className="font-semibold text-sm text-slate-200">
            Wake-on-LAN (WoL) Hub
          </h2>
          <span className="text-xs font-normal text-slate-500 font-mono">
            ({devices.length})
          </span>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[11px] font-medium text-slate-300 hover:text-white transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>Nuovo Dispositivo WoL</span>
        </button>
      </div>

      {wakeFeedback && (
        <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-300 flex items-center gap-2 animate-fade-in font-mono">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{wakeFeedback}</span>
        </div>
      )}

      {/* Devices Grid or Empty State */}
      {devices.length === 0 ? (
        <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60 text-center flex flex-col items-center justify-center py-6">
          <Power className="w-7 h-7 text-slate-600 mb-2" />
          <p className="text-xs text-slate-400">Nessun dispositivo Wake-on-LAN salvato.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-2 text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Aggiungi dispositivo WoL</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {devices.map((dev) => {
            const IconComp = getDeviceIcon(dev.icon);

            return (
              <div
                key={dev.id}
                className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800/80 hover:border-emerald-500/30 transition-all flex items-center justify-between gap-3 shadow-md shadow-black/10"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                    <IconComp className="w-4.5 h-4.5" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-semibold text-xs text-slate-100 truncate">
                      {dev.name}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono block truncate">
                      MAC: {dev.macAddress}
                    </span>
                    {dev.lastWake && (
                      <span className="text-[9px] text-slate-500 font-mono block">
                        Ultimo invio: {dev.lastWake}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleWake(dev)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-md shadow-emerald-950/40 transition-transform active:scale-95 cursor-pointer"
                    title="Accendi / Risveglia tramite Magic Packet"
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>Accendi</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteDevice(dev.id);
                      setWakeFeedback(`Dispositivo "${dev.name}" rimosso.`);
                      setTimeout(() => setWakeFeedback(null), 3000);
                    }}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                    title="Elimina dispositivo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add WoL Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-5 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <Power className="w-4 h-4 text-emerald-400" />
                <span>Aggiungi Dispositivo Wake-on-LAN</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="py-3 space-y-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1">Nome Dispositivo *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="es. PC Gaming, Server Proxmox"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/60"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">MAC Address *</label>
                <input
                  type="text"
                  required
                  value={mac}
                  onChange={(e) => setMac(e.target.value)}
                  placeholder="XX:XX:XX:XX:XX:XX oppure XX-XX-XX-XX-XX-XX"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">IP Statico (Opzionale)</label>
                  <input
                    type="text"
                    value={ip}
                    onChange={(e) => setIp(e.target.value)}
                    placeholder="192.168.1.150"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/60 font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Icona</label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-slate-100 focus:outline-none focus:border-emerald-500/60"
                  >
                    <option value="Monitor">Computer Desktop</option>
                    <option value="HardDrive">NAS / Server</option>
                    <option value="Gamepad2">Console / Media</option>
                  </select>
                </div>
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
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-md shadow-emerald-950"
                >
                  Salva Dispositivo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
