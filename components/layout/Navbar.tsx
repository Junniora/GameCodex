'use client';
// components/layout/Navbar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/lib/hooks/useAuth';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navbar() {
  const { t, toggleTheme, theme } = useAppStore();
  const { user, signOut } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: '/hub', label: t('nav.hub'), icon: '🏠' },
    { href: '/games', label: t('nav.games'), icon: '🎮' },
    { href: '/favorites', label: t('nav.favorites'), icon: '⭐' },
    { href: '/admin', label: t('nav.admin'), icon: '⚙️' },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-subtle"
      style={{ borderBottomColor: 'var(--glass-border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/hub"
          className="flex items-center gap-2 font-bold text-lg"
        >
          <span className="text-2xl">🎮</span>
          <span className="text-gradient font-extrabold tracking-tight">
            GameHub
          </span>
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${isActive(href)
                  ? 'bg-tertiary text-primary'
                  : 'text-muted hover:bg-tertiary hover:text-primary'
                }
              `}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side: language + theme + user */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-tertiary transition-colors"
            title={theme === 'dark' ? t('common.lightMode') : t('common.darkMode')}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* User menu */}
          {user && (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tertiary">
                <span className="text-sm">👤</span>
                <span className="text-sm text-muted truncate max-w-[120px]">
                  {user.email?.split('@')[0]}
                </span>
              </div>
              <button
                onClick={signOut}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-muted hover:bg-tertiary hover:text-primary transition-all"
              >
                {t('nav.logout')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex items-center justify-around px-4 py-2 border-t border-subtle">
        {navLinks.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`
              flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs
              transition-all duration-200
              ${isActive(href)
                ? 'text-blue-400'
                : 'text-muted'
              }
            `}
          >
            <span className="text-lg">{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </header>
  );
}
