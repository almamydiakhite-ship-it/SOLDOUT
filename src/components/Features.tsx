import React from 'react';
import { Fingerprint, Layers, Sparkles, Truck, ShieldCheck } from 'lucide-react';

const features = [
  {
    icon: Fingerprint,
    title: 'Unicité',
    body: 'Chaque pièce porte ton empreinte digitale imprimée. Aucune autre ne lui ressemblera.',
  },
  {
    icon: Layers,
    title: 'Exclusivité',
    body: 'Quatre pièces pour Drop 01. Une fois parties, elles ne reviennent pas.',
  },
  {
    icon: Sparkles,
    title: 'Identité',
    body: 'Tu ne portes pas un vêtement, tu portes ta propre identité !',
  },
  {
    icon: Truck,
    title: 'Livraison mondiale',
    body: 'Nous livrons partout dans le monde. Délai et frais confirmés sur WhatsApp.',
  },
  {
    icon: ShieldCheck,
    title: 'Paiement sécurisé',
    body: 'Rien à payer sur le site. Le mode de paiement se règle avec nous sur WhatsApp.',
  },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
      <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5">
        {features.map((item) => {
          const Icon = item.icon;
          return (
            <article key={item.title}>
              <Icon size={22} strokeWidth={1.5} className="text-[#e7a3b8]" />
              <h2 className="so-wordmark mt-4 text-xl text-[#f4f1ec]">
                {item.title}
              </h2>
              <p className="mt-2.5 text-sm leading-relaxed text-[#9b93a3]">
                {item.body}
              </p>
            </article>
          );
        })}
      </div>
    </section>
  );
}
