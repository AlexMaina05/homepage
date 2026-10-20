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

export interface NetworkBookmark {
  id: string;
  name: string;
  url: string;
  icon: string;
  category: 'Network' | 'Repository' | 'Hardware' | 'Altro';
  color?: string;
  description?: string;
}

export interface WolDevice {
  id: string;
  name: string;
  macAddress: string;
  ip?: string;
  icon?: string;
  lastWake?: string;
}

export interface AppTab {
  id: string;
  serviceId: string;
  title: string;
  icon: string;
  url: string;
  color?: string;
}

export interface AppSettings {
  serverHost: string; // e.g. "192.168.1.100" or "localhost"
  defaultProtocol: 'http' | 'https';
  openMode: 'iframe' | 'new_tab'; // in-app embedded viewer vs new tab
  theme: 'dark' | 'light' | 'system';
  showBackendServices: boolean;
  viewMode: 'grid' | 'compact';
  enableWidgets: boolean;
  portainerApiKey?: string;
  homeAssistantToken?: string;
  userName?: string;
  weatherCity?: string;
  weatherLatitude?: number;
  weatherLongitude?: number;
  showWeather?: boolean;
  serverNotes?: string;
  showBookmarks?: boolean;
  showScratchpad?: boolean;
  wolDevices?: WolDevice[];
}
