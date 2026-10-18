import type { Service, AppSettings } from '../types/service';

export function getServiceUrl(service: Service, settings: AppSettings): string | null {
  if (!service.hasWebUi) return null;
  if (service.customUrl && service.customUrl.trim().length > 0) {
    return service.customUrl.trim();
  }
  if (!service.port) return null;

  const host = settings.serverHost.trim() || 'localhost';
  const proto = service.protocol || settings.defaultProtocol;
  const path = service.path ? (service.path.startsWith('/') ? service.path : `/${service.path}`) : '';

  // Check if host already contains protocol
  if (host.startsWith('http://') || host.startsWith('https://')) {
    return `${host}:${service.port}${path}`;
  }

  return `${proto}://${host}:${service.port}${path}`;
}

export function getDisplayUrl(service: Service): string {
  if (service.customUrl) {
    try {
      const url = new URL(service.customUrl);
      return url.hostname + (url.port ? `:${url.port}` : '');
    } catch {
      return service.customUrl;
    }
  }
  if (service.port) {
    return `:${service.port}`;
  }
  return 'Backend only';
}
