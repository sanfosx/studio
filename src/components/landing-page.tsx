'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-provider';
import { Logo } from '@/components/icons';
import { MapPin, Phone, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { LanguageSwitcher, ThemeToggle } from './header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from '@/lib/utils';

const menu = {
  pizzas: [
    { name: 'Pizza Margherita', description: 'Classic pizza with tomato, mozzarella, and basil.', price: '$12.50', image: 'https://placehold.co/600x400.png', hint: 'pizza margherita' },
    { name: 'Pizza Pepperoni', description: 'The all-time favorite, covered in pepperoni.', price: '$14.00', image: 'https://placehold.co/600x400.png', hint: 'pepperoni pizza' },
    { name: 'Genius Special', description: 'A secret recipe that will blow your mind.', price: '$18.00', image: 'https://placehold.co/600x400.png', hint: 'specialty pizza' },
    { name: 'Veggie Supreme', description: 'Loaded with all the best vegetables.', price: '$15.50', image: 'https://placehold.co/600x400.png', hint: 'vegetarian pizza' },
  ],
  snacks: [
    { name: 'Garlic Bread', description: 'Toasted bread with garlic butter and herbs.', price: '$6.00', image: 'https://placehold.co/600x400.png', hint: 'garlic bread' },
    { name: 'Mozzarella Sticks', description: 'Fried cheese sticks served with marinara sauce.', price: '$8.00', image: 'https://placehold.co/600x400.png', hint: 'mozzarella sticks' },
    { name: 'Chicken Wings', description: 'Spicy and tangy, perfect for sharing.', price: '$10.00', image: 'https://placehold.co/600x400.png', hint: 'chicken wings' },
  ],
  drinks: [
    { name: 'Coca-Cola', description: 'Classic soft drink.', price: '$2.50', image: 'https://placehold.co/600x400.png', hint: 'soda can' },
    { name: 'Fresh Lemonade', description: 'Homemade with fresh lemons.', price: '$3.50', image: 'https://placehold.co/600x400.png', hint: 'lemonade glass' },
    { name: 'Craft Beer', description: 'Local craft beer selection.', price: '$7.00', image: 'https://placehold.co/600x400.png', hint: 'beer pint' },
  ],
  desserts: [
    { name: 'Tiramisu', description: 'A coffee-flavored Italian dessert.', price: '$7.50', image: 'https://placehold.co/600x400.png', hint: 'tiramisu slice' },
    { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center.', price: '$8.50', image: 'https://placehold.co/600x400.png', hint: 'lava cake' },
  ]
};

export default function LandingPage() {
  const { language } = useLanguage();

  const translations = {
    en: {
      heroTitle: 'Ingeniously Good Pizzas',
      heroSubtitle: 'Discover the art of pizza making. Order online or visit us!',
      reserve: 'Book a Table',
      order: 'Order Online',
      aboutUs: 'About Us',
      aboutText: 'Pizzeria Los Genios was born from a passion for authentic Italian pizza and the desire to share it with the world. Our story began in the heart of the city, with a small kitchen and a big dream: to bring the traditional recipes of our grandmothers to every table, combining them with a modern and cozy atmosphere. We value fresh ingredients, traditional cooking techniques, and, above all, the joy of sharing a good meal with loved ones.',
      ourMenu: 'Our Menu',
      menuText: 'A selection of our most beloved dishes.',
      contact: 'Contact & Location',
      address: '123 Genius Ave, Pizza City, 12345',
      phone: '+1 (234) 567-890',
      email: 'reservations@pizzerialosgenios.com',
      register: 'Sign Up',
      home: 'Home',
      pizzas: 'Pizzas',
      snacks: 'Snacks',
      drinks: 'Drinks',
      desserts: 'Desserts',
    },
    es: {
      heroTitle: 'Pizzas Ingeniosamente Buenas',
      heroSubtitle: 'Descubre el arte de hacer pizza. ¡Pide en línea o visítanos!',
      reserve: 'Reservar Mesa',
      order: 'Pedir Online',
      aboutUs: 'Quiénes Somos',
      aboutText: 'Pizzeria Los Genios nace de la pasión por la auténtica pizza italiana y el deseo de compartirla con el mundo. Nuestra historia comenzó en el corazón de la ciudad, con una pequeña cocina y un gran sueño: llevar las recetas tradicionales de nuestras abuelas a cada mesa, combinándolas con un ambiente moderno y acogedor. Valoramos los ingredientes frescos, las técnicas de cocina de siempre y, sobre todo, la alegría de compartir una buena comida con los seres queridos.',
      ourMenu: 'Nuestro Menú',
      menuText: 'Una selección de nuestros platos más queridos.',
      contact: 'Contacto y Ubicación',
      address: 'Av. de los Genios 123, Ciudad Pizza, 12345',
      phone: '+1 (234) 567-890',
      email: 'reservas@pizzerialosgenios.com',
      register: 'Regístrate',
      home: 'Inicio',
      pizzas: 'Pizzas',
      snacks: 'Snacks',
      bebidas: 'Bebidas',
      postres: 'Postres',
    }
  }

  const T = translations[language];

  const renderMenuItems = (items: typeof menu.pizzas) => (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {items.map((item, index) => (
        <Card key={item.name} className="text-left overflow-hidden bg-card/60 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105" style={{ animationDelay: `${index * 100}ms` }}>
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
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="#" className="flex items-center gap-2">
            <Logo className="size-8 text-primary" />
            <span className="text-xl font-bold font-headline text-primary">Pizzeria Los Genios</span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">{T.aboutUs}</Link>
            <Link href="#menu" className="text-sm font-medium hover:text-primary transition-colors">{T.ourMenu}</Link>
            <Link href="#contact" className="text-sm font-medium hover:text-primary transition-colors">{T.contact}</Link>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild size="sm" className="shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-shadow">
              <Link href="#">{T.register}</Link>
            </Button>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] w-full text-white">
          <Image
            src="https://placehold.co/1920x1080.png"
            alt="Restaurant Interior"
            data-ai-hint="pizzeria interior"
            fill
            className="z-0 object-cover"
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
        <section id="about" className="relative py-16 md:py-24 bg-secondary overflow-hidden">
        <div className="absolute inset-0 bg-pizza-pattern"></div>
          <div className="container relative mx-auto px-4 md:px-6">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-background/80 backdrop-blur-sm p-8 rounded-lg">
                <h2 className="text-3xl font-bold font-headline text-primary">{T.aboutUs}</h2>
                <p className="mt-4 text-lg text-muted-foreground">{T.aboutText}</p>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                alt="Our Team"
                data-ai-hint="pizza oven"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </section>

        {/* Menu Section */}
        <section id="menu" className="py-16 md:py-24 bg-gradient-to-br from-background via-secondary to-background">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold font-headline text-primary">{T.ourMenu}</h2>
            <p className="mt-2 text-lg text-muted-foreground">{T.menuText}</p>
            <Tabs defaultValue="pizzas" className="mt-8">
              <TabsList className="bg-transparent border-2 border-primary/20 p-1 rounded-full">
                <TabsTrigger value="pizzas" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{T.pizzas}</TabsTrigger>
                <TabsTrigger value="snacks" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{language === 'es' ? 'Snacks' : T.snacks}</TabsTrigger>
                <TabsTrigger value="drinks" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{language === 'es' ? 'Bebidas' : T.drinks}</TabsTrigger>
                <TabsTrigger value="desserts" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{language === 'es' ? 'Postres' : T.desserts}</TabsTrigger>
              </TabsList>
              <TabsContent value="pizzas" className="data-[state=active]:animate-fade-in">
                {renderMenuItems(menu.pizzas)}
              </TabsContent>
              <TabsContent value="snacks" className="data-[state=active]:animate-fade-in">
                {renderMenuItems(menu.snacks)}
              </TabsContent>
              <TabsContent value="drinks" className="data-[state=active]:animate-fade-in">
                {renderMenuItems(menu.drinks)}
              </TabsContent>
              <TabsContent value="desserts" className="data-[state=active]:animate-fade-in">
                {renderMenuItems(menu.desserts)}
              </TabsContent>
            </Tabs>
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
          <p className="text-sm text-muted-foreground">&copy; {new Date().getFullYear()} Pizzeria Los Genios. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
