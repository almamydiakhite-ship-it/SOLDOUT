import React from 'react';

const steps = [
  {
    no: '01',
    title: 'Choisis ta lettre',
    body: 'Parcours les quatre pièces, sélectionne ta taille et ajoute au panier.',
  },
  {
    no: '02',
    title: 'Envoie ton empreinte',
    body: 'Une photo nette de ton doigt pour chaque pièce. C’est elle qui sera imprimée.',
  },
  {
    no: '03',
    title: 'Confirme sur WhatsApp',
    body: 'Le récapitulatif part sur notre ligne avec tes fichiers. On te répond avec le délai.',
  },
];

export default function ProcessSection() {
  return (
    <section className="mx-auto max-w-[1400px] px-5 py-20 md:px-10 md:py-28">
      <div className="border-t so-hairline pt-12">
        <p className="so-label text-[#e7a3b8]">Comment ça marche</p>
        <h2 className="so-wordmark mt-3 text-[clamp(2.25rem,6vw,4.5rem)] text-[#f4f1ec]">
          De l'idée à ton dressing
        </h2>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-3">
        {steps.map((step) => (
          <article
            key={step.no}
            className="flex flex-col rounded-2xl border so-hairline bg-[#0c0a0f] p-6 md:p-8"
          >
            <span className="so-wordmark text-4xl text-[#e7a3b8]">
              {step.no}
            </span>
            <h3 className="so-wordmark mt-6 text-xl text-[#f4f1ec]">
              {step.title}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-[#9b93a3]">
              {step.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
