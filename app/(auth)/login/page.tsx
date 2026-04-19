'use client';
// app/(auth)/login/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/store/useAppStore';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { Gamepad2, Sun, Moon, AlertTriangle } from 'lucide-react';

export default function LoginPage() {
  const { t, toggleTheme, theme } = useAppStore();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(t('auth.errors.invalidCredentials'));
      setLoading(false);
    } else {
      router.push('/hub');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(0,122,255,0.15) 0%, transparent 70%), radial-gradient(ellipse at 80% 80%, rgba(191,90,242,0.1) 0%, transparent 50%)',
        }}
      />

      {/* Top bar */}
      <div className="fixed top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-tertiary transition-colors text-sm"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Card */}
      <div
        className="glass rounded-3xl p-8 w-full max-w-md animate-scaleIn"
        style={{ animationFillMode: 'both' }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <Gamepad2 className="w-12 h-12 text-blue-500" />
          </div>
          <h1 className="text-2xl font-bold mb-1">{t('auth.loginTitle')}</h1>
          <p className="text-sm text-muted">{t('auth.loginSubtitle')}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">
              {t('auth.email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.emailPlaceholder')}
              className="input-apple"
              required
              autoFocus
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium">
                {t('auth.password')}
              </label>
              <Link
                href="#"
                className="text-xs text-blue-400 hover:underline"
              >
                {t('auth.forgotPassword')}
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.passwordPlaceholder')}
              className="input-apple"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fadeIn">
              <AlertTriangle className="w-4 h-4" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full mt-2"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t('auth.loggingIn')}
              </span>
            ) : (
              t('auth.login')
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-sm text-muted mt-6">
          {t('auth.noAccount')}{' '}
          <Link href="/register" className="text-blue-400 font-medium hover:underline">
            {t('auth.register')}
          </Link>
        </p>
      </div>
    </div>
  );
}
