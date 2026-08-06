import React, { useState } from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { useSubmitQuoteRequest, useListServices } from '@workspace/api-client-react';
import { Loader2, CheckCircle2, MapPin, Phone, Mail } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

export default function Contact() {
  const { data: services } = useListServices();
  const submitQuote = useSubmitQuoteRequest();

  const [formData, setFormData] = useState({
    name: '', company: '', email: '', phone: '',
    industry: '', message: '', website: '', // website = honeypot
  });
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.website !== '') return;

    submitQuote.mutate({
      data: {
        name: formData.name,
        company: formData.company,
        email: formData.email,
        phone: formData.phone,
        industry: formData.industry,
        message: formData.message,
        serviceInterest: selectedServices,
        honeypot: formData.website,
      },
    }, { onSuccess: () => setIsSuccess(true) });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleService = (slug: string) => {
    setSelectedServices(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug],
    );
  };

  const inputCls = 'w-full h-11 px-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero */}
      <section className="pt-28 md:pt-32 pb-14 md:pb-20 bg-background text-foreground relative">
        <div className="container mx-auto px-5 md:px-6 relative z-10">
          <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl max-w-2xl mb-4 md:mb-6">
            Let's build your infrastructure.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl">
            Request a quote or contact our engineering team to discuss your project requirements.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full spectrum-rule" />
      </section>

      <section className="py-12 md:py-20 flex-grow">
        <div className="container mx-auto px-5 md:px-6">
          <div className="grid lg:grid-cols-5 gap-10 md:gap-16">

            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-8 md:space-y-12">
              <DotLottieReact
                src="https://lottie.host/3c81c6d6-065f-4e3c-8345-591acde3a786/Ig244SMbea.lottie"
                loop
                autoplay
                className="w-full h-40 sm:h-52 md:h-64 lg:h-72"
                aria-hidden="true"
              />

              <div>
                <h2 className="font-display font-bold text-xl md:text-2xl mb-6 md:mb-8">Contact Information</h2>
                <div className="space-y-5 md:space-y-6">
                  {[
                    { icon: Phone, label: 'CALL US', value: '+267 74 259 012', href: 'tel:+26774259012' },
                    { icon: Mail, label: 'EMAIL', value: 'info@constructech.co.bw', href: 'mailto:info@constructech.co.bw' },
                    { icon: MapPin, label: 'ADDRESS', value: 'P O Box 2059\nMahalapye, Botswana', href: null },
                  ].map(({ icon: Icon, label, value, href }) => (
                    <div key={label} className="flex items-start gap-4">
                      <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-mono-label text-muted-foreground mb-0.5 block text-xs">{label}</p>
                        {href ? (
                          <a href={href} className="font-medium text-foreground text-base md:text-lg hover:text-primary transition-colors">
                            {value}
                          </a>
                        ) : (
                          <p className="font-medium text-foreground text-base md:text-lg whitespace-pre-line">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden lg:block pt-4 border-t border-border">
                <svg viewBox="0 0 100 100" className="w-28 h-28 text-muted fill-current opacity-30">
                  <path d="M50 0 C77.6 0 100 22.4 100 50 C100 77.6 77.6 100 50 100 C22.4 100 0 77.6 0 50 C0 22.4 22.4 0 50 0 Z" />
                </svg>
                <p className="mt-3 font-mono-label text-muted-foreground text-xs">PROUDLY BOTSWANA</p>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="bg-card border border-border p-5 sm:p-7 md:p-8 rounded-xl shadow-sm">
                {isSuccess ? (
                  <div className="text-center py-12 md:py-16">
                    <div className="w-14 h-14 md:w-16 md:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 md:mb-6">
                      <CheckCircle2 className="w-7 h-7 md:w-8 md:h-8 text-green-600" />
                    </div>
                    <h3 className="font-display font-bold text-xl md:text-2xl mb-3 md:mb-4">Request Received</h3>
                    <p className="text-muted-foreground max-w-md mx-auto text-sm md:text-base">
                      Thank you for contacting Constructatech Ventures. Our engineering team is reviewing your requirements and will be in touch within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Name <span className="text-destructive">*</span></label>
                        <input required name="name" value={formData.name} onChange={handleChange} className={inputCls} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Company <span className="text-destructive">*</span></label>
                        <input required name="company" value={formData.company} onChange={handleChange} className={inputCls} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Email <span className="text-destructive">*</span></label>
                        <input required type="email" name="email" value={formData.email} onChange={handleChange} className={inputCls} />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-foreground">Phone <span className="text-destructive">*</span></label>
                        <input required type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputCls} />
                      </div>
                    </div>

                    {/* Honeypot */}
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ display: 'none' }} value={formData.website} onChange={handleChange} />

                    <div className="space-y-2.5">
                      <label className="text-sm font-medium text-foreground">Service Interest <span className="text-muted-foreground font-normal">(select all that apply)</span></label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 md:gap-3">
                        {services?.map(s => (
                          <label
                            key={s.slug}
                            className={`flex items-center gap-3 p-3 rounded-md border cursor-pointer transition-colors ${
                              selectedServices.includes(s.slug) ? 'border-primary bg-primary/5' : 'border-input hover:bg-muted/50'
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="accent-primary w-4 h-4 rounded border-input shrink-0"
                              checked={selectedServices.includes(s.slug)}
                              onChange={() => toggleService(s.slug)}
                            />
                            <span className="text-sm font-medium text-foreground leading-snug">{s.title}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Project Details <span className="text-destructive">*</span></label>
                      <textarea
                        required
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell us about your infrastructure needs, timeline, and any specific requirements…"
                        className="w-full p-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submitQuote.isPending}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-md font-bold transition-all disabled:opacity-70 flex items-center justify-center gap-2 text-sm md:text-base"
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
