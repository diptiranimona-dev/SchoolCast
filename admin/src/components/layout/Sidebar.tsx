import React from 'react';
import { LayoutDashboard, Monitor, Radio, ScreenShare, History, Settings, ShieldCheck } from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'smartboards', label: 'Smartboards', icon: Monitor },
    { id: 'broadcast', label: 'Broadcast Center', icon: Radio },
    { id: 'screenshare', label: 'Screen Sharing', icon: ScreenShare },
    { id: 'history', label: 'Broadcast History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h1 className="font-bold text-white text-lg tracking-wide">SchoolCast</h1>
          <p className="text-xs text-slate-400">Principal Control Centre</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'hover:bg-slate-800 hover:text-white text-slate-400'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
        SchoolCast v1.0.0 • LAN Smartboard System
      </div>
    </aside>
  );
};
