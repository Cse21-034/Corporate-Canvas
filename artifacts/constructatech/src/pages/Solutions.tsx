import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useListServices } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { Activity, CheckCircle2, ChevronRight, Loader2 } from 'lucide-react';

export default function Solutions() {
  const { data: services, isLoading } = useListServices();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="pt-28 md:pt-32 pb-14 md:pb-20 bg-foreground text-white relative">
        <div className="container mx-auto px-5 md:px-6 relative z-10">
          <span className="font-mono-label text-primary mb-4 block">OUR EXPERTISE</span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-6xl max-w-3xl mb-5 md:mb-6">
            Engineered Solutions
          </h1>
          <p className="text-base md:text-lg text-white/70 max-w-2xl">
            Precision IT infrastructure built for performance, security, and absolute reliability.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full spectrum-rule" />
      </section>

      <section className="py-14 md:py-20 flex-grow">
        <div className="container mx-auto px-5 md:px-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
              {services?.map((service) => (
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
                    {service.includes.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-xs md:text-sm font-medium text-card-foreground/80">{item}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all pt-4 border-t border-border">
                    View Specifications
                    <ChevronRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
