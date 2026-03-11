import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, Users, ShoppingCart,
  TrendingUp, Bell, Settings, LogOut, Menu, X,
  Banknote, ArrowUp, ArrowDown,
  Search, Edit, Trash2, Plus, Leaf, Check, AlertCircle, Info
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

const statusColors = {
  Delivered: "bg-emerald-100 text-emerald-700",
  Processing: "bg-blue-100 text-blue-700",
  Pending: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-700",
  Active: "bg-emerald-100 text-emerald-700",
  Inactive: "bg-gray-100 text-gray-700",
};

const categories = ["Seeds", "Fertilizers", "Pesticides", "Equipment", "Tools", "Animal Feed", "Irrigation"];
const emptyProduct = { name: "", category: "Seeds", price: "", stock: "", description: "", image: "", unit: "unit" };

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [clients, setClients] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, ordersCount: 0, clientsCount: 0, productsCount: 0 });
  const [loading, setLoading] = useState(true);

  // Modals
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  // Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, icon: Check, color: "bg-emerald-100 text-emerald-600", title: "System ready", desc: "Dashboard connected to live database", time: "Just now", read: false },
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Forms
  const [searchQuery, setSearchQuery] = useState("");
  const [newOrder, setNewOrder] = useState({ client: "", product: "", amount: "", status: "Pending" });
  const [newProduct, setNewProduct] = useState(emptyProduct);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", status: "Active" });
  const [productLoading, setProductLoading] = useState(false);
  const [clientLoading, setClientLoading] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchOrders(), fetchProducts(), fetchClients()]);
    setLoading(false);
  };

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (data) {
      setOrders(data);
      // Calculate revenue from orders
      const revenue = data.reduce((sum, o) => {
        const num = parseFloat((o.amount || '').toString().replace(/[^0-9.]/g, '')) || 0;
        return sum + num;
      }, 0);
      setStats(prev => ({ ...prev, ordersCount: data.length, revenue }));
    }
  };

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) {
      setProducts(data);
      setStats(prev => ({ ...prev, productsCount: data.length }));
    }
  };

  const fetchClients = async () => {
    const { data } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
    if (data) {
      setClients(data);
      setStats(prev => ({ ...prev, clientsCount: data.length }));
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredOrders = orders.filter(o =>
    (o.client || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.product || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (o.order_number || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Orders CRUD
  const handleAddOrder = async () => {
    if (!newOrder.client || !newOrder.product || !newOrder.amount) return;
    // Get the highest existing order number to avoid duplicates
    const { data: latest } = await supabase.from('orders').select('order_number').order('created_at', { ascending: false }).limit(1).single();
    const lastNum = latest?.order_number ? parseInt(latest.order_number.replace('ORD-', ''), 10) || 0 : 0;
    const order_number = `ORD-${String(lastNum + 1).padStart(3, "0")}`;
    const amount = newOrder.amount.startsWith("KES") ? newOrder.amount : `KES ${Number(newOrder.amount).toLocaleString()}`;
    const { data } = await supabase.from('orders').insert([{ order_number, client: newOrder.client, product: newOrder.product, amount, status: newOrder.status }]).select().single();
    if (data) {
      setOrders([data, ...orders]);
      setStats(prev => ({ ...prev, ordersCount: prev.ordersCount + 1 }));
      addNotification(ShoppingCart, "bg-blue-100 text-blue-600", "New order added", `${order_number} from ${newOrder.client}`);
    }
    setNewOrder({ client: "", product: "", amount: "", status: "Pending" });
    setShowNewOrderModal(false);
  };

  const handleDeleteOrder = async (id) => {
    await supabase.from('orders').delete().eq('id', id);
    setOrders(orders.filter(o => o.id !== id));
    setStats(prev => ({ ...prev, ordersCount: prev.ordersCount - 1 }));
  };

  const handleSaveEdit = async () => {
    await supabase.from('orders').update({
      client: editingOrder.client, product: editingOrder.product,
      amount: editingOrder.amount, status: editingOrder.status,
    }).eq('id', editingOrder.id);
    setOrders(orders.map(o => o.id === editingOrder.id ? editingOrder : o));
    setShowEditModal(false);
  };

  // Products CRUD
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;
    setProductLoading(true);
    const { data } = await supabase.from('products').insert([{
      name: newProduct.name, category: newProduct.category,
      price: Number(newProduct.price), stock: Number(newProduct.stock),
      description: newProduct.description, image: newProduct.image, unit: newProduct.unit,
    }]).select().single();
    if (data) {
      setProducts([data, ...products]);
      setStats(prev => ({ ...prev, productsCount: prev.productsCount + 1 }));
      addNotification(Package, "bg-emerald-100 text-emerald-600", "Product added", `${newProduct.name} added to catalogue`);
    }
    setNewProduct(emptyProduct);
    setProductLoading(false);
    setShowProductModal(false);
  };

  const handleDeleteProduct = async (id) => {
    await supabase.from('products').delete().eq('id', id);
    setProducts(products.filter(p => p.id !== id));
    setStats(prev => ({ ...prev, productsCount: prev.productsCount - 1 }));
  };

  const handleSaveEditProduct = async () => {
    await supabase.from('products').update({
      name: editingProduct.name, category: editingProduct.category,
      price: Number(editingProduct.price), stock: Number(editingProduct.stock),
      description: editingProduct.description, image: editingProduct.image, unit: editingProduct.unit,
    }).eq('id', editingProduct.id);
    setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...editingProduct } : p));
    setShowEditProductModal(false);
  };

  // Clients CRUD
  const handleAddClient = async () => {
    if (!newClient.name || !newClient.email) return;
    setClientLoading(true);
    const { data } = await supabase.from('clients').insert([{
      name: newClient.name, email: newClient.email,
      phone: newClient.phone, status: newClient.status,
      total_orders: 0, total_spent: 'KES 0',
    }]).select().single();
    if (data) {
      setClients([data, ...clients]);
      setStats(prev => ({ ...prev, clientsCount: prev.clientsCount + 1 }));
      addNotification(Users, "bg-purple-100 text-purple-600", "New client added", `${newClient.name} joined`);
    }
    setNewClient({ name: "", email: "", phone: "", status: "Active" });
    setClientLoading(false);
    setShowClientModal(false);
  };

  const handleDeleteClient = async (id) => {
    await supabase.from('clients').delete().eq('id', id);
    setClients(clients.filter(c => c.id !== id));
    setStats(prev => ({ ...prev, clientsCount: prev.clientsCount - 1 }));
  };

  const addNotification = (icon, color, title, desc) => {
    setNotifications(prev => [{ id: Date.now(), icon, color, title, desc, time: "Just now", read: false }, ...prev]);
  };

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-KE", { month: "short", day: "numeric", year: "numeric" }) : '';

  const statsCards = [
    { label: "Total Revenue", value: `KES ${stats.revenue.toLocaleString()}`, icon: Banknote, color: "bg-emerald-500", up: true, change: "Live" },
    { label: "Total Orders", value: stats.ordersCount.toLocaleString(), icon: ShoppingCart, color: "bg-blue-500", up: true, change: "Live" },
    { label: "Total Clients", value: stats.clientsCount.toLocaleString(), icon: Users, color: "bg-purple-500", up: true, change: "Live" },
    { label: "Products", value: stats.productsCount.toLocaleString(), icon: Package, color: "bg-amber-500", up: true, change: "Live" },
  ];

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

      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>

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
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold">{unreadCount}</span>}
              </button>
              <AnimatePresence>
                {showNotifications && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-4 border-b flex items-center justify-between">
                      <h4 className="font-bold text-gray-900">Notifications</h4>
                      <button onClick={markAllRead} className="text-xs text-emerald-600 hover:underline">Mark all read</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map(n => (
                        <div key={n.id} className={`flex items-start gap-3 p-4 hover:bg-gray-50 ${!n.read ? 'bg-blue-50/40' : ''}`}>
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${n.color}`}>
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

          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              {/* DASHBOARD */}
              {activePage === "dashboard" && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Welcome back, Admin! 👋</h3>
                    <p className="text-gray-500">Here is what is happening today at Chicago Agro Supplies.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsCards.map((stat, idx) => (
                      <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                            <stat.icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                            <ArrowUp className="w-4 h-4" />{stat.change}
                          </span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                        <div className="text-gray-500 text-sm">{stat.label}</div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8">
                    <div className="p-6 border-b flex items-center justify-between">
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
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 text-sm font-medium text-emerald-600">{order.order_number}</td>
                              <td className="px-6 py-4 text-sm text-gray-900">{order.client}</td>
                              <td className="px-6 py-4 text-sm text-gray-600">{order.product}</td>
                              <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.amount}</td>
                              <td className="px-6 py-4"><span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[order.status]}`}>{order.status}</span></td>
                              <td className="px-6 py-4 text-sm text-gray-500">{formatDate(order.created_at)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {orders.length === 0 && <div className="text-center py-8 text-gray-400">No orders yet</div>}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="p-6 border-b flex items-center justify-between">
                      <h4 className="text-lg font-bold text-gray-900">Products Overview</h4>
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
                              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${Math.min((product.stock / 600) * 100, 100)}%` }} />
                            </div>
                          </div>
                          <span className="text-xs text-gray-500 flex-shrink-0">{product.stock} units</span>
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
                              <td className="px-6 py-4 text-sm font-semibold text-gray-900">{order.amount}</td>
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
                </div>
              )}

              {/* CLIENTS */}
              {activePage === "clients" && (
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
                            <tr key={product.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  {product.image && <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover" onError={e => e.target.style.display = 'none'} />}
                                  <span className="text-sm font-medium text-gray-900">{product.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4"><span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-1 rounded-full">{product.category}</span></td>
                              <td className="px-6 py-4 text-sm font-semibold text-emerald-600">KES {Number(product.price).toLocaleString()}</td>
                              <td className="px-6 py-4"><span className={`text-sm font-medium ${product.stock < 20 ? 'text-red-600' : 'text-gray-900'}`}>{product.stock} units {product.stock < 20 && "⚠️"}</span></td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                  <button onClick={() => { setEditingProduct({ ...product }); setShowEditProductModal(true); }} className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600"><Edit className="w-4 h-4" /></button>
                                  <button onClick={() => handleDeleteProduct(product.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600"><Trash2 className="w-4 h-4" /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {products.length === 0 && <div className="text-center py-12 text-gray-400"><Package className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No products yet</p></div>}
                    </div>
                  </div>
                </div>
              )}

              {/* ANALYTICS */}
              {activePage === "analytics" && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    {statsCards.map(stat => (
                      <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <div className="flex items-center gap-4 mb-4">
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
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">Orders by Status</h4>
                    {["Delivered", "Processing", "Pending", "Cancelled"].map(status => {
                      const count = orders.filter(o => o.status === status).length;
                      const pct = orders.length ? Math.round((count / orders.length) * 100) : 0;
                      return (
                        <div key={status} className="mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">{status}</span>
                            <span className="text-sm text-gray-500">{count} orders ({pct}%)</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-3">
                            <div className={`h-3 rounded-full ${status === 'Delivered' ? 'bg-emerald-500' : status === 'Processing' ? 'bg-blue-500' : status === 'Pending' ? 'bg-amber-500' : 'bg-red-400'}`}
                              style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
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
            </>
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
                    {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
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
                {[["Client Name", "client", "text"], ["Amount", "amount", "text"]].map(([label, key, type]) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                    <input type={type} value={editingOrder[key]} onChange={e => setEditingOrder({ ...editingOrder, [key]: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                  <select value={editingOrder.product} onChange={e => setEditingOrder({ ...editingOrder, product: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  </select>
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
                      {categories.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <input type="text" placeholder="e.g. 50kg bag" value={newProduct.unit}
                      onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES) *</label>
                    <input type="number" placeholder="e.g. 2500" value={newProduct.price}
                      onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock (units) *</label>
                    <input type="number" placeholder="e.g. 100" value={newProduct.stock}
                      onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
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
                  {newProduct.image && <img src={newProduct.image} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-xl" onError={e => e.target.style.display = 'none'} />}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowProductModal(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50">Cancel</button>
                <button onClick={handleAddProduct} disabled={productLoading}
                  className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {productLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus className="w-4 h-4" />Add Product</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT PRODUCT MODAL */}
      <AnimatePresence>
        {showEditProductModal && editingProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Edit Product</h3>
                <button onClick={() => setShowEditProductModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input type="text" value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      {categories.map(c => <option key={c} value={c.toLowerCase()}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <input type="text" value={editingProduct.unit || ''} onChange={e => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (KES)</label>
                    <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                    <input type="number" value={editingProduct.stock} onChange={e => setEditingProduct({ ...editingProduct, stock: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea value={editingProduct.description || ''} onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })} rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input type="text" value={editingProduct.image || ''} onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  {editingProduct.image && <img src={editingProduct.image} alt="Preview" className="mt-2 w-full h-32 object-cover rounded-xl" onError={e => e.target.style.display = 'none'} />}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowEditProductModal(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50">Cancel</button>
                <button onClick={handleSaveEditProduct} className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-emerald-700">Save Changes</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD CLIENT MODAL */}
      <AnimatePresence>
        {showClientModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Add New Client</h3>
                <button onClick={() => setShowClientModal(false)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input type="text" placeholder="e.g. John Kamau" value={newClient.name}
                    onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input type="email" placeholder="e.g. john@gmail.com" value={newClient.email}
                    onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input type="text" placeholder="+254 7XX XXX XXX" value={newClient.phone}
                    onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={newClient.status} onChange={e => setNewClient({ ...newClient, status: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option>Active</option><option>Inactive</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowClientModal(false)} className="flex-1 px-4 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50">Cancel</button>
                <button onClick={handleAddClient} disabled={clientLoading}
                  className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2">
                  {clientLoading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Plus className="w-4 h-4" />Add Client</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
