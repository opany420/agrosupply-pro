import React, { useState } from 'react';
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Package, Users, ShoppingCart, 
  TrendingUp, Bell, Settings, LogOut, Menu, X,
  Banknote, Eye, Star, ArrowUp, ArrowDown,
  Search, Filter, Edit, Trash2, Plus, Leaf
} from "lucide-react";

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Package, label: "Products", id: "products" },
  { icon: Users, label: "Clients", id: "clients" },
  { icon: ShoppingCart, label: "Orders", id: "orders" },
  { icon: TrendingUp, label: "Analytics", id: "analytics" },
  { icon: Settings, label: "Settings", id: "settings" },
];

const stats = [
  { label: "Total Revenue", value: "KES 6,230,000", change: "+12.5%", up: true, icon: Banknote, color: "bg-emerald-500" },
  { label: "Total Orders", value: "1,284", change: "+8.2%", up: true, icon: ShoppingCart, color: "bg-blue-500" },
  { label: "Total Clients", value: "573", change: "+3.1%", up: true, icon: Users, color: "bg-purple-500" },
  { label: "Products", value: "124", change: "-2.4%", up: false, icon: Package, color: "bg-amber-500" },
];

const recentOrders = [
  { id: "ORD-001", client: "John Kamau", product: "Hybrid Maize Seeds", amount: "KES 59,327", status: "Delivered", date: "Mar 5, 2026" },
  { id: "ORD-002", client: "Mary Wanjiku", product: "NPK Fertilizer", amount: "KES 41,925", status: "Processing", date: "Mar 5, 2026" },
  { id: "ORD-003", client: "Peter Odhiambo", product: "Mini Hand Tractor", amount: "KES 167,571", status: "Pending", date: "Mar 4, 2026" },
  { id: "ORD-004", client: "Grace Achieng", product: "Irrigation Drip Kit", amount: "KES 11,609", status: "Delivered", date: "Mar 4, 2026" },
  { id: "ORD-005", client: "James Mwangi", product: "Cattle Feed Premium", amount: "KES 35,475", status: "Cancelled", date: "Mar 3, 2026" },
];

const topProducts = [
  { name: "Hybrid Maize Seeds", sales: 342, revenue: "KES 2,026,074", stock: 450 },
  { name: "NPK Fertilizer", sales: 285, revenue: "KES 1,194,798", stock: 120 },
  { name: "Irrigation Drip Kit", sales: 198, revenue: "KES 2,298,780", stock: 65 },
  { name: "Mini Hand Tractor", sales: 45, revenue: "KES 7,540,695", stock: 12 },
  { name: "Cattle Feed Premium", sales: 167, revenue: "KES 1,184,865", stock: 89 },
];

const clients = [
  { name: "John Kamau", email: "john@email.com", orders: 12, spent: "KES 316,050", status: "Active" },
  { name: "Mary Wanjiku", email: "mary@email.com", orders: 8, spent: "KES 243,810", status: "Active" },
  { name: "Peter Odhiambo", email: "peter@email.com", orders: 3, spent: "KES 502,713", status: "Active" },
  { name: "Grace Achieng", email: "grace@email.com", orders: 15, spent: "KES 159,186", status: "Inactive" },
  { name: "James Mwangi", email: "james@email.com", orders: 6, spent: "KES 114,810", status: "Active" },
];

const statusColors = {
  Delivered: "bg-emerald-100 text-emerald-700",
  Processing: "bg-blue-100 text-blue-700",
  Pending: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-700",
  Active: "bg-emerald-100 text-emerald-700",
  Inactive: "bg-gray-100 text-gray-700",
};

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex">

      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 min-h-screen flex flex-col transition-all duration-300 fixed z-40`}>
        <div className="flex items-center gap-3 p-6 border-b border-gray-700">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="text-white font-bold text-sm">Chicago Agro</h1>
              <p className="text-gray-400 text-xs">Admin Panel</p>
            </div>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map(link => (
            <button key={link.id} onClick={() => setActivePage(link.id)}
              className={"w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all " + (
                activePage === link.id ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}>
              <link.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium text-sm">{link.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button onClick={() => window.location.href = '/'}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium text-sm">Exit Dashboard</span>}
          </button>
        </div>
      </aside>

      <div className={"flex-1 " + (sidebarOpen ? 'ml-64' : 'ml-20') + " transition-all duration-300"}>

        <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h2 className="text-xl font-bold text-gray-900 capitalize">{activePage}</h2>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 rounded-lg hover:bg-gray-100 relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">A</div>
          </div>
        </header>

        <main className="p-6">

          {activePage === "dashboard" && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Welcome back, Admin!</h3>
                <p className="text-gray-500">Here is what is happening today.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, idx) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className={"w-12 h-12 " + stat.color + " rounded-xl flex items-center justify-center"}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className={"flex items-center gap-1 text-sm font-medium " + (stat.up ? 'text-emerald-600' : 'text-red-500')}>
                        {stat.up ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                        {stat.change}
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-gray-500 text-sm">{stat.label}</div>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h4 className="text-lg font-bold text-gray-900">Recent Orders</h4>
                  <button onClick={() => setActivePage("orders")} className="text-emerald-600 text-sm font-medium hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Order ID", "Client", "Product", "Amount", "Status", "Date"].map(h => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-emerald-600">{order.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{order.client}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{order.product}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.amount}</td>
                          <td className="px-6 py-4">
                            <span className={"px-3 py-1 rounded-full text-xs font-semibold " + statusColors[order.status]}>{order.status}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <h4 className="text-lg font-bold text-gray-900">Top Performing Products</h4>
                </div>
                <div className="p-6 space-y-4">
                  {topProducts.map((product, idx) => (
                    <div key={product.name} className="flex items-center gap-4">
                      <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{product.name}</span>
                          <span className="text-sm font-bold text-emerald-600">{product.revenue}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${(product.sales / 342) * 100}%` }} />
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">{product.sales} sold</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activePage === "orders" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Orders</h3>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-colors">
                  <Plus className="w-4 h-4" /> New Order
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search orders..."
                      className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 w-72" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Order ID", "Client", "Product", "Amount", "Status", "Date", "Actions"].map(h => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {recentOrders.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-emerald-600">{order.id}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{order.client}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{order.product}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.amount}</td>
                          <td className="px-6 py-4">
                            <span className={"px-3 py-1 rounded-full text-xs font-semibold " + statusColors[order.status]}>{order.status}</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
                              <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activePage === "clients" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Clients</h3>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-colors">
                  <Plus className="w-4 h-4" /> Add Client
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Client", "Email", "Orders", "Total Spent", "Status", "Actions"].map(h => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {clients.map(client => (
                        <tr key={client.name} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">
                                {client.name[0]}
                              </div>
                              <span className="text-sm font-medium text-gray-900">{client.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{client.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{client.orders}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{client.spent}</td>
                          <td className="px-6 py-4">
                            <span className={"px-3 py-1 rounded-full text-xs font-semibold " + statusColors[client.status]}>{client.status}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
                              <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activePage === "products" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Products</h3>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-colors">
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Product", "Category", "Revenue", "Stock", "Actions"].map(h => (
                          <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {topProducts.map(product => (
                        <tr key={product.name} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">Agricultural</td>
                          <td className="px-6 py-4 text-sm font-semibold text-emerald-600">{product.revenue}</td>
                          <td className="px-6 py-4">
                            <span className={"text-sm font-medium " + (product.stock < 20 ? 'text-red-600' : 'text-gray-900')}>
                              {product.stock} units
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
                              <button className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activePage === "analytics" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.map((stat, idx) => (
                  <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={"w-12 h-12 " + stat.color + " rounded-xl flex items-center justify-center"}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                        <div className="text-gray-500 text-sm">{stat.label}</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                      <div className={"" + stat.color + " h-3 rounded-full"} style={{ width: `${60 + idx * 10}%` }} />
                    </div>
                    <div className={"mt-2 text-sm font-medium flex items-center gap-1 " + (stat.up ? 'text-emerald-600' : 'text-red-500')}>
                      {stat.up ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                      {stat.change} from last month
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activePage === "settings" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Settings</h3>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6 max-w-2xl">
                {[
                  { label: "Company Name", value: "Chicago Agro Supplies Limited" },
{ label: "Email", value: "rizikisuppliers@gmail.com" },
{ label: "Phone", value: "+254 757 790 379" },
{ label: "Address", value: "P.O. Box 7, 40101 Ahero, Kisumu County, Kenya" },
                ].map(field => (
                  <div key={field.label}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                    <input type="text" defaultValue={field.value}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                ))}
                <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
