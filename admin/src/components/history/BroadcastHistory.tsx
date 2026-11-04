import React, { useEffect, useState } from 'react';
import { History, CheckCircle2, XCircle } from 'lucide-react';
import { BroadcastSession } from '../../types';

export const BroadcastHistory: React.FC = () => {
  const [history, setHistory] = useState<BroadcastSession[]>([]);

  useEffect(() => {
    fetch('/api/broadcasts/history')
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Broadcast History & Audit Logs</h2>
        <p className="text-sm text-slate-500">Review past broadcast sessions, delivery success rates, and timestamps.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-800">Completed Broadcasts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <th className="py-4 px-6">Session Title</th>
                <th className="py-4 px-6">Content Type</th>
                <th className="py-4 px-6">Start Time</th>
                <th className="py-4 px-6">End Time</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Deliveries</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {history.map(item => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="py-4 px-6 font-semibold text-slate-800">{item.title}</td>
                  <td className="py-4 px-6 text-slate-600 uppercase text-xs font-mono">{item.content_type}</td>
                  <td className="py-4 px-6 text-slate-500 text-xs">{new Date(item.start_time).toLocaleString()}</td>
                  <td className="py-4 px-6 text-slate-500 text-xs">{item.end_time ? new Date(item.end_time).toLocaleString() : 'Ongoing'}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${
                      item.status === 'broadcasting' ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-xs font-medium text-emerald-600">
                    {item.successful_deliveries} Success / {item.failed_deliveries} Failed
                  </td>
                </tr>
              ))}
              {history.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">No broadcast history found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
