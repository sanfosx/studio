'use client';

import * as React from 'react';
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Rectangle } from 'recharts';
import { useLanguage } from '@/contexts/language-provider';
import { Skeleton } from './ui/skeleton';

const chartData = [
  { time: '08:00', sales: 186 },
  { time: '09:00', sales: 305 },
  { time: '10:00', sales: 237 },
  { time: '11:00', sales: 273 },
  { time: '12:00', sales: 409 },
  { time: '13:00', sales: 502 },
  { time: '14:00', sales: 450 },
  { time: '15:00', sales: 380 },
  { time: '16:00', sales: 320 },
  { time: '17:00', sales: 350 },
  { time: '18:00', sales: 480 },
  { time: '19:00', sales: 600 },
  { time: '20:00', sales: 550 },
  { time: '21:00', sales: 700 },
];

const chartConfig = {
  sales: {
    label: 'Sales',
    color: 'hsl(var(--primary))',
  },
};

type Stats = {
  totalRevenue: number;
  subscriptions: number;
  sales: number;
  activeNow: number;
};

export default function DashboardPage() {
  const { t } = useLanguage();
  const [stats, setStats] = React.useState<Stats | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/data')
      .then((res) => res.json())
      .then((data) => {
        setStats({
          totalRevenue: data.revenue,
          subscriptions: data.newCustomers,
          sales: data.orders,
          activeNow: data.avgOrderValue, // Using avgOrderValue for demo
        });
        setLoading(false);
      });
  }, []);

  const statCards = [
    {
      title: t('total_revenue'),
      value: stats?.totalRevenue,
      icon: DollarSign,
      description: '+20.1% ' + t('from_yesterday'),
      format: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: t('subscriptions'),
      value: stats?.subscriptions,
      icon: Users,
      description: '+180.1% ' + t('this_month'),
      format: (value: number) => `+${value}`,
    },
    {
      title: t('sales'),
      value: stats?.sales,
      icon: CreditCard,
      description: '+12% ' + t('this_month'),
      format: (value: number) => `+${value}`,
    },
    {
      title: t('active_now'),
      value: stats?.activeNow,
      icon: Activity,
      description: '+573 ' + t('on_the_platform'),
      format: (value: number) => `${Math.round(value)}`,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">{t('today_s_dashboard')}</h1>
        <p className="text-muted-foreground">{t('overview')}</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-3/4" />
              ) : (
                <div className="text-2xl font-bold">
                  {card.value !== undefined ? card.format(card.value) : '...'}
                </div>
              )}
              <p className="text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className='font-headline'>{t('sales_by_hour')}</CardTitle>
          <CardDescription>{t('overview')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="sales" fill="var(--color-sales)" radius={8} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
