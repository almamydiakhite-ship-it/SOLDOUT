import React, { useState, useEffect } from 'react';
import { ProductsProvider } from './context/ProductsContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Features from './components/Features';
import CollectionSection from './components/CollectionSection';
import LetterSection from './components/LetterSection';
import LetterModal from './components/LetterModal';
import StorySection from './components/StorySection';
import ProcessSection from './components/ProcessSection';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import OrderModal from './components/OrderModal';
import AdminAuthModal from './components/admin/AdminAuthModal';
import AdminDashboard from './components/admin/AdminDashboard';
import { adminAuthService } from './services/adminAuthService';
import { analyticsService } from './services/analyticsService';

export default function App() {
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  // Admin state
  const [isAdminAuthOpen, setIsAdminAuthOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);

  // Record visitor analytics on initial site entry
  useEffect(() => {
    analyticsService.recordVisit();
  }, []);

  // Listen for #admin in URL and keyboard shortcut (Alt + A)
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        if (adminAuthService.isAuthenticated()) {
          setIsAdminDashboardOpen(true);
        } else {
          setIsAdminAuthOpen(true);
        }
      }
    };

    checkHash();
    window.addEventListener('hashchange', checkHash);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut Alt + A for fast admin access
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        if (adminAuthService.isAuthenticated()) {
          setIsAdminDashboardOpen(true);
        } else {
          setIsAdminAuthOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', checkHash);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleOpenAdmin = () => {
    if (adminAuthService.isAuthenticated()) {
      setIsAdminDashboardOpen(true);
    } else {
      setIsAdminAuthOpen(true);
    }
  };

  const handleAdminAuthenticated = () => {
    setIsAdminAuthOpen(false);
    setIsAdminDashboardOpen(true);
  };

  const handleAdminLogout = () => {
    adminAuthService.logout();
    setIsAdminDashboardOpen(false);
    setIsAdminAuthOpen(false);
    if (window.location.hash === '#admin') {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <ProductsProvider>
      <CartProvider>
        <div className="relative min-h-screen bg-[#08070a] text-[#f4f1ec] selection:bg-[#e7a3b8] selection:text-[#08070a]">
          {/* Subtle film grain texture */}
          <div className="so-grain" aria-hidden="true" />

          {/* Global navigation header with discreet admin lock button */}
          <Header onOpenAdmin={handleOpenAdmin} />

          {/* Main page content */}
          <main id="top">
            <Hero onOpenLetter={() => setIsLetterOpen(true)} />
            <Marquee />
            <Features />
            <CollectionSection />
            <LetterSection onOpenLetter={() => setIsLetterOpen(true)} />
            <StorySection />
            <ProcessSection />
          </main>

          {/* Footer with admin access link */}
          <Footer onOpenAdmin={handleOpenAdmin} />

          {/* Customer Modals and Drawer */}
          <LetterModal
            isOpen={isLetterOpen}
            onClose={() => setIsLetterOpen(false)}
          />

          <CartDrawer onCheckout={() => setIsOrderModalOpen(true)} />

          <OrderModal
            isOpen={isOrderModalOpen}
            onClose={() => setIsOrderModalOpen(false)}
          />

          {/* Administrator Protected Space */}
          <AdminAuthModal
            isOpen={isAdminAuthOpen}
            onClose={() => {
              setIsAdminAuthOpen(false);
              if (window.location.hash === '#admin') {
                history.replaceState(null, '', window.location.pathname + window.location.search);
              }
            }}
            onAuthenticated={handleAdminAuthenticated}
          />

          <AdminDashboard
            isOpen={isAdminDashboardOpen}
            onClose={() => {
              setIsAdminDashboardOpen(false);
              if (window.location.hash === '#admin') {
                history.replaceState(null, '', window.location.pathname + window.location.search);
              }
            }}
            onLogout={handleAdminLogout}
          />
        </div>
      </CartProvider>
    </ProductsProvider>
  );
}
