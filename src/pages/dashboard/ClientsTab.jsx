import React from 'react';
import { Users, Trash2, Plus } from "lucide-react";

const statusColors = {
  Active: "bg-emerald-100 text-emerald-700",
  Inactive: "bg-gray-100 text-gray-700",
};

export default function ClientsTab({
  clients, setShowClientModal, handleDeleteClient,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Clients</h3>
          <p className="text-gray-500 text-sm">{clients.length} registered clients</p>
        </div>
        <button onClick={() => setShowClientModal(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-colors">
          <Plus className="w-4 h-4" /> Add Client
        </button>
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>{["Client", "Email", "Phone", "Orders", "Total Spent", "Status", "Actions"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clients.map(client => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">{(client.name || '?')[0]}</div>
                      <span className="text-sm font-medium text-gray-900">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{client.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{client.phone || '—'}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{client.total_orders || 0}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{client.total_spent || 'KES 0'}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[client.status]}`}>{client.status}</span></td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDeleteClient(client.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {clients.length === 0 && <div className="text-center py-12 text-gray-400"><Users className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No clients yet</p></div>}
        </div>
      </div>
    </div>
  );
}
