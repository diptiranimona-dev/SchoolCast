import React from 'react';
import { Monitor, CheckCircle2, XCircle, Radio, Activity, ShieldAlert } from 'lucide-react';
import { Smartboard, BroadcastSession } from '../../types';

interface DashboardOverviewProps {
  smartboards: Smartboard[];
  activeBroadcasts: BroadcastSession[];
  onQuickBroadcast: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  smartboards,
  activeBroadcasts,
  onQuickBroadcast
}) => {
  const totalBoards = smartboards.length;
  const onlineBoards = smartboards.filter(b => b.status === 'online').length;
  const offlineBoards = totalBoards - onlineBoards;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 rounded-2xl p-8 text-white shadow-xl flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">SchoolCast Command Centre</h2>
          <p className="text-blue-200 mt-2 text-sm max-w-xl">
            Instantly broadcast announcements, livestreams, and screen shares to selected classroom smartboards while preserving teacher whiteboards.
          </p>
        </div>
        <button
          onClick={onQuickBroadcast}
          className="bg-white text-blue-900 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 shadow-lg transition-all flex items-center space-x-2"
        >
          <Radio size={20} className="text-blue-600 animate-pulse" />
          <span>Start Broadcast</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Smartboards</p>
            <h3 className="text-3xl font-bold text-slate-800 mt-1">{totalBoards}</h3>
          </div>
          <div className="bg-blue-100 p-4 rounded-xl text-blue-600">
            <Monitor size={28} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Online Boards</p>
            <h3 className="text-3xl font-bold text-emerald-600 mt-1">{onlineBoards}</h3>
          </div>
          <div className="bg-emerald-100 p-4 rounded-xl text-emerald-600">
            <CheckCircle2 size={28} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Offline Boards</p>
            <h3 className="text-3xl font-bold text-rose-600 mt-1">{offlineBoards}</h3>
          </div>
          <div className="bg-rose-100 p-4 rounded-xl text-rose-600">
            <XCircle size={28} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Active Broadcasts</p>
            <h3 className="text-3xl font-bold text-amber-600 mt-1">{activeBroadcasts.length}</h3>
          </div>
          <div className="bg-amber-100 p-4 rounded-xl text-amber-600">
            <Activity size={28} />
          </div>
        </div>
      </div>

      {/* Connected Smartboards Status Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Smartboard Status Overview</h3>
          <span className="text-xs text-slate-500 font-medium">Auto-refreshing via WebSocket</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <th className="py-4 px-6">Classroom</th>
                <th className="py-4 px-6">Board ID</th>
                <th className="py-4 px-6">IP Address</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Last Seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {smartboards.map((board) => (
                <tr key={board.board_id} className="hover:bg-slate-50">
                  <td className="py-4 px-6 font-semibold text-slate-800">{board.classroom}</td>
                  <td className="py-4 px-6 text-slate-600 font-mono text-xs">{board.board_id}</td>
                  <td className="py-4 px-6 text-slate-500 font-mono text-xs">{board.ip_address || "—"}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      board.status === 'online' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${board.status === 'online' ? 'bg-emerald-600' : 'bg-rose-600'}`}></span>
                      <span className="capitalize">{board.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-xs">{new Date(board.last_seen).toLocaleTimeString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
