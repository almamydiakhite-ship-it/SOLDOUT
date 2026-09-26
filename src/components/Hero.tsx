import React from 'react';
import { ArrowRight } from 'lucide-react';
import { formatPrice, UNIT_PRICE } from '../data/products';

interface HeroProps {
  onOpenLetter: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenLetter }) => {
  return (
    <section id="top" className="relative isolate flex min-h-dvh items-end overflow-hidden">
      {/* Background image */}
      <img
        src="/img/hero-backdrop.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 bg-linear-to-t from-ink-950 via-ink-950/80 to-ink-950/50"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-5 pb-16 pt-36 md:px-10 md:pb-24">
        {/* Label with accent line */}
        <div className="so-fade flex items-center gap-3">
          <span className="h-px w-10 bg-rose" aria-hidden="true" />
          <p className="so-label text-rose">Drop 01 — The Letter</p>
        </div>

        {/* Hero Title */}
        <h1 className="so-wordmark so-rise mt-6 text-[clamp(3rem,12vw,9.5rem)] text-bone">
          Détermine
          <br />
          <span className="text-rose">ton unicité</span>
        </h1>

        {/* Subtitle & Actions */}
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-end">
          <p className="so-editorial so-fade max-w-xl text-xl leading-snug text-fog md:text-2xl">
            quatre t-shirts, une lettre écrite pour celles et ceux qui n'entrent pas dans le moule. Sur chacun, ton empreinte digitale — la seule signature que personne ne peut reproduire.
          </p>

          <div className="so-fade flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              <a
                href="#collection"
                className="so-btn so-btn-solid so-btn-sheen"
              >
                Voir la collection <ArrowRight size={15} strokeWidth={2.6} />
              </a>
              <button
                type="button"
                onClick={onOpenLetter}
                className="so-btn so-btn-ghost cursor-pointer"
              >
                Lire la lettre
              </button>
            </div>

            {/* Key figures */}
            <dl className="mt-2 grid grid-cols-3 gap-4 border-t so-hairline pt-6">
              <div>
                <dt className="so-label text-[0.5625rem] text-fog-dim">Pièces</dt>
                <dd className="so-wordmark mt-1.5 text-2xl text-bone">04</dd>
              </div>
              <div>
                <dt className="so-label text-[0.5625rem] text-fog-dim">Prix unique</dt>
                <dd className="so-wordmark mt-1.5 text-2xl text-bone">{formatPrice(UNIT_PRICE)}</dd>
              </div>
              <div>
                <dt className="so-label text-[0.5625rem] text-fog-dim">Livraison</dt>
                <dd className="so-wordmark mt-1.5 text-2xl text-bone">Monde entier</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
