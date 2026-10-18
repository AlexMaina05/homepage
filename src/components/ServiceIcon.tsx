import React from 'react';
import {
  Home,
  Speaker,
  Video,
  Disc,
  Download,
  Workflow,
  Boxes,
  ShieldCheck,
  Cpu,
  Cloud,
  Share2,
  Gamepad2,
  Radio,
  Trash2,
  Server,
  Terminal,
  Activity,
  HardDrive,
  Database,
  Globe,
  Flame,
  Layers,
  type LucideProps
} from 'lucide-react';

const iconMap: Record<string, React.FC<LucideProps>> = {
  Home,
  Speaker,
  Video,
  Disc,
  Download,
  Workflow,
  Boxes,
  ShieldCheck,
  Cpu,
  Cloud,
  Share2,
  Gamepad2,
  Radio,
  Trash2,
  Server,
  Terminal,
  Activity,
  HardDrive,
  Database,
  Globe,
  Flame,
  Layers
};

interface ServiceIconProps extends LucideProps {
  name: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name] || Server;
  return <IconComponent {...props} />;
};

export const AVAILABLE_ICONS = Object.keys(iconMap);
