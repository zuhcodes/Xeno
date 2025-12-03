import { LucideIcon } from 'lucide-react';

export interface KPICardProps {
  title: string;
  value: string;
  change: number; // positive or negative percentage
  label: string; // e.g., "vs last month"
  icon: LucideIcon;
  actionLabel?: string;
  isCurrency?: boolean;
  statusText?: string; // For "Healthy" etc.
  statusAction?: string; // For "Fix Issues"
  onClick?: () => void;
  onActionClick?: (e: React.MouseEvent) => void;
}

export interface Segment {
  id: string;
  name: string;
  count: number;
  engagement: number;
  lastActive: string;
  statusColor: string; // hex or tailwind class
}

export interface Campaign {
  id: string;
  name: string;
  type: string; // e.g., "SMS + EMAIL"
  recipients: string;
  status: 'RUNNING' | 'SCHEDULED' | 'COMPLETED' | 'PAUSED';
  statusLabel?: string; // e.g., "RUNNING · just launched"
  channels?: string[];
  stats?: {
    open: number;
    click: number;
    revenue: string;
  };
}

export interface Recommendation {
  id: string;
  type: 'URGENT' | 'OPPORTUNITY' | 'TRENDING' | 'QUALITY';
  title: string;
  description: string;
  impact: string;
  confidence?: string;
  actionLabel: string;
  segmentId?: string; // Link to segment
}

export interface RevenueChannel {
  name: string;
  amount: string;
  percentage: number;
  color: string;
}

export interface TopPerformer {
  name: string;
  type: string;
  roi: number;
  revenue: string;
}

export interface Notification {
  id: string;
  text: string;
  time: string;
  read: boolean;
}

export interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

export interface Customer {
  id: string;
  name: string;
  lastPurchase: string;
  ltv: string;
}

export interface DraftCampaign {
  id?: string; // If editing
  name: string;
  template: string;
  segmentId: string;
  channels: {
    sms: boolean;
    email: boolean;
    whatsapp: boolean;
  };
  smsCopy: string;
  emailSubject: string;
  offer: string;
  scheduleType: 'now' | 'later';
  scheduleDate?: string;
  scheduleTime?: string;
}
