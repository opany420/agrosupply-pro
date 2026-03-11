import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, Users, ShoppingCart,
  TrendingUp, Bell, Settings, LogOut, Menu, X,
  Banknote, ArrowUp, ArrowDown,
  Search, Edit, Trash2, Plus, Leaf, Check, AlertCircle, Info, Star
} from "lucide-react";
import { supabase } from '../supabase';

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Package, label: "Products", id: "products" },
  { icon: Users, label: "Clients", id: "clients" },
  { icon: ShoppingCart, label: "Orders", id: "orders" },
  { icon: TrendingUp, label: "Analytics", id: "analytics" },
  { icon: Settings, label: "Settings", id: "settings" },
];

const statsData = [
  { label: "Total Revenue", value: "KES 6,230,000", change: "+12.5%", up: true, icon: Banknote, color: "bg-emerald-500" },
  { label: "Total Orders", value: "1,284", change: "+8.2%", up: true, icon: ShoppingCart, color: "bg-blue-500" },
  { label: "Total Clients", value: "573", change: "+3.1%", up: true, icon: Users, color: "bg-purple-500" },
  { label: "Products", value: "124", change: "-2.4%", up: false, icon: Package, color: "bg-amber-500" },
];

const initialOrders = [
  { id: "1", order_number: "ORD-001", client: "John Kamau", product: "Hybrid Maize Seeds", amount: "KES 59,327", status: "Delivered", created_at: "2026-03-05" },
  { id: "2", order_number: "ORD-002", client: "Mary Wanjiku", product: "NPK Fertilizer", amount: "KES 41,925", status: "Processing", created_at: "2026-03-05" },
  { id: "3", order_number: "ORD-003", client: "Peter Odhiambo", product: "Mini Hand Tractor", amount: "KES 167,571", status: "Pending", created_at: "2026-03-04" },
  { id: "4", order_number: "ORD-004", client: "Grace Achieng", product: "Irrigation Drip Kit", amount: "KES 11,609", status: "Delivered", created_at: "2026-03-04" },
  { id: "5", order_number: "ORD-005", client: "James Mwangi", product: "Cattle Feed Premium", amount: "KES 35,475", status: "Cancelled", created_at: "2026-03-03" },
];

const initialClients = [
  { name: "John Kamau", email: "john@email.com", orders: 12, spent: "KES 316,050", status: "Active" },
  { name: "Mary Wanjiku", email: "mary@email.com", orders: 8, spent: "KES 243,810", status: "Active" },
  { name: "Peter Odhiambo", email: "peter@email.com", orders: 3, spent: "KES 502,713", status: "Active" },
  { name: "Grace Achieng", email: "grace@email.com", orders: 15, spent: "KES 159,186", status: "Inactive" },
  { name: "James Mwangi", email: "james@email.com", orders: 6, spent: "KES 114,810", status: "Active" },
];

const initialNotifications = [
  { id: 1, icon: ShoppingCart, color: "bg-blue-100 text-blue-600", title: "New order received", desc: "ORD-006 from Esther Auma — KES 23,400", time: "2 min ago", read: false },
  { id: 2, icon: AlertCircle, color: "bg-amber-100 text-amber-600", title: "Low stock alert", desc: "Mini Hand Tractor — only 12 units left", time: "1 hr ago", read: false },
  { id: 3, icon: Check, color: "bg-emerald-100 text-emerald-600", title: "Order delivered", desc: "ORD-004 delivered to Grace Achieng", time: "3 hrs ago", read: false },
  { id: 4, icon: Info, color: "bg-purple-100 text-purple-600", title: "Payment confirmed", desc: "Equity Paybill — KES 41,925 received", time: "5 hrs ago", read: true },
];

const initialProducts = [
  { id: "1", name: "Hybrid Maize Seeds", category: "Seeds", price: 1200, stock: 450, sales: 342, revenue: "KES 2,026,074" },
  { id: "2", name: "NPK Fertilizer", category: "Fertilizers", price: 2500, stock: 120, sales: 285, revenue: "KES 1,194,798" },
  { id: "3", name: "Irrigation Drip Kit", category: "Irrigation", price: 8500, stock: 65, sales: 198, revenue: "KES 2,298,780" },
  { id: "4", name: "Mini Hand Tractor", category: "Equipment", price: 45000, stock: 12, sales: 45, revenue: "KES 7,540,695" },
  { id: "5", name: "Cattle Feed Premium", category: "Animal Feed", price: 1800, stock: 89, sales: 167, revenue: "KES 1,184,865" },
];

const statusColors = {
  Delivered: "bg-emerald-100 text-emerald-700",
  Processing: "bg-blue-100 text-blue-700",
  Pending: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-700",
  Active: "bg-emerald-100 text-emerald-700",
  Inactive: "bg-gray-100 text-gray-700",
};

const productOptions = [
  "Hybrid Maize Seeds", "NPK Fertilizer", "Irrigation Drip Kit",
  "Mini Hand Tractor", "Cattle Feed Premium", "Drip Irrigation Kit",
  "Roundup Herbicide", "DAP Fertilizer", "Layers Mash", "Duduthrin"
];

const categories = ["Seeds", "Fertilizers", "Pesticides", "Equipment", "Tools", "Animal Feed", "Irrigation"];

const emptyProduct = { name: "", category: "Seeds", price: "", stock: "", description: "", image: "" };

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [orders, setOrders] = useState(initialOrders);
  const [products, setProducts] = useState(initialProducts);
  const [clients, setClients] = useState(initialClients);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newOrder, setNewOrder] = useState({ client: "", product: "", amount: "", status: "Pending" });
  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [productLoading, setProductLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) setOrders(data);
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) setProducts(data);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredOrders = orders.filter(o =>
    o.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.product.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.order_number && o.order_number.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddOrder = async () => {
    if (!newOrder.client || !newOrder.product || !newOrder.amount) return;
    const order_number = `ORD-${String(orders.length + 1).padStart(3, "0")}`;
    const amount = newOrder.amount.startsWith("KES") ? newOrder.amount : `KES ${Number(newOrder.amount).toLocaleString()}`;
    const { data } = await supabase.from('orders').insert([{
      order_number, client: newOrder.client, product: newOrder.product, amount, status: newOrder.status,
    }]).select().single();
    if (data) setOrders([data, ...orders]);
    setNotifications([{
      id: Date.now(), icon: ShoppingCart, color: "bg-blue-100 text-blue-600",
      title: "New order added", desc: `${order_number} from ${newOrder.client}`, time: "Just now", read: false
    }, ...notifications]);
    setNewOrder({ client: "", product: "", amount: "", status: "Pending" });
    setShowNewOrderModal(false);
  };

  const handleDeleteOrder = async (id) => {
    await supabase.from('orders').delete().eq('id', id);
    setOrders(orders.filter(o => o.id !== id));
  };

  const handleEditOrder = (order) => {
    setEditingOrder({ ...order });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    await supabase.from('orders').update({
      client: editingOrder.client, product: editingOrder.product,
      amount: editingOrder.amount, status: editingOrder.status,
    }).eq('id', editingOrder.id);
    setOrders(orders.map(o => o.id === editingOrder.id ? editingOrder : o));
    setShowEditModal(false);
    setEditingOrder(null);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;
    setProductLoading(true);
    const { data, error } = await supabase.from('products').insert([{
      name: newProduct.name,
      category: newProduct.category,
      price: Number(newProduct.price),
      stock: Number(newProduct.stock),
      description: newProduct.description,
      image: newProduct.image,
    }]).select().single();
    if (data) {
      setProducts([data, ...products]);
      setNotifications([{
        id: Date.now(), icon: Package, color: "bg-emerald-100 text-emerald-600",
        title: "Product added", desc: `${newProduct.name} added to catalogue`, time: "Just now", read: false
      }, ...notifications]);
    }
    setNewProduct(emptyProduct);
    setProductLoading(false);
    setShowProductModal(false);
  };

  const handleDeleteProduct = async (id) => {
    await supabase.from('products').delete().eq('id', id);
    setProducts(products.filter(p => p.id !== id));
  };

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 min-h-screen flex flex-col transition-all duration-300 fixed z-40`}>
        <div className="flex items-center gap-3 p-6 border-b border-gray-700">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          {sidebarOpen && <div><h1 className="text-white font-bold text-sm">Chicago Agro</h1><p className="text-gray-400 text-xs">Admin Panel</p></div>}
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
          <button onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login'; }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="font-medium text-sm">Exit Dashboard</span>}
          </button>
        </div>
      </aside>

      <div className={"flex-1 " + (sidebarOpen ? 'ml-64' : 'ml-20') + " transition-all duration-300"}>

        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h2 className="text-xl font-bold text-gray-900 capitalize">{activePage}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 rounded-lg hover:bg-gray-100 relative transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">{unreadCount}</span>
                )}
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <h4 className="font-bold text-gray-900">Notifications</h4>
                      <button onClick={markAllRead} className="text-xs text-emerald-600 hover:underline font-medium">Mark all read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={"flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors " + (!n.read ? 'bg-blue-50/40' : '')}>
                          <div className={"w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 " + n.color}>
                            <n.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-900">{n.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5 truncate">{n.desc}</p>
                            <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                          </div>
                          {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm">A</div>
          </div>
        </header>

        {showNotifications && <div className="fixed inset-0 z-20" onClick={() => setShowNotifications(false)} />}

        <main className="p-6">

          {/* DASHBOARD */}
          {activePage === "dashboard" && (
            <div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Welcome back, Admin! 👋</h3>
                <p className="text-gray-500">Here is what is happening today at Chicago Agro Supplies.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {statsData.map((stat, idx) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className={"w-12 h-12 " + stat.color + " rounded-xl flex items-center justify-center"}>
                        <stat.icon className="w-6 h-6 text-white" />
                      </div>
                      <span className={"flex items-center gap-1 text-sm font-medium " + (stat.up ? 'text-emerald-600' : 'text-red-500')}>
                        {stat.up ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}{stat.change}
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
                      <tr>{["Order ID", "Client", "Product", "Amount", "Status", "Date"].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-emerald-600">{order.order_number}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{order.client}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{order.product}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.amount}</td>
                          <td className="px-6 py-4"><span className={"px-3 py-1 rounded-full text-xs font-semibold " + statusColors[order.status]}>{order.status}</span></td>
                          <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h4 className="text-lg font-bold text-gray-900">Top Performing Products</h4>
                  <button onClick={() => setActivePage("products")} className="text-emerald-600 text-sm font-medium hover:underline">View All</button>
                </div>
                <div className="p-6 space-y-4">
                  {products.slice(0, 5).map((product, idx) => (
                    <div key={product.id} className="flex items-center gap-4">
                      <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{idx + 1}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-900">{product.name}</span>
                          <span className="text-sm font-bold text-emerald-600">KES {Number(product.price).toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min((product.stock / 500) * 100, 100)}%` }} />
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">{product.stock} in stock</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ORDERS */}
          {activePage === "orders" && (
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
                <div className="p-6 border-b border-gray-100">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search by order ID, client or product..."
                      value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
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
                        <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 text-sm font-medium text-emerald-600">{order.order_number}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{order.client}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{order.product}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.amount}</td>
                          <td className="px-6 py-4"><span className={"px-3 py-1 rounded-full text-xs font-semibold " + statusColors[order.status]}>{order.status}</span></td>
                          <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.created_at)}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleEditOrder(order)} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteOrder(order.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
            </div>
          )}

          {/* CLIENTS */}
          {activePage === "clients" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Clients</h3>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>{["Client", "Email", "Orders", "Total Spent", "Status", "Actions"].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {clients.map(client => (
                        <tr key={client.name} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-bold text-sm">{client.name[0]}</div>
                              <span className="text-sm font-medium text-gray-900">{client.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{client.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{client.orders}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{client.spent}</td>
                          <td className="px-6 py-4"><span className={"px-3 py-1 rounded-full text-xs font-semibold " + statusColors[client.status]}>{client.status}</span></td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => setClients(clients.filter(c => c.name !== client.name))} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
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

          {/* PRODUCTS */}
          {activePage === "products" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Products</h3>
                  <p className="text-gray-500 text-sm">{products.length} products in catalogue</p>
                </div>
                <button onClick={() => setShowProductModal(true)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-emerald-700 transition-colors">
                  <Plus className="w-4 h-4" /> Add Product
                </button>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>{["Product", "Category", "Price", "Stock", "Actions"].map(h => (
                        <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                      ))}</tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map(product => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {product.image && (
                                <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover"
                                  onError={e => e.target.style.display = 'none'} />
                              )}
                              <span className="text-sm font-medium text-gray-900">{product.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">{product.category}</span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-emerald-600">KES {Number(product.price).toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={"text-sm font-medium " + (product.stock < 20 ? 'text-red-600' : 'text-gray-900')}>
                              {product.stock} units {product.stock < 20 && "⚠️"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600 transition-colors"><Edit className="w-4 h-4" /></button>
                              <button onClick={() => handleDeleteProduct(product.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {products.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                      <p>No products yet. Add your first product!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {activePage === "analytics" && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {statsData.map((stat, idx) => (
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
                      <div className={"h-3 rounded-full " + stat.color} style={{ width: `${60 + idx * 10}%` }} />
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

          {/* SETTINGS */}
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
                <button className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors">Save Changes</button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* NEW ORDER MODAL */}
      <AnimatePresence>
        {showNewOrderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">New Order</h3>
                <button onClick={() => setShowNewOrderModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                  <input type="text" placeholder="e.g. John Kamau" value={newOrder.client}
                    onChange={e => setNewOrder({ ...newOrder, client: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
                  <select value={newOrder.product} onChange={e => setNewOrder({ ...newOrder, product: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="">Select product...</option>
                    {productOptions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KES) *</label>
                  <input type="number" placeholder="e.g. 15000" value={newOrder.amount}
                    onChange={e => setNewOrder({ ...newOrder, amount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={newOrder.status} onChange={e => setNewOrder({ ...newOrder, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Pending</option><option>Processing</option><option>Delivered</option><option>Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowNewOrderModal(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50">Cancel</button>
                <button onClick={handleAddOrder} className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-emerald-700">Add Order</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT ORDER MODAL */}
      <AnimatePresence>
        {showEditModal && editingOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit Order {editingOrder.order_number}</h3>
                <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                  <input type="text" value={editingOrder.client} onChange={e => setEditingOrder({ ...editingOrder, client: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <select value={editingOrder.product} onChange={e => setEditingOrder({ ...editingOrder, product: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {productOptions.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input type="text" value={editingOrder.amount} onChange={e => setEditingOrder({ ...editingOrder, amount: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={editingOrder.status} onChange={e => setEditingOrder({ ...editingOrder, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Pending</option><option>Processing</option><option>Delivered</option><option>Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowEditModal(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50">Cancel</button>
                <button onClick={handleSaveEdit} className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-emerald-700">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD PRODUCT MODAL */}
      <AnimatePresence>
        {showProductModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Product</h3>
                <button onClick={() => setShowProductModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                  <input type="text" placeholder="e.g. Mavuno Fertilizer" value={newProduct.name}
                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES) *</label>
                    <input type="number" placeholder="e.g. 2500" value={newProduct.price}
                      onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stock (units) *</label>
                  <input type="number" placeholder="e.g. 100" value={newProduct.stock}
                    onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea placeholder="Brief product description..." value={newProduct.description}
                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input type="text" placeholder="https://..." value={newProduct.image}
                    onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  {newProduct.image && (
                    <img src={newProduct.image} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-xl"
                      onError={e => e.target.style.display = 'none'} />
                  )}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowProductModal(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50">Cancel</button>
                <button onClick={handleAddProduct} disabled={productLoading}
                  className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {productLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus className="w-4 h-4" /> Add Product</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
