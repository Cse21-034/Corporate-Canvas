import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Logo } from './Logo';
import { Menu, X } from 'lucide-react';

export function Header() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine if we need light text based on current route
  const isDarkHero = location === '/' || location === '/about' || location.startsWith('/solutions/');
  const useLightText = isDarkHero && !isScrolled && !mobileMenuOpen;

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/solutions', label: 'Solutions' },
    { href: '/industries', label: 'Industries' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md border-b border-border shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <Link href="/" className="z-50">
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
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                useLightText ? 'bg-white' : 'bg-primary'
              }`}></span>
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

        {/* Mobile Toggle */}
        <button 
          className="md:hidden z-50 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="text-foreground w-6 h-6" />
          ) : (
            <Menu className={`${useLightText ? 'text-white' : 'text-foreground'} w-6 h-6`} />
          )}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <div className={`fixed inset-0 bg-background/95 backdrop-blur-sm z-40 transition-transform duration-300 md:hidden flex flex-col pt-24 px-6 ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <nav className="flex flex-col gap-6 text-xl font-display">
          {navLinks.map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className="text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="w-full h-px bg-border my-2"></div>
          <Link 
            href="/portal" 
            className="text-foreground"
            onClick={() => setMobileMenuOpen(false)}
          >
            Client Portal
          </Link>
          <Link 
            href="/contact"
            className="text-primary mt-2"
            onClick={() => setMobileMenuOpen(false)}
          >
            Request a Quote
          </Link>
        </nav>
      </div>
    </header>
  );
}
