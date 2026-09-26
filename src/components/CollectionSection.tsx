import React from 'react';
import { products, UNIT_PRICE } from '../data/products';
import ProductCard from './ProductCard';

export default function CollectionSection() {
  return (
    <section
      id="collection"
      className="mx-auto max-w-[1400px] scroll-mt-24 px-5 pb-20 md:px-10 md:pb-28"
    >
      <div className="flex flex-col gap-6 border-t so-hairline pt-12 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="so-label text-[#e7a3b8]">La collection</p>
          <h2 className="so-wordmark mt-3 text-[clamp(2.5rem,7vw,5rem)] text-[#f4f1ec]">
            Quatre t-shirts
          </h2>
          <p className="so-editorial mt-3 max-w-lg text-lg text-[#9b93a3]">
            Prix unique de {UNIT_PRICE.toLocaleString('fr-FR')} FCFA. Tailles XS à XXL. Fais défiler chaque pièce pour voir l'avant et l'arrière. Une empreinte est demandée par pièce au moment de la commande.
          </p>
        </div>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}
