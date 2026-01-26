'use client';

import { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { contactEmailSchema } from '@/lib/validation/contact.schemas';
import { track } from '@/lib/analytics';

export function Contact() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsSubmitting(true);

    const validation = contactEmailSchema.safeParse({ email });
    if (!validation.success) {
      setError(validation.error.issues[0]?.message || 'Email inválido');
      setIsSubmitting(false);
      return;
    }

    // Simular envío (frontend only por ahora)
    setTimeout(() => {
      setSuccess(true);
      setEmail('');
      setIsSubmitting(false);
      
      // Track form submission
      track('contact_form_submit', {
        location: 'contact_section',
      });
    }, 500);
  };

  return (
    <section id="contacto" className="py-20 sm:py-24 lg:py-32">
      <Container>
        <div className="max-w-2xl mx-auto text-center space-y-8 px-4 sm:px-0">
          <div>
            <SectionHeading>Contacto</SectionHeading>
            <h3 className="mt-4 text-2xl font-semibold text-slate-900">
              ¡Resolvemos tus dudas!
            </h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              disabled={isSubmitting}
              required
            />
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'ENVIAR'}
            </Button>
          </form>
          {success && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
              Gracias, te contactaremos en breve.
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

