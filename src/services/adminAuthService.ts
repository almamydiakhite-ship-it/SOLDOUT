const ADMIN_PASSWORD_KEY = 'soldout.admin.password.v2';
const ADMIN_TOKEN_KEY = 'soldout.admin.token.v2';
const FAILED_ATTEMPTS_KEY = 'soldout.admin.failed_attempts';
const LOCKOUT_TIMESTAMP_KEY = 'soldout.admin.lockout_until';

const DEFAULT_MASTER_PASSWORD = 'soldout2026';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 1000; // 30 seconds

export const adminAuthService = {
  getPassword(): string {
    return localStorage.getItem(ADMIN_PASSWORD_KEY) || DEFAULT_MASTER_PASSWORD;
  },

  getRemainingLockoutSeconds(): number {
    const lockoutUntil = parseInt(localStorage.getItem(LOCKOUT_TIMESTAMP_KEY) || '0', 10);
    const now = Date.now();
    if (lockoutUntil > now) {
      return Math.ceil((lockoutUntil - now) / 1000);
    }
    return 0;
  },

  isAuthenticated(): boolean {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY);
    if (!token) return false;
    try {
      const data = JSON.parse(token);
      // Valid if less than 12 hours old
      return Date.now() - data.timestamp < 12 * 60 * 60 * 1000;
    } catch {
      return false;
    }
  },

  login(passwordInput: string): { success: boolean; error?: string } {
    const lockout = this.getRemainingLockoutSeconds();
    if (lockout > 0) {
      return {
        success: false,
        error: `Accès temporairement bloqué suite à des erreurs répétées. Réessayez dans ${lockout}s.`,
      };
    }

    const currentPassword = this.getPassword();

    if (passwordInput.trim() === currentPassword) {
      // Clear failed attempts
      localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      localStorage.removeItem(LOCKOUT_TIMESTAMP_KEY);

      // Set token
      const sessionData = {
        authenticated: true,
        timestamp: Date.now(),
        role: 'SUPER_ADMIN',
      };
      sessionStorage.setItem(ADMIN_TOKEN_KEY, JSON.stringify(sessionData));
      return { success: true };
    }

    // Handle failure
    const currentFailed = parseInt(localStorage.getItem(FAILED_ATTEMPTS_KEY) || '0', 10) + 1;
    localStorage.setItem(FAILED_ATTEMPTS_KEY, currentFailed.toString());

    if (currentFailed >= MAX_FAILED_ATTEMPTS) {
      const lockUntil = Date.now() + LOCKOUT_DURATION_MS;
      localStorage.setItem(LOCKOUT_TIMESTAMP_KEY, lockUntil.toString());
      return {
        success: false,
        error: `Trop de tentatives incorrectes (${currentFailed}/${MAX_FAILED_ATTEMPTS}). Accès bloqué pendant 30 secondes.`,
      };
    }

    return {
      success: false,
      error: `Mot de passe incorrect (${currentFailed}/${MAX_FAILED_ATTEMPTS} tentatives).`,
    };
  },

  logout(): void {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
  },

  changePassword(oldPassword: string, newPassword: string): { success: boolean; error?: string } {
    if (oldPassword.trim() !== this.getPassword()) {
      return { success: false, error: 'Ancien mot de passe incorrect.' };
    }
    if (!newPassword || newPassword.trim().length < 6) {
      return { success: false, error: 'Le nouveau mot de passe doit comporter au moins 6 caractères.' };
    }

    localStorage.setItem(ADMIN_PASSWORD_KEY, newPassword.trim());
    return { success: true };
  },
};
