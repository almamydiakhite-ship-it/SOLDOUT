import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import FingerprintLogo from './FingerprintLogo';

interface CartDrawerProps {
  onCheckout: () => void;
}

export default function CartDrawer({ onCheckout }: CartDrawerProps) {
  const { lines, count, total, isCartOpen, closeCart, setQuantity, removeLine } =
    useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[70] bg-[#08070a]/75 backdrop-blur-sm transition-opacity duration-500 ${
          isCartOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-[80] flex h-dvh w-full max-w-[26rem] flex-col border-l so-hairline bg-[#0c0a0f] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-label="Panier"
        aria-hidden={!isCartOpen}
      >
        {/* Header */}
        <header className="flex items-start justify-between border-b so-hairline px-6 py-5">
          <div>
            <p className="so-label text-[#e7a3b8]">Your drop</p>
            <h2 className="so-wordmark mt-1 text-2xl text-[#f4f1ec]">
              Mon panier
            </h2>
            <p className="mt-1 text-xs text-[#9b93a3]">
              {count === 0
                ? 'Aucune pièce'
                : `${count} pièce${count > 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="-mr-2 p-2 text-[#9b93a3] transition-colors hover:text-[#f4f1ec]"
            aria-label="Fermer le panier"
          >
            <X size={20} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-5 px-10 text-center">
              <FingerprintLogo className="h-16 w-auto text-[#2e2736]" strokeWidth={2.4} />
              <div>
                <p className="so-wordmark text-lg text-[#f4f1ec]">Panier vide</p>
                <p className="mt-2 text-sm leading-relaxed text-[#9b93a3]">
                  Quatre pièces, une lettre. Choisis celle qui te ressemble.
                </p>
              </div>
              <a
                href="#collection"
                onClick={closeCart}
                className="so-btn so-btn-ghost"
              >
                Voir la collection
              </a>
            </div>
          ) : (
            <div className="flex flex-col divide-y so-hairline p-6">
              {lines.map((line) => (
                <div key={line.lineId} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <img
                    src={line.product.views[0].src}
                    alt={line.product.name}
                    className="h-20 w-16 rounded-lg object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="so-wordmark text-base text-[#f4f1ec]">
                          {line.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeLine(line.lineId)}
                          className="text-[#6d6577] transition-colors hover:text-[#d62a4f]"
                          aria-label={`Supprimer ${line.product.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <p className="text-xs text-[#9b93a3]">
                        Taille : <span className="font-bold text-[#f4f1ec]">{line.size}</span>
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-lg border so-hairline bg-[#17141d]">
                        <button
                          type="button"
                          onClick={() => setQuantity(line.lineId, line.quantity - 1)}
                          className="p-1.5 text-[#9b93a3] hover:text-[#f4f1ec]"
                          aria-label="Diminuer la quantité"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-7 text-center text-xs font-bold tabular-nums text-[#f4f1ec]">
                          {line.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity(line.lineId, line.quantity + 1)}
                          className="p-1.5 text-[#9b93a3] hover:text-[#f4f1ec]"
                          aria-label="Augmenter la quantité"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <span className="text-sm font-bold tabular-nums text-[#f4f1ec]">
                        {line.lineTotal.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <footer className="border-t so-hairline bg-[#08070a] p-6">
            <div className="flex items-baseline justify-between">
              <span className="so-label text-xs text-[#9b93a3]">Total</span>
              <span className="so-wordmark text-2xl text-[#f4f1ec]">
                {total.toLocaleString('fr-FR')} FCFA
              </span>
            </div>
            <p className="mt-2 text-[0.6875rem] text-[#6d6577]">
              Confirmation et modalité de livraison sur WhatsApp.
            </p>
            <button
              type="button"
              onClick={() => {
                closeCart();
                onCheckout();
              }}
              className="so-btn so-btn-solid so-btn-sheen mt-5 w-full justify-between"
            >
              <span>Commander</span>
              <ArrowRight size={15} strokeWidth={2.6} />
            </button>
          </footer>
        )}
      </aside>
    </>
  );
}
