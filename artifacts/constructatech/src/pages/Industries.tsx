import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useListIndustries } from '@workspace/api-client-react';
import { Loader2, Factory, Building2, Landmark, GraduationCap, HeartPulse, HardHat } from 'lucide-react';

export default function Industries() {
  const { data: industries, isLoading } = useListIndustries();

  // Mapping a simple icon name from DB to a Lucide component
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'factory': return <Factory className="w-8 h-8 text-primary" />;
      case 'building-2': return <Building2 className="w-8 h-8 text-primary" />;
      case 'landmark': return <Landmark className="w-8 h-8 text-primary" />;
      case 'graduation-cap': return <GraduationCap className="w-8 h-8 text-primary" />;
      case 'heart-pulse': return <HeartPulse className="w-8 h-8 text-primary" />;
      case 'hard-hat': return <HardHat className="w-8 h-8 text-primary" />;
      default: return <Building2 className="w-8 h-8 text-primary" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <section className="pt-32 pb-20 bg-foreground text-white relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <span className="font-mono-label text-primary mb-4 block">SECTORS</span>
          <h1 className="font-display font-bold text-4xl md:text-6xl max-w-3xl mb-6">
            Industries We Serve
          </h1>
          <p className="text-lg text-white/70 max-w-2xl">
            Custom-engineered infrastructure solutions for Botswana's most critical economic sectors.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full spectrum-rule"></div>
      </section>

      <section className="py-20 flex-grow">
        <div className="container mx-auto px-4 md:px-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {industries?.map((ind) => (
                <div key={ind.id} className="bg-card rounded-xl border border-border p-8 hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-6">
                    {getIcon(ind.icon)}
                  </div>
                  <h3 className="font-display font-bold text-2xl text-card-foreground mb-4">{ind.name}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {ind.blurb}
                  </p>
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
