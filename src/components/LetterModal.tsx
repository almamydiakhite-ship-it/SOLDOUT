import React, { useEffect } from 'react';
import { X, ArrowRight } from 'lucide-react';
import FingerprintLogo from './FingerprintLogo';
import { letterChapters } from '../data/products';

interface LetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToProduct?: (productId: string) => void;
}

export default function LetterModal({
  isOpen,
  onClose,
  onNavigateToProduct,
}: LetterModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] overflow-y-auto transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="The Letter"
    >
      <div
        className="fixed inset-0 bg-[#08070a]/90 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative mx-auto my-6 w-[calc(100%-1.5rem)] max-w-2xl md:my-16">
        <article className="relative overflow-hidden rounded-3xl border so-hairline bg-[#120f16] px-6 py-12 md:px-14 md:py-16">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border so-hairline text-[#9b93a3] transition-colors hover:text-[#f4f1ec]"
            aria-label="Fermer la lettre"
          >
            <X size={18} />
          </button>

          <FingerprintLogo className="h-12 w-auto text-[#e7a3b8]/80" strokeWidth={2.4} />

          <p className="so-label mt-8 text-[#9b93a3]">Drop 01 — The Letter</p>

          <h2 className="so-editorial mt-3 text-4xl leading-[1.05] text-[#f4f1ec] md:text-5xl">
            Quatre lettres, <em className="text-[#e7a3b8]">une</em> collection
          </h2>

          <ol className="mt-10 flex flex-col">
            {letterChapters.map((chapter) => (
              <li
                key={chapter.no}
                className="border-t so-hairline py-7 first:border-t-0 first:pt-0"
              >
                <p className="so-label text-[#e7a3b8]">Paragraphe {chapter.no}</p>
                <a
                  href={`#collection`}
                  onClick={(e) => {
                    e.preventDefault();
                    onClose();
                    if (onNavigateToProduct) {
                      onNavigateToProduct(chapter.productId);
                    } else {
                      const el = document.getElementById('collection');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="so-wordmark mt-2 block text-2xl text-[#f4f1ec] transition-colors duration-300 hover:text-[#e7a3b8] md:text-3xl"
                >
                  {chapter.title}
                </a>
                <p className="mt-3 text-sm leading-relaxed text-[#9b93a3] md:text-base">
                  {chapter.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-10 border-t so-hairline pt-8">
            {/* Phrase modifiée comme demandée : 
                "Quatre pièces; une lettre. Sur chacune, ton empreinte : la seule signature que personne ne peut copier" */}
            <p className="so-editorial text-lg leading-relaxed text-[#9b93a3] md:text-xl">
              Quatre pièces; une lettre. Sur chacune, ton empreinte : la seule signature que personne ne peut copier
            </p>
            <p className="so-wordmark mt-6 text-xl text-[#f4f1ec]">
              Détermine ton unicité.
            </p>
            <p className="so-label mt-2 text-[#6d6577]">— Sold Out</p>

            <a
              href="#collection"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                const el = document.getElementById('collection');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="so-btn so-btn-solid so-btn-sheen mt-8"
            >
              Voir les quatre pièces <ArrowRight size={15} strokeWidth={2.6} />
            </a>
          </div>
        </article>
      </div>
    </div>
  );
}
