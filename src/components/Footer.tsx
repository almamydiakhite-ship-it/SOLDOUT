import React from 'react';
import { Instagram, Phone, Lock } from 'lucide-react';
import FingerprintLogo from './FingerprintLogo';
import { products, WHATSAPP_URL, WHATSAPP_PHONE } from '../data/products';

// TikTok custom SVG icon matching Lucide style
function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );
}

const socialLinks = [
  {
    label: 'Instagram',
    href: 'https://instagram.com/soldout.sn',
    icon: Instagram,
  },
  {
    label: 'TikTok',
    href: 'https://tiktok.com/@soldout.sn',
    icon: TikTokIcon,
  },
  {
    label: 'WhatsApp',
    href: WHATSAPP_URL,
    icon: Phone,
  },
];

interface FooterProps {
  onOpenAdmin?: () => void;
}

export default function Footer({ onOpenAdmin }: FooterProps = {}) {
  return (
    <footer id="contact" className="scroll-mt-24 border-t so-hairline bg-[#08070a]">
      <div className="mx-auto max-w-[1400px] px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr] md:gap-8">
          {/* Brand & Wordmark & Phrase modifiée */}
          <div>
            <div className="flex items-center gap-3">
              <FingerprintLogo className="h-9 w-auto text-[#e7a3b8]" strokeWidth={2.4} />
              <span className="so-wordmark text-2xl text-[#f4f1ec]">Sold Out</span>
            </div>

            {/* Phrase modifiée comme demandée :
                "Quatre pièces, une lettre et une empreinte : la tienne. Drop 01 — The Letter, écrit à Dakar, porté partout dans le monde." */}
            <p className="so-editorial mt-5 max-w-sm text-lg leading-relaxed text-[#9b93a3]">
              Quatre pièces, une lettre et une empreinte : la tienne. Drop 01 — The Letter, écrit à Dakar, porté partout dans le monde.
            </p>

            <div className="mt-7 flex items-center gap-2.5">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="grid h-11 w-11 place-items-center rounded-full border so-hairline text-[#9b93a3] transition-colors duration-300 hover:border-[#e7a3b8]/60 hover:text-[#e7a3b8]"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <nav aria-label="Collection">
            <h2 className="so-label text-[#f4f1ec]">Collection</h2>
            <ul className="mt-5 flex flex-col gap-3.5">
              <li>
                <a
                  href="#collection"
                  className="text-sm text-[#9b93a3] transition-colors duration-300 hover:text-[#e7a3b8]"
                >
                  Toutes les pièces
                </a>
              </li>
              {products.map((p) => (
                <li key={p.id}>
                  <a
                    href="#collection"
                    className="text-sm text-[#9b93a3] transition-colors duration-300 hover:text-[#e7a3b8]"
                  >
                    {p.name}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#lettre"
                  className="text-sm text-[#9b93a3] transition-colors duration-300 hover:text-[#e7a3b8]"
                >
                  The Letter
                </a>
              </li>
              <li>
                <a
                  href="#histoire"
                  className="text-sm text-[#9b93a3] transition-colors duration-300 hover:text-[#e7a3b8]"
                >
                  Notre histoire
                </a>
              </li>
            </ul>
          </nav>

          {/* Commander Info */}
          <div>
            <h2 className="so-label text-[#f4f1ec]">Commander</h2>
            <p className="mt-5 text-sm leading-relaxed text-[#9b93a3]">
              Les commandes se confirment sur WhatsApp. Envoie ton panier, on revient vers toi avec le délai de livraison.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="so-wordmark mt-4 block text-xl text-[#f4f1ec] transition-colors duration-300 hover:text-[#e7a3b8]"
            >
              {WHATSAPP_PHONE}
            </a>

            <dl className="mt-7 flex flex-col gap-4">
              <div>
                <dt className="so-label text-[0.5625rem] text-[#6d6577]">Livraison</dt>
                <dd className="mt-1 text-sm text-[#9b93a3]">Partout dans le monde</dd>
              </div>
              <div>
                <dt className="so-label text-[0.5625rem] text-[#6d6577]">Paiement</dt>
                <dd className="mt-1 text-sm text-[#9b93a3]">
                  Confirmé sur WhatsApp, rien à payer sur le site
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t so-hairline pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="so-label text-[0.5625rem] text-[#6d6577]">
            © {new Date().getFullYear()} Sold Out — Tous droits réservés
          </p>
          <div className="flex items-center gap-4">
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="so-label flex items-center gap-1.5 text-[0.5625rem] text-[#6d6577] transition-colors hover:text-[#e7a3b8] cursor-pointer"
              >
                <Lock size={10} /> Espace Administrateur
              </button>
            )}
            <p className="so-label text-[0.5625rem] text-[#6d6577]">
              Uniqueness is identity
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
