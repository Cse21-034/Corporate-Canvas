import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X, ChevronRight, ArrowUpRight } from 'lucide-react';

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

  // Every hero is now a plain light/dark-themed background except the
  // solution-detail page, which still overlays a dark gradient on its
  // service photo — that's the one unscrolled header that needs light text.
  const useLightText = location.startsWith('/solutions/') && !isScrolled && !mobileMenuOpen;

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
          ? 'bg-background/90 backdrop-blur-md border-b border-border shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="z-50" onClick={closeMenu}>
          <Logo variant={useLightText ? 'light' : 'full'} size="sm" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  active
                    ? useLightText
                      ? 'bg-white text-foreground border-white'
                      : 'bg-foreground text-background border-foreground'
                    : useLightText
                      ? 'border-white/25 text-white/90 hover:bg-white/10'
                      : 'border-border text-foreground/80 hover:bg-accent'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/portal"
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              useLightText ? 'border-white/25 text-white/90 hover:bg-white/10' : 'border-border text-foreground/80 hover:bg-accent'
            }`}
          >
            Client Portal
          </Link>
          <ThemeToggle
            className={`rounded-full border ${
              useLightText ? 'border-white/25 text-white hover:bg-white/10' : 'border-border text-foreground hover:bg-accent'
            }`}
          />
          <Link
            href="/contact"
            className="group bg-primary hover:bg-primary/90 text-primary-foreground pl-5 pr-1.5 py-1.5 rounded-full text-sm font-semibold transition-all shadow-md flex items-center gap-3"
          >
            Request a Quote
            <span className="w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 group-hover:translate-x-0.5 transition-transform">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </Link>
        </div>

        {/* Mobile Toggle — large touch target */}
        <button
          className={`md:hidden z-50 p-3 -mr-1 rounded-lg transition-colors ${useLightText ? 'hover:bg-white/10' : 'hover:bg-accent'}`}
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

            <div className="flex items-center justify-between py-4 border-b border-border">
              <span className="font-display font-semibold text-xl text-foreground">Dark Mode</span>
              <ThemeToggle className="text-foreground hover:bg-accent" />
            </div>
          </nav>

          {/* CTA */}
          <Link
            href="/contact"
            onClick={closeMenu}
            className="block w-full bg-primary hover:bg-primary/90 text-primary-foreground text-center px-8 py-4 rounded-md font-bold text-lg transition-all shadow-[0_4px_20px_rgba(201,63,13,0.4)]"
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
