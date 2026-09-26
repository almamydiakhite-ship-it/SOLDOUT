import React from 'react';
import { Globe } from 'lucide-react';

export default function StorySection() {
  return (
    <section id="histoire" className="relative isolate scroll-mt-24 overflow-hidden">
      <img
        src="/img/story-backdrop.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-[#08070a] via-[#08070a]/92 to-[#08070a]/60"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-[1400px] px-5 py-24 md:px-10 md:py-36">
        <div className="max-w-2xl">
          <p className="so-label text-[#e7a3b8]">Notre histoire</p>
          <h2 className="so-wordmark mt-4 text-[clamp(2.25rem,6vw,4.5rem)] text-[#f4f1ec]">
            Pourquoi
            <br />
            <span className="text-[#e7a3b8]">« Sold Out » ?</span>
          </h2>

          <div className="mt-7 flex flex-col gap-5 text-base leading-relaxed text-[#9b93a3]">
            <p>
              Dans un monde de milliards de personnes, il n'existe qu'une seule personne exactement comme toi. Ton empreinte digitale en est la preuve : tu es « Sold Out », et personne d'autre ne possède la même.
            </p>
            <p>
              Sold Out est né de cette conviction. Nous célébrons celles et ceux qui refusent de suivre la foule, assument leur identité et choisissent de laisser leur propre empreinte dans le monde.
            </p>
            <p className="so-editorial text-2xl leading-snug text-[#f4f1ec]">
              Sold Out n'est pas seulement une marque de vêtements. C'est un mouvement.
            </p>
          </div>

          <div className="mt-10 flex items-center gap-4">
            <Globe size={18} className="shrink-0 text-[#e7a3b8]" strokeWidth={1.8} />
            <p className="text-sm text-[#9b93a3]">
              Atelier à Dakar — livraison partout dans le monde
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
