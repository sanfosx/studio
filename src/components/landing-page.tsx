'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-provider';
import { Logo } from '@/components/icons';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const menuItems = [
  { name: 'Tacos al Pastor', description: 'Classic marinated pork tacos with pineapple.', price: '$3.50', image: 'https://placehold.co/600x400.png', hint: 'tacos pastor' },
  { name: 'Guacamole & Chips', description: 'Freshly made guacamole with crispy tortilla chips.', price: '$8.00', image: 'https://placehold.co/600x400.png', hint: 'guacamole chips' },
  { name: 'Enchiladas Verdes', description: 'Corn tortillas filled with chicken, topped with green salsa.', price: '$12.50', image: 'https://placehold.co/600x400.png', hint: 'enchiladas verdes' },
  { name: 'Margarita Clásica', description: 'Tequila, lime juice, and triple sec.', price: '$9.00', image: 'https://placehold.co/600x400.png', hint: 'margarita cocktail' },
];

export default function LandingPage() {
  const { t, language, setLanguage } = useLanguage();

  const translations = {
    en: {
      heroTitle: 'Authentic Flavors, Modern Experience',
      heroSubtitle: 'Discover the best traditional cuisine with a contemporary twist. Reserve your table or order online.',
      reserve: 'Reserve a Table',
      order: 'Order Online',
      aboutUs: 'About Us',
      aboutText: 'Sabores en Línea was born from a passion for authentic food and the desire to share it with the world. Our story began in the heart of the city, with a small kitchen and a big dream: to bring the traditional recipes of our grandmothers to every table, combining them with a modern and cozy atmosphere. We value fresh ingredients, traditional cooking techniques, and, above all, the joy of sharing a good meal with loved ones.',
      ourMenu: 'Our Menu',
      menuText: 'A selection of our most beloved dishes.',
      contact: 'Contact & Location',
      address: '123 Flavor St, Foodie City, 12345',
      phone: '+1 (234) 567-890',
      email: 'reservations@sabores.com',
      adminLogin: 'Admin Login',
      english: 'English',
      spanish: 'Spanish',
      home: 'Home',
    },
    es: {
      heroTitle: 'Sabores Auténticos, Experiencia Moderna',
      heroSubtitle: 'Descubre la mejor cocina tradicional con un toque contemporáneo. Reserva tu mesa o pide en línea.',
      reserve: 'Reservar Mesa',
      order: 'Pedir Online',
      aboutUs: 'Quiénes Somos',
      aboutText: 'Sabores en Línea nace de la pasión por la comida auténtica y el deseo de compartirla con el mundo. Nuestra historia comenzó en el corazón de la ciudad, con una pequeña cocina y un gran sueño: llevar las recetas tradicionales de nuestras abuelas a cada mesa, combinándolas con un ambiente moderno y acogedor. Valoramos los ingredientes frescos, las técnicas de cocina de siempre y, sobre todo, la alegría de compartir una buena comida con los seres queridos.',
      ourMenu: 'Nuestro Menú',
      menuText: 'Una selección de nuestros platos más queridos.',
      contact: 'Contacto y Ubicación',
      address: 'Calle del Sabor 123, Ciudad Foodie, 12345',
      phone: '+1 (234) 567-890',
      email: 'reservas@sabores.com',
      adminLogin: 'Acceso Admin',
      english: 'Inglés',
      spanish: 'Español',
      home: 'Inicio',
    }
  }

  const T = translations[language];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="#" className="flex items-center gap-2">
            <Logo className="size-8 text-primary" />
            <span className="text-xl font-bold font-headline text-primary">{t('app_name')}</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">{T.aboutUs}</Link>
            <Link href="#menu" className="text-sm font-medium hover:text-primary transition-colors">{T.ourMenu}</Link>
            <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">{T.contact}</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant={language === 'es' ? 'secondary' : 'ghost'} size="sm" onClick={() => setLanguage('es')}>{T.spanish}</Button>
            <Button variant={language === 'en' ? 'secondary' : 'ghost'} size="sm" onClick={() => setLanguage('en')}>{T.english}</Button>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/dashboard">{T.adminLogin}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] w-full text-white">
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="Restaurant Interior"
            data-ai-hint="restaurant interior"
            layout="fill"
            objectFit="cover"
            className="z-0"
          />
          <div className="absolute inset-0 bg-black/50 z-10" />
          <div className="relative z-20 flex h-full flex-col items-center justify-center text-center p-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline drop-shadow-lg">{T.heroTitle}</h1>
            <p className="mt-4 max-w-2xl text-lg md:text-xl drop-shadow-md">{T.heroSubtitle}</p>
            <div className="mt-8 flex gap-4">
              <Button size="lg" asChild><Link href="#contact">{T.reserve}</Link></Button>
              <Button size="lg" variant="secondary" asChild><Link href="#menu">{T.order}</Link></Button>
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold font-headline text-primary">{T.aboutUs}</h2>
                <p className="mt-4 text-lg text-muted-foreground">{T.aboutText}</p>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                alt="Our Team"
                data-ai-hint="restaurant staff"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section id="menu" className="py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold font-headline text-primary">{T.ourMenu}</h2>
            <p className="mt-2 text-lg text-muted-foreground">{T.menuText}</p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {menuItems.map((item) => (
                <Card key={item.name} className="text-left overflow-hidden">
                   <Image src={item.image} alt={item.name} data-ai-hint={item.hint} width={600} height={400} className="w-full h-48 object-cover" />
                  <CardHeader>
                    <CardTitle>{item.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm h-10">{item.description}</p>
                    <p className="font-bold text-primary mt-4">{item.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold font-headline text-primary text-center">{T.contact}</h2>
            <div className="mt-12 grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <MapPin className="size-6 text-primary" />
                    <p className="text-lg">{T.address}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="size-6 text-primary" />
                    <p className="text-lg">{T.phone}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Mail className="size-6 text-primary" />
                    <p className="text-lg">{T.email}</p>
                  </div>
              </div>
              <div className="h-64 md:h-full rounded-lg overflow-hidden shadow-lg">
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.086439978716!2d-122.4194156!3d37.7749295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80858064a322792b%3A0x86771120155b9a43!2sSan%20Francisco%20City%20Hall!5e0!3m2!1sen!2sus!4v1628000000000!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    title="Google Maps Location"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 border-t bg-background">
        <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} {t('app_name')}. All Rights Reserved.</p>
          <Link href="/admin/dashboard" className="text-sm text-muted-foreground hover:text-primary">{T.adminLogin}</Link>
        </div>
      </footer>
    </div>
  );
}
