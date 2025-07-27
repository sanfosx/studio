
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
import { Home, Minus, Plus, ShoppingCart, Trash2, User, LogOut, UserCircle, Bike, Store, X, Pencil, Wallet, Landmark, CreditCard, DollarSign } from 'lucide-react';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, SheetFooter, SheetClose } from './ui/sheet';
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

type ClientData = {
    address: string;
};

export default function OrderPage() {
  const { language, t } = useLanguage();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [deliveryOption, setDeliveryOption] = React.useState('pickup');
  const [paymentMethod, setPaymentMethod] = React.useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const [clientData, setClientData] = React.useState<ClientData | null>(null);
  const [deliveryAddress, setDeliveryAddress] = React.useState('');
  const [isEditingAddress, setIsEditingAddress] = React.useState(false);

  React.useEffect(() => {
    const fetchClientData = async () => {
        if(user) {
            const q = query(collection(db, "clients"), where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
                const clientDoc = querySnapshot.docs[0].data() as ClientData;
                setClientData(clientDoc);
                setDeliveryAddress(clientDoc.address || '');
                if (!clientDoc.address) {
                    setIsEditingAddress(true);
                }
            } else {
                setIsEditingAddress(true);
            }
        } else {
            setIsEditingAddress(true);
        }
    };
    fetchClientData();
  }, [user]);


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
      deliveryAddressPrompt: 'Your order will be sent to:',
      noAddressRegistered: 'No address registered. Please add one in your profile.',
      confirmOrder: 'Confirm Order',
      currentAddress: 'Current address:',
      changeAddress: 'Change',
      enterAddress: 'Enter your delivery address',
      paymentMethod: 'Payment Method',
      paymentMethodDesc: 'Please select a payment method.',
      cash: 'Cash',
      card: 'Debit/Credit Card',
      transfer: 'Bank Transfer',
      wallet: 'Virtual Wallet',
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
      deliveryAddressPrompt: 'Tu pedido se enviará a:',
      noAddressRegistered: 'No hay dirección registrada. Por favor, añade una en tu perfil.',
      confirmOrder: 'Confirmar Pedido',
      currentAddress: 'Dirección actual:',
      changeAddress: 'Cambiar',
      enterAddress: 'Ingresa tu dirección de envío',
      paymentMethod: 'Método de Pago',
      paymentMethodDesc: 'Por favor, selecciona un método de pago.',
      cash: 'Efectivo',
      card: 'Tarjeta de Débito/Crédito',
      transfer: 'Transferencia Bancaria',
      wallet: 'Billetera Virtual',
    }
  };

  const T = language === 'en' ? translations.en : translations.es;
  
  const handleOpenPlaceOrder = () => {
    if (!user) {
        toast({
            variant: 'destructive',
            title: 'Inicio de sesión requerido',
            description: 'Por favor, inicia sesión para realizar un pedido.',
        });
        router.push('/login');
        return false;
    }
    if (clientData?.address) {
        setDeliveryAddress(clientData.address);
        setIsEditingAddress(false);
    } else {
        setDeliveryAddress('');
        setIsEditingAddress(true);
    }
    return true;
  };

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
    let orderDescription = `${deliveryOption === 'pickup' ? T.pickup : `${T.delivery} a ${deliveryAddress}`}`;
    orderDescription += `, ${t('payment_method')}: ${paymentMethod}`;
    toast({
        title: T.orderPlaced,
        description: `${T.orderPlacedDesc}`,
    });
    setCart([]);
    setPaymentMethod(null);
    setDeliveryOption('pickup');
    setIsCartOpen(false);
  }

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const isOrderReady = (deliveryOption === 'pickup' || (deliveryOption === 'delivery' && deliveryAddress.trim())) && paymentMethod;


  const renderMenuItems = (items: MenuItem[]) => (
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
            <h1 className="text-4xl font-extrabold font-headline mb-8">{T.orderOnline}</h1>
              <div className="text-center">
                <Tabs defaultValue="pizzas" className="w-full">
                  <TabsList className="bg-transparent border-2 border-primary/20 p-1 rounded-full mb-8">
                    <TabsTrigger value="pizzas" className="rounded-full">{T.pizzas}</TabsTrigger>
                    <TabsTrigger value="snacks" className="rounded-full">{T.snacks}</TabsTrigger>
                    <TabsTrigger value="drinks" className="rounded-full">{language === 'es' ? T.bebidas : T.drinks}</TabsTrigger>
                    <TabsTrigger value="desserts" className="rounded-full">{language === 'es' ? T.postres : T.desserts}</TabsTrigger>
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
                <SheetTitle className="flex items-center gap-2">
                     <ShoppingCart />
                    {T.yourOrder}
                </SheetTitle>
            </SheetHeader>
             <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                <div className="flex flex-col h-full items-center justify-center text-center">
                    <ShoppingCart className="h-16 w-16 text-muted-foreground" />
                    <p className="text-muted-foreground text-center mt-4">{T.emptyCart}</p>
                </div>
                ) : (
                <div className="space-y-4 pr-4">
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
                        <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="lg" className="w-full mt-4" onClick={(e) => {
                                if (!handleOpenPlaceOrder()) {
                                    e.preventDefault();
                                }
                            }}>{T.placeOrder}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>{T.confirmOrder}</AlertDialogTitle>
                            </AlertDialogHeader>
                           
                           <div className="space-y-6">
                            <div>
                                <Label className='font-semibold'>{T.deliveryMethod}</Label>
                                <RadioGroup defaultValue={deliveryOption} onValueChange={setDeliveryOption} className='mt-2 space-y-2'>
                                <Label htmlFor="pickup" className="flex items-center gap-4 p-3 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                                    <Store className='text-primary' />
                                    <p className='flex-1 font-medium'>{T.pickup}</p>
                                    <RadioGroupItem value="pickup" id="pickup" />
                                </Label>
                                <Label htmlFor="delivery" className="flex flex-col items-start gap-3 p-3 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                                    <div className='flex items-center w-full'>
                                        <Bike className='text-primary mr-4'/>
                                        <p className='flex-1 font-medium'>{T.delivery}</p>
                                        <RadioGroupItem value="delivery" id="delivery" />
                                    </div>
                                    {deliveryOption === 'delivery' && (
                                        <div className="w-full pl-8 space-y-2">
                                            {isEditingAddress ? (
                                                <Input 
                                                    value={deliveryAddress}
                                                    onChange={(e) => setDeliveryAddress(e.target.value)}
                                                    placeholder={T.enterAddress}
                                                    className="w-full"
                                                    autoFocus
                                                />
                                            ) : (
                                                <div className='flex items-center w-full'>
                                                    <p className='text-sm text-muted-foreground flex-1'>
                                                        {T.currentAddress} <span className='font-medium text-foreground'>{deliveryAddress}</span>
                                                    </p>
                                                    <Button variant="link" size="sm" onClick={() => setIsEditingAddress(true)}>
                                                        <Pencil className="mr-2 h-3 w-3" />
                                                        {T.changeAddress}
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Label>
                                </RadioGroup>
                            </div>
                            
                            <div>
                                <Label className='font-semibold'>{t('paymentMethod')}</Label>
                                <RadioGroup onValueChange={setPaymentMethod} className='mt-2 space-y-2'>
                                    <Label htmlFor="cash" className="flex items-center gap-4 p-3 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                                        <DollarSign className='text-primary' />
                                        <p className='flex-1 font-medium'>{t('cash')}</p>
                                        <RadioGroupItem value="cash" id="cash" />
                                    </Label>
                                    <Label htmlFor="card" className="flex items-center gap-4 p-3 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                                        <CreditCard className='text-primary' />
                                        <p className='flex-1 font-medium'>{t('card')}</p>
                                        <RadioGroupItem value="card" id="card" />
                                    </Label>
                                    <Label htmlFor="transfer" className="flex items-center gap-4 p-3 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                                        <Landmark className='text-primary' />
                                        <p className='flex-1 font-medium'>{t('transfer')}</p>
                                        <RadioGroupItem value="transfer" id="transfer" />
                                    </Label>
                                    <Label htmlFor="wallet" className="flex items-center gap-4 p-3 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                                        <Wallet className='text-primary' />
                                        <p className='flex-1 font-medium'>{t('wallet')}</p>
                                        <RadioGroupItem value="wallet" id="wallet" />
                                    </Label>
                                </RadioGroup>
                            </div>

                           </div>

                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={handleConfirmOrder}
                                disabled={!isOrderReady}
                            >
                                {T.confirmOrder}
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </SheetFooter>
            )}
       </SheetContent>
      </Sheet>
    </div>
  );
}

    

    