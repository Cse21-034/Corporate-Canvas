import React from 'react';
import { Link } from 'wouter';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="spectrum-rule w-full"></div>
      
      <div className="container mx-auto px-4 md:px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Logo variant="mono" size="md" />
            <p className="mt-6 text-sidebar-foreground/70 max-w-sm">
              Empowering Botswana Through Smart Infrastructure. We don't just install hardware; we build the digital backbone for your success.
            </p>
          </div>
          
          <div>
            <h3 className="font-mono-label mb-6 text-white">Navigation</h3>
            <ul className="space-y-4 text-sm text-sidebar-foreground/70">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/solutions" className="hover:text-primary transition-colors">Solutions</Link></li>
              <li><Link href="/industries" className="hover:text-primary transition-colors">Industries</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/portal/login" className="hover:text-primary transition-colors">Client Portal</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-mono-label mb-6 text-white">Contact</h3>
            <ul className="space-y-4 text-sm text-sidebar-foreground/70">
              <li>+267 74 259 012</li>
              <li>info@constructech.co.bw</li>
              <li>P O Box 2059<br />Mahalapye, Botswana</li>
            </ul>
          </div>
        </div>
        
        {/* Affiliate Strip */}
        <div className="border-t border-sidebar-border pt-8 pb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-mono-label text-sidebar-foreground/50">Certified Partners</span>
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            <span className="font-display font-bold text-white tracking-tight">DELL</span>
            <span className="font-display font-bold text-white italic">HP</span>
            <span className="font-display font-bold text-white tracking-widest">CISCO</span>
            <span className="font-display font-bold text-primary">UBIQUITI</span>
            <span className="font-display font-bold text-red-500">HIKVISION</span>
          </div>
        </div>
        
        <div className="border-t border-sidebar-border pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-sidebar-foreground/50">
          <p>© 2025 Constructatech Ventures. Building Botswana's Digital Future.</p>
          <div className="mt-4 md:mt-0 space-x-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
