'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import A11yControls from '@/components/accessibility/A11yControls';

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isSession = pathname === '/session';

  const navLinks = [
    { href: '/', label: 'Home', show: !isHome },
    { href: '/session', label: 'Live Session', show: true },
    // Disabled: { href: '/upload', label: 'Upload', show: true },
    { href: '/sessions', label: 'Saved', show: true },
  ];

  const visibleLinks = navLinks.filter(l => l.show);

  const headerClasses = isSession
    ? 'sticky top-0 z-50 bg-white/85 backdrop-blur-lg border-b border-gray-100 is-session'
    : 'sticky top-0 z-50 bg-white/85 backdrop-blur-lg border-b border-gray-100';

  const logoTextClass = 'text-gray-900';

  return (
    <header className={headerClasses} role="banner">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
        <Link
          href="/"
          className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg p-1"
          aria-label="ClearBridge home"
        >
          {/* Colored diamond logo */}
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm shadow-indigo-200">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className={`font-extrabold text-base tracking-tight ${logoTextClass}`}>
            ClearBridge
          </span>
        </Link>

        <nav
          className="hidden sm:flex items-center gap-2"
          aria-label="Main navigation"
        >
          {visibleLinks.map((link) => {
            const active = pathname === link.href;
            const baseClasses =
              'px-4 py-1.5 rounded-full text-sm font-semibold border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500';
            const activeClasses =
              'bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-transparent shadow-sm';
            const inactiveClasses =
              'text-gray-900 border-gray-400 hover:bg-gray-50 hover:border-gray-600';
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <A11yControls />
      </div>
    </header>
  );
}
