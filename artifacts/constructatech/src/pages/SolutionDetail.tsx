import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useGetService } from '@workspace/api-client-react';
import { useParams, Link } from 'wouter';
import { Loader2, ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';

export default function SolutionDetail() {
  const params = useParams();
  const slug = params.slug || '';
  const { data: service, isLoading, isError } = useGetService(slug, { 
    query: { enabled: !!slug, queryKey: ['getService', slug] } 
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow flex justify-center items-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !service) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col justify-center items-center text-center p-6">
          <h1 className="font-display text-4xl font-bold mb-4">Solution Not Found</h1>
          <p className="text-muted-foreground mb-8">The requested service specification could not be located.</p>
          <Link href="/solutions" className="flex items-center gap-2 text-primary font-medium hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Solutions
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-20 bg-foreground text-white relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <Link href="/solutions" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-medium mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to Solutions
          </Link>
          <span className="font-mono-label text-primary mb-4 block">SOLUTION SPECIFICATION</span>
          <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl max-w-4xl mb-6">
            {service.title}
          </h1>
          <p className="text-xl text-white/70 max-w-2xl">
            {service.summary}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full spectrum-rule"></div>
      </section>

      {/* Content */}
      <section className="py-20 flex-grow">
        <div className="container mx-auto px-4 md:px-6 max-w-5xl">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 prose prose-lg dark:prose-invert">
              <h2 className="font-display text-2xl font-bold mb-6 text-foreground">Overview</h2>
              {service.body ? (
                <div dangerouslySetInnerHTML={{ __html: service.body }} />
              ) : (
                <p>Detailed technical specifications for {service.title} are currently being updated.</p>
              )}
            </div>

            <div className="space-y-8">
              <div className="bg-muted p-8 rounded-xl border border-border">
                <h3 className="font-mono-label text-foreground mb-6 block border-b border-border pb-4">INCLUDES</h3>
                <ul className="space-y-4">
                  {service.includes.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm font-medium text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-primary p-8 rounded-xl text-primary-foreground shadow-lg">
                <h3 className="font-display font-bold text-xl mb-3">Ready to deploy?</h3>
                <p className="text-primary-foreground/90 text-sm mb-6">
                  Contact our engineering team to scope your {service.title.toLowerCase()} requirements.
                </p>
                <Link 
                  href="/contact" 
                  className="bg-white text-primary px-6 py-3 rounded-md font-bold text-sm hover:bg-white/90 transition-colors w-full flex items-center justify-center gap-2"
                >
                  Request Quote <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
