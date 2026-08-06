import React from 'react';
import { Link } from 'wouter';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-background text-foreground border-t border-border">
      <div className="spectrum-rule w-full" />

      <div className="container mx-auto px-4 md:px-6 pt-12 md:pt-16 pb-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16">
          {/* Brand */}
          <div className="md:col-span-2">
            <Logo variant="full" size="md" />
            <p className="mt-5 text-muted-foreground max-w-sm text-sm leading-relaxed">
              Empowering Botswana Through Smart Infrastructure. We don't just install hardware; we build the digital backbone for your success.
            </p>
          </div>

          {/* Nav + Contact side-by-side on mobile, separate columns on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-0 md:col-span-2 md:grid-flow-col md:auto-cols-fr">
            <div>
              <h3 className="font-mono-label mb-4 md:mb-6 text-foreground text-xs">NAVIGATION</h3>
              <ul className="space-y-3 md:space-y-4 text-sm text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link href="/solutions" className="hover:text-primary transition-colors">Solutions</Link></li>
                <li><Link href="/industries" className="hover:text-primary transition-colors">Industries</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
                <li><Link href="/portal/login" className="hover:text-primary transition-colors">Client Portal</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-mono-label mb-4 md:mb-6 text-foreground text-xs">CONTACT</h3>
              <ul className="space-y-3 md:space-y-4 text-sm text-muted-foreground">
                <li>
                  <a href="tel:+26774259012" className="hover:text-primary transition-colors">
                    +267 74 259 012
                  </a>
                </li>
                <li>
                  <a href="mailto:info@constructech.co.bw" className="hover:text-primary transition-colors break-all">
                    info@constructech.co.bw
                  </a>
                </li>
                <li>
                  P O Box 2059<br />
                  Mahalapye, Botswana
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Affiliate Strip */}
        <div className="border-t border-border pt-6 pb-6 md:pt-8 md:pb-8 flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6">
          <span className="font-mono-label text-muted-foreground text-xs shrink-0">CERTIFIED PARTNERS</span>
          <div className="flex flex-wrap justify-center sm:justify-end gap-5 md:gap-10">
            <span className="font-display font-bold text-foreground tracking-tight">DELL</span>
            <span className="font-display font-bold text-foreground italic">HP</span>
            <span className="font-display font-bold text-foreground tracking-widest">CISCO</span>
            <span className="font-display font-bold text-primary">UBIQUITI</span>
            <span className="font-display font-bold text-red-500">HIKVISION</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Constructatech Ventures. Building Botswana's Digital Future.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
