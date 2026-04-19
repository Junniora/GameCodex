'use client';
// app/(auth)/verify/page.tsx
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { Mail, Sun, Moon, ArrowRight } from 'lucide-react';

export default function VerifyPage() {
  const { t, toggleTheme, theme } = useAppStore();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, rgba(10,132,255,0.15) 0%, transparent 60%), radial-gradient(ellipse at 80% 80%, rgba(191,90,242,0.1) 0%, transparent 50%)',
          willChange: 'transform',
          transform: 'translateZ(0)'
        }}
      />

      {/* Top bar */}
      <div className="fixed top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <button
          onClick={toggleTheme}
          className="group p-2 rounded-lg hover:bg-tertiary transition-colors text-sm"
        >
          <div className="transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-[360deg]">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </div>
        </button>
      </div>

      {/* Card */}
      <div
        className="glass rounded-3xl p-8 w-full max-w-md animate-scaleIn text-center"
        style={{ animationFillMode: 'both' }}
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center">
            <Mail className="w-10 h-10 text-blue-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-3">{t('auth.verifyTitle') || 'Revisa tu correo'}</h1>
        <p className="text-sm text-muted mb-8 leading-relaxed">
          {t('auth.verifySubtitle') || 'Te hemos enviado un enlace de confirmación. Haz clic en él para activar tu cuenta y poder iniciar sesión.'}
        </p>

        <Link
          href="/login"
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {t('auth.backToLogin') || 'Volver a Iniciar Sesión'}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
