'use client';

import * as React from 'react';
import {
  ChefHat,
  Users,
  UserCog,
  ShoppingBasket,
  CalendarCheck,
  UtensilsCrossed,
  ClipboardList,
  Bot,
  Settings,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/language-provider';
import { Separator } from '@/components/ui/separator';
import AppHeader from '@/components/header';
import DashboardPage from '@/components/dashboard-page';
import { Logo } from '@/components/icons';

export default function Home() {
  const { t } = useLanguage();

  const menuItems = [
    { icon: LayoutDashboard, label: t('dashboard'), href: '#' },
    { icon: Users, label: t('clients'), href: '#' },
    { icon: UserCog, label: t('users'), href: '#' },
    { icon: ShoppingBasket, label: t('products'), href: '#' },
    { icon: CalendarCheck, label: t('reservations'), href: '#' },
    { icon: UtensilsCrossed, label: t('tables'), href: '#' },
    { icon: ClipboardList, label: t('orders'), href: '#' },
    { icon: Bot, label: t('bot_management'), href: '#' },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="size-8 text-primary" />
            <h1 className="text-xl font-headline font-semibold text-primary">
              {t('app_name')}
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {menuItems.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  href={item.href}
                  isActive={index === 0}
                  asChild
                  tooltip={{
                    children: item.label,
                  }}
                >
                  <a href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Separator className="mb-2" />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip={{ children: t('settings') }}>
                <Settings />
                <span>{t('settings')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="#" tooltip={{ children: t('logout') }}>
                <LogOut />
                <span>{t('logout')}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <Separator className="my-2" />
          <div className="flex items-center gap-3 px-2 py-1">
            <Avatar className="size-9">
              <AvatarImage src="https://placehold.co/100x100.png" alt="Admin" data-ai-hint="user avatar" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="font-semibold text-sm text-sidebar-foreground">
                Admin User
              </span>
              <span className="text-xs text-sidebar-foreground/70">
                admin@sabores.com
              </span>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <AppHeader />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            <DashboardPage />
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
