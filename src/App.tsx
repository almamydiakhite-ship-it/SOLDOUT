import React, { useState } from 'react';
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

export default function App() {
  const [isLetterOpen, setIsLetterOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <CartProvider>
      <div className="relative min-h-screen bg-[#08070a] text-[#f4f1ec] selection:bg-[#e7a3b8] selection:text-[#08070a]">
        {/* Subtle subtle film grain texture */}
        <div className="so-grain" aria-hidden="true" />

        {/* Global navigation header */}
        <Header />

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

        {/* Footer with updated phrase and realistic fingerprint logo */}
        <Footer />

        {/* Interactive Modals and Drawer */}
        <LetterModal
          isOpen={isLetterOpen}
          onClose={() => setIsLetterOpen(false)}
        />

        <CartDrawer onCheckout={() => setIsOrderModalOpen(true)} />

        <OrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
        />
      </div>
    </CartProvider>
  );
}
