import type { Service } from '../types/service';

export const DEFAULT_SERVICES: Service[] = [
  {
    id: 'homeassistant',
    name: 'Home Assistant',
    description: 'Hub domotico centrale, gestione dispositivi smart e automazioni',
    category: 'Domotica',
    port: 8123,
    icon: 'Home',
    hasWebUi: true,
    isPinned: true,
    stack: 'home-assistant',
    color: '#03a9f4'
  },
  {
    id: 'music-assistant',
    name: 'Music Assistant',
    description: 'Streaming musicale multi-room per speaker e player di rete',
    category: 'Domotica',
    port: 8095,
    icon: 'Speaker',
    hasWebUi: true,
    stack: 'home-assistant',
    color: '#f59e0b'
  },
  {
    id: 'go2rtc',
    name: 'go2rtc',
    description: 'Streaming real-time e gestione flussi telecamere RTSP / WebRTC',
    category: 'Domotica',
    port: 1984,
    icon: 'Video',
    hasWebUi: true,
    stack: 'home-assistant',
    color: '#10b981'
  },
  {
    id: 'navidrome',
    name: 'Navidrome',
    description: 'Server di streaming musicale personale (compatibile Subsonic)',
    category: 'Media',
    port: 4533,
    icon: 'Disc',
    hasWebUi: true,
    isPinned: true,
    stack: 'navidrome',
    color: '#ec4899'
  },
  {
    id: 'metube',
    name: 'MeTube',
    description: 'Web GUI per yt-dlp per scaricare video e playlist sul server',
    category: 'Media',
    port: 9080,
    icon: 'Download',
    hasWebUi: true,
    stack: 'metube',
    color: '#ef4444'
  },
  {
    id: 'n8n',
    name: 'n8n',
    description: 'Workflow automation avanzata e integrazione flussi tra API e servizi',
    category: 'Automazione',
    port: 5678,
    icon: 'Workflow',
    hasWebUi: true,
    isPinned: true,
    stack: 'n8n',
    color: '#f97316'
  },
  {
    id: 'portainer',
    name: 'Portainer',
    description: 'Gestione container Docker, stack, immagini, volumi e log',
    category: 'Infrastruttura',
    port: 9000,
    icon: 'Boxes',
    hasWebUi: true,
    isPinned: true,
    stack: 'portainer',
    color: '#06b6d4'
  },
  {
    id: 'nginx-proxy-manager',
    name: 'Nginx Proxy Manager',
    description: 'Admin UI per reverse proxy, gestione certificati SSL Let\'s Encrypt',
    category: 'Infrastruttura',
    port: 81,
    icon: 'ShieldCheck',
    hasWebUi: true,
    stack: 'npm',
    color: '#3b82f6'
  },
  {
    id: 'mosquitto',
    name: 'Mosquitto MQTT',
    description: 'Broker MQTT per comunicazione sensori e microservizi IoT',
    category: 'Infrastruttura',
    port: 1883,
    icon: 'Cpu',
    hasWebUi: false,
    stack: 'ps5',
    color: '#8b5cf6'
  },
  {
    id: 'tunnel-cloudflared-1',
    name: 'Cloudflare Tunnel',
    description: 'Accesso sicuro da remoto senza apertura di porte sul router',
    category: 'Infrastruttura',
    icon: 'Cloud',
    hasWebUi: false,
    stack: 'tunnel',
    color: '#f59e0b'
  },
  {
    id: 'matter-server',
    name: 'Matter Server',
    description: 'Controller Python Matter Server per ecosistema smart home',
    category: 'Domotica',
    port: 5580,
    icon: 'Share2',
    hasWebUi: false,
    stack: 'home-assistant',
    color: '#14b8a6'
  },
  {
    id: 'ps5-mqtt',
    name: 'PS5 MQTT Bridge',
    description: 'Bridge per monitoraggio e controllo accensione PlayStation 5 via MQTT',
    category: 'Domotica',
    icon: 'Gamepad2',
    hasWebUi: false,
    stack: 'ps5',
    color: '#6366f1'
  },
  {
    id: 'airconnect',
    name: 'AirConnect',
    description: 'Bridge AirPlay per inviare audio a dispositivi Sonos / UPnP',
    category: 'Domotica',
    icon: 'Radio',
    hasWebUi: false,
    stack: 'airconnect',
    color: '#a855f7'
  },
  {
    id: 'metube-cleaner',
    name: 'MeTube Cleaner',
    description: 'Script cron automatico per pulizia file temporanei di MeTube',
    category: 'Media',
    icon: 'Trash2',
    hasWebUi: false,
    stack: 'metube',
    color: '#64748b'
  }
];
