import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useSubmitQuoteRequest, useListServices } from '@workspace/api-client-react';
import { Loader2, CheckCircle2, MapPin, Phone, Mail } from 'lucide-react';

export default function Contact() {
  const { data: services } = useListServices();
  const submitQuote = useSubmitQuoteRequest();
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    industry: '',
    message: '',
    website: '' // honeypot
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.website !== '') return; // block bots

    submitQuote.mutate({
      data: {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        industry: formData.industry,
        message: formData.message,
        serviceInterest: selectedServices,
        honeypot: formData.website
      }
    }, {
      onSuccess: () => setIsSuccess(true)
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleService = (slug: string) => {
    setSelectedServices(prev => 
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <section className="pt-32 pb-20 bg-foreground text-white relative">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <h1 className="font-display font-bold text-4xl md:text-5xl max-w-2xl mb-6">
            Let's build your infrastructure.
          </h1>
          <p className="text-lg text-white/70 max-w-xl">
            Request a quote or contact our engineering team to discuss your project requirements.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full spectrum-rule"></div>
      </section>

      <section className="py-20 flex-grow">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-5 gap-16">
            
            {/* Contact Info (Left) */}
            <div className="lg:col-span-2 space-y-12">
              <div>
                <h2 className="font-display font-bold text-2xl mb-8">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-mono-label text-muted-foreground mb-1 block">CALL US</p>
                      <p className="font-medium text-foreground text-lg">+267 74 259 012</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-mono-label text-muted-foreground mb-1 block">EMAIL</p>
                      <p className="font-medium text-foreground text-lg">info@constructech.co.bw</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-mono-label text-muted-foreground mb-1 block">ADDRESS</p>
                      <p className="font-medium text-foreground text-lg">P O Box 2059<br />Mahalapye, Botswana</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botswana Silhouette Accent */}
              <div className="hidden lg:block pt-8 border-t border-border">
                <svg viewBox="0 0 100 100" className="w-32 h-32 text-muted fill-current opacity-50">
                  <path d="M50 0 C77.6 0 100 22.4 100 50 C100 77.6 77.6 100 50 100 C22.4 100 0 77.6 0 50 C0 22.4 22.4 0 50 0 Z" />
                  {/* Simplified generic shape just to have something visual since we don't have a real map SVG handy */}
                </svg>
                <p className="mt-4 font-mono-label text-muted-foreground">PROUDLY BOTSWANA</p>
              </div>
            </div>

            {/* Form (Right) */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border p-8 rounded-xl shadow-sm">
                {isSuccess ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="font-display font-bold text-2xl mb-4">Request Received</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Thank you for contacting Constructatech Ventures. Our engineering team is reviewing your requirements and will be in touch within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Name <span className="text-destructive">*</span></label>
                        <input required name="name" value={formData.name} onChange={handleChange} className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Company <span className="text-destructive">*</span></label>
                        <input required name="company" value={formData.company} onChange={handleChange} className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Email <span className="text-destructive">*</span></label>
                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Phone <span className="text-destructive">*</span></label>
                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full h-10 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all" />
                      </div>
                    </div>

                    {/* Honeypot */}
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} value={formData.website} onChange={handleChange} />

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">Service Interest (Select all that apply)</label>
                      <div className="grid md:grid-cols-2 gap-3">
                        {services?.map(s => (
                          <label key={s.slug} className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${selectedServices.includes(s.slug) ? 'border-primary bg-primary/5' : 'border-input hover:bg-muted/50'}`}>
                            <input 
                              type="checkbox" 
                              className="accent-primary w-4 h-4 rounded border-input"
                              checked={selectedServices.includes(s.slug)}
                              onChange={() => toggleService(s.slug)}
                            />
                            <span className="text-sm font-medium text-foreground">{s.title}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">Project Details <span className="text-destructive">*</span></label>
                      <textarea 
                        required 
                        name="message" 
                        value={formData.message} 
                        onChange={handleChange} 
                        rows={5}
                        placeholder="Tell us about your infrastructure needs, timeline, and any specific requirements..."
                        className="w-full p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none" 
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={submitQuote.isPending}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-md font-bold transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                      {submitQuote.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                      Submit Request
                    </button>
                    
                    {submitQuote.isError && (
                      <p className="text-sm text-destructive text-center">There was an error submitting your request. Please try again.</p>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
