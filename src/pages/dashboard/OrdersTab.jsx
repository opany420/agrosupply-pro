import React from 'react';
import { ShoppingCart, Search, Edit, Trash2, Plus } from "lucide-react";
import { formatDate, formatCurrency } from '../../utils';

const statusColors = {
  Delivered: "bg-emerald-100 text-emerald-700",
  Processing: "bg-blue-100 text-blue-700",
  Pending: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function OrdersTab({
  orders, filteredOrders, searchQuery, setSearchQuery,
  setShowNewOrderModal, setEditingOrder, setShowEditModal, handleDeleteOrder,
  currentPage, onPageChange,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Orders</h3>
          <p className="text-gray-500 text-sm">{orders.length} total orders</p>
        </div>
        <button onClick={() => setShowNewOrderModal(true)}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-colors">
          <Plus className="w-4 h-4" /> New Order
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {["Delivered", "Processing", "Pending", "Cancelled"].map(status => (
          <div key={status} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${statusColors[status]}`}>{status}</div>
            <div className="text-2xl font-bold text-gray-900">{orders.filter(o => o.status === status).length}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search orders..." value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full md:w-96" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>{["Order ID", "Client", "Product", "Amount", "Status", "Date", "Actions"].map(h => (
                <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-emerald-600">{order.order_number}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.client}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.product}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">{formatCurrency(order.amount)}</td>
                  <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>{order.status}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.created_at)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditingOrder({ ...order }); setShowEditModal(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => handleDeleteOrder(order.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No orders found</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage <= 1}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
        <span className="text-sm text-gray-500">Page {currentPage}</span>
        <button onClick={() => onPageChange(currentPage + 1)} disabled={orders.length < 10}
          className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
      </div>
    </div>
  );
}
