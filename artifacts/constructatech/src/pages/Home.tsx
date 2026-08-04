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
    const numParticles = Math.min(Math.floor(width * height / 15000), 100);

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Update & Draw particles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Connect near particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(242, 106, 75, ${0.2 * (1 - dist / 150)})`; // Coral colored lines
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
      
      {/* Hero Section */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center bg-foreground overflow-hidden pt-20">
        <CanvasNetworkGraph />
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 py-20 text-center md:text-left">
          <div className="max-w-4xl mx-auto md:mx-0">
            <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl text-white leading-[1.1] tracking-tight mb-6 animate-in slide-in-from-bottom-8 duration-700">
              Empowering Botswana Through <span className="text-primary">Smart Infrastructure</span>
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mb-10 animate-in slide-in-from-bottom-8 duration-700 delay-150">
              We don't just install hardware; we build the digital backbone for your success. Precision engineering for enterprise networks, data centers, and security systems.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 animate-in slide-in-from-bottom-8 duration-700 delay-300">
              <Link 
                href="/contact"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-md font-semibold text-lg transition-all hover:-translate-y-1 shadow-[0_4px_20px_rgba(242,106,75,0.4)] w-full sm:w-auto text-center"
              >
                Request a Quote
              </Link>
              <Link 
                href="/solutions"
                className="group border border-white/20 hover:border-white/40 hover:bg-white/5 text-white px-8 py-4 rounded-md font-medium text-lg transition-all w-full sm:w-auto text-center flex items-center justify-center gap-2"
              >
                Explore Solutions
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full spectrum-rule"></div>
      </section>

      {/* Stats Band */}
      {stats && (
        <section className="bg-muted/50 py-16 border-b border-border">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-border">
              <div className="flex flex-col items-center text-center px-4">
                <span className="font-display font-bold text-4xl md:text-5xl text-foreground mb-2">{stats.projectsCompleted}+</span>
                <span className="font-mono-label text-muted-foreground flex items-center gap-2"><Activity className="w-4 h-4"/> Projects Completed</span>
              </div>
              <div className="flex flex-col items-center text-center px-4">
                <span className="font-display font-bold text-4xl md:text-5xl text-foreground mb-2">{stats.clientsServed}+</span>
                <span className="font-mono-label text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4"/> Clients Served</span>
              </div>
              <div className="flex flex-col items-center text-center px-4">
                <span className="font-display font-bold text-4xl md:text-5xl text-foreground mb-2">{stats.yearsActive}</span>
                <span className="font-mono-label text-muted-foreground flex items-center gap-2"><Calendar className="w-4 h-4"/> Years Active</span>
              </div>
              <div className="flex flex-col items-center text-center px-4 border-r-0 md:border-r">
                <span className="font-display font-bold text-4xl md:text-5xl text-foreground mb-2">{stats.industriesServed}</span>
                <span className="font-mono-label text-muted-foreground flex items-center gap-2"><Settings className="w-4 h-4"/> Industries Served</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Services Grid */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center md:text-left mb-16">
            <span className="font-mono-label text-primary mb-3 block">OUR CORE SOLUTIONS</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-foreground max-w-2xl">
              Engineered systems for the modern enterprise.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services?.slice(0, 4).map((service) => (
              <Link 
                key={service.id} 
                href={`/solutions/${service.slug}`}
                className="group bg-card rounded-xl border border-border p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-full"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-top duration-300"></div>
                
                <div className="w-14 h-14 bg-muted rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
                  <Activity className="w-7 h-7 text-primary" /> {/* Note: Real icon logic would map string names to components */}
                </div>
                
                <h3 className="font-display font-bold text-2xl text-card-foreground mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-8 flex-grow">{service.summary}</p>
                
                <div className="space-y-3 mb-8">
                  {service.includes.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-card-foreground/80">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-auto flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                  View Specifications <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Industries Strip */}
      <section className="py-24 bg-secondary text-secondary-foreground overflow-hidden">
        <div className="container mx-auto px-4 md:px-6">
          <span className="font-mono-label text-primary mb-3 block text-center">INDUSTRIES WE SERVE</span>
          <h2 className="font-display font-bold text-3xl text-center text-white mb-16">
            Tailored for Botswana's key sectors.
          </h2>

          <div className="flex md:grid overflow-x-auto md:overflow-visible pb-8 md:pb-0 gap-6 md:grid-cols-4 snap-x hide-scrollbar">
            {industries?.map((ind) => (
              <div key={ind.id} className="min-w-[280px] md:min-w-0 bg-secondary-foreground/5 p-8 rounded-xl border border-white/10 hover:border-primary/50 transition-colors snap-center">
                <h3 className="font-display font-bold text-xl text-white mb-3">{ind.name}</h3>
                <p className="text-secondary-foreground/70 text-sm leading-relaxed">{ind.blurb}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliates Strip */}
      <section className="py-16 bg-white border-y border-border">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <span className="font-mono-label text-muted-foreground mb-8 block">OUR TECHNOLOGY PARTNERS</span>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            <div className="px-6 py-3 border border-blue-500/20 bg-blue-50/50 rounded-full font-display font-bold text-blue-700 tracking-tight text-xl">DELL</div>
            <div className="px-6 py-3 border border-blue-600/20 bg-blue-50/50 rounded-full font-display font-bold text-blue-800 italic text-xl">HP</div>
            <div className="px-6 py-3 border border-sky-500/20 bg-sky-50/50 rounded-full font-display font-bold text-sky-600 tracking-widest text-xl">CISCO</div>
            <div className="px-6 py-3 border border-orange-500/20 bg-orange-50/50 rounded-full font-display font-bold text-orange-600 text-xl">UBIQUITI</div>
            <div className="px-6 py-3 border border-red-500/20 bg-red-50/50 rounded-full font-display font-bold text-red-600 text-xl">HIKVISION</div>
          </div>
        </div>
      </section>

      {/* Values Band */}
      <section className="py-24 bg-foreground text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl">Rooted in our heritage.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center px-4">
              <h3 className="font-display font-bold text-3xl text-primary mb-2">Boikanyego</h3>
              <p className="font-mono-label text-white/50 mb-4">RELIABILITY</p>
              <p className="text-white/70">Building infrastructure that runs silently and perfectly, so you can focus on your business.</p>
            </div>
            <div className="text-center px-4">
              <h3 className="font-display font-bold text-3xl text-primary mb-2">Puso</h3>
              <p className="font-mono-label text-white/50 mb-4">INNOVATION & OWNERSHIP</p>
              <p className="text-white/70">Taking absolute ownership of our solutions, pushing the boundaries of what's possible locally.</p>
            </div>
            <div className="text-center px-4">
              <h3 className="font-display font-bold text-3xl text-primary mb-2">Tirelo</h3>
              <p className="font-mono-label text-white/50 mb-4">SERVICE EXCELLENCE</p>
              <p className="text-white/70">Uncompromising support and maintenance standards for every client, big or small.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Band */}
      <section className="py-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIvPjwvc3ZnPg==')] opacity-30"></div>
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h2 className="font-display font-bold text-4xl md:text-5xl mb-4 max-w-3xl mx-auto">
            Ready to transform your infrastructure?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Get in touch — we'll have a comprehensive quote ready for you within 24 hours.
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-white text-primary px-10 py-4 rounded-md font-bold text-lg hover:bg-white/90 transition-colors shadow-xl"
          >
            Request a Quote
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
