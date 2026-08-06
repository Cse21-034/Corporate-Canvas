import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useListIndustries } from '@workspace/api-client-react';
import {
  Loader2, Factory, Building2, Landmark, GraduationCap,
  HeartPulse, HardHat, ShoppingCart, Radio,
} from 'lucide-react';

function IndustryIcon({ name }: { name: string }) {
  const cls = 'w-7 h-7 md:w-8 md:h-8 text-primary';
  switch (name) {
    case 'factory':         return <Factory className={cls} />;
    case 'building-2':      return <Building2 className={cls} />;
    case 'landmark':        return <Landmark className={cls} />;
    case 'graduation-cap':  return <GraduationCap className={cls} />;
    case 'heart-pulse':     return <HeartPulse className={cls} />;
    case 'hard-hat':        return <HardHat className={cls} />;
    case 'shopping-cart':   return <ShoppingCart className={cls} />;
    case 'pickaxe':         return <HardHat className={cls} />;
    case 'radio-tower':     return <Radio className={cls} />;
    default:                return <Building2 className={cls} />;
  }
}

export default function Industries() {
  const { data: industries, isLoading } = useListIndustries();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="pt-28 md:pt-32 pb-14 md:pb-20 bg-background text-foreground relative">
        <div className="container mx-auto px-5 md:px-6 relative z-10">
          <span className="font-mono-label text-primary mb-4 block">SECTORS</span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-6xl max-w-3xl mb-5 md:mb-6">
            Industries We Serve
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            Custom-engineered infrastructure solutions for Botswana's most critical economic sectors.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
              {industries?.map((ind) => (
                <div
                  key={ind.id}
                  className="bg-card rounded-xl border border-border p-6 md:p-8 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="w-13 h-13 md:w-16 md:h-16 bg-muted rounded-lg flex items-center justify-center mb-5 md:mb-6">
                    <IndustryIcon name={ind.icon} />
                  </div>
                  <h3 className="font-display font-bold text-xl md:text-2xl text-card-foreground mb-3 md:mb-4">{ind.name}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{ind.blurb}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
