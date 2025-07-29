'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/language-provider';
import { Logo } from '@/components/icons';
import { LanguageSwitcher, ThemeToggle } from '@/components/header';
import { useAuth, ProtectedRoute } from '@/contexts/auth-provider';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Home, Minus, Plus, ShoppingCart, Trash2, User, LogOut, UserCircle, Bike, Store, X, Pencil, Landmark, DollarSign, Check, Receipt } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';

const menuData = {
    pizzas: [
      { id: 'p1', name: 'Pizza Margherita', description: 'Classic pizza with tomato, mozzarella, and basil.', price: 12.50, image: 'https://placehold.co/300x200.png', hint: 'pizza margherita' },
      { id: 'p2', name: 'Pizza Pepperoni', description: 'The all-time favorite, covered in pepperoni.', price: 14.00, image: 'https://placehold.co/300x200.png', hint: 'pepperoni pizza' },
      { id: 'p3', name: 'Genius Special', description: 'A secret recipe that will blow your mind.', price: 18.00, image: 'https://placehold.co/300x200.png', hint: 'specialty pizza' },
      { id: 'p4', name: 'Veggie Supreme', description: 'Loaded with all the best vegetables.', price: 15.50, image: 'https://placehold.co/300x200.png', hint: 'vegetarian pizza' },
    ],
    snacks: [
      { id: 's1', name: 'Garlic Bread', description: 'Toasted bread with garlic butter and herbs.', price: 6.00, image: 'https://placehold.co/300x200.png', hint: 'garlic bread' },
      { id: 's2', name: 'Mozzarella Sticks', description: 'Fried cheese sticks served with marinara sauce.', price: 8.00, image: 'https://placehold.co/300x200.png', hint: 'mozzarella sticks' },
      { id: 's3', name: 'Chicken Wings', description: 'Spicy and tangy, perfect for sharing.', price: 10.00, image: 'https://placehold.co/300x200.png', hint: 'chicken wings' },
    ],
    drinks: [
      { id: 'd1', name: 'Coca-Cola', description: 'Classic soft drink.', price: 2.50, image: 'https://placehold.co/300x200.png', hint: 'soda can' },
      { id: 'd2', name: 'Fresh Lemonade', description: 'Homemade with fresh lemons.', price: 3.50, image: 'https://placehold.co/300x200.png', hint: 'lemonade glass' },
    ],
    desserts: [
      { id: 'ds1', name: 'Tiramisu', description: 'A coffee-flavored Italian dessert.', price: 7.50, image: 'https://placehold.co/300x200.png', hint: 'tiramisu slice' },
      { id: 'ds2', name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with a molten center.', price: 8.50, image: 'https://placehold.co/300x200.png', hint: 'lava cake' },
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

function CartPageContent() {
    const { language, t } = useLanguage();
    const { user } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [cart, setCart] = React.useState<CartItem[]>([]);
    const [deliveryOption, setDeliveryOption] = React.useState('pickup');
    const [paymentMethod, setPaymentMethod] = React.useState<string | null>(null);
    const [clientData, setClientData] = React.useState<ClientData | null>(null);
    const [deliveryAddress, setDeliveryAddress] = React.useState('');
    const [isEditingAddress, setIsEditingAddress] = React.useState(false);
    const [tempAddress, setTempAddress] = React.useState('');

    // This is a mock effect to populate cart. In a real app, this would come from a context or server.
    React.useEffect(() => {
        const allItems = [...menuData.pizzas, ...menuData.snacks];
        const mockCart = allItems.slice(0, 3).map(item => ({...item, quantity: Math.floor(Math.random() * 2) + 1}));
        setCart(mockCart);
    }, []);

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
          yourOrder: 'Your Order',
          emptyCart: 'Your cart is empty.',
          continueShopping: 'Continue Shopping',
          subtotal: 'Subtotal',
          tax: 'Tax (5%)',
          total: 'Total',
          confirmOrder: 'Confirm Order',
          orderSummary: 'Order Summary',
          deliveryMethod: 'Delivery Method',
          pickup: 'Store Pickup',
          delivery: 'Home Delivery',
          currentAddress: 'Current address:',
          changeAddress: 'Change',
          enterAddress: 'Enter your delivery address',
          saveAddress: 'Save Address',
          paymentMethod: 'Payment Method',
          cash: 'Cash',
          transfer: 'Bank Transfer',
          cbu: 'CBU',
          alias: 'Alias',
          attach_proof: 'Attach proof of payment',
          orderPlaced: 'Order Placed!',
          orderPlacedDesc: 'Your order has been successfully placed.',
          clearCart: 'Clear Cart',
          clearCartConfirmationTitle: 'Are you sure?',
          clearCartConfirmationDescription: 'This action will remove all items from your cart.',
        },
        es: {
            yourOrder: 'Tu Pedido',
            emptyCart: 'Tu carrito está vacío.',
            continueShopping: 'Seguir Comprando',
            subtotal: 'Subtotal',
            impuestos: 'Impuestos (5%)',
            total: 'Total',
            confirmOrder: 'Confirmar Pedido',
            orderSummary: 'Resumen del Pedido',
            deliveryMethod: 'Método de Entrega',
            pickup: 'Retiro en local',
            delivery: 'Envío a domicilio',
            currentAddress: 'Dirección actual:',
            changeAddress: 'Cambiar',
            enterAddress: 'Ingresa tu dirección de envío',
            saveAddress: 'Guardar Dirección',
            paymentMethod: 'Método de Pago',
            cash: 'Efectivo',
            transfer: 'Transferencia Bancaria',
            cbu: 'CBU',
            alias: 'Alias',
            attach_proof: 'Adjuntar comprobante',
            orderPlaced: '¡Pedido Realizado!',
            orderPlacedDesc: 'Tu pedido ha sido realizado con éxito.',
            clearCart: 'Vaciar Carrito',
            clearCartConfirmationTitle: '¿Estás seguro?',
            clearCartConfirmationDescription: 'Esta acción eliminará todos los productos de tu carrito.',
        }
      };
    
    const T = language === 'en' ? translations.en : translations.es;

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

    const handleConfirmOrder = () => {
        toast({
            title: T.orderPlaced,
            description: T.orderPlacedDesc,
        });
        setCart([]);
        router.push('/profile');
    }

    const isOrderReady = (deliveryOption === 'pickup' || (deliveryOption === 'delivery' && deliveryAddress.trim())) && paymentMethod;

    const handleEditAddress = () => {
        setTempAddress(deliveryAddress);
        setIsEditingAddress(true);
    }
    
    const handleSaveAddress = () => {
        setDeliveryAddress(tempAddress);
        setIsEditingAddress(false);
    }

    const handleCancelEditAddress = () => {
        setIsEditingAddress(false);
    }

    return (
        <div className="flex flex-col min-h-screen bg-secondary">
             <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
                <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                <Link href="/" className="flex items-center gap-2">
                    <Logo className="size-8 text-primary" />
                    <span className="text-xl font-bold font-headline text-primary">Pizzeria Los Genios</span>
                </Link>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/order">
                            <ShoppingCart />
                            <span className="sr-only">Order Menu</span>
                        </Link>
                    </Button>
                    <LanguageSwitcher />
                    <ThemeToggle />
                </div>
                </div>
            </header>

            <main className="container mx-auto flex-1 px-4 md:px-6 py-8">
                {cart.length === 0 ? (
                     <div className="flex flex-col h-[60vh] items-center justify-center text-center">
                        <ShoppingCart className="h-24 w-24 text-muted-foreground" />
                        <h2 className="mt-6 text-2xl font-semibold">{T.emptyCart}</h2>
                        <p className="mt-2 text-muted-foreground">Parece que no has añadido nada a tu carrito todavía.</p>
                        <Button asChild className="mt-6">
                            <Link href="/order">{T.continueShopping}</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-3 gap-8 items-start">
                        <div className="md:col-span-2">
                             <Card>
                                <CardHeader className="flex flex-row justify-between items-center">
                                    <CardTitle>{T.yourOrder}</CardTitle>
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="text-destructive hover:text-destructive hover:border-destructive/80">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                {T.clearCart}
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
                                </CardHeader>
                                <CardContent>
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
                                </CardContent>
                            </Card>
                        </div>

                        <div className="md:col-span-1 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{T.orderSummary}</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div>
                                        <Label className='font-semibold'>{T.deliveryMethod}</Label>
                                        <RadioGroup defaultValue="pickup" onValueChange={setDeliveryOption} className='mt-2 space-y-2'>
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
                                                        <div className="flex items-center gap-2">
                                                            <Input 
                                                                value={tempAddress}
                                                                onChange={(e) => setTempAddress(e.target.value)}
                                                                placeholder={T.enterAddress}
                                                                className="w-full"
                                                                autoFocus
                                                            />
                                                            <Button variant="ghost" size="icon" onClick={handleSaveAddress}>
                                                                <Check className="h-4 w-4 text-green-500" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" onClick={handleCancelEditAddress}>
                                                                <X className="h-4 w-4 text-red-500" />
                                                            </Button>
                                                        </div>
                                                    ) : (
                                                        <div className='flex items-center w-full'>
                                                            <p className='text-sm text-muted-foreground flex-1'>
                                                                {T.currentAddress} <span className='font-medium text-foreground'>{deliveryAddress}</span>
                                                            </p>
                                                            <Button variant="link" size="sm" onClick={handleEditAddress}>
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
                                        <Label className='font-semibold'>{T.paymentMethod}</Label>
                                        <RadioGroup onValueChange={setPaymentMethod} className='mt-2 space-y-2'>
                                            <Label htmlFor="cash" className="flex items-center gap-4 p-3 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                                                <DollarSign className='text-primary' />
                                                <p className='flex-1 font-medium'>{T.cash}</p>
                                                <RadioGroupItem value="cash" id="cash" />
                                            </Label>
                                            <Label htmlFor="transfer" className="flex flex-col items-start gap-3 p-3 border rounded-md cursor-pointer hover:bg-accent has-[:checked]:bg-accent has-[:checked]:border-primary">
                                                <div className='flex items-center w-full'>
                                                    <Landmark className='text-primary mr-4' />
                                                    <p className='flex-1 font-medium'>{T.transfer}</p>
                                                    <RadioGroupItem value="transfer" id="transfer" />
                                                </div>
                                                {paymentMethod === 'transfer' && (
                                                    <div className="w-full pl-8 space-y-4 pt-2">
                                                        <Separator />
                                                        <div>
                                                            <p className="text-sm font-medium">{T.cbu}: <span className="font-mono text-muted-foreground">0000003100055555555555</span></p>
                                                            <p className="text-sm font-medium">{T.alias}: <span className="font-mono text-muted-foreground">pizzeria.los.genios</span></p>
                                                        </div>
                                                        <div className="grid w-full max-w-sm items-center gap-1.5">
                                                            <Label htmlFor="proof-of-payment">{T.attach_proof}</Label>
                                                            <Input id="proof-of-payment" type="file" />
                                                        </div>
                                                    </div>
                                                )}
                                            </Label>
                                        </RadioGroup>
                                    </div>

                                </CardContent>
                                <CardFooter className="flex-col items-stretch space-y-4">
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
                                    <Button size="lg" className="w-full mt-4" onClick={handleConfirmOrder} disabled={!isOrderReady}>
                                        <Receipt className="mr-2 h-5 w-5" />
                                        {T.confirmOrder}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>

                    </div>
                )}
            </main>
        </div>
    )
}

export default function CartPage() {
    return (
        <ProtectedRoute>
            <CartPageContent />
        </ProtectedRoute>
    )
}
