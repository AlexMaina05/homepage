import type { NetworkBookmark } from '../types/service';

export const DEFAULT_BOOKMARKS: NetworkBookmark[] = [
  {
    id: 'router-gateway',
    name: 'Router / Modem Gateway',
    url: 'http://192.168.1.1',
    icon: 'Radio',
    category: 'Network',
    color: '#3b82f6',
    description: 'Pannello di controllo gateway e DHCP di casa'
  },
  {
    id: 'gitea-local',
    name: 'Gitea (Locale)',
    url: 'http://localhost:3000',
    icon: 'Terminal',
    category: 'Repository',
    color: '#10b981',
    description: 'Server Git self-hosted locale'
  },
  {
    id: 'github-remote',
    name: 'GitHub AlexMaina05',
    url: 'https://github.com/AlexMaina05',
    icon: 'Globe',
    category: 'Repository',
    color: '#a855f7',
    description: 'Repository cloud e backup remoti'
  },
  {
    id: 'cloudflare-dash',
    name: 'Cloudflare Zero Trust',
    url: 'https://one.dash.cloudflare.com',
    icon: 'Cloud',
    category: 'Network',
    color: '#f97316',
    description: 'Gestione tunnel e policy di accesso sicuro'
  }
];
