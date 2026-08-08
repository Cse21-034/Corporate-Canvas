import React, { useState } from 'react';
import { Link } from 'wouter';
import { Logo } from './Logo';
import { useListServices, useSubscribeNewsletter } from '@workspace/api-client-react';
import { Facebook, Instagram, Twitter, Linkedin, Youtube, Loader2, CheckCircle2 } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// No live social accounts exist yet, so these are inert placeholders (#)
// rather than fabricated links to profiles that don't exist — swap in the
// real URLs once the accounts are set up. Each brand's real color, filled
// circle, white glyph.
const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: '#', bg: 'bg-[#1877F2]' },
  { icon: Instagram, label: 'Instagram', href: '#', bg: 'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]' },
  { icon: Twitter, label: 'Twitter', href: '#', bg: 'bg-black' },
  { icon: Linkedin, label: 'LinkedIn', href: '#', bg: 'bg-[#0A66C2]' },
  { icon: Youtube, label: 'YouTube', href: '#', bg: 'bg-[#FF0000]' },
];

const navLinks = [
  { text: 'About Us', href: '/about' },
  { text: 'Industries', href: '/industries' },
  { text: 'Gallery', href: '/gallery' },
  { text: 'Contact', href: '/contact' },
  { text: 'Client Portal', href: '/portal/login' },
];

export function Footer() {
  const { data: services } = useListServices();
  const subscribe = useSubscribeNewsletter();

  const [email, setEmail] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot !== '') return;
    subscribe.mutate({ data: { email, honeypot } }, { onSuccess: () => setSubscribed(true) });
  };

  return (
    <footer className="bg-background text-foreground border-t border-border pb-20 md:pb-0">
      <div className="spectrum-rule w-full" />

      <div className="container mx-auto px-4 md:px-6 pt-12 md:pt-16 pb-8">
        {/* Newsletter */}
        <div className="bg-muted border border-border rounded-2xl p-6 md:p-10 mb-12 md:mb-16">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10 items-center">
            <div>
              <h3 className="font-display font-bold text-xl md:text-2xl text-foreground mb-3">
                Stay ahead with Constructatech
              </h3>
              <p className="text-muted-foreground text-sm md:text-base mb-6 max-w-md">
                Infrastructure tips, product updates, and project stories from our engineering team — straight to your inbox.
              </p>

              {subscribed ? (
                <p className="text-sm font-medium text-primary flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> You're subscribed — thanks!
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="flex-1 h-11 px-4 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                  />
                  {/* Honeypot */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    style={{ display: 'none' }}
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                  <button
                    type="submit"
                    disabled={subscribe.isPending}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 px-6 rounded-md font-semibold text-sm transition-all disabled:opacity-70 flex items-center justify-center gap-2 shrink-0"
                  >
                    {subscribe.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                    Subscribe
                  </button>
                </form>
              )}

              {subscribe.isError && (
                <p className="text-xs text-destructive mt-2">Something went wrong — please try again.</p>
              )}
            </div>

            <div className="hidden md:block">
              <DotLottieReact
                src="https://lottie.host/3c81c6d6-065f-4e3c-8345-591acde3a786/Ig244SMbea.lottie"
                loop
                autoplay
                style={{ height: '200px', width: '100%' }}
              />
            </div>
          </div>
        </div>

        {/* Top grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12 mb-10 md:mb-16">
          {/* Brand */}
          <div>
            <Logo variant="full" size="md" />
            <p className="mt-5 text-muted-foreground max-w-sm text-sm leading-relaxed">
              Empowering Botswana Through Smart Infrastructure. We don't just install hardware; we build the digital backbone for your success.
            </p>
            <ul className="mt-6 flex gap-3">
              {socialLinks.map(({ icon: Icon, label, href, bg }) => (
                <li key={label}>
                  <a
                    href={href}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-white hover:opacity-85 transition-opacity ${bg}`}
                  >
                    <span className="sr-only">{label}</span>
                    <Icon className="w-4 h-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav + Services + Contact */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:col-span-2">
            <div>
              <h3 className="font-mono-label mb-4 md:mb-6 text-foreground text-xs">NAVIGATION</h3>
              <ul className="space-y-3 md:space-y-4 text-sm text-muted-foreground">
                {navLinks.map(({ text, href }) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-primary transition-colors">{text}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-mono-label mb-4 md:mb-6 text-foreground text-xs">SERVICES</h3>
              <ul className="space-y-3 md:space-y-4 text-sm text-muted-foreground">
                {services?.map((service) => (
                  <li key={service.id}>
                    <Link href={`/solutions/${service.slug}`} className="hover:text-primary transition-colors">
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 sm:col-span-1">
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
