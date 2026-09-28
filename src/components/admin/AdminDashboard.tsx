import React, { useState, useEffect, useMemo } from 'react';
import {
  Users,
  ShoppingBag,
  TrendingUp,
  Package,
  Plus,
  Ban,
  CheckCircle2,
  Clock,
  Truck,
  Search,
  ExternalLink,
  LogOut,
  RefreshCw,
  Lock,
  Phone,
  MapPin,
  Calendar,
  AlertTriangle,
  Download,
  Shield,
  Eye,
  Trash2,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { FingerprintLogo } from '../FingerprintLogo';
import { useProducts } from '../../context/ProductsContext';
import { ordersService } from '../../services/ordersService';
import { analyticsService } from '../../services/analyticsService';
import { adminAuthService } from '../../services/adminAuthService';
import { StoredOrder, OrderStatus, VisitorStats, Product } from '../../types';
import AddProductModal from './AddProductModal';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

type TabType = 'overview' | 'orders' | 'products' | 'visitors' | 'settings';

export default function AdminDashboard({
  isOpen,
  onClose,
  onLogout,
}: AdminDashboardProps) {
  const { products, toggleSoldOut, addProduct, deleteProduct, resetToDefaults } = useProducts();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [orders, setOrders] = useState<StoredOrder[]>([]);
  const [stats, setStats] = useState<VisitorStats>(analyticsService.getStats());
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);

  // Orders filters
  const [orderSearch, setOrderSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<StoredOrder | null>(null);

  // Settings
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Refresh data on mount or open
  useEffect(() => {
    if (isOpen) {
      setOrders(ordersService.getOrders());
      setStats(analyticsService.getStats());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const ordersStats = ordersService.getStats();
  const soldOutProducts = products.filter((p) => p.isSoldOut);
  const availableProducts = products.filter((p) => !p.isSoldOut);

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.phone.includes(orderSearch) ||
      order.reference.toLowerCase().includes(orderSearch.toLowerCase()) ||
      order.zone.toLowerCase().includes(orderSearch.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = ordersService.updateOrderStatus(orderId, newStatus);
    setOrders(updated);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      const updated = ordersService.deleteOrder(orderId);
      setOrders(updated);
      if (selectedOrder?.id === orderId) setSelectedOrder(null);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Les deux mots de passe ne correspondent pas.' });
      return;
    }
    const res = adminAuthService.changePassword(oldPassword, newPassword);
    if (res.success) {
      setPasswordMessage({ type: 'success', text: 'Mot de passe administrateur modifié avec succès.' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setPasswordMessage({ type: 'error', text: res.error || 'Erreur lors du changement de mot de passe.' });
    }
  };

  const handleExportData = () => {
    const data = {
      exportDate: new Date().toISOString(),
      store: 'Sold Out — Dakar',
      orders,
      products,
      analytics: stats,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `soldout-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSimulateVisit = () => {
    const updated = analyticsService.recordVisit();
    setStats({ ...updated });
  };

  return (
    <div
      className="fixed inset-0 z-[110] flex flex-col bg-[#070609] text-[#f4f1ec]"
      role="dialog"
      aria-modal="true"
      aria-label="Tableau de bord administration"
    >
      {/* Top Bar */}
      <header className="flex shrink-0 items-center justify-between border-b so-hairline bg-[#0c0a0f] px-5 py-3.5 md:px-8">
        <div className="flex items-center gap-3.5">
          <div className="relative grid h-10 w-10 place-items-center rounded-xl border so-hairline bg-[#15111b]">
            <FingerprintLogo className="h-6 w-auto text-[#e7a3b8]" strokeWidth={2.4} />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0c0a0f]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="so-wordmark text-lg text-[#f4f1ec]">Sold Out</span>
              <span className="so-label rounded bg-[#e7a3b8]/15 px-2 py-0.5 text-[0.5625rem] font-bold text-[#e7a3b8]">
                STUDIO ADMIN
              </span>
            </div>
            <p className="text-[0.625rem] text-[#9b93a3]">
              Dakar, Sénégal · Espace Sécurisé
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="so-btn so-btn-ghost flex items-center gap-2 py-2 text-xs"
          >
            <Eye size={14} /> Voir la boutique
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="so-btn flex items-center gap-1.5 border border-[#d62a4f]/40 bg-[#d62a4f]/15 py-2 text-xs text-[#fca5a5] hover:bg-[#d62a4f]/25"
          >
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <aside className="w-56 shrink-0 border-r so-hairline bg-[#0a080e] p-3 hidden md:flex md:flex-col justify-between">
          <nav className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-left text-xs font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-[#e7a3b8]/15 text-[#e7a3b8]'
                  : 'text-[#9b93a3] hover:bg-white/5 hover:text-[#f4f1ec]'
              }`}
            >
              <TrendingUp size={16} /> Vue d'ensemble
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-left text-xs font-medium transition-colors ${
                activeTab === 'orders'
                  ? 'bg-[#e7a3b8]/15 text-[#e7a3b8]'
                  : 'text-[#9b93a3] hover:bg-white/5 hover:text-[#f4f1ec]'
              }`}
            >
              <span className="flex items-center gap-3">
                <ShoppingBag size={16} /> Commandes
              </span>
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-[#18131e] px-1.5 text-[0.625rem] font-bold text-[#e7a3b8]">
                {orders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`flex items-center justify-between rounded-xl px-3.5 py-3 text-left text-xs font-medium transition-colors ${
                activeTab === 'products'
                  ? 'bg-[#e7a3b8]/15 text-[#e7a3b8]'
                  : 'text-[#9b93a3] hover:bg-white/5 hover:text-[#f4f1ec]'
              }`}
            >
              <span className="flex items-center gap-3">
                <Package size={16} /> Produits & Stocks
              </span>
              {soldOutProducts.length > 0 && (
                <span className="rounded bg-[#d62a4f] px-1.5 py-0.5 text-[0.5625rem] font-bold text-white">
                  {soldOutProducts.length} épuisé
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('visitors')}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-left text-xs font-medium transition-colors ${
                activeTab === 'visitors'
                  ? 'bg-[#e7a3b8]/15 text-[#e7a3b8]'
                  : 'text-[#9b93a3] hover:bg-white/5 hover:text-[#f4f1ec]'
              }`}
            >
              <Users size={16} /> Visiteurs & Trafic
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-left text-xs font-medium transition-colors ${
                activeTab === 'settings'
                  ? 'bg-[#e7a3b8]/15 text-[#e7a3b8]'
                  : 'text-[#9b93a3] hover:bg-white/5 hover:text-[#f4f1ec]'
              }`}
            >
              <Lock size={16} /> Sécurité & Accès
            </button>
          </nav>

          <div className="rounded-xl border so-hairline bg-[#0c0a0f] p-3 text-[0.625rem] text-[#6d6577]">
            <p className="font-semibold text-[#9b93a3]">Session Administrateur</p>
            <p className="mt-1">Connecté en tant que Gérant</p>
            <p className="mt-1 flex items-center gap-1.5 text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Chiffrement actif
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {/* Mobile Tab Pills */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1 md:hidden">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium ${
                activeTab === 'overview' ? 'bg-[#e7a3b8] text-[#08070a]' : 'bg-[#141019] text-[#9b93a3]'
              }`}
            >
              Aperçu
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium ${
                activeTab === 'orders' ? 'bg-[#e7a3b8] text-[#08070a]' : 'bg-[#141019] text-[#9b93a3]'
              }`}
            >
              Commandes ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium ${
                activeTab === 'products' ? 'bg-[#e7a3b8] text-[#08070a]' : 'bg-[#141019] text-[#9b93a3]'
              }`}
            >
              Produits ({products.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('visitors')}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium ${
                activeTab === 'visitors' ? 'bg-[#e7a3b8] text-[#08070a]' : 'bg-[#141019] text-[#9b93a3]'
              }`}
            >
              Visiteurs
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium ${
                activeTab === 'settings' ? 'bg-[#e7a3b8] text-[#08070a]' : 'bg-[#141019] text-[#9b93a3]'
              }`}
            >
              Sécurité
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-8">
              {/* Header */}
              <div>
                <p className="so-label text-[#e7a3b8]">Vue d'ensemble</p>
                <h1 className="so-wordmark mt-1 text-3xl text-[#f4f1ec]">
                  Statistiques & Performances
                </h1>
                <p className="text-xs text-[#9b93a3]">
                  Aperçu en temps réel de votre activité commerciale et de l'audience.
                </p>
              </div>

              {/* 4 KPI Cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {/* Visitors */}
                <div className="rounded-2xl border so-hairline bg-[#0c0a0f] p-5">
                  <div className="flex items-center justify-between">
                    <span className="so-label text-[0.625rem] text-[#9b93a3]">
                      Visiteurs Totaux
                    </span>
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
                      <Users size={16} />
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="so-wordmark text-3xl text-[#f4f1ec]">
                      {stats.totalVisits.toLocaleString('fr-FR')}
                    </span>
                    <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.625rem] font-semibold text-emerald-400">
                      +{stats.todayVisits} auj.
                    </span>
                  </div>
                  <p className="mt-2 text-[0.6875rem] text-[#9b93a3]">
                    <strong className="text-[#f4f1ec]">{stats.uniqueVisitors}</strong> visiteurs uniques enregistrés
                  </p>
                </div>

                {/* Orders */}
                <div className="rounded-2xl border so-hairline bg-[#0c0a0f] p-5">
                  <div className="flex items-center justify-between">
                    <span className="so-label text-[0.625rem] text-[#9b93a3]">
                      Commandes
                    </span>
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#e7a3b8]/10 text-[#e7a3b8]">
                      <ShoppingBag size={16} />
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="so-wordmark text-3xl text-[#f4f1ec]">
                      {orders.length}
                    </span>
                    <span className="rounded-full bg-[#e7a3b8]/15 px-2 py-0.5 text-[0.625rem] font-semibold text-[#e7a3b8]">
                      {ordersStats.pendingOrders} en attente
                    </span>
                  </div>
                  <p className="mt-2 text-[0.6875rem] text-[#9b93a3]">
                    <strong className="text-emerald-400">{ordersStats.deliveredOrders}</strong> livrées avec succès
                  </p>
                </div>

                {/* Revenue */}
                <div className="rounded-2xl border so-hairline bg-[#0c0a0f] p-5">
                  <div className="flex items-center justify-between">
                    <span className="so-label text-[0.625rem] text-[#9b93a3]">
                      Chiffre d'Affaires
                    </span>
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-500/10 text-amber-400">
                      <TrendingUp size={16} />
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="so-wordmark text-2xl text-[#f4f1ec]">
                      {ordersStats.totalRevenue.toLocaleString('fr-FR')}
                    </span>
                    <span className="text-xs text-[#9b93a3]">FCFA</span>
                  </div>
                  <p className="mt-2 text-[0.6875rem] text-[#9b93a3]">
                    Moyenne : <strong className="text-[#f4f1ec]">20 000 FCFA</strong> / pièce
                  </p>
                </div>

                {/* Products & Sold Out Status */}
                <div className="rounded-2xl border so-hairline bg-[#0c0a0f] p-5">
                  <div className="flex items-center justify-between">
                    <span className="so-label text-[0.625rem] text-[#9b93a3]">
                      Catalogue & Stocks
                    </span>
                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-rose-500/10 text-rose-400">
                      <Package size={16} />
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="so-wordmark text-3xl text-[#f4f1ec]">
                      {products.length}
                    </span>
                    {soldOutProducts.length > 0 ? (
                      <span className="rounded-full bg-[#d62a4f]/20 px-2 py-0.5 text-[0.625rem] font-bold text-[#d62a4f]">
                        {soldOutProducts.length} Sold Out
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[0.625rem] font-semibold text-emerald-400">
                        100% en stock
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[0.6875rem] text-[#9b93a3]">
                    <strong className="text-emerald-400">{availableProducts.length}</strong> disponibles à la vente
                  </p>
                </div>
              </div>

              {/* Traffic Chart */}
              <div className="rounded-3xl border so-hairline bg-[#0c0a0f] p-6 md:p-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="so-wordmark text-xl text-[#f4f1ec]">
                      Fréquentation des Visiteurs (10 derniers jours)
                    </h3>
                    <p className="text-xs text-[#9b93a3]">
                      Volume de visites enregistrées sur la boutique Sold Out.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSimulateVisit}
                    className="so-btn so-btn-ghost self-start text-[0.625rem]"
                  >
                    <RefreshCw size={12} /> Simuler 1 visite
                  </button>
                </div>

                <div className="mt-8 flex h-48 items-end gap-2 border-b so-hairline pb-2 sm:gap-4">
                  {stats.history.map((day) => {
                    const max = Math.max(...stats.history.map((h) => h.visits), 100);
                    const heightPercent = Math.max(12, Math.round((day.visits / max) * 100));

                    return (
                      <div
                        key={day.date}
                        className="group relative flex flex-1 flex-col items-center gap-2"
                      >
                        {/* Tooltip on hover */}
                        <div className="pointer-events-none absolute -top-10 opacity-0 transition-opacity group-hover:opacity-100 z-10 rounded-md bg-[#18131e] px-2 py-1 text-[0.625rem] font-bold text-[#e7a3b8] shadow-md whitespace-nowrap">
                          {day.visits} visites ({day.uniqueCount} uniques)
                        </div>
                        {/* Bar */}
                        <div
                          style={{ height: `${heightPercent}%` }}
                          className="w-full rounded-t-lg bg-linear-to-t from-[#e7a3b8]/40 to-[#e7a3b8] transition-all duration-300 group-hover:from-[#d62a4f] group-hover:to-[#e7a3b8]"
                        />
                        <span className="so-label text-[0.5625rem] text-[#9b93a3]">
                          {day.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions & Stock Alerts */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Stock Controls */}
                <div className="rounded-3xl border so-hairline bg-[#0c0a0f] p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="so-wordmark text-lg text-[#f4f1ec]">
                      Gestion Rapide Rupture de Stock (Sold Out)
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('products')}
                      className="text-xs text-[#e7a3b8] hover:underline"
                    >
                      Tout voir →
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-[#9b93a3]">
                    Basculez un produit en « SOLD OUT » dès que les stocks sont épuisés.
                  </p>

                  <div className="mt-5 flex flex-col gap-3">
                    {products.slice(0, 4).map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between rounded-xl border so-hairline bg-[#141019] p-3"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={p.views[0]?.src}
                            alt=""
                            className="h-10 w-8 rounded object-cover"
                          />
                          <div>
                            <p className="text-xs font-semibold text-[#f4f1ec]">{p.name}</p>
                            <p className="text-[0.625rem] text-[#9b93a3]">
                              Ch. {p.chapterNo} · {p.colourway}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleSoldOut(p.id)}
                          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.625rem] font-bold transition-all ${
                            p.isSoldOut
                              ? 'bg-[#d62a4f] text-white shadow-md shadow-[#d62a4f]/30'
                              : 'border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          }`}
                        >
                          {p.isSoldOut ? (
                            <>
                              <Ban size={11} strokeWidth={2.8} /> SOLD OUT (Épuisé)
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={11} strokeWidth={2.4} /> En Stock
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="rounded-3xl border so-hairline bg-[#0c0a0f] p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="so-wordmark text-lg text-[#f4f1ec]">
                      Dernières Commandes
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-[#e7a3b8] hover:underline"
                    >
                      Voir les {orders.length} commandes →
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-[#9b93a3]">
                    Commandes récemment validées avec signature biométrique.
                  </p>

                  <div className="mt-5 flex flex-col gap-3">
                    {orders.slice(0, 3).map((o) => (
                      <div
                        key={o.id}
                        onClick={() => {
                          setSelectedOrder(o);
                          setActiveTab('orders');
                        }}
                        className="flex cursor-pointer items-center justify-between rounded-xl border so-hairline bg-[#141019] p-3 transition-colors hover:border-[#e7a3b8]/40"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-[#e7a3b8]">
                              {o.reference}
                            </span>
                            <span className="text-xs text-[#f4f1ec]">{o.customerName}</span>
                          </div>
                          <p className="mt-0.5 text-[0.625rem] text-[#9b93a3]">
                            {o.zone} · {o.items.length} article(s)
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-bold text-[#f4f1ec]">
                            {o.totalAmount.toLocaleString('fr-FR')} FCFA
                          </p>
                          <span className="inline-block mt-0.5 rounded-full bg-[#e7a3b8]/15 px-2 py-0.5 text-[0.5625rem] text-[#e7a3b8]">
                            {o.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS */}
          {activeTab === 'orders' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="so-label text-[#e7a3b8]">Ventes & Expéditions</p>
                  <h1 className="so-wordmark mt-1 text-3xl text-[#f4f1ec]">
                    Gestion des Commandes
                  </h1>
                  <p className="text-xs text-[#9b93a3]">
                    {orders.length} commandes enregistrées au total.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExportData}
                  className="so-btn so-btn-ghost flex items-center gap-2 py-2.5 text-xs self-start"
                >
                  <Download size={14} /> Exporter les commandes (JSON)
                </button>
              </div>

              {/* Filters */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9b93a3]" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder="Rechercher par nom, téléphone, référence..."
                    className="w-full rounded-xl border so-hairline bg-[#141019] py-2.5 pl-10 pr-4 text-xs text-[#f4f1ec] placeholder-[#5d5666] outline-none focus:border-[#e7a3b8]"
                  />
                </div>

                <div className="flex gap-1.5 overflow-x-auto">
                  {['all', 'Reçue', 'Confirmée', 'En préparation', 'Livrée'].map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setStatusFilter(st)}
                      className={`shrink-0 rounded-lg px-3 py-2 text-[0.6875rem] font-medium transition-colors ${
                        statusFilter === st
                          ? 'bg-[#e7a3b8] text-[#08070a]'
                          : 'bg-[#141019] text-[#9b93a3] hover:text-[#f4f1ec]'
                      }`}
                    >
                      {st === 'all' ? 'Toutes' : st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Orders List */}
              {filteredOrders.length === 0 ? (
                <div className="rounded-3xl border so-hairline bg-[#0c0a0f] p-12 text-center">
                  <ShoppingBag size={32} className="mx-auto text-[#6d6577]" />
                  <p className="mt-3 text-sm text-[#9b93a3]">Aucune commande trouvée.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {filteredOrders.map((order) => {
                    const waMessage = encodeURIComponent(
                      `Bonjour ${order.customerName},\n\nNous vous contactons concernant votre commande Sold Out (${order.reference}).\nStatut actuel : ${order.status}.\n\nMerci de votre confiance.\n— Équipe Sold Out`
                    );
                    const waLink = `https://wa.me/${order.phone.replace(/[^0-9]/g, '')}?text=${waMessage}`;

                    return (
                      <div
                        key={order.id}
                        className="rounded-2xl border so-hairline bg-[#0c0a0f] p-5 transition-all hover:border-[#e7a3b8]/30"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          {/* Header info */}
                          <div>
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="font-mono text-sm font-bold text-[#e7a3b8]">
                                {order.reference}
                              </span>
                              <span className="text-sm font-semibold text-[#f4f1ec]">
                                {order.customerName}
                              </span>
                              <span className="flex items-center gap-1 text-xs text-[#9b93a3]">
                                <Calendar size={12} />
                                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                                  day: 'numeric',
                                  month: 'short',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-[#9b93a3]">
                              <span className="flex items-center gap-1">
                                <Phone size={12} className="text-[#e7a3b8]" /> {order.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin size={12} className="text-[#e7a3b8]" /> {order.zone} · {order.address}
                              </span>
                              {order.biometricCert && (
                                <span className="flex items-center gap-1 rounded bg-[#e7a3b8]/10 px-2 py-0.5 text-[0.625rem] text-[#e7a3b8]">
                                  <Shield size={10} /> Empreinte certifiée : {order.biometricCert}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Right Controls */}
                          <div className="flex flex-wrap items-center gap-3">
                            <span className="text-base font-bold tabular-nums text-[#f4f1ec]">
                              {order.totalAmount.toLocaleString('fr-FR')} FCFA
                            </span>

                            {/* Status dropdown */}
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                              className="rounded-xl border so-hairline bg-[#16121d] px-3 py-2 text-xs font-semibold text-[#e7a3b8] outline-none"
                            >
                              <option value="Reçue">Reçue</option>
                              <option value="Confirmée">Confirmée</option>
                              <option value="En préparation">En préparation</option>
                              <option value="Expédiée">Expédiée</option>
                              <option value="Livrée">Livrée</option>
                              <option value="Annulée">Annulée</option>
                            </select>

                            {/* WhatsApp button */}
                            <a
                              href={waLink}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="so-btn so-btn-solid flex items-center gap-1.5 py-2 text-xs"
                            >
                              <Phone size={13} /> WhatsApp
                            </a>

                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(order.id)}
                              className="rounded-xl border border-white/5 p-2 text-[#6d6577] hover:border-[#d62a4f] hover:text-[#d62a4f]"
                              title="Supprimer la commande"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="mt-4 border-t so-hairline pt-3">
                          <p className="so-label text-[0.5625rem] text-[#9b93a3]">Articles commandés :</p>
                          <div className="mt-2 flex flex-wrap gap-3">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 rounded-lg border so-hairline bg-[#141019] px-3 py-1.5 text-xs"
                              >
                                <span className="font-semibold text-[#f4f1ec]">{item.productName}</span>
                                <span className="text-[#9b93a3]">Taille {item.size}</span>
                                <span className="text-[#e7a3b8]">×{item.quantity}</span>
                                <span className="text-[#9b93a3]">({(item.unitPrice * item.quantity).toLocaleString()} FCFA)</span>
                              </div>
                            ))}
                          </div>
                          {order.note && (
                            <p className="mt-2 text-xs italic text-[#9b93a3]">
                              Note client : « {order.note} »
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: PRODUCTS & STOCKS */}
          {activeTab === 'products' && (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="so-label text-[#e7a3b8]">Catalogue public</p>
                  <h1 className="so-wordmark mt-1 text-3xl text-[#f4f1ec]">
                    Gestion des Produits & Sold Out
                  </h1>
                  <p className="text-xs text-[#9b93a3]">
                    Activez le statut Sold Out en un clic ou ajoutez de nouvelles pièces.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(true)}
                    className="so-btn so-btn-solid so-btn-sheen flex items-center gap-2 py-3 text-xs"
                  >
                    <Plus size={16} strokeWidth={2.6} /> Ajouter un nouveau produit
                  </button>
                </div>
              </div>

              {/* Grid of products */}
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => {
                  const isSoldOut = Boolean(p.isSoldOut);

                  return (
                    <div
                      key={p.id}
                      className={`relative flex flex-col overflow-hidden rounded-2xl border transition-all ${
                        isSoldOut
                          ? 'border-[#d62a4f]/50 bg-[#120a0f]'
                          : 'border-white/10 bg-[#0c0a0f]'
                      }`}
                    >
                      {/* Image */}
                      <div className="relative aspect-4/5 w-full overflow-hidden bg-[#18131e]">
                        <img
                          src={p.views[0]?.src}
                          alt={p.name}
                          className={`h-full w-full object-cover ${isSoldOut ? 'grayscale-[50%]' : ''}`}
                        />
                        <span className="absolute left-3 top-3 rounded-full bg-[#08070a]/80 px-2.5 py-1 text-[0.5625rem] text-[#e7a3b8]">
                          Ch. {p.chapterNo}
                        </span>

                        {isSoldOut ? (
                          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-[#d62a4f] px-3 py-1 text-[0.625rem] font-bold text-white shadow-lg">
                            <Ban size={11} strokeWidth={2.8} /> SOLD OUT
                          </span>
                        ) : (
                          <span className="absolute right-3 top-3 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[0.625rem] font-semibold text-emerald-400">
                            En stock
                          </span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col p-4">
                        <div className="flex items-baseline justify-between gap-2">
                          <h3 className="so-wordmark text-lg text-[#f4f1ec]">{p.name}</h3>
                          <span className="text-xs font-bold text-[#e7a3b8]">
                            {(p.price || 20000).toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[#9b93a3] line-clamp-2">{p.tagline}</p>

                        <div className="mt-auto pt-4 flex flex-col gap-2">
                          {/* Sold Out Toggle Button */}
                          <button
                            type="button"
                            onClick={() => toggleSoldOut(p.id)}
                            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold transition-all ${
                              isSoldOut
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                : 'bg-[#d62a4f] text-white shadow-lg shadow-[#d62a4f]/30 hover:bg-[#c02444]'
                            }`}
                          >
                            {isSoldOut ? (
                              <>
                                <CheckCircle2 size={15} strokeWidth={2.4} /> Remettre en Stock
                              </>
                            ) : (
                              <>
                                <Ban size={15} strokeWidth={2.4} /> Marquer « SOLD OUT »
                              </>
                            )}
                          </button>

                          {/* Delete if custom */}
                          {p.id.includes('-') && !['never-follow', 'own-your-story', 'built-different', 'the-one'].includes(p.id) && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Supprimer définitivement « ${p.name} » ?`)) {
                                  deleteProduct(p.id);
                                }
                              }}
                              className="text-center text-[0.6875rem] text-[#6d6577] hover:text-[#d62a4f]"
                            >
                              Supprimer ce produit
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reset to initial drop */}
              <div className="mt-8 rounded-2xl border so-hairline bg-[#141019] p-5 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-[#f4f1ec]">
                    Réinitialiser le catalogue d'origine
                  </h4>
                  <p className="text-[0.6875rem] text-[#9b93a3]">
                    Restaure les 4 t-shirts initiaux du Drop 01 (Never Follow, Own Your Story, Built Different, The One).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Voulez-vous restaurer les 4 t-shirts d’origine du Drop 01 ?')) {
                      resetToDefaults();
                    }
                  }}
                  className="so-btn so-btn-ghost text-xs"
                >
                  Restaurer Drop 01
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: VISITORS */}
          {activeTab === 'visitors' && (
            <div className="flex flex-col gap-6">
              <div>
                <p className="so-label text-[#e7a3b8]">Audience & Statistiques</p>
                <h1 className="so-wordmark mt-1 text-3xl text-[#f4f1ec]">
                  Analyse des Visiteurs
                </h1>
                <p className="text-xs text-[#9b93a3]">
                  Suivi des sessions et des consultations sur la plateforme.
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div className="rounded-2xl border so-hairline bg-[#0c0a0f] p-6 text-center">
                  <p className="so-label text-[0.625rem] text-[#9b93a3]">Pages Vues Totales</p>
                  <p className="so-wordmark mt-2 text-4xl text-[#f4f1ec]">
                    {stats.totalVisits.toLocaleString('fr-FR')}
                  </p>
                  <p className="mt-2 text-xs text-[#e7a3b8]">
                    +{stats.todayVisits} aujourd'hui
                  </p>
                </div>

                <div className="rounded-2xl border so-hairline bg-[#0c0a0f] p-6 text-center">
                  <p className="so-label text-[0.625rem] text-[#9b93a3]">Visiteurs Uniques</p>
                  <p className="so-wordmark mt-2 text-4xl text-[#f4f1ec]">
                    {stats.uniqueVisitors.toLocaleString('fr-FR')}
                  </p>
                  <p className="mt-2 text-xs text-emerald-400">
                    Navigateurs distincts
                  </p>
                </div>

                <div className="rounded-2xl border so-hairline bg-[#0c0a0f] p-6 text-center">
                  <p className="so-label text-[0.625rem] text-[#9b93a3]">Répartition Écrans</p>
                  <div className="mt-3 flex items-center justify-center gap-4">
                    <div>
                      <p className="text-2xl font-bold text-[#f4f1ec]">74%</p>
                      <p className="text-[0.625rem] text-[#9b93a3]">Mobile (iPhone / Android)</p>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <div>
                      <p className="text-2xl font-bold text-[#f4f1ec]">26%</p>
                      <p className="text-[0.625rem] text-[#9b93a3]">Ordinateurs</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border so-hairline bg-[#0c0a0f] p-6">
                <h3 className="so-wordmark text-lg text-[#f4f1ec]">
                  Détail par Journée
                </h3>
                <div className="mt-4 divide-y so-hairline">
                  {stats.history.slice().reverse().map((h) => (
                    <div key={h.date} className="flex items-center justify-between py-3">
                      <div>
                        <span className="text-xs font-semibold text-[#f4f1ec]">{h.label}</span>
                        <span className="ml-2 font-mono text-[0.6875rem] text-[#9b93a3]">({h.date})</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold text-[#e7a3b8]">{h.visits} visites</span>
                        <span className="text-xs text-[#9b93a3]">({h.uniqueCount} uniques)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: SETTINGS & SECURITY */}
          {activeTab === 'settings' && (
            <div className="max-w-xl flex flex-col gap-6">
              <div>
                <p className="so-label text-[#e7a3b8]">Sécurité & Confidentialité</p>
                <h1 className="so-wordmark mt-1 text-3xl text-[#f4f1ec]">
                  Paramètres de l'Espace Admin
                </h1>
                <p className="text-xs text-[#9b93a3]">
                  Gérez vos identifiants d'accès et sauvegardez vos données.
                </p>
              </div>

              {/* Change Password Form */}
              <div className="rounded-3xl border so-hairline bg-[#0c0a0f] p-6 md:p-8">
                <h3 className="so-wordmark text-xl text-[#f4f1ec]">
                  Modifier le mot de passe administrateur
                </h3>
                <p className="mt-1 text-xs text-[#9b93a3]">
                  Assurez-vous d'utiliser un mot de passe robuste connu uniquement de vous.
                </p>

                {passwordMessage && (
                  <div
                    className={`mt-4 rounded-xl border p-3 text-xs ${
                      passwordMessage.type === 'success'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-[#d62a4f]/30 bg-[#d62a4f]/10 text-[#fca5a5]'
                    }`}
                  >
                    {passwordMessage.text}
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="mt-5 flex flex-col gap-4">
                  <div>
                    <label className="so-label block text-[0.625rem] text-[#9b93a3]">
                      Ancien mot de passe
                    </label>
                    <input
                      type="password"
                      required
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      placeholder="Votre mot de passe actuel..."
                      className="mt-1.5 w-full rounded-xl border so-hairline bg-[#141019] px-4 py-3 text-sm text-[#f4f1ec] outline-none focus:border-[#e7a3b8]"
                    />
                  </div>

                  <div>
                    <label className="so-label block text-[0.625rem] text-[#9b93a3]">
                      Nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 caractères..."
                      className="mt-1.5 w-full rounded-xl border so-hairline bg-[#141019] px-4 py-3 text-sm text-[#f4f1ec] outline-none focus:border-[#e7a3b8]"
                    />
                  </div>

                  <div>
                    <label className="so-label block text-[0.625rem] text-[#9b93a3]">
                      Confirmer le nouveau mot de passe
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Retapez le nouveau mot de passe..."
                      className="mt-1.5 w-full rounded-xl border so-hairline bg-[#141019] px-4 py-3 text-sm text-[#f4f1ec] outline-none focus:border-[#e7a3b8]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="so-btn so-btn-solid so-btn-sheen mt-2 py-3 text-xs"
                  >
                    Enregistrer le nouveau mot de passe
                  </button>
                </form>
              </div>

              {/* Data Backup */}
              <div className="rounded-3xl border so-hairline bg-[#0c0a0f] p-6">
                <h3 className="so-wordmark text-lg text-[#f4f1ec]">
                  Sauvegarde & Exportation
                </h3>
                <p className="mt-1 text-xs text-[#9b93a3]">
                  Téléchargez un instantané complet de vos commandes et produits en format JSON.
                </p>

                <button
                  type="button"
                  onClick={handleExportData}
                  className="so-btn so-btn-ghost mt-4 flex items-center gap-2 py-2.5 text-xs"
                >
                  <Download size={15} /> Télécharger la sauvegarde complète
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onSave={(newProductData) => {
          addProduct(newProductData);
          setIsAddProductOpen(false);
        }}
      />
    </div>
  );
}
