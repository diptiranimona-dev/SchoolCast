import React, { useState } from 'react';
import { Settings, Save, Shield, Server, Wifi } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [serverIp, setServerIp] = useState('192.168.1.100');
  const [serverPort, setServerPort] = useState('8000');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">System Settings & Network Configuration</h2>
        <p className="text-sm text-slate-500">Configure server endpoints, network parameters, and security credentials.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
          <Server size={20} className="text-blue-600" />
          <span>Server Network Configuration</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Server IP Address</label>
            <input
              type="text"
              value={serverIp}
              onChange={e => setServerIp(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-[11px] text-slate-400 mt-1">IP address where SchoolCast Server is running on the school LAN.</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Server Port</label>
            <input
              type="text"
              value={serverPort}
              onChange={e => setServerPort(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="pt-4 flex items-center space-x-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-md transition-all flex items-center space-x-2"
            >
              <Save size={18} />
              <span>Save Configuration</span>
            </button>
            {saved && <span className="text-emerald-600 text-xs font-bold">Settings saved successfully!</span>}
          </div>
        </form>
      </div>
    </div>
  );
};
