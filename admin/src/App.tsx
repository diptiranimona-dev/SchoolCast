import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { SmartboardManager } from './components/smartboards/SmartboardManager';
import { BroadcastCenter } from './components/broadcast/BroadcastCenter';
import { ScreenShareCenter } from './components/screenshare/ScreenShareCenter';
import { BroadcastHistory } from './components/history/BroadcastHistory';
import { SettingsView } from './components/settings/SettingsView';
import { Smartboard, BroadcastSession } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [smartboards, setSmartboards] = useState<Smartboard[]>([]);
  const [activeBroadcasts, setActiveBroadcasts] = useState<BroadcastSession[]>([]);
  const [serverConnected, setServerConnected] = useState(false);

  const fetchData = async () => {
    try {
      const sbRes = await fetch('/api/smartboards/');
      if (sbRes.ok) {
        const sbData = await sbRes.json();
        setSmartboards(sbData);
        setServerConnected(true);
      }

      const bcRes = await fetch('/api/broadcasts/active');
      if (bcRes.ok) {
        const bcData = await bcRes.json();
        setActiveBroadcasts(bcData);
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setServerConnected(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen bg-slate-100 overflow-hidden">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar serverConnected={serverConnected} activeBroadcastCount={activeBroadcasts.length} />

        <main className="flex-1 overflow-y-auto p-8">
          {currentTab === 'dashboard' && (
            <DashboardOverview
              smartboards={smartboards}
              activeBroadcasts={activeBroadcasts}
              onQuickBroadcast={() => setCurrentTab('broadcast')}
            />
          )}
          {currentTab === 'smartboards' && (
            <SmartboardManager smartboards={smartboards} onRefresh={fetchData} />
          )}
          {currentTab === 'broadcast' && (
            <BroadcastCenter
              smartboards={smartboards}
              activeBroadcasts={activeBroadcasts}
              onRefresh={fetchData}
            />
          )}
          {currentTab === 'screenshare' && (
            <ScreenShareCenter smartboards={smartboards} />
          )}
          {currentTab === 'history' && (
            <BroadcastHistory />
          )}
          {currentTab === 'settings' && (
            <SettingsView />
          )}
        </main>
      </div>
    </div>
  );
}
