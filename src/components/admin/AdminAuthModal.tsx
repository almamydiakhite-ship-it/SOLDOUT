import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, AlertCircle, X } from 'lucide-react';
import { FingerprintLogo } from '../FingerprintLogo';
import { adminAuthService } from '../../services/adminAuthService';

interface AdminAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: () => void;
}

export default function AdminAuthModal({
  isOpen,
  onClose,
  onAuthenticated,
}: AdminAuthModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  useEffect(() => {
    if (!isOpen) {
      setPassword('');
      setError(null);
      return;
    }

    const checkLockout = () => {
      const remaining = adminAuthService.getRemainingLockoutSeconds();
      setLockoutRemaining(remaining);
      if (remaining > 0) {
        setError(`Accès verrouillé temporairement. Patientez ${remaining}s.`);
      }
    };

    checkLockout();
    const interval = setInterval(checkLockout, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Veuillez entrer votre mot de passe administrateur.');
      return;
    }

    const result = adminAuthService.login(password);
    if (result.success) {
      setError(null);
      setPassword('');
      onAuthenticated();
    } else {
      setError(result.error || 'Erreur de connexion');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300"
      role="dialog"
      aria-modal="true"
      aria-label="Accès Administrateur Sécurisé"
    >
      <div
        className="fixed inset-0 bg-[#08070a]/92 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border so-hairline bg-[#0c0a0f] p-8 text-[#f4f1ec] shadow-2xl shadow-black/80">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border so-hairline text-[#9b93a3] transition-colors hover:text-[#f4f1ec]"
          aria-label="Fermer"
        >
          <X size={18} />
        </button>

        {/* Header with fingerprint seal and shield */}
        <div className="flex flex-col items-center text-center">
          <div className="relative grid h-16 w-16 place-items-center rounded-2xl border so-hairline bg-[#16121c]">
            <FingerprintLogo className="h-10 w-auto text-[#e7a3b8]" strokeWidth={2.4} />
            <span className="absolute -bottom-1 -right-1 grid h-6 w-6 place-items-center rounded-full bg-[#d62a4f] text-white shadow-md">
              <Lock size={12} strokeWidth={2.6} />
            </span>
          </div>

          <p className="so-label mt-5 text-[0.625rem] text-[#e7a3b8] tracking-widest uppercase">
            Accès Protégé
          </p>
          <h2 className="so-wordmark mt-1 text-2xl text-[#f4f1ec]">
            Espace Administrateur
          </h2>
          <p className="mt-2 text-xs leading-relaxed text-[#9b93a3]">
            Gestion des visiteurs, des commandes clients et du catalogue Sold Out.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4">
          <div>
            <label
              htmlFor="admin-password"
              className="so-label block text-[0.625rem] text-[#9b93a3]"
            >
              Mot de passe administrateur
            </label>
            <div className="relative mt-2">
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                autoFocus
                disabled={lockoutRemaining > 0}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="Entrez votre mot de passe..."
                className="w-full rounded-xl border so-hairline bg-[#141019] px-4 py-3.5 pr-11 text-sm text-[#f4f1ec] placeholder-[#5d5666] outline-none transition-colors focus:border-[#e7a3b8] disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#9b93a3] hover:text-[#f4f1ec]"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-[#d62a4f]/30 bg-[#d62a4f]/10 p-3 text-xs text-[#fca5a5]">
              <AlertCircle size={15} className="mt-0.5 shrink-0 text-[#d62a4f]" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick hint for first login */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-center">
            <p className="text-[0.6875rem] text-[#9b93a3]">
              🔑 Mot de passe par défaut : <span className="font-mono text-[#e7a3b8]">soldout2026</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={lockoutRemaining > 0}
            className="so-btn so-btn-solid so-btn-sheen mt-2 w-full py-3.5 text-xs disabled:opacity-50"
          >
            <ShieldCheck size={16} strokeWidth={2.4} /> Déverrouiller le Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
