import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Target, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero */}
      <section className="pt-28 md:pt-32 pb-14 md:pb-20 bg-foreground text-white relative">
        <div className="container mx-auto px-5 md:px-6 relative z-10">
          <span className="font-mono-label text-primary mb-4 block">OUR STORY</span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-6xl max-w-3xl mb-5 md:mb-6">
            About Constructatech Ventures
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-2xl">
            We are a 100% citizen-owned IT infrastructure and engineering company, committed to building the digital foundations of modern Botswana.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full spectrum-rule" />
      </section>

      {/* Copy Section */}
      <section className="py-14 md:py-20">
        <div className="container mx-auto px-5 md:px-6 max-w-4xl">
          <div className="space-y-5 text-foreground/80 leading-relaxed">
            <p className="text-lg md:text-xl font-medium text-foreground">
              Founded on the principles of precision engineering and unyielding reliability, Constructatech Ventures was established to address a critical gap in Botswana's IT sector: the need for enterprise-grade infrastructure built and maintained by local experts.
            </p>
            <p className="text-sm md:text-base">
              We specialize in the design, deployment, and optimization of complex networking, data center, and physical security environments. Whether it's a sprawling mining operation requiring ruggedized connectivity or a financial institution needing zero-latency fiber optics, we engineer solutions that simply do not fail.
            </p>
            <p className="text-sm md:text-base">
              Our team consists of certified engineers and technicians who understand the local landscape. We combine global best practices — partnering with industry leaders like Cisco, Dell, and Ubiquiti — with an intimate knowledge of Botswana's operational challenges.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-14 md:py-20 bg-muted">
        <div className="container mx-auto px-5 md:px-6">
          <div className="grid sm:grid-cols-2 gap-5 md:gap-8">
            <div className="bg-card p-7 md:p-10 rounded-xl border border-border shadow-sm flex flex-col">
              <div className="w-11 h-11 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5 md:mb-6 shrink-0">
                <Target className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <h2 className="font-display font-bold text-xl md:text-2xl mb-3 md:mb-4 text-card-foreground">Our Mission</h2>
              <p className="text-muted-foreground flex-grow text-sm md:text-base">
                To empower Botswana's enterprises by delivering robust, scalable, and intelligent IT infrastructure that drives operational excellence and accelerates digital transformation.
              </p>
            </div>
            <div className="bg-card p-7 md:p-10 rounded-xl border border-border shadow-sm flex flex-col">
              <div className="w-11 h-11 md:w-12 md:h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-5 md:mb-6 shrink-0">
                <Zap className="w-5 h-5 md:w-6 md:h-6 text-primary" />
              </div>
              <h2 className="font-display font-bold text-xl md:text-2xl mb-3 md:mb-4 text-card-foreground">Our Vision</h2>
              <p className="text-muted-foreground flex-grow text-sm md:text-base">
                To be the undisputed leader in IT engineering across Southern Africa, recognized for precision, innovation, and an unwavering commitment to service excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-14 md:py-24 bg-foreground text-white">
        <div className="container mx-auto px-5 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <span className="font-mono-label text-primary mb-3 block">CORE VALUES</span>
            <h2 className="font-display font-bold text-2xl md:text-4xl">The principles we engineer by.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-12">
            {[
              {
                sw: 'Boikanyego', en: 'RELIABILITY',
                desc: 'Our infrastructure must be invisible. It should run so perfectly and silently that our clients forget it\'s there. We build for 99.999% uptime.',
              },
              {
                sw: 'Puso', en: 'INNOVATION & OWNERSHIP',
                desc: 'We take absolute ownership of the outcomes. We don\'t point fingers; we find solutions. We constantly push the boundaries of technical possibility.',
              },
              {
                sw: 'Tirelo', en: 'SERVICE EXCELLENCE',
                desc: 'Service is not a department; it\'s a discipline. We respond instantly, communicate clearly, and resolve completely.',
              },
            ].map(({ sw, en, desc }) => (
              <div key={sw} className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-xl backdrop-blur-sm">
                <h3 className="font-display font-bold text-2xl md:text-3xl text-primary mb-1 md:mb-2">{sw}</h3>
                <p className="font-mono-label text-white/50 mb-3 md:mb-4 border-b border-white/10 pb-3 md:pb-4 text-xs">{en}</p>
                <p className="text-white/70 text-sm md:text-base">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
