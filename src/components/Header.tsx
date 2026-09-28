import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, Lock } from 'lucide-react';
import { FingerprintLogo } from './FingerprintLogo';
import { useCart } from '../context/CartContext';
import { WHATSAPP_URL } from '../data/products';

interface HeaderProps {
  onOpenCart?: () => void;
  onOpenAdmin?: () => void;
}

const NAV_LINKS = [
  { label: 'Accueil', href: '#top' },
  { label: 'Produits', href: '#collection' },
  { label: 'La lettre', href: '#lettre' },
  { label: 'Notre histoire', href: '#histoire' },
  { label: 'Contact', href: '#contact' },
];

export const Header: React.FC<HeaderProps> = ({ onOpenCart, onOpenAdmin }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { count, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 border-b ${
        isScrolled
          ? 'bg-ink-950/90 backdrop-blur-md border-bone/10 shadow-lg'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-5 py-4 md:px-10">
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="-ml-2 p-2 text-bone/80 transition-colors hover:text-rose lg:hidden"
          aria-label={isMobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Brand logo */}
        <a
          href="#top"
          className="group flex items-center gap-3 transition-opacity duration-300 hover:opacity-95"
          aria-label="SOLD OUT — accueil"
        >
          <FingerprintLogo
            className="h-8 w-auto text-bone transition-colors duration-500 group-hover:text-rose"
            strokeWidth={2.6}
          />
          <span className="flex flex-col">
            <span className="so-wordmark text-xl leading-none text-bone md:text-2xl tracking-wide">
              Sold Out
            </span>
            <span className="so-label mt-1 hidden text-[0.5rem] text-fog sm:block">
              Détermine ton unicité
            </span>
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="ml-auto hidden items-center gap-8 lg:flex" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="so-label text-fog transition-colors duration-300 hover:text-bone text-[0.6875rem]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right action buttons */}
        <div className="ml-auto flex items-center gap-2 lg:ml-8">
          {/* Admin discreet button */}
          {onOpenAdmin && (
            <button
              type="button"
              onClick={onOpenAdmin}
              className="grid h-9 w-9 place-items-center rounded-full border so-hairline text-fog/80 transition-colors hover:border-rose/60 hover:text-rose cursor-pointer"
              title="Espace Administrateur Sécurisé"
              aria-label="Espace Administrateur"
            >
              <Lock size={14} />
            </button>
          )}

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="so-label hidden rounded-full border so-hairline px-4 py-2.5 text-fog transition-colors duration-300 hover:border-rose/60 hover:text-rose md:block text-[0.625rem]"
          >
            WhatsApp
          </a>

          <button
            type="button"
            onClick={onOpenCart || openCart}
            className="relative flex items-center gap-2.5 rounded-full bg-bone px-4 py-2.5 text-ink-950 transition-colors duration-300 hover:bg-rose cursor-pointer"
            aria-label={`Ouvrir le panier (${count} article${count > 1 ? 's' : ''})`}
          >
            <ShoppingBag size={16} strokeWidth={2.2} />
            <span className="so-label text-[0.625rem] text-ink-950">Panier</span>
            <span
              className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[0.6875rem] font-bold tabular-nums transition-colors ${
                count > 0 ? 'bg-ink-950 text-bone' : 'bg-ink-950/10 text-ink-950/60'
              }`}
            >
              {count}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <nav
        className={`grid overflow-hidden border-t so-hairline bg-ink-950/95 backdrop-blur-lg transition-all duration-500 lg:hidden ${
          isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 border-transparent opacity-0 pointer-events-none'
        }`}
        aria-label="Menu mobile"
      >
        <div className="flex flex-col px-5 py-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="so-label border-b so-hairline py-4 text-fog last:border-b-0 hover:text-bone text-[0.75rem]"
            >
              {link.label}
            </a>
          ))}
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="so-label py-4 text-rose text-[0.75rem]"
          >
            WhatsApp (+221 78 542 63 44)
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
