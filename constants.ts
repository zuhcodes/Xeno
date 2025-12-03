import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Target, 
  Send,
  ClipboardCheck
} from 'lucide-react';
import { KPICardProps, Segment, Campaign, Recommendation, RevenueChannel, TopPerformer, Notification, Customer } from './types';

export const KPI_DATA: KPICardProps[] = [
  {
    title: "MARKETING REVENUE",
    value: "$450k",
    change: 12,
    label: "vs last month",
    icon: DollarSign,
    actionLabel: "View Breakdown >"
  },
  {
    title: "REPEAT PURCHASE RATE",
    value: "34%",
    change: 2,
    label: "vs last month",
    icon: TrendingUp,
    actionLabel: "View Trend >"
  },
  {
    title: "ACQUISITION COST (CAC)",
    value: "$22",
    change: -8, 
    label: "vs last month",
    icon: CreditCard,
    actionLabel: "Optimize >"
  },
  {
    title: "ATTRIBUTED REVENUE",
    value: "$380k",
    change: 14,
    label: "vs last month",
    icon: Target,
    actionLabel: "View Source >"
  },
  {
    title: "CAMPAIGNS SENT (24H)",
    value: "380k",
    change: 180,
    label: "vs last month",
    icon: Send,
    actionLabel: "Details >"
  },
  {
    title: "DATA QUALITY SCORE",
    value: "98%",
    change: 0, 
    label: "vs last month",
    icon: ClipboardCheck,
    statusText: "Healthy",
    statusAction: "Fix Issues >"
  }
];

export const SEGMENTS: Segment[] = [
  {
    id: '1',
    name: 'VIP (High Value)',
    count: 2340,
    engagement: 76,
    lastActive: 'Today',
    statusColor: 'text-green-500'
  },
  {
    id: '2',
    name: 'At-Risk (Churn)',
    count: 1840,
    engagement: 18,
    lastActive: '60d ago',
    statusColor: 'text-orange-500'
  },
  {
    id: '3',
    name: 'New Customers',
    count: 890,
    engagement: 62,
    lastActive: 'This month',
    statusColor: 'text-blue-500'
  },
  {
    id: '4',
    name: 'Dormant',
    count: 3210,
    engagement: 5,
    lastActive: 'Never',
    statusColor: 'text-slate-400'
  }
];

export const CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    name: 'BLACK FRIDAY BLAST',
    type: 'SMS + EMAIL',
    recipients: '45K RECIPIENTS',
    status: 'RUNNING',
    statusLabel: 'RUNNING · Active now',
    channels: ['SMS', 'EMAIL'],
    stats: { open: 62, click: 8, revenue: '$18k' }
  },
  {
    id: 'c2',
    name: 'WELCOME FLOW',
    type: 'JOURNEY',
    recipients: '1.2K RECIPIENTS',
    status: 'RUNNING',
    statusLabel: 'RUNNING · Ongoing',
    channels: ['EMAIL'],
    stats: { open: 45, click: 12, revenue: '$5.2k' }
  },
  {
    id: 'c3',
    name: 'WIN-BACK OFFER',
    type: 'SMS',
    recipients: '1.8K RECIPIENTS',
    status: 'SCHEDULED',
    statusLabel: 'SCHEDULED · Tomorrow 9AM',
    channels: ['SMS'],
    stats: undefined
  },
  {
    id: 'c4',
    name: 'VALENTINES PRE-SALE',
    type: 'EMAIL',
    recipients: '28K RECIPIENTS',
    status: 'COMPLETED',
    statusLabel: 'COMPLETED · Yesterday',
    channels: ['EMAIL'],
    stats: { open: 31, click: 4, revenue: '$63k' }
  }
];

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'r1',
    type: 'URGENT',
    title: 'Churn Alert: 1,840 Customers',
    description: 'High value segment inactive for >60 days. Send win-back offer now.',
    impact: '18% Recovery',
    confidence: '88%',
    actionLabel: 'Action',
    segmentId: '2'
  },
  {
    id: 'r2',
    type: 'OPPORTUNITY',
    title: 'VIP Upsell Opportunity',
    description: 'VIP segment highly engaged. Announce new collection with 15% off.',
    impact: '+15% AOV',
    confidence: '92%',
    actionLabel: 'Action',
    segmentId: '1'
  },
  {
    id: 'r3',
    type: 'TRENDING',
    title: "Spike in 'Shoes' Category",
    description: '3k+ customers browsing shoes right now. Send cross-sell accessories.',
    impact: '8% CTR',
    confidence: '75%',
    actionLabel: 'Action',
    segmentId: '3' // Fallback to New Customers for prototype
  },
  {
    id: 'r4',
    type: 'QUALITY',
    title: 'Merge 234 Duplicates',
    description: 'Duplicate customer IDs detected. Fix before next campaign.',
    impact: 'Med',
    confidence: '100%',
    actionLabel: 'Action'
  }
];

export const REVENUE_CHANNELS: RevenueChannel[] = [
  { name: 'SMS Campaigns', amount: '$180k', percentage: 40, color: 'bg-teal-600' },
  { name: 'Email Flows', amount: '$90k', percentage: 20, color: 'bg-blue-500' },
  { name: 'WhatsApp', amount: '$72k', percentage: 16, color: 'bg-green-500' },
  { name: 'Loyalty', amount: '$54k', percentage: 12, color: 'bg-purple-500' },
  { name: 'Instagram', amount: '$36k', percentage: 8, color: 'bg-orange-500' },
  { name: 'Other', amount: '$18k', percentage: 4, color: 'bg-slate-400' }
];

export const TOP_PERFORMERS: TopPerformer[] = [
  { name: "Valentine's Offer", type: "SMS", roi: 420, revenue: "$63k" },
  { name: "Welcome Series", type: "Email", roi: 280, revenue: "$34k" },
  { name: "Repeat Upsell", type: "Mix", roi: 580, revenue: "$46k" }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', text: 'Win-Back Campaign scheduled for 7:00 PM today.', time: '10m ago', read: false },
  { id: 'n2', text: 'Data sync completed (98% success).', time: '1h ago', read: false },
  { id: 'n3', text: 'New AI recommendation: VIP Upsell ready.', time: '2h ago', read: true }
];

export const MOCK_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'Sarah Jenkins', lastPurchase: '2 days ago', ltv: '$1,240' },
  { id: 'c2', name: 'Mike Ross', lastPurchase: '5 days ago', ltv: '$850' },
  { id: 'c3', name: 'Jessica Pearson', lastPurchase: '12 days ago', ltv: '$2,100' },
  { id: 'c4', name: 'Harvey Specter', lastPurchase: '1 day ago', ltv: '$3,400' },
  { id: 'c5', name: 'Donna Paulsen', lastPurchase: 'Today', ltv: '$1,150' }
];
