
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
import { Home, Minus, Plus, ShoppingCart, Trash2, User, LogOut, UserCircle, Bike, Store } from 'lucide-react';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

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
  const { language } = useLanguage();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [deliveryOption, setDeliveryOption] = React.useState('pickup');


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
      orderPlaced: 'Order Placed!',
      orderPlacedDesc: 'Your order has been successfully placed.',
      myProfile: 'My Profile',
      logout: 'Logout',
      deliveryMethod: 'Delivery Method',
      deliveryMethodDesc: 'How would you like to receive your order?',
      pickup: 'Store Pickup',
      delivery: 'Home Delivery',
      deliveryAddress: 'Your order will be sent to: 123 Main St, Anytown, USA.',
      confirmOrder: 'Confirm Order'
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
      orderPlaced: '¡Pedido Realizado!',
      orderPlacedDesc: 'Tu pedido ha sido realizado con éxito.',
      myProfile: 'Mi Perfil',
      logout: 'Cerrar Sesión',
      deliveryMethod: 'Método de Entrega',
      deliveryMethodDesc: '¿Cómo te gustaría recibir tu pedido?',
      pickup: 'Retiro en local',
      delivery: 'Envío a domicilio',
      deliveryAddress: 'Tu pedido se enviará a: Av. Siempre Viva 742, Springfield.',
      confirmOrder: 'Confirmar Pedido'
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

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subtotal * 0.05;
  const total = subtotal + tax;
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleConfirmOrder = () => {
    toast({
        title: T.orderPlaced,
        description: `${T.orderPlacedDesc} (${deliveryOption === 'pickup' ? T.pickup : T.delivery})`,
    });
    setCart([]);
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };


  const renderMenuCategory = (title: string, items: MenuItem[]) => (
    <div id={title.toLowerCase()} className="mb-12">
      <h2 className="text-3xl font-bold font-headline text-primary mb-8">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map(item => (
          <Card key={item.id} className="flex flex-col">
            <Image src={item.image} alt={item.name} data-ai-hint={item.hint} width={600} height={400} className="w-full h-48 object-cover rounded-t-lg" />
            <CardHeader>
              <CardTitle>{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-muted-foreground text-sm">{item.description}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <p className="font-bold text-lg text-primary">${item.price.toFixed(2)}</p>
              <Button onClick={() => handleAddToCart(item)}>{T.addToCart}</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="size-8 text-primary" />
            <span className="text-xl font-bold font-headline text-primary">Pizzeria Los Genios</span>
          </Link>
          <div className="flex items-center gap-2">
             <Button variant="ghost" asChild>
                <Link href="/">
                    <Home className='mr-2'/>
                    Home
                </Link>
            </Button>
            <div className="relative">
                <Button variant="ghost" size="icon" aria-label="Shopping Cart">
                    <ShoppingCart />
                    {totalItems > 0 && (
                        <Badge variant="destructive" className="absolute -right-2 -top-2 h-6 w-6 rounded-full flex items-center justify-center">
                            {totalItems}
                        </Badge>
                    )}
                </Button>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
          <main className="lg:col-span-2">
            <h1 className="text-4xl font-extrabold font-headline mb-8">{T.orderOnline}</h1>
            {renderMenuCategory(T.pizzas, menuData.pizzas)}
            {renderMenuCategory(T.snacks, menuData.snacks)}
            {renderMenuCategory(language === 'es' ? 'Bebidas' : 'Drinks', menuData.drinks)}
            {renderMenuCategory(language === 'es' ? 'Postres' : 'Desserts', menuData.desserts)}
          </main>

          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShoppingCart />
                    {T.yourOrder}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {cart.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">{T.emptyCart}</p>
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
                </CardContent>
                {cart.length > 0 && (
                  <CardFooter className="flex-col items-stretch space-y-4 pt-4">
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
                     <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button size="lg" className="w-full mt-4">{T.placeOrder}</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{T.deliveryMethod}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {T.deliveryMethodDesc}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <RadioGroup defaultValue={deliveryOption} onValueChange={setDeliveryOption} className='my-4 space-y-4'>
                          <Label htmlFor="pickup" className="flex items-center gap-4 p-4 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                             <Store className='text-primary' />
                             <div className='flex-1'>
                                <p className='font-semibold'>{T.pickup}</p>
                             </div>
                             <RadioGroupItem value="pickup" id="pickup" />
                          </Label>
                           <Label htmlFor="delivery" className="flex items-center gap-4 p-4 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                              <Bike className='text-primary'/>
                             <div className='flex-1'>
                                <p className='font-semibold'>{T.delivery}</p>
                                {deliveryOption === 'delivery' && (
                                     <p className='text-xs text-muted-foreground mt-1'>{T.deliveryAddress}</p>
                                )}
                             </div>
                             <RadioGroupItem value="delivery" id="delivery" />
                          </Label>
                        </RadioGroup>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={handleConfirmOrder}>
                            {T.confirmOrder}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                )}
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
