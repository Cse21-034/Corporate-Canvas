import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X, ArrowUpRight, Home, Mail, User, Info, Wrench, Factory, Image } from 'lucide-react';

// The remaining links shown around the radial menu, evenly spaced starting
// from the top and going clockwise. Precomputed unit-circle offsets (not
// computed with Math.cos/sin at render time) so the layout is easy to check
// by eye: top, right, bottom, left.
const RADIAL_LINKS = [
  { href: '/about', label: 'About', icon: Info, x: 0, y: -1 },
  { href: '/solutions', label: 'Solutions', icon: Wrench, x: 1, y: 0 },
  { href: '/industries', label: 'Industries', icon: Factory, x: 0, y: 1 },
  { href: '/gallery', label: 'Gallery', icon: Image, x: -1, y: 0 },
];
const RADIAL_RADIUS = 108;

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when the radial menu is open
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
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/solutions', label: 'Solutions' },
    { href: '/industries', label: 'Industries' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) =>
    href === '/' ? location === '/' : location.startsWith(href);

  const closeMenu = () => setMobileMenuOpen(false);

  const bottomNavItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/contact', label: 'Contact', icon: Mail },
    { href: '/portal', label: 'Portal', icon: User },
  ];

  return (
    <>
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
                        : 'border-foreground dark:border-primary text-foreground/80 hover:bg-accent'
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
                useLightText ? 'border-white/25 text-white/90 hover:bg-white/10' : 'border-foreground dark:border-primary text-foreground/80 hover:bg-accent'
              }`}
            >
              Client Portal
            </Link>
            <ThemeToggle
              className={`rounded-full border ${
                useLightText ? 'border-white/25 text-white hover:bg-white/10' : 'border-foreground dark:border-primary text-foreground hover:bg-accent'
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

          {/* Mobile: just the theme toggle — navigation lives in the bottom bar */}
          <ThemeToggle
            className={`md:hidden rounded-full border ${useLightText ? 'border-white/25 text-white hover:bg-white/10' : 'border-foreground dark:border-primary text-foreground hover:bg-accent'}`}
          />
        </div>
      </header>

      {/* Mobile bottom nav — fixed, always visible while scrolling */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border flex items-center justify-around pt-2 pb-safe">
        {bottomNavItems.map((item) => {
          const active = isActive(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-1.5 text-xs font-medium transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={mobileMenuOpen}
          className="flex flex-col items-center gap-1 px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors"
        >
          <Menu className="w-5 h-5" />
          Menu
        </button>
      </nav>

      {/* Radial menu — opens from the bottom nav's Menu button, holds the
          links that don't fit in the bottom bar (About/Solutions/Industries).
          Icons sit at precomputed unit-circle offsets around a dark circle,
          scaled by RADIAL_RADIUS; a close button sits dead center. */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-[60]">
          <div className="absolute inset-0 bg-black/60 animate-in fade-in duration-200" onClick={closeMenu} />
          <div className="absolute inset-x-0 bottom-20 flex justify-center animate-in slide-in-from-bottom-8 fade-in duration-300">
            <div className="relative w-64 h-64 rounded-full bg-foreground shadow-2xl">
              {RADIAL_LINKS.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="absolute left-1/2 top-1/2 flex flex-col items-center gap-1.5 text-background"
                    style={{
                      transform: `translate(calc(-50% + ${item.x * RADIAL_RADIUS}px), calc(-50% + ${item.y * RADIAL_RADIUS}px))`,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium whitespace-nowrap">{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={closeMenu}
                aria-label="Close menu"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background text-foreground flex items-center justify-center shadow-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
