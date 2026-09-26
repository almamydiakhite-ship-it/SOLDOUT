import React from 'react';
import { ArrowRight } from 'lucide-react';
import FingerprintLogo from './FingerprintLogo';

interface LetterSectionProps {
  onOpenLetter: () => void;
}

export default function LetterSection({ onOpenLetter }: LetterSectionProps) {
  return (
    <section id="lettre" className="scroll-mt-24 border-y so-hairline bg-[#0c0a0f]">
      <div className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Descriptions */}
          <div>
            <p className="so-label text-[#e7a3b8]">The Letter</p>

            {/* Phrase modifiée comme demandée : 
                "Chaque collection est une paragraphe de la lettre" */}
            <h2 className="so-editorial mt-3 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] text-[#f4f1ec]">
              Chaque collection <em className="text-[#e7a3b8]">est une paragraphe</em> de la lettre
            </h2>

            <div className="mt-6 flex flex-col gap-5">
              <p className="max-w-md text-sm leading-relaxed text-[#9b93a3] md:text-base">
                Avec Sold Out, chaque collection est une paragraphe de la lettre, et la lettre est adressée aux personnes qui affirment leur identité.
              </p>
              <p className="max-w-md text-sm leading-relaxed text-[#9b93a3] md:text-base">
                Chaque pièce porte une partie de la lettre, et la collection une lettre entière adressée à celles et ceux qui refusent de suivre la foule !
              </p>
            </div>

            <button
              type="button"
              onClick={onOpenLetter}
              className="so-btn so-btn-solid so-btn-sheen mt-8"
            >
              Ouvrir l'enveloppe <ArrowRight size={15} strokeWidth={2.6} />
            </button>
          </div>

          {/* Right Column: L'enveloppe blanche entièrement fermée avec le sceau de l'empreinte réaliste */}
          <div className="flex justify-center lg:justify-end">
            <div className="flex flex-col items-center gap-6">
              <div
                role="button"
                tabIndex={0}
                onClick={onOpenLetter}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenLetter();
                  }
                }}
                className="so-envelope-wrapper cursor-pointer"
                aria-label="Appuyer sur l'enveloppe blanche pour découvrir la lettre"
              >
                {/* Enveloppe de couleur blanche entièrement fermée */}
                <div className="so-envelope">
                  {/* Fond de l'enveloppe blanche */}
                  <div className="so-envelope-white-back" />

                  {/* Plis latéraux de l'enveloppe */}
                  <div className="so-envelope-white-folds">
                    <div className="so-envelope-fold-left" />
                    <div className="so-envelope-fold-right" />
                  </div>

                  {/* Rabat inférieur de l'enveloppe blanche */}
                  <div className="so-envelope-white-front" />

                  {/* Rabat supérieur : entièrement fermé sur l'enveloppe */}
                  <div className="so-envelope-white-flap" />

                  {/* Cachet de cire scellé au milieu avec le logo empreinte réaliste original */}
                  <div className="so-envelope-seal">
                    <span className="so-envelope-seal-ring" />
                    <FingerprintLogo
                      className="h-8 w-auto text-white drop-shadow-sm"
                      strokeWidth={2.4}
                    />
                  </div>
                </div>
              </div>

              <p className="so-label text-center text-[0.5625rem] text-[#9b93a3]">
                Appuyez sur l'enveloppe pour découvrir la lettre
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
