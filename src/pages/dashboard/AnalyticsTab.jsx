import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  BarChart, Bar,
} from 'recharts';
import { formatCurrency } from '../../utils';

export default function AnalyticsTab({ orders, products, statsCards }) {
  const STATUS_COLORS = { Delivered: '#10b981', Processing: '#3b82f6', Pending: '#f59e0b', Cancelled: '#ef4444' };
  const statusData = ['Delivered', 'Processing', 'Pending', 'Cancelled'].map(status => ({
    name: status, value: orders.filter(o => o.status === status).length,
  })).filter(d => d.value > 0);

  // Revenue over time — group by date
  const revenueByDate = {};
  orders.forEach(o => {
    const date = o.created_at ? new Date(o.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : 'Unknown';
    const amount = parseFloat((o.amount || '').toString().replace(/[^0-9.]/g, '')) || 0;
    revenueByDate[date] = (revenueByDate[date] || 0) + amount;
  });
  const revenueData = Object.entries(revenueByDate).map(([date, revenue]) => ({ date, revenue }));

  // Top 5 products by stock
  const topProducts = [...products]
    .sort((a, b) => (b.stock || 0) - (a.stock || 0))
    .slice(0, 5)
    .map(p => ({ name: p.name.length > 18 ? p.name.slice(0, 18) + '…' : p.name, stock: p.stock || 0 }));

  return (
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h3>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map(stat => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Orders by Status — Pie Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Orders by Status</h4>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
                  paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {statusData.map(entry => (
                    <Cell key={entry.name} fill={STATUS_COLORS[entry.name] || '#94a3b8'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-16">No order data yet</p>
          )}
        </div>

        {/* Revenue Over Time — Line Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-lg font-bold text-gray-900 mb-4">Revenue Over Time</h4>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={v => [formatCurrency(v), 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-center py-16">No revenue data yet</p>
          )}
        </div>
      </div>

      {/* Top 5 Products by Stock — Bar Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h4 className="text-lg font-bold text-gray-900 mb-4">Top 5 Products by Stock</h4>
        {topProducts.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProducts} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={130} />
              <Tooltip formatter={v => [`${v} units`, 'Stock']} />
              <Bar dataKey="stock" fill="#10b981" radius={[0, 6, 6, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-400 text-center py-16">No product data yet</p>
        )}
      </div>
    </div>
  );
}
