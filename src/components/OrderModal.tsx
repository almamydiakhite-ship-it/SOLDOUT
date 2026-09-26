import React, { useState } from 'react';
import { X, Upload, CheckCircle2, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import FingerprintLogo from './FingerprintLogo';
import { WHATSAPP_PHONE } from '../data/products';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderModal({ isOpen, onClose }: OrderModalProps) {
  const { lines, total, clear } = useCart();
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [zone, setZone] = useState('');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [fingerprintFiles, setFingerprintFiles] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const handleFileUpload = (lineId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFingerprintFiles((prev) => ({
        ...prev,
        [lineId]: file.name,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ref = `SO-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const itemsSummary = lines
      .map(
        (l, i) =>
          `${i + 1}. ${l.product.name} (Ch. ${l.product.chapterNo})\n   Taille: ${l.size} · Quantité: ${l.quantity} · ${(l.lineTotal).toLocaleString('fr-FR')} FCFA\n   Empreinte: ${fingerprintFiles[l.lineId] ? `Photo jointe (${fingerprintFiles[l.lineId]})` : 'À envoyer sur WhatsApp'}`
      )
      .join('\n\n');

    const message = [
      '*NOUVELLE COMMANDE — SOLD OUT*',
      `Référence : *${ref}*`,
      '',
      '*CLIENT*',
      `Nom : ${customerName}`,
      `Téléphone : ${phone}`,
      `Pays / Ville : ${zone}`,
      `Adresse : ${address}`,
      '',
      '*ARTICLES*',
      itemsSummary,
      '',
      `*TOTAL : ${total.toLocaleString('fr-FR')} FCFA*`,
      '',
      '*NOTE DU CLIENT*',
      note.trim() || 'Aucune note spécifique',
      '',
      '— Commande initiée depuis soldout1.netlify.app',
    ].join('\n');

    const waLink = `https://wa.me/221785426344?text=${encodeURIComponent(message)}`;
    window.open(waLink, '_blank');
    clear();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[90] overflow-y-auto transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Finaliser la commande"
    >
      <div
        className="fixed inset-0 bg-[#08070a]/90 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative mx-auto my-6 w-[calc(100%-1.5rem)] max-w-3xl md:my-12">
        <div className="relative overflow-hidden rounded-3xl border so-hairline bg-[#0c0a0f]">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border so-hairline bg-[#08070a]/60 text-[#9b93a3] backdrop-blur-sm transition-colors hover:text-[#f4f1ec]"
            aria-label="Fermer"
          >
            <X size={18} />
          </button>

          {lines.length === 0 ? (
            <div className="p-8 text-center md:p-14">
              <FingerprintLogo className="mx-auto h-16 w-auto text-[#2e2736]" strokeWidth={2.4} />
              <h2 className="so-editorial mt-6 text-3xl text-[#f4f1ec]">
                Votre panier est vide
              </h2>
              <p className="mt-2 text-sm text-[#9b93a3]">
                Ajoutez une pièce avant de finaliser votre commande.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="so-btn so-btn-solid mt-8"
              >
                Parcourir la collection
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 md:p-10">
              <p className="so-label text-[#e7a3b8]">Confidential // order</p>
              <h2 className="so-editorial mt-3 text-4xl text-[#f4f1ec] md:text-5xl">
                Finaliser <em className="text-[#e7a3b8]">votre commande</em>
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-[#9b93a3]">
                Chaque pièce est personnalisée avec votre empreinte. Vous pouvez attacher une photo de votre empreinte ici ou l'envoyer directement dans le chat WhatsApp.
              </p>

              {/* Uploads per item */}
              <div className="mt-8 flex flex-col gap-4">
                <h3 className="so-label text-[#f4f1ec]">
                  Empreinte digitale par article ({lines.length})
                </h3>
                {lines.map((line) => (
                  <div
                    key={line.lineId}
                    className="flex flex-col gap-3 rounded-2xl border so-hairline bg-[#120f16] p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h4 className="so-wordmark text-base text-[#f4f1ec]">
                        {line.product.name} (Taille {line.size})
                      </h4>
                      <p className="text-xs text-[#9b93a3]">
                        {fingerprintFiles[line.lineId]
                          ? `Fichier sélectionné : ${fingerprintFiles[line.lineId]}`
                          : "Photo nette de votre empreinte digitale"}
                      </p>
                    </div>

                    <label className="so-btn so-btn-ghost cursor-pointer py-2.5 text-[0.625rem]">
                      <Upload size={13} />
                      <span>{fingerprintFiles[line.lineId] ? 'Changer la photo' : 'Charger l\'empreinte'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(line.lineId, e)}
                      />
                    </label>
                  </div>
                ))}
              </div>

              {/* Form fields */}
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="so-label text-[0.625rem] text-[#9b93a3]">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="ex. Aminata Diallo"
                    className="so-field mt-1"
                  />
                </div>

                <div>
                  <label className="so-label text-[0.625rem] text-[#9b93a3]">
                    Numéro WhatsApp / Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="ex. +221 77 123 45 67"
                    className="so-field mt-1"
                  />
                </div>

                <div>
                  <label className="so-label text-[0.625rem] text-[#9b93a3]">
                    Pays & Ville *
                  </label>
                  <input
                    type="text"
                    required
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    placeholder="ex. Dakar, Sénégal"
                    className="so-field mt-1"
                  />
                </div>

                <div>
                  <label className="so-label text-[0.625rem] text-[#9b93a3]">
                    Adresse de livraison *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="ex. Almadies, Rue 12"
                    className="so-field mt-1"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="so-label text-[0.625rem] text-[#9b93a3]">
                    Instructions ou notes spécifiques (optionnel)
                  </label>
                  <textarea
                    rows={2}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="ex. Emplacement particulier pour l'empreinte..."
                    className="so-field mt-1 resize-none"
                  />
                </div>
              </div>

              {/* Order total & Submit */}
              <div className="mt-8 flex flex-col gap-4 border-t so-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="so-label text-[0.5625rem] text-[#9b93a3]">Total de la commande</span>
                  <p className="so-wordmark text-2xl text-[#f4f1ec]">
                    {total.toLocaleString('fr-FR')} FCFA
                  </p>
                </div>

                <button
                  type="submit"
                  className="so-btn so-btn-solid so-btn-sheen"
                >
                  <MessageCircle size={16} />
                  <span>Confirmer sur WhatsApp ({WHATSAPP_PHONE})</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
