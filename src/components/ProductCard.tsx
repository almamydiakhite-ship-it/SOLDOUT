import React, { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { Product, ProductView } from '../types';
import { SIZES, UNIT_PRICE } from '../data/products';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const { addLine } = useCart();
  const [activeView, setActiveView] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    addLine(product.id, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1600);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border so-hairline bg-[#0c0a0f] transition-colors duration-500 hover:border-[#e7a3b8]/35">
      {/* Image Container with Avant / Arrière Toggle */}
      <div className="relative">
        <div className="relative aspect-4/5 w-full overflow-hidden bg-[#120f16]">
          <img
            src={product.views[activeView].src}
            alt={`${product.name} — ${product.views[activeView].label.toLowerCase()}`}
            loading={index < 4 ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          {/* Chapter badge */}
          <span className="so-label pointer-events-none absolute left-3 top-3 rounded-full bg-[#08070a]/75 px-3 py-1.5 text-[0.5625rem] text-[#e7a3b8] backdrop-blur-sm">
            Ch. {product.chapterNo}
          </span>

          {/* New badge */}
          {product.isNew && (
            <span className="so-label pointer-events-none absolute right-3 top-3 rounded-full bg-[#d62a4f] px-3 py-1.5 text-[0.5625rem] text-[#f4f1ec]">
              Nouveau
            </span>
          )}

          {/* Front / Back Toggle Buttons */}
          <div
            className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 rounded-full border so-hairline bg-[#08070a]/80 p-1 backdrop-blur-sm"
            role="group"
            aria-label={`${product.name} — avant et arrière`}
          >
            {product.views.map((view: ProductView, vIdx: number) => (
              <button
                key={view.label}
                type="button"
                onClick={() => setActiveView(vIdx)}
                aria-pressed={activeView === vIdx}
                className={`so-label rounded-full px-3.5 py-1.5 text-[0.5rem] transition-colors duration-300 ${
                  activeView === vIdx
                    ? 'bg-[#f4f1ec] text-[#08070a]'
                    : 'text-[#9b93a3] hover:text-[#f4f1ec]'
                }`}
              >
                {view.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info & Purchase */}
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div>
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="so-wordmark text-lg text-[#f4f1ec]">
              {product.name}
            </h3>
            <span className="shrink-0 text-sm font-bold tabular-nums text-[#f4f1ec]">
              {UNIT_PRICE.toLocaleString('fr-FR')} FCFA
            </span>
          </div>
          <p className="mt-1.5 text-[0.8125rem] leading-snug text-[#9b93a3]">
            {product.tagline}
          </p>
        </div>

        <div className="mt-auto">
          {/* Size picker */}
          <div className="flex flex-wrap gap-1.5">
            {SIZES.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  setSelectedSize(size);
                  setSizeError(false);
                }}
                className={`min-w-9 rounded-md border px-2 py-1.5 text-[0.6875rem] font-bold transition-colors duration-200 ${
                  selectedSize === size
                    ? 'border-[#e7a3b8] bg-[#e7a3b8] text-[#08070a]'
                    : 'border-[#f4f1ec]/15 text-[#9b93a3] hover:border-[#f4f1ec]/45 hover:text-[#f4f1ec]'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          <p
            className={`so-label mt-2 text-[0.5625rem] text-[#d62a4f] transition-opacity duration-300 ${
              sizeError ? 'opacity-100' : 'opacity-0'
            }`}
          >
            Choisis une taille
          </p>

          <button
            type="button"
            onClick={handleAddToCart}
            className={`so-btn so-btn-sheen mt-1 w-full py-3.5 text-[0.625rem] ${
              isAdded ? 'so-btn-hot' : 'so-btn-solid'
            }`}
          >
            {isAdded ? (
              <>
                <Check size={14} strokeWidth={2.6} /> Ajouté
              </>
            ) : (
              <>
                <ShoppingBag size={14} strokeWidth={2.6} /> Ajouter au panier
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
