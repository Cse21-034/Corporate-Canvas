import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ShieldCheck, Target, Zap } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-foreground text-white relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <span className="font-mono-label text-primary mb-4 block">OUR STORY</span>
          <h1 className="font-display font-bold text-4xl md:text-6xl max-w-3xl mb-6">
            About Constructatech Ventures
          </h1>
          <p className="text-lg text-white/70 max-w-2xl">
            We are a 100% citizen-owned IT infrastructure and engineering company, committed to building the digital foundations of modern Botswana.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full spectrum-rule"></div>
      </section>

      {/* Copy Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="prose prose-lg dark:prose-invert text-foreground/80 font-serif leading-relaxed">
            <p className="text-xl font-medium text-foreground mb-8">
              Founded on the principles of precision engineering and unyielding reliability, Constructatech Ventures was established to address a critical gap in Botswana's IT sector: the need for enterprise-grade infrastructure built and maintained by local experts.
            </p>
            <p>
              We specialize in the design, deployment, and optimization of complex networking, data center, and physical security environments. Whether it's a sprawling mining operation requiring ruggedized connectivity or a financial institution needing zero-latency fiber optics, we engineer solutions that simply do not fail.
            </p>
            <p>
              Our team consists of certified engineers and technicians who understand the local landscape. We combine global best practices—partnering with industry leaders like Cisco, Dell, and Ubiquiti—with an intimate knowledge of Botswana's operational challenges. 
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-card p-10 rounded-xl border border-border shadow-sm flex flex-col">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-display font-bold text-2xl mb-4 text-card-foreground">Our Mission</h2>
              <p className="text-muted-foreground flex-grow">
                To empower Botswana's enterprises by delivering robust, scalable, and intelligent IT infrastructure that drives operational excellence and accelerates digital transformation.
              </p>
            </div>
            <div className="bg-card p-10 rounded-xl border border-border shadow-sm flex flex-col">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-display font-bold text-2xl mb-4 text-card-foreground">Our Vision</h2>
              <p className="text-muted-foreground flex-grow">
                To be the undisputed leader in IT engineering across Southern Africa, recognized for precision, innovation, and an unwavering commitment to service excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-foreground text-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <span className="font-mono-label text-primary mb-3 block">CORE VALUES</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl">The principles we engineer by.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-sm">
              <h3 className="font-display font-bold text-3xl text-primary mb-2">Boikanyego</h3>
              <p className="font-mono-label text-white/50 mb-4 border-b border-white/10 pb-4">RELIABILITY</p>
              <p className="text-white/70">Our infrastructure must be invisible. It should run so perfectly and silently that our clients forget it's there. We build for 99.999% uptime.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-sm">
              <h3 className="font-display font-bold text-3xl text-primary mb-2">Puso</h3>
              <p className="font-mono-label text-white/50 mb-4 border-b border-white/10 pb-4">INNOVATION & OWNERSHIP</p>
              <p className="text-white/70">We take absolute ownership of the outcomes. We don't point fingers; we find solutions. We constantly push the boundaries of technical possibility.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-xl backdrop-blur-sm">
              <h3 className="font-display font-bold text-3xl text-primary mb-2">Tirelo</h3>
              <p className="font-mono-label text-white/50 mb-4 border-b border-white/10 pb-4">SERVICE EXCELLENCE</p>
              <p className="text-white/70">Service is not a department; it's a discipline. We respond instantly, communicate clearly, and resolve completely.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
