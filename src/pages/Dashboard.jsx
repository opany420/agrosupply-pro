import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Package, Users, ShoppingCart,
  TrendingUp, Bell, Settings, LogOut, Menu, X,
  Banknote, ArrowUp, Star,
  Plus, Leaf, Check, Upload
} from "lucide-react";
import { supabase } from '../supabase';
import { formatCurrency, formatDate } from '../utils';
import { COMPANY } from '../constants';
import { useAuth } from '../AuthContext';
import OrdersTab from './dashboard/OrdersTab';
import ProductsTab from './dashboard/ProductsTab';
import ClientsTab from './dashboard/ClientsTab';
import AnalyticsTab from './dashboard/AnalyticsTab';
import SettingsTab from './dashboard/SettingsTab';
import ReviewsTab from './dashboard/ReviewsTab';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);
  return matches;
}

const sidebarLinks = [
  { icon: LayoutDashboard, label: "Dashboard", id: "dashboard" },
  { icon: Package, label: "Products", id: "products" },
  { icon: Users, label: "Clients", id: "clients" },
  { icon: ShoppingCart, label: "Orders", id: "orders" },
  { icon: TrendingUp, label: "Analytics", id: "analytics" },
  { icon: Star, label: "Reviews", id: "reviews" },
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

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

async function uploadProductImage(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Only JPEG, PNG, WebP, and GIF images are allowed');
  }
  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error('Image must be smaller than 5 MB');
  }
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from('product-images').upload(fileName, file);
  if (error) throw error;
  const { data } = supabase.storage.from('product-images').getPublicUrl(fileName);
  return data.publicUrl;
}

export default function Dashboard() {
  const { signOut } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

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

  // Modal refs for focus trapping
  const newOrderModalRef = useRef(null);
  const editOrderModalRef = useRef(null);
  const productModalRef = useRef(null);
  const editProductModalRef = useRef(null);
  const clientModalRef = useRef(null);
  const previousModalFocusRef = useRef(null);

  // Focus trap + Escape-to-close for all modals
  useEffect(() => {
    let modalRef = null;
    let closeFn = null;

    if (showNewOrderModal) { modalRef = newOrderModalRef; closeFn = () => setShowNewOrderModal(false); }
    else if (showEditModal) { modalRef = editOrderModalRef; closeFn = () => setShowEditModal(false); }
    else if (showProductModal) { modalRef = productModalRef; closeFn = () => setShowProductModal(false); }
    else if (showEditProductModal) { modalRef = editProductModalRef; closeFn = () => setShowEditProductModal(false); }
    else if (showClientModal) { modalRef = clientModalRef; closeFn = () => setShowClientModal(false); }

    if (!modalRef || !closeFn) return;
    previousModalFocusRef.current = document.activeElement;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { closeFn(); return; }
      if (e.key !== 'Tab') return;
      const modal = modalRef.current;
      if (!modal) return;
      const focusable = modal.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(() => {
      const modal = modalRef.current;
      if (modal) {
        const first = modal.querySelector('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (first) first.focus();
      }
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousModalFocusRef.current?.focus) previousModalFocusRef.current.focus();
    };
  }, [showNewOrderModal, showEditModal, showProductModal, showEditProductModal, showClientModal]);

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
  const [imageUploading, setImageUploading] = useState(false);
  const [clientLoading, setClientLoading] = useState(false);

  // Pagination
  const PAGE_SIZE = 10;
  const [ordersPage, setOrdersPage] = useState(1);
  const [productsPage, setProductsPage] = useState(1);
  const [clientsPage, setClientsPage] = useState(1);

  // Reviews
  const [pendingReviews, setPendingReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  useEffect(() => {
    if (activePage === 'reviews') fetchPendingReviews();
  }, [activePage]);

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchOrders(), fetchProducts(), fetchClients()]);
    setLoading(false);
  };

  const fetchPendingReviews = async () => {
    setReviewsLoading(true);
    try {
      const { data, error } = await supabase.from('reviews').select('*').eq('approved', false).order('created_at', { ascending: true });
      if (error) throw error;
      if (data) setPendingReviews(data);
    } catch (err) {
      alert('Failed to load reviews: ' + (err.message || 'Unknown error'));
    }
    setReviewsLoading(false);
  };

  const handleApproveReview = async (id) => {
    try {
      const { error } = await supabase.from('reviews').update({ approved: true }).eq('id', id);
      if (error) throw error;
      setPendingReviews(pendingReviews.filter(r => r.id !== id));
    } catch (err) {
      alert('Failed to approve review: ' + (err.message || 'Unknown error'));
    }
  };

  const handleRejectReview = async (id) => {
    if (!window.confirm('Are you sure you want to reject and delete this review?')) return;
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (error) throw error;
      setPendingReviews(pendingReviews.filter(r => r.id !== id));
    } catch (err) {
      alert('Failed to delete review: ' + (err.message || 'Unknown error'));
    }
  };

  const fetchOrders = async (page = ordersPage) => {
    try {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error, count } = await supabase.from('orders').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to);
      if (error) throw error;
      if (data) {
        setOrders(data);
        setStats(prev => ({ ...prev, ordersCount: count ?? data.length }));
      }
      // Fetch total revenue separately
      const { data: allAmounts, error: amtErr } = await supabase.from('orders').select('amount');
      if (!amtErr && allAmounts) {
        const revenue = allAmounts.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
        setStats(prev => ({ ...prev, revenue }));
      }
    } catch (err) {
      alert('Failed to load orders: ' + (err.message || 'Unknown error'));
    }
  };

  const fetchProducts = async (page = productsPage) => {
    try {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error, count } = await supabase.from('products').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to);
      if (error) throw error;
      if (data) {
        setProducts(data);
        setStats(prev => ({ ...prev, productsCount: count ?? data.length }));
      }
    } catch (err) {
      alert('Failed to load products: ' + (err.message || 'Unknown error'));
    }
  };

  const fetchClients = async (page = clientsPage) => {
    try {
      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const { data, error, count } = await supabase.from('clients').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to);
      if (error) throw error;
      if (data) {
        setClients(data);
        setStats(prev => ({ ...prev, clientsCount: count ?? data.length }));
      }
    } catch (err) {
      alert('Failed to load clients: ' + (err.message || 'Unknown error'));
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
    try {
      const order_number = `ORD-${Date.now()}`;
      const amount = Number(newOrder.amount) || 0;
      const { data, error } = await supabase.from('orders').insert([{ order_number, client: newOrder.client, product: newOrder.product, amount, status: newOrder.status }]).select().single();
      if (error) throw error;
      if (data) {
        setOrders([data, ...orders]);
        setStats(prev => ({ ...prev, ordersCount: prev.ordersCount + 1 }));
        addNotification(ShoppingCart, "bg-blue-100 text-blue-600", "New order added", `${order_number} from ${newOrder.client}`);
      }
      setNewOrder({ client: "", product: "", amount: "", status: "Pending" });
      setShowNewOrderModal(false);
    } catch (err) {
      alert('Failed to add order: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      setOrders(orders.filter(o => o.id !== id));
      setStats(prev => ({ ...prev, ordersCount: prev.ordersCount - 1 }));
    } catch (err) {
      alert('Failed to delete order: ' + (err.message || 'Unknown error'));
    }
  };

  const handleSaveEdit = async () => {
    try {
      const { error } = await supabase.from('orders').update({
        client: editingOrder.client, product: editingOrder.product,
        amount: editingOrder.amount, status: editingOrder.status,
      }).eq('id', editingOrder.id);
      if (error) throw error;
      setOrders(orders.map(o => o.id === editingOrder.id ? editingOrder : o));
      setShowEditModal(false);
    } catch (err) {
      alert('Failed to update order: ' + (err.message || 'Unknown error'));
    }
  };

  // Products CRUD
  const handleImageUpload = async (file, setter, current) => {
    setImageUploading(true);
    try {
      const url = await uploadProductImage(file);
      setter({ ...current, image: url });
    } catch (err) {
      alert(err.message || 'Image upload failed');
    } finally {
      setImageUploading(false);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;
    setProductLoading(true);
    try {
      const { data, error } = await supabase.from('products').insert([{
        name: newProduct.name, category: newProduct.category,
        price: Number(newProduct.price), stock: Number(newProduct.stock),
        description: newProduct.description, image: newProduct.image, unit: newProduct.unit,
      }]).select().single();
      if (error) throw error;
      if (data) {
        setProducts([data, ...products]);
        setStats(prev => ({ ...prev, productsCount: prev.productsCount + 1 }));
        addNotification(Package, "bg-emerald-100 text-emerald-600", "Product added", `${newProduct.name} added to catalogue`);
      }
      setNewProduct(emptyProduct);
      setShowProductModal(false);
    } catch (err) {
      alert('Failed to add product: ' + (err.message || 'Unknown error'));
    } finally {
      setProductLoading(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
      setStats(prev => ({ ...prev, productsCount: prev.productsCount - 1 }));
    } catch (err) {
      alert('Failed to delete product: ' + (err.message || 'Unknown error'));
    }
  };

  const handleSaveEditProduct = async () => {
    try {
      const { error } = await supabase.from('products').update({
        name: editingProduct.name, category: editingProduct.category,
        price: Number(editingProduct.price), stock: Number(editingProduct.stock),
        description: editingProduct.description, image: editingProduct.image, unit: editingProduct.unit,
      }).eq('id', editingProduct.id);
      if (error) throw error;
      setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...editingProduct } : p));
      setShowEditProductModal(false);
    } catch (err) {
      alert('Failed to update product: ' + (err.message || 'Unknown error'));
    }
  };

  // Clients CRUD
  const handleAddClient = async () => {
    if (!newClient.name || !newClient.email) return;
    setClientLoading(true);
    try {
      const { data, error } = await supabase.from('clients').insert([{
        name: newClient.name, email: newClient.email,
        phone: newClient.phone, status: newClient.status,
        total_orders: 0, total_spent: 'KES 0',
      }]).select().single();
      if (error) throw error;
      if (data) {
        setClients([data, ...clients]);
        setStats(prev => ({ ...prev, clientsCount: prev.clientsCount + 1 }));
        addNotification(Users, "bg-purple-100 text-purple-600", "New client added", `${newClient.name} joined`);
      }
      setNewClient({ name: "", email: "", phone: "", status: "Active" });
      setShowClientModal(false);
    } catch (err) {
      alert('Failed to add client: ' + (err.message || 'Unknown error'));
    } finally {
      setClientLoading(false);
    }
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm('Are you sure you want to delete this client?')) return;
    try {
      const { error } = await supabase.from('clients').delete().eq('id', id);
      if (error) throw error;
      setClients(clients.filter(c => c.id !== id));
      setStats(prev => ({ ...prev, clientsCount: prev.clientsCount - 1 }));
    } catch (err) {
      alert('Failed to delete client: ' + (err.message || 'Unknown error'));
    }
  };

  const addNotification = (icon, color, title, desc) => {
    setNotifications(prev => [{ id: Date.now(), icon, color, title, desc, time: "Just now", read: false }, ...prev]);
  };

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, read: true })));

  const statsCards = [
    { label: "Total Revenue", value: formatCurrency(stats.revenue), icon: Banknote, color: "bg-emerald-500", up: true, change: "Live" },
    { label: "Total Orders", value: stats.ordersCount.toLocaleString(), icon: ShoppingCart, color: "bg-blue-500", up: true, change: "Live" },
    { label: "Total Clients", value: stats.clientsCount.toLocaleString(), icon: Users, color: "bg-purple-500", up: true, change: "Live" },
    { label: "Products", value: stats.productsCount.toLocaleString(), icon: Package, color: "bg-amber-500", up: true, change: "Live" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Mobile backdrop */}
      {!isDesktop && sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`w-64 bg-gray-900 min-h-screen flex flex-col transition-transform duration-300 fixed z-50 ${
        isDesktop ? 'translate-x-0' : (sidebarOpen ? 'translate-x-0' : '-translate-x-full')
      }`}>
        <div className="flex items-center gap-3 p-6 border-b border-gray-700">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div><h1 className="text-white font-bold text-sm">Chicago Agro</h1><p className="text-gray-400 text-xs">Admin Panel</p></div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map(link => (
            <button key={link.id} onClick={() => { setActivePage(link.id); if (!isDesktop) setSidebarOpen(false); }}
              className={"w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all " + (
                activePage === link.id ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              )}>
              <link.icon className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium text-sm">{link.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={async () => { await signOut(); window.location.href = '/login'; }}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all">
            <LogOut className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium text-sm">Exit Dashboard</span>
          </button>
        </div>
      </aside>

      <div className={`flex-1 transition-all duration-300 ${isDesktop ? 'ml-64' : 'ml-0'}`}>

        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${isDesktop ? 'hidden' : ''}`}>
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
                              <span className="text-sm font-bold text-emerald-600">{formatCurrency(product.price)}</span>
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

              {activePage === "orders" && (
                <OrdersTab
                  orders={orders} filteredOrders={filteredOrders}
                  searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                  setShowNewOrderModal={setShowNewOrderModal}
                  setEditingOrder={setEditingOrder} setShowEditModal={setShowEditModal}
                  handleDeleteOrder={handleDeleteOrder}
                  currentPage={ordersPage}
                  onPageChange={(p) => { setOrdersPage(p); fetchOrders(p); }}
                />
              )}

              {activePage === "clients" && (
                <ClientsTab
                  clients={clients}
                  setShowClientModal={setShowClientModal}
                  handleDeleteClient={handleDeleteClient}
                  currentPage={clientsPage}
                  onPageChange={(p) => { setClientsPage(p); fetchClients(p); }}
                />
              )}

              {activePage === "products" && (
                <ProductsTab
                  products={products}
                  setShowProductModal={setShowProductModal}
                  setEditingProduct={setEditingProduct}
                  setShowEditProductModal={setShowEditProductModal}
                  handleDeleteProduct={handleDeleteProduct}
                  currentPage={productsPage}
                  onPageChange={(p) => { setProductsPage(p); fetchProducts(p); }}
                />
              )}

              {activePage === "analytics" && (
                <AnalyticsTab
                  orders={orders} products={products} statsCards={statsCards}
                />
              )}

              {activePage === "reviews" && (
                <ReviewsTab
                  pendingReviews={pendingReviews} reviewsLoading={reviewsLoading}
                  handleApproveReview={handleApproveReview} handleRejectReview={handleRejectReview}
                />
              )}

              {activePage === "settings" && <SettingsTab />}
            </>
          )}
        </main>
      </div>

      {/* NEW ORDER MODAL */}
      <AnimatePresence>
        {showNewOrderModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <motion.div ref={newOrderModalRef} role="dialog" aria-modal="true" aria-label="New Order" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
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
            <motion.div ref={editOrderModalRef} role="dialog" aria-modal="true" aria-label="Edit Order" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
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
            <motion.div ref={productModalRef} role="dialog" aria-modal="true" aria-label="Add New Product" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <div className="flex gap-2">
                    <label className={`flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 ${imageUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{imageUploading ? 'Uploading...' : 'Upload'}</span>
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden"
                        onChange={e => { if (e.target.files[0]) handleImageUpload(e.target.files[0], setNewProduct, newProduct); }} />
                    </label>
                    <input type="text" placeholder="or paste image URL..." value={newProduct.image}
                      onChange={e => setNewProduct({ ...newProduct, image: e.target.value })}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
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
            <motion.div ref={editProductModalRef} role="dialog" aria-modal="true" aria-label="Edit Product" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  <div className="flex gap-2">
                    <label className={`flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 ${imageUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <Upload className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{imageUploading ? 'Uploading...' : 'Upload'}</span>
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden"
                        onChange={e => { if (e.target.files[0]) handleImageUpload(e.target.files[0], setEditingProduct, editingProduct); }} />
                    </label>
                    <input type="text" placeholder="or paste image URL..." value={editingProduct.image || ''}
                      onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                  </div>
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
            <motion.div ref={clientModalRef} role="dialog" aria-modal="true" aria-label="Add New Client" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
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
