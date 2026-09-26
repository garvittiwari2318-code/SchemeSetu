import { useEffect, useState } from 'react';
import { AlertTriangle, LockKeyhole, ShieldCheck, X } from 'lucide-react';
import { login, register } from '../api/auth';
import type { AuthUser } from '../api/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthenticated }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response =
        mode === 'login'
          ? await login({
            email: email.trim(),
            password,
          })
          : await register({
            name: name.trim(),
            email: email.trim(),
            password,
          });
      if (!response.success || !response.data) {
        throw new Error('Authentication could not be completed.');
      }
      onAuthenticated(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[#001d37]/45 px-4 py-6">
      <div className="w-full max-w-md rounded-xl bg-[#fbf9f3] border border-[#c3c6ce]/60 shadow-2xl overflow-hidden">
        <div className="bg-[#16324F] px-6 py-5 text-white flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-wider font-bold text-white/80">
              <ShieldCheck className="w-4 h-4" /> Secure citizen account
            </div>
            <h2 className="mt-1 text-xl font-bold">{mode === 'login' ? 'Sign in to SchemeSetu' : 'Create your SchemeSetu account'}</h2>
            <p className="mt-1 text-xs text-white/75">Required only to save and track an application.</p>
          </div>
          <button type="button" onClick={onClose} className="p-1 rounded hover:bg-white/10 cursor-pointer" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={submit} className="p-6 space-y-4">
          {mode === 'register' && (
            <label className="block">
              <span className="block text-xs font-bold text-[#43474d] mb-1">Full name</span>
              <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name"
                className="w-full px-3 py-2.5 rounded-lg border border-[#c3c6ce] bg-white text-sm outline-none focus:border-[#16324F]" />
            </label>
          )}

          <label className="block">
            <span className="block text-xs font-bold text-[#43474d] mb-1">Email address</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
              className="w-full px-3 py-2.5 rounded-lg border border-[#c3c6ce] bg-white text-sm outline-none focus:border-[#16324F]" />
          </label>

          <label className="block">
            <span className="block text-xs font-bold text-[#43474d] mb-1">Password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              className="w-full px-3 py-2.5 rounded-lg border border-[#c3c6ce] bg-white text-sm outline-none focus:border-[#16324F]" />
          </label>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-[#fff0ee] border border-[#C0392B]/20 text-xs text-[#7f241c]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <button type="submit" disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#16324F] text-white text-sm font-bold hover:bg-[#10243a] disabled:opacity-60 cursor-pointer disabled:cursor-not-allowed">
            <LockKeyhole className="w-4 h-4" />
            {isSubmitting ? 'Please wait…' : mode === 'login' ? 'Sign in securely' : 'Create account'}
          </button>

          <div className="text-center text-xs text-[#43474d]">
            {mode === 'login' ? 'New to SchemeSetu?' : 'Already have an account?'}{' '}
            <button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
              className="font-bold text-[#16324F] hover:underline cursor-pointer">
              {mode === 'login' ? 'Create an account' : 'Sign in'}
            </button>
          </div>

          <p className="text-[11px] leading-relaxed text-[#74777e] border-t border-[#c3c6ce]/30 pt-3">
            SchemeSetu evaluates eligibility on the server. Your account is used to associate applications with you and track their status.
          </p>
        </form>
      </div>
    </div>
  );
};
