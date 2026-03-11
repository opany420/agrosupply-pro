import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { CartProvider } from './CartContext'
import { useEffect, useState } from 'react'
import { supabase } from './supabase'
import Layout from './Layout'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Contact from './pages/Contact'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import ProductDetail from './pages/ProductDetail'
import FAQ from './pages/FAQ'
import Checkout from './pages/Checkout'

function ProtectedRoute({ children }) {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (session === undefined) return (
    <div className="min-h-screen flex items-center justify-center bg-emerald-50">
      <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return session ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/products" element={<Layout><Products /></Layout>} />
          <Route path="/products/:id" element={<Layout><ProductDetail /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/faq" element={<Layout><FAQ /></Layout>} />
          <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </CartProvider>
  )
}

export default App