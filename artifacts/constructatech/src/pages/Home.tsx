import React from 'react';
import { Link } from 'wouter';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Reveal } from '../components/Reveal';
import { PartnerLogos } from '../components/PartnerLogos';
import { ArrowRight, ArrowUpRight, Activity, Users, Calendar, Settings, Wrench, Rocket } from 'lucide-react';
import { useListServices, useListIndustries, useGetStats } from '@workspace/api-client-react';

export default function Home() {
  const { data: stats } = useGetStats();
  const { data: services } = useListServices();
  const { data: industries } = useListIndustries();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ── Hero ──
          lg:min-h-screen + lg:flex lg:items-center keeps this to one
          viewport tall on desktop, centering the grid in the space between
          pt (clears the fixed header) and pb (the ≥10vh gap under the CTA
          row) — both paddings stay hard minimums since box-sizing:
          border-box folds them into that min-height. */}
      <section className="relative w-full pt-28 md:pt-32 pb-[10vh] bg-background overflow-hidden lg:min-h-screen lg:flex lg:items-center">
        <div className="container mx-auto px-5 md:px-6">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Copy */}
            <div className="text-center lg:text-left animate-in slide-in-from-bottom-8 duration-700">
              <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl text-foreground leading-[1.1] tracking-tight mb-4 md:mb-5 max-w-xl mx-auto lg:mx-0">
                Empowering Botswana Through <span className="text-primary">Smart Infrastructure</span>
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 mb-6 md:mb-8">
                We don't just install hardware; we build the digital backbone for your success — precision engineering for enterprise networks, data centers, and security systems.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-8">
                <Link
                  href="/contact"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-7 py-3.5 rounded-md font-semibold text-base transition-all hover:-translate-y-0.5 shadow-[0_4px_20px_rgba(201,63,13,0.4)]"
                >
                  Request a Quote
                </Link>
                <Link href="/solutions" className="group inline-flex items-center gap-2.5 text-foreground font-medium hover:text-primary transition-colors">
                  <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                    <Rocket className="w-3.5 h-3.5 text-primary" />
                  </span>
                  Explore Solutions
                </Link>
              </div>
            </div>

            {/* Image collage — sized to fill the column (w-full, capped only
                on mobile where it's centered under the text) rather than a
                small fixed px value. The text column is the taller of the
                two either way, so this doesn't push the hero past one
                viewport — it just closes the gap that made the collage look
                small and off-balance against it. */}
            <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-none mx-auto lg:mx-0">
              <div className="grid grid-cols-2 gap-4 md:gap-5">
                <img
                  src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=70"
                  alt="Data center infrastructure built by Constructatech Ventures"
                  className="w-full aspect-[3/4] object-cover rounded-2xl shadow-lg"
                />
                <img
                  src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=70"
                  alt="Enterprise network cabling deployed by Constructatech Ventures"
                  className="w-full aspect-[3/4] object-cover rounded-2xl shadow-lg mt-9 md:mt-10"
                />
              </div>

              {/* Floating stat card */}
              {stats && (
                <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-foreground text-background rounded-xl px-4 py-3 shadow-xl min-w-[140px]">
                  <p className="font-mono-label text-background/60 text-[10px] mb-0.5">PROJECTS DELIVERED</p>
                  <p className="font-display font-bold text-xl leading-none">{stats.projectsCompleted}+</p>
                </div>
              )}

              {/* Floating status pill */}
              <div className="absolute bottom-10 md:bottom-14 -left-3 md:-left-5 bg-card border border-border rounded-full pl-2 pr-4 py-2 shadow-lg flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 relative">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  <span className="absolute w-2 h-2 rounded-full bg-primary animate-ping" />
                </span>
                <span className="text-xs font-semibold text-foreground whitespace-nowrap">Network Status: Online</span>
              </div>

              {/* Floating badge */}
              {stats && (
                <div className="absolute -bottom-4 right-2 md:-right-4 w-20 h-20 md:w-24 md:h-24 rounded-full bg-foreground text-background flex flex-col items-center justify-center text-center shadow-xl border-4 border-background">
                  <span className="font-display font-bold text-lg md:text-xl leading-none">{stats.yearsActive}+</span>
                  <span className="text-[9px] uppercase tracking-wide mt-1 text-background/70">Years</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full spectrum-rule" />
      </section>

      {/* ── Stats Band — commented out per request, replaced below with
          the technology-partners strip. Data (stats.projectsCompleted etc.)
          is still fetched above and used elsewhere on this page, so this
          can be restored later without re-wiring anything. ──
      {stats && (
        <section className="bg-muted/50 py-10 md:py-16 border-b border-border">
          <div className="container mx-auto px-5 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border md:bg-transparent md:divide-x md:divide-border">
              {[
                { value: `${stats.projectsCompleted}+`, label: 'Projects Completed', icon: Activity },
                { value: `${stats.clientsServed}+`, label: 'Clients Served', icon: Users },
                { value: String(stats.yearsActive), label: 'Years Active', icon: Calendar },
                { value: String(stats.industriesServed), label: 'Industries Served', icon: Settings },
              ].map(({ value, label, icon: Icon }) => (
                <div key={label} className="bg-muted/50 md:bg-transparent flex flex-col items-center text-center px-4 py-6 md:py-0">
                  <span className="font-display font-bold text-3xl md:text-5xl text-foreground mb-1 md:mb-2">{value}</span>
                  <span className="font-mono-label text-muted-foreground flex items-center gap-1.5 text-xs md:text-sm">
                    <Icon className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      */}

      {/* ── Technology Partners (replaces the Stats Band right under the hero) ── */}
      <section className="bg-muted/50 py-12 md:py-20 border-b border-border">
        <div className="container mx-auto px-5 md:px-6 text-center">
          <span className="font-mono-label text-muted-foreground mb-8 md:mb-10 block text-xs">OUR TECHNOLOGY PARTNERS</span>
          <PartnerLogos />
        </div>
      </section>

      {/* ── Services Showcase ── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-5 md:px-6">
          <div className="text-center mb-10 md:mb-14">
            <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-5 md:mb-6">
              <Wrench className="w-3.5 h-3.5" />
              Our Solutions
            </span>
            <h2 className="font-display font-bold text-foreground text-3xl sm:text-4xl md:text-5xl leading-[1.15] max-w-md mx-auto mb-5 md:mb-6">
              What we can do for you
            </h2>

            <div className="flex flex-col items-center gap-6">
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md">
                From infrastructure design to deployment and support, we provide reliable IT solutions tailored to your business needs.
              </p>
              <Link
                href="/solutions"
                className="group inline-flex items-center gap-3 bg-card border border-border text-foreground pl-5 pr-1.5 py-1.5 rounded-full text-sm font-medium hover:bg-muted transition-colors shadow-sm"
              >
                See our services
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center group-hover:translate-x-0.5 transition-transform shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {services?.slice(0, 4).map((service, cardIdx) => (
              <Reveal key={service.id} delay={cardIdx * 0.08}>
                <Link
                  href={`/solutions/${service.slug}`}
                  className="group relative block aspect-[3/4] rounded-2xl overflow-hidden bg-muted"
                >
                  {service.imageUrl && (
                    <img
                      src={service.imageUrl}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <span className="absolute bottom-3 left-3 right-14 md:bottom-4 md:left-4 md:right-16 text-white font-medium text-sm md:text-base leading-tight">
                    {service.title}
                  </span>
                  <span className="absolute bottom-3 right-3 md:bottom-4 md:right-4 w-9 h-9 md:w-10 md:h-10 rounded-full bg-foreground text-background flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries Strip ── */}
      <section className="py-16 md:py-24 bg-background overflow-hidden border-t border-border">
        <div className="container mx-auto px-5 md:px-6">
          <span className="font-mono-label text-primary mb-3 block text-center">INDUSTRIES WE SERVE</span>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-center text-foreground mb-10 md:mb-16">
            Tailored for Botswana's key sectors.
          </h2>

          <div className="flex md:grid overflow-x-auto md:overflow-visible pb-4 md:pb-0 gap-4 md:gap-6 md:grid-cols-4 snap-x snap-mandatory hide-scrollbar">
            {industries?.map((ind) => (
              <div
                key={ind.id}
                className="min-w-[260px] sm:min-w-[280px] md:min-w-0 bg-muted p-6 md:p-8 rounded-xl border border-border hover:border-primary/50 transition-colors snap-start"
              >
                <h3 className="font-display font-bold text-lg md:text-xl text-foreground mb-2 md:mb-3">{ind.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{ind.blurb}</p>
              </div>
            ))}
          </div>

          {/* Scroll hint on mobile */}
          <p className="md:hidden text-center text-muted-foreground text-xs font-mono-label mt-4">SWIPE TO EXPLORE</p>
        </div>
      </section>

      {/* ── Values Band ── */}
      <section className="py-16 md:py-24 bg-background text-foreground border-t border-border">
        <div className="container mx-auto px-5 md:px-6">
          <div className="text-center mb-16 md:mb-20">
            <h2 className="font-display font-bold text-2xl md:text-4xl">Rooted in our heritage.</h2>
          </div>

          <div className="relative grid md:grid-cols-3 gap-y-14 gap-x-10 md:gap-20">
            <img
              src="/VectorHIW.svg"
              alt=""
              className="hidden md:block absolute inset-x-0 top-10"
            />

            {[
              { sw: 'Boikanyego', en: 'RELIABILITY', desc: 'Building infrastructure that runs silently and perfectly, so you can focus on your business.' },
              { sw: 'Puso', en: 'INNOVATION & OWNERSHIP', desc: 'Taking absolute ownership of our solutions, pushing the boundaries of what\'s possible locally.' },
              { sw: 'Tirelo', en: 'SERVICE EXCELLENCE', desc: 'Uncompromising support and maintenance standards for every client, big or small.' },
            ].map(({ sw, en, desc }, idx) => (
              <div key={sw} className="relative flex flex-col items-center max-w-xs mx-auto text-center">
                <div className="relative z-10 w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {idx + 1}
                  </div>
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl text-foreground mb-1">{sw}</h3>
                <p className="font-mono-label text-muted-foreground mb-3 text-xs">{en}</p>
                <p className="text-muted-foreground text-sm md:text-base">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section className="py-16 md:py-24 bg-background text-foreground text-center border-t border-border">
        <div className="container mx-auto px-5 md:px-6">
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-4 max-w-3xl mx-auto leading-tight">
            Ready to transform your infrastructure?
          </h2>
          <p className="text-base md:text-xl text-muted-foreground mb-8 md:mb-10 max-w-2xl mx-auto">
            Get in touch — we'll have a comprehensive quote ready for you within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-primary hover:bg-primary/90 text-primary-foreground px-8 md:px-10 py-4 rounded-md font-bold text-base md:text-lg transition-colors shadow-xl"
          >
            Request a Quote
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
