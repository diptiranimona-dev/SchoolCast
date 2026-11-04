import React, { useState } from 'react';
import { Radio, StopCircle, CheckSquare, Square, FileText, Image, Globe, Youtube, Video, Presentation } from 'lucide-react';
import { Smartboard, BroadcastSession } from '../../types';

interface BroadcastCenterProps {
  smartboards: Smartboard[];
  activeBroadcasts: BroadcastSession[];
  onRefresh: () => void;
}

export const BroadcastCenter: React.FC<BroadcastCenterProps> = ({ smartboards, activeBroadcasts, onRefresh }) => {
  const [selectedBoardIds, setSelectedBoardIds] = useState<string[]>([]);
  const [contentType, setContentType] = useState<'text' | 'image' | 'pdf' | 'website' | 'youtube' | 'video' | 'ppt'>('text');
  const [title, setTitle] = useState('');
  const [heading, setHeading] = useState('');
  const [body, setBody] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);

  const onlineBoards = smartboards.filter(b => b.status === 'online');

  const handleSelectAll = () => setSelectedBoardIds(onlineBoards.map(b => b.board_id));
  const handleDeselectAll = () => setSelectedBoardIds([]);
  const handleSelectOnline = () => setSelectedBoardIds(onlineBoards.map(b => b.board_id));

  const toggleBoard = (boardId: string) => {
    if (selectedBoardIds.includes(boardId)) {
      setSelectedBoardIds(selectedBoardIds.filter(id => id !== boardId));
    } else {
      setSelectedBoardIds([...selectedBoardIds, boardId]);
    }
  };

  const handleStartBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedBoardIds.length === 0) {
      alert("Please select at least one smartboard.");
      return;
    }
    if (!title) {
      alert("Please enter a broadcast title.");
      return;
    }

    setLoading(true);
    let contentData: any = {};
    if (contentType === 'text') {
      contentData = { heading: heading || title, body };
    } else if (contentType === 'website' || contentType === 'youtube') {
      contentData = { url: urlInput };
    } else if (contentType === 'image') {
      contentData = { url: urlInput };
    }

    try {
      const res = await fetch('/api/broadcasts/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          content_type: contentType,
          content_data: contentData,
          selected_boards: selectedBoardIds
        })
      });
      if (res.ok) {
        setTitle('');
        setHeading('');
        setBody('');
        setUrlInput('');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStopBroadcast = async (sessionId: number) => {
    try {
      await fetch(`/api/broadcasts/stop/${sessionId}`, { method: 'POST' });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Broadcast Center</h2>
        <p className="text-sm text-slate-500">Take over selected smartboards instantly without closing teacher applications.</p>
      </div>

      {/* Active Broadcasts Section */}
      {activeBroadcasts.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-bold text-rose-900 mb-4 flex items-center space-x-2">
            <Radio className="text-rose-600 animate-pulse" size={20} />
            <span>Active Broadcast Sessions</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBroadcasts.map(b => (
              <div key={b.id} className="bg-white p-5 rounded-xl border border-rose-200 flex items-center justify-between shadow-sm">
                <div>
                  <h4 className="font-bold text-slate-800">{b.title}</h4>
                  <p className="text-xs text-slate-500 capitalize">Type: {b.content_type} • Started: {new Date(b.start_time).toLocaleTimeString()}</p>
                  <p className="text-xs text-emerald-600 font-semibold mt-1">Successful Deliveries: {b.successful_deliveries}</p>
                </div>
                <button
                  onClick={() => handleStopBroadcast(b.id)}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-4 py-2 rounded-xl text-sm shadow-md transition-all flex items-center space-x-1.5"
                >
                  <StopCircle size={16} />
                  <span>End Broadcast</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smartboard Selection System */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">1. Select Target Smartboards</h3>
          <div className="flex space-x-2 text-xs">
            <button onClick={handleSelectAll} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-all">Select All</button>
            <button onClick={handleDeselectAll} className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-all">Deselect All</button>
            <button onClick={handleSelectOnline} className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold rounded-lg transition-all">Select Online</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {smartboards.map(board => {
            const isSelected = selectedBoardIds.includes(board.board_id);
            const isOnline = board.status === 'online';
            return (
              <div
                key={board.board_id}
                onClick={() => isOnline && toggleBoard(board.board_id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  isSelected ? 'border-blue-600 bg-blue-50/50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300'
                } ${!isOnline ? 'opacity-60 cursor-not-allowed bg-slate-50' : ''}`}
              >
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{board.classroom}</h4>
                  <p className="text-xs text-slate-500 font-mono">{board.board_id}</p>
                  <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {isOnline ? 'Online' : 'Offline'}
                  </span>
                </div>
                <div>
                  {isSelected ? <CheckSquare className="text-blue-600" size={20} /> : <Square className="text-slate-300" size={20} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Broadcast Content Configuration */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <h3 className="text-lg font-bold text-slate-800">2. Configure Broadcast Content</h3>

        {/* Content Type Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {[
            { id: 'text', label: 'Announcement', icon: FileText },
            { id: 'image', label: 'Image', icon: Image },
            { id: 'pdf', label: 'PDF Document', icon: FileText },
            { id: 'website', label: 'Website URL', icon: Globe },
            { id: 'youtube', label: 'YouTube / Live', icon: Youtube },
            { id: 'video', label: 'Local Video', icon: Video },
            { id: 'ppt', label: 'PowerPoint', icon: Presentation },
          ].map(item => {
            const Icon = item.icon;
            const isActive = contentType === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setContentType(item.id as any)}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center space-y-2 transition-all ${
                  isActive ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold shadow-md' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs text-center">{item.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleStartBroadcast} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Broadcast Title</label>
            <input
              type="text"
              placeholder="e.g. Morning Assembly Announcement"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
              required
            />
          </div>

          {contentType === 'text' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Heading</label>
                <input
                  type="text"
                  placeholder="e.g. IMPORTANT NOTICE"
                  value={heading}
                  onChange={e => setHeading(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Announcement Text / Message</label>
                <textarea
                  rows={4}
                  placeholder="Enter message to display fullscreen on selected smartboards..."
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  required
                />
              </div>
            </div>
          )}

          {(contentType === 'website' || contentType === 'youtube' || contentType === 'image') && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                {contentType === 'youtube' ? 'YouTube Video / Livestream URL' : contentType === 'website' ? 'Website URL' : 'Image URL'}
              </label>
              <input
                type="text"
                placeholder={contentType === 'youtube' ? 'https://www.youtube.com/watch?v=...' : 'https://...'}
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
                required
              />
            </div>
          )}

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all flex items-center space-x-2 text-base"
            >
              <Radio size={20} className="animate-pulse" />
              <span>START BROADCAST ({selectedBoardIds.length} Boards Selected)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
