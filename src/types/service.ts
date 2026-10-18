export type ServiceCategory = 'Domotica' | 'Media' | 'Automazione' | 'Infrastruttura' | 'Altro';

export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  port?: number;
  customUrl?: string;
  protocol?: 'http' | 'https';
  path?: string;
  icon: string;
  hasWebUi: boolean;
  isPinned?: boolean;
  stack?: string;
  color?: string; // hex or tailwind color class
  notes?: string;
}

export interface AppSettings {
  serverHost: string; // e.g. "192.168.1.100" or "localhost"
  defaultProtocol: 'http' | 'https';
  openMode: 'iframe' | 'new_tab'; // in-app embedded viewer vs new tab
  theme: 'dark' | 'light' | 'system';
  showBackendServices: boolean;
  viewMode: 'grid' | 'compact';
}
