import React, { useState, useRef } from 'react';
import { X, Upload, CheckCircle2, MessageCircle, AlertCircle, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import FingerprintLogo from './FingerprintLogo';
import FingerprintScanner from './FingerprintScanner';
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

  // Biometric touch scanner state
  const [biometricScan, setBiometricScan] = useState<{
    scanned: boolean;
    certificateId: string;
    timestamp: string;
    method: 'touch' | 'upload';
    fileName?: string;
  }>({
    scanned: false,
    certificateId: '',
    timestamp: '',
    method: 'touch',
  });

  const [scannerError, setScannerError] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);

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

  const handleScanComplete = (scanData: {
    scanned: boolean;
    certificateId: string;
    timestamp: string;
    method: 'touch' | 'upload';
    fileName?: string;
  }) => {
    setBiometricScan(scanData);
    if (scanData.scanned) {
      setScannerError(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Verify customer scanned their fingerprint before submitting
    if (!biometricScan.scanned) {
      setScannerError(true);
      scannerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    const ref = `SO-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    const itemsSummary = lines
      .map(
        (l, i) =>
          `${i + 1}. ${l.product.name} (Ch. ${l.product.chapterNo})\n   Taille: ${l.size} · Quantité: ${l.quantity} · ${(l.lineTotal).toLocaleString('fr-FR')} FCFA\n   Empreinte: ${
            fingerprintFiles[l.lineId]
              ? `Photo (${fingerprintFiles[l.lineId]})`
              : `Scannée via touche d'empreinte (${biometricScan.certificateId})`
          }`
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
      '*SIGNATURE BIOMÉTRIQUE CLIENT*',
      `Statut : Empreinte authentifiée via Touche d'Empreinte ✓`,
      `Certificat biométrique : ${biometricScan.certificateId}`,
      `Horodatage : ${biometricScan.timestamp}`,
      biometricScan.fileName ? `Fichier joint : ${biometricScan.fileName}` : '',
      '',
      '*ARTICLES COMMANDÉS*',
      itemsSummary,
      '',
      `*TOTAL : ${total.toLocaleString('fr-FR')} FCFA*`,
      '',
      '*NOTE DU CLIENT*',
      note.trim() || 'Aucune note spécifique',
      '',
      '— Commande authentifiée depuis soldout1.netlify.app',
    ]
      .filter(Boolean)
      .join('\n');

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
      <div className="relative mx-auto my-6 w-[calc(100%-1.5rem)] max-w-2xl md:my-16">
        <div className="relative overflow-hidden rounded-3xl border so-hairline bg-[#0c0a0f] text-[#f4f1ec] shadow-2xl">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border so-hairline text-[#9b93a3] transition-colors hover:text-[#f4f1ec]"
            aria-label="Fermer la fenêtre"
          >
            <X size={18} />
          </button>

          {lines.length === 0 ? (
            <div className="p-10 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border so-hairline bg-[#100d14]">
                <FingerprintLogo className="h-7 w-auto text-[#9b93a3]" strokeWidth={2.4} />
              </div>
              <h2 className="so-wordmark mt-4 text-2xl text-[#f4f1ec]">
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
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-[#e7a3b8]" />
                <p className="so-label text-[#e7a3b8]">Signature & Commande</p>
              </div>

              <h2 className="so-editorial mt-3 text-4xl text-[#f4f1ec] md:text-5xl">
                Finaliser <em className="text-[#e7a3b8]">votre commande</em>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#9b93a3]">
                Chaque pièce Sold Out est personnalisée avec votre empreinte digitale. Scannez votre empreinte sur la touche ci-dessous avant d'envoyer votre commande sur WhatsApp.
              </p>

              {/* TOUCHE D'EMPREINTE BIOMÉTRIQUE AVANT DE VALIDER */}
              <div ref={scannerRef} className="mt-8 scroll-mt-20">
                <FingerprintScanner
                  onScanComplete={handleScanComplete}
                  initialCertificateId={biometricScan.certificateId}
                  className={scannerError ? 'border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]' : ''}
                />

                {scannerError && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-2.5 text-xs text-rose-300">
                    <AlertCircle size={16} className="shrink-0 text-rose-400" />
                    <span>
                      Veuillez poser votre doigt sur la touche d'empreinte ci-dessus pour authentifier votre pièce unique avant de valider.
                    </span>
                  </div>
                )}
              </div>

              {/* Form fields */}
              <div className="mt-8 border-t so-hairline pt-8">
                <h3 className="so-label text-[#f4f1ec]">
                  Coordonnées de livraison
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
              </div>

              {/* Order total & Submit */}
              <div className="mt-8 flex flex-col gap-4 border-t so-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="so-label text-[0.5625rem] text-[#9b93a3]">Total de la commande</span>
                  <p className="so-wordmark text-2xl text-[#f4f1ec]">
                    {total.toLocaleString('fr-FR')} FCFA
                  </p>
                  {biometricScan.scanned && (
                    <span className="mt-1 flex items-center gap-1 text-[0.625rem] text-[#4ade80]">
                      <CheckCircle2 size={11} /> Empreinte validée ({biometricScan.certificateId})
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  className={`so-btn so-btn-sheen ${
                    biometricScan.scanned
                      ? 'so-btn-solid shadow-[0_0_20px_rgba(231,163,184,0.3)]'
                      : 'border border-[#e7a3b8] text-[#e7a3b8] hover:bg-[#e7a3b8]/10'
                  }`}
                >
                  <MessageCircle size={16} />
                  <span>
                    {biometricScan.scanned
                      ? `Confirmer sur WhatsApp (${WHATSAPP_PHONE})`
                      : 'Scanner l\'empreinte & Valider'}
                  </span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
