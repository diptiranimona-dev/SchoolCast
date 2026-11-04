import React, { useState } from 'react';
import { Monitor, Plus, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { Smartboard } from '../../types';

interface SmartboardManagerProps {
  smartboards: Smartboard[];
  onRefresh: () => void;
}

export const SmartboardManager: React.FC<SmartboardManagerProps> = ({ smartboards, onRefresh }) => {
  const [boardId, setBoardId] = useState('');
  const [classroom, setClassroom] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardId || !classroom) return;
    setLoading(true);
    try {
      await fetch('/api/smartboards/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ board_id: boardId, classroom, ip_address: ipAddress || null })
      });
      setBoardId('');
      setClassroom('');
      setIpAddress('');
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to remove smartboard ${id}?`)) return;
    try {
      await fetch(`/api/smartboards/${id}`, { method: 'DELETE' });
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Smartboard Management</h2>
          <p className="text-sm text-slate-500">Register and configure classroom smartboards connected to SchoolCast.</p>
        </div>
      </div>

      {/* Registration Form */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center space-x-2">
          <Plus size={20} className="text-blue-600" />
          <span>Register New Smartboard</span>
        </h3>
        <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Board ID</label>
            <input
              type="text"
              placeholder="e.g. SC-007"
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Classroom Name</label>
            <input
              type="text"
              placeholder="e.g. Class 10A"
              value={classroom}
              onChange={(e) => setClassroom(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">IP Address (Optional)</label>
            <input
              type="text"
              placeholder="e.g. 192.168.1.50"
              value={ipAddress}
              onChange={(e) => setIpAddress(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-mono"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Plus size={18} />
              <span>Register Board</span>
            </button>
          </div>
        </form>
      </div>

      {/* Smartboards Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">Registered Smartboards ({smartboards.length})</h3>
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
                <th className="py-4 px-6 text-right">Actions</th>
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
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(board.board_id)}
                      className="text-rose-600 hover:text-rose-800 p-2 rounded-lg hover:bg-rose-50 transition-all"
                      title="Remove Board"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
