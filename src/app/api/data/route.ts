import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // In a real scenario, this would fetch data from a backend like Google App Script.
  // Example:
  // const res = await fetch('https://script.google.com/macros/s/.../exec?action=getDashboardData');
  // const data = await res.json();
  // return NextResponse.json(data);

  // For demonstration, we return dummy data after a short delay.
  const dummyData = {
    orders: 125,
    revenue: 5678.90,
    newCustomers: 23,
    avgOrderValue: 45.43
  };

  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

  return NextResponse.json(dummyData);
}
