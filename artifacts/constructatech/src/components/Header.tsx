import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Logo } from './Logo';
import { Menu, X, ChevronRight } from 'lucide-react';

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  // Pages whose hero sits on a dark background, so the unscrolled header
  // needs light text. Nested routes (e.g. /solutions/:slug) match too.
  const darkHeroPaths = ['/', '/about', '/solutions', '/industries', '/contact'];
  const isDarkHero = darkHeroPaths.some(
    (path) => location === path || (path !== '/' && location.startsWith(`${path}/`)),
  );
  const useLightText = isDarkHero && !isScrolled && !mobileMenuOpen;

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/solutions', label: 'Solutions' },
    { href: '/industries', label: 'Industries' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) =>
    href === '/' ? location === '/' : location.startsWith(href);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-border shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="z-50" onClick={closeMenu}>
          <Logo variant={useLightText ? 'light' : 'full'} size="sm" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors relative group ${
                useLightText ? 'text-white/90 hover:text-white' : 'text-foreground/80 hover:text-foreground'
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
                isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
              } ${useLightText ? 'bg-white' : 'bg-primary'}`} />
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/portal"
            className={`text-sm font-medium transition-colors ${
              useLightText ? 'text-white hover:text-white/80' : 'text-foreground hover:text-primary'
            }`}
          >
            Client Portal
          </Link>
          <Link
            href="/contact"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-md text-sm font-semibold transition-all hover:-translate-y-0.5 shadow-md"
          >
            Request a Quote
          </Link>
        </div>

        {/* Mobile Toggle — large touch target */}
        <button
          className="md:hidden z-50 p-3 -mr-1 rounded-lg hover:bg-white/10 transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? (
            <X className="text-foreground w-6 h-6" />
          ) : (
            <Menu className={`${useLightText ? 'text-white' : 'text-foreground'} w-6 h-6`} />
          )}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 bg-background z-40 transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Top padding spacer so content clears the header */}
        <div className="h-[68px] shrink-0" />

        <div className="flex-1 overflow-y-auto px-6 pt-6 pb-10">
          {/* Primary nav */}
          <nav className="flex flex-col mb-8">
            {navLinks.map((link, i) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className={`flex items-center justify-between py-4 font-display font-semibold text-xl border-b border-border transition-colors ${
                    active ? 'text-primary' : 'text-foreground'
                  } ${i === 0 ? 'border-t' : ''}`}
                >
                  {link.label}
                  {active && <span className="w-2 h-2 rounded-full bg-primary" />}
                </Link>
              );
            })}

            <Link
              href="/portal"
              onClick={closeMenu}
              className="flex items-center justify-between py-4 font-display font-semibold text-xl border-b border-border text-foreground transition-colors"
            >
              Client Portal
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </nav>

          {/* CTA */}
          <Link
            href="/contact"
            onClick={closeMenu}
            className="block w-full bg-primary hover:bg-primary/90 text-primary-foreground text-center px-8 py-4 rounded-md font-bold text-lg transition-all shadow-[0_4px_20px_rgba(242,106,75,0.4)]"
          >
            Request a Quote
          </Link>

          {/* Contact strip */}
          <div className="mt-10 space-y-3 text-sm text-muted-foreground border-t border-border pt-8">
            <a href="tel:+26774259012" className="flex items-center gap-3 hover:text-primary transition-colors">
              <span className="font-mono-label text-xs">CALL</span>
              <span className="font-medium text-foreground">+267 74 259 012</span>
            </a>
            <a href="mailto:info@constructech.co.bw" className="flex items-center gap-3 hover:text-primary transition-colors">
              <span className="font-mono-label text-xs">EMAIL</span>
              <span className="font-medium text-foreground">info@constructech.co.bw</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
