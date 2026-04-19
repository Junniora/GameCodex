'use client';
// app/(auth)/register/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/store/useAppStore';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';

export default function RegisterPage() {
  const { t, toggleTheme, theme } = useAppStore();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError(t('auth.errors.weakPassword'));
      return;
    }
    setLoading(true);
    setError('');

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/hub`,
      },
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        setError(t('auth.errors.emailInUse'));
      } else {
        setError(t('auth.errors.generic'));
      }
      setLoading(false);
    } else {
      router.push('/hub');
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(191,90,242,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(0,122,255,0.1) 0%, transparent 50%)',
        }}
      />

      <div className="fixed top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-tertiary transition-colors text-sm">
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </div>

      <div className="glass rounded-3xl p-8 w-full max-w-md animate-scaleIn" style={{ animationFillMode: 'both' }}>
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🚀</div>
          <h1 className="text-2xl font-bold mb-1">{t('auth.registerTitle')}</h1>
          <p className="text-sm text-muted">{t('auth.registerSubtitle')}</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">{t('auth.email')}</label>
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
            <label className="block text-sm font-medium mb-1.5">{t('auth.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('auth.passwordPlaceholder')}
              className="input-apple"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fadeIn">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t('auth.registering')}
              </span>
            ) : t('auth.register')}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-6">
          {t('auth.hasAccount')}{' '}
          <Link href="/login" className="text-blue-400 font-medium hover:underline">
            {t('auth.login')}
          </Link>
        </p>
      </div>
    </div>
  );
}
