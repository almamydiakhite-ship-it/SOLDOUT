import React, { useState } from 'react';
import { X, Plus, Upload, Image as ImageIcon, Sparkles } from 'lucide-react';
import { Product } from '../../types';
import { UNIT_PRICE } from '../../data/products';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Omit<Product, 'id'>) => void;
}

export default function AddProductModal({
  isOpen,
  onClose,
  onSave,
}: AddProductModalProps) {
  const [name, setName] = useState('');
  const [chapterNo, setChapterNo] = useState('05');
  const [chapterTitle, setChapterTitle] = useState('');
  const [colourway, setColourway] = useState('Noir / Blanc');
  const [price, setPrice] = useState(UNIT_PRICE);
  const [tagline, setTagline] = useState('');
  const [story, setStory] = useState('');
  const [detailsText, setDetailsText] = useState(
    'T-shirt maille lourde, coupe oversize\nEmpreinte digitale exclusive\nÉtiquette tissée SOLD OUT\nFabriqué en édition limitée'
  );
  const [frontImage, setFrontImage] = useState('/img/never-follow-face.jpeg');
  const [backImage, setBackImage] = useState('/img/never-follow-dos.jpeg');
  const [isNew, setIsNew] = useState(true);
  const [isSoldOut, setIsSoldOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleImageFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setter(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Veuillez entrer le nom du produit.');
      return;
    }

    const details = detailsText
      .split('\n')
      .map((d) => d.trim())
      .filter(Boolean);

    onSave({
      name: name.trim(),
      chapterNo: chapterNo.trim() || '05',
      chapterTitle: (chapterTitle.trim() || `${name.toUpperCase()}.`),
      colourway: colourway.trim() || 'Édition spéciale',
      price: Number(price) || UNIT_PRICE,
      tagline: tagline.trim() || 'Pièce exclusive de la collection Sold Out.',
      story: story.trim() || 'Chaque pièce porte une partie de la lettre, et la collection une lettre entière.',
      details: details.length > 0 ? details : ['Édition limitée', 'Coton lourd premium'],
      views: [
        { label: 'Avant', src: frontImage || '/img/never-follow-face.jpeg' },
        { label: 'Arrière', src: backImage || '/img/never-follow-dos.jpeg' },
      ],
      isNew,
      isSoldOut,
    });

    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Ajouter un nouveau produit"
    >
      <div
        className="fixed inset-0 bg-[#08070a]/92 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border so-hairline bg-[#0c0a0f] p-6 text-[#f4f1ec] shadow-2xl md:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border so-hairline text-[#9b93a3] transition-colors hover:text-[#f4f1ec]"
          aria-label="Fermer"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#e7a3b8]/15 text-[#e7a3b8]">
            <Plus size={20} strokeWidth={2.4} />
          </span>
          <div>
            <h2 className="so-wordmark text-2xl text-[#f4f1ec]">
              Nouveau Produit
            </h2>
            <p className="text-xs text-[#9b93a3]">
              Ajoutez une nouvelle pièce au catalogue public Sold Out.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-[#d62a4f]/30 bg-[#d62a4f]/10 p-3 text-xs text-[#fca5a5]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="so-label block text-[0.625rem] text-[#9b93a3]">
                Nom du T-shirt *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex : Anticonformiste"
                className="mt-1.5 w-full rounded-xl border so-hairline bg-[#141019] px-4 py-3 text-sm text-[#f4f1ec] placeholder-[#5d5666] outline-none focus:border-[#e7a3b8]"
              />
            </div>

            <div>
              <label className="so-label block text-[0.625rem] text-[#9b93a3]">
                Numéro de Chapitre
              </label>
              <input
                type="text"
                value={chapterNo}
                onChange={(e) => setChapterNo(e.target.value)}
                placeholder="Ex : 05"
                className="mt-1.5 w-full rounded-xl border so-hairline bg-[#141019] px-4 py-3 text-sm text-[#f4f1ec] placeholder-[#5d5666] outline-none focus:border-[#e7a3b8]"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="so-label block text-[0.625rem] text-[#9b93a3]">
                Coloris / Nuance
              </label>
              <input
                type="text"
                value={colourway}
                onChange={(e) => setColourway(e.target.value)}
                placeholder="Ex : Noir délavé / Rose"
                className="mt-1.5 w-full rounded-xl border so-hairline bg-[#141019] px-4 py-3 text-sm text-[#f4f1ec] placeholder-[#5d5666] outline-none focus:border-[#e7a3b8]"
              />
            </div>

            <div>
              <label className="so-label block text-[0.625rem] text-[#9b93a3]">
                Prix (FCFA)
              </label>
              <input
                type="number"
                step="500"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="20000"
                className="mt-1.5 w-full rounded-xl border so-hairline bg-[#141019] px-4 py-3 text-sm text-[#f4f1ec] placeholder-[#5d5666] outline-none focus:border-[#e7a3b8]"
              />
            </div>
          </div>

          <div>
            <label className="so-label block text-[0.625rem] text-[#9b93a3]">
              Accroche (Tagline courte)
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Ex : La signature de ceux qui refusent d'obéir aux codes."
              className="mt-1.5 w-full rounded-xl border so-hairline bg-[#141019] px-4 py-3 text-sm text-[#f4f1ec] placeholder-[#5d5666] outline-none focus:border-[#e7a3b8]"
            />
          </div>

          <div>
            <label className="so-label block text-[0.625rem] text-[#9b93a3]">
              Histoire & Description
            </label>
            <textarea
              rows={3}
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Décrivez l'inspiration et l'esprit de cette pièce..."
              className="mt-1.5 w-full rounded-xl border so-hairline bg-[#141019] px-4 py-3 text-sm text-[#f4f1ec] placeholder-[#5d5666] outline-none focus:border-[#e7a3b8]"
            />
          </div>

          {/* Images Avant / Arrière */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border so-hairline bg-[#141019] p-4">
              <span className="so-label block text-[0.625rem] text-[#e7a3b8]">
                Visuel Avant (Face)
              </span>
              <div className="mt-3 flex items-center gap-3">
                <div className="relative h-20 w-16 overflow-hidden rounded-lg border so-hairline bg-[#08070a]">
                  <img
                    src={frontImage}
                    alt="Aperçu avant"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <label className="so-btn so-btn-ghost flex cursor-pointer items-center justify-center gap-1.5 py-2 text-[0.625rem]">
                    <Upload size={13} /> Charger une image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFile(e, setFrontImage)}
                    />
                  </label>
                  <input
                    type="text"
                    value={frontImage}
                    onChange={(e) => setFrontImage(e.target.value)}
                    placeholder="Ou coller une URL..."
                    className="mt-2 w-full rounded-lg border so-hairline bg-[#0c0a0f] px-2 py-1 text-[0.6875rem] text-[#9b93a3]"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border so-hairline bg-[#141019] p-4">
              <span className="so-label block text-[0.625rem] text-[#e7a3b8]">
                Visuel Arrière (Dos)
              </span>
              <div className="mt-3 flex items-center gap-3">
                <div className="relative h-20 w-16 overflow-hidden rounded-lg border so-hairline bg-[#08070a]">
                  <img
                    src={backImage}
                    alt="Aperçu dos"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <label className="so-btn so-btn-ghost flex cursor-pointer items-center justify-center gap-1.5 py-2 text-[0.625rem]">
                    <Upload size={13} /> Charger une image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageFile(e, setBackImage)}
                    />
                  </label>
                  <input
                    type="text"
                    value={backImage}
                    onChange={(e) => setBackImage(e.target.value)}
                    placeholder="Ou coller une URL..."
                    className="mt-2 w-full rounded-lg border so-hairline bg-[#0c0a0f] px-2 py-1 text-[0.6875rem] text-[#9b93a3]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Details / Bullets */}
          <div>
            <label className="so-label block text-[0.625rem] text-[#9b93a3]">
              Caractéristiques techniques (1 ligne = 1 puce)
            </label>
            <textarea
              rows={3}
              value={detailsText}
              onChange={(e) => setDetailsText(e.target.value)}
              className="mt-1.5 w-full rounded-xl border so-hairline bg-[#141019] px-4 py-3 font-mono text-xs text-[#f4f1ec] placeholder-[#5d5666] outline-none focus:border-[#e7a3b8]"
            />
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-6 rounded-xl border so-hairline bg-[#141019] p-4">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={isNew}
                onChange={(e) => setIsNew(e.target.checked)}
                className="h-4 w-4 rounded accent-[#e7a3b8]"
              />
              <span className="text-xs text-[#f4f1ec]">
                Marquer comme « Nouveau » (Badge rouge)
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                checked={isSoldOut}
                onChange={(e) => setIsSoldOut(e.target.checked)}
                className="h-4 w-4 rounded accent-[#d62a4f]"
              />
              <span className="text-xs text-[#d62a4f] font-semibold">
                Mettre immédiatement en « Sold Out » (Rupture)
              </span>
            </label>
          </div>

          {/* Action buttons */}
          <div className="mt-2 flex items-center justify-end gap-3 border-t so-hairline pt-4">
            <button
              type="button"
              onClick={onClose}
              className="so-btn so-btn-ghost py-3 text-xs"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="so-btn so-btn-solid so-btn-sheen py-3 text-xs"
            >
              <Sparkles size={14} /> Créer et publier le produit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
