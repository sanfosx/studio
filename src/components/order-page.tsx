
'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-provider';
import { Logo } from '@/components/icons';
import { LanguageSwitcher, ThemeToggle } from './header';
import { useAuth } from '@/contexts/auth-provider';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Home, Minus, Plus, ShoppingCart, Trash2, User, LogOut, UserCircle } from 'lucide-react';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from './ui/sheet';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from './ui/input';

const menuData = {
  pizzas: [
    { id: 'p1', name: 'Pizza Margherita', description: 'Classic pizza with tomato, mozzarella, and basil.', price: 12.50, image: 'https://placehold.co/600x400.png', hint: 'pizza margherita' },
    { id: 'p2', name: 'Pizza Pepperoni', description: 'The all-time favorite, covered in pepperoni.', price: 14.00, image: 'https://placehold.co/600x400.png', hint: 'pepperoni pizza' },
    { id: 'p3', name: 'Genius Special', description: 'A secret recipe that will blow your mind.', price: 18.00, image: 'https://placehold.co/600x400.png', hint: 'specialty pizza' },
    { id: 'p4', name: 'Veggie Supreme', description: 'Loaded with all the best vegetables.', price: 15.50, image: 'https://placehold.co/600x400.png', hint: 'vegetarian pizza' },
  ],
  snacks: [
    { id: 's1', name: 'Garlic Bread', description: 'Toasted bread with garlic butter and herbs.', price: 6.00, image: 'https://placehold.co/600x400.png', hint: 'garlic bread' },
    { id: 's2', name: 'Mozzarella Sticks', description: 'Fried cheese sticks served with marinara sauce.', price: 8.00, image: 'https://placehold.co/600x400.png', hint: 'mozzarella sticks' },
    { id: 's3', name: 'Chicken Wings', description: 'Spicy and tangy, perfect for sharing.', price: 10.00, image: 'https://placehold.co/600x400.png', hint: 'chicken wings' },
  ],
  drinks: [
    { id: 'd1', name: 'Coca-Cola', description: 'Classic soft drink.', price: 2.50, image: 'https://placehold.co/600x400.png', hint: 'soda can' },
    { id: 'd2', name: 'Fresh Lemonade', description: 'Homemade with fresh lemons.', price: 3.50, image: 'https://placehold.co/600x400.png', hint: 'lemonade glass' },
  ],
  desserts: [
    { id: 'ds1', name: 'Tiramisu', description: 'A coffee-flavored Italian dessert.', price: 7.50, image: 'https://placehold.co/600x400.png', hint: 'tiramisu slice' },
    { id: 'ds2', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center.', price: 8.50, image: 'https://placehold.co/600x400.png', hint: 'lava cake' },
  ]
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  hint: string;
};

type CartItem = MenuItem & {
  quantity: number;
};

export default function OrderPage() {
  const { language, t } = useLanguage();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const translations = {
    en: {
      orderOnline: 'Order Online',
      yourOrder: 'Your Order',
      pizzas: 'Pizzas',
      snacks: 'Snacks',
      drinks: 'Drinks',
      desserts: 'Desserts',
      addToCart: 'Add to Cart',
      emptyCart: 'Your cart is empty.',
      subtotal: 'Subtotal',
      tax: 'Tax (5%)',
      total: 'Total',
      placeOrder: 'Place Order',
      myProfile: 'My Profile',
      logout: 'Logout',
      menu: "Menu",
      clearCart: 'Clear Cart',
      clearCartConfirmationTitle: 'Are you sure?',
      clearCartConfirmationDescription: 'This action will remove all items from your cart.',
    },
    es: {
      orderOnline: 'Pedir Online',
      yourOrder: 'Tu Pedido',
      pizzas: 'Pizzas',
      snacks: 'Snacks',
      bebidas: 'Bebidas',
      postres: 'Postres',
      addToCart: 'Añadir al Carrito',
      emptyCart: 'Tu carrito está vacío.',
      subtotal: 'Subtotal',
      impuestos: 'Impuestos (5%)',
      total: 'Total',
      placeOrder: 'Realizar Pedido',
      myProfile: 'Mi Perfil',
      logout: 'Cerrar Sesión',
      menu: "Menú",
      clearCart: 'Vaciar Carrito',
      clearCartConfirmationTitle: '¿Estás seguro?',
      clearCartConfirmationDescription: 'Esta acción eliminará todos los productos de tu carrito.',
    }
  };

  const T = language === 'en' ? translations.en : translations.es;
  

  const handleAddToCart = (item: MenuItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
        setCart(prevCart => prevCart.filter(item => item.id !== id));
    } else {
        setCart(prevCart =>
            prevCart.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    }
  };

  const handleClearCart = () => {
    setCart([]);
  }

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const renderMenuItems = (items: MenuItem[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {items.map((item, index) => (
        <Card key={item.id} className="text-left overflow-hidden bg-card/60 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-primary/20 transition-all duration-300 hover:scale-105 h-96 flex flex-col">
            <div className='h-1/2 w-full'>
                <Image src={item.image} alt={item.name} data-ai-hint={item.hint} width={600} height={400} className="w-full h-full object-cover" />
            </div>
            <div className='flex flex-col flex-1'>
                <CardHeader className="p-4">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-1">
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                    <p className="font-bold text-primary mt-2">${item.price.toFixed(2)}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-center">
                    <Button onClick={() => handleAddToCart(item)}>{T.addToCart}</Button>
                </CardFooter>
            </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
       <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="size-8 text-primary" />
            <span className="text-xl font-bold font-headline text-primary">Pizzeria Los Genios</span>
          </Link>
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="icon" asChild>
                <Link href="/">
                    <Home />
                    <span className="sr-only">Home</span>
                </Link>
            </Button>
            <div className="relative">
              <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="Shopping Cart">
                      <ShoppingCart />
                  </Button>
              </SheetTrigger>
               {totalItems > 0 && (
                  <Badge variant="destructive" className="absolute -right-2 -top-2 h-6 w-6 rounded-full flex items-center justify-center pointer-events-none">
                      {totalItems}
                  </Badge>
              )}
            </div>
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                           <UserCircle className="h-full w-full"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user.displayName || user.email}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                           <Link href="/profile">
                                <User className="mr-2 h-4 w-4" />
                                <span>{T.myProfile}</span>
                           </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>{T.logout}</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : null}
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="container mx-auto flex-1 px-4 md:px-6 py-8">
        <main>
            <h1 className="text-4xl font-extrabold font-headline mb-8">{T.menu}</h1>
              <div className="text-center">
                <Tabs defaultValue="pizzas" className="w-full">
                  <TabsList className="bg-transparent border-2 border-primary/20 p-1 rounded-full mb-8">
                    <TabsTrigger value="pizzas" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{T.pizzas}</TabsTrigger>
                    <TabsTrigger value="snacks" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{T.snacks}</TabsTrigger>
                    <TabsTrigger value="drinks" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{language === 'es' ? T.bebidas : T.drinks}</TabsTrigger>
                    <TabsTrigger value="desserts" className="rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">{language === 'es' ? T.postres : T.desserts}</TabsTrigger>
                  </TabsList>
                  <TabsContent value="pizzas">
                    {renderMenuItems(menuData.pizzas)}
                  </TabsContent>
                  <TabsContent value="snacks">
                    {renderMenuItems(menuData.snacks)}
                  </TabsContent>
                  <TabsContent value="drinks">
                    {renderMenuItems(menuData.drinks)}
                  </TabsContent>
                  <TabsContent value="desserts">
                    {renderMenuItems(menuData.desserts)}
                  </TabsContent>
                </Tabs>
              </div>
          </main>
      </div>

       <SheetContent className="flex flex-col">
            <SheetHeader>
                <div className="flex justify-between items-center">
                    <SheetTitle className="flex items-center gap-2">
                        <ShoppingCart />
                        {T.yourOrder}
                    </SheetTitle>
                    {cart.length > 0 && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" title={T.clearCart}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>{T.clearCartConfirmationTitle}</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        {T.clearCartConfirmationDescription}
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleClearCart} className="bg-destructive hover:bg-destructive/90">
                                        {t('delete')}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                </div>
            </SheetHeader>
             <div className="flex-1 overflow-y-auto pr-4">
                {cart.length === 0 ? (
                <div className="flex flex-col h-full items-center justify-center text-center">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                    <p className="text-muted-foreground text-center mt-4">{T.emptyCart}</p>
                </div>
                ) : (
                <div className="space-y-4">
                    {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between">
                        <div className='flex-1'>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <span>{item.quantity}</span>
                        <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}>
                            <Plus className="h-4 w-4" />
                        </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600" onClick={() => handleUpdateQuantity(item.id, 0)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                        </div>
                        <p className="w-16 text-right font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                    ))}
                </div>
                )}
            </div>
            {cart.length > 0 && (
                <SheetFooter>
                    <div className="flex-col items-stretch space-y-4 pt-4 w-full">
                        <Separator />
                        <div className="flex justify-between">
                        <span>{T.subtotal}</span>
                        <span>${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{language === 'es' ? T.impuestos : T.tax}</span>
                        <span>${tax.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-bold text-lg">
                        <span>{T.total}</span>
                        <span>${total.toFixed(2)}</span>
                        </div>
                        <Button size="lg" className="w-full mt-4" asChild>
                            <Link href="/cart">{T.placeOrder}</Link>
                        </Button>
                    </div>
                </SheetFooter>
            )}
       </SheetContent>
      </Sheet>
    </div>
  );
}
