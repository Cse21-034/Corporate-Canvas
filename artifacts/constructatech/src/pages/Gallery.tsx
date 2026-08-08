import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Reveal } from '../components/Reveal';
import { useListServices } from '@workspace/api-client-react';
import { Loader2, X } from 'lucide-react';

export default function Gallery() {
  const { data: services, isLoading } = useListServices();
  const [modalImage, setModalImage] = useState<{ src: string; title: string } | null>(null);

  useEffect(() => {
    if (!modalImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setModalImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [modalImage]);

  // Every wide-and-narrow pairing below alternates in twos, matching a
  // 2-column grid: [wide] / [narrow, narrow] / [wide] / ...
  const spanFor = (idx: number) => (idx % 3 === 0 ? 'sm:col-span-2' : 'col-span-1');
  const aspectFor = (idx: number) => (idx % 3 === 0 ? 'aspect-[21/9]' : 'aspect-square');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <section className="pt-28 md:pt-32 pb-14 md:pb-20 bg-background text-foreground relative">
        <div className="container mx-auto px-5 md:px-6 relative z-10">
          <span className="font-mono-label text-primary mb-4 block">OUR WORK</span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-6xl max-w-3xl mb-5 md:mb-6">
            Gallery
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
            A look at the infrastructure we build — from data centers to enterprise networks, hardware rollouts, and industrial automation.
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {services?.map((service, idx) => (
                service.imageUrl && (
                  <Reveal key={service.id} delay={idx * 0.06} className={spanFor(idx)}>
                    <button
                      type="button"
                      onClick={() => setModalImage({ src: service.imageUrl!, title: service.title })}
                      className={`group relative block w-full overflow-hidden rounded-xl ${aspectFor(idx)}`}
                    >
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 md:p-5">
                        <p className="text-white text-base md:text-lg font-display font-semibold translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          {service.title}
                        </p>
                      </div>
                    </button>
                  </Reveal>
                )
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      {modalImage && (
        <div
          className="fixed inset-0 bg-black/85 flex justify-center items-center z-[70] p-6 animate-in fade-in duration-200"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage.src}
            alt={modalImage.title}
            className="max-w-[90vw] max-h-[85vh] rounded-lg shadow-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            onClick={() => setModalImage(null)}
            aria-label="Close"
            className="absolute top-5 right-5 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
