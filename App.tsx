import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Settings, 
  Plus, 
  FileText, 
  Users, 
  GitBranch, 
  CheckSquare, 
  Download, 
  RefreshCw,
  MoreHorizontal,
  Search,
  ChevronDown,
  AlertTriangle,
  Zap,
  TrendingUp,
  CheckCircle2,
  X,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  LogOut,
  Moon,
  Sun,
  User,
  Clock,
  Play,
  Pause,
  Eye,
  Calendar,
  MessageSquare,
  Mail,
  Send
} from 'lucide-react';
import { 
  KPI_DATA, 
  SEGMENTS, 
  CAMPAIGNS, 
  RECOMMENDATIONS, 
  REVENUE_CHANNELS, 
  TOP_PERFORMERS,
  MOCK_NOTIFICATIONS,
  MOCK_CUSTOMERS
} from './constants';
import { KPICardProps, Segment, Campaign, Recommendation, DraftCampaign, Toast } from './types';

// --- Components ---

function AuthView({ onSignIn }: { onSignIn: () => void }) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <div className="w-16 h-16 bg-[#2A8587] rounded-xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-3xl">X</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">You have signed out</h1>
        <p className="text-slate-500 mb-8">Thank you for using Xeno Marketing Platform.</p>
        <button 
          onClick={onSignIn}
          className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white py-3 rounded-xl font-bold transition-colors shadow-md"
        >
          Sign in again
        </button>
      </div>
    </div>
  );
}

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div key={toast.id} className="bg-slate-800 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-[300px] animate-in slide-in-from-right fade-in duration-300">
           {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-green-400" />}
           {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-400" />}
           <span className="text-sm font-medium">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-xl" }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; maxWidth?: string }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className={`bg-white rounded-2xl shadow-xl w-full ${maxWidth} max-h-[90vh] flex flex-col`}>
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

// --- Main App Component ---

function App() {
  // Global State
  const [signedIn, setSignedIn] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Data State
  const [kpiData, setKpiData] = useState(KPI_DATA);
  const [segments, setSegments] = useState(SEGMENTS);
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);
  const [recommendations, setRecommendations] = useState(RECOMMENDATIONS);
  
  // UI State
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Modal State
  const [modals, setModals] = useState({
    newCampaign: false,
    reviewCampaign: false,
    campaignDetails: false,
    segmentDetails: false,
    dataQuality: false
  });
  
  const [activeSegmentId, setActiveSegmentId] = useState<string | null>(null);
  const [activeCampaignId, setActiveCampaignId] = useState<string | null>(null);
  
  // Campaign Form State
  const [draftCampaign, setDraftCampaign] = useState<DraftCampaign>({
    name: '',
    template: 'Custom',
    segmentId: '1',
    channels: { sms: true, email: true, whatsapp: false },
    smsCopy: '',
    emailSubject: '',
    offer: '',
    scheduleType: 'now'
  });

  // --- Helpers ---

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const closeAllDropdowns = () => {
    setNotificationsOpen(false);
    setSettingsOpen(false);
    setProfileOpen(false);
  };

  // --- Handlers ---

  const handleSignOut = () => {
    setSignedIn(false);
    closeAllDropdowns();
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    addToast(`Theme set to ${newTheme} mode`, 'info');
    closeAllDropdowns();
    // In a real app, this would trigger CSS changes. 
    // Since this is a prototype requesting minimal changes, we just track state 
    // and maybe apply a class to body if we had access to global CSS logic.
  };

  const openNewCampaign = (template = 'Custom', segmentId?: string) => {
    const targetSegmentId = segmentId || segments[0].id;
    const segment = segments.find(s => s.id === targetSegmentId);
    
    // Auto-fill logic
    let name = '';
    let smsCopy = '';
    let emailSubject = '';
    
    if (template === 'Win-Back Offer') {
       name = `Win-Back – ${segment?.name || 'Customers'}`;
       smsCopy = `We miss you! Come back and enjoy 20% off your next order. Shop now: bit.ly/shop`;
       emailSubject = `We miss you, it's time for a comeback ❤️`;
    } else if (template === 'Welcome Series') {
       name = `Welcome – ${segment?.name || 'New Users'}`;
       smsCopy = `Welcome to XENO! Here's 15% off your first order. Use code WELCOME15.`;
       emailSubject = `Welcome to XENO! Your 15% off is inside`;
    } else if (template === 'VIP Upsell') {
       name = `VIP Exclusive – ${segment?.name || 'VIPs'}`;
       smsCopy = `Hi VIP! Our new collection just dropped. Get early access now.`;
       emailSubject = `Exclusive Early Access for our VIPs 🌟`;
    } else {
       name = `Campaign – ${new Date().toLocaleDateString()}`;
    }

    setDraftCampaign({
      name,
      template,
      segmentId: targetSegmentId,
      channels: { sms: true, email: true, whatsapp: false },
      smsCopy,
      emailSubject,
      offer: '',
      scheduleType: 'now'
    });
    
    setModals(m => ({ ...m, newCampaign: true }));
  };

  const handleReviewCampaign = () => {
    setModals(m => ({ ...m, newCampaign: false, reviewCampaign: true }));
  };

  const handleSendCampaign = () => {
    const newId = Date.now().toString();
    const segment = segments.find(s => s.id === draftCampaign.segmentId);
    
    // Create new campaign object
    const newCampaign: Campaign = {
      id: newId,
      name: draftCampaign.name,
      type: Object.keys(draftCampaign.channels).filter(k => (draftCampaign.channels as any)[k]).join(' + ').toUpperCase(),
      recipients: `${(segment?.count || 0).toLocaleString()} RECIPIENTS`,
      status: draftCampaign.scheduleType === 'now' ? 'RUNNING' : 'SCHEDULED',
      statusLabel: draftCampaign.scheduleType === 'now' ? 'RUNNING · just launched' : `SCHEDULED · ${draftCampaign.scheduleDate || 'Tomorrow'}`,
      channels: Object.keys(draftCampaign.channels).filter(k => (draftCampaign.channels as any)[k]).map(c => c.toUpperCase()),
      stats: draftCampaign.scheduleType === 'now' ? { open: 0, click: 0, revenue: '$0' } : undefined
    };

    setCampaigns(prev => [newCampaign, ...prev]);
    setModals(m => ({ ...m, reviewCampaign: false }));
    addToast(`Campaign '${draftCampaign.name}' ${draftCampaign.scheduleType === 'now' ? 'sent' : 'scheduled'} successfully!`, 'success');
  };

  const handleEditDraft = () => {
    setModals(m => ({ ...m, reviewCampaign: false, newCampaign: true }));
  };

  const handleMergeDuplicates = () => {
    // Mock logic: Reduce duplicate count, improve score, update recommendation
    const updatedKpi = kpiData.map(k => {
      if (k.title.includes("DATA QUALITY")) return { ...k, value: "99%", change: 1, statusText: "Excellent" };
      return k;
    });
    setKpiData(updatedKpi);
    
    // Remove the Quality recommendation or mark it done
    setRecommendations(prev => prev.filter(r => r.type !== 'QUALITY'));
    
    setModals(m => ({ ...m, dataQuality: false }));
    addToast("Merged 89 duplicate pairs. Remaining 145 for manual review.", "success");
  };

  const handleRecommendationAction = (rec: Recommendation) => {
    if (rec.type === 'QUALITY') {
      setModals(m => ({ ...m, dataQuality: true }));
    } else {
      let template = 'Custom';
      if (rec.type === 'URGENT') template = 'Win-Back Offer';
      if (rec.type === 'OPPORTUNITY') template = 'VIP Upsell';
      if (rec.type === 'TRENDING') template = 'Cross-Sell Accessories';
      
      openNewCampaign(template, rec.segmentId);
    }
  };

  const handleDismissRec = (id: string) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
  };

  const handleCampaignAction = (id: string, action: 'pause' | 'resume' | 'send_now') => {
    setCampaigns(prev => prev.map(c => {
      if (c.id === id) {
        if (action === 'pause') return { ...c, status: 'PAUSED', statusLabel: 'PAUSED · manually paused' };
        if (action === 'resume') return { ...c, status: 'RUNNING', statusLabel: 'RUNNING · resumed' };
        if (action === 'send_now') return { ...c, status: 'RUNNING', statusLabel: 'RUNNING · started just now', stats: { open: 0, click: 0, revenue: '$0' } };
      }
      return c;
    }));
    
    if (action === 'send_now') addToast('Campaign started successfully', 'success');
  };

  // --- Render ---

  if (!signedIn) {
    return <AuthView onSignIn={() => setSignedIn(true)} />;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-[#f8fafc] text-slate-800'} font-sans relative`}>
      {/* Toast Layer */}
      <ToastContainer toasts={toasts} />

      {/* Header */}
      <header className={`border-b h-16 px-6 flex items-center justify-between sticky top-0 z-20 ${theme === 'dark' ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2A8587] rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">X</span>
            </div>
            <span className="text-[#2A8587] font-bold text-xl tracking-tight">XENO</span>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-500">
            <span className={`${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'} font-medium`}>Forever New</span>
            <span className="text-slate-300">|</span>
            <span>Marketing Manager</span>
            <span className="text-slate-300">|</span>
            <span className={`${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Dashboard</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Data Quality Pill - Interactive */}
          <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border ${theme === 'dark' ? 'bg-orange-900/20 border-orange-800 text-orange-400' : 'bg-orange-50 border-orange-100'}`}>
            <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
            <span className="text-xs font-medium text-orange-700">
              {kpiData.find(k => k.title === "DATA QUALITY SCORE")?.value === "99%" ? "145 duplicates remaining" : "234 duplicate IDs detected"} 
              <button onClick={() => setModals(m => ({ ...m, dataQuality: true }))} className="underline font-bold hover:text-orange-800 ml-1">Fix</button>
            </span>
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1"></div>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => { closeAllDropdowns(); setNotificationsOpen(!notificationsOpen); }}
              className={`relative p-2 transition-colors rounded-full hover:bg-slate-100 ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500'}`}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-30 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-2 border-b border-slate-100 font-bold text-sm text-slate-800">Notifications</div>
                <div className="max-h-64 overflow-y-auto">
                  {MOCK_NOTIFICATIONS.map(n => (
                    <div key={n.id} className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0">
                      <p className="text-sm text-slate-700 font-medium mb-1">{n.text}</p>
                      <span className="text-xs text-slate-400">{n.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="relative">
            <button 
              onClick={() => { closeAllDropdowns(); setSettingsOpen(!settingsOpen); }}
              className={`p-2 transition-colors rounded-full hover:bg-slate-100 ${theme === 'dark' ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500'}`}
            >
              <Settings className="w-5 h-5" />
            </button>
            {settingsOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 animate-in fade-in zoom-in-95 duration-200">
                 <button onClick={handleThemeToggle} className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between">
                   <span>Theme: {theme === 'light' ? 'Light' : 'Dark'}</span>
                   {theme === 'light' ? <Sun className="w-4 h-4 text-orange-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
                 </button>
                 <div className="px-4 py-2 text-sm text-slate-400 cursor-not-allowed">Language: English</div>
                 <div className="px-4 py-2 text-sm text-slate-400 cursor-not-allowed">Time zone: Auto</div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <div 
              onClick={() => { closeAllDropdowns(); setProfileOpen(!profileOpen); }}
              className="w-8 h-8 bg-[#2A8587] rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-90 transition-opacity"
            >
              JD
            </div>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 animate-in fade-in zoom-in-95 duration-200">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="text-sm font-bold text-slate-800">John Doe</div>
                  <div className="text-xs text-slate-500">Marketing Manager</div>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">View Profile</button>
                <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto p-6 space-y-6" onClick={closeAllDropdowns}>
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
            <button onClick={() => openNewCampaign()} className="flex items-center gap-2 bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
              <Plus className="w-4 h-4" />
              New Campaign
            </button>
            {/* Other Toolbar Buttons - Interactive placeholders */}
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
              <FileText className="w-4 h-4 text-slate-400" />
              Templates
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
              <Users className="w-4 h-4 text-slate-400" />
              View Segments
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
              <GitBranch className="w-4 h-4 text-slate-400" />
              Journeys
            </button>
            <button className="relative flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
              <CheckSquare className="w-4 h-4 text-slate-400" />
              Approvals
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm border border-white">3</span>
            </button>
            <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm whitespace-nowrap">
              <Download className="w-4 h-4 text-slate-400" />
              Export
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpiData.map((kpi, index) => (
            <KPICard 
              key={index} 
              {...kpi} 
              onActionClick={(e) => {
                 e.stopPropagation();
                 if (kpi.statusAction) setModals(m => ({ ...m, dataQuality: true }));
              }}
            />
          ))}
        </div>

        {/* 3-Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Left Column: Segments */}
          <div className="xl:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0d9488]" />
                <h2 className="font-bold text-slate-800 uppercase text-sm tracking-wide">Segments</h2>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              {segments.map((segment) => (
                <div 
                  key={segment.id} 
                  onClick={() => { setActiveSegmentId(segment.id); setModals(m => ({...m, segmentDetails: true})); }}
                  className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className={`font-semibold ${segment.id === '1' ? 'text-[#0d9488]' : segment.id === '2' ? 'text-slate-800' : 'text-[#0d9488]'}`}>
                        {segment.name}
                      </h3>
                      <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-0.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>{segment.count.toLocaleString()} users</span>
                      </div>
                    </div>
                    <button className="text-slate-300 hover:text-slate-500">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs mt-3 pt-3 border-t border-slate-50">
                    <span className={segment.statusColor}>{segment.engagement}% engaged</span>
                    <span className="text-slate-400">{segment.lastActive}</span>
                  </div>
                </div>
              ))}
              
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                 <button className="w-full flex items-center justify-between p-4 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                   <div className="flex items-center gap-2">
                     <span className="text-amber-700">📦</span>
                     <span>By Product Category</span>
                   </div>
                   <ChevronDown className="w-4 h-4 text-slate-400" />
                 </button>
              </div>
            </div>
          </div>

          {/* Middle Column: Active Campaigns */}
          <div className="xl:col-span-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0d9488]" />
                <h2 className="font-bold text-slate-800 uppercase text-sm tracking-wide">Active Campaigns</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <select className="appearance-none bg-white border border-slate-200 text-slate-600 text-xs font-medium rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:border-transparent cursor-pointer">
                    <option>Status: All</option>
                    <option>Running</option>
                    <option>Scheduled</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                <button className="p-1.5 text-slate-400 hover:text-slate-600">
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">This Week</div>

            <div className="space-y-3">
              {campaigns.map((campaign) => (
                <div key={campaign.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-2.5">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                            campaign.status === 'RUNNING' ? 'bg-green-500' : 
                            campaign.status === 'SCHEDULED' ? 'bg-slate-400' : 
                            campaign.status === 'PAUSED' ? 'bg-amber-400' :
                            'bg-slate-300'
                          }`} />
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">{campaign.name}</h3>
                          <p className="text-xs text-slate-500 mt-1 uppercase font-medium tracking-wide">
                            {campaign.type} • {campaign.recipients}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                        campaign.status === 'RUNNING' ? 'bg-green-50 text-green-700 border-green-200' :
                        campaign.status === 'SCHEDULED' ? 'bg-slate-100 text-slate-600 border-slate-200' :
                        campaign.status === 'PAUSED' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-slate-50 text-slate-500 border-slate-200'
                      }`}>
                        {campaign.statusLabel || campaign.status}
                      </span>
                    </div>

                    {campaign.stats ? (
                      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-50">
                        <div className="text-center">
                          <div className="text-sm font-bold text-slate-800">{campaign.stats.open}%</div>
                          <div className="text-[10px] text-slate-500 font-medium">Open</div>
                        </div>
                        <div className="text-center border-l border-slate-100">
                          <div className="text-sm font-bold text-slate-800">{campaign.stats.click}%</div>
                          <div className="text-[10px] text-slate-500 font-medium">Click</div>
                        </div>
                        <div className="text-center border-l border-slate-100">
                          <div className="text-sm font-bold text-slate-800">{campaign.stats.revenue}</div>
                          <div className="text-[10px] text-slate-500 font-medium">Rev</div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center px-2">
                         <span className="text-xs text-slate-400 text-center w-full block">- No stats available yet -</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-slate-50 px-4 py-2 flex justify-end gap-3 border-t border-slate-100">
                     {/* Campaign Actions */}
                     {campaign.status === 'RUNNING' && (
                       <button onClick={() => handleCampaignAction(campaign.id, 'pause')} className="text-xs font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1">
                         <Pause className="w-3 h-3" /> Pause
                       </button>
                     )}
                     {campaign.status === 'PAUSED' && (
                       <button onClick={() => handleCampaignAction(campaign.id, 'resume')} className="text-xs font-medium text-green-600 hover:text-green-700 flex items-center gap-1">
                         <Play className="w-3 h-3" /> Resume
                       </button>
                     )}
                     {campaign.status === 'SCHEDULED' && (
                       <button onClick={() => handleCampaignAction(campaign.id, 'send_now')} className="text-xs font-medium text-[#0d9488] hover:text-[#0f766e] flex items-center gap-1">
                         <Send className="w-3 h-3" /> Send Now
                       </button>
                     )}
                     
                     <div className="w-px h-4 bg-slate-200 mx-1"></div>
                     
                     <button onClick={() => { setActiveCampaignId(campaign.id); setModals(m => ({...m, campaignDetails: true})); }} className="text-xs font-medium text-slate-500 hover:text-[#0d9488]">View Report</button>
                     <button onClick={() => openNewCampaign('Custom', '1')} className="text-xs font-medium text-slate-500 hover:text-[#0d9488]">Edit</button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => openNewCampaign()} className="w-full border-2 border-dashed border-slate-200 rounded-xl p-3 text-slate-400 text-sm font-medium hover:border-[#0d9488] hover:text-[#0d9488] transition-colors flex items-center justify-center gap-2 group">
              <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Create New Campaign
            </button>
          </div>

          {/* Right Column: AI Recommendations */}
          <div className="xl:col-span-3 space-y-4">
             <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#0d9488]" />
                <h2 className="font-bold text-slate-800 uppercase text-sm tracking-wide">AI Recommendations</h2>
              </div>

              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div key={rec.id} className={`p-4 rounded-xl border shadow-sm transition-all duration-300 ${
                    rec.type === 'URGENT' ? 'bg-red-50 border-red-100' :
                    rec.type === 'OPPORTUNITY' ? 'bg-blue-50 border-blue-100' :
                    rec.type === 'TRENDING' ? 'bg-orange-50 border-orange-100' :
                    'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2 mb-1">
                        {rec.type === 'URGENT' ? <AlertTriangle className="w-4 h-4 text-red-600" /> :
                         rec.type === 'OPPORTUNITY' ? <ArrowUpRight className="w-4 h-4 text-blue-600" /> :
                         rec.type === 'TRENDING' ? <TrendingUp className="w-4 h-4 text-orange-600" /> :
                         <CheckCircle2 className="w-4 h-4 text-slate-600" />
                        }
                        <span className={`text-xs font-bold tracking-wide uppercase ${
                           rec.type === 'URGENT' ? 'text-red-700' :
                           rec.type === 'OPPORTUNITY' ? 'text-blue-700' :
                           rec.type === 'TRENDING' ? 'text-orange-700' :
                           'text-slate-700'
                        }`}>{rec.type}</span>
                      </div>
                      <button onClick={() => handleDismissRec(rec.id)} className="text-slate-400 hover:text-slate-600 p-1">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="font-bold text-slate-800 text-sm mb-1">{rec.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-3">{rec.description}</p>

                    <div className="flex items-end justify-between">
                      <div className="text-[10px] text-slate-500 font-medium space-y-0.5">
                        <div>Impact: <span className="text-slate-800">{rec.impact}</span></div>
                        {rec.confidence && <div>Conf: <span className="text-slate-800">{rec.confidence}</span></div>}
                      </div>
                      <button 
                        onClick={() => handleRecommendationAction(rec)}
                        className={`px-3 py-1.5 rounded text-xs font-medium text-white shadow-sm transition-transform active:scale-95 hover:opacity-90 ${
                         rec.type === 'URGENT' ? 'bg-[#dc2626]' : 
                         rec.type === 'OPPORTUNITY' ? 'bg-[#0d9488]' : 
                         rec.type === 'TRENDING' ? 'bg-[#f97316]' : 
                         'bg-[#1e293b]'
                      }`}>
                        {rec.actionLabel}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
          </div>
        </div>

        {/* Revenue Attribution Section */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl mr-1">💰</span>
              <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Revenue Attribution <span className="text-[#0d9488] ml-1">$450,000</span></h2>
            </div>
            <div className="flex gap-2 text-sm text-slate-500">
               <p>Marketing attributed revenue breakdown for this month</p>
            </div>
            <div className="flex items-center gap-3">
               <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                 <Download className="w-4 h-4" />
                 Export Report
               </button>
               <button className="text-sm font-medium text-slate-500 hover:text-[#0d9488]">View Details</button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Charts (Left) */}
            <div className="lg:col-span-8 space-y-5">
              {REVENUE_CHANNELS.map((channel, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-slate-700">{channel.name}</span>
                    <div>
                      <span className="font-bold text-slate-800">{channel.amount}</span>
                      <span className="text-slate-400 text-xs ml-1">({channel.percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className={`h-full rounded-full ${channel.color}`} style={{ width: `${channel.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Top Performers (Right) */}
            <div className="lg:col-span-4 bg-slate-50 rounded-xl p-5 border border-slate-100">
               <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide mb-4">Top Performing (ROI)</h3>
               <div className="space-y-4">
                 {TOP_PERFORMERS.map((perf, idx) => (
                   <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-800 text-sm">{perf.name}</div>
                        <div className="text-xs text-slate-500 uppercase font-medium">{perf.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600 text-sm">{perf.roi}%</div>
                        <div className="text-xs text-slate-400">{perf.revenue}</div>
                      </div>
                   </div>
                 ))}
               </div>
               <button className="w-full text-center text-sm font-medium text-[#0d9488] mt-6 hover:underline">
                 View All Campaigns
               </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center text-slate-400 text-xs py-6">
          © 2024 Xeno Marketing Platform. Confidential - For internal use only.
        </footer>
      </main>

      {/* --- MODALS --- */}
      
      {/* NEW CAMPAIGN MODAL */}
      <Modal isOpen={modals.newCampaign} onClose={() => setModals(m => ({...m, newCampaign: false}))} title="Create New Campaign">
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Template</label>
              <select 
                value={draftCampaign.template}
                onChange={(e) => setDraftCampaign(prev => ({...prev, template: e.target.value}))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none"
              >
                <option>Custom</option>
                <option>Win-Back Offer</option>
                <option>Welcome Series</option>
                <option>VIP Upsell</option>
                <option>Cross-Sell Accessories</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Segment</label>
              <select 
                 value={draftCampaign.segmentId}
                 onChange={(e) => setDraftCampaign(prev => ({...prev, segmentId: e.target.value}))}
                 className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none"
              >
                {segments.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Channels</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={draftCampaign.channels.sms} 
                  onChange={e => setDraftCampaign(prev => ({...prev, channels: {...prev.channels, sms: e.target.checked}}))}
                  className="rounded text-[#0d9488] focus:ring-[#0d9488]" 
                />
                <span className="text-sm text-slate-700">SMS</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={draftCampaign.channels.email} 
                  onChange={e => setDraftCampaign(prev => ({...prev, channels: {...prev.channels, email: e.target.checked}}))}
                  className="rounded text-[#0d9488] focus:ring-[#0d9488]" 
                />
                <span className="text-sm text-slate-700">Email</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={draftCampaign.channels.whatsapp} 
                  onChange={e => setDraftCampaign(prev => ({...prev, channels: {...prev.channels, whatsapp: e.target.checked}}))}
                  className="rounded text-[#0d9488] focus:ring-[#0d9488]" 
                />
                <span className="text-sm text-slate-700">WhatsApp</span>
              </label>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Campaign Name</label>
             <input 
               type="text" 
               value={draftCampaign.name}
               onChange={(e) => setDraftCampaign(prev => ({...prev, name: e.target.value}))}
               className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none"
             />
          </div>

          {draftCampaign.channels.sms && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SMS Copy</label>
              <textarea 
                rows={3}
                value={draftCampaign.smsCopy}
                onChange={(e) => setDraftCampaign(prev => ({...prev, smsCopy: e.target.value}))}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none"
              />
              <div className="text-xs text-slate-400 text-right mt-1">{draftCampaign.smsCopy.length}/160</div>
            </div>
          )}

          {draftCampaign.channels.email && (
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Email Subject</label>
               <input 
                 type="text" 
                 value={draftCampaign.emailSubject}
                 onChange={(e) => setDraftCampaign(prev => ({...prev, emailSubject: e.target.value}))}
                 className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none"
               />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Offer</label>
               <input 
                 type="text" 
                 placeholder="e.g. 20% Off"
                 value={draftCampaign.offer}
                 onChange={(e) => setDraftCampaign(prev => ({...prev, offer: e.target.value}))}
                 className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none"
               />
             </div>
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Schedule</label>
               <select 
                 value={draftCampaign.scheduleType}
                 onChange={(e) => setDraftCampaign(prev => ({...prev, scheduleType: e.target.value as any}))}
                 className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#0d9488] focus:border-transparent outline-none"
               >
                 <option value="now">Send Now</option>
                 <option value="later">Schedule for Later</option>
               </select>
             </div>
          </div>
          
          {draftCampaign.scheduleType === 'later' && (
             <div className="grid grid-cols-2 gap-4">
                <input type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none" />
                <input type="time" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none" />
             </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
             <button onClick={() => setModals(m => ({...m, newCampaign: false}))} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Cancel</button>
             <button onClick={handleReviewCampaign} className="px-4 py-2 text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-lg">Review & Send</button>
          </div>
        </div>
      </Modal>

      {/* REVIEW CAMPAIGN MODAL */}
      <Modal isOpen={modals.reviewCampaign} onClose={() => setModals(m => ({...m, reviewCampaign: false}))} title="Review Campaign">
        <div className="space-y-6">
           <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
             <div className="flex justify-between">
                <span className="text-sm text-slate-500">Campaign Name</span>
                <span className="text-sm font-bold text-slate-800">{draftCampaign.name}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-sm text-slate-500">Segment</span>
                <span className="text-sm font-bold text-slate-800">{segments.find(s => s.id === draftCampaign.segmentId)?.name}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-sm text-slate-500">Recipients</span>
                <span className="text-sm font-bold text-slate-800">{segments.find(s => s.id === draftCampaign.segmentId)?.count.toLocaleString()}</span>
             </div>
             <div className="flex justify-between">
                <span className="text-sm text-slate-500">Channels</span>
                <div className="flex gap-2">
                   {draftCampaign.channels.sms && <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">SMS</span>}
                   {draftCampaign.channels.email && <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2 py-0.5 rounded">EMAIL</span>}
                </div>
             </div>
           </div>

           <div>
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Previews</h3>
              <div className="space-y-4">
                 {draftCampaign.channels.sms && (
                   <div className="border border-slate-200 rounded-lg p-3 relative">
                      <div className="absolute top-0 right-0 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 rounded-bl">SMS</div>
                      <p className="text-sm text-slate-700 font-mono">{draftCampaign.smsCopy}</p>
                   </div>
                 )}
                 {draftCampaign.channels.email && (
                   <div className="border border-slate-200 rounded-lg p-3 relative">
                      <div className="absolute top-0 right-0 bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500 rounded-bl">EMAIL</div>
                      <div className="text-sm font-medium text-slate-800 mb-1">Subject: {draftCampaign.emailSubject}</div>
                   </div>
                 )}
              </div>
           </div>
           
           <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex items-center gap-3">
              <Zap className="w-5 h-5 text-green-600" />
              <div>
                 <div className="text-xs font-bold text-green-700 uppercase">Predicted Performance</div>
                 <div className="text-sm text-green-800">Est. Revenue Lift: <span className="font-bold">+18%</span> • Open Rate: <span className="font-bold">~42%</span></div>
              </div>
           </div>

           <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
             <button onClick={handleEditDraft} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">Back</button>
             <button onClick={handleSendCampaign} className="px-4 py-2 text-sm font-medium text-white bg-[#0d9488] hover:bg-[#0f766e] rounded-lg shadow-lg shadow-teal-500/20 flex items-center gap-2">
               <Send className="w-4 h-4" />
               {draftCampaign.scheduleType === 'now' ? 'Send Now' : 'Schedule'}
             </button>
          </div>
        </div>
      </Modal>

      {/* SEGMENT DETAILS MODAL */}
      <Modal isOpen={modals.segmentDetails} onClose={() => setModals(m => ({...m, segmentDetails: false}))} title="Segment Details">
         <div className="space-y-6">
            {segments.find(s => s.id === activeSegmentId) && (
               <>
                 <div className="flex items-start justify-between">
                    <div>
                       <h3 className="text-2xl font-bold text-slate-800">{segments.find(s => s.id === activeSegmentId)?.name}</h3>
                       <p className="text-slate-500 text-sm mt-1">{segments.find(s => s.id === activeSegmentId)?.count.toLocaleString()} active users</p>
                    </div>
                    <div className="text-right">
                       <div className={`text-xl font-bold ${segments.find(s => s.id === activeSegmentId)?.statusColor}`}>
                          {segments.find(s => s.id === activeSegmentId)?.engagement}%
                       </div>
                       <div className="text-xs text-slate-400 font-medium uppercase">Engagement Rate</div>
                    </div>
                 </div>
                 
                 <div>
                    <h4 className="font-bold text-slate-800 text-sm mb-3">Sample Customers</h4>
                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                       <table className="w-full text-sm text-left">
                          <thead className="bg-slate-50 text-slate-500 font-medium">
                             <tr>
                                <th className="px-4 py-2">Name</th>
                                <th className="px-4 py-2">Last Purchase</th>
                                <th className="px-4 py-2 text-right">LTV</th>
                             </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                             {MOCK_CUSTOMERS.map(c => (
                                <tr key={c.id}>
                                   <td className="px-4 py-2.5 font-medium text-slate-700">{c.name}</td>
                                   <td className="px-4 py-2.5 text-slate-500">{c.lastPurchase}</td>
                                   <td className="px-4 py-2.5 text-right text-slate-700">{c.ltv}</td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                 </div>

                 <div className="flex justify-end pt-4">
                    <button 
                      onClick={() => {
                        setModals(m => ({...m, segmentDetails: false}));
                        openNewCampaign('Custom', activeSegmentId!);
                      }}
                      className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white py-2.5 rounded-lg font-bold shadow-sm"
                    >
                       Create Campaign for Segment
                    </button>
                 </div>
               </>
            )}
         </div>
      </Modal>

      {/* DATA QUALITY MODAL */}
      <Modal isOpen={modals.dataQuality} onClose={() => setModals(m => ({...m, dataQuality: false}))} title="Data Quality Issues">
         <div className="space-y-6">
            <div className="flex items-center gap-4 bg-orange-50 p-4 rounded-xl border border-orange-100">
               <AlertTriangle className="w-8 h-8 text-orange-500" />
               <div>
                  <h3 className="font-bold text-orange-800">234 Duplicate Customer Profiles</h3>
                  <p className="text-sm text-orange-700">These profiles share the same email or phone number but have different IDs.</p>
               </div>
            </div>

            <div>
               <h4 className="font-bold text-slate-800 text-sm mb-3">Examples</h4>
               <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                     <div className="text-sm">
                        <span className="font-medium">john.doe@gmail.com</span>
                        <div className="text-slate-400 text-xs">IDs: u_123, u_982</div>
                     </div>
                     <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">Match: 100%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                     <div className="text-sm">
                        <span className="font-medium">sarah.j@hotmail.com</span>
                        <div className="text-slate-400 text-xs">IDs: u_442, u_112</div>
                     </div>
                     <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">Match: 100%</span>
                  </div>
               </div>
            </div>

            <button 
               onClick={handleMergeDuplicates}
               className="w-full bg-[#0d9488] hover:bg-[#0f766e] text-white py-3 rounded-xl font-bold shadow-md flex items-center justify-center gap-2"
            >
               <RefreshCw className="w-4 h-4" />
               Auto-merge Duplicates
            </button>
         </div>
      </Modal>

      {/* CAMPAIGN DETAILS MODAL */}
      <Modal isOpen={modals.campaignDetails} onClose={() => setModals(m => ({...m, campaignDetails: false}))} title="Campaign Report">
         <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
               <BarChart3 className="w-8 h-8 text-slate-300" />
            </div>
            <p className="font-medium">Detailed charts not implemented in this prototype.</p>
            <p className="text-sm mt-2">Campaign ID: {activeCampaignId}</p>
         </div>
      </Modal>

    </div>
  );
}

function KPICard({ title, value, change, label, icon: Icon, actionLabel, statusText, statusAction, onClick, onActionClick }: KPICardProps) {
  const isPositive = change >= 0;
  const isNeutral = change === 0;

  return (
    <div 
      onClick={onClick}
      className={`bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-full min-h-[140px] ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
           <Icon className="w-5 h-5" strokeWidth={1.5} />
        </div>
        {statusText ? (
           <div className="text-right">
             <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1 opacity-70">DATA QUALITY SCORE</div>
           </div>
        ) : (
           <div className="text-right flex-1 ml-3">
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 line-clamp-1" title={title}>{title}</div>
           </div>
        )}
      </div>

      <div className="mt-4">
        {statusText ? (
          <div>
            <div className="text-3xl font-bold text-slate-800 tracking-tight">{value}</div>
            <div className="flex items-center gap-2 mt-2">
               <span className="text-sm font-bold text-green-500 flex items-center gap-1">
                 <ArrowUpRight className="w-3.5 h-3.5" />
                 {statusText}
               </span>
               <span className="text-xs text-slate-400">{label}</span>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-3xl font-bold text-slate-800 tracking-tight">{value}</div>
            <div className="flex items-center gap-2 mt-2">
               {!isNeutral && (
                 <span className={`text-sm font-bold flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                   {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                   {Math.abs(change)}%
                 </span>
               )}
               <span className="text-xs text-slate-400">{label}</span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-50">
         <button 
            onClick={onActionClick}
            className={`text-xs font-medium flex items-center hover:underline ${statusAction ? 'text-blue-500' : 'text-[#0d9488]'}`}
         >
            {statusAction || actionLabel}
         </button>
      </div>
    </div>
  );
}

// Helper icon for modal placeholder
function BarChart3(props: any) {
  return (
    <svg 
      {...props}
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  )
}

export default App;