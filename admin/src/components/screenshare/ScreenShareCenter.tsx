import React, { useState } from 'react';
import { ScreenShare, StopCircle, ShieldAlert, Monitor, Volume2, Wifi } from 'lucide-react';
import { Smartboard } from '../../types';

interface ScreenShareCenterProps {
  smartboards: Smartboard[];
}

export const ScreenShareCenter: React.FC<ScreenShareCenterProps> = ({ smartboards }) => {
  const [isSharing, setIsSharing] = useState(false);
  const [includeAudio, setIncludeAudio] = useState(true);
  const [selectedBoards, setSelectedBoards] = useState<string[]>([]);

  const onlineBoards = smartboards.filter(b => b.status === 'online');

  const handleStartScreenShare = () => {
    if (onlineBoards.length === 0) {
      alert("No online smartboards available for screen sharing.");
      return;
    }
    setIsSharing(true);
  };

  const handleStopScreenShare = () => {
    setIsSharing(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Live Screen Sharing</h2>
        <p className="text-sm text-slate-500">Stream your principal desktop or application window live to classroom smartboards.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-2xl ${isSharing ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-blue-100 text-blue-600'}`}>
              <ScreenShare size={36} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">
                {isSharing ? 'Screen Sharing is Live' : 'Principal Screen Broadcast'}
              </h3>
              <p className="text-xs text-slate-500">
                {isSharing ? 'Transmitting low-latency WebRTC stream to classroom smartboards.' : 'Click below to select display source and start sharing.'}
              </p>
            </div>
          </div>

          <div>
            {isSharing ? (
              <button
                onClick={handleStopScreenShare}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all flex items-center space-x-2"
              >
                <StopCircle size={20} />
                <span>STOP SHARING</span>
              </button>
            ) : (
              <button
                onClick={handleStartScreenShare}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all flex items-center space-x-2"
              >
                <ScreenShare size={20} />
                <span>SHARE MY SCREEN</span>
              </button>
            )}
          </div>
        </div>

        {/* Options */}
        <div className="border-t pt-6 border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-xl">
            <input
              type="checkbox"
              id="audio"
              checked={includeAudio}
              onChange={e => setIncludeAudio(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <div>
              <label htmlFor="audio" className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                <Volume2 size={16} className="text-slate-600" />
                <span>Include Computer Audio</span>
              </label>
              <p className="text-xs text-slate-500">Transmit system sound and media audio to classrooms during screen share.</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-slate-50 p-4 rounded-xl">
            <Wifi size={24} className="text-emerald-600" />
            <div>
              <p className="text-sm font-bold text-slate-800">Local LAN WebRTC Transport</p>
              <p className="text-xs text-slate-500">Optimized for school local network without external cloud relays.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
