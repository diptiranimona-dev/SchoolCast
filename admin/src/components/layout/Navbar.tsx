import React from 'react';
import { Wifi, Bell, UserCircle } from 'lucide-react';

interface NavbarProps {
  serverConnected: boolean;
  activeBroadcastCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ serverConnected, activeBroadcastCount }) => {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <h2 className="text-xl font-bold text-slate-800">School Admin Portal</h2>
        {activeBroadcastCount > 0 && (
          <span className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full animate-pulse flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600"></span>
            <span>{activeBroadcastCount} Active Broadcast{activeBroadcastCount > 1 ? 's' : ''}</span>
          </span>
        )}
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2 bg-slate-100 px-3 py-1.5 rounded-full">
          <Wifi size={16} className={serverConnected ? "text-emerald-600" : "text-rose-600"} />
          <span className="text-xs font-medium text-slate-700">
            {serverConnected ? "Server Connected" : "Connecting..."}
          </span>
        </div>

        <button className="relative text-slate-600 hover:text-slate-900">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
        </button>

        <div className="flex items-center space-x-3 border-l pl-6 border-slate-200">
          <UserCircle size={36} className="text-slate-700" />
          <div className="text-left">
            <p className="text-sm font-bold text-slate-800">Principal</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};
