import React, { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ArrowRight, CheckCircle2, ChevronRight, Activity, Users, Calendar, Settings } from 'lucide-react';
import { useListServices, useListIndustries, useGetStats } from '@workspace/api-client-react';

function CanvasNetworkGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles: {x: number, y: number, vx: number, vy: number, size: number}[] = [];
    const numParticles = Math.min(Math.floor(width * height / 15000), 80);

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(242, 106, 75, ${0.2 * (1 - dist / 150)})`;
            ctx.lineWidth = 1;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none opacity-60" />;
}

export default function Home() {
  const { data: stats } = useGetStats();
  const { data: services } = useListServices();
  const { data: industries } = useListIndustries();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ── Hero ── */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-foreground overflow-hidden pt-20">
        <CanvasNetworkGraph />
        <div className="container mx-auto px-5 md:px-6 relative z-10 py-16 md:py-20 text-center md:text-left">
          <div className="max-w-4xl mx-auto md:mx-0">
            <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-5 md:mb-6 animate-in slide-in-from-bottom-8 duration-700">
              Empowering Botswana Through{' '}
              <span className="text-primary">Smart Infrastructure</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mb-8 md:mb-10 animate-in slide-in-from-bottom-8 duration-700 delay-150">
              We don't just install hardware; we build the digital backbone for your success. Precision engineering for enterprise networks, data centers, and security systems.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 animate-in slide-in-from-bottom-8 duration-700 delay-300">
              <Link
                href="/contact"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-md font-semibold text-base md:text-lg transition-all hover:-translate-y-1 shadow-[0_4px_20px_rgba(242,106,75,0.4)] text-center"
              >
                Request a Quote
              </Link>
              <Link
                href="/solutions"
                className="group border border-white/20 hover:border-white/40 hover:bg-white/5 text-white px-8 py-4 rounded-md font-medium text-base md:text-lg transition-all text-center flex items-center justify-center gap-2"
              >
                Explore Solutions
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full spectrum-rule" />
      </section>

      {/* ── Stats Band ── */}
      {stats && (
        <section className="bg-muted/50 py-10 md:py-16 border-b border-border">
          <div className="container mx-auto px-5 md:px-6">
            {/* Mobile: 2×2 card grid. Desktop: 4-col divider row */}
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

      {/* ── Services Grid ── */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-5 md:px-6">
          <div className="text-center md:text-left mb-10 md:mb-16">
            <span className="font-mono-label text-primary mb-3 block">OUR CORE SOLUTIONS</span>
            <h2 className="font-display font-bold text-2xl md:text-4xl text-foreground max-w-2xl">
              Engineered systems for the modern enterprise.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
            {services?.slice(0, 4).map((service) => (
              <Link
                key={service.id}
                href={`/solutions/${service.slug}`}
                className="group bg-card rounded-xl border border-border p-6 md:p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300" />

                <div className="w-12 h-12 md:w-14 md:h-14 bg-muted rounded-lg flex items-center justify-center mb-5 md:mb-6 group-hover:bg-primary/10 transition-colors shrink-0">
                  <Activity className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                </div>

                <h3 className="font-display font-bold text-xl md:text-2xl text-card-foreground mb-3 md:mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-5 md:mb-8 flex-grow text-sm md:text-base">{service.summary}</p>

                <div className="space-y-2 md:space-y-3 mb-5 md:mb-8">
                  {service.includes.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-xs md:text-sm font-medium text-card-foreground/80">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all pt-4 md:pt-0 border-t border-border md:border-0">
                  View Specifications
                  <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Industries Strip ── */}
      <section className="py-16 md:py-24 bg-secondary text-secondary-foreground overflow-hidden">
        <div className="container mx-auto px-5 md:px-6">
          <span className="font-mono-label text-primary mb-3 block text-center">INDUSTRIES WE SERVE</span>
          <h2 className="font-display font-bold text-2xl md:text-3xl text-center text-white mb-10 md:mb-16">
            Tailored for Botswana's key sectors.
          </h2>

          <div className="flex md:grid overflow-x-auto md:overflow-visible pb-4 md:pb-0 gap-4 md:gap-6 md:grid-cols-4 snap-x snap-mandatory hide-scrollbar">
            {industries?.map((ind) => (
              <div
                key={ind.id}
                className="min-w-[260px] sm:min-w-[280px] md:min-w-0 bg-secondary-foreground/5 p-6 md:p-8 rounded-xl border border-white/10 hover:border-primary/50 transition-colors snap-start"
              >
                <h3 className="font-display font-bold text-lg md:text-xl text-white mb-2 md:mb-3">{ind.name}</h3>
                <p className="text-secondary-foreground/70 text-sm leading-relaxed">{ind.blurb}</p>
              </div>
            ))}
          </div>

          {/* Scroll hint on mobile */}
          <p className="md:hidden text-center text-white/30 text-xs font-mono-label mt-4">SWIPE TO EXPLORE</p>
        </div>
      </section>

      {/* ── Affiliates Strip ── */}
      <section className="py-12 md:py-16 bg-white border-y border-border">
        <div className="container mx-auto px-5 md:px-6 text-center">
          <span className="font-mono-label text-muted-foreground mb-6 md:mb-8 block text-xs">OUR TECHNOLOGY PARTNERS</span>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-16">
            <div className="px-5 py-2.5 border border-blue-500/20 bg-blue-50/50 rounded-full font-display font-bold text-blue-700 tracking-tight text-lg md:text-xl">DELL</div>
            <div className="px-5 py-2.5 border border-blue-600/20 bg-blue-50/50 rounded-full font-display font-bold text-blue-800 italic text-lg md:text-xl">HP</div>
            <div className="px-5 py-2.5 border border-sky-500/20 bg-sky-50/50 rounded-full font-display font-bold text-sky-600 tracking-widest text-lg md:text-xl">CISCO</div>
            <div className="px-5 py-2.5 border border-orange-500/20 bg-orange-50/50 rounded-full font-display font-bold text-orange-600 text-lg md:text-xl">UBIQUITI</div>
            <div className="px-5 py-2.5 border border-red-500/20 bg-red-50/50 rounded-full font-display font-bold text-red-600 text-lg md:text-xl">HIKVISION</div>
          </div>
        </div>
      </section>

      {/* ── Values Band ── */}
      <section className="py-16 md:py-24 bg-foreground text-white">
        <div className="container mx-auto px-5 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="font-display font-bold text-2xl md:text-4xl">Rooted in our heritage.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
            {[
              { sw: 'Boikanyego', en: 'RELIABILITY', desc: 'Building infrastructure that runs silently and perfectly, so you can focus on your business.' },
              { sw: 'Puso', en: 'INNOVATION & OWNERSHIP', desc: 'Taking absolute ownership of our solutions, pushing the boundaries of what\'s possible locally.' },
              { sw: 'Tirelo', en: 'SERVICE EXCELLENCE', desc: 'Uncompromising support and maintenance standards for every client, big or small.' },
            ].map(({ sw, en, desc }) => (
              <div key={sw} className="text-center px-2 sm:px-4">
                <h3 className="font-display font-bold text-2xl md:text-3xl text-primary mb-1 md:mb-2">{sw}</h3>
                <p className="font-mono-label text-white/50 mb-3 md:mb-4 text-xs">{en}</p>
                <p className="text-white/70 text-sm md:text-base">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Band ── */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30" />
        <div className="container mx-auto px-5 md:px-6 relative z-10">
          <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl mb-4 max-w-3xl mx-auto leading-tight">
            Ready to transform your infrastructure?
          </h2>
          <p className="text-base md:text-xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto">
            Get in touch — we'll have a comprehensive quote ready for you within 24 hours.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-primary px-8 md:px-10 py-4 rounded-md font-bold text-base md:text-lg hover:bg-white/90 transition-colors shadow-xl"
          >
            Request a Quote
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
